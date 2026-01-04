// ==UserScript==
// @name         鲨鱼黑暗模式
// @version      0.2
// @description  右上角按钮开关黑暗模式
// @author       freefrank
// @match        https://*sharkpt.net/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         https://sharkpt.net/favicon.ico
// @license      MIT
// @namespace https://greasyfork.org/users/133888
// @downloadURL https://update.greasyfork.org/scripts/464209/%E9%B2%A8%E9%B1%BC%E9%BB%91%E6%9A%97%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/464209/%E9%B2%A8%E9%B1%BC%E9%BB%91%E6%9A%97%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const fontAwesome = document.createElement('link');
    fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css';
    fontAwesome.rel = 'stylesheet';
    document.head.appendChild(fontAwesome);

    const darkThemeStyles = `
        html {
            filter: invert(1) hue-rotate(180deg);
            background-color: #3d3d3d !important;
        }

        img, video, [style*="background-image"], [style*="background: url"], picture, [role="img"], div.banner {
            filter: invert(1) hue-rotate(180deg) !important;
        }
        .torrent-item {
            background: #d2d5e0;
        }
        .m_menu {
            background: #6aa3c7 !important;
        }
    `;

    const toggleButtonStyles = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 999999;
        background-color: transparent;
        border: none;
        padding: 0;
        cursor: pointer;
        font-size: 24px;
    `;

    const darkModeIconClass = 'fas fa-moon';

    function applyDarkTheme() {
        const styleElement = document.createElement('style');
        styleElement.textContent = darkThemeStyles;
        styleElement.id = 'dark-theme';
        document.head.appendChild(styleElement);
    }

    function removeDarkTheme() {
        const styleElement = document.getElementById('dark-theme');
        if (styleElement) {
            styleElement.remove();
        }
    }

    function createToggleButton() {
        const button = document.createElement('button');
        button.style.cssText = toggleButtonStyles;
        button.className = darkModeIconClass;
        button.addEventListener('click', () => {
            const isEnabled = GM_getValue('darkThemeEnabled', false);
            GM_setValue('darkThemeEnabled', !isEnabled);

            if (GM_getValue('darkThemeEnabled', false)) {
                applyDarkTheme();
            } else {
                removeDarkTheme();
            }
        });
        const navElement = document.getElementById('nav');
        navElement.appendChild(button);
    }

    if (GM_getValue('darkThemeEnabled', false)) {
        applyDarkTheme();
    }

    createToggleButton();


})();
