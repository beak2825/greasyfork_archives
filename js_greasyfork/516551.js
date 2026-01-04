// ==UserScript==
// @name         Miniblox FPS Display
// @namespace    https://github.com/AdrienPlaza
// @version      1.0
// @description  Affiche le nombre de FPS en haut à gauche de l'écran
// @author       PrimeFR
// @match        https://miniblox.io/*
// @icon         https://miniblox.io/favicon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516551/Miniblox%20FPS%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/516551/Miniblox%20FPS%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const fpsDisplay = document.createElement('div');
    fpsDisplay.style.position = 'fixed';
    fpsDisplay.style.top = '10px';
    fpsDisplay.style.right = '10px';
    fpsDisplay.style.backgroundColor = 'purple';
    fpsDisplay.style.color = 'white';
    fpsDisplay.style.border = '2px solid black';
    fpsDisplay.style.padding = '5px';
    fpsDisplay.style.zIndex = '1000';
    fpsDisplay.style.fontFamily = 'Arial, sans-serif';
    fpsDisplay.style.fontSize = '14px';
    document.body.appendChild(fpsDisplay);

    let lastTimestamp = performance.now();
    let frames = 0;

    function updateFPS() {
        const now = performance.now();
        frames++;

        if (now - lastTimestamp >= 1000) {
            const fps = frames;
            fpsDisplay.textContent = `FPS: ${fps}`;
            frames = 0;
            lastTimestamp = now;
        }

        requestAnimationFrame(updateFPS);
    }

    updateFPS();
})();
