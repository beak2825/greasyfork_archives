// ==UserScript==
// @name         ReHike Fixes 4 SYTARB
// @namespace    http://tampermonkey.net/
// @author       wavypurples
// @version      1.0
// @description  Hides the .player-unavailable element on age-restricted videos
// @icon         https://www.youtube.com/favicon.ico
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509512/ReHike%20Fixes%204%20SYTARB.user.js
// @updateURL https://update.greasyfork.org/scripts/509512/ReHike%20Fixes%204%20SYTARB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check and hide the player-unavailable element
    function hidePlayerUnavailable() {
        const messageElement = document.querySelector('.player-unavailable .content .message');
        if (messageElement && messageElement.textContent.trim() === "Sorry, this content is age-restricted") {
            const playerUnavailable = document.querySelector('.player-unavailable');
            if (playerUnavailable) {
                playerUnavailable.style.display = 'none';
            }
        }
    }

    // Run the function initially
    hidePlayerUnavailable();

    // Observe for changes to dynamically loaded content
    const observer = new MutationObserver(hidePlayerUnavailable);
    observer.observe(document.body, { childList: true, subtree: true });
})();
