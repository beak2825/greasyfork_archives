// ==UserScript==
// @name            Twitch Player Quality Changer
// @description     Automatically change the quality of the Twitch player to your liking.
// @namespace       https://github.com/ramhaidar/Twitch-Player-Quality-Changer
// @version         0.0.9
// @author          ramhaidar (https://github.com/ramhaidar)
// @homepageURL     https://github.com/ramhaidar/Twitch-Player-Quality-Changer
// @icon            https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @license         MIT
// @match           https://twitch.tv/*
// @match           https://www.twitch.tv/*
// @match           https://player.twitch.tv/*
// @match           https://m.twitch.tv/*
// @grant           none
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/465887/Twitch%20Player%20Quality%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/465887/Twitch%20Player%20Quality%20Changer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Configuration
    const CONFIG = {
        // Available qualities: 1080p60, 936p60, 720p60, 720p, 480p, 360p, 160p
        // Set your preferred video quality here.
        preferredQuality: '480p',
        qualities: ['1080p60', '936p60', '720p60', '720p', '480p', '360p', '160p'],
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
                console.warn(`❌ Element "${selector}" not found after ${maxAttempts} attempts`);
            }
        }, CONFIG.pollInterval);
    }

    /**
     * Checks if the channel is live or offline
     * @returns {boolean}
     */
    function isChannelActive() {
        const statusElement = document.querySelector(CONFIG.selectors.channelStatus);
        const status = statusElement?.textContent;
        return status === 'LIVE' || status === 'Offline';
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
        console.info(`🎯 Selected quality: ${qualityInput.parentNode.querySelector('label').textContent}`);

        waitForElement(CONFIG.selectors.settingsButton, CONFIG.maxAttempts, button => {
            button.click();
            console.info('⚙️ Settings menu closed');
        });
    }

    /**
     * Initializes the quality selection process
     */
    function initializeQualitySelection() {
        if (!isChannelActive()) {
            console.warn('⚠️ Channel LIVE status cannot be determined');
            return;
        }

        console.info('✅ Channel is LIVE, proceeding with quality selection');

        // Open settings menu
        waitForElement(CONFIG.selectors.settingsButton, CONFIG.maxAttempts, button => {
            button.click();

            // Navigate to quality submenu
            waitForElement(CONFIG.selectors.qualityMenuItem, CONFIG.maxAttempts, menuItem => {
                menuItem.click();

                // Select quality
                waitForElement(CONFIG.selectors.qualityOptions, CONFIG.maxAttempts, () => {
                    const qualityInputs = document.querySelectorAll('input[type="radio"]');
                    const preferredIndex = CONFIG.qualities.indexOf(CONFIG.preferredQuality);
                    setVideoQuality(qualityInputs, preferredIndex);
                });
            });
        });
    }

    // Initialize the script when the channel status element is available
    waitForElement(CONFIG.selectors.channelStatus, CONFIG.maxAttempts, initializeQualitySelection);
})();