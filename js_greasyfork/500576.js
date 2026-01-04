// ==UserScript==
// @license MIT
// @name        YATA travel desinationinator
// @namespace   Violentmonkey Scripts
// @match       https://yata.yt/faction/war/*
// @grant       none
// @version     1.0.1
// @author      -
// @description add travel destination to YATA war page
// @downloadURL https://update.greasyfork.org/scripts/500576/YATA%20travel%20desinationinator.user.js
// @updateURL https://update.greasyfork.org/scripts/500576/YATA%20travel%20desinationinator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to enable text wrap
    function enableTextWrap() {
        const elements = document.querySelectorAll('.text-start.player-status-blue');

        // Loop through each element
        elements.forEach(element => {
            const title = element.getAttribute('title');
            // Set the text content to the title attribute
            element.textContent = title;

            // Enable text wrapping
            element.style.whiteSpace = 'normal';
        });
    }

    // Observe changes in the DOM
    const observer = new MutationObserver(enableTextWrap);
    observer.observe(document.body, { subtree: true, childList: true });

    // Enable text wrap initially
    enableTextWrap();
})();