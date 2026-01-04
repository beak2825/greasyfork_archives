// ==UserScript==
// @name         Javatpoint Remove Ads
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove ads from javatpoint and enjoy
// @author       LegendX NxM
// @match        https://www.javatpoint.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519594/Javatpoint%20Remove%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/519594/Javatpoint%20Remove%20Ads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Specify the class name of the div you want to remove
    const classNameToRemove = '_ap_apex_ad';
    const classNameToRemove2 = 'adp_interactive_ad'// Change this to your target class name

    // Function to remove div elements with the specified class name
    function removeDivByClass(className) {
        const divs = document.querySelectorAll(`div.${className}`);
        divs.forEach(div => div.remove());
        console.log(`Removed divs with class name: ${className}`);
    }

    // Function to observe changes in the DOM and remove divs when they are added
    function observeDOMChanges() {
        const observer = new MutationObserver(() => {
            removeDivByClass(classNameToRemove);
            removeDivByClass(classNameToRemove2);
        });

        // Start observing the document body for child node changes
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Initial removal of existing divs
        removeDivByClass(classNameToRemove);
    }

    // Run the observer function
    observeDOMChanges();
})();