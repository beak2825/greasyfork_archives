// ==UserScript==
// @name         Descargar imágenes de Comic Earthstar
// @namespace    https://comic-earthstar.com/
// @version      1.1
// @description  Detecta y descarga todas las imágenes cargadas como blobs en Comic Earthstar
// @author       TuNombre
// @match        https://comic-earthstar.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519097/Descargar%20im%C3%A1genes%20de%20Comic%20Earthstar.user.js
// @updateURL https://update.greasyfork.org/scripts/519097/Descargar%20im%C3%A1genes%20de%20Comic%20Earthstar.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Crear un contenedor para almacenar las URLs detectadas
    const detectedURLs = new Set();

    // Crear un botón para iniciar la descarga
    const downloadButton = document.createElement('button');
    downloadButton.innerText = 'Descargar imágenes';
    downloadButton.style.position = 'fixed';
    downloadButton.style.top = '10px';
    downloadButton.style.right = '10px';
    downloadButton.style.zIndex = '9999';
    downloadButton.style.padding = '10px';
    downloadButton.style.backgroundColor = '#007bff';
    downloadButton.style.color = 'white';
    downloadButton.style.border = 'none';
    downloadButton.style.borderRadius = '5px';
    downloadButton.style.cursor = 'pointer';
    document.body.appendChild(downloadButton);

    // Función para interceptar peticiones de red
    const observeNetworkRequests = () => {
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (...args) {
            this.addEventListener('load', function () {
                if (this.responseURL.startsWith('blob:https://comic-earthstar.com')) {
                    detectedURLs.add(this.responseURL);
                }
            });
            originalOpen.apply(this, args);
        };

        const originalFetch = window.fetch;
        window.fetch = async function (...args) {
            const response = await originalFetch(...args);
            if (response.url.startsWith('blob:https://comic-earthstar.com')) {
                detectedURLs.add(response.url);
            }
            return response;
        };
    };

    // Función para observar cambios en el DOM y detectar blobs
    const observeDOMChanges = () => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    const images = Array.from(document.querySelectorAll('img[src^="blob:https://comic-earthstar.com"]'));
                    images.forEach((img) => detectedURLs.add(img.src));
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    };

    // Función para descargar las imágenes
    async function downloadImages() {
        if (detectedURLs.size === 0) {
            alert('No se detectaron imágenes para descargar.');
            return;
        }

        let counter = 1;
        for (const blobUrl of detectedURLs) {
            try {
                const blob = await fetch(blobUrl).then((res) => res.blob());
                const link = document.createElement('a');
                const url = URL.createObjectURL(blob);

                link.href = url;
                link.download = `imagen_${String(counter).padStart(3, '0')}.png`;
                link.click();

                // Liberar el objeto URL temporal
                URL.revokeObjectURL(url);
                counter++;
            } catch (error) {
                console.error('Error descargando la imagen:', blobUrl, error);
            }
        }

        alert('Descarga completa.');
    }

    // Asignar la función de descarga al botón
    downloadButton.addEventListener('click', downloadImages);

    // Iniciar la observación de peticiones de red y cambios en el DOM
    observeNetworkRequests();
    observeDOMChanges();
})();

