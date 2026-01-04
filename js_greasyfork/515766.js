// ==UserScript==
// @name         Twitter Auto Dark Mode
// @namespace    https://gist.github.com/risin42/a7c8ab03cabb9f8f669593e3fa3b7ceb
// @version      1.0
// @author       Risin42
// @license      MIT
// @description  Auto switch Twitter dark mode based on system settings
// @match        *://x.com/*
// @match        *://twitter.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/515766/Twitter%20Auto%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/515766/Twitter%20Auto%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Theme configuration
    const THEMES = {
        LIGHT: 0,
        DARK_BLUE: 1,
        BLACK: 2
    };

    // Get preferred dark theme from storage, default to dark blue
    let preferredDarkTheme = GM_getValue('preferredDarkTheme', THEMES.DARK_BLUE);

    // Register menu commands for theme selection
    GM_registerMenuCommand('Use Dark Blue Theme', () => {
        preferredDarkTheme = THEMES.DARK_BLUE;
        GM_setValue('preferredDarkTheme', THEMES.DARK_BLUE);
        toggleTheme(darkMedia.matches);
    });

    GM_registerMenuCommand('Use Black Theme', () => {
        preferredDarkTheme = THEMES.BLACK;
        GM_setValue('preferredDarkTheme', THEMES.BLACK);
        toggleTheme(darkMedia.matches);
    });

    function toggleTheme(isDarkMode) {
        const mode = isDarkMode ? preferredDarkTheme : THEMES.LIGHT;
        document.cookie = `night_mode=${mode};path=/;domain=.x.com;secure`;
        document.cookie = `night_mode=${mode};path=/;domain=.twitter.com;secure`;
    }

    const darkMedia = window.matchMedia('(prefers-color-scheme: dark)');

    // Toggle theme when page loaded
    toggleTheme(darkMedia.matches);

    // Toggle theme when system theme changes
    darkMedia.addEventListener('change', e => {
        toggleTheme(e.matches);
    });
})();