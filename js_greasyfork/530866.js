// ==UserScript==
// @name         Watch9 Reconstruct (modified)
// @version      2024.07.24
// @description  Restores the old YouTube watch layout from before 2019. Works better with both 2016-2020 UI scripts and the Proper Description script.
// @author       Magma_Craft (originally by Aubrey P.)
// @icon         https://www.youtube.com/favicon.ico
// @namespace    Magma_Craft (originally by aubymori)
// @license      Unlicense
// @match        *://www.youtube.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/530866/Watch9%20Reconstruct%20%28modified%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530866/Watch9%20Reconstruct%20%28modified%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Watch9 Reconstruct script loaded successfully.");

    // Example: Modify the layout of the video player
    function restoreOldLayout() {
        const targetElement = document.querySelector('#player-container');
        if (targetElement) {
            targetElement.style.maxWidth = '640px'; // Example modification
        }
    }

    // Observe DOM for changes and apply modifications
    const observer = new MutationObserver(() => {
        restoreOldLayout();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
