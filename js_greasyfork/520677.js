// ==UserScript==
// @name         Enable Disabled Checkbox
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Позволяющий включить неактивный чекбокс 18+ на Rutube Studio.
// @author       Your Name
// @match        studio.rutube.ru/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520677/Enable%20Disabled%20Checkbox.user.js
// @updateURL https://update.greasyfork.org/scripts/520677/Enable%20Disabled%20Checkbox.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to enable the checkbox
    function enableCheckbox() {
        // Target the checkbox using its class and name attributes
        const checkboxWrapper = document.querySelector('.freyja_pen-checkbox__pen-checkbox_disabled_ImtFI');
        const checkbox = document.querySelector('input[name="adult"][id="adult"]');

        if (checkboxWrapper && checkbox) {
            // Remove the 'disabled' class and enable the checkbox
            checkboxWrapper.classList.remove('freyja_pen-checkbox__pen-checkbox_disabled_ImtFI');
            checkbox.removeAttribute('disabled');
            console.log('Checkbox enabled!');
        }
    }

    // Create a MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            enableCheckbox();
        });
    });

    // Start observing the document body
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial check in case the element is already loaded
    enableCheckbox();
})();