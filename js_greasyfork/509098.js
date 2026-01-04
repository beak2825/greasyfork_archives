// ==UserScript==
// @name         Ansa - Video Downloader 
// @namespace    https://greasyfork.org/it/users/79810-sciencefun
// @version      0.2
// @description  Aggiungi un pulsante di download per i video su ANSA.it
// @author       Science
// @match        https://www.ansa.it/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @license      GPL version 3 or later
// @downloadURL https://update.greasyfork.org/scripts/509098/Ansa%20-%20Video%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/509098/Ansa%20-%20Video%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funzione per creare il pulsante di download
    function addOverlayDownloadButton(videoUrl) {
        const buttonId = 'overlay-download-button';
        if ($("#" + buttonId).length === 0) {
            const button = $(`<button id="${buttonId}" style="position: fixed; bottom: 10px; left: 10px; padding: 10px; background: #28a745; color: #fff; border: none; border-radius: 5px; z-index: 1000; cursor: pointer;">
                Scarica Video
            </button>`);
            $("body").append(button);

            // Assegna la funzione di download al pulsante
            $("#" + buttonId).click(() => {
                if (videoUrl) {
                    GM_download(videoUrl, 'video.mp4');
                } else {
                    alert('Nessun video trovato!');
                }
            });
        }
    }

    // Funzione per trovare l'URL del video dal tag video o sorgenti nella pagina
    function findVideoUrl() {
        let videoUrl = null;
        const videoElement = document.querySelector('video');

        if (videoElement) {
            // Verifica se l'elemento video contiene una sorgente diretta
            const sourceElement = videoElement.querySelector('source');
            if (sourceElement && sourceElement.src) {
                videoUrl = sourceElement.src;
            } else if (videoElement.src) {
                videoUrl = videoElement.src;
            }
        }

        // Se non viene trovato un video nell'elemento video, prova a intercettare richieste di rete
        if (!videoUrl) {
            const xhrOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function(method, url) {
                if (url.match(/\.(mp4|m3u8)(\?.*)?$/i)) {
                    videoUrl = url;
                    addOverlayDownloadButton(videoUrl); // Aggiungi pulsante con l'URL trovato
                }
                return xhrOpen.apply(this, arguments);
            };

            const originalFetch = window.fetch;
            window.fetch = function() {
                const args = arguments;
                const url = args[0];
                if (url && typeof url === 'string' && url.match(/\.(mp4|m3u8)(\?.*)?$/i)) {
                    videoUrl = url;
                    addOverlayDownloadButton(videoUrl); // Aggiungi pulsante con l'URL trovato
                }
                return originalFetch.apply(this, arguments);
            };
        }

        // Aggiunge il pulsante con l'URL trovato
        addOverlayDownloadButton(videoUrl);
    }

    // Inizializza lo script quando la pagina è pronta
    $(document).ready(() => {
        findVideoUrl();
    });
})();
