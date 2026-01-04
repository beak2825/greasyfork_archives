// ==UserScript==
// @name         Twitch Auto Reload on Error #2000 (God Mode)
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  Reload Twitch stream if Error #2000 appears. Full feature set: GUI, retry counter, audio, notifications, logs, dark mode, draggable panel, and error history tracking.
// @author       SNOOKEEE
// @match        https://www.twitch.tv/*
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541294/Twitch%20Auto%20Reload%20on%20Error%202000%20%28God%20Mode%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541294/Twitch%20Auto%20Reload%20on%20Error%202000%20%28God%20Mode%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SETTINGS_KEY = 'twitchErrorReloadSettings_v5';
    const LOGS_KEY = 'twitchErrorLogs_v5';

    const DEFAULT_SETTINGS = {
        maxRetries: 5,
        startDelayMs: 5000,
        reloadDelayMs: 2000,
        retryCount: 0,
        darkMode: true,
        enableAudio: true,
        enableNotify: true
    };

    let settings = loadSettings();
    let logs = loadLogs();

    function loadSettings() {
        const saved = localStorage.getItem(SETTINGS_KEY);
        return saved ? JSON.parse(saved) : { ...DEFAULT_SETTINGS };
    }

    function saveSettings() {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }

    function loadLogs() {
        const saved = localStorage.getItem(LOGS_KEY);
        return saved ? JSON.parse(saved) : [];
    }

    function saveLogs() {
        localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
    }

    function logEvent(msg) {
        const time = new Date().toLocaleTimeString();
        const entry = `[${time}] ${msg}`;
        logs.push(entry);
        if (logs.length > 50) logs.shift(); // Keep last 50
        saveLogs();
        updateLogPanel();
    }

    function playAlertSound() {
        if (!settings.enableAudio) return;
        const beep = new Audio("https://notificationsounds.com/storage/sounds/file-sounds-1153-pristine.mp3");
        beep.volume = 0.5;
        beep.play();
    }

    function showToast(message, success = true) {
        if (!settings.enableNotify) return;
        const toast = document.createElement('div');
        toast.innerText = message;
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.background = success ? '#28a745' : '#dc3545';
        toast.style.color = 'white';
        toast.style.padding = '10px 16px';
        toast.style.borderRadius = '5px';
        toast.style.zIndex = 9999;
        toast.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    }

    function updateLogPanel() {
        const panel = document.getElementById('log-panel');
        if (panel) {
            panel.innerHTML = '<strong>📜 Error History:</strong><br>' + logs.slice().reverse().map(l => `<div style='margin:2px 0'>${l}</div>`).join('');
        }
    }

    function createUI() {
        // Check if UI already exists to avoid duplicates
        if (document.getElementById('twitch-reload-ui')) return;

        const container = document.createElement('div');
        container.id = 'twitch-reload-ui';
        container.style.position = 'fixed';
        container.style.top = '20px';
        container.style.right = '20px';
        container.style.zIndex = '9999';
        container.style.padding = '10px';
        container.style.borderRadius = '8px';
        container.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
        container.style.fontFamily = 'Arial, sans-serif';
        container.style.width = '280px';
        container.style.maxWidth = '90vw';
        container.style.cursor = 'move';
        applyTheme(container);

        let offsetX = 0, offsetY = 0, isDragging = false;

        container.addEventListener('mousedown', function(e) {
            isDragging = true;
            offsetX = e.clientX - container.getBoundingClientRect().left;
            offsetY = e.clientY - container.getBoundingClientRect().top;
        });
        document.addEventListener('mouseup', () => isDragging = false);
        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                container.style.left = (e.clientX - offsetX) + 'px';
                container.style.top = (e.clientY - offsetY) + 'px';
                container.style.right = 'auto';
            }
        });

        const title = document.createElement('div');
        title.innerText = '⚙️ Twitch Auto Reload';
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '10px';

        const counter = document.createElement('div');
        counter.id = 'retry-counter';
        counter.innerText = `Retries: ${settings.retryCount}/${settings.maxRetries}`;
        counter.style.marginBottom = '10px';

        function createSetting(labelText, type, settingKey, extra = {}) {
            const wrapper = document.createElement('div');
            wrapper.style.margin = '5px 0';

            const label = document.createElement('label');
            label.innerText = labelText;
            label.style.display = 'block';
            label.style.marginBottom = '2px';

            let input;
            if (type === 'checkbox') {
                input = document.createElement('input');
                input.type = 'checkbox';
                input.checked = settings[settingKey];
                input.onchange = () => {
                    settings[settingKey] = input.checked;
                    saveSettings();
                    if (settingKey === 'darkMode') applyTheme(container);
                };
            } else {
                input = document.createElement('input');
                input.type = 'number';
                input.value = settings[settingKey];
                input.min = extra.min || 0;
                input.style.width = '100%';
                input.onchange = () => {
                    settings[settingKey] = parseInt(input.value);
                    saveSettings();
                    updateRetryDisplay();
                };
            }

            wrapper.appendChild(label);
            wrapper.appendChild(input);
            return wrapper;
        }

        const retryBtn = document.createElement('button');
        retryBtn.innerText = '🔁 Retry Now';
        retryBtn.onclick = () => {
            showToast('Manual Reload', true);
            logEvent('Manual reload triggered.');
            location.reload();
        };

        const logPanel = document.createElement('div');
        logPanel.id = 'log-panel';
        logPanel.style.marginTop = '10px';
        logPanel.style.maxHeight = '120px';
        logPanel.style.overflowY = 'auto';
        logPanel.style.fontSize = '12px';

        container.appendChild(title);
        container.appendChild(counter);
        container.appendChild(createSetting('Max Retries', 'number', 'maxRetries'));
        container.appendChild(createSetting('Start Delay (ms)', 'number', 'startDelayMs'));
        container.appendChild(createSetting('Reload Delay (ms)', 'number', 'reloadDelayMs'));
        container.appendChild(createSetting('Enable Audio', 'checkbox', 'enableAudio'));
        container.appendChild(createSetting('Enable Notify', 'checkbox', 'enableNotify'));
        container.appendChild(createSetting('Dark Mode', 'checkbox', 'darkMode'));
        container.appendChild(retryBtn);
        container.appendChild(logPanel);
        document.body.appendChild(container);
        updateLogPanel();
    }

    function applyTheme(container) {
        const isDark = settings.darkMode;
        container.style.backgroundColor = isDark ? '#1f1f23' : '#f4f4f4';
        container.style.color = isDark ? '#f4f4f4' : '#1f1f23';

        const inputs = container.querySelectorAll('input');
        inputs.forEach(input => {
            input.style.backgroundColor = isDark ? '#333' : '#fff';
            input.style.color = isDark ? '#f4f4f4' : '#1f1f23';
        });
        const buttons = container.querySelectorAll('button');
        buttons.forEach(btn => {
            btn.style.width = '100%';
            btn.style.padding = '8px';
            btn.style.marginTop = '10px';
            btn.style.backgroundColor = isDark ? '#9147ff' : '#e6e6e6';
            btn.style.color = isDark ? 'white' : 'black';
            btn.style.border = 'none';
            btn.style.borderRadius = '5px';
            btn.style.cursor = 'pointer';
        });
    }

    function updateRetryDisplay() {
        const counter = document.getElementById('retry-counter');
        if (counter) counter.innerText = `Retries: ${settings.retryCount}/${settings.maxRetries}`;
    }

    function observeError() {
        const observer = new MutationObserver(() => {
            const text = document.body.innerText;
            if (text.includes('There was a network error. Please try again. (Error #2000)')) {
                if (settings.retryCount < settings.maxRetries) {
                    settings.retryCount++;
                    saveSettings();
                    updateRetryDisplay();
                    playAlertSound();
                    showToast('Reloading Twitch due to Error #2000...', true);
                    logEvent('Auto reload due to Error #2000');
                    setTimeout(() => location.reload(), settings.reloadDelayMs);
                } else {
                    showToast('Retry limit reached. Not reloading.', false);
                    logEvent('Retry limit reached. No reload.');
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    // Tampermonkey menu command to show the UI
    GM_registerMenuCommand("Show Twitch Reload Panel", () => {
        const existing = document.getElementById('twitch-reload-ui');
        if (existing) {
            existing.style.display = 'block';
        } else {
            createUI();
        }
    });

    // Toggle UI with F2 key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F2') {
            const panel = document.getElementById('twitch-reload-ui');
            if (panel) {
                panel.style.display = (panel.style.display === 'none') ? 'block' : 'none';
            } else {
                createUI();
            }
        }
    });

    // Initialize observer on page load without creating UI
    window.addEventListener('load', () => {
        setTimeout(() => {
            observeError();
            logEvent('Observer initialized.');
        }, settings.startDelayMs);
    });
})();