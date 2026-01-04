// ==UserScript==
// @name         Slither.io Zoom ch3at by albinde | Paluten on top!
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Custom zoom functionality for Slither.io with a prominent UI banner
// @author       Discord: albinde
// @match        *://slither.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501435/Slitherio%20Zoom%20ch3at%20by%20albinde%20%7C%20Paluten%20on%20top%21.user.js
// @updateURL https://update.greasyfork.org/scripts/501435/Slitherio%20Zoom%20ch3at%20by%20albinde%20%7C%20Paluten%20on%20top%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create UI element
    function createUI() {
        // Remove existing UI elements
        const existingUI = document.getElementById('custom-ui');
        if (existingUI) {
            existingUI.remove();
        }

        const uiContainer = document.createElement('div');
        uiContainer.id = 'custom-ui';
        uiContainer.style.position = 'fixed';
        uiContainer.style.left = '20px'; // Adjusted left position for visibility
        uiContainer.style.top = '-50%'; // Vertical center of the screen
        uiContainer.style.transform = 'translateY(-%)'; // Center vertically
        uiContainer.style.padding = '20px';
        uiContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        uiContainer.style.color = '#ffcc00';
        uiContainer.style.fontFamily = 'Courier New, monospace';
        uiContainer.style.fontSize = '30px'; // Larger text
        uiContainer.style.fontWeight = 'bold';
        uiContainer.style.textAlign = 'center';
        uiContainer.style.borderRadius = '15px'; // Larger radius
        uiContainer.style.zIndex = '9999';
        uiContainer.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.8)'; // More pronounced shadow
        uiContainer.innerText = 'made by Discord: albinde';
        document.body.appendChild(uiContainer);
    }

    // Add zoom functionality
    function addZoomFunctionality() {
        let zoomLevel = 1;
        const zoomStep = 0.1;
        const minZoom = 0.5;
        const maxZoom = 2;

        // Apply zoom effect
        function applyZoom() {
            document.body.style.transform = `scale(${zoomLevel})`;
            document.body.style.transformOrigin = '0 0';
            document.body.style.width = `${100 / zoomLevel}%`;
        }

        // Event listeners for zoom controls
        document.addEventListener('keydown', function(event) {
            if (event.key === '+') {
                zoomLevel = Math.min(maxZoom, zoomLevel + zoomStep);
                applyZoom();
            } else if (event.key === '-') {
                zoomLevel = Math.max(minZoom, zoomLevel - zoomStep);
                applyZoom();
            }
        });

        // Apply default zoom
        applyZoom();
    }

    // Initialize
    function init() {
        createUI();
        addZoomFunctionality();
    }

    init();
})();