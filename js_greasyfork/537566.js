// ==UserScript==
// @name         Arc's Hospital Refresher
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Auto-refresh Torn's hospitalview page with interval control, pause/resume, stop, countdown, and persistent reload logic. Made for Arc 🛡️🩺
// @author       Arc
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537566/Arc%27s%20Hospital%20Refresher.user.js
// @updateURL https://update.greasyfork.org/scripts/537566/Arc%27s%20Hospital%20Refresher.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (!window.location.href.includes("hospitalview.php")) return;

    const STATE_KEY = 'tornRefreshState';

    let refreshCount = 0;
    let totalRefreshes = 0;
    let intervalSeconds = 30;
    let countdown = 0;
    let isPaused = false;

    let refreshIntervalId = null;
    let countdownIntervalId = null;

    function saveState() {
        localStorage.setItem(STATE_KEY, JSON.stringify({
            refreshCount,
            totalRefreshes,
            intervalSeconds,
            isPaused,
            active: true
        }));
    }

    function clearState() {
        localStorage.removeItem(STATE_KEY);
    }

    function stopAll(display) {
        clearInterval(refreshIntervalId);
        clearInterval(countdownIntervalId);
        clearState();
        display.textContent = '🛑 Stopped';
    }

    function loadState() {
        const saved = localStorage.getItem(STATE_KEY);
        return saved ? JSON.parse(saved) : null;
    }

    function startAutoRefresh(display) {
        countdown = intervalSeconds;

        countdownIntervalId = setInterval(() => {
            if (!isPaused && countdown > 0) {
                countdown--;
                const remaining = totalRefreshes - refreshCount;
                display.textContent = `⏳ Refreshing ${remaining}/${totalRefreshes} in ${countdown}s`;
            }
        }, 1000);

        refreshIntervalId = setInterval(() => {
            if (!window.location.href.includes("hospitalview.php")) {
                stopAll(display);
                return;
            }

            if (!isPaused) {
                if (refreshCount >= totalRefreshes) {
                    stopAll(display);
                    display.textContent = `✅ Completed ${totalRefreshes} refreshes.`;
                } else {
                    refreshCount++;
                    countdown = intervalSeconds;
                    saveState();
                    location.reload();
                }
            }
        }, intervalSeconds * 1000);
    }

    window.addEventListener('load', () => {
        const state = loadState();

        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '20px';
        container.style.right = '20px';
        container.style.zIndex = '9999';
        container.style.backgroundColor = '#111';
        container.style.padding = '10px';
        container.style.borderRadius = '8px';
        container.style.boxShadow = '0 0 5px rgba(0,0,0,0.5)';
        container.style.fontFamily = 'Arial, sans-serif';

        const countInput = document.createElement('input');
        countInput.type = 'number';
        countInput.placeholder = 'Times';
        countInput.style.marginRight = '10px';
        countInput.style.width = '60px';

        const intervalInput = document.createElement('input');
        intervalInput.type = 'number';
        intervalInput.placeholder = 'Sec';
        intervalInput.style.marginRight = '10px';
        intervalInput.style.width = '60px';

        const startButton = document.createElement('button');
        startButton.textContent = '🔁 Start';
        startButton.style.marginRight = '5px';
        startButton.style.backgroundColor = '#444';
        startButton.style.color = '#fff';
        startButton.style.border = 'none';
        startButton.style.borderRadius = '5px';
        startButton.style.padding = '10px';
        startButton.style.cursor = 'pointer';

        const pauseButton = document.createElement('button');
        pauseButton.textContent = '⏸ Pause';
        pauseButton.style.marginRight = '5px';
        pauseButton.style.backgroundColor = '#888';
        pauseButton.style.color = '#fff';
        pauseButton.style.border = 'none';
        pauseButton.style.borderRadius = '5px';
        pauseButton.style.padding = '10px';
        pauseButton.style.cursor = 'pointer';

        const stopButton = document.createElement('button');
        stopButton.textContent = '🛑 Stop';
        stopButton.style.backgroundColor = '#b00';
        stopButton.style.color = '#fff';
        stopButton.style.border = 'none';
        stopButton.style.borderRadius = '5px';
        stopButton.style.padding = '10px';
        stopButton.style.cursor = 'pointer';

        const display = document.createElement('div');
        display.style.marginTop = '10px';
        display.style.color = '#0f0';
        display.textContent = '⏳ Refresher is Idle';

        container.appendChild(countInput);
        container.appendChild(intervalInput);
        container.appendChild(startButton);
        container.appendChild(pauseButton);
        container.appendChild(stopButton);
        container.appendChild(display);
        document.body.appendChild(container);

        // Resume from saved state
        if (state && state.active && state.refreshCount < state.totalRefreshes) {
            refreshCount = state.refreshCount;
            totalRefreshes = state.totalRefreshes;
            intervalSeconds = state.intervalSeconds;
            isPaused = state.isPaused;
            pauseButton.textContent = isPaused ? '▶️ Resume' : '⏸ Pause';
            const remaining = totalRefreshes - refreshCount;
            display.textContent = `⏳ Resuming ${remaining}/${totalRefreshes} in ${intervalSeconds}s`;
            startAutoRefresh(display);
        }

        // Pause/resume control
        pauseButton.onclick = () => {
            isPaused = !isPaused;
            pauseButton.textContent = isPaused ? '▶️ Resume' : '⏸ Pause';
            saveState();
        };

        // Start button control
        startButton.onclick = () => {
            totalRefreshes = parseInt(countInput.value, 10);
            intervalSeconds = parseInt(intervalInput.value, 10);

            if (isNaN(totalRefreshes) || totalRefreshes < 1) {
                alert('Enter a valid number of times.');
                return;
            }
            if (isNaN(intervalSeconds) || intervalSeconds < 1) {
                alert('Enter a valid interval in seconds.');
                return;
            }

            refreshCount = 0;
            isPaused = false;
            pauseButton.textContent = '⏸ Pause';
            const remaining = totalRefreshes;
            display.textContent = `⏳ Refreshing ${remaining}/${totalRefreshes} in ${intervalSeconds}s`;

            saveState();
            startAutoRefresh(display);
        };

        // Stop button control
        stopButton.onclick = () => {
            stopAll(display);
        };
    });
})();