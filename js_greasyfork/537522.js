// ==UserScript==
// @name         Perfect Circle Drawer
// @namespace    example.com
// @version      1.1
// @description  Draws perfect circles dynamically on any webpage.
// @author       You
// @match        *://*/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/537522/Perfect%20Circle%20Drawer.user.js
// @updateURL https://update.greasyfork.org/scripts/537522/Perfect%20Circle%20Drawer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const CANVAS_ID = 'perfectCircleCanvas';
    const DEFAULT_CANVAS_WIDTH = 800;
    const DEFAULT_CANVAS_HEIGHT = 600;
    const DEFAULT_CIRCLE_RADIUS = 50;
    const DEFAULT_CIRCLE_COLOR = 'rgba(255, 0, 0, 0.6)'; // Red with some transparency

    // --- Canvas Management ---
    function getOrCreateCanvas() {
        let canvas = document.getElementById(CANVAS_ID);
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = CANVAS_ID;
            canvas.width = DEFAULT_CANVAS_WIDTH;
            canvas.height = DEFAULT_CANVAS_HEIGHT;
            // Position the canvas fixed so it overlays content without disrupting layout
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.zIndex = '9999'; // Ensure it's on top
            canvas.style.pointerEvents = 'none'; // Allow clicks to pass through
            document.body.appendChild(canvas);
        }
        return canvas;
    }

    function clearCanvas() {
        const canvas = document.getElementById(CANVAS_ID);
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    // --- Circle Drawing Function ---
    function drawCircle(x, y, radius, color) {
        const canvas = getOrCreateCanvas();
        const ctx = canvas.getContext('2d');

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = 'black'; // Add a border for better visibility
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    // --- UI Elements and Event Listeners ---
    function createUI() {
        // Create a container for the UI elements
        const uiContainer = document.createElement('div');
        uiContainer.id = 'circleDrawerUI';
        GM_addStyle(`
            #circleDrawerUI {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background-color: #f0f0f0;
                border: 1px solid #ccc;
                padding: 10px;
                border-radius: 5px;
                z-index: 10000;
                font-family: sans-serif;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            }
            #circleDrawerUI button {
                margin-top: 5px;
                padding: 8px 12px;
                background-color: #007bff;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }
            #circleDrawerUI button:hover {
                background-color: #0056b3;
            }
            #circleDrawerUI label {
                display: block;
                margin-bottom: 5px;
            }
            #circleDrawerUI input[type="number"],
            #circleDrawerUI input[type="color"] {
                width: 80px;
                margin-bottom: 5px;
            }
        `);

        // X, Y, Radius, Color inputs
        const xInput = createLabeledInput('X:', 'number', 'circleX', 100);
        const yInput = createLabeledInput('Y:', 'number', 'circleY', 100);
        const radiusInput = createLabeledInput('Radius:', 'number', 'circleRadius', DEFAULT_CIRCLE_RADIUS);
        const colorInput = createLabeledInput('Color:', 'color', 'circleColor', DEFAULT_CIRCLE_COLOR.substring(0, 7)); // Remove alpha for color input

        // Draw Circle Button
        const drawButton = document.createElement('button');
        drawButton.textContent = 'Draw Circle';
        drawButton.addEventListener('click', function() {
            const x = parseInt(xInput.value);
            const y = parseInt(yInput.value);
            const radius = parseInt(radiusInput.value);
            const color = colorInput.value;
            drawCircle(x, y, radius, color);
        });

        // Clear Canvas Button
        const clearButton = document.createElement('button');
        clearButton.textContent = 'Clear All Circles';
        clearButton.addEventListener('click', clearCanvas);

        uiContainer.appendChild(xInput.parentElement); // Append the whole label+input container
        uiContainer.appendChild(yInput.parentElement);
        uiContainer.appendChild(radiusInput.parentElement);
        uiContainer.appendChild(colorInput.parentElement);
        uiContainer.appendChild(drawButton);
        uiContainer.appendChild(clearButton);

        document.body.appendChild(uiContainer);
    }

    function createLabeledInput(labelText, type, id, defaultValue) {
        const div = document.createElement('div');
        const label = document.createElement('label');
        label.textContent = labelText;
        label.htmlFor = id;
        const input = document.createElement('input');
        input.type = type;
        input.id = id;
        input.value = defaultValue;
        div.appendChild(label);
        div.appendChild(input);
        return input; // Return the input element for value retrieval
    }

    // --- Initialize the UI when the page loads ---
    window.addEventListener('load', createUI);

})();
