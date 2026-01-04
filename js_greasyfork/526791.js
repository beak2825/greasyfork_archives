// ==UserScript==
// @name         Threads Video Downloader
// @namespace    https://github.com/ManoloZocco/Threads-video-downloader-userscript
// @version      1.3.11
// @description  Download photos and videos from Threads quickly and easily!
// @author       P0L1T3 aka Manolo Zocco
// @match        https://*.threads.net/*
// @connect      *
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526791/Threads%20Video%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/526791/Threads%20Video%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inserisce il CSS (prende spunto da interface.css dell'addon Firefox)
    GM_addStyle(`
.dw {
    position: absolute;
    z-index: 5;
    width: 116px;
    height: 34px;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.6);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    display: none;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    cursor: pointer;
    margin: 7px;
    border: none;
    color: #FFF;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    line-height: 22px;
    letter-spacing: -0.42px;
    bottom: 7px;
    left: 7px;
}
.dw .icon {
    background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 3v9' stroke='white' stroke-width='2' stroke-linecap='round'/%3E%3Cpath d='M6 10l4 4 4-4' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Crect x='4' y='14' width='12' height='2' fill='white'/%3E%3C/svg%3E");
    width: 20px;
    height: 20px;
    margin-right: 5px;
}
*:hover > .dw {
    display: flex;
}
.dw:hover {
    background: rgba(0, 0, 0, 0.8);
}
    `);

    // Funzione per il download: utilizza GM_download (con fallback se necessario)
    function downloadFile(url) {
        if (!url) return;
        let fileName = url.substring(url.lastIndexOf('/') + 1) || 'download';
        GM_download({
            url: url,
            name: fileName,
            onerror: function(err) {
                console.error('GM_download error:', err);
                fallbackDownload(url, fileName);
            }
        });
    }

    function fallbackDownload(url, fileName) {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            responseType: "blob",
            onload: function(response) {
                const blob = response.response;
                const blobUrl = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = blobUrl;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(blobUrl);
            },
            onerror: function(error) {
                console.error('Fallback download error:', error);
            }
        });
    }

    // Oggetto per iniettare il pulsante come fa l'addon Firefox (injector.js)
    const downloader = {
        observeDom() {
            // Per i video: usa semplicemente l'attributo "src" come fa l'addon Firefox
            document.querySelectorAll("video").forEach((video) => {
                let container = this.findRoot(video);
                if (!container) return;
                if (container.querySelector(".dw")) return;
                let url = video.getAttribute("src") || null;
                // Aggiungi il pulsante solo se l'URL contiene ".mp4"
                if (url && url.toLowerCase().indexOf(".mp4") !== -1) {
                    container.appendChild(this.getBtn(url));
                }
            });
            // Per le immagini: usa "src" e, se l'immagine è grande, la inserisce
            document.querySelectorAll("img").forEach((img) => {
                if (img.width < 200 || img.height < 200) return;
                if (img.parentElement.querySelector(".dw")) return;
                let url = img.getAttribute("src") || null;
                if (url && (url.toLowerCase().endsWith(".jpg") || url.toLowerCase().endsWith(".jpeg") ||
                            url.toLowerCase().endsWith(".png") || url.toLowerCase().endsWith(".gif"))) {
                    img.parentElement.prepend(this.getBtn(url));
                }
            });
        },
        // Crea il pulsante di download; imita getBtn dell'addon Firefox usando browser.i18n.getMessage("btn_title")
        getBtn(url) {
            let btn = document.createElement("button");
            btn.innerText = "Download";
            btn.className = "dw";
            let icon = document.createElement("span");
            icon.className = "icon";
            btn.appendChild(icon);
            btn.setAttribute("src", url);
            btn.addEventListener("click", this.dw);
            return btn;
        },
        // Cerca ricorsivamente un container adatto (come fa findRoot nell'addon Firefox)
        findRoot(el) {
            let parent = el.parentNode;
            if (!parent) return null;
            let candidate = parent.querySelector("div[data-visualcompletion]");
            return candidate || this.findRoot(parent);
        },
        // Handler del click: esegue il download inviando il "src" come fa l'addon Firefox
        dw(event) {
            event.preventDefault();
            event.stopPropagation();
            let btn = (event.target.nodeName.toLowerCase() === "button") ? event.target : event.target.parentElement;
            let url = btn.hasAttribute("src") ? btn.getAttribute("src") : null;
            if (url) {
                downloadFile(url);
            }
        }
    };

    // Inietta il pulsante a intervalli (simile al setInterval in injector.js)
    function init() {
        downloader.observeDom();
    }
    setInterval(init, 500);
    new MutationObserver(init).observe(document.body, { childList: true, subtree: true });
})();
