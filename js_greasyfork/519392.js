// ==UserScript==
// @name         Disable Luscious Tooltips
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Disables tooltips on luscious.net
// @match        https://members.luscious.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519392/Disable%20Luscious%20Tooltips.user.js
// @updateURL https://update.greasyfork.org/scripts/519392/Disable%20Luscious%20Tooltips.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('initiated');
    function hideTooltips() {
        document.querySelectorAll('.o-tooltip-default').forEach(tooltip => {
            const grandparent = tooltip.parentElement.parentElement;
            if (grandparent) {
                grandparent.style.display = 'none';
            }
        });
    }

    // Run initially
    hideTooltips();

    // Observe DOM changes
    new MutationObserver(() => {
        hideTooltips();
    }).observe(document.body, { childList: true, subtree: true });
})();