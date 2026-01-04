// ==UserScript==
// @name         THISVID.COM_VIDEO DOWNLOADER
// @namespace    http://tampermonkey.net/
// @version      1.7.2
// @description  Inserta el video en la posición original, eliminando kt_player y la imagen
// @author       Gemini the AI of google
// @match        *://thisvid.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511724/THISVIDCOM_VIDEO%20DOWNLOADER.user.js
// @updateURL https://update.greasyfork.org/scripts/511724/THISVIDCOM_VIDEO%20DOWNLOADER.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Función para extraer la URL del video e insertarlo en la página
    function insertVideo() {
        let videoElement = document.querySelector('video.fp-engine');
        if (videoElement) {
            let videoUrl = videoElement.src;
            console.log("URL del video:", videoUrl);

            // Buscamos el elemento fp-player que contiene el video original
            let fpPlayer = document.querySelector('.fp-player');

            // Eliminamos el elemento fp-player
            if (fpPlayer) {
                fpPlayer.remove();
            } else {
                console.log("No se encontró el elemento con clase 'fp-player'");
                return; // Salimos de la función si no se encuentra el elemento
            }

            // Buscamos y eliminamos el elemento kt_player
            let ktPlayer = document.getElementById('kt_player');
            if (ktPlayer) {
                ktPlayer.remove();
            } else {
                console.log("No se encontró el elemento con ID 'kt_player'");
            }

            // Buscamos y eliminamos el elemento img
            let imgElement = document.querySelector('.video-holder img');
            if (imgElement) {
                imgElement.remove();
            } else {
                console.log("No se encontró el elemento img");
            }

            // Creamos un nuevo elemento de video
            let newVideoElement = document.createElement('video');
            newVideoElement.src = videoUrl;
            newVideoElement.controls = true;
            newVideoElement.width = 640; // Puedes ajustar el ancho según tus necesidades
            newVideoElement.height = 360; // Puedes ajustar la altura según tus necesidades

            // Buscamos el elemento donde queremos insertar el video (video-holder)
            let videoHolder = document.querySelector('.video-holder');

            // Insertamos el nuevo elemento de video en el video-holder
            if (videoHolder) {
                videoHolder.appendChild(newVideoElement);
                // Añadimos la línea para reproducir el video automáticamente
                newVideoElement.play();
            } else {
                console.log("No se encontró el elemento con clase 'video-holder'");
                // Si no se encuentra el elemento, puedes insertarlo en otro lugar,
                // como en el body:
                // document.body.appendChild(newVideoElement);
            }

            // Detenemos el observador
            observer.disconnect();
        }
    }

    // Configuramos el MutationObserver
    let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                insertVideo();
            }
        });
    });

    // Observamos el elemento body para detectar cuando se agrega el video
    let targetNode = document.body;
    let config = { childList: true, subtree: true };
    observer.observe(targetNode, config);

})();