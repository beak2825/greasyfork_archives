// ==UserScript==
// @name         Ozon Simple Dark Mode Support
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Добавляет поддержку тёмной темы
// @author       Jipok
// @match        *://*.ozon.ru/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524277/Ozon%20Simple%20Dark%20Mode%20Support.user.js
// @updateURL https://update.greasyfork.org/scripts/524277/Ozon%20Simple%20Dark%20Mode%20Support.meta.js
// ==/UserScript==

(function() {
    'use strict';
        const darkModeCSS = `
            html {
                filter: invert(90%) hue-rotate(180deg) !important;
            }

            img, video, picture {
                filter: invert(100%) hue-rotate(180deg) !important;
            }
        `;

    function handleThemeChange(e) {
        const darkMode = document.getElementById('ozon-dark-mode');

        if (e.matches) {
            if (!darkMode) {
                const darkModeStyle = document.createElement('style');
                darkModeStyle.id = 'ozon-dark-mode';
                darkModeStyle.innerHTML = darkModeCSS;
                document.head.appendChild(darkModeStyle);
            }
        } else {
            darkMode?.remove();
        }
    }

    // Check for theme changes
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeMediaQuery.addListener(handleThemeChange);

    handleThemeChange(darkModeMediaQuery);
})();