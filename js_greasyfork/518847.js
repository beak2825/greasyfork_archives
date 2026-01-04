// ==UserScript==
// @name         Viz Manga Universal Downloader v2.0.0
// @namespace    shadows
// @version      2.0.0
// @description  Descarga capítulos completos de Viz Manga y Shonen Jump, detectando dinámicamente todas las páginas de manga.
// @author       shadows
// @license      MIT
// @match        https://www.viz.com/vizmanga/*
// @match        https://www.viz.com/shonenjump/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @connect      viz.com
// @downloadURL https://update.greasyfork.org/scripts/518847/Viz%20Manga%20Universal%20Downloader%20v200.user.js
// @updateURL https://update.greasyfork.org/scripts/518847/Viz%20Manga%20Universal%20Downloader%20v200.meta.js
// ==/UserScript==
"use strict";

(function () {
    const createDownloadButton = () => {
        const existingButton = document.querySelector("#download-button");
        if (existingButton) return; // Evita duplicados

        const button = document.createElement("button");
        button.id = "download-button";
        button.textContent = "Descargar capítulo completo";
        button.style = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 10000;
            background-color: #0078ff;
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 14px;
            border-radius: 5px;
            cursor: pointer;
        `;
        document.body.appendChild(button);

        button.addEventListener("click", async () => {
            try {
                await downloadAllPages();
            } catch (err) {
                console.error("Error al descargar:", err);
                alert("Hubo un problema al descargar el capítulo.");
            }
        });
    };

    const downloadAllPages = async () => {
        const canvases = document.querySelectorAll("canvas.reader_page_canvas");
        if (canvases.length === 0) {
            alert("No se encontraron páginas para descargar.");
            return;
        }

        let downloadedCount = 0;
        for (let i = 0; i < canvases.length; i++) {
            const canvas = canvases[i];
            const fileName = `page-${String(i + 1).padStart(3, "0")}.png`;

            if (isCanvasValid(canvas)) {
                const imageURL = canvas.toDataURL("image/png");
                try {
                    await downloadImage(imageURL, fileName);
                    downloadedCount++;
                    console.log(`Descargada: ${fileName}`);
                } catch (err) {
                    console.error(`Error al descargar ${fileName}:`, err);
                }
            }
        }

        alert(`Se descargaron ${downloadedCount} imágenes correctamente.`);
    };

    const isCanvasValid = (canvas) => {
        const context = canvas.getContext("2d");
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;

        let totalPixels = 0;
        let blackPixels = 0;
        let whitePixels = 0;

        for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];

            totalPixels++;
            if (r === 0 && g === 0 && b === 0) {
                blackPixels++;
            }
            if (r === 255 && g === 255 && b === 255) {
                whitePixels++;
            }
        }

        const blackRatio = blackPixels / totalPixels;
        const whiteRatio = whitePixels / totalPixels;

        return blackRatio < 0.9 && whiteRatio < 0.9; // Página válida si no es mayormente negra o blanca
    };

    const downloadImage = (url, fileName) => {
        return new Promise((resolve, reject) => {
            GM_download({
                url: url,
                name: fileName,
                onload: () => resolve(),
                onerror: (err) => reject(err),
            });
        });
    };

    const initObserver = () => {
        const observer = new MutationObserver(() => {
            const isReaderPage = document.querySelector("canvas.reader_page_canvas") !== null;
            if (isReaderPage) {
                createDownloadButton();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    };

    // Iniciar script
    window.addEventListener("load", () => {
        createDownloadButton();
        initObserver();
    });
})();
