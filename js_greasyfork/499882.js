// ==UserScript==
// @name         Soundsnap Audio Downloader
// @namespace    https://github.com/GooglyBlox/free-soundsnap-audios
// @version      1.0
// @description  Directly download audio from Soundsnap without a premium account.
// @author       GooglyBlox
// @match        https://www.soundsnap.com/*
// @icon         https://raw.githubusercontent.com/GooglyBlox/free-soundsnap-audios/main/public/favicon.ico
// @grant        GM_xmlhttpRequest
// @license      CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499882/Soundsnap%20Audio%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/499882/Soundsnap%20Audio%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_ENDPOINT = 'https://free-soundsnap-audios.vercel.app/api/getAudioSource';

    function createLoadingOverlay() {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '9999';

        const spinner = document.createElement('div');
        spinner.style.border = '5px solid #f3f3f3';
        spinner.style.borderTop = '5px solid #3498db';
        spinner.style.borderRadius = '50%';
        spinner.style.width = '50px';
        spinner.style.height = '50px';
        spinner.style.animation = 'spin 1s linear infinite';

        const keyframes = document.createElement('style');
        keyframes.innerHTML = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;

        document.head.appendChild(keyframes);
        overlay.appendChild(spinner);
        document.body.appendChild(overlay);

        return overlay;
    }

    function triggerDownload(url, filename) {
        const loadingOverlay = createLoadingOverlay();
        GM_xmlhttpRequest({
            method: 'GET',
            url: `${API_ENDPOINT}?url=${encodeURIComponent(url)}`,
            responseType: 'blob',
            onload: function(response) {
                const blob = response.response;
                const downloadUrl = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(downloadUrl);
                document.body.removeChild(loadingOverlay);
            },
            onerror: function(error) {
                console.error('Download failed:', error);
                alert('Download failed. Please try again.');
                document.body.removeChild(loadingOverlay);
            }
        });
    }

    function modifySoundSnapButtons() {
        const downloadButtons = document.querySelectorAll([
            'a.button-icon.teaser-icons.primary.ojoo-icon-download[href="/products"]',
            'a.button-icon.teaser-icons.primary.ojoo-icon-download[href="/stock-music/products"]'
        ].join(','));

        downloadButtons.forEach(downloadButton => {
            let shareContainer;
            let parentElement = downloadButton.parentElement;

            while (parentElement && !shareContainer) {
                shareContainer = parentElement.querySelector('[id^="share-container-"]');
                parentElement = parentElement.parentElement;
            }

            if (shareContainer) {
                const nid = shareContainer.getAttribute('data-nid');
                const link = shareContainer.querySelector('a');
                if (link) {
                    const url = link.getAttribute('href');
                    downloadButton.href = '#';
                    downloadButton.addEventListener('click', (e) => {
                        e.preventDefault();
                        triggerDownload(url, `soundsnap_${nid}.mp3`);
                    });
                }
            }
        });
    }

    if (window.location.hostname === 'www.soundsnap.com') {
        modifySoundSnapButtons();

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    modifySoundSnapButtons();
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
})();