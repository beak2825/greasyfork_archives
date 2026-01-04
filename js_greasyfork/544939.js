// ==UserScript==
// @name         Bilibili - 自动同步系统主题并刷新
// @namespace    http://tampermonkey.net/
// @version      2025-08-08
// @description  自动同步系统主题并刷新
// @author       You
// @license      MIT
// @match        https://*.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544939/Bilibili%20-%20%E8%87%AA%E5%8A%A8%E5%90%8C%E6%AD%A5%E7%B3%BB%E7%BB%9F%E4%B8%BB%E9%A2%98%E5%B9%B6%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/544939/Bilibili%20-%20%E8%87%AA%E5%8A%A8%E5%90%8C%E6%AD%A5%E7%B3%BB%E7%BB%9F%E4%B8%BB%E9%A2%98%E5%B9%B6%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const systemTheme = prefersDark ? 'dark' : 'light';

    const cookies = document.cookie.split('; ');
    const themeCookie = cookies.find(row => row.startsWith('theme_style='));
    const biliTheme = themeCookie ? themeCookie.split('=')[1] : null;

    function switchThemeAndReload(theme) {
        document.cookie = `theme_style=${theme}; path=/; max-age=31536000`;
        location.reload();
    }

    if (biliTheme !== systemTheme) {
        switchThemeAndReload(systemTheme);
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
        const newTheme = e.matches ? 'dark' : 'light';
        if (biliTheme !== newTheme) {
            switchThemeAndReload(newTheme);
        }
    });
    // Your code here...
})();