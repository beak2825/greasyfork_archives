// ==UserScript==
// @name            Twitch Player Quality Changer
// @description     Automatically change the quality of the Twitch player to your liking.
// @namespace       https://github.com/ramhaidar/Twitch-Player-Quality-Changer
// @version         0.1.0
// @author          ramhaidar (https://github.com/ramhaidar)
// @homepageURL     https://github.com/ramhaidar/Twitch-Player-Quality-Changer
// @icon            https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @license         MIT
// @match           https://twitch.tv/*
// @match           https://www.twitch.tv/*
// @match           https://player.twitch.tv/*
// @match           https://m.twitch.tv/*
// @grant           GM_addStyle
// @grant           GM_getResourceText
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/465887/Twitch%20Player%20Quality%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/465887/Twitch%20Player%20Quality%20Changer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Configuration
    const CONFIG = {
        // Available qualities: 1080p60, 936p60, 720p60, 720p, 480p, 360p, 160p
        preferredQuality: localStorage.getItem('twitchQualityChanger_quality') || '480p',
        qualities: ['1080p60', '936p60', '720p60', '720p', '480p', '360p', '160p'],

        // Storage keys
        storageKeys: {
            quality: 'twitchQualityChanger_quality',
            buttonTop: 'twitchQualityChanger_buttonTop',
            buttonLeft: 'twitchQualityChanger_buttonLeft'
        },

        // Default position (bottom-left)
        defaultPosition: {
            top: 'auto',
            bottom: '20px',
            left: '20px',
            right: 'auto'
        },

        // Button styling
        buttonColor: '#9146FF', // Twitch purple

        selectors: {
            settingsButton: '[data-a-target="player-settings-button"]',
            qualityMenuItem: '[data-a-target="player-settings-menu-item-quality"]',
            qualityOptions: '[data-a-target="tw-radio"]',
            channelStatus: '.tw-channel-status-text-indicator, .channel-status-info'
        },

        pollInterval: 500, // Polling interval (milliseconds)
        maxAttempts: 25 // Maximum number of attempts
    };

    /**
     * Waits for an element to appear in the DOM
     * @param {string} selector - CSS selector for the element
     * @param {number} maxAttempts - Maximum number of attempts to find the element
     * @param {Function} callback - Function to execute when element is found
     */
    function waitForElement(selector, maxAttempts, callback) {
        let attempts = 0;
        const intervalId = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(intervalId);
                callback(element);
                return;
            }

            attempts++;
            if (attempts >= maxAttempts) {
                clearInterval(intervalId);
                console.warn(`[TPQC] ❌ Element "${selector}" not found after ${maxAttempts} attempts`);
            }
        }, CONFIG.pollInterval);
    }

    /**
     * Checks if the channel is active/live
     * @returns {boolean}
     */
    function isChannelActive() {
        const statusElement = document.querySelector(CONFIG.selectors.channelStatus);
        if (!statusElement) return false;
        const status = statusElement.textContent.trim();
        return status === 'LIVE' || status === 'Offline';
    }

    /**
     * Gets the saved quality preference
     * @returns {string}
     */
    function getSavedQuality() {
        return localStorage.getItem(CONFIG.storageKeys.quality) || '480p';
    }

    /**
     * Saves the quality preference
     * @param {string} quality - The quality to save
     */
    function saveQuality(quality) {
        CONFIG.preferredQuality = quality;
        localStorage.setItem(CONFIG.storageKeys.quality, quality);
        console.info(`[TPQC] 💾 Saved quality preference: ${quality}`);
    }

    /**
     * Resets all settings to defaults
     */
    function resetAllSettings() {
        // Reset quality
        saveQuality('480p');

        // Reset button position
        localStorage.removeItem(CONFIG.storageKeys.buttonTop);
        localStorage.removeItem(CONFIG.storageKeys.buttonLeft);

        // Update button position
        const button = document.getElementById('twitchQualityChangerButton');
        if (button) {
            Object.assign(button.style, CONFIG.defaultPosition);
        }

        console.info('[TPQC] 🔄 All settings reset to defaults');

        // Apply default quality
        applyQuality();
    }

    /**
     * Applies the saved quality to the video player
     */
    function applyQuality() {
        const preferredQuality = getSavedQuality();

        if (!isChannelActive()) {
            console.warn('[TPQC] ⚠️ Channel LIVE status cannot be determined');
            return;
        }

        console.info('[TPQC] ✅ Channel is LIVE, proceeding with quality selection');
        console.info(`[TPQC] 🎯 Using saved quality preference: ${preferredQuality}`);

        // Open settings menu
        waitForElement(CONFIG.selectors.settingsButton, CONFIG.maxAttempts, button => {
            button.click();

            // Navigate to quality submenu
            waitForElement(CONFIG.selectors.qualityMenuItem, CONFIG.maxAttempts, menuItem => {
                menuItem.click();

                // Select quality
                waitForElement(CONFIG.selectors.qualityOptions, CONFIG.maxAttempts, () => {
                    const qualityInputs = document.querySelectorAll('input[type="radio"]');
                    const preferredIndex = CONFIG.qualities.indexOf(preferredQuality);
                    setVideoQuality(qualityInputs, preferredIndex);
                });
            });
        });
    }

    /**
     * Sets the video quality to the preferred setting
     * @param {NodeList} qualityInputs - List of available quality options
     * @param {number} preferredIndex - Index of the preferred quality in the qualities array
     */
    function setVideoQuality(qualityInputs, preferredIndex) {
        const availableQualities = Array.from(qualityInputs);
        const isPreferredQualityAvailable = availableQualities.some(input =>
            input.parentNode.textContent.includes(CONFIG.qualities[preferredIndex])
        );

        if (isPreferredQualityAvailable) {
            const preferredInput = availableQualities.find(input =>
                input.parentNode.textContent.includes(CONFIG.qualities[preferredIndex])
            );
            selectQualityAndClose(preferredInput);
        } else {
            // Fall back to lowest available quality
            selectQualityAndClose(availableQualities[availableQualities.length - 1]);
        }
    }

    /**
     * Selects a quality option and closes the settings menu
     * @param {Element} qualityInput - The quality radio input element to select
     */
    function selectQualityAndClose(qualityInput) {
        qualityInput.checked = true;
        qualityInput.click();
        console.info(`[TPQC] 🎯 Selected quality: ${qualityInput.parentNode.querySelector('label').textContent}`);

        waitForElement(CONFIG.selectors.settingsButton, CONFIG.maxAttempts, button => {
            button.click();
            console.info('[TPQC] ⚙️ Settings menu closed');
        });
    }

    /**
     * Hides the modal
     * @param {HTMLElement} modal - The modal element to hide
     */
    function hideModal(modal) {
        modal.style.display = 'none';
    }

    /**
     * Shows the modal
     * @param {HTMLElement} modal - The modal element to show
     */
    function showModal(modal) {
        modal.style.display = 'flex';
    }

    /**
     * Determines if Twitch is in dark mode by checking the CSS background color variable
     * @returns {boolean}
     */
    function isDarkModeByColor() {
        // Get the computed style of the body
        const styles = getComputedStyle(document.body);

        // Check the specific background variable Twitch uses
        // Note: Twitch variables can change, but checking background color is generally safe
        const bgColor = styles.getPropertyValue('--color-background-body').trim();

        // If it's the dark grey hex code, it's dark mode
        return bgColor === '#0e0e10';
    }

    /**
     * Updates the modal theme based on Twitch's dark mode setting
     * @param {HTMLElement} modal - The modal element
     */
    function updateModalTheme(modal) {
        if (!modal) return;
        // Detect theme based on CSS variable (most reliable method)
        const isDarkMode = isDarkModeByColor();

        // Get all modal elements
        const content = modal.querySelector('.native-modal-content');
        const header = modal.querySelector('.native-modal-header');
        const modalBody = modal.querySelector('.native-modal-body');
        const footer = modal.querySelector('.native-modal-footer');
        const labels = modal.querySelectorAll('.native-form-label');
        const selects = modal.querySelectorAll('.native-form-select');
        const closeBtn = modal.querySelector('.native-modal-close');
        const secondaryBtn = modal.querySelector('.native-btn-secondary');

        // Clean up existing theme classes from all elements
        const elements = [modal, content, header, modalBody, footer, closeBtn, secondaryBtn];
        elements.forEach(el => {
            if (el) el.classList.remove('dark-theme');
        });
        labels.forEach(l => l.classList.remove('dark-theme'));
        selects.forEach(s => s.classList.remove('dark-theme'));

        // Apply dark theme classes if needed
        if (isDarkMode) {
            modal.classList.add('dark-theme');
            if (content) content.classList.add('dark-theme');
            if (header) header.classList.add('dark-theme');
            if (modalBody) modalBody.classList.add('dark-theme');
            if (footer) footer.classList.add('dark-theme');
            labels.forEach(l => l.classList.add('dark-theme'));
            selects.forEach(s => s.classList.add('dark-theme'));
            if (closeBtn) closeBtn.classList.add('dark-theme');
            if (secondaryBtn) secondaryBtn.classList.add('dark-theme');
        }
    }

    /**
     * Sets up a MutationObserver to detect theme changes
     */
    function setupThemeObserver() {
        // Only observe class changes on body (much more efficient)
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const modal = document.getElementById('twitchQualityChangerModal');
                    if (modal) {
                        updateModalTheme(modal);
                    }
                }
            });
        });

        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class']
        });
    }

    /**
     * Ensures theme observer is active when modal is shown
     */
    function ensureThemeObserver() {
        // Observer is already set up globally, just update theme
        const modal = document.getElementById('twitchQualityChangerModal');
        if (modal) {
            updateModalTheme(modal);
        }
    }

    /**
     * Creates and shows the quality settings modal
     */
    function showQualityModal() {
        let modal = document.getElementById('twitchQualityChangerModal');
        if (!modal) {
            // Create modal HTML with native styling
            const modalHtml = `
                <div id="twitchQualityChangerModal" class="native-modal-overlay">
                    <div class="native-modal-dialog">
                        <div class="native-modal-content">
                            <div class="native-modal-header">
                                <h5 class="native-modal-title" id="twitchQualityChangerModalLabel">Quality Settings</h5>
                                <button type="button" class="native-modal-close" aria-label="Close">&times;</button>
                            </div>
                            <div class="native-modal-body">
                                <label for="qualitySelect" class="native-form-label">Preferred Quality</label>
                                <select class="native-form-select" id="qualitySelect">
                                    ${CONFIG.qualities.map(q =>
                `<option value="${q}" ${q === getSavedQuality() ? 'selected' : ''}>${q}</option>`
            ).join('')}
                                </select>
                            </div>
                            <div class="native-modal-footer">
                                <button type="button" class="native-btn native-btn-secondary" id="resetAllBtn">Reset All</button>
                                <button type="button" class="native-btn native-btn-primary" id="saveQualityBtn" style="background-color: ${CONFIG.buttonColor}; border-color: ${CONFIG.buttonColor};">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', modalHtml);

            modal = document.getElementById('twitchQualityChangerModal');

            // Setup event listeners
            const saveBtn = document.getElementById('saveQualityBtn');
            const resetBtn = document.getElementById('resetAllBtn');
            const closeBtn = modal.querySelector('.native-modal-close');

            saveBtn.addEventListener('click', () => {
                const selectedQuality = document.getElementById('qualitySelect').value;
                saveQuality(selectedQuality);
                applyQuality();
                hideModal(modal);
            });

            resetBtn.addEventListener('click', () => {
                resetAllSettings();
                hideModal(modal);
            });

            closeBtn.addEventListener('click', () => {
                hideModal(modal);
            });

            // Close modal when clicking outside
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    hideModal(modal);
                }
            });

            // Ensure theme observer is active
            ensureThemeObserver();
        }

        // Always update theme when modal is shown (whether new or existing)
        console.info('[TPQC] 🎨 Updating modal theme based on current Twitch theme');
        updateModalTheme(modal);
        showModal(modal);
    }

    /**
     * Creates the draggable floating button
     */
    function createFloatingButton() {
        const button = document.createElement('button');
        button.id = 'twitchQualityChangerButton';
        button.className = 'twitch-quality-changer-btn';
        button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16"><path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/><path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/></svg>';

        // Apply saved position or default
        const savedTop = localStorage.getItem(CONFIG.storageKeys.buttonTop);
        const savedLeft = localStorage.getItem(CONFIG.storageKeys.buttonLeft);

        if (savedTop !== null && savedLeft !== null) {
            button.style.top = savedTop + 'px';
            button.style.left = savedLeft + 'px';
            button.style.bottom = 'auto';
            button.style.right = 'auto';
        } else {
            Object.assign(button.style, CONFIG.defaultPosition);
        }

        // Button styles
        button.style.cssText += `
            position: fixed;
            z-index: 9999;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: none;
            background-color: ${CONFIG.buttonColor};
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            transition: transform 0.1s, box-shadow 0.2s;
        `;

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
            button.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        });

        // Drag functionality
        setupDrag(button);

        document.body.appendChild(button);
        return button;
    }

    /**
     * Sets up drag functionality for the floating button
     * @param {HTMLElement} button - The button element
     */
    function setupDrag(button) {
        let isDragging = false;
        let dragged = false;
        let startX, startY, initialLeft, initialTop;

        button.addEventListener('mousedown', (e) => {
            isDragging = true;
            dragged = false;
            startX = e.clientX;
            startY = e.clientY;
            initialLeft = button.offsetLeft;
            initialTop = button.offsetTop;
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            if (!dragged) {
                if (Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5) {
                    dragged = true;
                    button.style.cursor = 'grabbing';
                    button.style.zIndex = '10000';
                }
            }

            if (dragged) {
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                const newLeft = initialLeft + deltaX;
                const newTop = initialTop + deltaY;

                // Boundary checking
                const maxLeft = window.innerWidth - button.offsetWidth;
                const maxTop = window.innerHeight - button.offsetHeight;

                const clampedLeft = Math.max(0, Math.min(newLeft, maxLeft));
                const clampedTop = Math.max(0, Math.min(newTop, maxTop));

                button.style.left = clampedLeft + 'px';
                button.style.top = clampedTop + 'px';
                button.style.bottom = 'auto';
                button.style.right = 'auto';
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                if (dragged) {
                    button.style.cursor = 'pointer';
                    button.style.zIndex = '9999';
                    // Save position to localStorage
                    localStorage.setItem(CONFIG.storageKeys.buttonTop, button.offsetTop);
                    localStorage.setItem(CONFIG.storageKeys.buttonLeft, button.offsetLeft);
                } else {
                    // It's a click, open modal
                    showQualityModal();
                }
            }
            isDragging = false;
            dragged = false;
        });
    }

    /**
     * Initializes the quality selection process
     */
    function initializeQualitySelection() {
        if (!isChannelActive()) {
            console.warn('[TPQC] ⚠️ Channel LIVE status cannot be determined');
            return;
        }

        console.info('[TPQC] ✅ Channel is LIVE, proceeding with quality selection');

        // Use saved quality preference
        const preferredQuality = getSavedQuality();
        console.info(`[TPQC] 🎯 Using saved quality preference: ${preferredQuality}`);

        // Open settings menu
        waitForElement(CONFIG.selectors.settingsButton, CONFIG.maxAttempts, button => {
            button.click();

            // Navigate to quality submenu
            waitForElement(CONFIG.selectors.qualityMenuItem, CONFIG.maxAttempts, menuItem => {
                menuItem.click();

                // Select quality
                waitForElement(CONFIG.selectors.qualityOptions, CONFIG.maxAttempts, () => {
                    const qualityInputs = document.querySelectorAll('input[type="radio"]');
                    const preferredIndex = CONFIG.qualities.indexOf(preferredQuality);
                    setVideoQuality(qualityInputs, preferredIndex);
                });
            });
        });
    }

    /**
     * Main initialization function
     */
    function initialize() {
        // Create floating button
        createFloatingButton();

        // Initialize quality selection when channel status is available
        waitForElement(CONFIG.selectors.channelStatus, CONFIG.maxAttempts, initializeQualitySelection);

        // Setup theme observer for dynamic theme changes
        setupThemeObserver();

        console.info('[TPQC] 🚀 Twitch Player Quality Changer initialized');
        console.info(`[TPQC] 📍 Button position: ${localStorage.getItem(CONFIG.storageKeys.buttonLeft)}, ${localStorage.getItem(CONFIG.storageKeys.buttonTop)}`);
        console.info(`[TPQC] 🎯 Saved quality: ${getSavedQuality()}`);
    }

    // Add native CSS styles for the modal
    const nativeModalCSS = `
        .native-modal-overlay {
            display: flex;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1050;
            animation: fadeIn 0.15s ease-in-out;
            align-items: center;
            justify-content: center;
        }

        .native-modal-dialog {
            position: relative;
            width: 90%;
            max-width: 400px;
            animation: slideIn 0.2s ease-out;
        }

        .native-modal-content {
            background-color: #ffffff;
            color: #333333;
            border: 1px solid #ddd;
            border-radius: 8px;
            position: relative;
            display: flex;
            flex-direction: column;
            pointer-events: auto;
            outline: 0;
        }

        .native-modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 15px;
            border-bottom: 1px solid #ddd;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }

        .native-modal-close {
            background: none;
            border: none;
            color: #333333;
            font-size: 24px;
            font-weight: bold;
            line-height: 1;
            cursor: pointer;
            padding: 0;
            margin: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
        }

        .native-modal-close:hover {
            background-color: rgba(0, 0, 0, 0.05);
        }

        .native-modal-body {
            padding: 15px;
            flex: 1;
        }

        .native-form-label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #333333;
        }

        .native-form-select {
            width: 100%;
            padding: 8px 12px;
            font-size: 14px;
            line-height: 1.5;
            color: #333;
            background-color: #fff;
            background-clip: padding-box;
            border: 1px solid #ccc;
            border-radius: 4px;
        }

        .native-form-select:focus {
            outline: 0;
            box-shadow: 0 0 0 0.2rem rgba(145, 70, 255, 0.25);
            border-color: #9146FF;
        }

        .native-modal-footer {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding: 15px;
            border-top: 1px solid #ddd;
            gap: 10px;
        }

        .native-btn {
            display: inline-block;
            padding: 8px 16px;
            font-size: 14px;
            font-weight: 500;
            line-height: 1.5;
            text-align: center;
            text-decoration: none;
            vertical-align: middle;
            cursor: pointer;
            user-select: none;
            border-radius: 4px;
            border: 1px solid transparent;
        }

        .native-btn:focus {
            outline: 0;
            box-shadow: 0 0 0 0.2rem rgba(145, 70, 255, 0.25);
        }

        .native-btn-primary {
            color: #fff;
            background-color: #9146FF;
            border-color: #9146FF;
            transition: all 0.2s ease;
        }

        .native-btn-primary:hover {
            background-color: #7d3fe1;
            border-color: #7d3fe1;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(145, 70, 255, 0.3);
        }

        .native-btn-primary:active {
            transform: translateY(0);
            box-shadow: 0 2px 4px rgba(145, 70, 255, 0.3);
        }

        .native-btn-secondary {
            color: #333;
            background-color: #ffffff;
            border-color: #cccccc;
            transition: all 0.2s ease;
        }

        .native-btn-secondary:hover {
            background-color: #f8f9fa;
            border-color: #adb5bd;
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .native-btn-secondary:active {
            transform: translateY(0);
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes slideIn {
            from {
                transform: translateY(-50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        /* Dark theme styles */
        .native-modal-overlay.dark-theme {
            background-color: rgba(0, 0, 0, 0.7);
        }

        .native-modal-content.dark-theme {
            background-color: #2d2d2d;
            color: #e0e0e0;
            border-color: #404040;
        }

        .native-modal-header.dark-theme {
            border-bottom-color: #404040;
        }

        .native-modal-close.dark-theme {
            color: #e0e0e0;
        }

        .native-form-select.dark-theme {
            background-color: #3a3a3a;
            color: #e0e0e0;
            border-color: #555;
        }

        .native-modal-footer.dark-theme {
            border-top-color: #404040;
        }

        .native-btn-secondary.dark-theme {
            color: #e0e0e0;
            background-color: #404040;
            border-color: #555555;
            transition: all 0.2s ease;
        }

        .native-btn-secondary.dark-theme:hover {
            background-color: #4a4a4a;
            border-color: #666666;
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .native-btn-secondary.dark-theme:active {
            transform: translateY(0);
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .native-btn-primary.dark-theme {
            color: #fff;
            background-color: #9146FF;
            border-color: #9146FF;
            transition: all 0.2s ease;
        }

        .native-btn-primary.dark-theme:hover {
            background-color: #7d3fe1;
            border-color: #7d3fe1;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(145, 70, 255, 0.4);
        }

        .native-btn-primary.dark-theme:active {
            transform: translateY(0);
            box-shadow: 0 2px 4px rgba(145, 70, 255, 0.4);
        }

        .native-form-label.dark-theme {
            color: #e0e0e0;
        }
    `;

    GM_addStyle(nativeModalCSS);

    // Start the script
    initialize();
})();