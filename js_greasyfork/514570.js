// ==UserScript==
// @name         MAM Points Per Hour Customizer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Customize the display format of MAM's built-in points per hour feature
// @author       MidniteRyder
// @match        https://www.myanonamouse.net/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addStyle
// @grant        GM_info
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514570/MAM%20Points%20Per%20Hour%20Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/514570/MAM%20Points%20Per%20Hour%20Customizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        DEBUG: false,
        ROUNDING_MODES: {
            NONE: 'none',
            ROUND: 'round',
            FLOOR: 'floor',
            CEIL: 'ceil'
        },
        UPDATE_DELAY: 1000
    };

    // Ensure script runs in correct userscript manager
    if (!GM_info || !GM_registerMenuCommand) {
        console.error('[MAM PPH] Required GM APIs not found');
        return;
    }

    // Utility functions
    const logger = (message, type = 'log') => {
        if (CONFIG.DEBUG || type === 'error') {
            console[type](`[MAM PPH] ${message}`);
        }
    };

    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    const roundNumber = (number, mode) => {
        const num = parseFloat(number);
        switch (mode) {
            case CONFIG.ROUNDING_MODES.ROUND:
                return Math.round(num);
            case CONFIG.ROUNDING_MODES.FLOOR:
                return Math.floor(num);
            case CONFIG.ROUNDING_MODES.CEIL:
                return Math.ceil(num);
            default:
                return num;
        }
    };

    // Main functionality
    const getPointsElements = () => {
        const tmPH = document.getElementById('tmPH');
        const dropdownLinks = document.querySelectorAll('.mmUserStats a');
        const dropdownPPH = Array.from(dropdownLinks || []).find(el => el?.textContent?.includes('B/hr:'));

        return {
            dropdownElement: dropdownPPH || null,
            topMenuElement: tmPH || null
        };
    };

    const formatPoints = (pointsText, format, roundingMode) => {
        if (!pointsText) return '';

        const pointsMatch = pointsText.match(/(\d+\.?\d*)/);
        if (!pointsMatch) return pointsText;

        const points = roundingMode === CONFIG.ROUNDING_MODES.NONE ?
            pointsMatch[1] :
            roundNumber(pointsMatch[1], roundingMode);

        switch (format) {
            case 'Points':
                return `Points/hour: ${points}`;
            case 'BP':
                return `BP/hr: ${points}`;
            case 'hr':
                return `${points}/hr`;
            case 'Full':
                return `${points} Bonus Points per hour`;
            default:
                return pointsText;
        }
    };

    const updateDisplayElements = () => {
        const elements = getPointsElements();
        const { displayFormat, roundingMode } = getStoredData();

        try {
            const { dropdownElement, topMenuElement } = elements;

            if (dropdownElement) {
                const originalPoints = dropdownElement.textContent;
                dropdownElement.textContent = formatPoints(originalPoints, displayFormat, roundingMode);
            }

            if (topMenuElement) {
                const originalPoints = topMenuElement.textContent;
                topMenuElement.textContent = formatPoints(originalPoints, displayFormat, roundingMode);
            }
        } catch (error) {
            logger(`Error updating display elements: ${error.message}`, 'error');
        }
    };

    const getStoredData = () => ({
        displayFormat: GM_getValue('MAM_PPH_DISPLAY_FORMAT', 'Points'),
        roundingMode: GM_getValue('MAM_PPH_ROUNDING_MODE', CONFIG.ROUNDING_MODES.NONE)
    });

    // Menu command functions
    const setDisplayFormat = (format) => {
        GM_setValue('MAM_PPH_DISPLAY_FORMAT', format);
        setTimeout(updateDisplayElements, 100);
        alert(`Display format set to ${format}`);
        updateMenuCommands();
    };

    const setRoundingMode = (mode) => {
        GM_setValue('MAM_PPH_ROUNDING_MODE', mode);
        setTimeout(updateDisplayElements, 100);
        alert(`Rounding mode set to ${mode}`);
        updateMenuCommands();
    };

    let menuCommandIds = {};

    const updateMenuCommands = () => {
        try {
            // Clear existing menu commands
            if (menuCommandIds) {
                Object.values(menuCommandIds).forEach(id => {
                    try {
                        if (id) GM_unregisterMenuCommand(id);
                    } catch (e) {
                        logger(`Error unregistering menu command: ${e.message}`, 'error');
                    }
                });
            }

            menuCommandIds = {}; // Reset the menu commands object
            const { displayFormat, roundingMode } = getStoredData();

            // Register new menu commands
            menuCommandIds.displayFormatPoints = GM_registerMenuCommand(
                `Format: Points/Hour ${displayFormat === 'Points' ? '(Active)' : ''}`,
                () => setDisplayFormat('Points')
            );

            menuCommandIds.displayFormatBP = GM_registerMenuCommand(
                `Format: BP/hr ${displayFormat === 'BP' ? '(Active)' : ''}`,
                () => setDisplayFormat('BP')
            );

            menuCommandIds.displayFormatCompact = GM_registerMenuCommand(
                `Format: /hr ${displayFormat === 'hr' ? '(Active)' : ''}`,
                () => setDisplayFormat('hr')
            );

            menuCommandIds.displayFormatFull = GM_registerMenuCommand(
                `Format: Bonus points per hour ${displayFormat === 'Full' ? '(Active)' : ''}`,
                () => setDisplayFormat('Full')
            );

            // Rounding Mode commands
            menuCommandIds.roundingNone = GM_registerMenuCommand(
                `Rounding: None ${roundingMode === CONFIG.ROUNDING_MODES.NONE ? '(Active)' : ''}`,
                () => setRoundingMode(CONFIG.ROUNDING_MODES.NONE)
            );

            menuCommandIds.roundingRound = GM_registerMenuCommand(
                `Rounding: Nearest Integer ${roundingMode === CONFIG.ROUNDING_MODES.ROUND ? '(Active)' : ''}`,
                () => setRoundingMode(CONFIG.ROUNDING_MODES.ROUND)
            );

            menuCommandIds.roundingFloor = GM_registerMenuCommand(
                `Rounding: Round Down ${roundingMode === CONFIG.ROUNDING_MODES.FLOOR ? '(Active)' : ''}`,
                () => setRoundingMode(CONFIG.ROUNDING_MODES.FLOOR)
            );

            menuCommandIds.roundingCeil = GM_registerMenuCommand(
                `Rounding: Round Up ${roundingMode === CONFIG.ROUNDING_MODES.CEIL ? '(Active)' : ''}`,
                () => setRoundingMode(CONFIG.ROUNDING_MODES.CEIL)
            );

            // Debug Mode toggle
            menuCommandIds.debug = GM_registerMenuCommand(
                `Toggle Debug Mode (${CONFIG.DEBUG ? 'Enabled' : 'Disabled'})`,
                () => {
                    CONFIG.DEBUG = !CONFIG.DEBUG;
                    alert(`Debug mode is now ${CONFIG.DEBUG ? 'enabled' : 'disabled'}.`);
                }
            );
        } catch (error) {
            logger(`Error updating menu commands: ${error.message}`, 'error');
        }
    };

    // Initialize
    const init = async () => {
        try {
            // Register menu commands first
            updateMenuCommands();

            // Then wait for the page to load
            setTimeout(() => {
                const debouncedUpdate = debounce(updateDisplayElements, 250);
                debouncedUpdate();

                // Set up a more efficient observer
                const observer = new MutationObserver(debounce(() => {
                    const elements = getPointsElements();
                    if (elements.dropdownElement || elements.topMenuElement) {
                        debouncedUpdate();
                    }
                }, 250));

                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    characterData: true
                });
            }, CONFIG.UPDATE_DELAY);
        } catch (error) {
            logger(`Error during initialization: ${error.message}`, 'error');
        }
    };

    // Start the script
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();