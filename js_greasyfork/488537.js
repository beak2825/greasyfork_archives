// ==UserScript==
// @name        Hides muted DMs from Discord
// @namespace   Violentmonkey Scripts
// @match       https://discordapp.com/*
// @match       https://discord.com/*
// @grant       none
// @version     1.0.2
// @license     MIT
// @author      Hifumi73
// @description 2024/02/28, 14:26:43
// @downloadURL https://update.greasyfork.org/scripts/488537/Hides%20muted%20DMs%20from%20Discord.user.js
// @updateURL https://update.greasyfork.org/scripts/488537/Hides%20muted%20DMs%20from%20Discord.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove elements where class attributes contain specific patterns
    let removeDynamicClassElements = function() {
        // Select all div elements as a starting point
        let allDivs = document.querySelectorAll("div");
        allDivs.forEach(elem => {
            // Check if element's class contains 'layout' and 'muted'
            if (elem.className.includes('layout') && elem.className.includes('muted')) {
                elem.remove(); // Remove the element if it matches the criteria
            } else if (elem.className.includes('interactive') && elem.className.includes('muted')) {
                // Additional condition to target 'interactive' and 'muted' elements
                elem.remove();
            }
        });
    };

    // Initially remove all matching elements
    removeDynamicClassElements();

    // MutationObserver to watch for added nodes and remove them if they match
    let mutationObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(currentValue) {
                if (currentValue.nodeType == Node.ELEMENT_NODE) {
                    // Check new nodes and remove matching elements
                    removeDynamicClassElements();
                }
            });
        });
    });

    // Start observing
    mutationObserver.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();

