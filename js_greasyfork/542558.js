// ==UserScript==
// @name          osu! BackgroundGrabber
// @namespace     http://tampermonkey.net/
// @version       1.4
// @description   Seamlessly adds a stylish background download button to osu! beatmap pages - grab those beautiful covers with one click!
// @author        Noxie
// @match         https://osu.ppy.sh/*
// @icon          https://raw.githubusercontent.com/Noxie0/osu-background-grabber/refs/heads/main/icon.png
// @license       MIT
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/542558/osu%21%20BackgroundGrabber.user.js
// @updateURL https://update.greasyfork.org/scripts/542558/osu%21%20BackgroundGrabber.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Settings management
    const SETTINGS_KEY = 'osu_backgroundgrabber_settings';
    const DEFAULT_COLOR = '#3986ac';
    const defaultSettings = {
        buttonEnabled: true,
        textEnabled: true,
        iconEnabled: true,
        accentColor: '#ff6bb3',
        useCustomColor: true
    };

    function getSettings() {
        try {
            const saved = localStorage.getItem(SETTINGS_KEY);
            return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
        } catch (e) {
            console.warn('[BackgroundGrabber] Failed to load settings, using defaults:', e);
            return defaultSettings;
        }
    }

    function saveSettings(settings) {
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        } catch (e) {
            console.warn('[BackgroundGrabber] Failed to save settings:', e);
        }
    }

    let currentSettings = getSettings();

    function hexToRgba(hex, alpha = 1) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    function getEffectiveColor() {
        return currentSettings.useCustomColor ? currentSettings.accentColor : DEFAULT_COLOR;
    }

    function updateColorVariables() {
        const root = document.documentElement;
        const effectiveColor = getEffectiveColor();
        root.style.setProperty('--bg-grabber-accent', effectiveColor);
        root.style.setProperty('--bg-grabber-accent-90', hexToRgba(effectiveColor, 0.9));
        root.style.setProperty('--bg-grabber-accent-100', hexToRgba(effectiveColor, 1));
        const colorPreview = document.getElementById('bg-color-preview');
        if (colorPreview) {
            colorPreview.style.background = effectiveColor;
        }
    }

    const style = document.createElement('style');
    style.textContent = `
        :root {
            --bg-grabber-accent: ${getEffectiveColor()};
            --bg-grabber-accent-90: ${hexToRgba(getEffectiveColor(), 0.9)};
            --bg-grabber-accent-100: ${hexToRgba(getEffectiveColor(), 1)};
        }

        .background-btn {
            min-width: 120px !important;
            white-space: nowrap !important;
            padding: 0 20px !important;
            height: auto !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            transition: all 0.2s ease !important;
            background-color: var(--bg-grabber-accent) !important;
            border-color: var(--bg-grabber-accent) !important;
        }
        .background-btn:hover {
            background-color: var(--bg-grabber-accent-100) !important;
            border-color: var(--bg-grabber-accent-100) !important;
        }
        .background-btn .fa-image {
            font-size: 16px !important;
            margin-right: 8px !important;
            line-height: 1 !important;
        }
        .background-btn.icon-only .fa-image {
            font-size: 20px !important;
            margin-right: 0 !important;
        }
        .background-btn span {
            font-size: 14px !important;
            font-weight: 600 !important;
            line-height: 1 !important;
        }

        .bg-grabber-settings {
            position: fixed;
            top: 70px;
            right: 20px;
            background: #2a2a2a;
            color: white;
            padding: 20px;
            border-radius: 10px;
            border: 2px solid var(--bg-grabber-accent);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
            z-index: 10000;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 14px;
            min-width: 300px;

            opacity: 0;
            visibility: hidden;
            transform: translateY(10px);
            transition: opacity 0.3s ease-out, visibility 0.3s ease-out, transform 0.3s ease-out;
            pointer-events: none;
        }

        .bg-grabber-settings.show {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
            pointer-events: auto;
        }

        .bg-grabber-settings h3 {
            margin: 0 0 20px 0;
            font-size: 18px;
            color: var(--bg-grabber-accent);
            border-bottom: 2px solid var(--bg-grabber-accent);
            padding-bottom: 8px;
            text-align: center;
        }

        .bg-grabber-setting-item {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            padding: 8px 0;
            border-bottom: 1px solid #444;
        }

        .bg-grabber-setting-item:last-of-type {
            border-bottom: none;
            margin-bottom: 0;
        }

        .bg-grabber-setting-item label {
            flex: 1;
            cursor: pointer;
            font-weight: 500;
        }

        .bg-grabber-setting-item input[type="checkbox"] {
            width: 18px;
            height: 18px;
            cursor: pointer;
            margin-right: 12px;
            accent-color: var(--bg-grabber-accent);
        }

        .bg-grabber-setting-item input[type="checkbox"]:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .bg-grabber-setting-item label.disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .bg-grabber-color-section {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-bottom: 10px;
        }

        .bg-grabber-color-controls {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .bg-grabber-color-picker {
            width: 40px;
            height: 30px;
            border: 2px solid var(--bg-grabber-accent);
            border-radius: 6px;
            cursor: pointer;
            background: var(--bg-grabber-accent);
            transition: all 0.2s ease;
        }

        .bg-grabber-color-picker:hover {
            transform: scale(1.05);
        }

        .bg-grabber-color-picker:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }

        .bg-grabber-hex-input {
            flex: 1;
            background: #1a1a1a;
            border: 1px solid #555;
            border-radius: 4px;
            padding: 6px 10px;
            color: white;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            transition: border-color 0.2s ease;
        }

        .bg-grabber-hex-input:focus {
            outline: none;
            border-color: var(--bg-grabber-accent);
        }

        .bg-grabber-hex-input:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .bg-grabber-hex-input.invalid {
            border-color: #ff4444;
        }

        .bg-grabber-color-preview {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 2px solid #555;
            background: var(--bg-grabber-accent);
            transition: all 0.2s ease;
        }

        .bg-grabber-reset-btn {
            background: #666;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 6px 12px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            transition: all 0.2s ease;
            white-space: nowrap;
        }

        .bg-grabber-reset-btn:hover {
            background: #777;
        }

        .bg-grabber-reset-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            background: #666;
        }

        .bg-grabber-settings-footer {
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #444;
            display: flex;
            justify-content: space-around;
            gap: 10px;
        }

        .bg-grabber-settings-footer button,
        .bg-grabber-settings-footer a {
            flex: 1;
            padding: 8px 12px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 600;
            text-align: center;
            text-decoration: none;
            transition: background-color 0.2s ease, transform 0.1s ease;
            color: white;
        }

        .bg-grabber-settings-footer .github-btn {
            background-color: #333;
        }

        .bg-grabber-settings-footer .github-btn:hover {
            background-color: #555;
            transform: translateY(-1px);
        }

        .bg-grabber-settings-footer .bug-report-btn {
            background-color: #d9534f;
        }

        .bg-grabber-settings-footer .bug-report-btn:hover {
            background-color: #c9302c;
            transform: translateY(-1px);
        }

        .bg-grabber-settings-icon {
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--bg-grabber-accent-90);
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            cursor: pointer;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            transition: all 0.2s ease;
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
        }

        .bg-grabber-settings-icon.visible {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
        }

        .bg-grabber-settings-icon:hover {
            background: var(--bg-grabber-accent-100);
            transform: scale(1.1);
        }
    `;
    document.head.appendChild(style);

    updateColorVariables();

    function isValidHex(hex) {
        return /^#[0-9A-F]{6}$/i.test(hex);
    }

    function createSettingsPanel() {
        const panel = document.createElement('div');
        panel.className = 'bg-grabber-settings';
        panel.innerHTML = `
            <h3>Background Grabber Settings</h3>
            <div class="bg-grabber-setting-item">
                <input type="checkbox" id="bg-button-toggle" ${currentSettings.buttonEnabled ? 'checked' : ''}>
                <label for="bg-button-toggle">Enable Button</label>
            </div>
            <div class="bg-grabber-setting-item">
                <input type="checkbox" id="bg-text-toggle" ${currentSettings.textEnabled ? 'checked' : ''}>
                <label for="bg-text-toggle">Show Text</label>
            </div>
            <div class="bg-grabber-setting-item">
                <input type="checkbox" id="bg-icon-toggle" ${currentSettings.iconEnabled ? 'checked' : ''}>
                <label for="bg-icon-toggle">Show Icon</label>
            </div>
            <div class="bg-grabber-setting-item">
                <input type="checkbox" id="bg-custom-color-toggle" ${currentSettings.useCustomColor ? 'checked' : ''}>
                <label for="bg-custom-color-toggle">Use Custom Color</label>
            </div>
            <div class="bg-grabber-setting-item">
                <label>Accent Color</label>
            </div>
            <div class="bg-grabber-color-section">
                <div class="bg-grabber-color-controls">
                    <input type="color" class="bg-grabber-color-picker" value="${currentSettings.accentColor}" id="bg-color-picker" ${!currentSettings.useCustomColor ? 'disabled' : ''}>
                    <input type="text" class="bg-grabber-hex-input" value="${currentSettings.accentColor}" id="bg-hex-input" placeholder="#ff6bb3" ${!currentSettings.useCustomColor ? 'disabled' : ''}>
                    <button class="bg-grabber-reset-btn" id="bg-reset-btn" ${!currentSettings.useCustomColor ? 'disabled' : ''}>Reset</button>
                    <div class="bg-grabber-color-preview" id="bg-color-preview" style="background: ${getEffectiveColor()};"></div>
                </div>
            </div>
            <div class="bg-grabber-settings-footer">
                <a href="https://github.com/Noxie0/osu-BackgroundGrabber" target="_blank" rel="noopener noreferrer" class="github-btn">
                    GitHub
                </a>
                <a href="https://github.com/Noxie0/osu-BackgroundGrabber/issues" target="_blank" rel="noopener noreferrer" class="bug-report-btn">
                    Report a Bug
                </a>
            </div>
        `;

        const buttonToggle = panel.querySelector('#bg-button-toggle');
        const textToggle = panel.querySelector('#bg-text-toggle');
        const iconToggle = panel.querySelector('#bg-icon-toggle');
        const customColorToggle = panel.querySelector('#bg-custom-color-toggle');
        const colorPicker = panel.querySelector('#bg-color-picker');
        const hexInput = panel.querySelector('#bg-hex-input');
        const colorPreview = panel.querySelector('#bg-color-preview');
        const resetBtn = panel.querySelector('#bg-reset-btn');

        resetBtn.addEventListener('click', () => {
            if (!currentSettings.useCustomColor) return;
            currentSettings.accentColor = DEFAULT_COLOR;
            colorPicker.value = DEFAULT_COLOR;
            hexInput.value = DEFAULT_COLOR;
            hexInput.classList.remove('invalid');
            updateColorVariables();
            saveSettings(currentSettings);
            updateButtonContent();
        });

        customColorToggle.addEventListener('change', (e) => {
            currentSettings.useCustomColor = e.target.checked;
            colorPicker.disabled = !currentSettings.useCustomColor;
            hexInput.disabled = !currentSettings.useCustomColor;
            resetBtn.disabled = !currentSettings.useCustomColor;
            updateColorVariables();
            saveSettings(currentSettings);
            updateButtonContent();
        });

        colorPicker.addEventListener('input', (e) => {
            if (!currentSettings.useCustomColor) return;
            const newColor = e.target.value;
            currentSettings.accentColor = newColor;
            hexInput.value = newColor;
            hexInput.classList.remove('invalid');
            updateColorVariables();
            saveSettings(currentSettings);
            updateButtonContent();
        });

        hexInput.addEventListener('input', (e) => {
            if (!currentSettings.useCustomColor) return;
            const newColor = e.target.value;
            if (isValidHex(newColor)) {
                currentSettings.accentColor = newColor;
                colorPicker.value = newColor;
                hexInput.classList.remove('invalid');
                updateColorVariables();
                saveSettings(currentSettings);
                updateButtonContent();
            } else {
                hexInput.classList.add('invalid');
            }
        });

        buttonToggle.addEventListener('change', (e) => {
            currentSettings.buttonEnabled = e.target.checked;
            if (currentSettings.buttonEnabled && !currentSettings.textEnabled && !currentSettings.iconEnabled) {
                currentSettings.textEnabled = true;
                textToggle.checked = true;
            }
            saveSettings(currentSettings);
            updateButtonVisibility();
            updateSettingsState();
            tryInjectButton(); // Always try to re-inject/update button
        });

        textToggle.addEventListener('change', (e) => {
            currentSettings.textEnabled = e.target.checked;
            if (!currentSettings.textEnabled && !currentSettings.iconEnabled) {
                currentSettings.buttonEnabled = false;
                buttonToggle.checked = false;
                updateSettingsState();
            }
            saveSettings(currentSettings);
            updateButtonContent();
            updateButtonVisibility();
            tryInjectButton(); // Always try to re-inject/update button
        });

        iconToggle.addEventListener('change', (e) => {
            currentSettings.iconEnabled = e.target.checked;
            if (!currentSettings.iconEnabled && !currentSettings.textEnabled) {
                currentSettings.buttonEnabled = false;
                buttonToggle.checked = false;
                updateSettingsState();
            }
            saveSettings(currentSettings);
            updateButtonContent();
            updateButtonVisibility();
            tryInjectButton(); // Always try to re-inject/update button
        });

        updateSettingsState();
        return panel;
    }

    function createSettingsIcon() {
        const icon = document.createElement('button');
        icon.className = 'bg-grabber-settings-icon';
        icon.innerHTML = '⚙️';
        icon.title = 'Background Grabber Settings';
        icon.addEventListener('click', (event) => {
            event.stopPropagation();
            const panel = document.querySelector('.bg-grabber-settings');
            if (panel) {
                panel.classList.toggle('show');
            }
        });
        return icon;
    }

    function updateButtonVisibility() {
        const button = document.querySelector('.background-btn');
        if (button) {
            if (currentSettings.buttonEnabled && (currentSettings.textEnabled || currentSettings.iconEnabled)) {
                button.style.display = 'inline-flex';
                button.style.visibility = 'visible';
            } else {
                button.style.display = 'none';
                button.style.visibility = 'hidden';
            }
        }
    }

    function updateSettingsIconVisibility() {
        const icon = document.querySelector('.bg-grabber-settings-icon');
        if (icon) {
            const isOnBeatmapPage = window.location.pathname.includes('/beatmapsets/');
            if (isOnBeatmapPage) {
                icon.classList.add('visible');
                ensureSettingsPanel();
            } else {
                icon.classList.remove('visible');
                const panel = document.querySelector('.bg-grabber-settings');
                if (panel) {
                    panel.classList.remove('show');
                }
            }
        }
    }

    function updateSettingsState() {
        const textToggle = document.querySelector('#bg-text-toggle');
        const iconToggle = document.querySelector('#bg-icon-toggle');
        const textLabel = document.querySelector('label[for="bg-text-toggle"]');
        const iconLabel = document.querySelector('label[for="bg-icon-toggle"]');
        const buttonToggle = document.querySelector('#bg-button-toggle');

        if (textToggle && iconToggle && textLabel && iconLabel && buttonToggle) {
            const isDisabled = !currentSettings.buttonEnabled;
            textToggle.disabled = isDisabled;
            iconToggle.disabled = isDisabled;

            if (isDisabled) {
                textLabel.classList.add('disabled');
                iconLabel.classList.add('disabled');
            } else {
                textLabel.classList.remove('disabled');
                iconLabel.classList.remove('disabled');
                if (!textToggle.checked && !iconToggle.checked) {
                    currentSettings.textEnabled = true;
                    textToggle.checked = true;
                    saveSettings(currentSettings);
                    updateButtonContent();
                }
            }
        }

        const customColorToggle = document.querySelector('#bg-custom-color-toggle');
        const colorPicker = document.querySelector('#bg-color-picker');
        const hexInput = document.querySelector('#bg-hex-input');
        const resetBtn = document.querySelector('#bg-reset-btn');

        if (customColorToggle && colorPicker && hexInput && resetBtn) {
            const colorControlsDisabled = !currentSettings.useCustomColor;
            colorPicker.disabled = colorControlsDisabled;
            hexInput.disabled = colorControlsDisabled;
            resetBtn.disabled = colorControlsDisabled;
        }
    }

    function updateButtonContent() {
        const button = document.querySelector('.background-btn');
        if (!button) return;

        const iconHtml = currentSettings.iconEnabled ? '<i class="fas fa-image"></i>' : '';
        const textHtml = currentSettings.textEnabled ? '<span>Background</span>' : '';
        button.innerHTML = iconHtml + textHtml;

        if (!currentSettings.iconEnabled && !currentSettings.textEnabled) {
            button.style.display = 'none';
            button.style.visibility = 'hidden';
            button.classList.remove('icon-only');
        } else if (currentSettings.iconEnabled && !currentSettings.textEnabled) {
            button.style.setProperty('padding', '0', 'important');
            button.style.setProperty('min-width', '45px', 'important');
            button.style.setProperty('width', '45px', 'important');
            button.style.setProperty('height', '45px', 'important');
            button.classList.add('icon-only');
        } else if (!currentSettings.iconEnabled && currentSettings.textEnabled) {
            button.style.setProperty('padding', '0 16px', 'important');
            button.style.setProperty('min-width', '80px', 'important');
            button.style.setProperty('width', 'auto', 'important');
            button.style.setProperty('height', 'auto', 'important');
            button.classList.remove('icon-only');
        } else {
            button.style.setProperty('padding', '0 20px', 'important');
            button.style.setProperty('min-width', '120px', 'important');
            button.style.setProperty('width', 'auto', 'important');
            button.style.setProperty('height', 'auto', 'important');
            button.classList.remove('icon-only');
        }
        updateButtonVisibility();
    }

    function createButton(beatmapSetId, container) {
        const rawUrl = `https://assets.ppy.sh/beatmaps/${beatmapSetId}/covers/raw.jpg`;
        const fallbackUrl = `https://assets.ppy.sh/beatmaps/${beatmapSetId}/covers/cover.jpg`;

        const existingButtonReference = container.querySelector('a[class*="btn"], button[class*="btn"]');
        const bgBtn = document.createElement('a');

        bgBtn.className = existingButtonReference ? existingButtonReference.className : 'btn-osu-big btn-osu-big--beatmapset-header';
        bgBtn.classList.add('background-btn');
        bgBtn.href = '#';
        bgBtn.target = '_blank';
        bgBtn.rel = 'noopener noreferrer';

        bgBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const testImg = new Image();
            testImg.onload = () => window.open(rawUrl, '_blank');
            testImg.onerror = () => window.open(fallbackUrl, '_blank');
            testImg.src = rawUrl;
        });

        container.appendChild(bgBtn);
        updateButtonContent();
        updateButtonVisibility();
    }

    // --- NEW: MutationObserver for the button container ---
    let buttonContainerObserver = null;
    let lastBeatmapSetId = null; // To track if we are on the same beatmapset page

    function tryInjectButton() {
        const match = window.location.pathname.match(/\/beatmapsets\/(\d+)/);
        const container = document.querySelector('.beatmapset-header__buttons');
        const existingButton = document.querySelector('.background-btn');

        if (!match) { // Not on a beatmap page
            if (existingButton) existingButton.remove();
            if (buttonContainerObserver) {
                buttonContainerObserver.disconnect();
                buttonContainerObserver = null;
            }
            lastBeatmapSetId = null;
            return;
        }

        const currentBeatmapSetId = match[1];

        // If we are on a new beatmapset page, or button is missing, re-create
        if (currentBeatmapSetId !== lastBeatmapSetId || !existingButton || !container || !container.contains(existingButton)) {
            if (existingButton) existingButton.remove(); // Clean up old button
            if (container) {
                createButton(currentBeatmapSetId, container);
                lastBeatmapSetId = currentBeatmapSetId; // Update last known ID

                // Set up observer if not already active for this container
                if (!buttonContainerObserver) {
                    buttonContainerObserver = new MutationObserver((mutationsList) => {
                        for (const mutation of mutationsList) {
                            if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
                                // Check if our button was removed
                                const ourButtonRemoved = Array.from(mutation.removedNodes).some(node => node.classList && node.classList.contains('background-btn'));
                                if (ourButtonRemoved) {
                                    // Button was removed, re-inject immediately
                                    // Use a small timeout to allow React to finish its immediate DOM operations
                                    setTimeout(() => tryInjectButton(), 50);
                                    break; // Only need to react once
                                }
                            }
                        }
                    });
                    buttonContainerObserver.observe(container, { childList: true });
                }
            }
        } else if (existingButton) {
            // Button exists and is in place, just update its content/visibility
            updateButtonContent();
            updateButtonVisibility();
        }
    }

    function ensureSettingsPanel() {
        let existingPanel = document.querySelector('.bg-grabber-settings');
        if (!existingPanel) {
            const settingsPanel = createSettingsPanel();
            document.body.appendChild(settingsPanel);
            updateSettingsState();
        } else {
            updateSettingsState();
        }
    }

    // --- NEW: MutationObserver for the settings icon ---
    let settingsIconObserver = null;

    function tryInjectSettingsIcon() {
        currentSettings = getSettings();
        updateColorVariables();

        let existingIcon = document.querySelector('.bg-grabber-settings-icon');

        if (!window.location.pathname.includes('/beatmapsets/')) { // Not on beatmap page
            if (existingIcon) existingIcon.remove();
            if (settingsIconObserver) {
                settingsIconObserver.disconnect();
                settingsIconObserver = null;
            }
            return;
        }

        if (!existingIcon) {
            const settingsIcon = createSettingsIcon();
            document.body.appendChild(settingsIcon);
            existingIcon = settingsIcon;

            // Set up observer for the icon if not already active
            if (!settingsIconObserver) {
                settingsIconObserver = new MutationObserver((mutationsList) => {
                    for (const mutation of mutationsList) {
                        if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
                            const ourIconRemoved = Array.from(mutation.removedNodes).some(node => node.classList && node.classList.contains('bg-grabber-settings-icon'));
                            if (ourIconRemoved) {
                                setTimeout(() => tryInjectSettingsIcon(), 50);
                                break;
                            }
                        }
                    }
                });
                // Observe the body, as the icon is directly appended to it
                settingsIconObserver.observe(document.body, { childList: true });
            }
        }
        updateSettingsIconVisibility();
    }

    function waitForContainer(callback, attempts = 0) {
        if (attempts >= 50) return;
        const container = document.querySelector('.beatmapset-header__buttons');
        if (container) {
            callback();
        } else {
            setTimeout(() => waitForContainer(callback, attempts + 1), 100); // Shorter interval
        }
    }

    function waitForBody(callback, attempts = 0) {
        if (attempts >= 50) return;
        if (document.body) {
            callback();
        } else {
            setTimeout(() => waitForBody(callback, attempts + 1), 100); // Shorter interval
        }
    }

    function setupObservers() {
        let lastPath = location.pathname;

        const reactRouteObserver = new MutationObserver(() => {
            if (location.pathname !== lastPath) {
                lastPath = location.pathname;
                // Still use a generous delay for full route changes
                setTimeout(() => {
                    tryInjectButton();
                    tryInjectSettingsIcon();
                }, 600); // Slightly reduced from 800ms
            }
        });

        waitForBody(() => {
            reactRouteObserver.observe(document.body, { childList: true, subtree: true });
        });

        // General DOM content observer - now less critical due to specific observers
        const domContentObserver = new MutationObserver((mutations) => {
            let shouldCheck = false;
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    if (mutation.target.matches('.beatmapset-header__buttons') ||
                        mutation.target.closest('.beatmapset-header__buttons') ||
                        mutation.target.id === 'app' ||
                        mutation.target.tagName === 'MAIN' ||
                        mutation.target.matches('body')) {
                        shouldCheck = true;
                        break;
                    }
                }
            }

            if (shouldCheck) {
                setTimeout(() => {
                    tryInjectButton();
                    tryInjectSettingsIcon();
                }, 100); // Shorter delay
            }
        });

        waitForBody(() => {
            const reactAppRoot = document.getElementById('app') || document.getElementById('root') || document.body;
            domContentObserver.observe(reactAppRoot, { childList: true, subtree: true });
        });

        window.addEventListener('popstate', () => {
            setTimeout(() => {
                tryInjectButton();
                tryInjectSettingsIcon();
            }, 600);
        });

        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function(...args) {
            originalPushState.apply(history, args);
            setTimeout(() => {
                tryInjectButton();
                tryInjectSettingsIcon();
            }, 600);
        };

        history.replaceState = function(...args) {
            originalReplaceState.apply(history, args);
            setTimeout(() => {
                tryInjectButton();
                tryInjectSettingsIcon();
            }, 600);
        };
    }

    // Initial setup when the script loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setupObservers();
            setTimeout(() => {
                tryInjectButton();
                tryInjectSettingsIcon();
                ensureSettingsPanel();
            }, 50); // Very short initial delay
        });
    } else {
        setupObservers();
        setTimeout(() => {
            tryInjectButton();
            tryInjectSettingsIcon();
            ensureSettingsPanel();
        }, 50); // Very short initial delay
    }

    waitForBody(ensureSettingsPanel);

})();