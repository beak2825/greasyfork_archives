// ==UserScript==
// @name         Pinterest Board Image Download
// @version      1.0
// @description  Adds a download button to every pin on a Pinterest board
// @author       Audino
// @namespace   https://greasyfork.org/en/users/1501652-audino
// @match        *://*.pinterest.com/*
// @license MIT
// @description:en Downloads high-res Pinterest images easily from boards or the home page.
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/544664/Pinterest%20Board%20Image%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/544664/Pinterest%20Board%20Image%20Download.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS
    GM_addStyle(`
        .pin-download-button {
            position: absolute;
            top: 8px;
            right: 8px;
            z-index: 9999;
            background-color: rgba(0, 0, 0, 0.7);
            color: white !important;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background-color 0.2s, transform 0.2s;
            text-decoration: none !important;
        }
        .pin-download-button:hover {
            background-color: rgba(230, 0, 35, 0.9); /* Pinterest Red on hover */
            transform: scale(1.1);
        }
        .pin-download-svg {
            width: 16px;
            height: 16px;
            fill: white;
        }
        div[data-grid-item="true"] > div > div {
            position: relative;
        }
    `);

    const addDownloadButton = (pinElement) => {
        if (pinElement.querySelector('.pin-download-button') || pinElement.dataset.downloadButtonAdded) {
            return;
        }

        const imageElement = pinElement.querySelector('img[src*="i.pinimg.com"]');
        const linkElement = pinElement.querySelector('a[href*="/pin/"]');

        if (!imageElement || !linkElement) {
            return;
        }

        const thumbnailUrl = imageElement.src;
        const highQualityUrl = thumbnailUrl.replace(/\/\d+x\//, '/originals/');

        const pinIdMatch = linkElement.href.match(/\/pin\/(\d+)\//);
        const filename = pinIdMatch ? `pinterest-${pinIdMatch[1]}.jpg` : 'pinterest-download.jpg';

        const downloadButton = document.createElement('a');
        downloadButton.href = highQualityUrl;
        downloadButton.setAttribute('download', filename);
        downloadButton.classList.add('pin-download-button');
        downloadButton.innerHTML = `
            <svg class="pin-download-svg" viewBox="0 0 24 24">
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13v4h-10v-4H5l7-7 7 7h-2z"></path>
            </svg>
        `;
        downloadButton.addEventListener('click', (e) => e.stopPropagation());

        pinElement.querySelector('div').appendChild(downloadButton);
        pinElement.dataset.downloadButtonAdded = 'true';
    };

    const processAllPins = () => {
        document.querySelectorAll('div[data-grid-item="true"]').forEach(addDownloadButton);
    };

    const observer = new MutationObserver(() => {
        setTimeout(processAllPins, 500);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    setTimeout(processAllPins, 1000);
})();