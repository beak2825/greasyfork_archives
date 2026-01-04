// ==UserScript==
// @name         Drawaria Enhancer (fps y auto color)
// @namespace    https://greasyfork.org/en/users/your-username
// @version      1.0
// @description  Adds auto color picker on hover and FPS counter in drawaria.online
// @author       Lucas
// @match        https://www.drawaria.online/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541655/Drawaria%20Enhancer%20%28fps%20y%20auto%20color%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541655/Drawaria%20Enhancer%20%28fps%20y%20auto%20color%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Auto Color Picker
    const canvas = document.querySelector('canvas');
    if (canvas) {
        canvas.addEventListener('mousemove', function(e) {
            if (!e.altKey) return;

            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const ctx = canvas.getContext('2d');
            const pixel = ctx.getImageData(x, y, 1, 1).data;
            const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);

            const colorInput = document.querySelector('input[type=color]');
            if (colorInput) {
                colorInput.value = hex;
            }
        });
    }

    // RGB to HEX converter
    function rgbToHex(r, g, b) {
        return "#" + [r, g, b].map(x =>
            x.toString(16).padStart(2, '0')
        ).join('');
    }

    // FPS Counter
    let lastTime = performance.now();
    let frameCount = 0;
    const fpsDisplay = document.createElement('div');
    fpsDisplay.style.position = 'fixed';
    fpsDisplay.style.top = '5px';
    fpsDisplay.style.right = '10px';
    fpsDisplay.style.background = 'rgba(0, 0, 0, 0.5)';
    fpsDisplay.style.color = 'white';
    fpsDisplay.style.padding = '2px 6px';
    fpsDisplay.style.fontSize = '12px';
    fpsDisplay.style.zIndex = '9999';
    document.body.appendChild(fpsDisplay);

    function updateFPS() {
        const now = performance.now();
        frameCount++;
        if (now - lastTime >= 1000) {
            fpsDisplay.textContent = `FPS: ${frameCount}`;
            frameCount = 0;
            lastTime = now;
        }
        requestAnimationFrame(updateFPS);
    }
    requestAnimationFrame(updateFPS);

})();
