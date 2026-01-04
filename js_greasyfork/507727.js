// ==UserScript==
// @name         Google Custom Style with Tampermonkey Settings
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Customize Google's logos, buttons, icons, and text with Tampermonkey's settings interface
// @author       You
// @match        https://www.google.com/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/507727/Google%20Custom%20Style%20with%20Tampermonkey%20Settings.user.js
// @updateURL https://update.greasyfork.org/scripts/507727/Google%20Custom%20Style%20with%20Tampermonkey%20Settings.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Default settings
    let defaultSettings = {
        logoSize: 100,
        logoPosition: 0,
    };

    // Get stored settings or use defaults
    let logoSize = GM_getValue('logoSize', defaultSettings.logoSize);
    let logoPosition = GM_getValue('logoPosition', defaultSettings.logoPosition);

    // Apply initial styles
    function applyStyles() {
        GM_addStyle(`
            img[alt="Google"] {
                width: ${logoSize}px !important;
                transform: translateX(${logoPosition}px) !important;
            }
        `);
    }

    // Function to prompt user for input and save settings
    function openSettings() {
        logoSize = parseInt(prompt('Set logo size (50-300):', logoSize), 10);
        logoPosition = parseInt(prompt('Set logo position (-100 to 100):', logoPosition), 10);

        // Save new settings
        GM_setValue('logoSize', logoSize);
        GM_setValue('logoPosition', logoPosition);

        // Apply new styles
        applyStyles();
    }

    // Register the settings menu command in Tampermonkey
    GM_registerMenuCommand('Customize Google Style', openSettings);

    // Apply the initial styles when the script runs
    applyStyles();
})();
