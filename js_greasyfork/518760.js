// ==UserScript==
// @name         Manatoki469 Direct Downloader (Fix HQ Images)
// @namespace    shadows
// @version      1.7.4
// @description  Descarga imágenes en alta calidad de capítulos de manga desde Manatoki469 directamente.
// @author       shadows
// @license      MIT
// @match        https://manatoki469.net/*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/518760/Manatoki469%20Direct%20Downloader%20%28Fix%20HQ%20Images%29.user.js
// @updateURL https://update.greasyfork.org/scripts/518760/Manatoki469%20Direct%20Downloader%20%28Fix%20HQ%20Images%29.meta.js
// ==/UserScript==

"use strict";

(function () {

    // Crear botón
    const downloadButton = document.createElement("button");
    downloadButton.textContent = "Descargar imágenes HQ";
    downloadButton.style.cssText = `
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

    downloadButton.addEventListener("click", async () => {

        // Capturar todas las imágenes del lector
        const imageElements = Array.from(document.querySelectorAll("img"));

        // Obtener URLs HQ reales
        const imageUrls = imageElements
            .map(img => img.getAttribute("data-src") || img.getAttribute("src"))
            .filter(url =>
                url &&
                url.includes("/comic/") &&
                !url.includes("thumb")
            )
            .map(url => url.split("?")[0]); // quitar parámetros

        if (imageUrls.length === 0) {
            alert("No se encontraron imágenes del manga para descargar.");
            return;
        }

        for (const [index, url] of imageUrls.entries()) {
            const fileName = `${String(index + 1).padStart(3, "0")}.jpg`;
            try {
                await downloadImage(url, fileName);
                console.log(`Descargada: ${fileName}`);
            } catch (err) {
                console.error(`Error al descargar ${fileName}:`, err);
            }
        }

        alert(`Se descargaron ${imageUrls.length} imágenes correctamente.`);
    });

    function downloadImage(url, fileName) {
        return new Promise((resolve, reject) => {
            GM_download({
                url: url,
                name: fileName,
                headers: {
                    Referer: "https://manatoki469.net/"
                },
                onload: resolve,
                onerror: reject
            });
        });
    }

})();
