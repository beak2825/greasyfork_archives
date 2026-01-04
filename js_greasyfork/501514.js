// ==UserScript==
// @name         Hover on Entries Overlay
// @namespace    https://greasyfork.org/en/users/781396-yad
// @version      1.12
// @description  Bringing back the hover on entries to overlay the whole image in designcontest.com
// @author       YAD
// @match        https://*.designcontest.com/*/entries/*
// @icon         https://designcontest.nyc3.digitaloceanspaces.com/images/favicon.png
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/501514/Hover%20on%20Entries%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/501514/Hover%20on%20Entries%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        #image-overlay {
            position: fixed;
            display: none;
            border: 2px solid black;
            z-index: 1000;
            width: 420px;
            height: 420px;
            background-color: white;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        #image-overlay img {
            max-width: 100%;
            max-height: 100%;
        }
    `);

    const overlay = document.createElement('div');
    overlay.id = 'image-overlay';
    const overlayImage = document.createElement('img');
    overlay.appendChild(overlayImage);
    document.body.appendChild(overlay);

    // Function to adjust overlay position based on mouse position
    function adjustOverlayPosition(event) {
        const margin = 20;
        const overlayWidth = 400;
        const overlayHeight = 400;
        let left = event.clientX + margin;
        let top = event.clientY + margin;

        // Adjust position based on mouse position and viewport
        if (left + overlayWidth > window.innerWidth) {
            left = event.clientX - overlayWidth - margin;
        }
        if (top + overlayHeight > window.innerHeight) {
            top = event.clientY - overlayHeight - margin;
        }

        overlay.style.left = `${left}px`;
        overlay.style.top = `${top}px`;
    }

    // Event listener for mouseover on images
    document.addEventListener('mouseover', event => {
        const img = event.target;
        if (img.tagName === 'IMG' && img.src.includes('big_')) {
            overlayImage.src = img.src.replace('big_', '');
            overlay.style.display = 'flex';
            adjustOverlayPosition(event);
        }
    });

    // Event listener for mousemove to adjust overlay position
    document.addEventListener('mousemove', event => {
        if (overlay.style.display === 'flex') {
            adjustOverlayPosition(event);
        }
    });

    // Event listener for mouseout from images or overlay
    document.addEventListener('mouseout', event => {
        const img = event.target;
        if (img.tagName === 'IMG' && img.src.includes('big_')) {
            overlay.style.display = 'none';
        }
    });

    // Event listener for mouseleave from overlay
    overlay.addEventListener('mouseleave', () => {
        overlay.style.display = 'none';
    });
})();
