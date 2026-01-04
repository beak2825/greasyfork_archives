// ==UserScript==
// @name         Simple Auto-Refresh
// @namespace    https://github.com/RustwuIf
// @version      1.1.6
// @description  Randomized delays auto-refresh
// @author       Rustwulf
// @match        <all_urls>
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531614/Simple%20Auto-Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/531614/Simple%20Auto-Refresh.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Core settings
    const storageKey = 'autoRefreshState';
    let isRunning = false;
    let remainingTime = 0;
    let countdownInterval = null;

    // Load saved values from localStorage
    let minDelay = parseInt(localStorage.getItem('minDelay')) || 5;
    let maxDelay = parseInt(localStorage.getItem('maxDelay')) || 15;

    // Create UI elements
    const mainButton = document.createElement('button');
    mainButton.style.cssText = `
        position: fixed;
        bottom: 5px;
        left: 15px;
        padding: 2px 2px;
        background: #FF6B6B;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 20px;
        cursor: pointer;
        z-index: 99999;
    `;
    mainButton.textContent = '▶️⇧+T';

    const settingsButton = document.createElement('button');
    settingsButton.style.cssText = `
        position: fixed;
        bottom: 5px;
        left: 90px;
        padding: 2px 2px;
        background: #FFFFFF;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 20px;
        cursor: pointer;
        z-index: 99999;
    `;
    settingsButton.textContent = '⚙️';

    const countdownDisplay = document.createElement('div');
    countdownDisplay.style.cssText = `
        position: fixed;
        bottom: 37px;
        left: 17px;
        background: rgba(0,0,0,0.2);
        color: white;
        padding: 5px;
        border-radius: 8px;
        font-size: 15px;
        display: none;
    `;

    const settingsModal = document.createElement('div');
    settingsModal.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 10px;
        width: 300px;
        background: Black;
        border: 1px solid #ccc;
        padding: 20px;
        border-radius: 8px;
        z-index: 99999;
        display: none;
        box-shadow: 0 0 10px rgba(0,0,0,0.3);
    `;
    settingsModal.innerHTML = `
        <h3 style="margin-bottom: 15px; color: white;">Settings</h3>
        <div style="display: flex; align-items: center; margin-bottom: 10px;">
            <label style="width: 120px; margin-right: 10px; color: white;">Min Delay (s):</label>
            <input type="number" id="minDelay" value="${minDelay}" style="padding: 6px; border: 1px solid #ddd; border-radius: 4px; width: 70px;">
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 20px;">
            <label style="width: 120px; margin-right: 10px; color: white;">Max Delay (s):</label>
            <input type="number" id="maxDelay" value="${maxDelay}" style="padding: 6px; border: 1px solid #ddd; border-radius: 4px; width: 70px;">
        </div>
        <div style="display: flex; justify-content: flex-end;">
            <button id="saveSettings" style="padding: 8px 15px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">Save</button>
            <button id="closeModal" style="padding: 8px 15px; background: #ff4d4d; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
        </div>
    `;

    // Append to DOM
    document.body.appendChild(mainButton);
    document.body.appendChild(settingsButton);
    document.body.appendChild(countdownDisplay);
    document.body.appendChild(settingsModal);

    // Event listeners
    mainButton.addEventListener('click', toggleAutoRefresh);
    settingsButton.addEventListener('click', openSettings);
    document.getElementById('closeModal').addEventListener('click', closeSettings);
    document.getElementById('saveSettings').addEventListener('click', saveSettings);

    document.addEventListener('keydown', (e) => {
        if (e.shiftKey && e.key === 'T') {
            e.preventDefault();
            mainButton.click();
        }
    });

    // Functions
    function toggleAutoRefresh() {
        isRunning = !isRunning;
        localStorage.setItem(storageKey, isRunning);
        mainButton.textContent = isRunning ? '⏸️⇧+T' : '▶️⇧+T';
        mainButton.style.backgroundColor = isRunning ? '#FF4444' : '#FF6B6B';
        isRunning ? startAutoRefresh() : clearInterval(countdownInterval);
    }

    function openSettings() {
        // Update inputs to current values
        document.getElementById('minDelay').value = minDelay;
        document.getElementById('maxDelay').value = maxDelay;
        settingsModal.style.display = 'block';
    }

    function closeSettings() {
        settingsModal.style.display = 'none';
    }

    function saveSettings() {
        // Parse inputs and update variables
        minDelay = parseInt(document.getElementById('minDelay').value, 10) || 5;
        maxDelay = parseInt(document.getElementById('maxDelay').value, 10) || 15;

        // Validate min <= max
        if (minDelay > maxDelay) {
            alert("Min delay cannot exceed max delay!");
            return;
        }

        // Save to localStorage
        localStorage.setItem('minDelay', minDelay);
        localStorage.setItem('maxDelay', maxDelay);
        closeSettings();
    }

    function startAutoRefresh() {
        const delay = Math.random() * (maxDelay - minDelay) + minDelay;
        remainingTime = Math.floor(delay);
        countdownDisplay.style.display = 'block';
        countdownInterval = setInterval(() => {
            if (remainingTime <= 0) {
                clearInterval(countdownInterval);
                window.location.reload();
            } else {
                remainingTime--;
                countdownDisplay.textContent = `🔄 ${remainingTime}s`;
            }
        }, 1000);
    }

    // Restore state on page load
    window.addEventListener('load', () => {
        const storedState = localStorage.getItem(storageKey);
        if (storedState === 'true') {
            isRunning = true;
            // Directly start auto-refresh without toggling
            startAutoRefresh();
            // Update button state manually
            mainButton.textContent = '⏸️⇧+T';
            mainButton.style.backgroundColor = '#FF4444';
        }
    });
})();