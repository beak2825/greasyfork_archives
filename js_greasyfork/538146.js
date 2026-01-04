// ==UserScript==
// @name         snake.io Rainbow FPS Counter
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  FPS counter with rainbow color cycling for snake.io
// @author       Jadob Lane
// @match        *://snake.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538146/snakeio%20Rainbow%20FPS%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/538146/snakeio%20Rainbow%20FPS%20Counter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const fpsDisplay = document.createElement('div');
    fpsDisplay.style.position = 'fixed';
    fpsDisplay.style.top = '10px';
    fpsDisplay.style.left = '10px';
    fpsDisplay.style.fontSize = '20px';
    fpsDisplay.style.fontFamily = 'Arial, sans-serif';
    fpsDisplay.style.zIndex = 10000;
    fpsDisplay.style.backgroundColor = 'rgba(0,0,0,0.5)';
    fpsDisplay.style.padding = '5px 10px';
    fpsDisplay.style.borderRadius = '5px';
    fpsDisplay.style.userSelect = 'none';
    document.body.appendChild(fpsDisplay);

    let lastTime = performance.now();
    let frames = 0;

    // Function to convert HSL to RGB string
    function hslToRgbString(h, s, l) {
        return `hsl(${h}, ${s}%, ${l}%)`;
    }

    function update() {
        frames++;
        const now = performance.now();

        // Update FPS every second
        if (now - lastTime >= 1000) {
            fpsDisplay.textContent = `FPS: ${frames}`;
            frames = 0;
            lastTime = now;
        }

        // Cycle hue for rainbow effect (0 to 360)
        const hue = (now / 20) % 360;  // speed of color cycling
        fpsDisplay.style.color = hslToRgbString(hue, 100, 50);

        requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
})();