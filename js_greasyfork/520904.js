// ==UserScript==
// @name         Medium Member Bypass
// @license      GPL-3.0-or-later
// @namespace    http://tampermonkey.net/
// @version      14.2.20
// @author       UniverseDev
// @description  Modern Medium GUI with multiple bypass services.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=medium.com
// @match        *://*/*
// @match        *://medium.com/*
// @match        *://*.medium.com/*
// @match        https://freedium.cfd/*
// @match        https://readmedium.com/*
// @match        https://medium.rest/*
// @match        https://archive.is/*
// @match        https://archive.li/*
// @match        https://archive.vn/*
// @match        https://archive.ph/*
// @match        https://archive.fo/*
// @match        https://archive.md/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/520904/Medium%20Member%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/520904/Medium%20Member%20Bypass.meta.js
// ==/UserScript==

(() => {
    'use strict';

    if (window.mediumBypassInitialized) {
        return;
    }
    window.mediumBypassInitialized = true;

    let isMedium = false;
    let isArticle = false;
    let isRedirecting = false;
    let autoRedirectCancelled = false;
    let autoRedirectTimeout;
    let isSettingsVisible = false;

    const CLASS_SETTINGS = 'medium-settings';
    const CLASS_NOTIFICATION = 'medium-notification';
    const SELECTOR_FREEDIUM_CLOSE_BUTTON = '.close-button';
    const SELECTOR_SEARCH_BAR = '[data-testid="headerSearchInput"]';

    const getSetting = (key, def) => GM_getValue(key, def);
    const setSetting = (key, val) => GM_setValue(key, val);

    const config = {
        bypassUrls: {
            'Freedium': 'https://freedium.cfd',
            'ReadMedium': 'https://readmedium.com',
            'Archive.is': 'https://archive.is/newest/',
            'Archive.li': 'https://archive.li/newest/',
            'Archive.vn': 'https://archive.vn/newest/',
            'Archive.ph': 'https://archive.ph/newest/',
            'Archive.fo': 'https://archive.fo/newest/',
            'Archive.md': 'https://archive.md/newest/'
        },
        currentBypassService: getSetting('currentBypassService', 'Freedium'),
        autoRedirectDelay: getSetting('redirectDelay', 5000),
        autoRedirectEnabled: getSetting('autoRedirect', true),
        darkModeEnabled: getSetting('darkModeEnabled', false)
    };

    const bypassServiceKeys = Object.keys(config.bypassUrls);
    if (!bypassServiceKeys.includes(config.currentBypassService)) {
        config.currentBypassService = bypassServiceKeys[0];
        setSetting('currentBypassService', config.currentBypassService);
    }
    const archiveServices = ['Archive.is', 'Archive.li', 'Archive.vn', 'Archive.ph', 'Archive.fo', 'Archive.md'];

    const updateMediumAndArticleStatus = () => {
        isMedium = !!document.querySelector('meta[property="og:site_name"][content="Medium"]');
        isArticle = !!document.querySelector('meta[property="article:author"]');
        if (isMedium && isArticle) {
            checkForArticle();
        }
    };

    const checkForArticle = () => {
        if (!isMedium) {
            return;
        }

        const waitForSettingsIcon = (callback) => {
            const settingsIcon = document.querySelector('.settings-icon-button');
            if (settingsIcon) {
                callback();
            } else {
                const observer = new MutationObserver((mutations, obs) => {
                    const settingsIcon = document.querySelector('.settings-icon-button');
                    if (settingsIcon) {
                        obs.disconnect();
                        callback();
                    }
                });
                observer.observe(document.body, { childList: true, subtree: true });
            }
        };

        waitForSettingsIcon(() => {
            const $article = document.querySelector('article');
            if ($article && !isRedirecting && config.autoRedirectEnabled) {
                performAutoRedirect();
            }
        });
    };

    const injectStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            .${CLASS_SETTINGS} {
                --background-color: #FFFFFF;
                --text-color: #000000;
                --button-bg-color: #FFFFFF;
                --button-text-color: #000000;
                --button-border-color: #E5E5E5;
                --button-shadow: 0 1px 3px rgba(0,0,0,0.1);
                --button-bg-hover: var(--accent-color);
                --button-text-hover: #FFFFFF;
                --accent-color: #000000;
                --label-color: #333333;
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 360px;
                background-color: var(--background-color);
                box-shadow: 0 6px 16px rgba(0,0,0,0.2);
                border-radius: 12px;
                font-family: Arial, sans-serif;
                z-index: 10000;
                padding: 20px;
                display: none;
                color: var(--text-color);
                cursor: grab;
                user-select: none;
            }
            .${CLASS_SETTINGS}.dark {
                --background-color: #333333;
                --text-color: #FFFFFF;
                --button-bg-color: #444444;
                --button-text-color: #FFFFFF;
                --button-border-color: #555555;
                --button-shadow: 0 1px 3px rgba(0,0,0,0.2);
                --button-bg-hover: #555555;
                --button-text-hover: #FFFFFF;
                --accent-color: #FFFFFF;
                --label-color: #FFFFFF;
            }
            .${CLASS_SETTINGS}.dark, .${CLASS_SETTINGS}.dark .medium-settings-header,
            .${CLASS_SETTINGS}.dark .medium-settings-toggle > span,
            .${CLASS_SETTINGS}.dark .medium-settings-input,
            .${CLASS_SETTINGS}.dark .medium-settings-button {
                color: var(--text-color);
            }
            .medium-settings-header {
                font-size: 22px;
                font-weight: bold;
                margin-bottom: 20px;
                text-align: center;
            }
            .medium-settings-toggle {
                margin: 15px 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .medium-settings-toggle > span {
                flex-grow: 1;
                font-size: 16px;
                font-weight: 500;
            }
            .medium-settings-input {
                margin-left: 10px;
                padding: 8px 10px;
                border: 1px solid #E5E5E5;
                border-radius: 20px;
                box-sizing: border-box;
                background-color: #FFFFFF;
            }
            .${CLASS_SETTINGS}.dark .medium-settings-input {
                background-color: #444444;
                border-color: #666666;
            }
            .medium-settings-input#redirectDelay {
                width: 50px;
            }
            input[type="number"]::-webkit-inner-spin-button,
            input[type="number"]::-webkit-outer-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }
            input[type="number"] {
                -moz-appearance: textfield;
            }
            .custom-dropdown {
                position: relative;
                display: inline-block;
            }
            .dropdown-trigger {
                padding: 8px 10px;
                border: 1px solid #E5E5E5;
                border-radius: 20px;
                background-color: #FFFFFF;
                cursor: pointer;
                min-width: 120px;
                text-align: center;
            }
            .${CLASS_SETTINGS}.dark .dropdown-trigger {
                background-color: #444444;
                border-color: #666666;
            }
            .dropdown-menu {
                position: absolute;
                top: 100%;
                left: 0;
                background-color: #FFFFFF;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                z-index: 10001;
                min-width: 120px;
                opacity: 0;
                transform: translateY(-10px);
                transition: opacity 0.2s ease, transform 0.2s ease;
                pointer-events: none;
            }
            .dropdown-menu.show {
                opacity: 1;
                transform: translateY(0);
                pointer-events: auto;
            }
            .${CLASS_SETTINGS}.dark .dropdown-menu {
                background-color: #444444;
            }
            .dropdown-item {
                padding: 8px 10px;
                cursor: pointer;
                text-align: center;
            }
            .dropdown-item:hover {
                background-color: #F7F7F7;
            }
            .${CLASS_SETTINGS}.dark .dropdown-item:hover {
                background-color: #555555;
            }
            .submenu-trigger {
                position: relative;
            }
            .submenu-trigger::after {
                content: '›';
                float: right;
                margin-left: 5px;
            }
            .submenu {
                position: absolute;
                left: 100%;
                top: 50%;
                transform: translateY(-50%);
                background-color: #FFFFFF;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                min-width: 120px;
                opacity: 0;
                transition: opacity 0.2s ease;
                pointer-events: none;
            }
            .${CLASS_SETTINGS}.dark .submenu {
                background-color: #444444;
            }
            .submenu-trigger:hover .submenu {
                opacity: 1;
                pointer-events: auto;
            }
            .medium-settings-button {
                background-color: var(--button-bg-color);
                border: 1px solid var(--button-border-color);
                box-shadow: var(--button-shadow);
                padding: 8px 14px;
                border-radius: 20px;
                cursor: pointer;
                font-weight: bold;
                transition: background-color 0.3s, color 0.3s;
            }
            .medium-settings-button:hover {
                background-color: var(--button-bg-hover);
                color: var(--button-text-hover);
            }
            .${CLASS_NOTIFICATION} {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background-color: #F7F7F7;
                color: #000000;
                padding: 15px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                font-family: Arial, sans-serif;
                z-index: 10000;
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
            }
            .${CLASS_NOTIFICATION}.dark {
                background-color: #333333;
                color: #FFFFFF;
            }
            .${CLASS_NOTIFICATION}.show {
                opacity: 1;
                transform: translateY(0);
            }
            .medium-settings-input:focus {
                outline: none;
                border-color: var(--accent-color);
                box-shadow: 0 0 5px rgba(0,0,0,0.2);
            }
            .switch {
                position: relative;
                display: inline-block;
                width: 40px;
                height: 24px;
            }
            .switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #E5E5E5;
                transition: 0.4s;
                border-radius: 24px;
            }
            .slider:before {
                position: absolute;
                content: "";
                height: 18px;
                width: 18px;
                left: 3px;
                bottom: 3px;
                background-color: #FFFFFF;
                transition: 0.4s;
                border-radius: 50%;
            }
            input:checked + .slider {
                background-color: var(--accent-color);
            }
            input:focus + .slider {
                box-shadow: 0 0 1px var(--accent-color);
            }
            input:checked + .slider:before {
                transform: translateX(16px);
            }
            .${CLASS_SETTINGS}.dark .slider {
                background-color: #666666;
            }
            .${CLASS_SETTINGS}.dark input:checked + .slider {
                background-color: var(--accent-color);
            }
            .${CLASS_SETTINGS}.dark input:checked + .slider:before {
                background-color: #333333;
            }
            .slider.round {
                border-radius: 34px;
            }
            .slider.round:before {
                border-radius: 50%;
            }
            .settings-icon-button {
                background: none;
                border: none;
                cursor: pointer;
                padding: 4px;
                margin-right: 4px;
                margin-left: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .settings-icon {
                width: 45px;
                height: 45px;
                fill: #757575;
                opacity: 0.7;
                display: block;
                transition: fill 0.3s, opacity 0.3s;
            }
            .settings-icon-button:hover .settings-icon {
                fill: #000000;
                opacity: 1;
            }
            .${CLASS_SETTINGS}.dark .settings-icon {
                fill: #AAAAAA;
            }
            .${CLASS_SETTINGS}.dark .settings-icon-button:hover .settings-icon {
                fill: #FFFFFF;
            }
            .notification-cancel-button {
                background: transparent;
                border: none;
                color: var(--accent-color);
                font-weight: bold;
                margin-left: 10px;
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);
    };

    let timeout;
    const debouncedCallback = () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            updateMediumAndArticleStatus();
            checkForArticle();
            insertSettingsButton();
        }, 100);
    };

    const globalObserver = new MutationObserver(debouncedCallback);
    globalObserver.observe(document.body, { childList: true, subtree: true, attributes: true });

    const stealthNotification = (message, options = {}) => {
        const notification = document.createElement('div');
        notification.className = CLASS_NOTIFICATION;
        if (config.darkModeEnabled) notification.classList.add('dark');
        const textSpan = document.createElement('span');
        textSpan.textContent = message;
        notification.appendChild(textSpan);
        if (options.cancelCallback) {
            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'notification-cancel-button';
            cancelBtn.textContent = 'Cancel';
            cancelBtn.addEventListener('click', () => {
                clearTimeout(autoRedirectTimeout);
                isRedirecting = false;
                autoRedirectCancelled = true;
                options.cancelCallback();
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            });
            notification.appendChild(cancelBtn);
        }
        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 50);
        if (!options.persistent) {
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    };

    const getCurrentBypassService = () => config.currentBypassService;

    const autoBypass = async (articleUrl, bypassKey) => {
        const bypassUrlValue = config.bypassUrls[bypassKey];
        try {
            let bypassUrl;
            const mediumURL = new URL(decodeURIComponent(articleUrl));
            if (archiveServices.includes(bypassKey)) {
                bypassUrl = bypassUrlValue + articleUrl;
            } else {
                const bypassBaseURL = new URL(bypassUrlValue);
                bypassUrl = new URL(mediumURL.pathname, bypassBaseURL).href;
            }
            const redirectedKey = 'redirected_' + window.location.pathname;
            sessionStorage.setItem(redirectedKey, 'true');
            window.location.href = bypassUrl;
            isRedirecting = true;
        } catch (error) {
            console.error(`Error during bypass with ${bypassKey}:`, error);
            stealthNotification(`Bypass failed with ${bypassKey}.`);
        }
    };

    const performAutoRedirect = async () => {
        const redirectedKey = 'redirected_' + window.location.pathname;
        if (sessionStorage.getItem(redirectedKey)) {
            return;
        }
        if (sessionStorage.getItem('mediumBypassActive')) {
            sessionStorage.removeItem('mediumBypassActive');
            return;
        }
        if (config.autoRedirectEnabled && !isRedirecting && !autoRedirectCancelled) {
            const paywall = document.querySelector('.meteredContent');
            if (paywall && isArticle) {
                isRedirecting = true;
                const currentBypass = getCurrentBypassService();
                stealthNotification(`Attempting bypass with ${currentBypass}...`, {
                    cancelCallback: () => {
                        stealthNotification("Auto redirect cancelled");
                        clearTimeout(autoRedirectTimeout);
                        isRedirecting = false;
                        autoRedirectCancelled = true;
                    },
                    persistent: true
                });
                if (autoRedirectTimeout) {
                    clearTimeout(autoRedirectTimeout);
                }
                autoRedirectTimeout = setTimeout(async () => {
                    await autoBypass(window.location.href, currentBypass);
                }, config.autoRedirectDelay);
            }
        }
    };

    const attachSettingsListeners = (settingsContainer) => {
        settingsContainer.querySelector('.dropdown-trigger').addEventListener('click', (e) => {
            const menu = settingsContainer.querySelector('.dropdown-menu');
            menu.classList.toggle('show');
        });
        settingsContainer.querySelector('.dropdown-menu').addEventListener('click', (e) => {
            const item = e.target.closest('.dropdown-item');
            if (item) {
                const value = item.getAttribute('data-value');
                if (bypassServiceKeys.includes(value)) {
                    config.currentBypassService = value;
                    setSetting('currentBypassService', value);
                    settingsContainer.querySelector('.dropdown-trigger').textContent = value;
                    stealthNotification(`Bypass service set to ${value}`);
                    settingsContainer.querySelector('.dropdown-menu').classList.remove('show');
                }
            }
        });
        settingsContainer.querySelector('#toggleRedirectCheckbox').addEventListener('change', () => {
            config.autoRedirectEnabled = settingsContainer.querySelector('#toggleRedirectCheckbox').checked;
            setSetting('autoRedirect', config.autoRedirectEnabled);
            if (config.autoRedirectEnabled) {
                autoRedirectCancelled = false;
            }
            stealthNotification('Auto-Redirect toggled');
        });
        settingsContainer.querySelector('#toggleDarkModeCheckbox').addEventListener('change', () => {
            config.darkModeEnabled = settingsContainer.querySelector('#toggleDarkModeCheckbox').checked;
            setSetting('darkModeEnabled', config.darkModeEnabled);
            settingsContainer.classList.toggle('dark', config.darkModeEnabled);
            stealthNotification('Dark Mode toggled');
        });
        settingsContainer.querySelector('#bypassNow').addEventListener('click', async () => {
            stealthNotification('Attempting bypass...');
            await autoBypass(window.location.href, getCurrentBypassService());
        });
        settingsContainer.querySelector('#resetDefaults').addEventListener('click', () => {
            config.autoRedirectDelay = 5000;
            config.autoRedirectEnabled = true;
            config.darkModeEnabled = false;
            config.currentBypassService = 'Freedium';
            setSetting('redirectDelay', config.autoRedirectDelay);
            setSetting('autoRedirect', config.autoRedirectEnabled);
            setSetting('darkModeEnabled', config.darkModeEnabled);
            setSetting('currentBypassService', config.currentBypassService);
            settingsContainer.querySelector('#redirectDelay').value = config.autoRedirectDelay;
            settingsContainer.querySelector('#toggleRedirectCheckbox').checked = config.autoRedirectEnabled;
            settingsContainer.querySelector('#toggleDarkModeCheckbox').checked = config.darkModeEnabled;
            settingsContainer.querySelector('.dropdown-trigger').textContent = config.currentBypassService;
            settingsContainer.classList.remove('dark');
            stealthNotification('Settings reset to defaults');
        });
        const saveButton = settingsContainer.querySelector('#saveSettings');
        saveButton.addEventListener('click', () => {
            const delayInput = settingsContainer.querySelector('#redirectDelay');
            const newDelay = parseInt(delayInput.value, 10);
            if (!isNaN(newDelay) && newDelay >= 0) {
                config.autoRedirectDelay = newDelay;
                setSetting('redirectDelay', newDelay);
                saveButton.textContent = 'Saved!';
                setTimeout(() => { saveButton.textContent = 'Save'; }, 1500);
            } else {
                stealthNotification('Invalid redirect delay. Please enter a positive number.');
                delayInput.value = config.autoRedirectDelay;
            }
        });
        settingsContainer.querySelector('#closeSettings').addEventListener('click', () => {
            hideMediumSettings();
        });
    };

    const showMediumSettings = () => {
        let existingPanel = document.querySelector(`.${CLASS_SETTINGS}`);
        if (existingPanel) {
            existingPanel.style.display = 'block';
            isSettingsVisible = true;
            return;
        }
        const settingsContainer = document.createElement('div');
        settingsContainer.className = `${CLASS_SETTINGS} ${config.darkModeEnabled ? 'dark' : ''}`;
        settingsContainer.innerHTML = `
            <div class="medium-settings-header">Medium Settings</div>
            <div class="medium-settings-toggle">
                <span>Auto-Redirect</span>
                <label class="switch">
                    <input type="checkbox" id="toggleRedirectCheckbox" ${config.autoRedirectEnabled ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
            </div>
            <div class="medium-settings-toggle">
                <span>Redirect Delay (ms)</span>
                <input type="number" min="0" class="medium-settings-input" id="redirectDelay" value="${config.autoRedirectDelay}" />
            </div>
            <div class="medium-settings-toggle">
                <span>Dark Mode</span>
                <label class="switch">
                    <input type="checkbox" id="toggleDarkModeCheckbox" ${config.darkModeEnabled ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
            </div>
            <div class="medium-settings-toggle">
                <span>Bypass Service</span>
                <div class="custom-dropdown medium-settings-dropdown">
                    <div class="dropdown-trigger" id="bypassSelectorTrigger">${config.currentBypassService}</div>
                    <div class="dropdown-menu" id="bypassSelectorMenu">
                        ${bypassServiceKeys.filter(key => !archiveServices.includes(key)).map(key => `
                            <div class="dropdown-item" data-value="${key}">${key}</div>
                        `).join('')}
                        <div class="dropdown-item submenu-trigger">Archive
                            <div class="submenu">
                                ${archiveServices.map(key => `
                                    <div class="dropdown-item" data-value="${key}">${key}</div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="medium-settings-toggle">
                <button class="medium-settings-button" id="bypassNow">Bypass Now</button>
            </div>
            <div class="medium-settings-toggle">
                <button class="medium-settings-button" id="resetDefaults">Reset to Default</button>
            </div>
            <div class="medium-settings-toggle">
                <button class="medium-settings-button" id="saveSettings">Save</button>
                <button class="medium-settings-button" id="closeSettings">Close</button>
            </div>
        `;
        attachSettingsListeners(settingsContainer);
        let isDragging = false;
        let startX, startY;
        settingsContainer.addEventListener('mousedown', (e) => {
            if (e.target.closest('.medium-settings-input, .medium-settings-button, .medium-settings-dropdown, label')) return;
            isDragging = true;
            startX = e.clientX - settingsContainer.offsetLeft;
            startY = e.clientY - settingsContainer.offsetTop;
            settingsContainer.style.cursor = 'grabbing';
        });
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            settingsContainer.style.left = `${e.clientX - startX}px`;
            settingsContainer.style.top = `${e.clientY - startY}px`;
        });
        document.addEventListener('mouseup', () => {
            isDragging = false;
            settingsContainer.style.cursor = 'grab';
        });
        document.body.appendChild(settingsContainer);
        settingsContainer.style.display = 'block';
        isSettingsVisible = true;
        document.addEventListener('click', (e) => {
            const dropdown = settingsContainer.querySelector('.custom-dropdown');
            const menu = settingsContainer.querySelector('.dropdown-menu');
            if (menu && menu.classList.contains('show') && !dropdown.contains(e.target)) {
                menu.classList.remove('show');
            }
        });
    };

    const hideMediumSettings = () => {
        const settingsPanel = document.querySelector(`.${CLASS_SETTINGS}`);
        if (settingsPanel) {
            settingsPanel.style.display = 'none';
            isSettingsVisible = false;
        }
    };

    const toggleMediumSettings = () => {
        isSettingsVisible ? hideMediumSettings() : showMediumSettings();
    };

    const updateSettingsIcon = (iconButton) => {
        const article = document.querySelector('article');
        if (article && article.classList.contains('meteredContent')) {
            iconButton.style.opacity = '1';
            iconButton.style.pointerEvents = 'auto';
        } else {
            iconButton.style.opacity = '0.3';
            iconButton.style.pointerEvents = 'none';
        }
    };

    const createSettingsIconButton = () => {
        const button = document.createElement('button');
        button.className = 'settings-icon-button';
        button.setAttribute('aria-label', 'Medium Bypass Settings'); // Added for accessibility
        button.innerHTML = `<svg class="settings-icon" viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.6-.94l-.37-2.54c-.05-.25-.28-.43-.53-.43h-3.82c-.25 0-.48.17-.53.43l-.37 2.54c-.56.25-1.09.56-1.6.94l-2.39-.96c-.22-.07-.47 0-.59.22L2.74 8.87c-.11.2-.06.47.12.61l2.03 1.58c-.05.3-.07.61-.07.94s.02.64.07.94L2.86 14.51c-.18.14-.24.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.6.94l.37 2.54c.05.25.28.43.53.43h3.82c.25 0 .48-.17.53-.43l.37-2.54c.56-.25 1.09-.56 1.6-.94l2.39.96c.22.07.47 0 .59-.22l1.92-3.32c.12-.21.07-.47-.12-.61l-2.01-1.56zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"></path></svg>`;
        updateSettingsIcon(button);
        button.addEventListener('click', toggleMediumSettings);
        return button;
    };

    const autoCloseFreediumBanner = () => {
        if (window.location.hostname === 'freedium.cfd') {
            window.addEventListener('load', () => {
                const closeButton = document.querySelector(SELECTOR_FREEDIUM_CLOSE_BUTTON);
                if (closeButton) closeButton.click();
            });
        }
    };

    const autoCloseMemberBanner = () => {
        const closeButton = document.querySelector('[aria-label="close"]');
        if (closeButton) {
            closeButton.click();
        }
    };

    const insertSettingsButton = () => {
        const searchBar = document.querySelector(SELECTOR_SEARCH_BAR);
        if (searchBar && searchBar.parentNode) {
            let settingsIconButton = document.querySelector('.settings-icon-button');
            if (!settingsIconButton) {
                settingsIconButton = createSettingsIconButton();
                searchBar.parentNode.insertBefore(settingsIconButton, searchBar.nextSibling);
            } else {
                updateSettingsIcon(settingsIconButton);
            }
        } else {
            setTimeout(insertSettingsButton, 500);
        }
    };

    const initializeScript = () => {
        updateMediumAndArticleStatus();
        if (isMedium) {
            injectStyles();
            GM_registerMenuCommand('Open Medium Settings', showMediumSettings);
            insertSettingsButton();
            autoCloseMemberBanner();
        } else if (window.location.hostname === 'freedium.cfd') {
            autoCloseFreediumBanner();
        }
    };

    function handleUrlChange() {
        isRedirecting = false;
        autoRedirectCancelled = false;
        updateMediumAndArticleStatus();
        if (isMedium) {
            insertSettingsButton();
        } else {
            hideMediumSettings();
            const existingIcon = document.querySelector('.settings-icon-button');
            if (existingIcon) {
                existingIcon.remove();
            }
        }
    }

    initializeScript();

    window.addEventListener('popstate', handleUrlChange);

    const originalPushState = history.pushState;
    history.pushState = function () {
        originalPushState.apply(this, arguments);
        handleUrlChange();
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function () {
        originalReplaceState.apply(this, arguments);
        handleUrlChange();
    };
})();