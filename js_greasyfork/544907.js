// ==UserScript==
// @name         Highlight folder unread count
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Highlighte Unread count on mail folders same way as on Inbox
// @match        https://mail.proton.me/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544907/Highlight%20folder%20unread%20count.user.js
// @updateURL https://update.greasyfork.org/scripts/544907/Highlight%20folder%20unread%20count.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Run after DOM is ready
    function removeWeakClass() {
        const weakItems = document.querySelectorAll('.navigation-counter-item--weak');
        weakItems.forEach(item => {
            item.classList.remove('navigation-counter-item--weak');
        });
    }

    // Run immediately and observe for dynamic content
    removeWeakClass();

    // Optional: Watch for new nodes being added (for dynamic content)
    const observer = new MutationObserver(() => {
        removeWeakClass();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();