// ==UserScript==
// @name         Viz Manga Universal Downloader (CORS Fix)
// @namespace    shadows
// @version      203.2.3
// @description  Descarga capítulos de Viz, permite recomponer <img> evitando CORS/hotlinking, enviando cookies y referer.
// @author       
// @license      MIT
// @match        https://www.viz.com/vizmanga/*
// @match        https://www.viz.com/shonenjump/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @connect      viz.com
// @connect      cdn.viz.com
// @connect      i0.viz.com
// @connect      i1.viz.com
// @connect      i2.viz.com
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/526722/Viz%20Manga%20Universal%20Downloader%20%28CORS%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/526722/Viz%20Manga%20Universal%20Downloader%20%28CORS%20Fix%29.meta.js
// ==/UserScript==
"use strict";

(function() {
    // --- Crear panel de opciones flotante ---
    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.top = '10px';
    panel.style.right = '10px';
    panel.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    panel.style.color = '#fff';
    panel.style.padding = '10px';
    panel.style.zIndex = '10000';
    panel.style.borderRadius = '5px';
    panel.style.fontSize = '13px';
    panel.style.maxWidth = '300px';
    panel.style.lineHeight = '1.4';
    panel.innerHTML = "<strong>Viz Manga Downloader</strong><br>";

    // Botón: Descargar Capítulo (todas las <img>)
    const downloadChapterButton = document.createElement('button');
    downloadChapterButton.textContent = 'Descargar Capítulo';
    downloadChapterButton.style.margin = "3px";
    panel.appendChild(downloadChapterButton);

    // Botón: Auto-Descargar (activar/desactivar con IntersectionObserver)
    const autoDownloadToggle = document.createElement('button');
    autoDownloadToggle.textContent = 'Auto-Descargar: OFF';
    autoDownloadToggle.style.margin = "3px";
    panel.appendChild(autoDownloadToggle);

    // Botón: Actualizar lista de imágenes (selección manual)
    const updateListButton = document.createElement('button');
    updateListButton.textContent = 'Actualizar lista';
    updateListButton.style.margin = "3px";
    panel.appendChild(updateListButton);

    // Botón: Descargar seleccionados
    const downloadSelectedButton = document.createElement('button');
    downloadSelectedButton.textContent = 'Descargar seleccionados';
    downloadSelectedButton.style.margin = "3px";
    panel.appendChild(downloadSelectedButton);

    // Botón: Recomponer <img> (GM_xhr con cookies/referer)
    const reassemblePuzzleButton = document.createElement('button');
    reassemblePuzzleButton.textContent = 'Recomponer <img> (GM_xhr)';
    reassemblePuzzleButton.style.margin = "3px";
    panel.appendChild(reassemblePuzzleButton);

    // Contenedor para la lista de imágenes con checkboxes
    const imageListContainer = document.createElement('div');
    imageListContainer.style.maxHeight = '200px';
    imageListContainer.style.overflowY = 'auto';
    imageListContainer.style.marginTop = '5px';
    panel.appendChild(imageListContainer);

    document.body.appendChild(panel);

    // --- Función para descargar una imagen usando GM_download ---
    function descargarImagen(url, nombre) {
        GM_download({
            url: url,
            name: nombre,
            onerror: err => console.error('Error al descargar', url, err),
            onload: () => console.log('Descargado:', url)
        });
    }

    // --- Botón: Descargar Capítulo (todas las <img>) ---
    downloadChapterButton.addEventListener('click', function() {
        const images = document.querySelectorAll('img');
        let count = 0;
        images.forEach((img, index) => {
            if (img.src) {
                const nombre = `page-${index + 1}.jpg`;
                descargarImagen(img.src, nombre);
                count++;
            }
        });
        alert(`Iniciada descarga de ${count} imágenes.`);
    });

    // --- Auto-Descargar usando IntersectionObserver ---
    let autoDownloadEnabled = false;
    autoDownloadToggle.addEventListener('click', function() {
        autoDownloadEnabled = !autoDownloadEnabled;
        autoDownloadToggle.textContent = `Auto-Descargar: ${autoDownloadEnabled ? 'ON' : 'OFF'}`;
    });

    const descargadas = new Set(); // Para evitar descargas duplicadas
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && autoDownloadEnabled) {
                const img = entry.target;
                if (img.src && !descargadas.has(img.src)) {
                    descargadas.add(img.src);
                    const nombre = `auto-${Date.now()}-${Math.random().toString(36).substr(2,6)}.jpg`;
                    descargarImagen(img.src, nombre);
                }
            }
        });
    }, { threshold: 0.5 });

    // Observar todas las imágenes existentes
    function observarImagenes() {
        document.querySelectorAll('img').forEach(img => {
            observer.observe(img);
        });
    }
    observarImagenes();

    // Observar dinámicamente si se agregan imágenes
    const mutationObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.tagName === 'IMG') {
                        observer.observe(node);
                    } else {
                        node.querySelectorAll('img').forEach(img => observer.observe(img));
                    }
                }
            });
        });
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    // --- Actualizar lista de imágenes para selección manual ---
    updateListButton.addEventListener('click', function() {
        imageListContainer.innerHTML = ''; // Limpiar lista actual
        const images = document.querySelectorAll('img');
        images.forEach((img, index) => {
            if (img.src) {
                const label = document.createElement('label');
                label.style.display = 'block';
                label.style.marginBottom = '3px';
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = true;
                checkbox.dataset.url = img.src;
                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(` Imagen ${index + 1}`));
                imageListContainer.appendChild(label);
            }
        });
    });

    // --- Descargar imágenes seleccionadas ---
    downloadSelectedButton.addEventListener('click', function() {
        const checkboxes = imageListContainer.querySelectorAll('input[type="checkbox"]');
        let count = 0;
        checkboxes.forEach((checkbox, index) => {
            if (checkbox.checked) {
                const url = checkbox.dataset.url;
                const nombre = `selected-${index + 1}.jpg`;
                descargarImagen(url, nombre);
                count++;
            }
        });
        alert(`Iniciada descarga de ${count} imágenes seleccionadas.`);
    });

    // --- Botón para recomponer la página dividida en varios <img> (usando GM_xmlhttpRequest con cookies/referer) ---
    reassemblePuzzleButton.addEventListener('click', async function() {
        try {
            await reassemblePuzzleFromImgs();
        } catch (e) {
            console.error(e);
            alert("Error inesperado al recomponer la imagen.");
        }
    });

    async function reassemblePuzzleFromImgs() {
        // Ajusta este selector si quieres filtrar <img> de un contenedor específico
        const puzzleImgs = Array.from(document.querySelectorAll('img'));
        if (!puzzleImgs.length) {
            alert("No se encontraron <img> para recomponer.");
            return;
        }

        // 1. Calcular bounding box
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        puzzleImgs.forEach(img => {
            const rect = img.getBoundingClientRect();
            if (rect.left < minX) minX = rect.left;
            if (rect.top < minY) minY = rect.top;
            if (rect.right > maxX) maxX = rect.right;
            if (rect.bottom > maxY) maxY = rect.bottom;
        });

        const totalWidth = Math.ceil(maxX - minX);
        const totalHeight = Math.ceil(maxY - minY);
        if (totalWidth <= 0 || totalHeight <= 0) {
            alert("Las dimensiones calculadas son inválidas. ¿Están las imágenes visibles en pantalla?");
            return;
        }

        // 2. Crear canvas
        const canvas = document.createElement('canvas');
        canvas.width = totalWidth;
        canvas.height = totalHeight;
        const ctx = canvas.getContext('2d');

        // 3. Cargar cada <img> con GM_xmlhttpRequest (enviando cookies y referer)
        const promises = puzzleImgs.map(img => {
            return loadImageWithGM(img.src).then(loadedImg => {
                return { el: img, img: loadedImg };
            });
        });

        let loadedImages;
        try {
            loadedImages = await Promise.all(promises);
        } catch (err) {
            alert("Error al cargar una de las imágenes (CORS/hotlinking).");
            console.error(err);
            return;
        }

        // 4. Dibujar cada imagen en su posición
        loadedImages.forEach(obj => {
            const { el, img } = obj;
            const rect = el.getBoundingClientRect();
            const offsetX = Math.round(rect.left - minX);
            const offsetY = Math.round(rect.top - minY);
            ctx.drawImage(img, offsetX, offsetY, rect.width, rect.height);
        });

        // 5. Descargar resultado
        canvas.toBlob(blob => {
            const blobUrl = URL.createObjectURL(blob);
            GM_download({
                url: blobUrl,
                name: 'recomposed_page.png',
                onerror: err => {
                    console.error("Error descargando la imagen recompuesta:", err);
                },
                onload: () => {
                    console.log("Imagen recompuesta descargada correctamente.");
                    URL.revokeObjectURL(blobUrl);
                }
            });
        });
    }

    /**
     * Carga una imagen usando GM_xmlhttpRequest, enviando cookies y referer.
     * Devuelve una Promise que resuelve con un objeto Image listo para dibujar.
     */
    function loadImageWithGM(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'blob',
                // Enviar cookies y referer
                withCredentials: true,
                headers: {
                    "Referer": location.href
                },
                onload: function(response) {
                    if (response.status !== 200) {
                        reject(new Error('Status code ' + response.status + ' al cargar ' + url));
                        return;
                    }
                    const blob = response.response;
                    const objectURL = URL.createObjectURL(blob);
                    const img = new Image();
                    // Ya es un blob local, no hace falta crossOrigin
                    img.onload = () => {
                        URL.revokeObjectURL(objectURL);
                        resolve(img);
                    };
                    img.onerror = err => {
                        URL.revokeObjectURL(objectURL);
                        reject(err);
                    };
                    img.src = objectURL;
                },
                onerror: function(err) {
                    reject(err);
                }
            });
        });
    }
})();
