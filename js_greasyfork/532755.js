// ==UserScript==
// @name         Toggle dark mode with Ctrl+Shift+D
// @namespace    https://github.com/yookibooki/userscripts
// @description  Toggles dark mode with Ctrl+Shift+D.
// @version      1.0
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/532755/Toggle%20dark%20mode%20with%20Ctrl%2BShift%2BD.user.js
// @updateURL https://update.greasyfork.org/scripts/532755/Toggle%20dark%20mode%20with%20Ctrl%2BShift%2BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'universal-dark-mode-enabled';
    const CSS_CLASS = 'universal-dark-mode-active';

    GM_addStyle(`
        html {
            transition: filter 0.3s ease !important;
            min-height: 100vh !important;
        }

        .${CSS_CLASS} img,
        .${CSS_CLASS} video,
        .${CSS_CLASS} iframe,
        .${CSS_CLASS} canvas {
            filter: invert(1) hue-rotate(180deg) !important;
        }

        .${CSS_CLASS}::selection {
            background: #fff !important;
            color: #000 !important;
        }
    `);

    function toggleDarkMode() {
        const html = document.documentElement;
        const isActive = html.classList.toggle(CSS_CLASS);
        GM_setValue(STORAGE_KEY, isActive);
    }

    function handleShortcut(e) {
        if (e.ctrlKey && e.shiftKey && e.keyCode === 68) { // Ctrl+Shift+D
            toggleDarkMode();
            e.preventDefault();
            e.stopPropagation();
        }
    }

    if (GM_getValue(STORAGE_KEY, false)) {
        document.documentElement.classList.add(CSS_CLASS);
    }

    document.addEventListener('keydown', handleShortcut, true);
    const style = document.createElement('style');
    style.textContent = `
        .${CSS_CLASS} {
            filter: invert(1) hue-rotate(180deg) !important;
            background: #fff !important; /* Create inversion base */
        }
    `;
    document.head.appendChild(style);
})();