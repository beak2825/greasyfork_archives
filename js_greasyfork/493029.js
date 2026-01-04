// ==UserScript==
// @name         Advanced zoom
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Custom Bloxd Cursor
// @author       You
// @match        https://bloxd.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bloxd.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493029/Advanced%20zoom.user.js
// @updateURL https://update.greasyfork.org/scripts/493029/Advanced%20zoom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define constants for zoom levels and increment
    const minZoom = 100; // 100%
    const maxZoom = 500; // 500% (adjusted maximum zoom)
    const zoomIncrement = 20; // 20% (increased for faster zooming)

    // Initial zoom level
    let zoomLevel = 100; // 100%

    // Variable to track the color mode
    let colorMode = 'color'; // 'color' or 'bw'

    // Function to smoothly zoom the canvas
    function zoomCanvas(zoom) {
        const canvas = document.querySelector('canvas');

        if (!canvas) {
            console.error('Canvas not found.');
            return;
        }

        // Calculate the new zoom level within the allowed range
        zoomLevel = Math.min(Math.max(zoomLevel + zoom, minZoom), maxZoom);

        // Apply the zoom transformation with a smooth transition
        canvas.style.transition = 'transform 0.5s ease';
        canvas.style.transform = `scale(${zoomLevel / 100})`;

        // Update the zoom display
        zoomDisplay.textContent = `Zoom: ${zoomLevel}%`;

        // Update the settings icon position
        updateSettingsIconPosition();
    }

    // Function to handle zooming when 'F' key is pressed
    function handleZoom(event) {
        if (event.key === 'f' || event.key === 'F') {
            if (event.type === 'keydown') {
                // Zoom in when 'F' key is pressed
                zoomCanvas(zoomIncrement);
            } else if (event.type === 'keyup') {
                // Reset zoom to 100% when 'F' key is released
                zoomCanvas(100 - zoomLevel);
            }
        }
    }

    // Function to toggle color mode of the zoom box
    function toggleColorMode() {
        if (colorMode === 'color') {
            zoomDisplay.style.backgroundColor = '#000';
            zoomDisplay.style.color = '#fff';
            colorMode = 'bw';
        } else if (colorMode === 'bw') {
            zoomDisplay.style.backgroundColor = '#fff';
            zoomDisplay.style.color = '#000';
            colorMode = 'rgb';
        } else {
            // RGB mode
            zoomDisplay.style.backgroundColor = '#f00';
            zoomDisplay.style.color = '#0f0';
            colorMode = 'color';
        }
    }

    // Function to handle changing the size of the zoom box
    function changeZoomBoxSize() {
        const newSize = prompt('Enter the new size for the Zoom Box (in pixels):', zoomDisplay.style.fontSize);
        if (newSize) {
            zoomDisplay.style.fontSize = newSize + 'px';
            updateSettingsIconPosition();
        }
    }

    // Function to update the position of the settings icon
    function updateSettingsIconPosition() {
        const zoomBoxRect = zoomDisplay.getBoundingClientRect();
        settingsIcon.style.top = `${zoomBoxRect.top}px`;
        settingsIcon.style.left = `${zoomBoxRect.right + 10}px`;
    }

    // Create a box element for displaying zoom information
    const zoomDisplay = document.createElement('div');
    zoomDisplay.textContent = 'Zoom: 100%';
    zoomDisplay.style.position = 'fixed';
    zoomDisplay.style.top = '10px'; // Position at the top
    zoomDisplay.style.left = '50%'; // Position at the middle horizontally
    zoomDisplay.style.transform = 'translateX(-50%)'; // Center horizontally
    zoomDisplay.style.padding = '5px';
    zoomDisplay.style.border = '1px solid #ccc';
    zoomDisplay.style.backgroundColor = '#fff';
    zoomDisplay.style.color = '#000';
    zoomDisplay.style.zIndex = '9999';
    zoomDisplay.style.cursor = 'pointer'; // Add pointer cursor
    zoomDisplay.style.fontSize = '20px'; // Font size of the zoom box

    // Append the zoom display to the body of the page
    document.body.appendChild(zoomDisplay);

    // Add event listeners for keydown and keyup events to handle zooming with 'F' key
    window.addEventListener('keydown', handleZoom);
    window.addEventListener('keyup', handleZoom);

    // Event listener for zooming with mouse wheel
    document.addEventListener('wheel', function(event) {
        // Prevent the default scroll behavior
        event.preventDefault();

        // Determine the direction of the scroll
        const direction = event.deltaY > 0 ? -1 : 1;

        // Zoom the canvas if zooming is active
        if (event.key === 'f' || event.key === 'F') {
            if (document.hasFocus()) {
                zoomCanvas(zoomIncrement * direction);
            }
        }
    });

    // Event listener for toggling color mode on click
    zoomDisplay.addEventListener('click', toggleColorMode);

    // Create a settings icon
    const settingsIcon = document.createElement('span');
    settingsIcon.textContent = '🔧';
    settingsIcon.style.position = 'fixed';
    settingsIcon.style.zIndex = '9999';
    settingsIcon.style.cursor = 'pointer'; // Add pointer cursor
    settingsIcon.style.fontSize = '20px'; // Font size of the settings icon

    // Append the settings icon to the body of the page
    document.body.appendChild(settingsIcon);

    // Event listener for changing the size of the zoom box
    settingsIcon.addEventListener('click', changeZoomBoxSize);

    // Update the settings icon position initially
    updateSettingsIconPosition();
})();

