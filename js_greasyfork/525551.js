// ==UserScript==
// @name            Auto Biome Scanner
// @description     Moves around the map looking for stony_shore
// @version         1.6.0
// @author          RussDev7
// @homepageURL     https://github.com/RussDev7/AutoBiomeScanner
// @supportURL      https://github.com/RussDev7/AutoBiomeScanner/discussions
// @match           https://map.jacobsjo.eu/*
// @license         MIT
// @namespace       https://github.com/Stardust-Labs-MC/Terralith
// @icon            https://map.jacobsjo.eu/icon.png
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/525551/Auto%20Biome%20Scanner.user.js
// @updateURL https://update.greasyfork.org/scripts/525551/Auto%20Biome%20Scanner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetColors = [
        '#5B5B5B', '#5C5C5C', '#5E5E5E', '#5F5F5F', '#606060', '#616161', '#626262', '#636363',
        '#646464', '#585858', '#666666', '#696969', '#6B6B6B', '#707070', '#737373', '#7D7D7D',
        '#808080', '#838383', '#848484', '#919191', '#989898', '#999999', '#9A9A9A', '#9B9B9B',
        '#9C9C9C', '#9D9D9D', '#9E9E9E', '#9F9F9F', '#A9A9A9', '#AAAAAA', '#B3B3B3', '#B5B5B5',
        '#BDBDBD', '#C5C5C5', '#C6C6C6', '#C7C7C7', '#C8C8C8', '#CECECE', '#DADADA', '#DBDBDB',
        '#EBEBEB', '#EFEFEF'
    ];                                                                   // Targeted search colors

    let scanning = false;
    const delay = 2000;                                                  // Delay between each scroll (ms)

    let startX = window.innerWidth / 2, startY = window.innerHeight / 2; // Start at the center of the screen
    let currentX = startX, currentY = startY;                            // The current XY values
    const stepSize = window.innerHeight / 2;                             // Scroll one screen height

    let x1Steps = 0, y1Steps = 0, x2Steps = 0, y2Steps = 0;              // Steps taken in current directions
    let ringFacesCount = 0;                                              // Tracks the current ring face
    let ring = 0;                                                        // Tracks the current ring number

    /**
     * Creates a floating debug overlay for logging messages.
     */
    function createDebugOverlay() {
        const debugOverlay = document.createElement('div');
        debugOverlay.id = 'debugOverlay';
        debugOverlay.style.position = 'fixed';
        debugOverlay.style.bottom = '10px';
        debugOverlay.style.left = '10px';
        debugOverlay.style.width = '265px';
        debugOverlay.style.height = '470px';
        debugOverlay.style.overflowY = 'auto';
        debugOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        debugOverlay.style.color = 'lime';
        debugOverlay.style.fontFamily = 'monospace';
        debugOverlay.style.padding = '10px';
        debugOverlay.style.borderRadius = '5px';
        debugOverlay.style.zIndex = '9999';
        debugOverlay.innerHTML = '<b>Debug Log:</b><br>';
        document.body.appendChild(debugOverlay);
        addDebugMessage('/n');
    }

    /**
     * Initiates a spiral biome scan by incrementing rings outward from the center.
     */
    function scanForBiome() {
        if (!scanning) return;

        const allCanvases = document.querySelectorAll('canvas.leaflet-tile.leaflet-tile-loaded'); // Search all canvas elements
        for (let i = 0; i < allCanvases.length; i++) {
            const currentCanvas = allCanvases[i];
            const ctx = currentCanvas.getContext('2d', { willReadFrequently: true }); // Get the 2D context once

            let foundTargetColor = false; // Flag to track if a target color is found

            for (let x = 0; x < currentCanvas.width; x += 10) {
                for (let y = 0; y < currentCanvas.height; y += 10) {
                    const pixel = ctx.getImageData(x, y, 1, 1).data;

                    const pixelColor = `#${pixel[0].toString(16).padStart(2, '0')}${pixel[1].toString(16).padStart(2, '0')}${pixel[2].toString(16).padStart(2, '0')}`;
                    if (targetColors.includes(pixelColor)) {
                        // Biome found
                        addDebugMessage('===== Biome Found! =====');
                        addDebugMessage(`Biome found at (${x}, ${y})! Color: ${pixelColor}`);

                        scanning = false;

                        addDebugMessage('/n');
                        addDebugMessage('> Scanner stopped.');

                        // Reset all variables to initial values
                        const scanButton = document.getElementById('scanButton');
                        const resetButton = document.getElementById('resetButton');
                        scanButton.style.backgroundColor = '#4CAF50';
                        scanButton.innerText = 'Start Biome Scan';
                        resetButton.disabled = true; // Disable reset button
                        resetButton.style.cursor = 'not-allowed';
                        resetButton.style.backgroundColor = '#AAAAAA';
                        ring = 0;
                        ringFacesCount = 0;
                        x1Steps = 0;
                        y1Steps = 0;
                        x2Steps = 0;
                        y2Steps = 0;
                        currentX = startX;
                        currentY = startY;

                        // Move the cursor to the found location
                        moveCursorTo(x, y);

                        // Add visual feedback (e.g., highlight the pixel)
                        highlightFoundPixel(x, y);

                        // Return to stop further scanning
                        return;
                    }
                }
            }

            // If no target color was found, remove the canvas
            if (!foundTargetColor) {
                currentCanvas.remove(); // Remove the canvas from the DOM
            }
        }

        moveInSpiral();
        setTimeout(scanForBiome, delay);
    }

    /**
     * Moves the mouse cursor to the specified (x, y) position.
     * @param {number} x - X-coordinate on the canvas.
     * @param {number} y - Y-coordinate on the canvas.
     */
    function moveCursorTo(x, y) {
        const canvas = getCanvas();
        if (!canvas) return;

        const eventMove = new MouseEvent('mousemove', {
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y
        });

        canvas.dispatchEvent(eventMove);
    }

    /**
     * Adds a visual indicator (like a red circle) at the found biome location.
     */
    function highlightFoundPixel(x, y) {
        const canvas = getCanvas();
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, 2 * Math.PI);
        ctx.lineWidth = 3; // Thickness of the stroke
        ctx.strokeStyle = "red"; // Change to desired color
        ctx.stroke();

        const ctx2 = canvas.getContext('2d', { willReadFrequently: true });
        ctx2.beginPath();
        ctx2.arc(x, y, 5, 0, 2 * Math.PI);
        ctx2.fillStyle = 'red';
        ctx2.fill();
    }

    /**
     * Simulates a mouse drag on the canvas.
     * @param {number} deltaX - The target X position.
     * @param {number} deltaY - The target Y position.
     */
    function simulateDragScroll(deltaX, deltaY) {
        // Debug 2
        // Adjust the debug message to reflect incremented integers based on the current ring
        addDebugMessage("X: " + ((deltaX - startX) / window.innerHeight * 2) * ring + ", Y: " + ((deltaY - startY) / window.innerHeight * 2) * ring);

        const tileContainer = document.querySelector('div.leaflet-tile-container.leaflet-zoom-animated');
        if (!tileContainer) return;

        const eventDown = new MouseEvent('mousedown', { bubbles: true, clientX: startX, clientY: startY });
        tileContainer.dispatchEvent(eventDown);

        const eventMove = new MouseEvent('mousemove', { bubbles: true, clientX: deltaX, clientY: deltaY });
        tileContainer.dispatchEvent(eventMove);

        const eventUp = new MouseEvent('mouseup', { bubbles: true });
        tileContainer.dispatchEvent(eventUp);

        // Reset current positions
        currentX = startX, currentY = startY;
    }

    /**
     * Spiral math function.
     */
    function moveInSpiral() {

        // Logic for moving in a spiral
        if (ring === 0) {
            // First check, do nothing.

            // Increase the ring number and prepare for the next iteration
            ring++;

            // Debug 1
            addDebugMessage('===== New Ring =====');
        } else {
            // Perform rotations per ring
            if (ringFacesCount === 0) {
                // First move, up one step (Y +1)
                currentY += stepSize;

                // Set ringFacesCount to 1
                ringFacesCount++;

                // Debug 1
                addDebugMessage('===== New Ring =====');
            } else if (ringFacesCount === 1) {
                // First face
                if (x1Steps <= ((2 * ring) - 1)) {
                    // Move location
                    currentX += stepSize;

                     // Increase the steps
                    x1Steps++;
                }

                // Reset steps count, step faces count
                if (x1Steps === ((2 * ring) - 1)) {
                    x1Steps = 0;
                    ringFacesCount++;
                }
            } else if (ringFacesCount === 2) {
                // Second face
                if (y1Steps <= (2 * ring)) {
                    // Move location
                    currentY -= stepSize;

                    // Increase the steps
                    y1Steps++;
                }

                // Reset steps count, step faces count
                if (y1Steps === (2 * ring)) {
                    y1Steps = 0;
                    ringFacesCount++;
                }
            } else if (ringFacesCount === 3) {
                // Third face
                if (x2Steps <= (2 * ring)) {
                    // Move location
                    currentX -= stepSize;

                    // Increase the steps
                    x2Steps++;
                }

                // Reset steps count, step faces count
                if (x2Steps === (2 * ring)) {
                    x2Steps = 0;
                    ringFacesCount++;
                }
            } else if (ringFacesCount === 4) {
                // Forth face
                if (y2Steps <= (2 * ring)) {
                    // Move location
                    currentY += stepSize;

                    // Increase the steps
                    y2Steps++;
                }

                // Reset steps count, reset faces count for next move up, increase ring
                if (y2Steps === (2 * ring)) {
                    y2Steps = 0;
                    ringFacesCount = 0; // Reset faces

                    // Increase the ring number and prepare for the next iteration
                    ring++;

                    // Debug 1
                    addDebugMessage('===== Ring Runner =====');
                }
            }
        }

        // Simulate the drag scroll based on calculated delta
        simulateDragScroll(currentX, currentY);
    }

    /**
     * Main function that initializes the script and starts scanning.
     */
    function addScanButton() {
        createDebugOverlay();

        const scanButton = document.createElement('button');
        scanButton.id = 'scanButton'; // Set the ID
        scanButton.innerText = 'Start Biome Scan';
        scanButton.style.position = 'fixed';
        scanButton.style.bottom = '20px';
        scanButton.style.right = '90px';
        scanButton.style.padding = '10px';
        scanButton.style.backgroundColor = '#4CAF50';
        scanButton.style.color = 'white';
        scanButton.style.border = 'none';
        scanButton.style.borderRadius = '5px';
        scanButton.style.cursor = 'pointer';
        scanButton.style.zIndex = '9999'; // Ensure scanButton stays on top

        const resetButton = document.createElement('button');
        resetButton.id = 'resetButton'; // Set the ID
        resetButton.innerText = 'Reset';
        resetButton.style.position = 'fixed';
        resetButton.style.bottom = '20px';
        resetButton.style.right = '20px';
        resetButton.style.padding = '10px';
        resetButton.style.backgroundColor = '#AAAAAA';
        resetButton.style.color = 'white';
        resetButton.style.border = 'none';
        resetButton.style.borderRadius = '5px';
        resetButton.style.cursor = 'not-allowed';
        resetButton.style.zIndex = '9999';
        resetButton.disabled = true;

        scanButton.onclick = () => {
            scanning = !scanning;
            if (scanning) {
                addDebugMessage('> Starting scan...');
                addDebugMessage('/n');
                scanButton.innerText = 'Pause Biome Scan';
                scanButton.style.backgroundColor = '#FFA613';
                resetButton.style.backgroundColor = '#AAAAAA';
                resetButton.style.cursor = 'not-allowed';
                scanForBiome();
            } else {
                addDebugMessage('/n');
                addDebugMessage('> Scan paused!');
                scanButton.style.backgroundColor = '#4CAF50';
                resetButton.disabled = false; // Enable reset button
                resetButton.style.cursor = 'default';
                resetButton.style.backgroundColor = '#FF6347';
                scanButton.innerText = 'Resume Biome Scan';
            }
        };

        resetButton.onclick = () => {
            // Reset all variables to initial values
            scanning = false;
            scanButton.innerText = 'Start Biome Scan';
            resetButton.disabled = true; // Disable reset button
            resetButton.style.cursor = 'not-allowed';
            resetButton.style.backgroundColor = '#AAAAAA';
            ring = 0;
            ringFacesCount = 0;
            x1Steps = 0;
            y1Steps = 0;
            x2Steps = 0;
            y2Steps = 0;
            currentX = startX;
            currentY = startY;
            addDebugMessage('/r');
        };

        document.body.appendChild(scanButton);
        document.body.appendChild(resetButton);
    }

    /**
     * Appends a new debug message to the overlay log.
     * @param {string} message - The debug message to display.
     */
    function addDebugMessage(message) {
        const debugOverlay = document.getElementById('debugOverlay');
        if (!debugOverlay) return;

        const messageElement = document.createElement('div');

        if (message === "/r") {        // Reset conosle
            debugOverlay.innerHTML = '<b>Debug Log:</b><br>';
            addDebugMessage('/n');
        } else if (message === "/n") { // Newline
            messageElement.innerHTML = '<br>';
        } else {                       // Message
            messageElement.innerText = message;
        }

        debugOverlay.appendChild(messageElement);

        // Auto-scroll to the bottom
        debugOverlay.scrollTop = debugOverlay.scrollHeight;
    }

    /**
     * Retrieves the canvas element from the webpage.
     * @returns {HTMLElement|null} The canvas element or null if not found.
     */
    function getCanvas() {
        return document.querySelector('canvas');
    }

    window.onload = addScanButton;
})();