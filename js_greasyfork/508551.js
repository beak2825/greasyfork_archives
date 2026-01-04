// ==UserScript==
// @name         Chapter Navigation using arrows in bcatranslation website
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Navigate to the next chapter when pressing the right arrow key
// @author       kleindev
// @match        *://bcatranslation.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bcatranslation.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508551/Chapter%20Navigation%20using%20arrows%20in%20bcatranslation%20website.user.js
// @updateURL https://update.greasyfork.org/scripts/508551/Chapter%20Navigation%20using%20arrows%20in%20bcatranslation%20website.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to handle the right arrow key press
    function handleKeyDown(event) {
        if (event.key === 'ArrowRight') {
            // Find the <p> tag containing the link with text "[Next chapter]"
            const paragraph = Array.from(document.querySelectorAll('p')).find(p =>
                p.querySelector('a') && p.querySelector('a').textContent.trim() === '[Next Chapter]'
            );

            if (paragraph) {
                // Get the <a> element within the found <p> tag
                const link = paragraph.querySelector('a');
                if (link) {
                    // Navigate to the href of the <a> tag
                    window.location.href = link.href;
                }
            }
        }
         if (event.key === 'ArrowLeft') {
            // Find the <p> tag containing the link with text "[Next chapter]"
            const paragraph = Array.from(document.querySelectorAll('p')).find(p =>
                p.querySelector('a') && p.querySelector('a').textContent.trim() === '[Previous Chapter]'
            );

            if (paragraph) {
                // Get the <a> element within the found <p> tag
                const link = paragraph.querySelector('a');
                if (link) {
                    // Navigate to the href of the <a> tag
                    window.location.href = link.href;
                }
            }
        }
    }

    // Attach the event listener to the document
    document.addEventListener('keydown', handleKeyDown);
})();
