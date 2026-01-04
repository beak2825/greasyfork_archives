// ==UserScript==
// @name         timeclock punch unhider
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  unhides the text rendered on successful punch in/out
// @author       Eric Stanard
// @match        https://secure7.saashr.com/ta/6201879*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498374/timeclock%20punch%20unhider.user.js
// @updateURL https://update.greasyfork.org/scripts/498374/timeclock%20punch%20unhider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to modify the display type of the element
    function modifyElement() {
        const element = document.getElementById('infos');
        if (element) {
            console.log('Element found:', element);
            element.style.removeProperty('display');
        }
    }

    function addAutocomplete() {
        const inputElement = document.querySelector('input.editFormText[name="Badge"]');
        if (inputElement) {
            console.log('Input element found:', inputElement);
            inputElement.setAttribute('autocomplete', 'on');
        }
    }

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                for (const node of mutation.addedNodes) {
                    if (node.id === 'infos' || (node.querySelector && node.querySelector('#infos'))) {
                        console.log('Mutation detected:', node);
                        modifyElement();
                    }
                    if (node.matches && node.matches('input.editFormText[name="Badge"]') || (node.querySelector && node.querySelector('input.editFormText[name="Badge"]'))) {
                        console.log('Input element mutation detected:', node);
                        addAutocomplete();
                    }
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    modifyElement();
    addAutocomplete();
})();