// ==UserScript==
// @name         Live FPS Display
// @namespace    zombsroyale.io
// @version      4.0
// @description  Displays Real Time FPS on zombsroyale.io
// @match        zombsroyale.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467407/Live%20FPS%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/467407/Live%20FPS%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    
    var fpsDisplay = document.createElement('div');
    fpsDisplay.style.position = 'fixed';
    fpsDisplay.style.top = '10px';
    fpsDisplay.style.right = '10px';
    fpsDisplay.style.padding = '5px';
    fpsDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    fpsDisplay.style.color = '#fff';
    fpsDisplay.style.zIndex = '9999';

   
    document.body.appendChild(fpsDisplay);

   
    var frameCount = 0;
    var startTime = performance.now();

    
    function updateFPS() {
        var endTime = performance.now();
        var elapsed = endTime - startTime;
        var fps = Math.round(frameCount / (elapsed / 1000));

        fpsDisplay.textContent = 'FPS: ' + fps;
        frameCount = 0;
        startTime = endTime;

        setTimeout(updateFPS, 100); 
    }

    // Function to count frames
    function countFrames() {
        frameCount++;
        requestAnimationFrame(countFrames);
    }

    
    countFrames();
    updateFPS();
})();