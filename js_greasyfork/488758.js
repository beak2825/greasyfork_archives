// ==UserScript==
// @name         Useless Things Series: Webpage Grid with Coordinates
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Overlay a grid onto the webpage and display current mouse coordinates in grid units
// @match        *://*/*
// @license      MIT
// @namespace https://greasyfork.org/users/1126616
// @downloadURL https://update.greasyfork.org/scripts/488758/Useless%20Things%20Series%3A%20Webpage%20Grid%20with%20Coordinates.user.js
// @updateURL https://update.greasyfork.org/scripts/488758/Useless%20Things%20Series%3A%20Webpage%20Grid%20with%20Coordinates.meta.js
// ==/UserScript==


// JavaScript code to dynamically create grid lines, display mouse coordinates, and convert pixel positions
(function() {
    'use strict';

    // Default grid settings
    let numVerticalLines = 20; // Number of vertical grid lines
    let numHorizontalLines = 20; // Number of horizontal grid lines
    let gridColor = '#c90016'; // Grid line color
    let gridOpacity = 0.5; // Grid line opacity
    let gridVisible = true; // Initially show grid

    // Create grid overlay
    const gridOverlay = document.createElement('div');
    gridOverlay.id = 'grid-overlay';
    gridOverlay.style.position = 'fixed';
    gridOverlay.style.top = '0';
    gridOverlay.style.left = '0';
    gridOverlay.style.width = '100%';
    gridOverlay.style.height = '100%';
    gridOverlay.style.pointerEvents = 'none';
    gridOverlay.style.zIndex = '9999';
    document.body.appendChild(gridOverlay);

    // Create coordinates display
    const coordinatesDisplay = document.createElement('div');
    coordinatesDisplay.id = 'coordinates-display';
    coordinatesDisplay.style.position = 'fixed';
    coordinatesDisplay.style.bottom = '10px';
    coordinatesDisplay.style.left = '10px';
    coordinatesDisplay.style.color = '#000'; // Default coordinate color
    coordinatesDisplay.style.fontSize = '14px'; // Default font size
    coordinatesDisplay.style.zIndex = '10000';
    coordinatesDisplay.style.display = 'block'; // Initially show coordinates
    document.body.appendChild(coordinatesDisplay);

    // Create red dot for mouse tip
    const mouseTip = document.createElement('div');
    mouseTip.id = 'mouse-tip';
    mouseTip.style.position = 'fixed';
    mouseTip.style.width = '8px';
    mouseTip.style.height = '8px';
    mouseTip.style.background = 'red';
    mouseTip.style.borderRadius = '50%';
    mouseTip.style.zIndex = '10001';
    mouseTip.style.display = 'block'; // Initially show red dot
    document.body.appendChild(mouseTip);

    // Function to update grid style
    function updateGridStyle() {
        gridOverlay.innerHTML = ''; // Clear existing grid lines
        const verticalLineSpacing = window.innerWidth / numVerticalLines;
        const horizontalLineSpacing = window.innerHeight / numHorizontalLines;
        if (gridVisible) {
            for (let i = 1; i < numVerticalLines; i++) {
                const verticalLine = document.createElement('div');
                verticalLine.style.position = 'absolute';
                verticalLine.style.width = '1px';
                verticalLine.style.height = '100%';
                verticalLine.style.backgroundColor = gridColor;
                verticalLine.style.opacity = gridOpacity;
                verticalLine.style.left = `${i * verticalLineSpacing}px`;
                gridOverlay.appendChild(verticalLine);
            }
            for (let i = 1; i < numHorizontalLines; i++) {
                const horizontalLine = document.createElement('div');
                horizontalLine.style.position = 'absolute';
                horizontalLine.style.width = '100%';
                horizontalLine.style.height = '1px';
                horizontalLine.style.backgroundColor = gridColor;
                horizontalLine.style.opacity = gridOpacity;
                horizontalLine.style.top = `${i * horizontalLineSpacing}px`;
                gridOverlay.appendChild(horizontalLine);
            }
        }
    }

    // Function to display mouse coordinates and convert pixel positions
    function displayCoordinates(event) {
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        const bodyWidth = document.body.offsetWidth;
        const bodyHeight = document.body.offsetHeight;
        const rightCoordinate = bodyWidth - mouseX;
        const bottomCoordinate = bodyHeight - mouseY;

        coordinatesDisplay.textContent = `Mouse Coordinates (px): (${mouseX}, ${mouseY}) | From Top: ${mouseY}px, From Left: ${mouseX}px, From Right: ${rightCoordinate}px, From Bottom: ${bottomCoordinate}px`;
        coordinatesDisplay.style.bottom = '20px'; // Position at the center bottom of the screen
        coordinatesDisplay.style.left = '50%'; // Position at the center horizontally
        coordinatesDisplay.style.transform = 'translateX(-50%)'; // Center horizontally
        coordinatesDisplay.style.color = '#fff'; // Text color
        coordinatesDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Background color with transparency
        coordinatesDisplay.style.padding = '10px'; // Padding for better visibility
        coordinatesDisplay.style.borderRadius = '5px'; // Rounded corners
        coordinatesDisplay.style.width = '800px';
        coordinatesDisplay.style.textAlign = 'center';
    }

    // Function to get position type of an element
    function getPositionType(element) {
        const position = window.getComputedStyle(element).position;
        return position;
    }

    // Call the function to create initial grid
    updateGridStyle();

    // Function to toggle grid visibility
    function toggleGrid() {
        gridVisible = !gridVisible;
        gridOverlay.style.display = gridVisible ? 'block' : 'none';
        coordinatesDisplay.style.display = gridVisible ? 'block' : 'none';
        mouseTip.style.display = gridVisible ? 'block' : 'none';
    }

    // Call toggleGrid() to ensure grid and coordinates are shown by default
    toggleGrid();

    // Event listener for keydown events to toggle grid visibility
    document.addEventListener('keydown', function(event) {
        if (event.altKey && event.key === 'g') {
            toggleGrid();
        }
    });

    // Event listener for mousemove events to display mouse coordinates
    document.addEventListener('mousemove', function(event) {
        if (gridVisible) {
            displayCoordinates(event);
        }
    });

})();
