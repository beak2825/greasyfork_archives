// ==UserScript==
// @name Descuento 25% en Productos Miravia
// @description Aplica un descuento del 25% con máximo de 15 euros en los precios de Miravia y muestra el resultado en un popup
// @match https://www.miravia.es/*
// @grant GM_addStyle
// @version 0.0.1.20230426190443
// @namespace https://greasyfork.org/users/1064312
// @downloadURL https://update.greasyfork.org/scripts/464483/Descuento%2025%25%20en%20Productos%20Miravia.user.js
// @updateURL https://update.greasyfork.org/scripts/464483/Descuento%2025%25%20en%20Productos%20Miravia.meta.js
// ==/UserScript==

// Define la función que aplicará el descuento
function aplicarDescuento(precio) {
  // Calcula el descuento del 25%
  var descuento = precio * 0.25;
  // Aplica el máximo de 15 euros al descuento
  descuento = Math.min(descuento, 15);
  // Resta el descuento al precio original y redondea a dos decimales
  precio = (precio - descuento).toFixed(2);
  // Devuelve el precio con el descuento aplicado
  return precio;
}

// Busca el elemento con el precio y aplica el descuento
var precioElement = document.querySelector('#module_item-gallery-new .divider + div > div:first-child > div:first-child > div:first-child');
var precio = precioElement.textContent;
precio = precio.replace(",", ".");
precio = parseFloat(precio);
var precioDescuento = aplicarDescuento(precio);
var precioFinal = precioDescuento.replace(".", ",");

// Crea un elemento de popup con el precio con descuento
var popup = document.createElement('div');
popup.innerHTML = '✅Precio con descuento: <strong>' + precioFinal + '€</strong> (' + precio + '€)';
popup.style.cssText = 'position: fixed; z-index: 9999; top: 10px; right: 10px; padding: 10px; background-color: white; border: 1px solid black; box-shadow: 2px 2px 5px rgba(0,0,0,0.5);';
popup.style.position = "fixed";
popup.style.top = "5%";
popup.style.left = "50%";
popup.style.transform = "translate(-50%, -50%)";
popup.style.background = "white";
popup.style.padding = "20px";
popup.style.borderRadius = "10px";
popup.style.fontSize = "40px"; // Ajusta el tamaño de fuente aquí
popup.style.zIndex = "999999";
// Agrega el popup al cuerpo del documento
document.body.appendChild(popup);

 // Verifica si el precio original es inferior a 10 euros y muestra un mensaje adicional debajo del popup si es así
 if (precio < 10) {
     console.log("hola");
    var mensajeEnvioGratis = document.createElement("div");
    mensajeEnvioGratis.innerHTML = "⚠️El precio original es inferior a 10€ y no aplica envío gratis ⚠️";
    mensajeEnvioGratis.style.position = "fixed";
    mensajeEnvioGratis.style.top = "20%";
    mensajeEnvioGratis.style.left = "50%";
    mensajeEnvioGratis.style.transform = "translate(-50%, -50%)";
    mensajeEnvioGratis.style.background = "red";
    mensajeEnvioGratis.style.padding = "20px";
    mensajeEnvioGratis.style.borderRadius = "10px";
    mensajeEnvioGratis.style.fontSize = "40px"; // Ajusta el tamaño de fuente aquí
    mensajeEnvioGratis.style.zIndex = "999999";
    document.body.appendChild(mensajeEnvioGratis);
 }