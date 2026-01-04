// ==UserScript==
// @name         Remove premium on Quizlet
// @namespace    https://bibekchandsah.com.np
// @version      1.0
// @description  Removes the "You've reached your limit of free solutions for this book" and blurred part in quizlet
// @author       Bibek
// @match        https://quizlet.com/*
// @grant        none
// @icon         https://quizlet.com/_next/static/media/q-twilight.e27821d9.png
// @license      https://bibekchandsah.com.np
// @downloadURL https://update.greasyfork.org/scripts/500266/Remove%20premium%20on%20Quizlet.user.js
// @updateURL https://update.greasyfork.org/scripts/500266/Remove%20premium%20on%20Quizlet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to apply styles based on class presence
    function applyStylesBasedOnClassPresence() {
        try {
            // Check for class "b1xkd811"
            var elementsB1xkd811 = document.querySelectorAll('.b1xkd811');
            elementsB1xkd811.forEach(function(element) {
                element.style.filter = 'blur(0rem)';
            });

            // Check for class "pfdaoy0"
            var elementsPfdaoy0 = document.querySelectorAll('.pfdaoy0');
            elementsPfdaoy0.forEach(function(element) {
                element.style.display = 'none';
            });
        } catch (error) {
            console.error('Error applying styles:', error);
        }
    }

    // Interval function to continuously check and apply styles
    setInterval(applyStylesBasedOnClassPresence, 1000); // Check every 1000 milliseconds (1 second)

})();
