// ==UserScript==
// @name         Descargar Video de Enlace Externo
// @namespace    https://gnulaseries.nu/
// @version      1.3
// @description  Detecta reproductores externos (como Vidmoly) y agrega un icono para descargar el video.
// @author       Tu Nombre
// @match        https://gnulaseries.nu/capitulo/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521515/Descargar%20Video%20de%20Enlace%20Externo.user.js
// @updateURL https://update.greasyfork.org/scripts/521515/Descargar%20Video%20de%20Enlace%20Externo.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Función para verificar si existe un iframe en la página
    function checkIframe() {
        const iframe = document.querySelector('iframe');
        if (iframe && iframe.src) {
            console.log('Iframe detectado:', iframe.src);
            // Cargar el contenido del iframe y analizarlo
            monitorIframe(iframe);
        } else {
            console.log('No se encontró ningún iframe. Reintentando...');
            setTimeout(checkIframe, 1000); // Reintenta cada segundo
        }
    }

    // Función para analizar el contenido del iframe
    function monitorIframe(iframe) {
        // Crear un observer para detectar si cambia su contenido
        const observer = new MutationObserver(() => {
            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            const video = iframeDocument.querySelector('video'); // Busca el reproductor dentro del iframe

            if (video && video.src) {
                console.log('Reproductor de video encontrado en el iframe:', video.src);
                addDownloadIcon(video);
                observer.disconnect(); // Detener la observación una vez que se encuentra el video
            }
        });

        observer.observe(iframe, { childList: true, subtree: true });
    }

    // Función para agregar el ícono de descarga
    function addDownloadIcon(videoPlayer) {
        if (document.querySelector('#download-icon')) return; // Evitar duplicados

        const downloadIcon = document.createElement('div');
        downloadIcon.id = 'download-icon';
        downloadIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="36px" height="36px">
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M5 20h14v-2H5v2zm7-18L5.33 6.03h3.34V15h2.66V6.03h3.34z"/>
            </svg>
        `;
        downloadIcon.style.position = 'fixed';
        downloadIcon.style.bottom = '20px';
        downloadIcon.style.right = '20px';
        downloadIcon.style.zIndex = '1000';
        downloadIcon.style.cursor = 'pointer';
        downloadIcon.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
        downloadIcon.style.borderRadius = '50%';
        downloadIcon.style.padding = '10px';

        downloadIcon.addEventListener('click', () => {
            const videoSrc = videoPlayer.src;
            if (videoSrc) {
                console.log('Descargando video:', videoSrc);
                const a = document.createElement('a');
                a.href = videoSrc;
                a.download = 'video.mp4';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } else {
                alert('No se encontró la fuente del video.');
            }
        });

        document.body.appendChild(downloadIcon);
    }

    // Inicia la detección del iframe
    checkIframe();
})();


