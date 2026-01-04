// ==UserScript==
// @name         Captura de pantalla en webcomicgamma.takeshobo.co.jp
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Toma una captura de pantalla del elemento #content-pX en webcomicgamma.takeshobo.co.jp
// @author       Tu Nombre
// @match        https://webcomicgamma.takeshobo.co.jp/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.3.2/html2canvas.min.js
// @downloadURL https://update.greasyfork.org/scripts/525377/Captura%20de%20pantalla%20en%20webcomicgammatakeshobocojp.user.js
// @updateURL https://update.greasyfork.org/scripts/525377/Captura%20de%20pantalla%20en%20webcomicgammatakeshobocojp.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Función para esperar a que todas las imágenes dentro de un elemento estén cargadas
    function waitForImages(element) {
        return new Promise((resolve) => {
            const images = element.querySelectorAll('img');
            let loadedCount = 0;

            if (images.length === 0) {
                resolve(); // No hay imágenes, resolver inmediatamente
                return;
            }

            images.forEach(img => {
                if (img.complete) {
                    loadedCount++;
                } else {
                    img.addEventListener('load', () => {
                        loadedCount++;
                        if (loadedCount === images.length) {
                            resolve();
                        }
                    });
                    img.addEventListener('error', () => {
                        loadedCount++;
                        if (loadedCount === images.length) {
                            resolve();
                        }
                    });
                }
            });

            if (loadedCount === images.length) {
                resolve();
            }
        });
    }

    // Función para capturar el elemento y descargar la imagen
    async function captureAndDownload() {
        // Encuentra el elemento actual (puede ser #content-p0, #content-p4, etc.)
        const currentPage = Array.from(document.querySelectorAll('[id^="content-p"]')).find(el => el.offsetParent !== null);

        if (currentPage) {
            console.log(`Capturando el elemento: ${currentPage.id}`);

            // Espera a que todas las imágenes dentro del elemento estén cargadas
            await waitForImages(currentPage);

            // Captura el contenido visible del elemento
            html2canvas(currentPage, {
                useCORS: true, // Intenta manejar imágenes externas
                allowTaint: true, // Permite el uso de imágenes con "taint" (como blob:)
                logging: true, // Habilita logs para depuración
            }).then(canvas => {
                // Convierte el canvas a una imagen
                const imgData = canvas.toDataURL('image/png');

                // Crea un enlace para descargar la imagen
                const link = document.createElement('a');
                link.href = imgData;
                link.download = `captura-${currentPage.id}.png`;
                link.textContent = 'Descargar captura de pantalla';

                // Añade el enlace al cuerpo del documento
                document.body.appendChild(link);

                // Simula un clic en el enlace para iniciar la descarga
                link.click();

                // Elimina el enlace después de la descarga
                document.body.removeChild(link);
            }).catch(error => {
                console.error('Error al capturar el elemento:', error);
            });
        } else {
            console.error('No se encontró ningún elemento con el ID "content-pX".');
        }
    }

    // Espera a que la página cargue completamente
    window.addEventListener('load', function() {
        // Crea un botón para iniciar la captura
        const button = document.createElement('button');
        button.textContent = 'Capturar pantalla';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = 1000;
        button.style.padding = '10px';
        button.style.backgroundColor = '#007bff';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';

        // Añade el botón al cuerpo del documento
        document.body.appendChild(button);

        // Asigna la función de captura al botón
        button.addEventListener('click', captureAndDownload);
    });
})();