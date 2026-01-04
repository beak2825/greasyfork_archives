// ==UserScript==
// @name         qqzw
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Detects when toast-container appears and has children
// @match        *://csgobig.com/*
// @run-at       document-idle
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542318/qqzw.user.js
// @updateURL https://update.greasyfork.org/scripts/542318/qqzw.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('✅ Userscript started');

    function checkToastContainer() {
        const toastContainer = document.querySelector('toast-container');
        if (toastContainer && toastContainer.children.length > 0) {
            console.log('🔔 toast-container detected with children:', toastContainer.children.length);
            return true;
        }
        return false;
    }

    const observer = new MutationObserver(() => {
        if (checkToastContainer()) {
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('hashchange', () => {
        console.log('🔄 Hash changed:', location.hash);
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();
