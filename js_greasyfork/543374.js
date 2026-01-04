// ==UserScript==
// @name         Nettruyenvia Popup Remover
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically remove annoying popup from nettruyenvia.com
// @author       You
// @match        https://nettruyenvia.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nettruyenvia.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543374/Nettruyenvia%20Popup%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/543374/Nettruyenvia%20Popup%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait until the DOM is fully loaded
    const observer = new MutationObserver(() => {
        const popup = document.getElementById('_pop-nettruyenvia-81');
        if (popup) {
            popup.remove();
            console.log('Nettruyenvia popup removed.');
        }
    });

    // Observe DOM changes to catch dynamically added popups
    observer.observe(document.body, { childList: true, subtree: true });

    // Also remove immediately if already present
    const popup = document.getElementById('_pop-nettruyenvia-81');
    if (popup) {
        popup.remove();
        console.log('Nettruyenvia popup removed.');
    }
})();
