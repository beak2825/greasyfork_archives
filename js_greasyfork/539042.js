// ==UserScript==
// @name         OpenGuessr Cheat
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Open Google Maps from embed when pressing "1" or clicking button on openguessr.com
// @author       OpenGuessr Team
// @match        https://www.openguessr.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539042/OpenGuessr%20Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/539042/OpenGuessr%20Cheat.meta.js
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
