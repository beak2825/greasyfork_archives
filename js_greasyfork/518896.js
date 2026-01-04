// ==UserScript==
// @name         ZeroSumOnline Manga Direct Downloader
// @namespace    custom-scripts
// @version      3.0
// @description  Descarga todas las imágenes visibles desde ZeroSumOnline directamente, incluyendo URLs tipo blob.
// @author       TuNombre
// @license      MIT
// @match        https://zerosumonline.com/*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/518896/ZeroSumOnline%20Manga%20Direct%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/518896/ZeroSumOnline%20Manga%20Direct%20Downloader.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // Crear un botón para iniciar la descarga
    const downloadButton = document.createElement("button");
    downloadButton.textContent = "Descargar Todas las Imágenes";
    downloadButton.style = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 10000;
        background-color: #28a745;
        color: white;
        border: none;
        padding: 10px 20px;
        font-size: 14px;
        border-radius: 5px;
        cursor: pointer;
    `;
    document.body.appendChild(downloadButton);

    // Evento de clic en el botón
    downloadButton.addEventListener("click", async () => {
        try {
            const images = Array.from(document.querySelectorAll("img.G54Y0W_page"));
            if (images.length === 0) {
                alert("No se encontraron imágenes para descargar.");
                return;
            }

            for (let i = 0; i < images.length; i++) {
                const imgElement = images[i];
                const blob = await convertImageToBlob(imgElement);

                if (blob) {
                    const fileName = `page_${String(i + 1).padStart(3, "0")}.jpg`;
                    downloadBlob(blob, fileName);
                    console.log(`Descargada: ${fileName}`);
                } else {
                    console.warn(`No se pudo procesar la imagen ${i + 1}`);
                }
            }

            alert(`Se descargaron ${images.length} imágenes correctamente.`);
        } catch (error) {
            console.error("Error durante la descarga:", error);
            alert("Ocurrió un error al descargar las imágenes. Revisa la consola para más detalles.");
        }
    });

    // Convierte un elemento <img> en un Blob descargable
    async function convertImageToBlob(imgElement) {
        return new Promise((resolve, reject) => {
            try {
                const canvas = document.createElement("canvas");
                canvas.width = imgElement.naturalWidth || imgElement.width;
                canvas.height = imgElement.naturalHeight || imgElement.height;

                const ctx = canvas.getContext("2d");
                ctx.drawImage(imgElement, 0, 0);

                canvas.toBlob(
                    (blob) => {
                        if (blob) resolve(blob);
                        else reject(new Error("No se pudo convertir la imagen a Blob."));
                    },
                    "image/jpeg",
                    1.0
                );
            } catch (error) {
                reject(error);
            }
        });
    }

    // Descarga un Blob como archivo
    function downloadBlob(blob, fileName) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
})();
