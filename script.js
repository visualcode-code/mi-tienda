let pedidos =
JSON.parse(localStorage.getltem("pedidos"))||{};
const listapedidos =
document.getElementById("lista-pedidos");
const productos = [
  { nombre: "Colchón Premium", precio: 120000, stock: 3, imagen: "https://via.placeholder.com/300" },
  { nombre: "Colchón Ortopédico", precio: 98000, stock: 0, imagen: "https://via.placeholder.com/300" },
  { nombre: "Colchón Suave", precio: 110000, stock: 5, imagen: "https://via.placeholder.com/300" }
];

const contenedor = document.getElementById("productos");
const listaCarrito = document.getElementById("lista-carrito");
const totalTexto = document.getElementById("total");

let carrito = [];

function dibujarProductos() {
  contenedor.innerHTML = "";

  productos.forEach((p, index) => {
    const div = document.createElement("div");
    div.className = "producto";

    div.innerHTML = `
      <img src="${p.imagen}">
      <h2>${p.nombre}</h2>
      <p class="precio">$${p.precio.toLocaleString()}</p>
      <p style="color:${p.stock > 0 ? "green" : "red"}">
        ${p.stock > 0 ? "Stock disponible" : "Sin stock"}
      </p>
      <button ${p.stock === 0 ? "disabled" : ""} onclick="agregarCarrito(${index})">
        Comprar
      </button>
    `;

    contenedor.appendChild(div);
  });
}

function agregarCarrito(index) {
  if (productos[index].stock > 0) {
    carrito.push(productos[index]);
    productos[index].stock--;
    dibujarProductos();
    dibujarCarrito();
  }
}

function dibujarCarrito() {
  listaCarrito.innerHTML = "";
  let total = 0;

  carrito.forEach(p => {
    const li = document.createElement("li");
    li.innerText = `${p.nombre} - $${p.precio.toLocaleString()}`;
    listaCarrito.appendChild(li);
    total += p.precio;
  });

  totalTexto.innerText = "Total: $" + total.toLocaleString();
}

dibujarProductos();
function vaciarCarrito() {
  carrito = [];
  dibujarCarrito();
}function finalizarCompra() {
  if (carrito.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  const nombre = document.getElementById("nombre").value;
  const email = document.getElementById("email").value;
  const telefono = document.getElementById("telefono").value;

  if (!nombre || !email || !telefono) {
    alert("Por favor completá todos los datos");
    return;
  }

  let total = carrito.reduce((suma, p) => suma + p.precio, 0);

  const pedido = {
    cliente: nombre,
    email,
    telefono,
    productos: [...carrito],
    total,
    fecha: new Date().toLocaleString()
  };

  pedidos.push(pedido);
  localStorage.setItem("pedidos", JSON.stringify(pedidos));

  enviarWhatsApp(pedido);

  carrito = [];
  dibujarCarrito();
  mostrarPedidos();
}function enviarWhatsApp(pedido) {
  let mensaje = `📦 Nuevo pedido%0A%0A`;

  pedido.productos.forEach(p => {
    mensaje += `• ${p.nombre} - $${p.precio.toLocaleString()}%0A`;
  });

  mensaje += `%0A👤 Cliente: ${pedido.cliente}`;
  mensaje += `%0A📧 Email: ${pedido.email}`;
  mensaje += `%0A📞 Teléfono: ${pedido.telefono}`;
  mensaje += `%0A💰 Total: $${pedido.total.toLocaleString()}`;

  const numeroWhatsApp = "5491125312740"; // TU NÚMERO
  window.open(`https://wa.me/${numeroWhatsApp}?text=${mensaje}`, "_blank");
}

function mostrarPedidos() {
  listaPedidos.innerHTML = "";

  pedidos.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${p.cliente}</strong> - $${p.total.toLocaleString()}<br>
      <small>${p.fecha}</small>
    `;
    listaPedidos.appendChild(li);
  });
}

mostrarPedidos();
function exportarExcel() {
  if (pedidos.length === 0) {
    alert("No hay pedidos para exportar");
    return;
  }

  let csv = "Cliente,Email,Teléfono,Productos,Total,Fecha\n";

  pedidos.forEach(p => {
    const productos = p.productos.map(prod => prod.nombre).join(" | ");
    csv += `"${p.cliente}","${p.email}","${p.telefono}","${productos}",${p.total},"${p.fecha}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "pedidos.csv";
  link.click();
}function loginAdmin() {
  const password = prompt("Ingrese la contraseña de administrador");

  if (password === "admin123") {
    document.getElementById("panelAdmin").style.display = "block";
    alert("Acceso concedido");
  } else {
    alert("Contraseña incorrecta");
  }
}