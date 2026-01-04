// ==UserScript==
// @name         Auto-Confirmar "¿Sigues ahí?" en YouTube
// @namespace    https://youtube.com/
// @version      1.0
// @description  Detecta y cierra el mensaje de pausa automática en YouTube para continuar la reproducción del video.
// @author       ChatGPT
// @license      MIT
// @match        *://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528400/Auto-Confirmar%20%22%C2%BFSigues%20ah%C3%AD%22%20en%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/528400/Auto-Confirmar%20%22%C2%BFSigues%20ah%C3%AD%22%20en%20YouTube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function detectarYConfirmar() {
        // Buscar el botón de "Sí" o "Reanudar" cuando YouTube pausa el video automáticamente
        let botonContinuar = document.querySelector('button[aria-label="Sí"]') || document.querySelector('button[aria-label="Reanudar"]');

        if (botonContinuar) {
            console.log("Se detectó el mensaje de pausa automática. Reanudando el video...");
            botonContinuar.click();
        }
    }

    // Comprobar cada 5 segundos si aparece el mensaje de pausa automática
    setInterval(detectarYConfirmar, 5000);
})();
