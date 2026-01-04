// ==UserScript==
// @name         Fast Slots
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes the 'spinning' class from specified elements to adjust their behavior
// @author       Shlefter
// @match        https://cartelempire.online/Casino/Slots
// @downloadURL https://update.greasyfork.org/scripts/523707/Fast%20Slots.user.js
// @updateURL https://update.greasyfork.org/scripts/523707/Fast%20Slots.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // List of element IDs
    const elementIds = ['a', 'b', 'c'];

    // Loop through each element ID
    elementIds.forEach(id => {
        // Select the element by ID
        const element = document.querySelector(`#${id}`);

        // Check if the element exists
        if (element) {
            // Remove the "spinning" class
            element.classList.remove('spinning');
        }
    });
})();