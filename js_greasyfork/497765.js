// ==UserScript==
// @name         Desmutear Streams en Kick
// @namespace    http://tampermonkey.net/
// @version      2.0
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kick.com
// @description  Desmutea automáticamente streams en kick.com al cargar la página.
// @author       elanis
// @match        https://kick.com/*
// @grant        none
// @license      Ns
// @downloadURL https://update.greasyfork.org/scripts/497765/Desmutear%20Streams%20en%20Kick.user.js
// @updateURL https://update.greasyfork.org/scripts/497765/Desmutear%20Streams%20en%20Kick.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Función para desmutear el stream
    function unmuteStream() {
        const videoElement = document.querySelector('video');

        if (videoElement) {
            if (videoElement.muted) {
                videoElement.muted = false;
                console.log('Stream desmuteado.');
            } else {
                console.log('El stream ya está desmuteado.');
            }
        } else {
            console.log('No se encontró el elemento de video.');
        }
    }

    // Ejecuta la función cuando la página está completamente cargada
    window.addEventListener('load', () => {
        setTimeout(unmuteStream, 5000); // Ajusta el retraso si es necesario
    });

    // Observa cambios en el DOM por si el video se añade dinámicamente
    const observer = new MutationObserver(() => {
        unmuteStream();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
