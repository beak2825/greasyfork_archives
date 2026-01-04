// ==UserScript==
// @name         Change Color Code on Vanced YouTube apt 2
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Changes color code on Vanced YouTube website.
// @author       You
// @match        https://vanced-youtube.neocities.org/2011/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471077/Change%20Color%20Code%20on%20Vanced%20YouTube%20apt%202.user.js
// @updateURL https://update.greasyfork.org/scripts/471077/Change%20Color%20Code%20on%20Vanced%20YouTube%20apt%202.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function replaceColorCodes() {
        // Define the color code to be replaced and its replacement
        var originalColor = "#2200c1";
        var newColor = "#666";

        // Find all elements with the original color and replace it with the new color
        var elements = document.querySelectorAll('[style*="' + originalColor + '"]');
        elements.forEach(function(element) {
            element.style.cssText = element.style.cssText.replace(new RegExp(originalColor, "g"), newColor);
        });
    }

    // Create a MutationObserver to detect changes in the DOM and apply the replacement
    var observer = new MutationObserver(function(mutationsList, observer) {
        replaceColorCodes();
    });

    // Start observing changes in the entire document and its subtree
    observer.observe(document, { subtree: true, childList: true });
})();
