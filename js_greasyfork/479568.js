// ==UserScript==
// @name         CONFIO 2
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Obtener llave mediante las mayúsculas, contar clases M y descifrar mensajes
// @author       Sebastián González
// @match        https://cripto.tiiny.site/
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js#sha512-a+SUDuwNzXDvz4XrIcXHuCf089/iJAoN4lmrXJg18XnduKK6YlDHNRalv4yd1N40OKI80tFidF+rqTFKGPoWFQ==
// @downloadURL https://update.greasyfork.org/scripts/479568/CONFIO%202.user.js
// @updateURL https://update.greasyfork.org/scripts/479568/CONFIO%202.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Función para obtener llave
    function obtenerLlave() {
        const contenido = document.body.innerText;
        const regex = /(?:^|[.!?]\s)([A-ZÁÉÍÓÚÑ])/g;
        let matches;
        const mayusculasEncontradas = [];

        while ((matches = regex.exec(contenido)) !== null) {
            mayusculasEncontradas.push(matches[1]);
        }

        if (mayusculasEncontradas.length > 0) {
            const mayusculasUnicas = mayusculasEncontradas.join('');
            console.log('La llave es:', mayusculasUnicas);
            return mayusculasUnicas;
        } else {
            console.log('No se encontró la llave.');
            return null;
        }
    }

    // Función para contar mensajes cifrados y guardar los IDs
    function contarMcifrados() {
        const divsConClasesM = document.querySelectorAll('div[class^="M"]');
        const cantidadDivs = divsConClasesM.length;
        const idsMensajes = [];

        divsConClasesM.forEach((div) => {
            const id = div.id;
            idsMensajes.push(id);
        });

        console.log(`Los mensajes cifrados son: ${cantidadDivs}`);
        //console.log('IDs de los mensajes cifrados:', idsMensajes);

        // Llamar a la función para descifrar mensajes
        const llave = obtenerLlave();
        if (llave) {
            const mensajesDescifrados = desencriptarMatriz(idsMensajes, llave);

            // Imprimir todos los valores de los dos arrays
            for (let i = 0; i < Math.min(idsMensajes.length, mensajesDescifrados.length); i++) {
                console.log(`${idsMensajes[i]} ${mensajesDescifrados[i]}`);
            }
        }
    }

    // Función para desencriptar una matriz de valores en base64 utilizando 3DES
    function desencriptarMatriz(matrizEncriptada, clave) {
        return matrizEncriptada.map(function(valorEnBase64) {
            var valorDecodificado = CryptoJS.enc.Base64.parse(valorEnBase64);
            var key = CryptoJS.enc.Utf8.parse(clave);
            var decrypted = CryptoJS.TripleDES.decrypt({
                ciphertext: valorDecodificado
            }, key, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });
            return CryptoJS.enc.Utf8.stringify(decrypted);
        });
    }

    // Llamar a ambas funciones al cargar la página
    window.addEventListener('load', () => {
        contarMcifrados();
    });

})();
