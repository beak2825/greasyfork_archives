// ==UserScript==
// @name         Toggle ChatGPT Sidebar with Cmd+\
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Toggle the sidebar in ChatGPT using Command + Backslash
// @author       Drewby123
// @match        https://chatgpt.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529559/Toggle%20ChatGPT%20Sidebar%20with%20Cmd%2B%5C.user.js
// @updateURL https://update.greasyfork.org/scripts/529559/Toggle%20ChatGPT%20Sidebar%20with%20Cmd%2B%5C.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let sidebarButton = null;

    function updateSidebarButton() {
        const btn = document.querySelector('button[aria-label="Open sidebar"], button[aria-label="Close sidebar"]');
        if (btn) {
            sidebarButton = btn;
        }
    }

    const observer = new MutationObserver(() => {
        updateSidebarButton();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Listen for Command + \
    document.addEventListener('keydown', function (e) {
        if (e.metaKey && e.key === '\\') {
            e.preventDefault();
            if (sidebarButton) {
                sidebarButton.click();
            } else {
                console.warn('Sidebar toggle button not found');
            }
        }
    });
})();
