// ==UserScript==
// @name         Obtener llave, Contar Clases M y Descifrar Mensajes OJO
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Obtener llave mediante las mayúsculas, contar clases M y descifrar mensajes
// @author       Sebastián González
// @match        https://cripto.tiiny.site/
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js#sha512-a+SUDuwNzXDvz4XrIcXHuCf089/iJAoN4lmrXJg18XnduKK6YlDHNRalv4yd1N40OKI80tFidF+rqTFKGPoWFQ==
// @downloadURL https://update.greasyfork.org/scripts/479517/Obtener%20llave%2C%20Contar%20Clases%20M%20y%20Descifrar%20Mensajes%20OJO.user.js
// @updateURL https://update.greasyfork.org/scripts/479517/Obtener%20llave%2C%20Contar%20Clases%20M%20y%20Descifrar%20Mensajes%20OJO.meta.js
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
        console.log('IDs de los mensajes cifrados:', idsMensajes);

        // Llamar a la función para descifrar mensajes
        descifrarMensajes(idsMensajes);
    }

    // Función para descifrar mensajes
    function descifrarMensajes(ids) {
        // Obtener la llave
        const llave = obtenerLlave();

        if (!llave) {
            console.log('No se puede descifrar sin la llave.');
            return;
        }

        ids.forEach((id) => {
            // Decodificar el mensaje en base64
            const mensajeCifradoBase64 = id;
            const mensajeCifrado = atob(mensajeCifradoBase64);

            // Convertir el mensaje cifrado a WordArray
            const ciphertext = CryptoJS.enc.Base64.parse(mensajeCifrado);

            // Clave para descifrar
            const key = CryptoJS.enc.Utf8.parse(llave);

            // Realizar descifrado
            const decrypted = CryptoJS.TripleDES.decrypt({ ciphertext: ciphertext }, key, { mode: CryptoJS.mode.ECB });

            // Convertir el resultado a texto plano
            const mensajeDescifrado = decrypted.toString(CryptoJS.enc.Utf8);

            console.log('ID:', id, 'Mensaje descifrado:', mensajeDescifrado);

            // Agregar llamada a la función para mostrar mensajes descifrados
            mostrarMensajesDescifrados(mensajeDescifrado);
        });
    }

    // Función para mostrar mensajes descifrados
    function mostrarMensajesDescifrados(mensajeDescifrado) {
        console.log('Mensaje descifrado:', mensajeDescifrado);
    }

    // Llamar a ambas funciones al cargar la página
    window.addEventListener('load', () => {
        obtenerLlave();
        contarMcifrados();
    });

})();

