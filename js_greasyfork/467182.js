// ==UserScript==
// @name         CRIPTO LAB 4
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       ESCM
// @match        https://cripto.tiiny.site/
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.0/jquery.min.js#sha512-3gJwYpMe3QewGELv8k/BX9vcqhryRdzRMxVfq6ngyWXwo03GFEzjsUm8Q7RZcHPHksttq7/GFoxjCVUjkjvPdw==
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js#sha512-E8QSvWZ0eCLGk4km3hxSsNmGWbLtSCSUcewDQPQWZF6pEU8GlT8a5fF32wOl1i8ftdMhssTrF/OhyGWwonTcXA==
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiiny.site
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467182/CRIPTO%20LAB%204.user.js
// @updateURL https://update.greasyfork.org/scripts/467182/CRIPTO%20LAB%204.meta.js
// ==/UserScript==

var $ = jQuery;

$(document).ready(core);

function getKey(className) {
 var p = document.getElementsByClassName(className)[0] != undefined ? document.getElementsByClassName(className)[0].textContent
         : document.getElementsByTagName('p')[0];

 var arr = p.split(/\r?\n/),
     s = "";

    arr.forEach(cur => {
     if(cur.length > 0) s += cur[0];
    });

    return s;

}

function getMC() {

 function isInt(str) {
    return /^\d+$/.test(str);
 }
 var mensajesCifrados = [],
     patronChar = 'M';

 var arrDivsMensajes = (function() {
                  var divsMensajes = [];

                  // caso en que el patron sea 'M' + numero
                  if(document.querySelectorAll("[class^=" + patronChar + "]")[0] != undefined) {
                   Array.from(document.querySelectorAll("[class^=" + patronChar + "]")).forEach(cur => {
                     if(isInt(cur.className.substring(1))) divsMensajes.push(cur);
                   });
                  }
                  else {
                   Array.from(document.getElementsByTagName('div')).forEach(cur => {
                     // en el caso de que el patronChar no sea 'M'
                     // comprobamos que el div tenga id, que su primer caracter sea una letra y que el resto sea un numero
                     if(cur.id.length > 0 && /^[a-zA-Z]+$/.test(cur.className[0]) && isInt(cur.className.substring(1))) {
                      divsMensajes.push(cur);
                     }
                   });
                  }

                  // divsMensajes es el arreglo que contiene a todos los divs de la forma:
                  // M + numero o Char + numero
                  divsMensajes.forEach((cur, i) => divsMensajes[i] = cur.id);

                  return divsMensajes;
                 })();


    return {mensajesCifrados: arrDivsMensajes, cantidadMensajesCifrados: arrDivsMensajes.length};
}

function descifrar(mensajesCifrados, key) {
    mensajesCifrados.mensajesCifrados.forEach((cur, i) => {
       var decrypted = CryptoJS.TripleDES.decrypt(cur, CryptoJS.enc.Utf8.parse(key.substr(0, 24)), {mode: CryptoJS.mode.ECB});

       // mostrar cifrado descifrado
       console.log('%c' + cur + " " + "%c" + decrypted.toString(CryptoJS.enc.Utf8), "color:lightblue; font-size: 14px", "color:red; font-size: 14px; font-family:monospace");

       // agregar msjes descifrados al documento
       var elem = $('<p id="descifrado_'+(i+1)+'">' +  decrypted.toString(CryptoJS.enc.Utf8) + '</p>');

       // algo de style
       elem.css({"margin":"0px",
                 "background-image": "linear-gradient(to right, blue, red, yellow, orange, green, pink, brown, gray, white, black, purple, lightblue)",
                 "-webkit-background-clip": "text",
                 "color": "transparent",
                 "font-size": "22px",
                 "font-family": "monospace"
                });

       $('body').append(elem);

   });
}


function core() {
 console.clear();

 var className = 'Parrafo',
     key = getKey(className);

    console.log("La llave es: %c" + key, "color:green; font-size: 14px; font-family:monospace");

 var mensajesCifrados = getMC();

   console.log('Los mensajes cifrados son: %c' + mensajesCifrados.cantidadMensajesCifrados, "color: yellow; font-size: 14px; font-family:monospace");

   descifrar(mensajesCifrados, key);

}
