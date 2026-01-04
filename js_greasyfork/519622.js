// ==UserScript==
// @name         Amazon Manga Downloader (Imagenes)
// @namespace    https://www.amazon.co.jp/
// @version      1.0
// @description  Descargar imágenes de manga de Amazon Japón y lector manga
// @author       [Tu Nombre]
// @match        https://www.amazon.co.jp/Kindle*
// @match        https://read.amazon.co.jp/sample/*
// @grant        GM_download
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/519622/Amazon%20Manga%20Downloader%20%28Imagenes%29.user.js
// @updateURL https://update.greasyfork.org/scripts/519622/Amazon%20Manga%20Downloader%20%28Imagenes%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Estilos CSS para la ventana de descargas
    GM_addStyle(`
        #downloadContainer {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid #ccc;
            border-radius: 10px;
            padding: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 10000;
        }
        #downloadContainer button {
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 8px 12px;
            cursor: pointer;
            font-size: 14px;
        }
        #downloadContainer button:hover {
            background: #45a049;
        }
        #downloadIcon {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #f90;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            cursor: pointer;
        }
    `);

    // Crear el icono flotante para activar la ventana de descargas
    const downloadIcon = document.createElement('div');
    downloadIcon.id = 'downloadIcon';
    downloadIcon.title = 'Ver imágenes descargadas';
    document.body.appendChild(downloadIcon);

    // Crear el contenedor para las imágenes y los botones
    const downloadContainer = document.createElement('div');
    downloadContainer.id = 'downloadContainer';
    downloadContainer.style.display = 'none';
    document.body.appendChild(downloadContainer);

    // Función para mostrar el contenedor de imágenes
    downloadIcon.addEventListener('click', () => {
        downloadContainer.style.display = downloadContainer.style.display === 'none' ? 'block' : 'none';
        updateDownloadContainer();
    });

    // Función para obtener las imágenes de la página
    function extractImages() {
        const images = Array.from(document.querySelectorAll('img')).filter(img => img.src.includes('cloudfront.net'));
        const imageUrls = images.map(img => img.src);

        return imageUrls;
    }

    // Función para actualizar el contenedor de imágenes
    function updateDownloadContainer() {
        downloadContainer.innerHTML = '';
        const imageUrls = extractImages();

        if (imageUrls.length === 0) {
            downloadContainer.innerHTML = 'No se detectaron imágenes.';
            return;
        }

        imageUrls.forEach((url, index) => {
            const wrapper = document.createElement('div');
            const img = document.createElement('img');
            img.src = url;
            img.width = 80;  // Tamaño de la miniatura

            const downloadButton = document.createElement('button');
            downloadButton.textContent = 'Descargar';
            downloadButton.addEventListener('click', () => {
                GM_download(url, `capitulo_${index + 1}.jpg`);
            });

            wrapper.appendChild(img);
            wrapper.appendChild(downloadButton);
            downloadContainer.appendChild(wrapper);
        });

        const downloadAllButton = document.createElement('button');
        downloadAllButton.textContent = 'Descargar todo';
        downloadAllButton.addEventListener('click', () => {
            downloadAllImages(imageUrls);
        });

        downloadContainer.appendChild(downloadAllButton);
    }

    // Función para descargar todas las imágenes
    function downloadAllImages(urls) {
        urls.forEach((url, index) => {
            GM_download({
                url: url,
                name: `capitulo_${index + 1}.jpg`,
                onerror: (e) => console.error(`Error al descargar la imagen: ${url}`, e),
            });
        });
    }

    // Detectar imágenes al cargar la página
    updateDownloadContainer();
})();
