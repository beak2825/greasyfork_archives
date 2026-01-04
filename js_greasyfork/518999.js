// ==UserScript==
// @name         Comic Earthstar Image Downloader Fix
// @namespace    shadows
// @version      1.6.0
// @description  Descarga imágenes completas de capítulos de manga desde Comic Earthstar asegurando compatibilidad y funcionalidad.
// @author       shadows
// @license      MIT
// @match        https://comic-earthstar.com/episode/*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/518999/Comic%20Earthstar%20Image%20Downloader%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/518999/Comic%20Earthstar%20Image%20Downloader%20Fix.meta.js
// ==/UserScript==

"use strict";

(function () {
    // Crear un botón para la descarga
    const downloadButton = document.createElement("button");
    downloadButton.textContent = "Descargar Imágenes";
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

    // Función principal para descargar imágenes
    downloadButton.addEventListener("click", async () => {
        // Seleccionar imágenes en el DOM
        const images = Array.from(document.querySelectorAll("img[src]"))
            .map(img => img.src) // Obtener la URL de cada imagen
            .filter(url => url.includes("cdn-img.comic-earthstar.com")); // Filtrar solo las imágenes del capítulo

        if (images.length === 0) {
            alert("No se encontraron imágenes para descargar.");
            return;
        }

        // Descargar cada imagen individualmente
        for (const [index, url] of images.entries()) {
            const fileName = `pagina_${String(index + 1).padStart(2, "0")}.png`;
            try {
                await downloadImage(url, fileName);
                console.log(`Descargada: ${fileName}`);
            } catch (err) {
                console.error(`Error al descargar ${fileName}:`, err);
            }
        }

        alert(`Se descargaron ${images.length} imágenes correctamente.`);
    });

    // Función para descargar una imagen usando GM_download
    function downloadImage(url, fileName) {
        return new Promise((resolve, reject) => {
            GM_download({
                url: url,
                name: fileName,
                headers: {
                    Referer: window.location.href, // Encabezado para evitar bloqueos
                },
                onload: () => resolve(),
                onerror: (err) => reject(err),
            });
        });
    }
})();

