// ==UserScript==
// @name         Arch-A
// @namespace    https://github.com/DevilGlitch/ArchA
// @version      A.3.5.6
// @description  A simplistic tampermonkey script that sends a highlighted piece of text to Google search or performs additional actions on Brainly.com question pages
// @author       TheLostMoon. (Brainly script from ExtraTankz & Gradyn Wursten)
// @license      MIT
// @match        https://course.apexlearning.com/*
// @match        https://brainly.com/question/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462354/Arch-A.user.js
// @updateURL https://update.greasyfork.org/scripts/462354/Arch-A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Google Search
    if (window.location.host === 'course.apexlearning.com') {
        let highlightedText = '';
        let container = null;

        window.addEventListener('mouseup', event => {
            console.log('Mouse up event detected');
            runArchA();
        });

        // Function to send the request to Google search and display the response
        function runArchA() {
            highlightedText = window.getSelection().toString();
            if (!highlightedText) return;

            // Replace spaces with plus signs
            const query = highlightedText.replace(/\s+/g, '+');

            const searchUrl = `https://www.google.com/search?q=${query}`;

            // Open the Google search in a new tab
            window.open(searchUrl);

            // Deselect the selected text
            window.getSelection().removeAllRanges();
        }
    }

    // Brainly.com Question Page
    if (window.location.host === 'brainly.com') {
        // Remove unwanted elements after DOMContentLoaded
        document.addEventListener('DOMContentLoaded', function() {
            const unwantedElements = [
                '.brn-expanded-bottom-banner',
                '.brn-brainly-plus-box',
                '.brn-fullscreen-toplayer',
                '.sg-overlay.sg-overlay--dark',
            ];

            unwantedElements.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) {
                    element.remove();
                }
            });
        });
    }
})();
