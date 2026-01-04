// ==UserScript==
// @name         PROBANDO2 
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Obtener llave mediante las mayúsculas y contar clases M, Descifrar mensajes cifrados
// @author       Sebastián González
// @match        https://cripto.tiiny.site/
// @grant        unsafeWindow
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js#sha512-a+SUDuwNzXDvz4XrIcXHuCf089/iJAoN4lmrXJg18XnduKK6YlDHNRalv4yd1N40OKI80tFidF+rqTFKGPoWFQ==
// @downloadURL https://update.greasyfork.org/scripts/479563/PROBANDO2.user.js
// @updateURL https://update.greasyfork.org/scripts/479563/PROBANDO2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let mayusculasUnicas;

    // Función para obtener la llave
    function obtenerLlave() {
        const contenido = document.body.innerText;
        const regex = /(?:^|[.!?]\s)([A-ZÁÉÍÓÚÑ])/g;
        let matches;
        const mayusculasEncontradas = [];

        while ((matches = regex.exec(contenido)) !== null) {
            mayusculasEncontradas.push(matches[1]);
        }

        if (mayusculasEncontradas.length > 0) {
            mayusculasUnicas = mayusculasEncontradas.join('');
            console.log('La llave es:', mayusculasUnicas);
        } else {
            console.log('No se encontró la llave.');
        }
    }

    // Función para contar mensajes cifrados y descifrarlos
    function contarYDescifrarMensajes() {
        const divsConClasesM = document.querySelectorAll('div[class^="M"]');
        const cantidadDivs = divsConClasesM.length;

        const mensajesDescifrados = [];

        divsConClasesM.forEach((div) => {
            const mensajeCifrado = div.getAttribute('id');

            try {
                const mensajeDescifrado = CryptoJS.TripleDES.decrypt(
                    { ciphertext: CryptoJS.enc.Base64.parse(mensajeCifrado) },
                    mayusculasUnicas
                ).toString(CryptoJS.enc.Utf8);

                mensajesDescifrados.push(mensajeDescifrado);
            } catch (error) {
                console.error('Error al descifrar mensaje:', error);
            }
        });

        console.log(`Los mensajes cifrados son: ${cantidadDivs}`);
        console.log('Mensajes descifrados:', mensajesDescifrados);
    }

    // Llamar a ambas funciones al cargar la página
    window.addEventListener('load', () => {
        obtenerLlave();
        contarYDescifrarMensajes();
    });
})();
