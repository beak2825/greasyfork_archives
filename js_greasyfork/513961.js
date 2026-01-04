// ==UserScript==
// @name         YouTube Settings Rearranger
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Rearranges "Playback Speed" and "Quality" settings in YouTube video settings for improved accessibility.
// @author       malordin
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513961/YouTube%20Settings%20Rearranger.user.js
// @updateURL https://update.greasyfork.org/scripts/513961/YouTube%20Settings%20Rearranger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Debug mode flag
    const DEBUG = true;

    /**
     * Logs messages to the console with a custom tag.
     * @param {string} message - The message to log.
     * @param {string} type - The type of log ('log', 'warn', 'error').
     */
    function log(message, type = 'log') {
        if (!DEBUG) return;
        const LOG_TAG = '[YouTubeSettingsRearranger]';
        switch(type) {
            case 'log':
                console.log(`${LOG_TAG} ${message}`);
                break;
            case 'warn':
                console.warn(`${LOG_TAG} ${message}`);
                break;
            case 'error':
                console.error(`${LOG_TAG} ${message}`);
                break;
            default:
                console.log(`${LOG_TAG} ${message}`);
        }
    }

    // Flag to track if rearrangement has been done for the current menu open
    let rearranged = false;

    // SVG path prefixes for identifying menu items
    const PLAYBACK_SPEED_SVG_PREFIX = "M10,8v8l6-4L10,8L10,8z";
    const QUALITY_SVG_PREFIX = "M15,17h6v1h-6V17z";

    /**
     * Identifies the "Playback Speed" and "Quality" menu items based on their SVG icons.
     * @returns {Object} An object containing the playbackSpeedItem and qualityItem elements.
     */
    function identifyMenuItems() {
        const menuItems = document.querySelectorAll('.ytp-panel-menu .ytp-menuitem');
        log(`Found ${menuItems.length} menu items`);

        let playbackSpeedItem = null;
        let qualityItem = null;

        menuItems.forEach((item, index) => {
            const svgPath = item.querySelector('.ytp-menuitem-icon svg path');
            if (svgPath) {
                const dAttribute = svgPath.getAttribute('d');
                if (dAttribute.startsWith(PLAYBACK_SPEED_SVG_PREFIX)) {
                    playbackSpeedItem = item;
                    log('Found "Playback Speed"');
                }
                if (dAttribute.startsWith(QUALITY_SVG_PREFIX)) {
                    qualityItem = item;
                    log('Found "Quality"');
                }
            } else {
                log(`Item ${index + 1} does not contain an SVG path`, 'warn');
            }
        });

        return { playbackSpeedItem, qualityItem, menuItems };
    }

    /**
     * Rearranges the "Playback Speed" menu item to be immediately before the "Quality" menu item.
     */
    function rearrangeSettingsMenu() {
        log('Initializing menu rearrangement');

        const { playbackSpeedItem, qualityItem, menuItems } = identifyMenuItems();

        // Check if both items are found
        if (playbackSpeedItem && qualityItem) {
            // Check if "Playback Speed" is already immediately before "Quality"
            const nextSibling = playbackSpeedItem.nextElementSibling;
            if (nextSibling === qualityItem) {
                log('Rearrangement not needed, items are already in the correct order');
                return;
            }

            try {
                // Move "Playback Speed" before "Quality"
                qualityItem.parentNode.insertBefore(playbackSpeedItem, qualityItem);
                log('Rearrangement successful');
                rearranged = true; // Set the flag to prevent repeated rearrangement
            } catch (error) {
                log(`Error during rearrangement: ${error}`, 'error');
            }
        } else {
            if (!playbackSpeedItem) {
                log('"Playback Speed" not found', 'warn');
            }
            if (!qualityItem) {
                log('"Quality" not found', 'warn');
            }
        }
    }

    // MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver((mutations, obs) => {
        // Check if the settings menu is visible
        const settingsMenu = document.querySelector('.ytp-panel-menu');
        const isMenuVisible = settingsMenu && settingsMenu.offsetParent !== null;

        if (isMenuVisible && !rearranged) {
            log('Settings menu opened');
            // Add a slight delay to ensure the menu is fully loaded
            setTimeout(() => {
                rearrangeSettingsMenu();
            }, 200); // Delay in milliseconds
        }

        if (!isMenuVisible && rearranged) {
            log('Settings menu closed');
            rearranged = false; // Reset the flag when the menu is closed
        }
    });

    // Start observing the document body for changes
    observer.observe(document.body, { childList: true, subtree: true });
    log('Script activated and observing DOM changes');

})();
