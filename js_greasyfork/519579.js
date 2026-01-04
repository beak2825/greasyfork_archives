// ==UserScript==
// @name         Amazon Manga Downloader
// @namespace    greasyfork
// @version      1.0
// @description  Detecta y descarga imágenes de manga desde Amazon Kindle y el lector de manga en orden.
// @author       TuNombre
// @license      MIT
// @match        https://www.amazon.co.jp/Kindle/*
// @match        https://read.amazon.co.jp/sample/*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/519579/Amazon%20Manga%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/519579/Amazon%20Manga%20Downloader.meta.js
// ==/UserScript==
"use strict";

(function () {
    // Crear botón de descarga
    const downloadButton = document.createElement("button");
    downloadButton.textContent = "Descargar Imágenes";
    downloadButton.style = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 10000;
        background-color: #007bff;
        color: white;
        border: none;
        padding: 10px 20px;
        font-size: 14px;
        border-radius: 5px;
        cursor: pointer;
    `;
    document.body.appendChild(downloadButton);

    // Función para buscar y descargar imágenes
    downloadButton.addEventListener("click", async () => {
        // Capturar todas las imágenes de la página
        const images = Array.from(document.querySelectorAll("img[src], img[data-src]"))
            .map(img => img.src || img.dataset.src)
            .filter(url => url && (url.startsWith("https://") || url.startsWith("blob:"))); // Detecta URLs relevantes

        if (images.length === 0) {
            alert("No se encontraron imágenes para descargar.");
            return;
        }

        // Descargar cada imagen en orden
        for (const [index, url] of images.entries()) {
            const fileName = `imagen_${String(index + 1).padStart(3, "0")}.jpg`;
            try {
                await downloadImage(url, fileName);
                console.log(`Descargada: ${fileName}`);
            } catch (err) {
                console.error(`Error al descargar ${fileName}:`, err);
            }
        }

        alert(`Se descargaron ${images.length} imágenes correctamente.`);
    });

    // Función para descargar imágenes usando GM_download
    function downloadImage(url, fileName) {
        return new Promise((resolve, reject) => {
            GM_download({
                url: url,
                name: fileName,
                headers: {
                    Referer: window.location.origin // Encabezado para evitar bloqueos
                },
                onload: () => resolve(),
                onerror: (err) => reject(err),
            });
        });
    }
})();
