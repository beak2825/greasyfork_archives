// ==UserScript==
// @name        battlemetrics.com - Hide premium paywall in sessions tab
// @namespace   Violentmonkey Scripts
// @match       https://www.battlemetrics.com/players/*/sessions*
// @grant       none
// @version     1.0
// @author      A2R14N
// @description 1/1/2025, 1:41:36 PM
// @icon        https://pbs.twimg.com/profile_images/743255432475533317/UN1DsVsT_400x400.jpg
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522489/battlemetricscom%20-%20Hide%20premium%20paywall%20in%20sessions%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/522489/battlemetricscom%20-%20Hide%20premium%20paywall%20in%20sessions%20tab.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // Function to replace classes and hide elements
    function applyChanges() {
        document.querySelectorAll('.css-17b2eg9').forEach(el => {
            el.classList.replace('css-17b2eg9', 'css-s0orn');
        });

        document.querySelectorAll('.css-147krdi').forEach(el => {
            el.style.display = 'none';
        });

        // Hide elements with class 'css-18j87yw'
        document.querySelectorAll('.css-18j87yw').forEach(el => {
            el.style.display = 'none';
        });
    }

    // Observe DOM changes and apply changes when new content is added
    const observer = new MutationObserver(applyChanges);
    observer.observe(document.body, { childList: true, subtree: true });

    // Apply changes immediately on page load
    applyChanges();
})();