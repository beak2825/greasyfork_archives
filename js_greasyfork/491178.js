// ==UserScript==
// @name         Automatically Refresh Webpage
// @namespace    Automatically Refresh Webpage
// @description  Auto-reload a specific webpage at a configurable interval
// @version      1.7
// @author       aciid
// @match        http://ENTER_YOUR_OWN_URL_OR_IP_HERE/*
// @supportURL   https://greasyfork.org/en/scripts/491178
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491178/Automatically%20Refresh%20Webpage.user.js
// @updateURL https://update.greasyfork.org/scripts/491178/Automatically%20Refresh%20Webpage.meta.js
// ==/UserScript==


(function() {
    'use strict';

    let intervalId = null;
    let wasPaused = false; // Indicates if the script was paused due to hovering
    let isScriptRunning = false; // Tracks whether the script is actively running or stopped

    // Function to start reloading
    function startReloading(interval) {
        console.log(`Starting reload every ${interval / 1000} seconds.`);
        if (intervalId !== null) clearInterval(intervalId); // Clear existing interval if any
        intervalId = setInterval(() => {
            console.log("Reloading page.");
            window.location.reload();
        }, interval);
        isScriptRunning = true;
        updateStatus('Running');
    }

    // Function to stop reloading
    function stopReloading() {
        if (intervalId !== null) {
            clearInterval(intervalId);
            console.log("Reload stopped.");
            intervalId = null;
        }
        isScriptRunning = false;
        updateStatus('Stopped');
    }

    // Function to update status displayed in UI
    function updateStatus(status) {
        document.getElementById('reloadStatus').textContent = `Status: ${status}`;
    }

    // Load settings from localStorage
    const savedInterval = localStorage.getItem('autoReloadInterval') || 30000; // Default to 30 seconds
    let isReloadingEnabled = localStorage.getItem('isReloadingEnabled') === 'true';

    // UI setup
    const reloadUI = document.createElement('div');
    reloadUI.style = 'position: fixed; bottom: 20px; right: 20px; z-index: 10000; padding: 15px; background-color: #f0f0f0; border: 2px solid #ccc; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); font-family: Arial, sans-serif;';
    reloadUI.innerHTML = `
        <div style="font-size: 14px; margin-bottom: 8px;"><strong>Refresh Interval (seconds):</strong></div>
        <div style="margin-bottom: 8px;">
            <input type="number" id="reloadInterval" value="${savedInterval / 1000}" min="1" style="width: 60px; padding: 5px;">
        </div>
        <div style="margin-bottom: 8px;">
            <button id="startReload" style="padding: 5px 10px;">Start</button>
            <button id="stopReload" style="padding: 5px 10px;">Stop</button>
        </div>
        <div id="reloadStatus" style="font-size: 12px;">Status: ${isReloadingEnabled ? 'Running' : 'Stopped'}</div>
    `;
    document.body.appendChild(reloadUI);

    // Pause logic on hover
    reloadUI.addEventListener('mouseenter', function() {
        if (intervalId !== null && isScriptRunning) { // Only pause if it's currently running
            clearInterval(intervalId);
            intervalId = null;
            wasPaused = true; // Mark as paused due to hover
            updateStatus('Paused (mouse on UI)');
        }
    });

    // Unpause logic
    reloadUI.addEventListener('mouseleave', function() {
        if (wasPaused && isScriptRunning) { // Only unpause if it was paused due to hover and the script was running before
            const interval = Math.max(1, parseInt(document.getElementById('reloadInterval').value, 10)) * 1000;
            startReloading(interval);
            wasPaused = false; // Reset pause state
        }
    });

    // Start/Stop buttons
    const startButton = document.getElementById('startReload');
    const stopButton = document.getElementById('stopReload');
    const intervalInput = document.getElementById('reloadInterval');

    startButton.onclick = function() {
        const interval = Math.max(1, parseInt(intervalInput.value, 10)) * 1000;
        localStorage.setItem('autoReloadInterval', interval);
        localStorage.setItem('isReloadingEnabled', 'true');
        isReloadingEnabled = true; // Update the running state
        startReloading(interval);
    };

    stopButton.onclick = function() {
        localStorage.setItem('isReloadingEnabled', 'false');
        isReloadingEnabled = false; // Ensure the script is marked as not running
        stopReloading();
    };

    // Automatically start reloading if enabled
    if (isReloadingEnabled) {
        startReloading(savedInterval);
    }
})();
