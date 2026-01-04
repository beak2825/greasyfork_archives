// ==UserScript==
// @name         MangaPlus Blob Downloader
// @namespace    shadows
// @version      1.7.3
// @description  Descarga imágenes grandes del manga desde MangaPlus, capturando solo imágenes únicas de tipo Blob.
// @author       shadows
// @license      MIT
// @match        https://mangaplus.shueisha.co.jp/*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/518842/MangaPlus%20Blob%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/518842/MangaPlus%20Blob%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let blobs = [];
    let imageHashes = new Set();  // Para hacer seguimiento de imágenes únicas por hash
    let downloadedCount = 0;

    // Función para calcular hash a partir de un blob
    async function hashBlob(blob) {
        const arrayBuffer = await blob.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    // Función para guardar blobs como archivos PNG
    function saveBlob(blob, filename) {
        const blobUrl = URL.createObjectURL(blob);
        GM_download({
            url: blobUrl,
            name: filename,
            saveAs: false
        });
    }

    // Función para descargar las imágenes una por una
    function downloadSequentially(index) {
        if (index >= blobs.length) {
            alert(`Descargadas todas las ${blobs.length} imágenes.`);
            return;
        }

        const filename = `pagina-${index + 1}.png`;
        const blob = blobs[index];
        saveBlob(blob, filename);
        downloadedCount++;

        console.log(`Descargada ${filename}`);

        setTimeout(() => {
            downloadSequentially(index + 1);
        }, 1000);  // 1 segundo de retraso entre descargas
    }

    // Función para descargar todas las imágenes almacenadas en blobs
    function downloadImages() {
        if (blobs.length === 0) {
            alert("No se encontraron imágenes. Intenta desplazarte manualmente y vuelve a intentarlo.");
            return;
        }

        downloadedCount = 0;
        downloadSequentially(0);
    }

    // Interceptar la creación de URL para Blob y almacenar blobs únicos
    const originalCreateObjectURL = URL.createObjectURL;
    URL.createObjectURL = function(blob) {
        const url = originalCreateObjectURL(blob);
        if (blob.type.startsWith('image/')) {
            hashBlob(blob).then(hash => {
                if (!imageHashes.has(hash)) {  // Verificar si el hash es único
                    blobs.push(blob);  // Guardar el blob único
                    imageHashes.add(hash);  // Añadir hash al conjunto
                    console.log(`Capturado blob de imagen único: ${url} (hash: ${hash})`);
                } else {
                    console.log(`Blob de imagen duplicado omitido: ${url} (hash: ${hash})`);
                }
            });
        }
        return url;
    };

    // Crear un botón para descargar
    function createDownloadButton() {
        const button = document.createElement('button');
        button.innerText = "Descargar todas las imágenes";
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.style.padding = '10px 20px';
        button.style.backgroundColor = '#28a745';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.fontSize = '16px';
        button.style.fontWeight = 'bold';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        document.body.appendChild(button);

        button.addEventListener('click', () => {
            console.log("Botón de descarga pulsado");
            downloadImages();
        });
    }

    // Comprobar si la página está lista y crear el botón
    const interval = setInterval(() => {
        if (document.readyState === "complete") {
            clearInterval(interval);
            console.log("Página completamente cargada, inicializando script.");
            createDownloadButton();
        }
    }, 1000);
})();
