// ==UserScript==
// @name         Contador de FPS con Gráfica
// @namespace    http://tampermonkey.net/
// @version      1.12
// @description  Displays a static FPS counter with a vertical graph on all web pages.
// @author       Your Name
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496046/Contador%20de%20FPS%20con%20Gr%C3%A1fica.user.js
// @updateURL https://update.greasyfork.org/scripts/496046/Contador%20de%20FPS%20con%20Gr%C3%A1fica.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the FPS counter container
    let fpsContainer = document.createElement('div');
    fpsContainer.style.position = 'fixed';
    fpsContainer.style.top = '10px';
    fpsContainer.style.right = '10px';
    fpsContainer.style.width = '150px';
    fpsContainer.style.height = '100px';
    fpsContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    fpsContainer.style.color = '#00FF00';
    fpsContainer.style.fontSize = '14px';
    fpsContainer.style.fontFamily = 'monospace';
    fpsContainer.style.padding = '10px';
    fpsContainer.style.zIndex = '9999';
    fpsContainer.style.pointerEvents = 'none';
    document.body.appendChild(fpsContainer);

    // Create the FPS text element
    let fpsText = document.createElement('div');
    fpsText.innerText = 'FPS: 0';
    fpsContainer.appendChild(fpsText);

    // Create the canvas for the graph
    let fpsCanvas = document.createElement('canvas');
    fpsCanvas.width = 130;
    fpsCanvas.height = 50;
    fpsContainer.appendChild(fpsCanvas);
    let ctx = fpsCanvas.getContext('2d');

    let frameTimes = [];
    let lastFrameTime = performance.now();

    function updateFPS() {
        let now = performance.now();
        let delta = now - lastFrameTime;
        lastFrameTime = now;
        let fps = 1000 / delta;

        // Update the text
        fpsText.innerText = 'FPS: ' + fps.toFixed(1);

        // Update the frame times array
        frameTimes.push(fps);
        if (frameTimes.length > fpsCanvas.width) {
            frameTimes.shift();
        }

        // Clear the canvas
        ctx.clearRect(0, 0, fpsCanvas.width, fpsCanvas.height);

        // Draw the graph vertically from top to bottom
        ctx.beginPath();
        for (let i = 0; i < frameTimes.length; i++) {
            let value = frameTimes[i];
            let percent = value / 60; // Assuming 60 FPS is the max
            let height = fpsCanvas.height * percent;
            let x = i;
            let y = height;
            ctx.lineTo(x, y);
        }
        ctx.strokeStyle = '#00FF00';
        ctx.stroke();

        // Schedule the next frame
        requestAnimationFrame(updateFPS);
    }

    // Start the FPS counter
    requestAnimationFrame(updateFPS);
})();
