// ==UserScript==
// @name         Gemini AI: toggle hiding static elements for seeing all AI output
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Press Ctrl+Shift+X to toggle visibility
// @author       Gemini 2.5 pro
// @match        https://gemini.google.com/app*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546038/Gemini%20AI%3A%20toggle%20hiding%20static%20elements%20for%20seeing%20all%20AI%20output.user.js
// @updateURL https://update.greasyfork.org/scripts/546038/Gemini%20AI%3A%20toggle%20hiding%20static%20elements%20for%20seeing%20all%20AI%20output.meta.js
// ==/UserScript==

(function() {
    'use strict';

   // This function finds and toggles the display style of the target elements.
    function toggleElementsVisibility() {
        // Find the <input-container> element.
        const inputContainer = document.querySelector('input-container');

       // Find the div whose class name ends with "GoogleBar".
        // The [class$="..."] is an attribute selector that matches a suffix.
        const googleBar = document.querySelector('div[class$="GoogleBar"]');

       // Toggle the <input-container> if it exists.
        if (inputContainer) {
            if (inputContainer.style.display === 'none') {
                // If it's hidden, show it. Reverting to an empty string
                // lets the browser use the default or stylesheet-defined display property.
                inputContainer.style.display = '';
            } else {
                // If it's visible, hide it.
                inputContainer.style.display = 'none';
            }
            console.log('Toggled visibility for <input-container>');
        } else {
            console.log('<input-container> not found on this page.');
        }

       // Toggle the "GoogleBar" div if it exists.
        if (googleBar) {
            if (googleBar.style.display === 'none') {
                // If it's hidden, show it.
                googleBar.style.display = '';
            } else {
                // If it's visible, hide it.
                googleBar.style.display = 'none';
            }
            console.log('Toggled visibility for GoogleBar element');
        } else {
            console.log('Element with class ending in "GoogleBar" not found.');
        }
    }

   // Listen for keydown events on the whole document.
    document.addEventListener('keydown', function(event) {
        // Check if the key combination is Ctrl+Shift+X.
        // We check the 'key' property for "X" (case-insensitive check is good practice).
        if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'x') {
            // Prevent the default browser action for this key combination, if any.
            event.preventDefault();

           // Call our main function.
            toggleElementsVisibility();
        }
    });
})();
