// ==UserScript==
// @name        Bypass DF
// @description Bypass para Diario Financiero, a través de DFU.owo.cl.
// @match       *://www.df.cl/noticias/*

// @version 0.0.1.20210524225622
// @namespace https://greasyfork.org/users/775826
// @downloadURL https://update.greasyfork.org/scripts/426985/Bypass%20DF.user.js
// @updateURL https://update.greasyfork.org/scripts/426985/Bypass%20DF.meta.js
// ==/UserScript==

/*--- Crea el botón y lo añade al título de la noticia
*/
var zNode       = document.createElement ('div');
zNode.innerHTML = '<button id="myButton" type="button">'
                + 'Noticia sin paywall</button>'
                ;
zNode.setAttribute ('id', 'myContainer');
document.getElementById("titulo_articulo").appendChild (zNode);

//--- Activa el boton
document.getElementById ("myButton").addEventListener (
    "click", ButtonClickAction, true
);

//--- Concatena el link de DFU.owo.cl con la URL de la noticia actual 
function ButtonClickAction (zEvent) {
    /*--- 
    */
    window.open('https://dfu.owo.cl/#' + window.location.href);
}
