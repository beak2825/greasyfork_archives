// ==UserScript==
// @name         Sanfoundry Ads Remove
// @namespace    http://greasyfork.org/
// @version      0.1
// @description  Remove ads from sanfoundry and enjoy!
// @author       LegendX NxM
// @match        https://www.sanfoundry.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519568/Sanfoundry%20Ads%20Remove.user.js
// @updateURL https://update.greasyfork.org/scripts/519568/Sanfoundry%20Ads%20Remove.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Specify the class name of the div you want to remove
    const classNameToRemove = 'sf-desktop-ads';
    const classNameToRemove2 = 'google-auto-placed'
    const classNameToRemove3 = 'bottomStickyContainer'
    const classNameToRemove4 = 'adsbygoogle'
    // Change this to your target class name

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
            removeDivByClass(classNameToRemove3);
            removeDivByClass(classNameToRemove4);
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