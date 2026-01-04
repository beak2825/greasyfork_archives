// ==UserScript==
// @name         Coursera Module Countdown Timer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Configurable countdown timer for focusing purposes.
// @author       Setnour6
// @match        https://www.coursera.org/learn/*/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/541636/Coursera%20Module%20Countdown%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/541636/Coursera%20Module%20Countdown%20Timer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const defaultConfig = {
        position: 'top',
        backgroundColor: '#ffffff',
        textColor: '#2a2a2a',
        fontSize: '16px',
        padding: '6px 14px',
        borderRadius: '15px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        snapThreshold: 50,
        snapEnabled: true,
        lockPosition: false,
        debug: false,
        showSettings: false
    };
    let config = Object.assign({}, defaultConfig, GM_getValue('config', {}));

    GM_addStyle(`
        .countdown-timer {
            position: fixed;
            cursor: move;
            user-select: none;
            touch-action: none;
            transition: all 0.3s ease;
            background: ${config.backgroundColor};
            color: ${config.textColor};
            font-size: ${config.fontSize};
            padding: ${config.padding};
            border-radius: ${config.borderRadius};
            box-shadow: ${config.boxShadow};
            z-index: 999999;
            font-family: Arial, sans-serif;
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .timer-content {
            min-width: 80px;
            text-align: center;
            min-font-size: 10px;
        }

        .settings-icon {
            cursor: pointer;
            padding: 5px;
            display: flex;
            align-items: center;
            transition: transform 0.2s;
        }

        .settings-icon:hover {
            transform: rotate(90deg);
        }

        .settings-panel {
            position: absolute;
            background: white;
            padding: 12px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 1000000;
            width: 250px;
            display: none;
        }

        .settings-panel.visible {
            display: block;
        }

        .settings-row {
            margin: 10px 0;
        }

        .settings-label {
            display: block;
            margin-bottom: 5px;
            font-size: 14px;
            color: #444;
        }

        select, input[type="number"], input[type="text"] {
            width: 100%;
            padding: 5px;
            margin-bottom: 10px;
        }

        button {
            padding: 8px 15px;
            margin-right: 5px;
            cursor: pointer;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
        }

        #resetDefaults {
            background: #dc3545 !important;
            margin-top: 15px;
        }


        #snapThreshold:disabled {
            background: #eee;
            cursor: not-allowed;
        }

        details {
            margin-bottom: 15px;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        }

        summary {
            cursor: pointer;
            font-weight: bold;
            margin-bottom: 10px;
            color: #333;
            user-select: none;
        }

        details[open] summary {
            margin-bottom: 15px;
        }

        input[type="color"] {
            height: 30px;
            width: 100%;
            padding: 3px;
        }
    `);

    const timer = document.createElement('div');
    timer.className = 'countdown-timer';
    timer.innerHTML = `
        <div class="timer-content"></div>
        <div class="settings-icon">⚙️</div>
        <div class="settings-panel">
            <details>
            <summary>Display Settings</summary>
                    <div class="settings-row">
                        <label>
                            <input type="checkbox" id="lockPosition" ${config.lockPosition ? 'checked' : ''}>
                            Keep Current Position
                        </label>
                    </div>
                <div class="settings-row">
                    <label class="settings-label">Position:</label>
                    <select id="position">
                        <option value="top">Top</option>
                        <option value="top-right">Top Right</option>
                        <option value="top-left">Top Left</option>
                        <option value="bottom">Bottom</option>
                        <option value="bottom-right">Bottom Right</option>
                        <option value="bottom-left">Bottom Left</option>
                        <option value="left">Left</option>
                        <option value="right">Right</option>
                    </select>
                </div>
                <div class="settings-row">
                    <label>
                        <input type="checkbox" id="snapEnabled" ${config.snapEnabled ? 'checked' : ''}>
                        Enable Snapping
                    </label>
                </div>
                <div class="settings-row">
                    <label class="settings-label">Snap Threshold (px):</label>
                    <input type="number" id="snapThreshold"
                           value="${config.snapThreshold}"
                           ${config.snapEnabled ? '' : 'disabled'}>
                </div>
            </details>
            <details>
                <summary>Appearance Settings</summary>
                <div class="settings-row">
                    <label class="settings-label">Font Size (px):</label>
                    <input type="number" id="fontSize" value="${parseInt(config.fontSize)}" min="10">
                </div>
                <div class="settings-row">
                    <label class="settings-label">Background Color:</label>
                    <input type="color" id="backgroundColor" value="${config.backgroundColor}">
                </div>
                <div class="settings-row">
                    <label class="settings-label">Text Color:</label>
                    <input type="color" id="textColor" value="${config.textColor}">
                </div>
                <div class="settings-row">
                    <label class="settings-label">Padding:</label>
                    <input type="text" id="padding" value="${config.padding}" placeholder="e.g., 6px 14px">
                </div>
                <div class="settings-row">
                    <label class="settings-label">Border Radius:</label>
                    <input type="text" id="borderRadius" value="${config.borderRadius}" placeholder="e.g., 15px">
                </div>
                <div class="settings-row">
                    <label class="settings-label">Box Shadow:</label>
                    <input type="text" id="boxShadow" value="${config.boxShadow}" placeholder="e.g., 0 2px 10px rgba(0,0,0,0.2)">
                </div>
            </details>

            <div class="settings-row">
                <label class="settings-label">Debug Mode:</label>
                <input type="checkbox" id="debug" ${config.debug ? 'checked' : ''}>
            </div>

            <div class="settings-row">
                <button id="saveSettings">Save</button>
                <button id="closeSettings">Close</button>
            </div>
            <div class="settings-row">
                <button id="resetDefaults">Reset to Defaults</button>
            </div>
        </div>
    `;
    document.body.appendChild(timer);

    const timerContent = timer.querySelector('.timer-content');
    const settingsPanel = timer.querySelector('.settings-panel');
    const settingsIcon = timer.querySelector('.settings-icon');
    const snapEnabled = timer.querySelector('#snapEnabled');
    const snapThreshold = timer.querySelector('#snapThreshold');
    snapEnabled.addEventListener('change', () => {
        snapThreshold.disabled = !snapEnabled.checked;
    });

    let intervalId = null, currentModuleId = null, currentInitialTime = null;
    let isDragging = false, dragStartX = 0, dragStartY = 0, initialLeft = 0, initialTop = 0;

    const observer = new MutationObserver(() => {
        if (!config.showSettings) {
            checkModuleChange();
            findAndProcessTime();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    settingsIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        adjustPanelPosition();
        settingsPanel.classList.toggle('visible');
    });

    timer.querySelector('#resetDefaults').addEventListener('click', () => {
        config = Object.assign({}, defaultConfig);
        GM_setValue('config', config);
        updateFormValues();
        updateTimerStyles();
        updateTimerPosition();
        settingsPanel.classList.add('visible');
    });

    function updateFormValues() {
        timer.querySelector('#position').value = config.position;
        timer.querySelector('#snapEnabled').checked = config.snapEnabled;
        timer.querySelector('#snapThreshold').value = config.snapThreshold;
        timer.querySelector('#snapThreshold').disabled = !config.snapEnabled;
        timer.querySelector('#fontSize').value = parseInt(config.fontSize);
        timer.querySelector('#backgroundColor').value = config.backgroundColor;
        timer.querySelector('#textColor').value = config.textColor;
        timer.querySelector('#padding').value = config.padding;
        timer.querySelector('#borderRadius').value = config.borderRadius;
        timer.querySelector('#boxShadow').value = config.boxShadow;
        timer.querySelector('#debug').checked = config.debug;
        timer.querySelector('#lockPosition').checked = config.lockPosition;
    }

    function adjustPanelPosition() {
        const timerRect = timer.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        settingsPanel.style.left = '';
        settingsPanel.style.right = '';
        settingsPanel.style.top = '';
        settingsPanel.style.bottom = '';
        settingsPanel.style.transform = '';

        if (timerRect.left > viewportWidth / 2) {
            settingsPanel.style.right = '100%';
            settingsPanel.style.left = 'auto';
        } else {
            settingsPanel.style.left = '100%';
            settingsPanel.style.right = 'auto';
        }

        if (timerRect.bottom > viewportHeight - 200) {
            settingsPanel.style.bottom = '100%';
            settingsPanel.style.top = 'auto';
        } else {
            settingsPanel.style.top = '0';
            settingsPanel.style.bottom = 'auto';
        }

        if (timerRect.top > viewportHeight * 0.7) { // If in bottom 30% of screen
            settingsPanel.style.bottom = '100%';
            settingsPanel.style.top = 'auto';
        } else {
            settingsPanel.style.top = '0';
            settingsPanel.style.bottom = 'auto';
        }
    }

    timer.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('click', (e) => {
        if (!timer.contains(e.target)) {
            settingsPanel.classList.remove('visible');
        }
    });

    timer.querySelector('#saveSettings').addEventListener('click', saveSettings);
    timer.querySelector('#closeSettings').addEventListener('click', () => {
        settingsPanel.classList.remove('visible');
    });

    function updateTimerPosition() {
        timer.style.left = '';
        timer.style.right = '';
        timer.style.top = '';
        timer.style.bottom = '';

        switch(config.position) {
            case 'top':
                timer.style.top = '10px';
                timer.style.left = '50%';
                timer.style.transform = 'translateX(-50%)';
                break;
            case 'bottom':
                timer.style.bottom = '10px';
                timer.style.left = '50%';
                timer.style.transform = 'translateX(-50%)';
                break;
            case 'left':
                timer.style.left = '10px';
                timer.style.top = '50%';
                timer.style.transform = 'translateY(-50%)';
                break;
            case 'right':
                timer.style.right = '10px';
                timer.style.top = '50%';
                timer.style.transform = 'translateY(-50%)';
                break;
            case 'top-right':
                timer.style.top = '10px';
                timer.style.right = '10px';
                break;
            case 'top-left':
                timer.style.top = '10px';
                timer.style.left = '10px';
                break;
            case 'bottom-right':
                timer.style.bottom = '10px';
                timer.style.right = '10px';
                break;
            case 'bottom-left':
                timer.style.bottom = '10px';
                timer.style.left = '10px';
                break;
        }
    }

    function saveSettings() {
        const newConfig = {
            lockPosition: timer.querySelector('#lockPosition').checked,
            position: timer.querySelector('#position').value,
            snapThreshold: parseInt(timer.querySelector('#snapThreshold').value),
            snapEnabled: timer.querySelector('#snapEnabled').checked,
            fontSize: Math.max(10, parseInt(timer.querySelector('#fontSize').value)) + 'px',
            backgroundColor: timer.querySelector('#backgroundColor').value,
            textColor: timer.querySelector('#textColor').value,
            padding: timer.querySelector('#padding').value,
            borderRadius: timer.querySelector('#borderRadius').value,
            boxShadow: timer.querySelector('#boxShadow').value,
            debug: timer.querySelector('#debug').checked,
            showSettings: false
        };

        config = Object.assign({}, config, newConfig);
        GM_setValue('config', config);
        updateTimerStyles();

        if (!config.lockPosition) {
            updateTimerPosition();
        }

        settingsPanel.classList.remove('visible');
    }

    function updateTimerStyles() {
        timer.style.backgroundColor = config.backgroundColor;
        timer.style.color = config.textColor;
        timer.style.fontSize = config.fontSize;
        timer.style.padding = config.padding;
        timer.style.borderRadius = config.borderRadius;
        timer.style.boxShadow = config.boxShadow;
    }

    function startDrag(e) {
        if (e.target.closest('.settings-icon') || e.target.closest('.settings-panel')) return;
        isDragging = true;
        timer.style.transition = 'none';
        timer.style.transform = 'none';
        const rect = timer.getBoundingClientRect();
        dragStartX = e.clientX - rect.left;
        dragStartY = e.clientY - rect.top;
        initialLeft = rect.left;
        initialTop = rect.top;
    }

    function handleDrag(e) {
        if (!isDragging) return;

        const newX = e.clientX - dragStartX;
        const newY = e.clientY - dragStartY;
        const maxX = Math.max(window.innerWidth - timer.offsetWidth, 0);
        const maxY = Math.max(window.innerHeight - timer.offsetHeight, 0);
        const constrainedX = Math.min(Math.max(newX, 0), maxX);
        const constrainedY = Math.min(Math.max(newY, 0), maxY);

        timer.style.left = `${constrainedX}px`;
        timer.style.top = `${constrainedY}px`;
        timer.style.right = 'auto';
        timer.style.bottom = 'auto';
    }


    function endDrag() {
        if (!isDragging) return;
        isDragging = false;
        timer.style.transition = 'all 0.3s ease';

        const finalRect = timer.getBoundingClientRect();
        const moved = (finalRect.left !== initialLeft || finalRect.top !== initialTop);

        if (!moved || !config.snapEnabled) return;

        const snapPoints = {
            left: finalRect.left,
            right: window.innerWidth - finalRect.right,
            top: finalRect.top,
            bottom: window.innerHeight - finalRect.bottom
        };

        let newX = finalRect.left;
        let newY = finalRect.top;

        if (Math.min(snapPoints.left, snapPoints.right) < config.snapThreshold) {
            newX = snapPoints.left < snapPoints.right ? 10 : window.innerWidth - timer.offsetWidth - 10;
        }

        if (Math.min(snapPoints.top, snapPoints.bottom) < config.snapThreshold) {
            newY = snapPoints.top < snapPoints.bottom ? 10 : window.innerHeight - timer.offsetHeight - 10;
        }

        const maxX = Math.max(window.innerWidth - timer.offsetWidth, 0);
        const maxY = Math.max(window.innerHeight - timer.offsetHeight, 0);

        timer.style.left = `${Math.min(Math.max(newX, 0), maxX)}px`;
        timer.style.top = `${Math.min(Math.max(newY, 0), maxY)}px`;
    }


    function checkModuleChange() {
        const selectedLink = document.querySelector('a[aria-label^="selected link"]');
        if (!selectedLink) return;

        const newModuleId = selectedLink.href.split('/').pop();
        if (newModuleId !== currentModuleId) {
            currentModuleId = newModuleId;
            clearInterval(intervalId);
            timerContent.textContent = 'Loading...';
        }
    }

    function findAndProcessTime() {
        const timeContainer = document.querySelector('a[aria-label^="selected link"] .rc-EffortText');
        if (!timeContainer) return;

        const timeElement = timeContainer.querySelector('[aria-hidden="true"]') ||
                          timeContainer.querySelector('.rc-A11yScreenReaderOnly');
        if (!timeElement) return;

        const timeMatch = timeElement.textContent.match(/(\d+)\s*(min|minutes|m)/i);
        if (!timeMatch) return;

        const minutes = parseInt(timeMatch[1], 10);
        if (isNaN(minutes)) return;

        const newDuration = minutes * 60;
        if (newDuration !== currentInitialTime) {
            startCountdown(newDuration);
        }
    }

    function startCountdown(totalSeconds) {
        clearInterval(intervalId);
        currentInitialTime = totalSeconds;
        let remaining = totalSeconds;

        function update() {
            if (remaining >= 0) {
                const m = Math.floor(remaining / 60);
                const s = remaining % 60;
                timerContent.textContent = `${m}:${s.toString().padStart(2, '0')}`;
                remaining--;
            } else {
                timerContent.textContent = 'Time\'s up!';
                timerContent.style.color = '#ff0000';
                clearInterval(intervalId);
            }
        }

        timerContent.style.color = config.textColor;
        update();
        intervalId = setInterval(update, 1000);
    }

    timer.querySelector('#position').value = config.position;
    updateTimerPosition();
    updateTimerStyles();
    checkModuleChange();
    findAndProcessTime();
})();