// ==UserScript==
// @name         Lab 4 Cripto
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Script Lab
// @author       Valentina Ibarra
// @match        https://cripto.tiiny.site/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiiny.site
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js#sha512-a+SUDuwNzXDvz4XrIcXHuCf089/iJAoN4lmrXJg18XnduKK6YlDHNRalv4yd1N40OKI80tFidF+rqTFKGPoWFQ==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479455/Lab%204%20Cripto.user.js
// @updateURL https://update.greasyfork.org/scripts/479455/Lab%204%20Cripto.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // PARTE 1: Obtener la llave
    function obtenerLlave(elemento) {
        var texto = elemento.innerText;
        var mayusculas = texto.replace(/[^A-Z]/g, '');
        console.log('La llave es:', mayusculas);
        return mayusculas;
    }

    // PARTE 2: Contar mensajes cifrados
    function contarMensajesCifrados() {
        var divs = document.getElementsByTagName('div');
        var count = 0;

        for (var i = 0; i < divs.length; i++) {
            if (divs[i].id) {
                count++;
            }
        }
        console.log('Los mensajes cifrados son:', count);
        return count;
    }

    // Mostrar solo el primer elemento descifrado
    /*
    function mostrarPrimerElementoDescifrado(llave) {
        var divs = document.getElementsByTagName('div');
        var clave = CryptoJS.enc.Utf8.parse(llave);

        for (var i = 0; i < divs.length; i++) {
            if (divs[i].id) {
                var mb64 = CryptoJS.enc.Base64.parse(divs[i].id);
                var descifrado = CryptoJS.TripleDES.decrypt({ ciphertext: mb64 }, clave, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7, });
                var coding = descifrado.toString(CryptoJS.enc.Utf8);

                console.log('Primer mensaje descifrado:', divs[i].id + ' = ' + coding);

                // Puedes detener el bucle después de procesar el primer elemento
                break;
            }
        }
    }
    */

    // PARTE 3: Procesar mensajes cifrados
    function procesarMensajesCifrados(llave) {
        var divs = document.getElementsByTagName('div');
        var clave = CryptoJS.enc.Utf8.parse(llave);
        for (var i = 0; i < divs.length; i++) {
            if (divs[i].id) {
                var mb64 = CryptoJS.enc.Base64.parse(divs[i].id);
                var descifrado = CryptoJS.TripleDES.decrypt({ ciphertext: mb64 }, clave, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7, });
                var coding = descifrado.toString(CryptoJS.enc.Utf8); console.log(divs[i].id + ' ' + coding);
                var nuevoDiv = document.createElement('div');
                var texto = document.createTextNode(coding);
                nuevoDiv.appendChild(texto);
                document.body.appendChild(nuevoDiv);
            }
        }
    }

    // Ejecución principal
    var miParrafo = document.querySelector('p');
    var llave = obtenerLlave(miParrafo);
    contarMensajesCifrados();
    //mostrarPrimerElementoDescifrado(llave);
    procesarMensajesCifrados(llave);

})();
