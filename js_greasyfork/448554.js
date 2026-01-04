// ==UserScript==
// @name        Descargar facturas de Aquona sin cambiar a factura digital
// @description Permite descargar PDFs desde la página de Aquona y seguir recibiendo la factura en papel, ocultan el botón a propósito para forzarlo porque son unos rácanos.
// @author      Swyter
// @match       https://www.aquona-sa.es/group/aquona/mis-facturas*
// @license     CC-BY-SA 4.0
// @namespace   https://greasyfork.org/users/4813
// @version     2022.07.27
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/448554/Descargar%20facturas%20de%20Aquona%20sin%20cambiar%20a%20factura%20digital.user.js
// @updateURL https://update.greasyfork.org/scripts/448554/Descargar%20facturas%20de%20Aquona%20sin%20cambiar%20a%20factura%20digital.meta.js
// ==/UserScript==

var boton_factura_papel   = document.querySelector("div.descargar-factura#descargar-factura-papel"  ); /* swy: este es de mentira y redirige a su chisme */
var boton_factura_digital = document.querySelector("div.descargar-factura#descargar-factura-digital"); /* swy: este está oculto pero sí funciona */

/* swy: ocultamos el falso y mostramos el bueno, así, bien intercambiados */
if (boton_factura_papel)
    boton_factura_papel.style = "display: none;";

if (boton_factura_digital)
{
    boton_factura_digital.style = "";
    boton_factura_digital.id += "__";

    /* swy: cambiamos la etiqueta si es posible para que quede claro que funciona;
            «Descarga factura PDF» -> «Descarga factura PDF de verdad» */
    var enlace_con_texto = boton_factura_digital.querySelector("a");

    if (enlace_con_texto)
        enlace_con_texto.textContent += " de verdad";
}

console.log("[swy] botones cambiados");