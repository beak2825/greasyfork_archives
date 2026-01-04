// ==UserScript==
// @name            Rai Play video download
// @namespace       Rai 2025 Video
// @version         1.0
// @description     This script allows you to download videos on Rai Play
// @description:it  Questo script ti permette di scaricare i video su Rai Play
// @license         GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @match        *://*.raiplay.it/*
// @author          Science
// @downloadURL https://update.greasyfork.org/scripts/525796/Rai%20Play%20video%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/525796/Rai%20Play%20video%20download.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const interceptedUrls = new Set();

    // Funzione per creare un box informativo con 2 pulsanti
    function createInfoBox(m3u8Url) {
        const existing = document.getElementById('videoUrlInfo');
        if (existing) existing.remove();

        const box = document.createElement('div');
        box.id = 'videoUrlInfo';
        box.style = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: white;
            padding: 15px;
            z-index: 999999;
            border: 2px solid green;
            max-width: 600px;
            font-family: Arial, sans-serif;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
        `;

        box.innerHTML = `
            <h3 style="margin-top:0;color:#4CAF50">URL .m3u8 Rilevato</h3>
            <input type="text" 
                   value="${m3u8Url}" 
                   style="width:100%; margin-bottom:10px;" 
                   readonly>
            <button onclick="downloadM3U8('${m3u8Url}')"
                    style="margin-right:10px; background-color: #4CAF50; color: white; border: none; padding: 5px 10px; cursor: pointer;">
                Scarica .m3u8
            </button>
            <button onclick="copyToClipboard('${m3u8Url}')"
                    style="margin-right:10px; background-color: #2196F3; color: white; border: none; padding: 5px 10px; cursor: pointer;">
                Copia URL
            </button>
            <button onclick="this.parentNode.remove()"
                    style="background-color: #f44336; color: white; border: none; padding: 5px 10px; cursor: pointer;">
                Chiudi
            </button>
        `;

        document.body.appendChild(box);
    }

    // Funzione per scaricare il file .m3u8
    function downloadM3U8(url) {
        const filename = url.split('/').pop().split('?')[0] || 'playlist.m3u8';
        GM_download({
            url: url,
            name: filename,
            onload: () => GM_notification({ title: 'Download Completato', text: `File salvato come ${filename}` }),
            onerror: (e) => GM_notification({ title: 'Errore', text: `Download fallito: ${e.error}` })
        });
    }

    // Funzione per copiare l'URL negli appunti
    function copyToClipboard(text) {
        GM_setClipboard(text, 'text');
        GM_notification({ title: 'URL Copiato', text: 'L\'URL è stato copiato negli appunti.' });
    }

    // Intercetta le richieste XMLHttpRequest
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (url && url.includes('.m3u8')) {
            this.addEventListener('load', function() {
                if (!interceptedUrls.has(url)) {
                    interceptedUrls.add(url);
                    createInfoBox(url);
                }
            });
        }
        originalOpen.apply(this, arguments);
    };

    // Intercetta le richieste fetch
    const originalFetch = window.fetch;
    window.fetch = function(input, init) {
        const url = typeof input === 'string' ? input : input.url;
        if (url && url.includes('.m3u8')) {
            return originalFetch.apply(this, arguments).then(response => {
                if (!interceptedUrls.has(url)) {
                    interceptedUrls.add(url);
                    createInfoBox(url);
                }
                return response;
            });
        }
        return originalFetch.apply(this, arguments);
    };

    // Periodicamente controlla elementi video
    setInterval(() => {
        document.querySelectorAll('video').forEach(video => {
            if (video.src && video.src.includes('.m3u8') && !interceptedUrls.has(video.src)) {
                interceptedUrls.add(video.src);
                createInfoBox(video.src);
            }
        });
    }, 3000);
})();