// ==UserScript==
// @name               YouTube Speed and Loop
// @name:zh-TW         YouTube 播放速度與循環
// @namespace          https://github.com/Hank8933
// @version            1.1.1
// @description        Enhances YouTube with playback speeds and repeat functionality.
// @description:zh-TW  為 YouTube 提供超過 2 倍的播放速度控制和重複播放功能。
// @author             Hank8933
// @homepage           https://github.com/Hank8933/YouTube-Speed-and-Loop
// @match              https://www.youtube.com/*
// @grant              none
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/529190/YouTube%20Speed%20and%20Loop.user.js
// @updateURL https://update.greasyfork.org/scripts/529190/YouTube%20Speed%20and%20Loop.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const PANEL_ID = 'yt-enhancements-panel';
    let isInitializing = false;

    const panelCSS = `
        :root {
            --primary-bg: transparent; --hover-bg: rgba(255, 255, 255, 0.1); --active-bg: #f00;
            --panel-bg: #282828; --text-color: #fff; --shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            --input-bg: rgba(0, 0, 0, 0.3); --input-border: rgba(255, 255, 255, 0.2);
        }
        .yt-custom-control-panel {
            position: relative; z-index: 99999; font-family: Roboto, Arial, sans-serif;
            align-self: center; margin-right: 8px;
        }
        .yt-custom-control-toggle {
            background-color: var(--primary-bg); color: var(--text-color);
            border: 1px solid rgba(255, 255, 255, 0.1); font-weight: 500; cursor: pointer;
            transition: background-color 0.3s; display: flex; align-items: center; justify-content: center;
            width: 40px; height: 40px; box-sizing: border-box; border-radius: 50%;
            font-size: 2rem; line-height: 0;
        }
        .yt-custom-control-toggle:hover { background-color: var(--hover-bg); }
        .yt-custom-control-content {
            position: absolute; top: calc(100% + 10px); right: 0; transform: none; left: auto;
            background-color: var(--panel-bg); color: var(--text-color); padding: 12px;
            border: 1px solid var(--input-border); border-radius: 12px; box-shadow: var(--shadow);
            display: none; flex-direction: column; gap: 12px; min-width: 320px; white-space: nowrap;
        }
        .yt-custom-control-panel.expanded .yt-custom-control-content { display: flex; }
        .yt-custom-control-title {
            font-weight: bold; margin-bottom: 8px; padding: 0 5px; font-size: 16px;
        }
        .yt-custom-control-section { padding: 8px; border-radius: 8px; transition: background-color 0.2s; }
        .yt-custom-control-section:hover { background-color: rgba(255, 255, 255, 0.05); }
        .yt-custom-btn {
            background-color: rgba(255, 255, 255, 0.15); border: none; color: var(--text-color);
            padding: 6px 12px; border-radius: 18px; cursor: pointer; font-size: 13px;
            white-space: nowrap; text-align: center; flex-grow: 1; margin-right: 8px;
        }
        .yt-custom-btn:last-child { margin-right: 0; }
        .yt-custom-btn:hover { background-color: rgba(255, 255, 255, 0.25); }
        .yt-custom-btn.active { background-color: var(--active-bg); }
        .yt-custom-btn-group { display: flex; justify-content: space-between; padding: 0 8px; }
        .yt-speed-controls { display: flex; flex-direction: column; gap: 8px; white-space: nowrap; }
        .yt-slider-row { display: flex; align-items: center; width: 100%; }
        .yt-custom-slider { flex-grow: 1; min-width: 100px; }
        .yt-preset-speeds { display: flex; gap: 5px; width: 100%; }
        .loop-input-container {
            display: flex; align-items: center; justify-content: space-between;
            gap: 8px; margin-top: 10px; padding: 0 8px;
        }
        .loop-time-input {
            width: 100%; background-color: var(--input-bg);
            border: 1px solid var(--input-border); color: var(--text-color);
            border-radius: 8px; padding: 8px; font-family: 'Courier New', Courier, monospace;
            font-size: 14px; text-align: center; transition: border-color 0.3s, box-shadow 0.3s;
        }
        .loop-time-input:focus {
            outline: none; border-color: #3ea6ff;
            box-shadow: 0 0 5px rgba(62, 166, 255, 0.5);
        }
        .yt-custom-row {
            display: flex; justify-content: space-between; align-items: center;
            gap: 10px; padding: 4px 8px;
        }
        .yt-custom-row:not(:last-child) { margin-bottom: 8px; }
        .yt-custom-label {
            font-size: 14px; flex-shrink: 0;
        }
        .yt-custom-row .shortcut-label {
            flex-basis: 120px; /* Fixed width for alignment */
            text-align: right;
        }
        .yt-custom-toggle-btn {
            flex-grow: 0; min-width: 60px; margin-right: 0;
        }
        .shortcut-input {
            flex-grow: 1; /* Takes remaining space */
            background-color: var(--input-bg);
            border: 1px solid var(--input-border); color: var(--text-color);
            border-radius: 8px; padding: 8px; font-family: 'Courier New', Courier, monospace;
            font-size: 14px; text-align: center; cursor: pointer;
        }
        .shortcut-input:focus {
            outline: none; border-color: #3ea6ff;
            box-shadow: 0 0 5px rgba(62, 166, 255, 0.5);
        }
    `;
    const styleEl = document.createElement('style');
    styleEl.textContent = panelCSS;
    document.head.appendChild(styleEl);

    function getFormattedTimestamp() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    function createElement(tag, id, className, textContent) {
        const el = document.createElement(tag);
        if (id) el.id = id;
        if (className) el.className = className;
        if (textContent) el.textContent = textContent;
        return el;
    }

    let playbackRateDisconnect = () => { };
    let loopDisconnect = () => { };

    function cleanUpVideoFeatures() {
        playbackRateDisconnect();
        loopDisconnect();
        AutoConfirmController.stop();
        playbackRateDisconnect = () => { };
        loopDisconnect = () => { };
    }

    function createAndSetupControlPanel(container) {
        const panel = createElement('div', PANEL_ID, 'yt-custom-control-panel');
        const toggleBtn = createElement('button', null, 'yt-custom-control-toggle', '≡');
        const contentDiv = createElement('div', null, 'yt-custom-control-content');
        toggleBtn.addEventListener('click', (e) => { e.stopPropagation(); panel.classList.toggle('expanded'); toggleBtn.textContent = panel.classList.contains('expanded') ? '×' : '≡'; });
        document.addEventListener('click', () => { if (panel.classList.contains('expanded')) { panel.classList.remove('expanded'); toggleBtn.textContent = '≡'; } });
        contentDiv.addEventListener('click', (e) => e.stopPropagation());

        const titleDiv = createElement('div', null, 'yt-custom-control-title', 'YouTube Enhanced Controls');

        const speedSection = createElement('div', null, 'yt-custom-control-section');
        const speedText = createElement('div', null, 'yt-custom-control-title', 'Playback Speed: ');
        const speedValue = createElement('span', null, null, '1.0');
        speedText.appendChild(speedValue); speedText.append('x');
        const speedControls = createElement('div', null, 'yt-speed-controls');
        const sliderRow = createElement('div', null, 'yt-slider-row');
        const speedSlider = createElement('input', null, 'yt-custom-slider');
        speedSlider.type = 'range'; speedSlider.min = '0.25'; speedSlider.max = '5'; speedSlider.step = '0.25'; speedSlider.value = '1';
        sliderRow.appendChild(speedSlider);
        const presetSpeeds = createElement('div', null, 'yt-preset-speeds yt-custom-btn-group');
        [1, 1.5, 2, 3, 4, 5].forEach(speed => { const btn = createElement('button', null, 'yt-custom-btn yt-speed-preset', `${speed}x`); btn.dataset.speed = speed; presetSpeeds.appendChild(btn); });
        speedControls.append(sliderRow, presetSpeeds);
        speedSection.append(speedText, speedControls);

        const loopSection = createElement('div', null, 'yt-custom-control-section');
        loopSection.appendChild(createElement('div', null, 'yt-custom-control-title', 'Loop Controls'));
        const loopToggleRow = createElement('div', null, 'yt-custom-row');
        loopToggleRow.appendChild(createElement('label', null, 'yt-custom-label', 'Loop Playback'));
        const loopToggle = createElement('button', null, 'yt-custom-btn yt-custom-toggle-btn', 'Off');
        loopToggleRow.appendChild(loopToggle);
        const rangeButtons = createElement('div', null, 'yt-custom-btn-group');
        const loopStartBtn = createElement('button', null, 'yt-custom-btn', 'Set Start');
        const loopEndBtn = createElement('button', null, 'yt-custom-btn', 'Set End');
        const loopClearBtn = createElement('button', null, 'yt-custom-btn', 'Clear');
        rangeButtons.append(loopStartBtn, loopEndBtn, loopClearBtn);
        const loopInputContainer = createElement('div', null, 'loop-input-container');
        const loopStartInput = createElement('input', null, 'loop-time-input');
        loopStartInput.type = 'text'; loopStartInput.placeholder = '00:00.000';
        const loopInputSeparator = createElement('span', null, null, '→');
        const loopEndInput = createElement('input', null, 'loop-time-input');
        loopEndInput.type = 'text'; loopEndInput.placeholder = '00:00.000';
        loopInputContainer.append(loopStartInput, loopInputSeparator, loopEndInput);
        loopSection.append(loopToggleRow, rangeButtons, loopInputContainer);

        const shortcutSection = createElement('div', null, 'yt-custom-control-section');
        shortcutSection.appendChild(createElement('div', null, 'yt-custom-control-title', 'Keyboard Shortcuts'));

        const createShortcutRow = (label, id) => {
            const row = createElement('div', null, 'yt-custom-row');
            row.appendChild(createElement('label', null, 'yt-custom-label shortcut-label', label));
            const input = createElement('input', id, 'shortcut-input');
            input.type = 'text'; input.placeholder = 'Click and press a key'; input.readOnly = true;
            row.appendChild(input);
            return { row, input };
        };

        const { row: setStartRow, input: shortcutSetStartInput } = createShortcutRow('Set Start:', 'shortcut-set-start');
        const { row: replayStartRow, input: shortcutReplayStartInput } = createShortcutRow('Jump to Start:', 'shortcut-replay-start');
        const { row: setEndRow, input: shortcutSetEndInput } = createShortcutRow('Set End:', 'shortcut-set-end');
        const { row: clearLoopRow, input: shortcutClearLoopInput } = createShortcutRow('Clear Loop:', 'shortcut-clear-loop');

        shortcutSection.append(setStartRow, replayStartRow, setEndRow, clearLoopRow);

        const autoConfirmSection = createElement('div', null, 'yt-custom-control-section');
        const autoConfirmRow = createElement('div', null, 'yt-custom-row');
        autoConfirmRow.appendChild(createElement('label', null, 'yt-custom-label', 'Auto-Click "Continue watching?"'));
        const autoConfirmToggle = createElement('button', null, 'yt-custom-btn yt-custom-toggle-btn', 'Off');
        autoConfirmRow.appendChild(autoConfirmToggle);
        autoConfirmSection.appendChild(autoConfirmRow);

        contentDiv.append(titleDiv, speedSection, loopSection, shortcutSection, autoConfirmSection);
        panel.append(toggleBtn, contentDiv);
        container.prepend(panel);

        return {
            speedSection, speedValue, speedSlider, presetSpeeds,
            loopSection, loopToggle,
            loopStartBtn, loopEndBtn, loopClearBtn, loopStartInput, loopEndInput,
            shortcutSetStartInput, shortcutReplayStartInput, shortcutSetEndInput, shortcutClearLoopInput,
            autoConfirmToggle
        };
    }

    function waitForElement(selector, parent = document) {
        return new Promise(resolve => {
            const interval = setInterval(() => {
                const element = parent.querySelector(selector);
                if (element) {
                    clearInterval(interval);
                    resolve(element);
                }
            }, 250);
        });
    }

    const SpeedController = {
        updatePlaybackRate(rate, elements) {
            if (!document.querySelector('video') || !elements) return;
            elements.speedValue.textContent = parseFloat(rate).toFixed(2);
            elements.speedSlider.value = rate;
            elements.presetSpeeds.querySelectorAll('.yt-speed-preset').forEach(btn => {
                btn.classList.toggle('active', parseFloat(btn.dataset.speed) === parseFloat(rate));
            });
        },
        init(video, elements) {
            elements.speedSlider.addEventListener('input', () => { video.playbackRate = parseFloat(elements.speedSlider.value); this.updatePlaybackRate(video.playbackRate, elements); });
            elements.presetSpeeds.addEventListener('click', (e) => { const btn = e.target.closest('.yt-speed-preset'); if (btn) { video.playbackRate = parseFloat(btn.dataset.speed); this.updatePlaybackRate(video.playbackRate, elements); } });
            let lastRate = video.playbackRate;
            const observer = setInterval(() => { const cv = document.querySelector('video'); if (cv && cv.playbackRate !== lastRate) { lastRate = cv.playbackRate; this.updatePlaybackRate(lastRate, elements); } }, 500);
            playbackRateDisconnect = () => clearInterval(observer);
        }
    };

    const LoopController = {
        loopStart: null,
        loopEnd: null,
        formatTime(seconds) { if (seconds === null || isNaN(seconds)) return ''; const mins = Math.floor(seconds / 60); const secs = Math.floor(seconds % 60); const ms = Math.round((seconds - Math.floor(seconds)) * 1000); return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(3, '0')}`; },
        parseTime(timeStr) { if (!timeStr) return null; const parts = timeStr.split(':'); let seconds = 0; try { if (parts.length === 2) { seconds = parseInt(parts[0], 10) * 60 + parseFloat(parts[1]); } else { seconds = parseFloat(parts[0]); } return isNaN(seconds) ? null : seconds; } catch (e) { return null; } },
        init(video, elements) {
            let isLooping = video.loop;
            const { loopToggle, loopStartBtn, loopEndBtn, loopClearBtn, loopStartInput, loopEndInput } = elements;
            const updateLoopInputs = () => { loopStartInput.value = this.formatTime(this.loopStart); loopEndInput.value = this.formatTime(this.loopEnd); };
            const updateLoopState = (newState) => { isLooping = newState; loopToggle.textContent = isLooping ? 'On' : 'Off'; loopToggle.classList.toggle('active', isLooping); };
            updateLoopState(isLooping);
            updateLoopInputs();
            loopToggle.addEventListener('click', () => { video.loop = !video.loop; updateLoopState(video.loop); });
            loopStartBtn.addEventListener('click', () => { this.loopStart = video.currentTime; updateLoopInputs(); });
            loopEndBtn.addEventListener('click', () => { this.loopEnd = video.currentTime; updateLoopInputs(); });
            loopClearBtn.addEventListener('click', () => { this.loopStart = null; this.loopEnd = null; updateLoopInputs(); });
            loopStartInput.addEventListener('change', () => { const parsed = this.parseTime(loopStartInput.value); this.loopStart = parsed; loopStartInput.value = this.formatTime(parsed); });
            loopEndInput.addEventListener('change', () => { const parsed = this.parseTime(loopEndInput.value); this.loopEnd = parsed; loopEndInput.value = this.formatTime(parsed); });
            video.addEventListener('timeupdate', () => { if (isLooping && this.loopStart !== null && this.loopEnd !== null && this.loopStart < this.loopEnd && video.currentTime >= this.loopEnd) { video.currentTime = this.loopStart; } });
            let lastLoopState = video.loop;
            const observer = setInterval(() => { const cv = document.querySelector('video'); if (cv && cv.loop !== lastLoopState) { lastLoopState = cv.loop; updateLoopState(lastLoopState); } }, 500);
            loopDisconnect = () => clearInterval(observer);
        }
    };

    const AutoConfirmController = {
        observer: null,
        isEnabled: false,
        storageKey: 'yt-auto-confirm-enabled',
        init(toggleButton) {
            const savedState = localStorage.getItem(this.storageKey);
            this.isEnabled = savedState === 'true';
            this.updateButtonState(toggleButton);
            if (this.isEnabled) this.start();
            toggleButton.addEventListener('click', () => { this.isEnabled = !this.isEnabled; localStorage.setItem(this.storageKey, this.isEnabled); this.updateButtonState(toggleButton); this.isEnabled ? this.start() : this.stop(); });
        },
        updateButtonState(toggleButton) {
            if (toggleButton) { toggleButton.textContent = this.isEnabled ? 'On' : 'Off'; toggleButton.classList.toggle('active', this.isEnabled); }
        },
        start() {
            if (this.observer) return;
            this.observer = new MutationObserver(() => {
                const dialog = document.querySelector('yt-confirm-dialog-renderer');
                if (dialog && dialog.offsetParent !== null) {
                    console.log(`%c[YouTube Enhanced Controls]%c [${getFormattedTimestamp()}] Auto-clicked "Continue Watching?" dialog.`, 'font-weight: bold; color: #ff8c00;', 'color: inherit;');
                    dialog.querySelector('#confirm-button')?.click();
                }
            });
            this.observer.observe(document.body, { childList: true, subtree: true });
        },
        stop() {
            if (this.observer) { this.observer.disconnect(); this.observer = null; }
        }
    };

    const ShortcutController = {
        config: {},
        storageKey: 'yt-speed-loop-shortcuts',
        elements: {},
        actions: ['setStart', 'replayStart', 'setEnd', 'clearLoop'],
        init(uiElements) {
            this.elements = {
                setStart: uiElements.shortcutSetStartInput,
                replayStart: uiElements.shortcutReplayStartInput,
                setEnd: uiElements.shortcutSetEndInput,
                clearLoop: uiElements.shortcutClearLoopInput,
                loopStartInput: uiElements.loopStartInput,
                loopEndInput: uiElements.loopEndInput
            };
            this.loadConfig();
            this.updateAllInputs();
            this.actions.forEach(action => {
                const element = this.elements[action];
                if (element) {
                    element.addEventListener('keydown', e => this.captureShortcut(e, action));
                    element.addEventListener('blur', () => this.updateInput(action));
                }
            });
            document.addEventListener('keydown', e => this.handleGlobalKeyDown(e));
        },
        loadConfig() { try { const savedConfig = localStorage.getItem(this.storageKey); this.config = savedConfig ? JSON.parse(savedConfig) : {}; } catch (e) { console.error('[YouTube Enhanced Controls] Error loading shortcut config:', e); this.config = {}; } },
        saveConfig() { localStorage.setItem(this.storageKey, JSON.stringify(this.config)); },
        updateInput(action) { const keyConfig = this.config[action]; const inputEl = this.elements[action]; if (!inputEl) return; inputEl.value = keyConfig ? this.formatKey(keyConfig) : ''; if (!inputEl.value) inputEl.placeholder = 'Click and press a key'; },
        updateAllInputs() { this.actions.forEach(action => this.updateInput(action)); },
        formatKey(keyEvent) { if (!keyEvent || !keyEvent.key) return ''; const parts = []; if (keyEvent.ctrlKey) parts.push('Ctrl'); if (keyEvent.altKey) parts.push('Alt'); if (keyEvent.shiftKey) parts.push('Shift'); const key = keyEvent.key.trim(); if (key && !['Control', 'Alt', 'Shift', 'Meta'].includes(keyEvent.key)) { parts.push(key.length === 1 ? key.toUpperCase() : key); } return parts.join(' + '); },
        captureShortcut(event, action) {
            event.preventDefault(); event.stopPropagation();
            if (['Control', 'Alt', 'Shift', 'Meta'].includes(event.key)) return;
            const newConfig = { key: event.key, code: event.code, ctrlKey: event.ctrlKey, altKey: event.altKey, shiftKey: event.shiftKey };
            this.config[action] = newConfig;
            this.elements[action].value = this.formatKey(newConfig);
            this.saveConfig();
            this.elements[action].blur();
        },
        handleGlobalKeyDown(event) {
            if (['INPUT', 'TEXTAREA'].includes(event.target.tagName) || event.target.isContentEditable) return;
            for (const action in this.config) {
                const savedKey = this.config[action];
                if (savedKey && savedKey.key === event.key && savedKey.ctrlKey === event.ctrlKey && savedKey.altKey === event.altKey && savedKey.shiftKey === event.shiftKey) { event.preventDefault(); event.stopPropagation(); this.executeAction(action); return; }
            }
        },
        executeAction(action) {
            const video = document.querySelector('video');
            if (!video) return;
            switch (action) {
                case 'setStart':
                    LoopController.loopStart = video.currentTime;
                    if (this.elements.loopStartInput) this.elements.loopStartInput.value = LoopController.formatTime(LoopController.loopStart);
                    break;
                case 'replayStart':
                    if (LoopController.loopStart !== null) video.currentTime = LoopController.loopStart;
                    break;
                case 'setEnd':
                    LoopController.loopEnd = video.currentTime;
                    if (this.elements.loopEndInput) this.elements.loopEndInput.value = LoopController.formatTime(LoopController.loopEnd);
                    break;
                case 'clearLoop':
                    LoopController.loopStart = null;
                    LoopController.loopEnd = null;
                    if (this.elements.loopStartInput) this.elements.loopStartInput.value = LoopController.formatTime(null);
                    if (this.elements.loopEndInput) this.elements.loopEndInput.value = LoopController.formatTime(null);
                    break;
            }
        }
    };

    async function init() {
        if (isInitializing) return;
        isInitializing = true;
        try {
            document.getElementById(PANEL_ID)?.remove();
            cleanUpVideoFeatures();
            const anchorElement = await waitForElement('ytd-masthead #end #buttons #avatar-btn, ytd-masthead #end #buttons ytd-button-renderer');
            const buttonsContainer = anchorElement.closest('#buttons');
            if (!buttonsContainer) { console.error('[YouTube Enhanced Controls] Could not find #buttons container.'); return; }

            const panelElements = createAndSetupControlPanel(buttonsContainer);
            AutoConfirmController.init(panelElements.autoConfirmToggle);
            ShortcutController.init(panelElements);

            const videoContainer = document.querySelector('ytd-watch-flexy');
            const isWatchPage = !!videoContainer;
            panelElements.speedSection.style.display = isWatchPage ? 'block' : 'none';
            panelElements.loopSection.style.display = isWatchPage ? 'block' : 'none';
            document.querySelectorAll('.shortcut-input').forEach(el => { el.closest('.yt-custom-row').style.display = isWatchPage ? 'flex' : 'none'; });

            if (isWatchPage) {
                try {
                    const video = await waitForElement('video', videoContainer);
                    if (video.paused && video.currentTime < 3 && AutoConfirmController.isEnabled && document.hidden) {
                        console.log(`%c[YouTube Enhanced Controls]%c [${getFormattedTimestamp()}] Proactively playing video in background...`, 'font-weight: bold; color: #ff8c00;', 'color: inherit;');
                        video.play().catch(e => console.warn(`%c[YouTube Enhanced Controls]%c Proactive play failed:`, 'font-weight: bold; color: #ff8c00;', e));
                    }
                    SpeedController.init(video, panelElements);
                    LoopController.init(video, panelElements);
                    SpeedController.updatePlaybackRate(video.playbackRate, panelElements);
                } catch (error) {
                    panelElements.speedSection.style.display = 'none';
                    panelElements.loopSection.style.display = 'none';
                }
            }
        } finally { isInitializing = false; }
    }

    document.addEventListener('yt-navigate-finish', init);
    waitForElement('title').then(titleElement => { new MutationObserver(init).observe(titleElement, { childList: true }); });
})();
