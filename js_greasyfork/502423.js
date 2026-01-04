// ==UserScript==
// @name         Slither.io Lag Reducer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Reduce lag on Slither.io by adjusting settings
// @author       You
// @match        http://slither.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502423/Slitherio%20Lag%20Reducer.user.js
// @updateURL https://update.greasyfork.org/scripts/502423/Slitherio%20Lag%20Reducer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to set game settings to reduce lag
    function reduceLag() {
        // Change game settings here to improve performance
        // Example: Reduce rendering quality
        window.gameSettings = {
            ...window.gameSettings,
            renderQuality: 'low'
        };
        console.log('Lag reduction settings applied');
    }

    // Apply lag reduction settings when the page is loaded
    window.addEventListener('load', reduceLag);
    // ==UserScript==
// @name         Slither.io Lag Reducer with FPS Display
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Reduce lag and display FPS on Slither.io
// @author       You
// @match        *://slither.io/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Create a GUI element to display FPS
    const fpsDisplay = document.createElement('div');
    fpsDisplay.style.position = 'fixed';
    fpsDisplay.style.top = '10px';
    fpsDisplay.style.right = '10px';
    fpsDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    fpsDisplay.style.color = 'white';
    fpsDisplay.style.padding = '5px';
    fpsDisplay.style.borderRadius = '5px';
    fpsDisplay.style.fontSize = '14px';
    fpsDisplay.style.zIndex = '1000';
    document.body.appendChild(fpsDisplay);

    // Function to set game settings to reduce lag
    function reduceLag() {
        window.gameSettings = {
            ...window.gameSettings,
            renderQuality: 'low'
        };
        console.log('Lag reduction settings applied');
    }

    // Function to calculate and display FPS
    function updateFPS() {
        let lastTime = performance.now();
        let frameCount = 0;

        function calculateFPS() {
            const now = performance.now();
            frameCount++;
            if (now - lastTime >= 1000) {
                const fps = frameCount / ((now - lastTime) / 1000);
                fpsDisplay.textContent = `FPS: ${Math.round(fps)}`;
                frameCount = 0;
                lastTime = now;
            }
            requestAnimationFrame(calculateFPS);
        }

        requestAnimationFrame(calculateFPS);
    }

    // Apply lag reduction and start FPS display when the page is loaded
    window.addEventListener('load', () => {
        reduceLag();
        updateFPS();
    });
})();

})();
