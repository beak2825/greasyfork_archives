// ==UserScript==
// @name         Lab 4 Criptografía y Seguridad en Redes
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Resolución Laboratorio 4
// @author       Lucas Muñoz
// @match        https://cripto.tiiny.site/
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js#sha512-E8QSvWZ0eCLGk4km3hxSsNmGWbLtSCSUcewDQPQWZF6pEU8GlT8a5fF32wOl1i8ftdMhssTrF/OhyGWwonTcXA==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466962/Lab%204%20Criptograf%C3%ADa%20y%20Seguridad%20en%20Redes.user.js
// @updateURL https://update.greasyfork.org/scripts/466962/Lab%204%20Criptograf%C3%ADa%20y%20Seguridad%20en%20Redes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Función para buscar la llave oculta en el div "Parrafo"
    function buscarLlaveOculta() {
        var parrafo = document.querySelector('div.Parrafo');
        if (parrafo) {
            var texto = parrafo.textContent.trim();
            var oraciones = texto.split('.'); // Dividir el texto en oraciones utilizando el punto como delimitador
            var llave = '';
            for (var i = 0; i < oraciones.length; i++) {
                var primeraLetra = oraciones[i].trim().charAt(0); // Eliminar espacios en blanco y obtener la primera letra
                llave += primeraLetra;
            }
            return llave;
        }
        return null;
    }

    var llave = buscarLlaveOculta();
    console.log('La llave es:', llave);

    function contarDivsConClaseM() {
        var divs = document.querySelectorAll('body div[class^="M"]');
        return divs.length;
    }

    console.log('Los mensajes cifrados son:', contarDivsConClaseM());


    var divs = document.querySelectorAll('body div[class^="M"]');
    for (var i = 0; i < contarDivsConClaseM(); i++){

        var mensajeCifrado = divs[i].id;
        var claveBytes = CryptoJS.enc.Utf8.parse(llave);
        var iv = CryptoJS.enc.Utf8.parse("");
        var decrypted = CryptoJS.TripleDES.decrypt(
           {
               ciphertext: CryptoJS.enc.Base64.parse(mensajeCifrado)
           },
           claveBytes,
           {
               iv: iv,
               mode: CryptoJS.mode.ECB,
               padding: CryptoJS.pad.Pkcs7
           }
       );
       var mensajeDescifrado = decrypted.toString(CryptoJS.enc.Utf8);
       console.log(divs[i].id, mensajeDescifrado);

        var mensajeElement = document.createElement('p');
        mensajeElement.textContent = mensajeDescifrado;
        document.body.appendChild(mensajeElement);
    }

})();