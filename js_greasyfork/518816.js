// ==UserScript==
// @name         Theme Switcher
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Добавляет выбор темы в ЛК
// @author       setunicod
// @match        https://my.aeza.net/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518816/Theme%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/518816/Theme%20Switcher.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Темы
    const themes = {
        "Основная тема": "",
        "by @lolaka40": `
            :root .theme__dark,
            :root .theme--dark {
                --aeza-color-background: #212227;
                --aeza-background-card: rgba(46, 48, 58, .4);
                --aeza-bg-tab: rgba(46, 48, 58, .4);
                --aeza-border-card: #8e8e8e;
                --aeza-color-table-border: #414141;
                --aeza-color-alert-info: #255757;
                --aeza-color-moda-input: #26272e;
                --aeza-color-tooltip-box-shadow: #212227;
                --aeza-color-tooltip-border: #7a7a7a;
                --aeza-color-label: #cac8c8;
                --aeza-color-hint: #a3a3a3;
                --aeza-color-input: rgba(111, 111, 111, .3);
            }
            :root .banner {
                background-color: #0000;
                backdrop-filter: blur(1px) brightness(.6);
            }
            :root .header-button ~ .logout-button {
                opacity: 1;
                color: #ef004c;
            }
            :root .header-button ~ .logout-button:hover {
                opacity: 1;
                color: #ff0000;
            }
        `
    };

    let appliedTheme = null;

    const STORAGE_KEY = "aeza_theme";

    const applyTheme = (themeName) => {
        if (appliedTheme) {
            appliedTheme.remove();
        }
        if (themeName && themes[themeName]) {
            appliedTheme = GM_addStyle(themes[themeName]);
        }
        localStorage.setItem(STORAGE_KEY, themeName);
    };

    const registerThemesInMenu = () => {
        Object.keys(themes).forEach(themeName => {
            GM_registerMenuCommand(`Применить: ${themeName}`, () => applyTheme(themeName));
        });
    };

    const initialize = () => {
        const savedTheme = localStorage.getItem(STORAGE_KEY) || "Основная тема";
        applyTheme(savedTheme);

        registerThemesInMenu();
    };

    window.addEventListener('load', initialize);
})();
