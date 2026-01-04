// ==UserScript==
// @name         Persistent Auto Page Refresher
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Refreshes the current page with a customizable timer that persists across refreshes
// @author       You
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530321/Persistent%20Auto%20Page%20Refresher.user.js
// @updateURL https://update.greasyfork.org/scripts/530321/Persistent%20Auto%20Page%20Refresher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get saved state from previous page load (if any)
    const savedInterval = GM_getValue('refreshInterval', 5);
    const wasRefreshing = GM_getValue('isRefreshing', false);
    const lastRefreshTime = GM_getValue('lastRefreshTime', 0);

    // Default refresh interval
    let refreshInterval = savedInterval * 1000;
    let isRefreshing = wasRefreshing;
    let countdownTimer;
    let refreshTimer;

    // Create control panel
    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.bottom = '10px';
    panel.style.right = '10px';
    panel.style.backgroundColor = 'rgba(40,40,40,0.8)';
    panel.style.color = 'white';
    panel.style.padding = '10px';
    panel.style.borderRadius = '8px';
    panel.style.zIndex = '9999';
    panel.style.fontSize = '14px';
    panel.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    panel.style.display = 'flex';
    panel.style.flexDirection = 'column';
    panel.style.gap = '10px';

    // Create input for seconds
    const inputContainer = document.createElement('div');
    inputContainer.style.display = 'flex';
    inputContainer.style.alignItems = 'center';
    inputContainer.style.gap = '8px';

    const inputLabel = document.createElement('label');
    inputLabel.textContent = 'Refresh every:';
    inputLabel.style.marginRight = '5px';

    const input = document.createElement('input');
    input.type = 'number';
    input.min = '1';
    input.value = savedInterval;
    input.style.width = '60px';
    input.style.padding = '5px';
    input.style.borderRadius = '4px';
    input.style.border = '1px solid #ccc';

    const secondsLabel = document.createElement('span');
    secondsLabel.textContent = 'seconds';

    inputContainer.appendChild(inputLabel);
    inputContainer.appendChild(input);
    inputContainer.appendChild(secondsLabel);

    // Create status display
    const status = document.createElement('div');
    status.textContent = isRefreshing ? 'Auto-refresh: On' : 'Auto-refresh: Off';
    status.style.textAlign = 'center';
    status.style.fontWeight = 'bold';

    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '5px';

    // Create toggle button
    const toggleButton = document.createElement('button');
    toggleButton.textContent = isRefreshing ? 'Stop' : 'Start';
    toggleButton.style.padding = '5px 10px';
    toggleButton.style.borderRadius = '4px';
    toggleButton.style.border = 'none';
    toggleButton.style.backgroundColor = isRefreshing ? '#f44336' : '#4CAF50';
    toggleButton.style.color = 'white';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.flexGrow = '1';

    // Create close button
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.padding = '5px 10px';
    closeButton.style.borderRadius = '4px';
    closeButton.style.border = 'none';
    closeButton.style.backgroundColor = '#f44336';
    closeButton.style.color = 'white';
    closeButton.style.cursor = 'pointer';

    buttonContainer.appendChild(toggleButton);
    buttonContainer.appendChild(closeButton);

    // Add everything to panel
    panel.appendChild(inputContainer);
    panel.appendChild(status);
    panel.appendChild(buttonContainer);

    // Function to start/stop refresh
    function toggleRefresh() {
        if (isRefreshing) {
            // Stop refreshing
            clearInterval(countdownTimer);
            clearTimeout(refreshTimer);
            isRefreshing = false;
            status.textContent = 'Auto-refresh: Off';
            toggleButton.textContent = 'Start';
            toggleButton.style.backgroundColor = '#4CAF50';

            // Save state
            GM_setValue('isRefreshing', false);
        } else {
            // Get user input
            refreshInterval = Math.max(1, parseInt(input.value, 10)) * 1000;

            // Save state
            GM_setValue('refreshInterval', refreshInterval / 1000);
            GM_setValue('isRefreshing', true);
            GM_setValue('lastRefreshTime', Date.now());

            // Start refreshing
            startRefreshTimer();

            isRefreshing = true;
            toggleButton.textContent = 'Stop';
            toggleButton.style.backgroundColor = '#f44336';
        }
    }

    function startRefreshTimer() {
        const now = Date.now();
        let timeLeft = Math.ceil(refreshInterval / 1000);

        if (wasRefreshing && lastRefreshTime) {
            // Calculate time elapsed since the last save
            const elapsedMs = now - lastRefreshTime;
            const remainingMs = refreshInterval - (elapsedMs % refreshInterval);
            timeLeft = Math.ceil(remainingMs / 1000);
        }

        status.textContent = `Refreshing in: ${timeLeft} seconds`;

        // Update the countdown every second
        countdownTimer = setInterval(function() {
            timeLeft -= 1;
            if (timeLeft <= 0) {
                timeLeft = refreshInterval / 1000;
            }
            status.textContent = `Refreshing in: ${timeLeft} seconds`;
        }, 1000);

        // Set the page refresh
        const refreshDelay = wasRefreshing ? (timeLeft * 1000) : refreshInterval;
        refreshTimer = setTimeout(function() {
            GM_setValue('lastRefreshTime', Date.now());
            location.reload();
        }, refreshDelay);
    }

    // Event listeners
    toggleButton.addEventListener('click', toggleRefresh);

    closeButton.addEventListener('click', function() {
        // Stop any refreshing before removing
        if (isRefreshing) {
            clearInterval(countdownTimer);
            clearTimeout(refreshTimer);
        }
        // Clear saved values
        GM_deleteValue('refreshInterval');
        GM_deleteValue('isRefreshing');
        GM_deleteValue('lastRefreshTime');
        panel.remove();
    });

    input.addEventListener('change', function() {
        const newInterval = Math.max(1, parseInt(input.value, 10));
        GM_setValue('refreshInterval', newInterval);

        if (isRefreshing) {
            toggleRefresh(); // Stop current timer
            toggleRefresh(); // Restart with new value
        }
    });

    // Make panel draggable
    let isDragging = false;
    let dragOffsetX, dragOffsetY;

    panel.style.cursor = 'move';

    panel.addEventListener('mousedown', function(e) {
        if (e.target === panel || e.target === status) {
            isDragging = true;
            dragOffsetX = e.clientX - panel.getBoundingClientRect().left;
            dragOffsetY = e.clientY - panel.getBoundingClientRect().top;
        }
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            panel.style.left = (e.clientX - dragOffsetX) + 'px';
            panel.style.top = (e.clientY - dragOffsetY) + 'px';
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });

    // Start refreshing if it was active before page reload
    if (isRefreshing) {
        startRefreshTimer();
    }

    // Add to document
    document.body.appendChild(panel);
})();
