// ==UserScript==
// @name         Descifrador de Mensajes
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Descifra mensajes ocultos en la página web
// @author       Raul
// @match        https://cripto.tiiny.site/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497576/Descifrador%20de%20Mensajes.user.js
// @updateURL https://update.greasyfork.org/scripts/497576/Descifrador%20de%20Mensajes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js';
    script.integrity = 'sha512-E8QSvWZ0eCLGk4km3hxSsNmGWbLtSCSUcewDQPQWZF6pEU8GlT8a5fF32wOl1i8ftdMhssTrF/OhyGWwonTcXA==';
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);

    script.onload = function() {
        // Parte 1: Obtener la llave de descifrado

        var parrafoDiv = document.querySelector('p');
        if (!parrafoDiv) return;

        var textoCompleto = parrafoDiv.innerText;
        var oraciones = textoCompleto.split('. ');
        var contraseña = "";
        for (var i = 0; i < oraciones.length; i++) {
            var primeraLetra = oraciones[i].charAt(0);
            contraseña += primeraLetra;
        }

        if (contraseña.length > 24) {
            contraseña = contraseña.substring(0, 24);
        }
        console.log("La llave es:", contraseña);


        // Parte 2: Detectar la cantidad de mensajes cifrados
        const encryptedMessages = document.querySelectorAll('div[id]'); // Selecciona todos los divs con un atributo id
        const numberOfMessages = encryptedMessages.length;
        console.log('Los mensajes cifrados son: ' + numberOfMessages);

        // Parte 3: Obtener y descifrar cada mensaje cifrado
        const parsedKey = CryptoJS.enc.Utf8.parse(contraseña);
        encryptedMessages.forEach((element, index) => {
            const encryptedText = element.id;
            try {
                const bytes = CryptoJS.TripleDES.decrypt({
                    ciphertext: CryptoJS.enc.Base64.parse(encryptedText)
                }, parsedKey, {
                    mode: CryptoJS.mode.ECB,
                    padding: CryptoJS.pad.Pkcs7
                });
                const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

                // Imprimir los mensajes en la consola
                console.log(encryptedText + ' ' + decryptedText);

                // Mostrar el mensaje descifrado en la página web
                const decryptedElement = document.createElement('p');
                decryptedElement.textContent = decryptedText;
                document.body.appendChild(decryptedElement);
            } catch (error) {
                console.error('Error al descifrar el mensaje: ', error);
            }
        });
    };
})();