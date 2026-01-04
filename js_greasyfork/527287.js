// ==UserScript==
// @name         Always Show Copy and Edit Buttons
// @namespace    http://tampermonkey.net/
// @version      0.3
// @license MIT
// @description  Make copy and edit buttons always visible on Lambda Chat
// @match        https://lambda.chat/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527287/Always%20Show%20Copy%20and%20Edit%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/527287/Always%20Show%20Copy%20and%20Edit%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to modify buttons visibility
    function makeButtonsVisible() {
        // Select all copy button containers
        const copyButtons = document.querySelectorAll('.invisible.md\\:group-hover\\:visible');
        
        // Select all edit/branch buttons with the specific classes
        const editButtons = document.querySelectorAll('.group-hover\\:block.md\\:hidden');

        // Make copy buttons visible
        copyButtons.forEach(button => {
            button.classList.remove('invisible');
            button.classList.add('visible');
            button.style.opacity = '1';
        });

        // Make edit buttons visible
        editButtons.forEach(button => {
            button.classList.remove('md:hidden');
            button.style.display = 'block';
            // Remove group-hover:block since we want it always visible
            button.classList.remove('group-hover:block');
        });
    }

    // Run initially
    makeButtonsVisible();

    // Create observer to handle dynamically added buttons
    const observer = new MutationObserver(() => {
        makeButtonsVisible();
    });

    // Start observing the document for added nodes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();