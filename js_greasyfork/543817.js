// ==UserScript==
// @name         网页深色模式切换
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  按Ctrl+Alt+D快捷键切换网页深色模式
// @author       AI助手
// @match        *://*/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/543817/%E7%BD%91%E9%A1%B5%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/543817/%E7%BD%91%E9%A1%B5%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DARK_MODE_STYLE_ID = '__tampermonkey_dark_mode_style__';
    const STORAGE_KEY = 'darkModeEnabled';

    function applyDarkMode() {
        let style = document.getElementById(DARK_MODE_STYLE_ID);
        if (!style) {
            style = document.createElement('style');
            style.id = DARK_MODE_STYLE_ID;
            document.head.appendChild(style);
        }
        style.innerHTML = `
            html {
                filter: invert(1) hue-rotate(180deg);
            }
            body {
                background-color: #333;
            }
            img, video, .invert-exclude {
                filter: invert(1) hue-rotate(180deg);
            }
        `;
    }

    function removeDarkMode() {
        const style = document.getElementById(DARK_MODE_STYLE_ID);
        if (style) {
            style.remove();
        }
    }

    function toggleDarkMode() {
        const isEnabled = localStorage.getItem(STORAGE_KEY) === 'true';
        if (isEnabled) {
            removeDarkMode();
            localStorage.setItem(STORAGE_KEY, 'false');
        } else {
            applyDarkMode();
            localStorage.setItem(STORAGE_KEY, 'true');
        }
    }

    // 页面加载时检查并恢复深色模式状态
    if (localStorage.getItem(STORAGE_KEY) === 'true') {
        applyDarkMode();
    }

    document.addEventListener('keydown', function(e) {
        // Ctrl+Alt+D
        if (e.ctrlKey && e.altKey && !e.shiftKey && !e.metaKey && (e.key === 'd' || e.key === 'D')) {
            e.preventDefault();
            toggleDarkMode();
        }
    });

})();