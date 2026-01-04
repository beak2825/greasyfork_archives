// ==UserScript==
// @name         Change Color Code on Vanced YouTube
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Changes color code on Vanced YouTube website.
// @author       You
// @match        https://vanced-youtube.neocities.org/2011/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471076/Change%20Color%20Code%20on%20Vanced%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/471076/Change%20Color%20Code%20on%20Vanced%20YouTube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function replaceColorCodes() {
        // Define the color code to be replaced and its replacement
        var originalColor = "#2200c1";
        var newColor = "#666";

        // Get all elements on the page
        var allElements = document.getElementsByTagName("*");

        // Loop through each element and check for style attribute
        for (var i = 0; i < allElements.length; i++) {
            var element = allElements[i];

            // Check if the element has a style attribute and contains the original color
            if (element.hasAttribute("style") && element.style.cssText.indexOf(originalColor) !== -1) {
                // Replace the original color with the new color
                element.style.cssText = element.style.cssText.replace(new RegExp(originalColor, "g"), newColor);
            }
        }
    }

    // Call the function to replace color codes when the page has loaded
    window.addEventListener("load", function() {
        replaceColorCodes();
    });
})();
