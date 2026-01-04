// ==UserScript==
// @name         Remove Clarify Box on YouTube
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove the clarify box (election result) on YouTube pages.
// @author       Ken Teague
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517633/Remove%20Clarify%20Box%20on%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/517633/Remove%20Clarify%20Box%20on%20YouTube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove the clarify box
    function removeClarifyBox() {
        const clarifyBox = document.getElementById('clarify-box');
        if (clarifyBox) {
            clarifyBox.remove();
        }
    }

    // Run the function initially
    removeClarifyBox();

    // Observe the page for any changes to remove the clarify box if it appears
    const observer = new MutationObserver(removeClarifyBox);
    observer.observe(document.body, { childList: true, subtree: true });
})();
