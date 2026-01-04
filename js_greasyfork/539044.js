// ==UserScript==
// @name         OpenGuessr Cheat (V2)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Updated! The best OpenGuessr cheat available! Activate by pressing "1" or clicking button
// @author       OpenGuessr Team
// @match        https://openguessr.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539044/OpenGuessr%20Cheat%20%28V2%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539044/OpenGuessr%20Cheat%20%28V2%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function openGoogleMapFromEmbedUrl(embedUrl) {
        const match = embedUrl.match(/location=([-.\d]+),([-.\d]+)/);
        if (match && match.length === 3) {
            const lat = match[1];
            const lng = match[2];
            const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;
            window.open(mapUrl, '_blank');
        } else {
            console.error('Invalid embed URL or coordinates not found.');
        }
    }

    function getEmbedUrl() {
        const iframe = document.getElementById('PanoramaIframe');
        return iframe ? iframe.src : null;
    }

    function handleMapOpen() {
        const url = getEmbedUrl();
        if (url) {
            openGoogleMapFromEmbedUrl(url);
        } else {
            console.error('Panorama iframe not found.');
        }
    }

    function injectButton() {
        setTimeout(() => {
        const button = document.createElement('button');
        button.textContent = 'Open in Google Maps';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.style.padding = '8px 12px';
        button.style.backgroundColor = '#fff';
        button.style.border = '1px solid #ccc';
        button.style.borderRadius = '4px';
        button.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.style.fontFamily = 'Arial, sans-serif';

        button.addEventListener('click', handleMapOpen);
        document.body.appendChild(button);
        }, 2000);
    }

    // Keyboard listener
    window.addEventListener('keydown', function (e) {
        if (e.key === '1') {
            handleMapOpen();
        }
    });

    // Wait for the page to load completely before injecting the button
    window.addEventListener('load', injectButton);
})();
