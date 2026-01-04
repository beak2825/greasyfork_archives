// ==UserScript==
// @name         Automatic Theme Switcher
// @namespace    https://downloads.khinsider.com/
// @version      0.2
// @description  Automatically toggles between light and dark themes for KHInsider based on local time.
// @author       Inari
// @match        https://downloads.khinsider.com/*
// @grant        none
// @icon         https://cdn-icons-png.flaticon.com/512/543/543269.png
// @downloadURL https://update.greasyfork.org/scripts/517949/Automatic%20Theme%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/517949/Automatic%20Theme%20Switcher.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if (window.location.pathname.includes('/forums')) {
        return;
    }
    const sunriseHour = 6; // 6:00 AM, change as needed
    const sunsetHour = 18; // 6:00 PM, change as needed
    const currentHour = new Date().getHours();
    const isDarkMode = currentHour >= sunsetHour || currentHour < sunriseHour;
    const url = new URL(window.location.href);
    const currentTheme = url.searchParams.get('theme');
    const desiredTheme = isDarkMode ? 'dark' : 'light';
    if (currentTheme !== desiredTheme) {
        url.searchParams.set('theme', desiredTheme);
        window.location.replace(url.toString());
    }
})();