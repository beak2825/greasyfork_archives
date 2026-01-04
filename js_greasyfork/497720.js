// ==UserScript==
// @name         Format Number with Thousand Separators
// @namespace    http://your.unique.namespace
// @version      1.0
// @description  Formats numbers with thousand separators in elements with classes starting with "positiveValue" or "negativeValue"
// @match        *://*/*
// @downloadURL https://update.greasyfork.org/scripts/497720/Format%20Number%20with%20Thousand%20Separators.user.js
// @updateURL https://update.greasyfork.org/scripts/497720/Format%20Number%20with%20Thousand%20Separators.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener("DOMContentLoaded", function() {
        // Select elements whose class starts with "positiveValue" or "negativeValue"
        const elements = document.querySelectorAll('[class^="positiveValue"], [class^="negativeValue"]');
        
        elements.forEach(element => {
            // Get the text content
            let text = element.textContent;

            // Extract the numeric part
            let number = parseFloat(text.replace(/[^\d.-]/g, ''));

            // Format the number with thousand separators
            let formattedNumber = number.toLocaleString();

            // Add back the VND part if necessary
            let formattedText = formattedNumber + " VND";

            // Update the element's content
            element.textContent = formattedText;
        });
    });
})();
