// ==UserScript==
// @name         Google Maps Gulf Renamer
// @namespace    http://tampermonkey.net/
// @version      2.0
// @license MIT 
// @description  Replace Gulf of Mexico with Mauricio Garcés using overlays
// @author       Edu Altamirano (www.cocoalopez.com)
// @match        https://www.google.com/maps/*
// @match        https://www.google.*/maps/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/526728/Google%20Maps%20Gulf%20Renamer.user.js
// @updateURL https://update.greasyfork.org/scripts/526728/Google%20Maps%20Gulf%20Renamer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define styles for our overlay
    GM_addStyle(`
        .gulf-overlay {
            position: absolute;
            z-index: 1000;
            background: #78d5e9;
            padding: 8px 10px;
            border-radius: 4px;
            pointer-events: none;
            user-select: none;
            font-family: Roboto, Arial, sans-serif;
            font-size: 13px;
            color: #0d7c93;
            white-space: nowrap;

        }
        .gulf-overlay-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 999;
        }
    `);

    // Replace text in DOM
    function replaceGulfText() {
        const textNodes = document.evaluate(
            "//text()[contains(., 'Gulf of Mexico')]",
            document,
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null
        );

        for (let i = 0; i < textNodes.snapshotLength; i++) {
            const node = textNodes.snapshotItem(i);
            node.textContent = node.textContent.replace(/Gulf of Mexico/g, 'Mauricio Garcés');
        }

        // Handle search box
        const searchBox = document.getElementById('searchboxinput');
        if (searchBox && searchBox.value.includes('Gulf of Mexico')) {
            searchBox.value = searchBox.value.replace(/Gulf of Mexico/g, 'Mauricio Garcés');
        }
    }

    // Create and position overlay
    function createOverlay() {
        const mapElement = document.querySelector('#scene');
        if (!mapElement) return;

        // Remove any existing overlay
        const existingContainer = document.querySelector('.gulf-overlay-container');
        if (existingContainer) {
            existingContainer.remove();
        }

        // Create container
        const container = document.createElement('div');
        container.className = 'gulf-overlay-container';
        mapElement.appendChild(container);

        // Create label
        const label = document.createElement('div');
        label.className = 'gulf-overlay';
        label.textContent = 'Mauricio Garcés';
        container.appendChild(label);

        // Position the label (adjust these values as needed)
        label.style.position = 'absolute';
        label.style.left = '66%';
        label.style.top = '45.5%';

        // Update position on map changes
        function updatePosition() {
            const zoom = window.google?.maps?.getZoom?.() || 5;
            const baseSize = 13; // Base font size
            label.style.fontSize = `${baseSize * (zoom / 5)}px`;
        }

        // Observe map changes
        const observer = new MutationObserver(updatePosition);
        observer.observe(mapElement, {
            attributes: true,
            childList: true,
            subtree: true
        });

        // Handle window resize
        window.addEventListener('resize', updatePosition);

        // Initial position update
        updatePosition();
    }

    // Initialize everything
    function initialize() {
        replaceGulfText();
        createOverlay();

        // Create observer for dynamic content
        const observer = new MutationObserver((mutations) => {
            replaceGulfText();
        });

        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    // Run when map is ready
    if (document.readyState === 'complete') {
        setTimeout(initialize, 2000);
    } else {
        window.addEventListener('load', () => {
            setTimeout(initialize, 2000);
        });
    }

    // Handle URL changes (for single-page app navigation)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(initialize, 1000);
        }
    }).observe(document, { subtree: true, childList: true });
})();