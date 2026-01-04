// ==UserScript==
// @name         Floatplane System Theme Sync
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Sync Floatplane theme with system theme based on system changes and page load
// @author       EthanBezz
// @match        https://*.floatplane.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523268/Floatplane%20System%20Theme%20Sync.user.js
// @updateURL https://update.greasyfork.org/scripts/523268/Floatplane%20System%20Theme%20Sync.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark');
    const isSystemDark = () => systemThemeQuery.matches;
    const getFloatplaneTheme = () => JSON.parse(localStorage.getItem('fp:theme-preferred'));
    const isThemeMismatched = () => isSystemDark() !== (getFloatplaneTheme() === 'dark');
    const getThemeToggle = () =>
        [...document.querySelectorAll('a._dropdownItem_ouby8_1')]
            .find(menuItem => menuItem.textContent.includes('Mode'));

    new MutationObserver((_, observer) => {
        const themeToggle = getThemeToggle();
        if (themeToggle) {
            isThemeMismatched() && themeToggle.click();
            systemThemeQuery.addEventListener('change', () => isThemeMismatched() && getThemeToggle()?.click());
            observer.disconnect();
        }
    }).observe(document, { subtree: true, childList: true });
})();