// ==UserScript==
// @name         UnknownCheats Auto Dark Theme
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto-enable dark theme on UnknownCheats
// @author       LeonardoVAC
// @match        https://www.unknowncheats.me/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543565/UnknownCheats%20Auto%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/543565/UnknownCheats%20Auto%20Dark%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Simple function to check if dark mode is active
    function isDarkMode() {
        // Check for uc_dark.css in stylesheets
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
        for (let stylesheet of stylesheets) {
            if (stylesheet.href && stylesheet.href.includes('uc_dark.css')) {
                return true;
            }
        }
        return false;
    }

    // Simple toggle function
    function toggleTheme() {
        if (typeof window.toggle_dark_theme === 'function') {
            window.toggle_dark_theme();
            return true;
        }
        return false;
    }

    // Make function globally accessible
    window.ucIsDarkMode = isDarkMode;

    // Toggle to dark mode if currently in light mode
    function toggleToDark() {
        if (typeof window.toggle_dark_theme === 'function' && !isDarkMode()) {
            console.log('Auto-toggling to dark mode...');
            window.toggle_dark_theme();
        }
    }

    // Initialize when ready
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        console.log('UnknownCheats Auto Dark Theme loaded');
        console.log('Current theme:', isDarkMode() ? 'Dark' : 'Light');

        // Auto-toggle to dark mode after a short delay
        toggleToDark();
    }

    init();
})();