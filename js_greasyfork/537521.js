    // ==UserScript==
    // @name         Perfect Circle Drawer
    // @namespace    example.com
    // @version      1.0
    // @description  Draws a perfect circle
    // @author       You
    // @match        *://*/*  # Change this to match the desired website
    // @grant        GM_addStyle
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537521/Perfect%20Circle%20Drawer.user.js
// @updateURL https://update.greasyfork.org/scripts/537521/Perfect%20Circle%20Drawer.meta.js
    // ==/UserScript==

    function drawCircle(x, y, radius, color) {
        // Get the canvas element or create one dynamically
        let canvas = document.getElementById('myCanvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'myCanvas';
            canvas.width = 400; // Adjust as needed
            canvas.height = 400; // Adjust as needed
            document.body.appendChild(canvas); // Add to the page
        }

        let ctx = canvas.getContext('2d');

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
    }

    // Add a button or use a keyboard shortcut
    const button = document.createElement('button');
    button.textContent = 'Draw Circle';
    button.addEventListener('click', function() {
        // Example: Draw a circle at (100, 100) with radius 50 and red color
        drawCircle(100, 100, 50, 'red');
    });

    document.body.appendChild(button);
