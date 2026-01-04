// ==UserScript==
// @name         Global Element Deletion with Persistence
// @namespace    Fists
// @version      1.7
// @description  Delete elements globally with persistence across different pages and sites.
// @author       You
// @license      CC BY 4.0; https://creativecommons.org/licenses/by/4.0/
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505512/Global%20Element%20Deletion%20with%20Persistence.user.js
// @updateURL https://update.greasyfork.org/scripts/505512/Global%20Element%20Deletion%20with%20Persistence.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'deletedElements_v1';

    // Load stored selectors
    let deletedSelectors = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    // Function to delete elements by selector
    function deleteElementsBySelector(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => element.remove());
    }

    // Function to store a new selector
    function storeSelector(selector) {
        if (!deletedSelectors.includes(selector)) {
            deletedSelectors.push(selector);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(deletedSelectors));
        }
    }

    // Function to handle element deletion
    function handleElementDeletion(element) {
        const selector = getUniqueSelector(element);
        if (selector) {
            element.remove();
            storeSelector(selector);
            console.log('Element deleted and selector stored:', selector);
        }
    }

    // Function to get a unique selector for an element
    function getUniqueSelector(element) {
        if (element.id) {
            return `#${element.id}`;
        } else if (element.className) {
            return `.${element.className.trim().split(/\s+/).join('.')}`;
        } else {
            let path = [];
            while (element && element.nodeType === Node.ELEMENT_NODE) {
                let selector = element.nodeName.toLowerCase();
                if (element.id) {
                    selector += `#${element.id}`;
                    path.unshift(selector);
                    break;
                } else if (element.className) {
                    selector += `.${element.className.trim().split(/\s+/).join('.')}`;
                }
                path.unshift(selector);
                element = element.parentNode;
            }
            return path.join(' > ');
        }
    }

    // Observer to watch for added nodes
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE && Math.random() < 0.001) { // 0.1% chance
                    handleElementDeletion(node);
                }
            });
        });
    });

    // Start observing the document
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // Apply stored deletions on page load
    deletedSelectors.forEach(selector => deleteElementsBySelector(selector));

    // Initial pass to delete existing elements
    document.querySelectorAll('*').forEach(element => {
        if (Math.random() < 0.001) { // 0.1% chance
            handleElementDeletion(element);
        }
    });

})();
