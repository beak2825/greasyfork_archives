// ==UserScript==
// @name         YouTube MP3 Downloader with Image Button
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Adds a button with an image to download the currently playing video as MP3 on the left of the video title. Displays a widget with download information and progress instead of opening a localhost page.
// @author       ig:Fobiksw and chatgpt
// @license MIT
// @match        *://*.youtube.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/508597/YouTube%20MP3%20Downloader%20with%20Image%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/508597/YouTube%20MP3%20Downloader%20with%20Image%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addDownloadButton() {
        if (document.querySelector("#mp3-download-btn")) return;

        const titleContainer = document.querySelector('yt-formatted-string.style-scope.ytd-watch-metadata');
        if (!titleContainer) return;

        const button = document.createElement('button');
        button.id = 'mp3-download-btn';
        button.style.marginRight = '10px';
        button.style.padding = '0';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.style.background = `url('https://store-images.s-microsoft.com/image/apps.56277.14205055896346606.c235e3d6-fbce-45bb-9051-4be6c2ecba8f.e2bf2002-8688-47f3-9312-10b48d2e2644') no-repeat center center`;
        button.style.backgroundSize = 'contain';
        button.style.width = '18px';
        button.style.height = '18px';

        button.onclick = function() {
            const videoUrl = window.location.href;
            showDownloadWidget();
            GM_xmlhttpRequest({
                method: 'GET',
                url: `http://localhost:8000/download?video_url=${encodeURIComponent(videoUrl)}`,
                onload: function(response) {
                    const data = JSON.parse(response.responseText);
                    if (data.estimated_time) {
                        updateProgressText(`Pobieranie... (${data.estimated_time} sek)`);
                    }
                    hideDownloadWidget(); // Hide widget immediately after download
                },
                onerror: function() {
                    hideDownloadWidget(); // Hide widget if an error occurs
                }
            });
        };

        titleContainer.parentElement.insertBefore(button, titleContainer);
    }

    function showDownloadWidget() {
        if (document.querySelector("#download-widget")) return;

        const widget = document.createElement('div');
        widget.id = 'download-widget';
        widget.style.position = 'fixed';
        widget.style.top = '50%';
        widget.style.left = '50%';
        widget.style.transform = 'translate(-50%, -50%)';
        widget.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        widget.style.color = 'white';
        widget.style.padding = '10px';
        widget.style.borderRadius = '5px';
        widget.style.zIndex = '9999';
        widget.style.display = 'flex';
        widget.style.flexDirection = 'column';
        widget.style.alignItems = 'center';
        widget.style.gap = '10px';

        const spinner = document.createElement('div');
        spinner.style.border = '3px solid rgba(255, 255, 255, 0.3)';
        spinner.style.borderRadius = '50%';
        spinner.style.borderTop = '3px solid #fff';
        spinner.style.width = '20px';
        spinner.style.height = '20px';
        spinner.style.animation = 'spin 1s linear infinite';

        const progress = document.createElement('div');
        progress.id = 'download-progress';
        progress.textContent = 'Pobieranie...';

        widget.appendChild(spinner);
        widget.appendChild(progress);
        document.body.appendChild(widget);

        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    function hideDownloadWidget() {
        const widget = document.querySelector("#download-widget");
        if (widget) {
            widget.remove();
        }
    }

    function updateProgressText(text) {
        const progress = document.querySelector('#download-progress');
        if (progress) {
            progress.textContent = text;
        }
    }

    const observer = new MutationObserver(addDownloadButton);
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('load', addDownloadButton);
})();
