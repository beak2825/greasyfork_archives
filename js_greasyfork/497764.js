// ==UserScript==
// @name         Reproducir Streams en Kick
// @namespace    http://tampermonkey.net/
// @version      2.0
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kick.com
// @description  Reproduce automáticamente streams en kick.com si están pausados.
// @author       elanis
// @match        https://kick.com/*
// @grant        none
// @license      Ns
// @downloadURL https://update.greasyfork.org/scripts/497764/Reproducir%20Streams%20en%20Kick.user.js
// @updateURL https://update.greasyfork.org/scripts/497764/Reproducir%20Streams%20en%20Kick.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Función para reproducir el stream si está pausado
    function playStream() {
        const videoElement = document.querySelector('video');

        if (videoElement) {
            if (videoElement.paused) {
                videoElement.play()
                    .then(() => console.log('Stream reproducido.'))
                    .catch(err => console.warn('Error al intentar reproducir el stream:', err));
            } else {
                console.log('El stream ya está reproduciéndose.');
            }
        } else {
            console.log('No se encontró el elemento de video.');
        }
    }

    // Ejecutar la función cuando la página está completamente cargada
    window.addEventListener('load', () => {
        setTimeout(playStream, 5000); // Ajusta el retraso si es necesario
    });

    // Observa cambios en el DOM por si el video se añade dinámicamente
    const observer = new MutationObserver(() => {
        playStream();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
