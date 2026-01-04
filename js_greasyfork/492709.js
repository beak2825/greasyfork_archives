// ==UserScript==
// @name         Multi-Website Auto Refresher
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Refreshes all websites on Chrome with a pop-out menu to set the time interval for refreshing.
// @author       Your name
// @include      *
// @grant        none
// @license me
// @downloadURL https://update.greasyfork.org/scripts/492709/Multi-Website%20Auto%20Refresher.user.js
// @updateURL https://update.greasyfork.org/scripts/492709/Multi-Website%20Auto%20Refresher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let intervalId;

    // Function to refresh all websites
    function refreshAllWebsites(interval) {
        console.log(`Refreshing all websites every ${interval} seconds.`);
        intervalId = setInterval(() => {
            console.log('Refreshing all websites...');
            window.location.reload();
        }, interval * 1000);
    }

    // Function to stop refreshing all websites
    function stopRefreshing() {
        console.log('Stopping refreshing all websites.');
        clearInterval(intervalId);
    }

    // Create pop-out menu
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.right = '20px';
    container.style.zIndex = '9999';
    container.style.background = '#ffffff';
    container.style.padding = '10px';
    container.style.border = '1px solid #ccc';
    container.style.borderRadius = '5px';

    const inputLabel = document.createElement('label');
    inputLabel.textContent = 'Refresh Interval (seconds): ';
    const intervalInput = document.createElement('input');
    intervalInput.type = 'number';
    intervalInput.min = '1';
    intervalInput.value = '10'; // Default refresh interval: 10 seconds
    inputLabel.appendChild(intervalInput);

    const startButton = document.createElement('button');
    startButton.textContent = 'Start Refreshing';
    startButton.addEventListener('click', () => {
        const interval = parseInt(intervalInput.value, 10);
        refreshAllWebsites(interval);
    });

    const stopButton = document.createElement('button');
    stopButton.textContent = 'Stop Refreshing';
    stopButton.addEventListener('click', stopRefreshing);

    container.appendChild(inputLabel);
    container.appendChild(startButton);
    container.appendChild(stopButton);
    document.body.appendChild(container);
})();
