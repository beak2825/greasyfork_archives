// ==UserScript==
// @name         NicoManga Previsualizador y Descargador
// @namespace    shadows
// @version      3.0.0
// @description  Previsualiza y selecciona imágenes del manga para descarga individual o masiva.
// @author       shadows
// @license      MIT
// @match        https://manga.nicovideo.jp/*
// @match        https://sp.manga.nicovideo.jp/*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/519499/NicoManga%20Previsualizador%20y%20Descargador.user.js
// @updateURL https://update.greasyfork.org/scripts/519499/NicoManga%20Previsualizador%20y%20Descargador.meta.js
// ==/UserScript==
"use strict";

(function () {
    const blobMap = new Map(); // Almacena blobs únicos detectados
    let galleryWindow = null; // Ventana flotante para la galería

    // Crear botón de apertura de galería
    const galleryButton = document.createElement("button");
    galleryButton.textContent = "Abrir Galería de Imágenes";
    galleryButton.style = `
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
    document.body.appendChild(galleryButton);

    // Detectar blobs únicos y agregar al mapa
    const originalCreateObjectURL = URL.createObjectURL;
    URL.createObjectURL = function (blob) {
        const blobSignature = `${blob.size}-${blob.type}`;
        if (!blobMap.has(blobSignature)) {
            blobMap.set(blobSignature, blob);
            console.log("Página única detectada:", blobSignature);
        }
        return originalCreateObjectURL(blob);
    };

    // Abrir la galería cuando se hace clic en el botón
    galleryButton.addEventListener("click", () => {
        if (blobMap.size === 0) {
            alert("No se han detectado imágenes del manga.");
            return;
        }
        openGallery();
    });

    // Crear la galería en una ventana flotante
    function openGallery() {
        // Si la ventana ya está abierta, no hacer nada
        if (galleryWindow) return;

        // Crear ventana flotante
        galleryWindow = document.createElement("div");
        galleryWindow.style = `
            position: fixed;
            top: 50px;
            left: 50px;
            width: 80%;
            height: 80%;
            background: white;
            border: 1px solid #ccc;
            box-shadow: 0px 4px 8px rgba(0,0,0,0.2);
            z-index: 10001;
            overflow: auto;
            padding: 20px;
            display: flex;
            flex-direction: column;
        `;
        document.body.appendChild(galleryWindow);

        // Crear encabezado de la galería
        const header = document.createElement("div");
        header.style = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        `;
        galleryWindow.appendChild(header);

        // Título
        const title = document.createElement("h3");
        title.textContent = `Galería de Imágenes (${blobMap.size})`;
        header.appendChild(title);

        // Botón de cerrar
        const closeButton = document.createElement("button");
        closeButton.textContent = "Cerrar";
        closeButton.style = `
            background: red;
            color: white;
            border: none;
            padding: 5px 10px;
            cursor: pointer;
        `;
        closeButton.addEventListener("click", () => {
            galleryWindow.remove();
            galleryWindow = null;
        });
        header.appendChild(closeButton);

        // Crear contenedor de imágenes
        const gallery = document.createElement("div");
        gallery.style = `
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            overflow-y: auto;
        `;
        galleryWindow.appendChild(gallery);

        // Añadir cada imagen detectada
        for (const [signature, blob] of blobMap.entries()) {
            const container = document.createElement("div");
            container.style = `
                border: 1px solid #ddd;
                padding: 5px;
                text-align: center;
            `;

            // Crear miniatura de imagen
            const img = document.createElement("img");
            img.src = URL.createObjectURL(blob);
            img.style = `
                width: 150px;
                height: auto;
                cursor: pointer;
            `;
            container.appendChild(img);

            // Checkbox para selección
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.style = `
                margin-top: 10px;
            `;
            container.appendChild(checkbox);

            gallery.appendChild(container);
        }

        // Botones de acción
        const actionBar = document.createElement("div");
        actionBar.style = `
            margin-top: 20px;
            text-align: right;
        `;
        galleryWindow.appendChild(actionBar);

        // Botón de seleccionar todas
        const selectAllButton = document.createElement("button");
        selectAllButton.textContent = "Seleccionar Todas";
        selectAllButton.style = `
            background: #007bff;
            color: white;
            border: none;
            padding: 10px;
            margin-right: 10px;
            cursor: pointer;
        `;
        selectAllButton.addEventListener("click", () => {
            const checkboxes = gallery.querySelectorAll("input[type='checkbox']");
            checkboxes.forEach(checkbox => (checkbox.checked = true));
        });
        actionBar.appendChild(selectAllButton);

        // Botón de descargar seleccionadas
        const downloadButton = document.createElement("button");
        downloadButton.textContent = "Descargar Seleccionadas";
        downloadButton.style = `
            background: green;
            color: white;
            border: none;
            padding: 10px;
            cursor: pointer;
        `;
        downloadButton.addEventListener("click", () => {
            const selectedImages = Array.from(
                gallery.querySelectorAll("input[type='checkbox']:checked")
            );
            if (selectedImages.length === 0) {
                alert("No se seleccionaron imágenes para descargar.");
                return;
            }

            selectedImages.forEach((checkbox, index) => {
                const container = checkbox.closest("div");
                const imgBlob = blobMap.get(Array.from(blobMap.keys())[index]);
                const fileName = `pagina_${String(index + 1).padStart(3, "0")}.jpg`;
                downloadImage(imgBlob, fileName);
            });

            alert(`${selectedImages.length} imágenes seleccionadas y descargadas.`);
        });
        actionBar.appendChild(downloadButton);
    }

    // Función para descargar una imagen
    function downloadImage(blob, fileName) {
        const url = URL.createObjectURL(blob);
        GM_download({
            url: url,
            name: fileName,
            headers: {
                Referer: location.origin,
            },
        });
    }
})();
