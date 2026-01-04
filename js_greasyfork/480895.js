// ==UserScript==
// @name        Autoplay fmspins.com
// @namespace   Violentmonkey Scripts
// @match       https://*.fmspins.com/
// @grant       none
// @version     1.1
// @author      -
// @description 2023-11-27, 9:49:39 a.m.
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480895/Autoplay%20fmspinscom.user.js
// @updateURL https://update.greasyfork.org/scripts/480895/Autoplay%20fmspinscom.meta.js
// ==/UserScript==


window.addEventListener('load', function() {
    // Wait for the page to fully load
    var streamButton = document.querySelector('button.stream-button');
    var playerDiv = document.getElementById('player');

    if (streamButton && playerDiv) {
        // Check if both the button and the player div are found on the page
        streamButton.click();
        playerDiv.classList.add('jp-state-playing','jp-state-seeking');
    }
});