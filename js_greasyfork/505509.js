// ==UserScript==
// @name         0.1% Chance Total Deletion
// @namespace    Fists
// @version      1.0
// @description  Gives a 0.1% chance to delete anything on the page, including elements, text nodes, comments, and attributes.
// @author       Fists
// @license      CC BY 4.0; https://creativecommons.org/licenses/by/4.0/
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505509/01%25%20Chance%20Total%20Deletion.user.js
// @updateURL https://update.greasyfork.org/scripts/505509/01%25%20Chance%20Total%20Deletion.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to attempt deletion of any node
    function tryDeleteNode(node) {
        if (Math.random() < 0.001) { // 0.1% chance
            if (node.nodeType === Node.ATTRIBUTE_NODE) {
                node.ownerElement.removeAttribute(node.name);
                console.log('Attribute deleted:', node.name, 'from element:', node.ownerElement);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                node.remove();
                console.log('Element deleted:', node);
            } else if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.COMMENT_NODE) {
                node.remove();
                console.log('Text or comment node deleted:', node);
            }
        }
    }

    // Observer to watch for new elements, attributes, and nodes being added or modified in the DOM
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            // Try to delete the target node (if it's an attribute)
            if (mutation.type === 'attributes') {
                tryDeleteNode(mutation.target.attributes.getNamedItem(mutation.attributeName));
            }
            // Try to delete newly added nodes
            mutation.addedNodes.forEach(node => tryDeleteNode(node));
        });
    });

    // Configuration to observe attributes, child nodes, and text content
    observer.observe(document.documentElement, {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true
    });

    // Initial pass to try deleting elements, text nodes, comments, and attributes that are already loaded
    const allNodes = document.querySelectorAll('*');
    allNodes.forEach(element => {
        // Try to delete the element itself
        tryDeleteNode(element);
        // Try to delete each attribute of the element
        Array.from(element.attributes).forEach(attr => tryDeleteNode(attr));
        // Try to delete text nodes and comments within the element
        element.childNodes.forEach(child => tryDeleteNode(child));
    });
})();
