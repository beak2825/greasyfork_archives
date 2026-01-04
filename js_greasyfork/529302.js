// ==UserScript==
// @name         Google AI Studio, Fix Google Symbols Rendering for Opera
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Selective font and text replacement for Material Symbols
// @author       TheDerevtso
// @match        https://aistudio.google.com/*
// @grant        GM_addStyle
// @run-at       document-body
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529302/Google%20AI%20Studio%2C%20Fix%20Google%20Symbols%20Rendering%20for%20Opera.user.js
// @updateURL https://update.greasyfork.org/scripts/529302/Google%20AI%20Studio%2C%20Fix%20Google%20Symbols%20Rendering%20for%20Opera.meta.js
// ==/UserScript==
     
(function() {
    'use strict';
 
    GM_addStyle(`
        /* Base rule for Material Symbols */
        .material-symbols-outlined:not(.ng-star-inserted):not(.item-about) {
            font-family: 'Material Symbols Outlined' !important;
        }
 
        /* Exception for specific nested structure */
        .ng-star-inserted .item-about .material-symbols-outlined {
            font-family: 'Google Symbols' !important;
        }
 
        /* Handling elements with ng-star-inserted */
        .material-symbols-outlined.ng-star-inserted:not(.item-about) {
            font-family: 'Material Symbols Outlined' !important;
        }
    `);
 
    const replacements = [
        {
            selector: '.save-button .material-symbols-outlined',
            closest: '.save-button',
            oldText: 'drive',
            newText: 'add_to_drive',
            replaced: false
        },
        {
            selector: 'a[aria-label="Create Prompt"] .material-symbols-outlined',
            closest: 'a[aria-label="Create Prompt"]',
            oldText: 'chat_spark',
            newText: 'add_comment',
            replaced: false
        }
    ];
 
    const closestSelectors = replacements.map(item => item.closest).join(', ');
 
    function processReplacements() {
        let allReplaced = true;
        replacements.forEach(repl => {
            if (!repl.replaced) {
                document.querySelectorAll(repl.selector).forEach(icon => {
                    if (icon.textContent.trim() === repl.oldText) {
                        icon.textContent = repl.newText;
                        repl.replaced = true;
                    }
                });
            }
            if (!repl.replaced) allReplaced = false;
        });
        return allReplaced;
    }
 
    // Optimized MutationObserver
    new MutationObserver((mutations,observer) => {
        mutations.forEach(mutation => {
            if (mutation.target.closest(closestSelectors)) {
                if (processReplacements()) {
                    observer.disconnect(); // Stop observing after all replacements
                }
            }
        });
    }).observe(document.body, {
        childList: true,
        subtree: true
    });
 
})();