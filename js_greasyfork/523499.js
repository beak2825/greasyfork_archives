// ==UserScript==
// @name         GeoGuessr Co-op
// @namespace    http://tampermonkey.net/
// @version      3
// @description  Lets you choose if you want to drive or map when playing coop.
// @author       Rotski
// @match        https://www.geoguessr.com/*
// @license      MIT
// @icon         https://www.svgrepo.com/show/421676/gps-location-maps.svg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523499/GeoGuessr%20Co-op.user.js
// @updateURL https://update.greasyfork.org/scripts/523499/GeoGuessr%20Co-op.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Load the last mode from local storage or default to driving mode
    let mapOnlyMode = localStorage.getItem('mapOnlyMode') === 'true';

    let intervalId;
    let hoverIntervalId;

    function applyStyles(mapContainer) {
        mapContainer.style.position = 'fixed';
        mapContainer.style.top = '0';
        mapContainer.style.left = '0';
        mapContainer.style.width = '100%';
        mapContainer.style.height = '100%';
        mapContainer.style.zIndex = '10000';
        mapContainer.style.backgroundColor = '#000';
        mapContainer.style.opacity = '1';
        mapContainer.style.transition = 'none';
        mapContainer.style.pointerEvents = 'auto';
        mapContainer.style.setProperty('opacity', '1', 'important');
    }

    function fixTransparency(mapContainer) {
        const hoverEvent = new MouseEvent('mouseover', { bubbles: true, cancelable: true });
        mapContainer.dispatchEvent(hoverEvent);
    }

    function simulateHover(mapContainer) {
        hoverIntervalId = setInterval(() => {
            if (mapOnlyMode) {
                fixTransparency(mapContainer);
            }
        }, 500);
    }

    function stopSimulatingHover() {
        clearInterval(hoverIntervalId);
    }

    function toggleMode(isMap) {
        mapOnlyMode = isMap;
        localStorage.setItem('mapOnlyMode', mapOnlyMode); // Save the mode to local storage
        adjustMapVisibility();
    }

    function adjustMapVisibility() {
        const mapContainer = document.querySelector('.guess-map_canvasContainer__s7oJp');
        const streetView = document.querySelector('.game_panorama__1moRf');
        const body = document.body;
        const guessButton = document.querySelector('.button_button__aR6_e.button_variantBlack__UsxpK.button_disabled__rTguF');

        if (mapOnlyMode) {
            if (streetView) streetView.style.display = 'none';
            if (mapContainer) {
                applyStyles(mapContainer);
                fixTransparency(mapContainer);
                simulateHover(mapContainer);
            }
            body.style.overflow = 'hidden';
            if (guessButton) {
                guessButton.style.position = 'fixed';
                guessButton.style.bottom = '20px';
                guessButton.style.left = '50%';
                guessButton.style.transform = 'translateX(-50%)'; // Center the button horizontally
                guessButton.style.zIndex = '10001'; // Make sure it's visible above the map
            }
        } else {
            if (streetView) streetView.style.display = 'block';
            if (mapContainer) {
                mapContainer.removeAttribute('style');
            }
            body.style.overflow = '';
            if (guessButton) {
                guessButton.removeAttribute('style'); // Reset styles to default
            }
            stopSimulatingHover();
        }
    }

    function updateButtonStyles(mapButton, driveButton) {
        if (mapOnlyMode) {
            mapButton.style.backgroundColor = 'green';
            mapButton.style.opacity = '1';
            driveButton.style.backgroundColor = 'red';
            driveButton.style.opacity = '0.5';
        } else {
            mapButton.style.backgroundColor = 'red';
            mapButton.style.opacity = '0.5';
            driveButton.style.backgroundColor = 'green';
            driveButton.style.opacity = '1';
        }
    }

    function addButtons() {
        const mapButton = document.createElement('button');
        const driveButton = document.createElement('button');

        mapButton.innerText = "Map";
        driveButton.innerText = "Drive";

        [mapButton, driveButton].forEach(button => {
            button.style.position = "absolute";
            button.style.top = "160px"; // Set vertical offset
            button.style.zIndex = "99999";
            button.style.padding = "10px";
            button.style.color = "white";
            button.style.border = "none";
            button.style.borderRadius = "5px";
            button.style.cursor = "pointer";
        });

        mapButton.style.right = "50px";
        driveButton.style.right = "50px";
        driveButton.style.top = "220px"; // Additional offset for the second button

        mapButton.onclick = () => {
            toggleMode(true);
            updateButtonStyles(mapButton, driveButton);
        };
        driveButton.onclick = () => {
            toggleMode(false);
            updateButtonStyles(mapButton, driveButton);
        };

        document.body.appendChild(mapButton);
        document.body.appendChild(driveButton);

        updateButtonStyles(mapButton, driveButton); // Set initial button styles
    }

    function init() {
        addButtons();
        adjustMapVisibility(); // Apply initial map visibility based on mode
    }

    window.addEventListener('load', init);

    // Observers to handle dynamic content
    const observer = new MutationObserver(() => {
        if (mapOnlyMode) {
            adjustMapVisibility();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
