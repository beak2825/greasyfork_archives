// ==UserScript==
// @name         YouTube Mobile Autoplay (Firefox Android)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Simulate a click on the play button because m.youtube.com on Firefox for Android does not automatically play videos on page-load. Be sure to have Autoplay for Video and Audio enabled in the Browsersettings.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @author       Agreasyforkuser
// @match        https://m.youtube.com/watch?v=*
// @match        https://m.youtube.com/shorts/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/525585/YouTube%20Mobile%20Autoplay%20%28Firefox%20Android%29.user.js
// @updateURL https://update.greasyfork.org/scripts/525585/YouTube%20Mobile%20Autoplay%20%28Firefox%20Android%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Wait for the DOM to be fully loaded
    window.addEventListener('load', function() {
            // Select the play button
            const playerElement = document.querySelector('.ytp-large-play-button');
            if (playerElement) {
                // Simulate a click event on the .player-container element
                playerElement.click();
             }
    });
})();