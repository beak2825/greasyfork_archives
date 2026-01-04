// ==UserScript==
// @name         Manga Downloader Enhanced
// @namespace    custom-scripts
// @version      5.0
// @description  Descarga imágenes de manga con una interfaz gráfica avanzada.
// @author       TuNombre
// @license      MIT
// @match        https://zerosumonline.com/*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/519508/Manga%20Downloader%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/519508/Manga%20Downloader%20Enhanced.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // Crear botón para abrir la ventana flotante
    const toggleButton = document.createElement("button");
    toggleButton.textContent = "📂 Mostrar Imágenes Guardadas";
    toggleButton.style = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        z-index: 10000;
        background-color: #007bff;
        color: white;
        border: none;
        padding: 10px;
        font-size: 14px;
        border-radius: 5px;
        cursor: pointer;
    `;
    document.body.appendChild(toggleButton);

    // Crear ventana flotante para mostrar imágenes
    const imageWindow = document.createElement("div");
    imageWindow.style = `
        display: none;
        position: fixed;
        top: 10%;
        left: 50%;
        transform: translate(-50%, 0);
        width: 80%;
        height: 70%;
        background-color: white;
        border: 1px solid #ccc;
        border-radius: 10px;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        overflow-y: auto;
        padding: 15px;
    `;
    imageWindow.innerHTML = `
        <button id="close-window" style="
            float: right; 
            background-color: red; 
            color: white; 
            border: none; 
            padding: 5px 10px; 
            cursor: pointer;
        ">Cerrar</button>
        <h3>Selecciona las imágenes a descargar</h3>
        <div id="image-container" style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px;"></div>
        <div style="margin-top: 20px; text-align: center;">
            <button id="select-all-btn" style="
                background-color: #28a745; 
                color: white; 
                border: none; 
                padding: 10px 20px; 
                margin-right: 10px; 
                cursor: pointer;
            ">Seleccionar Todas</button>
            <button id="download-selected-btn" style="
                background-color: #007bff; 
                color: white; 
                border: none; 
                padding: 10px 20px; 
                cursor: pointer;
            ">Descargar Seleccionadas</button>
        </div>
    `;
    document.body.appendChild(imageWindow);

    // Mostrar/Ocultar ventana al hacer clic en el botón
    toggleButton.addEventListener("click", () => {
        imageWindow.style.display = imageWindow.style.display === "none" ? "block" : "none";
        if (imageWindow.style.display === "block") populateImageContainer();
    });

    // Cerrar ventana
    document.getElementById("close-window").addEventListener("click", () => {
        imageWindow.style.display = "none";
    });

    // Detectar imágenes y llenarlas en la ventana
    function populateImageContainer() {
        const images = Array.from(document.querySelectorAll("img.G54Y0W_page"));
        const imageContainer = document.getElementById("image-container");
        imageContainer.innerHTML = ""; // Limpiar contenido previo

        images.forEach((img, index) => {
            const wrapper = document.createElement("div");
            wrapper.style = "width: 100px; text-align: center;";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = index;

            const thumbnail = document.createElement("img");
            thumbnail.src = img.src;
            thumbnail.style = "width: 100px; height: auto; border: 1px solid #ccc;";

            const label = document.createElement("p");
            label.textContent = `Página ${index + 1}`;
            label.style = "font-size: 12px; margin: 5px 0;";

            wrapper.appendChild(checkbox);
            wrapper.appendChild(thumbnail);
            wrapper.appendChild(label);
            imageContainer.appendChild(wrapper);
        });
    }

    // Seleccionar todas las imágenes
    document.getElementById("select-all-btn").addEventListener("click", () => {
        const checkboxes = document.querySelectorAll("#image-container input[type='checkbox']");
        checkboxes.forEach((checkbox) => (checkbox.checked = true));
    });

    // Descargar imágenes seleccionadas
    document.getElementById("download-selected-btn").addEventListener("click", async () => {
        const checkboxes = document.querySelectorAll("#image-container input[type='checkbox']:checked");
        if (checkboxes.length === 0) {
            alert("No hay imágenes seleccionadas para descargar.");
            return;
        }

        for (const checkbox of checkboxes) {
            const index = parseInt(checkbox.value, 10);
            const imgElement = document.querySelectorAll("img.G54Y0W_page")[index];
            const blob = await convertImageToBlob(imgElement);

            if (blob) {
                const fileName = `pagina_${String(index + 1).padStart(3, "0")}.jpg`;
                downloadBlob(blob, fileName);
            }
        }

        alert(`Se descargaron ${checkboxes.length} imágenes correctamente.`);
    });

    // Convierte un elemento <img> en un Blob descargable
    async function convertImageToBlob(imgElement) {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement("canvas");
            canvas.width = imgElement.naturalWidth || imgElement.width;
            canvas.height = imgElement.naturalHeight || imgElement.height;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(imgElement, 0, 0);

            canvas.toBlob(
                (blob) => (blob ? resolve(blob) : reject(new Error("No se pudo convertir la imagen."))),
                "image/jpeg",
                1.0
            );
        });
    }

    // Descarga un Blob como archivo
    function downloadBlob(blob, fileName) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    }
})();
