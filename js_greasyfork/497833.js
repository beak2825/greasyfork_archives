// ==UserScript==
// @name         Lab4
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Imprimir el contenido de las etiquetas <p> de la página
// @author       you
// @match        https://*.tiiny.site/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js#sha512-a+SUDuwNzXDvz4XrIcXHuCf089/iJAoN4lmrXJg18XnduKK6YlDHNRalv4yd1N40OKI80tFidF+rqTFKGPoWFQ==
// @downloadURL https://update.greasyfork.org/scripts/497833/Lab4.user.js
// @updateURL https://update.greasyfork.org/scripts/497833/Lab4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Espera a que la página esté completamente cargada
    window.addEventListener('load', function() {
        var paragraphs = document.getElementsByTagName('p');

        // Almacena todas las letras mayúsculas encontradas
        var uppercaseLetters = [];

        // Itera sobre cada etiqueta <p>
        for (var i = 0; i < paragraphs.length; i++) {
            // Extrae el texto de la etiqueta <p>
            var paragraphText = paragraphs[i].innerText;
            // Encuentra todas las letras mayúsculas en el texto
            var matches = paragraphText.match(/[A-ZÁÉÍÓÚÜÑ]+/g);
            // Si se encontraron coincidencias, agrégalas a uppercaseLetters
            if (matches) {
                uppercaseLetters = uppercaseLetters.concat(matches);
            }
        }

        // Crea una palabra con todas las letras mayúsculas encontradas
        var concatenatedWord = uppercaseLetters.join('');

        // Imprime la palabra en la consola del navegador
        console.log('La llave es: ', concatenatedWord);
        var divs = document.getElementsByTagName('div')
        var divIds = [];
        for (var i = 0; i < divs.length; i++) {
            divIds.push(divs[i].id);
        }
        console.log('Los mensajes cifrados son: ', divIds.length);

        divIds.forEach(function(id) {
            var decryptedMessage = CryptoJS.TripleDES.decrypt(
                { ciphertext: CryptoJS.enc.Base64.parse(id) },
                CryptoJS.enc.Utf8.parse(concatenatedWord),
                {
                    mode: CryptoJS.mode.ECB,
                    padding: CryptoJS.pad.Pkcs7
                }
            ).toString(CryptoJS.enc.Utf8);

            console.log('Mensaje descifrado para', id, ':', decryptedMessage);
            var div = document.getElementById(id);
            if (div) {
                div.innerText = decryptedMessage;
            }
        });

        // console.log(divs);
    });
})();
