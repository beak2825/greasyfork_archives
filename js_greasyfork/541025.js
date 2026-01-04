// ==UserScript==
// @name         IMVU Auto Refresh Pended Credits Page
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Refreshes IMVU Pended Credits Page to update sales, with UI controls and darkmode neon green styling
// @author       Pythius
// @match        https://www.imvu.com/catalog/developer_report.php?reporttype=pendedcredits
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imvu.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541025/IMVU%20Auto%20Refresh%20Pended%20Credits%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/541025/IMVU%20Auto%20Refresh%20Pended%20Credits%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const neonColor = '#0d9200';
    const darkBackground = 'rgba(18, 18, 18, 0.9)';
    const storageKey = 'imvuAutoRefreshSettings';

    let settings = JSON.parse(localStorage.getItem(storageKey)) || {
        refreshInterval: 300000,
        width: null,
        height: null,
        top: 10,
        left: 10,
        running: false,
        lastRefreshTime: null
    };

    let refreshCount = Number(sessionStorage.getItem('imvuRefreshCount')) || 0;

    const panel = document.createElement('div');
    panel.style.cssText = `
        position: fixed;
        top: ${settings.top}px;
        left: ${settings.left}px;
        background: ${darkBackground};
        color: ${neonColor};
        padding: 6px 8px;
        border-radius: 10px;
        font-family: 'Courier New', monospace;
        font-size: 10px;
        z-index: 9999;
        box-shadow: 0 0 10px ${neonColor};
        border: 1px solid ${neonColor};
        resize: both;
        overflow: hidden;
        user-select: none;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        white-space: nowrap;
    `;

    if (settings.width && settings.height) {
        panel.style.width = settings.width + 'px';
        panel.style.height = settings.height + 'px';
    }

    const saveSettings = () => {
        settings.width = panel.offsetWidth;
        settings.height = panel.offsetHeight;
        settings.top = panel.offsetTop;
        settings.left = panel.offsetLeft;
        localStorage.setItem(storageKey, JSON.stringify(settings));
    };

    panel.addEventListener('mouseup', saveSettings);
    panel.addEventListener('touchend', saveSettings);

    const dragHandle = document.createElement('div');
    dragHandle.textContent = '≡ Drag here';
    dragHandle.style.cssText = `
        cursor: move;
        padding: 2px 4px;
        font-weight: bold;
        color: ${neonColor};
        user-select: none;
        text-align: center;
        margin-bottom: 6px;
    `;
    panel.appendChild(dragHandle);

    (function makeDraggable(elem) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        dragHandle.onpointerdown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onpointermove = elementDrag;
            document.onpointerup = closeDragElement;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            elem.style.top = (elem.offsetTop - pos2) + "px";
            elem.style.left = (elem.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onpointermove = null;
            document.onpointerup = null;
            saveSettings();
        }
    })(panel);

    const refreshCountDisplay = document.createElement('div');
    panel.appendChild(refreshCountDisplay);

    const lastRefreshDisplay = document.createElement('div');
    panel.appendChild(lastRefreshDisplay);

    const countdownDisplay = document.createElement('div');
    panel.appendChild(countdownDisplay);

    const intervalInput = document.createElement('input');
    intervalInput.type = 'number';
    intervalInput.min = 5;
    intervalInput.max = 3600;
    intervalInput.value = settings.refreshInterval / 1000;
    intervalInput.style.cssText = `
        width: 100%;
        background: ${darkBackground};
        border: 1px solid ${neonColor};
        color: ${neonColor};
        font-family: 'Courier New', monospace;
        font-size: 10px;
        padding: 2px 4px;
        box-sizing: border-box;
        border-radius: 4px;
        outline-offset: 0;
        user-select: text;
    `;

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = settings.running ? 'Pause' : 'Start';
    toggleBtn.style.cssText = `
        width: 100%;
        background: transparent;
        border: 1px solid ${neonColor};
        color: ${neonColor};
        font-family: 'Courier New', monospace;
        font-size: 10px;
        padding: 4px 0;
        border-radius: 4px;
        cursor: pointer;
        user-select: none;
        margin-top: 6px;
    `;

    panel.appendChild(intervalInput);
    panel.appendChild(toggleBtn);
    document.body.appendChild(panel);

    function formatDateTime(dateStr) {
        if (!dateStr) return 'Never';
        const date = new Date(dateStr);
        return date.toLocaleString();
    }

    let countdownInterval = null;
    let remainingTime = settings.refreshInterval;
    let lastUpdateTime = Date.now();

    function updateUI() {
        refreshCountDisplay.textContent = `Refresh count: ${refreshCount}`;
        lastRefreshDisplay.textContent = `Last refresh: ${formatDateTime(settings.lastRefreshTime)}`;

        if (settings.running) {
            let mins = Math.floor(remainingTime / 60000);
            let secs = Math.floor((remainingTime % 60000) / 1000);
            countdownDisplay.textContent = `Refreshing in: ${mins}m ${secs}s`;
            toggleBtn.textContent = 'Pause';
        } else {
            countdownDisplay.textContent = 'Paused';
            toggleBtn.textContent = 'Start';
        }
    }

    function saveSettingsToStorage() {
        localStorage.setItem(storageKey, JSON.stringify(settings));
        sessionStorage.setItem('imvuRefreshCount', refreshCount.toString());
    }

    function startTimer() {
        if (countdownInterval) clearInterval(countdownInterval);

        settings.running = true;
        remainingTime = settings.refreshInterval;
        lastUpdateTime = Date.now();
        saveSettingsToStorage();
        updateUI();

        countdownInterval = setInterval(() => {
            const now = Date.now();
            const elapsed = now - lastUpdateTime;
            lastUpdateTime = now;
            remainingTime -= elapsed;

            if (remainingTime <= 0) {
                refreshCount++;

                // 🟢 Clear session count every 50 refreshes to free memory
                if (refreshCount >= 100) {
                    refreshCount = 0;
                    sessionStorage.removeItem('imvuRefreshCount');
                }

                settings.lastRefreshTime = new Date().toISOString();
                saveSettingsToStorage();
                updateUI();
                location.reload();
            } else {
                updateUI();
            }
        }, 1000);
    }

    function pauseTimer() {
        settings.running = false;
        saveSettingsToStorage();
        if (countdownInterval) clearInterval(countdownInterval);
        updateUI();
    }

    toggleBtn.onclick = () => {
        const val = Number(intervalInput.value);
        if (isNaN(val) || val < 5 || val > 3600) {
            alert('Please enter a refresh interval between 5 and 3600 seconds.');
            intervalInput.value = settings.refreshInterval / 1000;
            return;
        }

        settings.refreshInterval = val * 1000;
        saveSettingsToStorage();

        if (settings.running) {
            pauseTimer();
        } else {
            startTimer();
        }
    };

    intervalInput.onchange = () => {
        const val = Number(intervalInput.value);
        if (isNaN(val) || val < 5 || val > 3600) {
            alert('Please enter a refresh interval between 5 and 3600 seconds.');
            intervalInput.value = settings.refreshInterval / 1000;
            return;
        }
        settings.refreshInterval = val * 1000;
        saveSettingsToStorage();

        if (settings.running) {
            startTimer();
        }
    };

    updateUI();
    if (settings.running) startTimer();

})();
