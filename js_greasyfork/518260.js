// ==UserScript==
// @name         Glambu Automation Script
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Glambu Automation Script.
// @match        https://app.glambu.com/home
// @grant        GM_xmlhttpRequest
// @connect      vivacious-freckle-judge.glitch.me
// @downloadURL https://update.greasyfork.org/scripts/518260/Glambu%20Automation%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/518260/Glambu%20Automation%20Script.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function loadExternalScript(url, username) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            headers: {
                'X-Username': username
            },
            onload: function (response) {
                if (response.status === 200) {
                    console.log('Script cargado exitosamente.');
                    eval(response.responseText);
                } else {
                    console.error('Error al cargar el script', response.statusText);
                }
            },
            onerror: function (error) {
                console.error('Error en la solicitud:', error);
            }
        });
    }

    // Función para verificar la existencia del elemento <h4>
    function waitForH4(callback, interval = 1000, timeout = 30000) {
        const startTime = Date.now();

        const checkExist = setInterval(() => {
            const h4 = document.querySelector('h4');
            if (h4) {
                clearInterval(checkExist);
                callback(h4);
            } else if (Date.now() - startTime > timeout) {
                clearInterval(checkExist);
                console.error('Tiempo de espera excedido: No se encontró el elemento <h4>.');
            }
        }, interval);
    }

    // Función que se ejecuta cuando el elemento <h4> es encontrado
    function onH4Found(h4Element) {
        // Esperar 5 segundos antes de mostrar el mensaje de confirmación
        setTimeout(() => {
            // Mostrar mensaje de confirmación utilizando el diálogo por defecto del navegador
            const userConfirmed = window.confirm('¿Deseas automatizar tus solicitudes?');

            if (userConfirmed) {
                console.log('Usuario aceptó automatizar las solicitudes.');

                const username = h4Element.textContent;
                console.log('Texto del <h4>:', username);

                loadExternalScript('https://vivacious-freckle-judge.glitch.me/script', username);
            } else {
                console.log('Usuario canceló la automatización de solicitudes.');
            }
        }, 7000); // 5000 milisegundos = 5 segundos
    }

    // Iniciar la espera del elemento <h4> al cargar la página
    waitForH4(onH4Found);

    // Mantener comentado el evento de combinación de teclas Alt + Shift + G
    /*
    document.addEventListener('keydown', function (e) {
        if (e.altKey && e.shiftKey && e.key.toLowerCase() === 'g') {
            console.log('Combinación de teclas detectada (Alt + Shift + G).');

            const firstH4 = document.querySelector('h4');
            if (firstH4) {
                const username = firstH4.textContent.trim();
                console.log('Texto del primer <h4>:', username);

                loadExternalScript('https://vivacious-freckle-judge.glitch.me/script', username);
            } else {
                console.error('No se encontró ningún elemento <h4> en la página.');
            }
        }
    });
    */
})();
