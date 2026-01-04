// ==UserScript==
// @name         Descargar Capítulo de Manga en ZIP (2024-2025)
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Descarga un capítulo de manga en formato ZIP desde webcomicgamma.takeshobo.co.jp, con soporte para extraer y descargar imágenes completas.
// @author       Tu Nombre
// @match        https://webcomicgamma.takeshobo.co.jp/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @license      MIT
// @language     es
// @downloadURL https://update.greasyfork.org/scripts/525204/Descargar%20Cap%C3%ADtulo%20de%20Manga%20en%20ZIP%20%282024-2025%29.user.js
// @updateURL https://update.greasyfork.org/scripts/525204/Descargar%20Cap%C3%ADtulo%20de%20Manga%20en%20ZIP%20%282024-2025%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Función para extraer imágenes de un contenedor específico
    function extractImagesFromContainer(container) {
        const images = container.querySelectorAll('img');
        return Array.from(images).map(img => img.src);
    }

    // Función para descargar imágenes y comprimirlas en un ZIP
    async function downloadImages(imageUrls) {
        const zip = new JSZip();
        const promises = imageUrls.map((url, index) => {
            return new Promise((resolve, reject) => {
                if (url.startsWith('blob:')) {
                    // Si la URL es un blob (imagen en la página)
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: url,
                        responseType: "blob",
                        onload: function (response) {
                            const blob = response.response;
                            const filename = `page_${index + 1}.png`;
                            zip.file(filename, blob, { binary: true });
                            resolve();
                        },
                        onerror: function (error) {
                            console.error(`Error al descargar la imagen ${url}:`, error);
                            reject(error);
                        }
                    });
                } else {
                    reject(new Error('Tipo de URL no soportado'));
                }
            });
        });

        // Esperar a que todas las imágenes se descarguen
        await Promise.all(promises);

        // Generar el archivo ZIP
        zip.generateAsync({ type: "blob" }).then(function (content) {
            saveAs(content, "manga_chapter.zip");
            alert("¡Descarga completada!");
        });
    }

    // Función para combinar imágenes en una sola imagen completa
    async function combineImagesIntoOne(imageUrls) {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            const images = [];
            let totalHeight = 0;
            let maxWidth = 0;

            // Cargar todas las imágenes y calcular dimensiones
            const loadPromises = imageUrls.map(url => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.crossOrigin = "Anonymous";
                    img.src = url;

                    img.onload = function () {
                        images.push(img);
                        totalHeight += img.height;
                        maxWidth = Math.max(maxWidth, img.width);
                        resolve();
                    };

                    img.onerror = function () {
                        reject(new Error('Error al cargar la imagen'));
                    };
                });
            });

            // Esperar a que todas las imágenes se carguen
            Promise.all(loadPromises)
                .then(() => {
                    // Configurar el canvas con las dimensiones totales
                    canvas.width = maxWidth;
                    canvas.height = totalHeight;

                    // Dibujar las imágenes en el canvas
                    let currentY = 0;
                    images.forEach(img => {
                        ctx.drawImage(img, 0, currentY);
                        currentY += img.height;
                    });

                    // Convertir el canvas a una URL de datos (imagen completa)
                    const combinedImageUrl = canvas.toDataURL('image/png');
                    resolve(combinedImageUrl);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    // Crear botón de descarga
    function createDownloadButton() {
        const button = document.createElement('button');
        button.textContent = 'Descargar Capítulo en ZIP';
        Object.assign(button.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
            padding: '10px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
        });

        button.addEventListener('click', async () => {
            // Seleccionar el contenedor de imágenes
            const container = document.querySelector('div[data-ptimg]');
            if (!container) {
                alert("No se encontró el contenedor de imágenes.");
                return;
            }

            // Extraer las imágenes del contenedor
            const imageUrls = extractImagesFromContainer(container);

            if (imageUrls.length === 0) {
                alert("No se encontraron imágenes en esta página.");
                return;
            }

            try {
                // Combinar las imágenes en una sola imagen completa
                const combinedImageUrl = await combineImagesIntoOne(imageUrls);

                // Descargar la imagen combinada
                const blob = dataURLtoBlob(combinedImageUrl);
                saveAs(blob, "manga_chapter_combined.png");

                // También puedes descargar las imágenes individuales en un ZIP
                await downloadImages(imageUrls);
            } catch (error) {
                console.error("Error al procesar las imágenes:", error);
                alert("Ocurrió un error al procesar las imágenes. Revisa la consola para más detalles.");
            }
        });

        document.body.appendChild(button);
    }

    // Convertir una URL de datos (base64) a un Blob
    function dataURLtoBlob(dataURL) {
        const arr = dataURL.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        const u8arr = new Uint8Array(bstr.length);
        for (let i = 0; i < bstr.length; i++) {
            u8arr[i] = bstr.charCodeAt(i);
        }
        return new Blob([u8arr], { type: mime });
    }

    // Iniciar el script
    createDownloadButton();
})();