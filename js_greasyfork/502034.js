// ==UserScript==
// @name         Kemono.su y Coomer.su Image Downloader
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Añade botones para descargar todas las imágenes o todos los posts de kemono.su y coomer.su, con soporte multilenguaje, selección de carpeta de descarga, y opción para copiar URLs al portapapeles
// @author       luis123456xp
// @license      MIT
// @match        https://kemono.su/*/user/*
// @match        https://coomer.su/*/user/*
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/502034/Kemonosu%20y%20Coomersu%20Image%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/502034/Kemonosu%20y%20Coomersu%20Image%20Downloader.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    // Detectar el idioma del navegador
    const userLang = navigator.language || navigator.userLanguage;

    // Definir textos en ambos idiomas
    const texts = {
        en: {
            downloadImagesButton: "Download Images",
            downloadAllPostsButton: "Download All Posts",
            progressLabel: "Downloaded: {0} / Total: {1}",
            noImagesFound: "No images found to download",
            noPostsFound: "No posts found to download",
            downloadFinished: "Download Finished",
            allPostsDownloadFinished: "Download of all posts finished",
            setDownloadFolder: "Set Download Folder",
            toggleCopyURLs: "Toggle Copy URLs to Clipboard",
            urlsCopied: "Image URLs copied to clipboard"
        },
        es: {
            downloadImagesButton: "Descargar imágenes",
            downloadAllPostsButton: "Descargar Todos los Post",
            progressLabel: "Descargados: {0} / Total: {1}",
            noImagesFound: "No se encontraron imágenes para descargar",
            noPostsFound: "No se encontraron posts para descargar",
            downloadFinished: "Descarga Finalizada",
            allPostsDownloadFinished: "Descarga de todos los posts finalizada",
            setDownloadFolder: "Configurar Carpeta de Descarga",
            toggleCopyURLs: "Activar/Desactivar Copiar URLs al Portapapeles",
            urlsCopied: "URLs de imágenes copiadas al portapapeles"
        }
    };

    // Seleccionar el idioma apropiado, por defecto inglés
    const lang = userLang.startsWith('es') ? texts.es : texts.en;

    // Leer la configuración de carpeta de descarga y el estado de copiar URLs
    let downloadFolder = GM_getValue('downloadFolder', '');
    let copyURLs = GM_getValue('copyURLs', false);

    // Registrar el comando de menú para cambiar la carpeta de descarga
    GM_registerMenuCommand(lang.setDownloadFolder, () => {
        const folder = prompt(lang.setDownloadFolder, downloadFolder);
        if (folder !== null) {
            downloadFolder = folder;
            GM_setValue('downloadFolder', downloadFolder);
            alert(lang.setDownloadFolder + ": " + downloadFolder);
        }
    });

    // Registrar el comando de menú para activar/desactivar copiar URLs
    GM_registerMenuCommand(lang.toggleCopyURLs, () => {
        copyURLs = !copyURLs;
        GM_setValue('copyURLs', copyURLs);
        alert(lang.toggleCopyURLs + ": " + (copyURLs ? 'ON' : 'OFF'));
    });

    // Si la URL contiene 'post/', agregar botón para descargar imágenes de ese post
    if (window.location.href.includes('/post/')) {
        addDownloadImagesButton();
    } else if (window.location.href.includes('/user/')) {
        addDownloadAllPostsButton();
    }

    function addDownloadImagesButton() {
        var downloadButton = $(`<button id="downloadImagesButton" style="position:fixed; top:10px; right:10px; z-index:9999;">${lang.downloadImagesButton}</button>`);
        var progressLabel = $('<div id="progressLabel" style="position:fixed; top:40px; right:10px; z-index:9999;"></div>');
        $('body').append(downloadButton, progressLabel);

        $('#downloadImagesButton').on('click', function() {
            console.log('Iniciando la descarga de imágenes');
            downloadImages(progressLabel);
        });

        function downloadImages(progressLabel) {
            const images = $('div.post__files a.fileThumb').map(function() {
                return $(this).attr('href');
            }).get();

            const totalImages = images.length;
            let downloadedImages = 0;

            if (totalImages === 0) {
                alert(lang.noImagesFound);
                return;
            }

            if (copyURLs) {
                GM_setClipboard(images.join('\n'));
                alert(lang.urlsCopied);
                console.log(lang.urlsCopied);
                return;
            }

            progressLabel.text(lang.progressLabel.replace('{0}', downloadedImages).replace('{1}', totalImages));
            console.log(`Total de imágenes encontradas: ${totalImages}`);

            images.forEach((imgSrc, index) => {
                const imageName = imgSrc.split('/').pop();
                const fullPath = downloadFolder ? `${downloadFolder}/${imageName}` : imageName;

                GM_download({
                    url: imgSrc,
                    name: fullPath,
                    onload: function() {
                        downloadedImages++;
                        progressLabel.text(lang.progressLabel.replace('{0}', downloadedImages).replace('{1}', totalImages));
                        console.log(`Descargada imagen ${downloadedImages}/${totalImages}: ${imgSrc}`);
                        if (downloadedImages === totalImages) {
                            alert(lang.downloadFinished);
                        }
                    },
                    onerror: function(error) {
                        console.log(`Error al descargar la imagen ${imgSrc}:`, error);
                        if (downloadedImages + 1 === totalImages) {
                            alert(lang.downloadFinished);
                        }
                    }
                });

                console.log(`Iniciando descarga de imagen ${index + 1}/${totalImages}: ${imgSrc}`);
            });
        }
    }

    function addDownloadAllPostsButton() {
        var downloadAllPostsButton = $(`<button id="downloadAllPostsButton" style="position:fixed; top:50px; right:10px; z-index:9999;">${lang.downloadAllPostsButton}</button>`);
        var progressLabel = $('<div id="progressLabelAllPosts" style="position:fixed; top:80px; right:10px; z-index:9999;"></div>');
        $('body').append(downloadAllPostsButton, progressLabel);

        $('#downloadAllPostsButton').on('click', function() {
            console.log('Iniciando la descarga de todos los posts');
            downloadAllPosts(progressLabel);
        });

        function downloadAllPosts(progressLabel) {
            const postLinks = $('a[href*="/post/"]').map(function() {
                return $(this).attr('href');
            }).get();

            const totalPosts = postLinks.length;
            let totalImages = 0;
            let downloadedImages = 0;
            let processedPosts = 0;
            let allImageURLs = [];

            console.log(`Total de posts encontrados: ${totalPosts}`);

            if (totalPosts === 0) {
                alert(lang.noPostsFound);
                return;
            }

            const promises = postLinks.map((postUrl, index) => {
                return fetch(postUrl)
                    .then(response => response.text())
                    .then(html => {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, 'text/html');
                        const images = $(doc).find('div.post__files a.fileThumb').map(function() {
                            return $(this).attr('href');
                        }).get();

                        allImageURLs = allImageURLs.concat(images);
                        totalImages += images.length;

                        if (!copyURLs) {
                            images.forEach((imgSrc) => {
                                const imageName = imgSrc.split('/').pop();
                                const fullPath = downloadFolder ? `${downloadFolder}/${imageName}` : imageName;

                                GM_download({
                                    url: imgSrc,
                                    name: fullPath,
                                    onload: function() {
                                        downloadedImages++;
                                        progressLabel.text(lang.progressLabel.replace('{0}', downloadedImages).replace('{1}', totalImages));
                                        if (downloadedImages === totalImages && processedPosts === totalPosts) {
                                            alert(lang.allPostsDownloadFinished);
                                        }
                                    },
                                    onerror: function(error) {
                                        console.log(`Error al descargar la imagen ${imgSrc}:`, error);
                                        downloadedImages++;
                                        progressLabel.text(lang.progressLabel.replace('{0}', downloadedImages).replace('{1}', totalImages));
                                        if (downloadedImages === totalImages && processedPosts === totalPosts) {
                                            alert(lang.allPostsDownloadFinished);
                                        }
                                    }
                                });
                            });
                        }

                        processedPosts++;
                    })
                    .catch(error => {
                        console.log(`Error al obtener el contenido del post ${postUrl}:`, error);
                        processedPosts++;
                    });
            });

            Promise.all(promises).then(() => {
                if (copyURLs) {
                    GM_setClipboard(allImageURLs.join('\n'));
                    alert(lang.urlsCopied);
                    console.log(lang.urlsCopied);
                } else {
                    if (processedPosts === totalPosts && downloadedImages === totalImages) {
                        alert(lang.allPostsDownloadFinished);
                    }
                }
            });
        }
    }
})(window.jQuery);
