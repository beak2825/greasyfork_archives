// ==UserScript==
// @name         Viz Manga Universal Downloader v2.2.1
// @namespace    shadows
// @version      2.2.1
// @description  Descarga capítulos completos de Viz Manga y Shonen Jump mostrando imágenes en una ventana para que el usuario seleccione cuáles descargar.
// @author       
// @license      MIT
// @match        https://www.viz.com/vizmanga/*
// @match        https://www.viz.com/shonenjump/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @connect      viz.com
// @downloadURL https://update.greasyfork.org/scripts/519336/Viz%20Manga%20Universal%20Downloader%20v221.user.js
// @updateURL https://update.greasyfork.org/scripts/519336/Viz%20Manga%20Universal%20Downloader%20v221.meta.js
// ==/UserScript==
"use strict";

(function () {
    const createControlPanel = () => {
        const existingPanel = document.querySelector("#control-panel");
        if (existingPanel) return; // Evitar duplicados

        const panel = document.createElement("div");
        panel.id = "control-panel";
        panel.style = `
            position: fixed;
            top: 10%;
            left: 10%;
            width: 80%;
            height: 80%;
            background-color: white;
            border: 2px solid black;
            border-radius: 10px;
            padding: 20px;
            z-index: 10000;
            overflow-y: auto;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        `;
        panel.innerHTML = `
            <div style="text-align: right; margin-bottom: 10px;">
                <button id="close-panel" style="background-color: red; color: white; border: none; padding: 10px 20px; cursor: pointer; border-radius: 5px;">Cerrar</button>
            </div>
            <h2 style="margin-top: 0;">Selecciona las imágenes a descargar</h2>
            <div id="image-list" style="display: flex; flex-wrap: wrap; gap: 10px;"></div>
            <div style="margin-top: 20px; text-align: center;">
                <button id="select-all" style="background-color: green; color: white; border: none; padding: 10px 20px; cursor: pointer; border-radius: 5px;">Seleccionar Todas</button>
                <button id="download-selected" style="background-color: blue; color: white; border: none; padding: 10px 20px; cursor: pointer; border-radius: 5px;">Descargar Seleccionadas</button>
            </div>
        `;

        document.body.appendChild(panel);

        document.querySelector("#close-panel").addEventListener("click", () => {
            panel.remove();
        });

        document.querySelector("#select-all").addEventListener("click", () => {
            const checkboxes = document.querySelectorAll(".image-checkbox");
            checkboxes.forEach((checkbox) => (checkbox.checked = true));
        });

        document.querySelector("#download-selected").addEventListener("click", downloadSelectedImages);
    };

    const populateImages = () => {
        const imageList = document.querySelector("#image-list");
        imageList.innerHTML = "";

        const canvases = document.querySelectorAll("canvas.reader_page_canvas");
        if (canvases.length === 0) {
            alert("No se encontraron imágenes.");
            return;
        }

        canvases.forEach((canvas, index) => {
            const imageURL = canvas.toDataURL("image/png");
            const container = document.createElement("div");
            container.style = "text-align: center;";

            const img = document.createElement("img");
            img.src = imageURL;
            img.alt = `Página ${index + 1}`;
            img.style = "width: 150px; height: auto; display: block; margin-bottom: 5px;";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "image-checkbox";
            checkbox.value = imageURL;

            const label = document.createElement("label");
            label.textContent = `Página ${index + 1}`;
            label.style = "display: block; margin-top: 5px; font-size: 14px;";

            container.appendChild(img);
            container.appendChild(checkbox);
            container.appendChild(label);

            imageList.appendChild(container);
        });
    };

    const downloadSelectedImages = () => {
        const checkboxes = document.querySelectorAll(".image-checkbox:checked");
        if (checkboxes.length === 0) {
            alert("No seleccionaste ninguna imagen.");
            return;
        }

        checkboxes.forEach((checkbox, index) => {
            const imageURL = checkbox.value;
            const fileName = `page-${String(index + 1).padStart(3, "0")}.png`;

            GM_download({
                url: imageURL,
                name: fileName,
                onload: () => console.log(`Descargada: ${fileName}`),
                onerror: (err) => console.error(`Error al descargar ${fileName}:`, err),
            });
        });

        alert(`Se descargaron ${checkboxes.length} imágenes.`);
    };

    const createDownloadIcon = () => {
        const existingIcon = document.querySelector("#download-icon");
        if (existingIcon) return;

        const icon = document.createElement("button");
        icon.id = "download-icon";
        icon.textContent = "📥";
        icon.style = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            z-index: 10000;
            background-color: #0078ff;
            color: white;
            border: none;
            padding: 10px;
            font-size: 20px;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        `;

        document.body.appendChild(icon);

        icon.addEventListener("click", () => {
            createControlPanel();
            populateImages();
        });
    };

    const initObserver = () => {
        const observer = new MutationObserver(() => {
            const isReaderPage = document.querySelector("canvas.reader_page_canvas") !== null;
            if (isReaderPage) {
                createDownloadIcon();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    };

    window.addEventListener("load", initObserver);
})();
