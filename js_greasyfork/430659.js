// ==UserScript==
// @name        AutoBase64Decode
// @include     https://www.programasvirtualespc.net/out/
// @include     https://www.programasvirtualespc.net/out/*
// @version      0.1
// @description  Desencripta links de programasvirtuales.net.
// @author       M4R10
// @match        none
// @grant        none
// @namespace https://greasyfork.org/users/448484
// @downloadURL https://update.greasyfork.org/scripts/430659/AutoBase64Decode.user.js
// @updateURL https://update.greasyfork.org/scripts/430659/AutoBase64Decode.meta.js
// ==/UserScript==

//se crea la función
function b64_to_utf8(str) {
  return decodeURIComponent(escape(window.atob(str)));
}

//creo la variable y le asigno la url en formato base64 como valor a dicha variable
var dale = document.URL.slice(42);

//creo una nueva variable y le asigno como valor la url ya desencriptada.
var mylink = b64_to_utf8(dale);

//muestro una ventana emergente con el mensaje deseado
alert('Tu link de descarga es: ' + mylink + ' Se abrira el link en una nueva pestaña.');

//abro una nueva pestaña con la web desencriptada.
window.open(mylink);
