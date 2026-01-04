    // ==UserScript==
    // @name         YouTube Auto Theater Mode
    // @namespace    hhttps://www.youtube.com
    // @version      1.0.0
    // @description  Defaults to theatre mode
    // @author       Unbroken
    // @match        https://www.youtube.com/watch?*
    // @grant        none
    // @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/497131/YouTube%20Auto%20Theater%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/497131/YouTube%20Auto%20Theater%20Mode.meta.js
    // ==/UserScript==

(function() {
    'use strict';

    // Function to simulate the click event
    function simulateClick(element) {
        ['mouseover', 'mousedown', 'mouseup', 'click'].forEach(function(eventType) {
            var event = new MouseEvent(eventType, {
                bubbles: true,
                cancelable: true,
                view: window
            });
            element.dispatchEvent(event);
        });
    }

    // Wait for the page to load content dynamically if necessary
    window.addEventListener('load', function() {
        var firstButton = document.querySelector('button[title*="Theater mode"]');

        if (firstButton) {
            simulateClick(firstButton);
        } else {
            console.error('Theater Mode button not found!');
        }
    });
})();