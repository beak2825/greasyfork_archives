// ==UserScript==
// @name         Auto Refresh with Pop-out GUI
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically refreshes the page every 20 seconds with start/stop functionality and a pop-out GUI.
// @author       Your Name
// @match        *://*/*
// @grant        none
// @license All
// @downloadURL https://update.greasyfork.org/scripts/492708/Auto%20Refresh%20with%20Pop-out%20GUI.user.js
// @updateURL https://update.greasyfork.org/scripts/492708/Auto%20Refresh%20with%20Pop-out%20GUI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a container for the GUI
    const guiContainer = document.createElement('div');
    guiContainer.style.position = 'fixed';
    guiContainer.style.bottom = '10px';
    guiContainer.style.right = '10px';
    guiContainer.style.zIndex = '9999';
    guiContainer.style.backgroundColor = 'white';
    guiContainer.style.border = '1px solid #ccc';
    guiContainer.style.padding = '10px';
    guiContainer.style.borderRadius = '5px';
    guiContainer.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    guiContainer.style.cursor = 'pointer';
    guiContainer.textContent = 'Refresh Page';

    // Create start button
    const startButton = document.createElement('button');
    startButton.textContent = 'Start';
    startButton.style.marginRight = '10px';
    startButton.onclick = startRefresh;
    guiContainer.appendChild(startButton);

    // Create stop button
    const stopButton = document.createElement('button');
    stopButton.textContent = 'Stop';
    stopButton.onclick = stopRefresh;
    guiContainer.appendChild(stopButton);

    document.body.appendChild(guiContainer);

    let intervalId;

    function startRefresh() {
        stopRefresh(); // Stop any existing refresh interval

        intervalId = setInterval(function() {
            location.reload();
        }, 20000); // 20 seconds
    }

    function stopRefresh() {
        clearInterval(intervalId);
    }

    // Toggle pop-out GUI on click
    let isExpanded = false;
    guiContainer.addEventListener('click', function() {
        if (isExpanded) {
            guiContainer.style.bottom = '10px';
            guiContainer.style.right = '10px';
        } else {
            guiContainer.style.bottom = 'auto';
            guiContainer.style.right = 'auto';
            guiContainer.style.top = '10px';
            guiContainer.style.left = '10px';
        }
        isExpanded = !isExpanded;
    });
})();
