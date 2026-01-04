// ==UserScript==
// @name         Poxel.io Anti-Lag & FPS Booster
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Boost FPS, reduce lag, and add FPS counter in Poxel.io
// @author       You
// @match        *://poxel.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542300/Poxelio%20Anti-Lag%20%20FPS%20Booster.user.js
// @updateURL https://update.greasyfork.org/scripts/542300/Poxelio%20Anti-Lag%20%20FPS%20Booster.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 1. Remove heavy or unnecessary DOM elements
    const removeLaggyElements = () => {
        const selectorsToRemove = [
            '#adContainer', '.adsbygoogle', '.social-share', '.top-banner',
            '.menu-logo', 'iframe', 'script[src*="analytics"]'
        ];
        selectorsToRemove.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => el.remove());
        });
    };

    // Run once and again after 3s in case elements load late
    removeLaggyElements();
    setTimeout(removeLaggyElements, 3000);

    // 2. Set low-quality rendering settings (if canvas allows)
    const forcePerformanceMode = () => {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            canvas.style.imageRendering = 'pixelated';
            canvas.style.filter = 'none';
            canvas.style.background = 'black';
        }
    };

    setTimeout(forcePerformanceMode, 2000);

    // 3. Add FPS counter
    const fpsDisplay = document.createElement('div');
    fpsDisplay.style.position = 'fixed';
    fpsDisplay.style.bottom = '10px';
    fpsDisplay.style.left = '10px';
    fpsDisplay.style.padding = '4px 8px';
    fpsDisplay.style.background = 'rgba(0,0,0,0.7)';
    fpsDisplay.style.color = 'lime';
    fpsDisplay.style.fontFamily = 'monospace';
    fpsDisplay.style.zIndex = '9999';
    fpsDisplay.style.fontSize = '14px';
    fpsDisplay.innerText = 'FPS: ...';
    document.body.appendChild(fpsDisplay);

    // FPS calculation
    let lastFrame = performance.now();
    let frames = 0;
    let fps = 0;

    const updateFPS = () => {
        const now = performance.now();
        frames++;
        if (now - lastFrame >= 1000) {
            fps = frames;
            frames = 0;
            lastFrame = now;
            fpsDisplay.innerText = `FPS: ${fps}`;
        }
        requestAnimationFrame(updateFPS);
    };

    updateFPS();
})();