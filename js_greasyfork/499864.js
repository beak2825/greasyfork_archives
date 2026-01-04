// ==UserScript==
// @name         Hide Go+ Songs on SoundCloud by Slyceth
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Hide songs that are locked behind Go+ from SoundCloud
// @author       Your Name
// @match        https://soundcloud.com/*
// @icon         https://www.google.com/s2/favicons?domain=soundcloud.com
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/499864/Hide%20Go%2B%20Songs%20on%20SoundCloud%20by%20Slyceth.user.js
// @updateURL https://update.greasyfork.org/scripts/499864/Hide%20Go%2B%20Songs%20on%20SoundCloud%20by%20Slyceth.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide Go+ tracks
    function hideGoPlusTracks() {
        // Select all play buttons that are marked as unavailable
        const unavailableButtons = document.querySelectorAll('a.sc-button-play.sc-button-disabled[title="Unavailable"]');

        unavailableButtons.forEach(button => {
            // Traverse up the DOM to find the parent container of the track
            let trackContainer = button.closest('li.searchList__item');
            if (!trackContainer) {
                // Try to find the closest track container in case the DOM structure is different
                trackContainer = button.closest('div.soundList__item');
            }
            if (trackContainer) {
                trackContainer.style.display = 'none';
            }
        });
    }

    // Run the function initially
    hideGoPlusTracks();

    // Create an observer to monitor DOM changes and hide Go+ tracks dynamically
    const observer = new MutationObserver(hideGoPlusTracks);

    observer.observe(document.body, { childList: true, subtree: true });
})();
