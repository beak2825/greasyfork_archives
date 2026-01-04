// ==UserScript==
// @name         SunoEz
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Adds download songs and copy lyrics buttons to Suno song pages
// @author       yanyaoli
// @match        https://suno.com/song/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490920/SunoEz.user.js
// @updateURL https://update.greasyfork.org/scripts/490920/SunoEz.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let btnContainerAdded = false;
    function main() {
        if (btnContainerAdded) return;
        function getSongIdFromUrl() {
            const url = window.location.href;
            const regex = /\/song\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;
            const match = url.match(regex);
            return match ? match[1] : null;
        }

        function showToast(message, duration = 3000) {
            const toast = document.createElement('div');
            toast.textContent = message;
            toast.style.position = 'fixed';
            toast.style.top = '20px';
            toast.style.right = '20px';
            toast.style.padding = '10px 15px';
            toast.style.borderRadius = '5px';
            toast.style.background = 'rgba(44, 62, 80, 0.7)';
            toast.style.color = 'white';
            toast.style.zIndex = '10000';

            document.body.appendChild(toast);

            setTimeout(() => {
                toast.remove();
            }, duration);
        }

        const container = document.querySelector('body > div.css-fhtuey > div.css-lb6gzl > div > div > div > div.css-1t2smg3 > div.css-1xwn4k3');

        if (!container) return;

        const btnContainer = document.createElement('div')
        btnContainer.className = 'chakra-stack css-1h50ovt'

        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'chakra-button css-apxhpy';
        downloadBtn.textContent = 'Download';
        downloadBtn.style.marginLeft = '10px';

        const copyBtn = document.createElement('button');
        copyBtn.className = 'chakra-button css-apxhpy';
        copyBtn.textContent = 'Copy Lyrics';
        copyBtn.style.marginLeft = '10px';

        function downloadSong() {
            const songId = getSongIdFromUrl();
            const downloadUrl = `https://cdn1.suno.ai/${songId}.mp3`;
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = songId + '.mp3';
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        function copyLyrics() {
            const pElement = document.querySelector('body > div.css-fhtuey > div.css-lb6gzl > div > div > div > div.css-1t2smg3 > div.css-1dt9bqw > div.css-78su93 > p');
            const textToCopy = pElement ? pElement.textContent : '';

            navigator.clipboard.writeText(textToCopy).then(() => {
                showToast('Lyrics copied to clipboard!');
            }, (err) => {
                console.error('Could not copy text: ', err);
            });
        }

        downloadBtn.addEventListener('click', downloadSong)
        copyBtn.addEventListener('click', copyLyrics);

        btnContainer.appendChild(downloadBtn);
        btnContainer.appendChild(copyBtn);

        container.appendChild(btnContainer);

        btnContainerAdded = true;
    }

    main();

    const observer = new MutationObserver((mutationsList, observer) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.target.nodeName === 'HEAD') {
                main();
                break;
            }
        }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
})();
