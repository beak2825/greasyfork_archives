// ==UserScript==
// @name         Remove Citation Machine Ad
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove the Citation Machine ad overlay
// @author       Log4Jake
// @match        https://www.citationmachine.net/*
// @grant        none
// @license GNU General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/485099/Remove%20Citation%20Machine%20Ad.user.js
// @updateURL https://update.greasyfork.org/scripts/485099/Remove%20Citation%20Machine%20Ad.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove the ad element
    function removeAdElement() {
        var adElements = document.querySelectorAll('div[style*="position: fixed; z-index: 9999; display: flex; flex-direction: column;"]');
        adElements.forEach(function(adElement) {
            adElement.remove();
        });
    }

    // Remove the ad element when the page initially loads
    removeAdElement();

    // Use a MutationObserver to monitor changes to the DOM
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                removeAdElement();
            }
        });
    });

    // Configure and start the observer
    var config = { childList: true, subtree: true };
    observer.observe(document.body, config);
})();
