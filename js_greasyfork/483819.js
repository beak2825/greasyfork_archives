// ==UserScript==
// @name         YouTube Distraction Blocker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Block distractions on YouTube including lazy-loaded elements
// @author       Markus Dietl
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483819/YouTube%20Distraction%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/483819/YouTube%20Distraction%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove an element by its class name
    function removeElementsByClass(className){
        const elements = document.getElementsByClassName(className);
        while(elements.length > 0){
            elements[0].parentNode.removeChild(elements[0]);
        }
    }

    // Function to remove an element by its ID
    function removeElementById(id){
        const element = document.getElementById(id);
        if (element) {
            element.parentNode.removeChild(element);
        }
    }

    // Create a mutation observer to monitor the DOM for changes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                // Check and remove elements each time new nodes are added
                removeElementsByClass('ytd-watch-next-secondary-results-renderer'); // Example class, adjust as needed
                removeElementsByClass('ytd-comments'); // Example class, adjust as needed
                // Add more elements you want to hide here
            }
        });
    });

    // Start observing the document body for DOM changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
