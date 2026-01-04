// ==UserScript==
// @name         Remove Specific Classes on The Initium
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove all classes starting with 'wkwp-' and 'wp-' from all elements on The Initium
// @author       Your Name
// @match        https://theinitium.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523450/Remove%20Specific%20Classes%20on%20The%20Initium.user.js
// @updateURL https://update.greasyfork.org/scripts/523450/Remove%20Specific%20Classes%20on%20The%20Initium.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Select all elements in the document
    const allElements = document.querySelectorAll('*');

    // Loop through each element
    allElements.forEach(element => {
        // Get the list of class names
        const classList = element.classList;

        // Create an array to hold classes to remove
        const classesToRemove = [];

        // Loop through each class name
        classList.forEach(className => {
            // Check if the class name starts with 'wkwp-' or 'wp-'
            if (className.startsWith('wkwp-') || className.startsWith('wp-')) {
                classesToRemove.push(className);
            }
        });

        // Remove the identified classes
        classesToRemove.forEach(className => {
            element.classList.remove(className);
        });
    });
})();
