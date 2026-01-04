// ==UserScript==
// @name         Viz Manga Universal Downloader v10.2.1
// @namespace    shadows
// @version      10.2.1
// @description  Descarga capítulos completos de Viz Manga y Shonen Jump, permitiendo seleccionar imágenes y recomponer imágenes en forma de rompecabezas.
// @author       
// @license      MIT
// @match        https://www.viz.com/vizmanga/*
// @match        https://www.viz.com/shonenjump/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @connect      viz.com
// @downloadURL https://update.greasyfork.org/scripts/526848/Viz%20Manga%20Universal%20Downloader%20v1021.user.js
// @updateURL https://update.greasyfork.org/scripts/526848/Viz%20Manga%20Universal%20Downloader%20v1021.meta.js
// ==/UserScript==
"use strict";

/**
 * Nota:
 * - Se asume que las imágenes de manga se encuentran en etiquetas <img>.
 * - Si el sitio utiliza <canvas> u otra técnica (por ejemplo, fragmentos reordenados o encriptados),
 *   se incluye la opción de recomponer la imagen “rompecabezas”. Ajusta los selectores según el caso.
 */

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

    // Botón: Descargar Capítulo (todas las imágenes en <img>)
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

    // Botón: Recomponer Imagen Puzzle
    const reassemblePuzzleButton = document.createElement('button');
    reassemblePuzzleButton.textContent = 'Recomponer Imagen Puzzle';
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

    // --- Botón: Descargar Capítulo ---
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
                    // Nombre personalizado (timestamp)
                    const nombre = `auto-${Date.now()}-${Math.random().toString(36).substr(2,6)}.jpg`;
                    descargarImagen(img.src, nombre);
                }
            }
        });
    }, { threshold: 0.5 });

    function observarImagenes() {
        document.querySelectorAll('img').forEach(img => {
            observer.observe(img);
        });
    }
    observarImagenes();

    // Si se agregan imágenes dinámicamente, se vuelven a observar
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

    // --- Recomponer Imagen Puzzle ---
    reassemblePuzzleButton.addEventListener('click', async function() {
        await reassemblePuzzleImage();
    });

    async function reassemblePuzzleImage() {
         // Se asume que el contenedor de la imagen puzzle tiene la clase 'puzzle-container'
         const container = document.querySelector('.puzzle-container');
         if (!container) {
             alert("No se encontró el contenedor de la imagen puzzle. Asegúrate de que el contenedor tenga la clase 'puzzle-container'.");
             return;
         }
         // Obtener dimensiones del contenedor
         const containerRect = container.getBoundingClientRect();
         const width = containerRect.width;
         const height = containerRect.height;

         // Crear canvas con dimensiones del contenedor
         const canvas = document.createElement('canvas');
         canvas.width = width;
         canvas.height = height;
         const ctx = canvas.getContext('2d');

         // Buscar elementos dentro del contenedor que tengan un background-image (fragmentos)
         const fragments = container.querySelectorAll('*');
         const fragmentElements = Array.from(fragments).filter(el => {
              const bg = window.getComputedStyle(el).backgroundImage;
              return bg && bg !== 'none';
         });
         if (fragmentElements.length === 0) {
             alert("No se encontraron fragmentos de imagen con background-image dentro del contenedor.");
             return;
         }

         // Asumir que todos los fragmentos usan la misma imagen base.
         const firstBg = window.getComputedStyle(fragmentElements[0]).backgroundImage;
         const urlMatch = firstBg.match(/url\(["']?(.*?)["']?\)/);
         if (!urlMatch) {
             alert("No se pudo extraer la URL de la imagen del primer fragmento.");
             return;
         }
         const imageUrl = urlMatch[1];
         let baseImage;
         try {
             baseImage = await loadImage(imageUrl);
         } catch (err) {
             alert("Error al cargar la imagen base del puzzle.");
             console.error(err);
             return;
         }

         // Para cada fragmento, obtener la posición del background y sus dimensiones
         fragmentElements.forEach(el => {
             const style = window.getComputedStyle(el);
             const pos = style.backgroundPosition.split(' ');
             // Se asume que la posición viene en píxeles (ej: "-100px -50px")
             let posX = parseFloat(pos[0]);
             let posY = parseFloat(pos[1]);
             // Obtener dimensiones del fragmento
             const fragRect = el.getBoundingClientRect();
             const fragWidth = fragRect.width;
             const fragHeight = fragRect.height;
             // Posición relativa del fragmento respecto al contenedor
             const containerRectLocal = container.getBoundingClientRect();
             const offsetX = fragRect.left - containerRectLocal.left;
             const offsetY = fragRect.top - containerRectLocal.top;

             // Dibujar la porción correspondiente de la imagen base en el canvas.
             // Se utiliza Math.abs para convertir valores negativos a positivos.
             ctx.drawImage(
                 baseImage,
                 Math.abs(posX),
                 Math.abs(posY),
                 fragWidth,
                 fragHeight,
                 offsetX,
                 offsetY,
                 fragWidth,
                 fragHeight
             );
         });

         // Convertir el canvas a un blob y descargar la imagen recompuesta
         canvas.toBlob(blob => {
             const blobUrl = URL.createObjectURL(blob);
             GM_download({
                 url: blobUrl,
                 name: 'puzzle_recomposed.png',
                 onerror: err => console.error("Error en la descarga de la imagen puzzle recompuesta:", err),
                 onload: () => {
                     console.log("Imagen puzzle recompuesta descargada correctamente.");
                     URL.revokeObjectURL(blobUrl);
                 }
             });
         });
    }

    // Función auxiliar para cargar una imagen (devuelve una promesa)
    function loadImage(url) {
         return new Promise((resolve, reject) => {
             const img = new Image();
             img.crossOrigin = "Anonymous";
             img.onload = () => resolve(img);
             img.onerror = err => reject(err);
             img.src = url;
         });
    }
})();
