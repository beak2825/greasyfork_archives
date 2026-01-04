// ==UserScript==
// @name         Hide Omlet Plus Button and Mask
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  Hide the Omlet Plus button and mask on the streaming page
// @match        https://*.omlet.gg/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463500/Hide%20Omlet%20Plus%20Button%20and%20Mask.user.js
// @updateURL https://update.greasyfork.org/scripts/463500/Hide%20Omlet%20Plus%20Button%20and%20Mask.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Find the button element by its class name
    var button = document.querySelector('.btn');

    // Set its display style to none to hide it
    button.style.display = 'none';

    // Find the mask element by its class name
    var mask = document.querySelector('.non-premium-mask');

    // Set its display style to none to hide it
    mask.style.display = 'none';

    // Create a new MutationObserver instance
    var observer = new MutationObserver(function(mutations) {
        // Loop through the mutations array
        for (var mutation of mutations) {
            // Check if the mutation is an attribute change
            if (mutation.type === 'attributes') {
                // Check if the mutation target is the button or the mask
                if (mutation.target === button || mutation.target === mask) {
                    // Set the display style to none again to hide it
                    mutation.target.style.display = 'none';
                }
            }
        }
    });

    // Select the body element as the target node
    var targetNode = document.body;

    // Specify the options for the observer
    var observerOptions = {
        attributes: true, // Observe attribute changes
        subtree: true // Observe changes in the descendants of the target node
    };

    // Start observing the target node
    observer.observe(targetNode, observerOptions);
})();