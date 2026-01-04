// ==UserScript==
// @name         Viz Manga Universal Downloader v3.2.0
// @namespace    shadows
// @version      3.2.1
// @description  Descarga capítulos completos de Viz Manga y Shonen Jump, detectando dinámicamente todas las páginas cargadas y descargándolas en orden.
// @author       
// @license      MIT
// @match        https://www.viz.com/vizmanga/*
// @match        https://www.viz.com/shonenjump/*
// @grant        GM_download
// @connect      viz.com
// @downloadURL https://update.greasyfork.org/scripts/519228/Viz%20Manga%20Universal%20Downloader%20v320.user.js
// @updateURL https://update.greasyfork.org/scripts/519228/Viz%20Manga%20Universal%20Downloader%20v320.meta.js
// ==/UserScript==
"use strict";

(function () {
    const MIN_DIMENSION = 500; // Dimensiones mínimas para considerar válidas las imágenes
    const MAX_ATTEMPTS = 60; // Máximo de intentos para esperar la carga completa
    const SCROLL_DELAY = 2000; // Tiempo entre desplazamientos (en milisegundos)

    const createDownloadButton = () => {
        if (document.querySelector("#download-button")) return;

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
            button.disabled = true;
            button.textContent = "Descargando...";
            try {
                await scrollToLoadAllPages(); // Asegurarse de cargar todas las páginas
                const pageCount = await countPages();
                if (pageCount === 0) throw new Error("No se encontraron páginas para descargar.");
                alert(`Se detectaron ${pageCount} páginas. Descargando...`);
                await downloadAllPages(pageCount);
            } catch (err) {
                console.error("Error al descargar:", err);
                alert("Hubo un problema al descargar el capítulo.");
            } finally {
                button.disabled = false;
                button.textContent = "Descargar capítulo completo";
            }
        });
    };

    const scrollToLoadAllPages = async () => {
        let previousHeight = 0;
        let currentHeight = document.body.scrollHeight;
        let attempts = 0;

        while (attempts < MAX_ATTEMPTS) {
            window.scrollBy(0, window.innerHeight);
            await new Promise(resolve => setTimeout(resolve, SCROLL_DELAY)); // Esperar a que cargue contenido
            previousHeight = currentHeight;
            currentHeight = document.body.scrollHeight;

            if (currentHeight === previousHeight) break; // Si no hay más contenido, detener
            attempts++;
        }
    };

    const countPages = async () => {
        const canvases = document.querySelectorAll("canvas.reader_page_canvas");
        return canvases.length;
    };

    const downloadAllPages = async (pageCount) => {
        const canvases = document.querySelectorAll("canvas.reader_page_canvas");

        let downloadedCount = 0;
        let errors = [];

        for (let i = 0; i < pageCount; i++) {
            const canvas = canvases[i];
            const fileName = `page-${String(i + 1).padStart(3, "0")}.png`;

            try {
                if (!isCanvasValid(canvas)) {
                    console.log(`Página ${i + 1} descartada: no cumple los criterios.`);
                    continue;
                }

                const imageURL = canvas.toDataURL("image/png");
                await downloadImage(imageURL, fileName);
                downloadedCount++;
                console.log(`Descargada: ${fileName}`);
            } catch (err) {
                console.error(`Error al descargar ${fileName}:`, err);
                errors.push(fileName);
            }
        }

        alert(`Se descargaron ${downloadedCount} imágenes correctamente.${errors.length > 0 ? `\nErrores: ${errors.join(", ")}` : ""}`);
    };

    const isCanvasValid = (canvas) => {
        // Validar dimensiones mínimas
        return canvas.width >= MIN_DIMENSION && canvas.height >= MIN_DIMENSION;
    };

    const downloadImage = (url, fileName) => {
        return new Promise((resolve, reject) => {
            const link = document.createElement("a");
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            resolve();
        });
    };

    const initObserver = () => {
        const observer = new MutationObserver(() => {
            if (document.querySelector("canvas.reader_page_canvas")) {
                createDownloadButton();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    };

    window.addEventListener("load", () => {
        createDownloadButton();
        initObserver();
    });
})();
