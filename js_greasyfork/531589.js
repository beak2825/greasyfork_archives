// ==UserScript==
// @name         VortexForge Deadshot.io Lite 
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Vortex Forge Deadshot Lite- for Everyone
// @author       NOOB
// @match        https://deadshot.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531589/VortexForge%20Deadshotio%20Lite.user.js
// @updateURL https://update.greasyfork.org/scripts/531589/VortexForge%20Deadshotio%20Lite.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let fpsDisplay = null;
    let lastFrameTime = performance.now();
    let frameCount = 0;
    let fps = 0;
    const fpsThreshold = 30;

    function removeAds() {
        const adSelectors = ['.adsbyvli', '[id^=banner]', '[id^=google_ads_iframe]'];
        adSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(ad => ad.remove());
        });
    }

    setInterval(removeAds, 3000);

    function createFPSDisplay() {
        fpsDisplay = document.createElement('div');
        fpsDisplay.style.position = 'fixed';
        fpsDisplay.style.bottom = '10px';
        fpsDisplay.style.right = '10px';
        fpsDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        fpsDisplay.style.padding = '10px';
        fpsDisplay.style.borderRadius = '5px';
        fpsDisplay.style.color = 'white';
        fpsDisplay.style.fontSize = '14px';
        fpsDisplay.style.zIndex = '10000';
        document.body.appendChild(fpsDisplay);
    }

    function updateFPS() {
        const now = performance.now();
        frameCount++;

        if (now - lastFrameTime >= 1000) {
            fps = frameCount;
            frameCount = 0;
            lastFrameTime = now;
            fpsDisplay.innerText = `FPS: ${fps}`;
            if (fps < fpsThreshold) {
                boostFPS();
            }
        }
        requestAnimationFrame(updateFPS);
    }

    function boostFPS() {
        document.querySelectorAll('canvas').forEach(canvas => {
            canvas.style.imageRendering = 'pixelated';
        });
    }

    function changeSelectorBarColor() {
        const style = document.createElement('style');
        style.innerHTML = `
            .range::-webkit-slider-thumb {
                background: red !important;
            }
            .range::-moz-range-thumb {
                background: red !important;
            }
            .range::-ms-thumb {
                background: red !important;
            }
        `;
        document.head.appendChild(style);
    }

    window.addEventListener('load', () => {
        createFPSDisplay();
        updateFPS();
        changeSelectorBarColor();
        removeAds();
    });
})();
