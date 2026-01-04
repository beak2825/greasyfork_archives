// ==UserScript==
// @name         Hide Twitch React Button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide the react button on Twitch
// @author       Welshdroo
// @match        https://www.twitch.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484957/Hide%20Twitch%20React%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/484957/Hide%20Twitch%20React%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the page to load
    window.addEventListener('load', function() {
        // Function to hide the react button
        function hideReactButton() {
            // Find the react button by class name and hide it
            var reactButton = document.querySelector('.ScCoreButton-sc-ocjdkq-0.ScCoreButtonText-sc-ocjdkq-3');
            if (reactButton) {
                reactButton.style.display = 'none';
            }
        }

        // Run the function initially
        hideReactButton();

        // Set up an observer to handle dynamic changes in the DOM
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // Run the function whenever the DOM changes
                hideReactButton();
            });
        });

        // Configuration of the observer
        var config = { attributes: true, childList: true, subtree: true };

        // Start observing the target node for configured mutations
        observer.observe(document.body, config);
    });
})();
