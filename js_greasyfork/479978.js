// ==UserScript==
// @name         Element Hider for The Indian Express and The Hindu
// @namespace    http://greasyfork.org/
// @version      0.8
// @description  Hides ad placeholders and empty ads on The Indian Express and The Hindu
// @author       Todo Pertin
// @match        https://indianexpress.com/*
// @match        https://www.thehindu.com/*
// @license      GNU GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479978/Element%20Hider%20for%20The%20Indian%20Express%20and%20The%20Hindu.user.js
// @updateURL https://update.greasyfork.org/scripts/479978/Element%20Hider%20for%20The%20Indian%20Express%20and%20The%20Hindu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add the class names and ID of elements you want to hide in the arrays below
    const elementsToHide = [
        'osv-ad-class',
        'ie-int-campign-ad',
        'adboxtop',
        'add-first',
        'OMIDYAR_HOME_EVENTS'
    ];

    const idsToHide = [
        'articledivrec'
    ];

    function hideElements() {
        // Hide elements by class name
        elementsToHide.forEach(className => {
            const elements = document.getElementsByClassName(className);
            for (const element of elements) {
                element.style.display = 'none';
            }
        });

        // Hide elements by ID
        idsToHide.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = 'none';
            }
        });
    }

    // Run the function when the DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', hideElements);
    } else {
        hideElements();
    }
})();