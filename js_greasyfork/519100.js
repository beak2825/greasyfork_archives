// ==UserScript==
// @name         Viz Manga Universal Downloader v3.0.0
// @namespace    shadows
// @version      3.1.0
// @description  Descarga capítulos completos de Viz Manga y Shonen Jump, detectando dinámicamente todas las páginas de manga cargadas en el lector propio y excluyendo imágenes inválidas.
// @author       
// @license      MIT
// @match        https://www.viz.com/vizmanga/*
// @match        https://www.viz.com/shonenjump/*
// @grant        GM_download
// @connect      viz.com
// @downloadURL https://update.greasyfork.org/scripts/519100/Viz%20Manga%20Universal%20Downloader%20v300.user.js
// @updateURL https://update.greasyfork.org/scripts/519100/Viz%20Manga%20Universal%20Downloader%20v300.meta.js
// ==/UserScript==
"use strict";

(function () {
    const MIN_DIMENSION = 500; // Dimensiones mínimas de las imágenes (ancho/alto)
    const MAX_MONOCHROME_RATIO = 0.95; // Porcentaje máximo permitido de negro o blanco puro en una imagen

    // Función para hacer scroll y cargar todas las páginas
    const scrollToLoadAllPages = async () => {
        let previousHeight;
        while (true) {
            window.scrollBy(0, window.innerHeight);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar un segundo
            const currentHeight = document.body.scrollHeight;
            if (currentHeight === previousHeight) break; // Si no hay más contenido, salir del bucle
            previousHeight = currentHeight;
        }
    };

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
                // Hacer scroll para cargar todas las páginas
                await scrollToLoadAllPages();
                // Esperar a que todas las páginas estén cargadas
                await waitForPagesToLoad();
                // Descargar todas las páginas
                await downloadAllPages();
            } catch (err) {
                console.error("Error al descargar:", err);
                alert("Hubo un problema al descargar el capítulo.");
            } finally {
                button.disabled = false;
                button.textContent = "Descargar capítulo completo";
            }
        });
    };

    const waitForPagesToLoad = async () => {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 30; // Tiempo máximo de espera (30 intentos de 500ms = 15s)
            const interval = setInterval(() => {
                const canvases = document.querySelectorAll("canvas.reader_page_canvas");
                if (canvases.length > 0) {
                    clearInterval(interval);
                    resolve();
                } else if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    reject(new Error("No se pudieron cargar todas las páginas en el tiempo esperado."));
                }
                attempts++;
            }, 500);
        });
    };

    const downloadAllPages = async () => {
        const canvases = document.querySelectorAll("canvas.reader_page_canvas");
        if (canvases.length === 0) {
            alert("No se encontraron páginas para descargar.");
            return;
        }

        let downloadedCount = 0;
        let errors = [];
        for (let i = 0; i < canvases.length; i++) {
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
        // Verificar dimensiones mínimas
        if (canvas.width < MIN_DIMENSION || canvas.height < MIN_DIMENSION) {
            console.log("Canvas descartado: dimensiones demasiado pequeñas.");
            return false;
        }

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
            if (r === 0 && g === 0 && b === 0) blackPixels++;
            if (r === 255 && g === 255 && b === 255) whitePixels++;
        }

        const blackRatio = blackPixels / totalPixels;
        const whiteRatio = whitePixels / totalPixels;

        if (blackRatio > MAX_MONOCHROME_RATIO || whiteRatio > MAX_MONOCHROME_RATIO) {
            console.log("Canvas descartado: demasiados píxeles monocromáticos.");
            return false;
        }

        return true;
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
