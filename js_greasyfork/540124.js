// ==UserScript==
// @name         Google Classroom Dark Mode
// @namespace    https://greasyfork.org/users/saurabhsharma
// @version      1.2
// @description  Always-on dark mode for Google Classroom with SPA support and refined colors for better readability and contrast
// @author       Saurabh Sharma
// @license      MIT
// @match        https://classroom.google.com/*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=classroom.google.com
// @grant        GM_addStyle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/540124/Google%20Classroom%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/540124/Google%20Classroom%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const darkModeCSS = `
        html.dark-mode, body.dark-mode {
            filter: invert(1) hue-rotate(180deg) !important;
            background: #111 !important;
        }
        html.dark-mode img,
        html.dark-mode video,
        html.dark-mode svg,
        body.dark-mode img,
        body.dark-mode video,
        body.dark-mode svg {
            filter: invert(1) hue-rotate(180deg) !important;
        }
        /* Prevent double inversion for icons inside buttons, etc. */
        html.dark-mode [style*="background-image"],
        body.dark-mode [style*="background-image"] {
            filter: none !important;
        }
    `;

    function waitForHeadAndInjectCSS() {
        if (document.getElementById('gc-dark-mode-style')) return;
        if (document.head) {
            injectCSS();
        } else {
            setTimeout(waitForHeadAndInjectCSS, 50);
        }
    }

    function applyDarkMode() {
        document.documentElement.classList.add('dark-mode');
    }

    function injectCSS() {
        if (document.getElementById('gc-dark-mode-style')) return;
        if (typeof GM_addStyle !== 'undefined') {
            GM_addStyle(darkModeCSS);
        } else {
            const style = document.createElement('style');
            style.id = 'gc-dark-mode-style';
            style.textContent = darkModeCSS;
            (document.head || document.documentElement).appendChild(style);
        }
    }

    function setupObserver() {
        if (window.gcDarkModeObserver) return;
        let timeout = null;
        const observer = new MutationObserver(() => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                applyDarkMode();
                waitForHeadAndInjectCSS();
            }, 100);
        });
        window.gcDarkModeObserver = observer;
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    function setupUrlChangeDetection() {
        if (window.gcDarkModeUrlDetection) return;
        window.gcDarkModeUrlDetection = true;
        if (window.navigation && window.navigation.addEventListener) {
            window.navigation.addEventListener('navigate', () => setTimeout(setup, 100));
        } else {
            let lastUrl = location.href;
            setInterval(() => {
                if (lastUrl !== location.href) {
                    lastUrl = location.href;
                    setTimeout(setup, 100);
                }
            }, 500);
        }
    }

    function setup() {
        applyDarkMode();
        waitForHeadAndInjectCSS();
        setupObserver();
    }

    (function init() {
        waitForHeadAndInjectCSS();
        applyDarkMode();
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setup();
                setupUrlChangeDetection();
            });
        } else {
            setup();
            setupUrlChangeDetection();
        }
        setTimeout(setup, 1000);
        setTimeout(setup, 3000);
    })();
})();
