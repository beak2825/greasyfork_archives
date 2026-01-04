// ==UserScript==
// @name         NoTranslate auto enable
// @namespace    http://tampermonkey.net/
// @license      Apache-2.0 license
// @version      1.0
// @description  Remove the "notranslate" class from all elements and add "notranslate" to elements with class containing "code"
// @author       LorisYounger
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494056/NoTranslate%20auto%20enable.user.js
// @updateURL https://update.greasyfork.org/scripts/494056/NoTranslate%20auto%20enable.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove notranslate class
    function removeNotranslate(node) {
        if (node.nodeType === 1 && node.classList && node.classList.contains('notranslate')) {
            node.classList.remove('notranslate');
        }
        Array.from(node.children).forEach(removeNotranslate);
    }

    // Function to add notranslate class to elements with class containing 'code'
    function addNotranslateToCode(node) {
        if (node.nodeType === 1 && node.classList && /.*code.*/.test(node.className) && !node.classList.contains('notranslate')) {
            node.classList.add('notranslate');
        }
        Array.from(node.children).forEach(addNotranslateToCode);
    }

    // Initial processing
    removeNotranslate(document.body);
    addNotranslateToCode(document.body);

    // Create a MutationObserver instance to handle dynamic content
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) {
                        removeNotranslate(node);
                        addNotranslateToCode(node);
                    }
                });
            } else if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                let oldClass = mutation.oldValue;
                let newClass = mutation.target.className;

                if (/.*code.*/.test(newClass) && !/.*code.*/.test(oldClass)) {
                    addNotranslateToCode(mutation.target);
                } else if (!/.*code.*/.test(newClass) && /.*code.*/.test(oldClass)) {
                    removeNotranslate(mutation.target);
                }

                if (newClass.includes('notranslate') && !oldClass.includes('notranslate')) {
                    addNotranslateToCode(mutation.target);
                } else if (!newClass.includes('notranslate') && oldClass.includes('notranslate')) {
                    removeNotranslate(mutation.target);
                }
            }
        });
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, { attributes: true, attributeOldValue: true, childList: true, subtree: true });
})();
