// ==UserScript==
// @name         YouTube Button to YTMP3
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Añade un botón al lado del título de YouTube para convertir a mp3 con ytmp3.la y descarga automáticamente el archivo en un popup, sugiriendo al usuario que cierre la ventana.
// @author       IlIlIlIIlIlIlllI
// @match        https://www.youtube.com/watch?v=*
// @match        https://ytmp3.la/*
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/512904/YouTube%20Button%20to%20YTMP3.user.js
// @updateURL https://update.greasyfork.org/scripts/512904/YouTube%20Button%20to%20YTMP3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Función para crear el botón
    function createButton(videoId) {
        const button = document.createElement('button');
        button.id = 'ytmp3-button';
        button.textContent = 'MP3';  // Cambiado el texto a MP3
        button.style.marginLeft = '10px';
        button.style.padding = '5px 10px';
        button.style.backgroundColor = '#FF0000';
        button.style.color = '#FFFFFF';
        button.style.border = 'none';
        button.style.borderRadius = '3px';
        button.style.cursor = 'pointer';

        // Al hacer clic, abrir un popup con la URL del servicio de conversión
        button.addEventListener('click', function() {
            const newUrl = `https://ytmp3.la/en-Vg7a/#${videoId}/mp3`;
            const width = 600; // Ancho del popup
            const height = 400; // Alto del popup
            const left = (screen.width / 2) - (width / 2); // Centrar el popup
            const top = (screen.height / 2) - (height / 2); // Centrar el popup

            // Crear el contenido del popup
            const popupContent = `
                <html>
                <head>
                    <title>Descargando MP3</title>
                </head>
                <body>
                    <h1>Descargando MP3...</h1>
                    <p>Se ha iniciado la descarga. Puedes cerrar esta ventana.</p>
                    <script>
                        // Abrir la URL de YTMP3
                        window.location.href = "${newUrl}";
                    </script>
                </body>
                </html>
            `;

            // Abrir el popup y escribir el contenido
            const popup = window.open('', 'ytmp3Popup', `width=${width},height=${height},top=${top},left=${left}`);
            popup.document.write(popupContent);
            popup.document.close(); // Cerrar el documento del popup para aplicar cambios
        });

        return button;
    }

    // Función para agregar el botón junto al título
    function addButton() {
        const videoUrl = window.location.href;
        const videoId = new URL(videoUrl).searchParams.get('v');  // Obtener el ID del video

        // Asegurar que se encuentra el contenedor correcto del título
        const titleElement = document.querySelector('#title h1');  // Cambiamos el selector
        if (titleElement && !document.getElementById('ytmp3-button')) {  // Verificamos que el botón no haya sido agregado
            const button = createButton(videoId);
            titleElement.appendChild(button);  // Añadir el botón después del título
        }
    }

    // Función para hacer clic en el botón "Download" en la página de YTMP3
    function clickDownloadButton() {
        const downloadButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.trim() === 'Download'); // Seleccionar el botón "Download"
        if (downloadButton) {
            downloadButton.click();  // Hacer clic en el botón de descarga
            return true;  // Retorna verdadero si el clic fue exitoso
        }
        return false;  // Retorna falso si el botón no fue encontrado
    }

    // Función para observar cambios en el DOM y hacer clic en el botón "Download"
    function observeDownloadButton() {
        const observer = new MutationObserver(() => {
            if (clickDownloadButton()) {
                observer.disconnect();  // Desconectar el observador si se hace clic en el botón
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });  // Observar cambios en el cuerpo del documento
    }

    // Observar cambios en la página para añadir el botón de YouTube dinámicamente
    const observerYouTube = new MutationObserver(addButton);
    observerYouTube.observe(document.body, { childList: true, subtree: true });

    // Llamar a la función inmediatamente para cargar el botón si la página de YouTube ya está lista
    addButton();

    // Si estamos en YTMP3, empezar a observar para hacer clic en el botón de descarga
    if (window.location.href.includes('ytmp3.la')) {
        observeDownloadButton();
    }
})();
