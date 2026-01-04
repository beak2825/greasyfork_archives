// ==UserScript==
// @name         MyKCL Enhancement Suite
// @namespace    http://com.marsharbour.modulehider
// @version      1.0
// @license MIT
// @description  Enhancement Suite for the MyKCL website
// @match        https://mykcl.kcl.ac.uk/urd/sits.urd/run/*
// @match        https://mykcl.kcl.ac.uk/urd/sits.urd/run/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471063/MyKCL%20Enhancement%20Suite.user.js
// @updateURL https://update.greasyfork.org/scripts/471063/MyKCL%20Enhancement%20Suite.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if the current page has the title "Results Page"
    function isResultsPage() {
        return document.title.includes('View Module Results');
    }

    function addModuleHider() {
        // CSS Stylesheet
        const cssStyles = `
            table.gridtext.collapsed:not(.alignleft) tr:not(.modulerow) {
                display: none;
            }
        `;

        // Create the style element
        const styleElement = document.createElement('style');
        styleElement.innerHTML = cssStyles;
        document.head.appendChild(styleElement);
        styleElement.disabled = true;

        // Create the toggle button
        const toggleButton = document.createElement('button');
        toggleButton.textContent = 'Toggle Module Rows';

        // Find the <p> element with the ID "title"
        const titleElement = document.getElementById('title');

        if (titleElement) {
            // Append the toggle button to the after the title
            if (titleElement.nextElementSibling) {
                titleElement.parentNode.insertBefore(toggleButton, titleElement.nextElementSibling);
            } else {
                titleElement.parentNode.appendChild(toggleButton);
            }
        } else {
            // If the <p> element with the ID "title" is not found, append the toggle button to the body
            document.body.appendChild(toggleButton);
        }

        // Toggle the style element on button click
        toggleButton.addEventListener('click', function() {
            styleElement.disabled = !styleElement.disabled;
        });
    }

    // Add the style element and toggle button if on the results page
    function resultsPage() {
        addModuleHider()
    }

    function applyTweaks() {
        if (isResultsPage()) {
            resultsPage();
        }
    }

    applyTweaks()
})();
