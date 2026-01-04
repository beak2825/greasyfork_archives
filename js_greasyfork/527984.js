// ==UserScript==
// @name         Convert Buddhist Era to Anno Domini
// @namespace    http://tampermonkey.net/
// @version      1.03
// @description  Converts Buddhist Era (BE) years to AD years, avoiding editable fields
// @author       Drewby123
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527984/Convert%20Buddhist%20Era%20to%20Anno%20Domini.user.js
// @updateURL https://update.greasyfork.org/scripts/527984/Convert%20Buddhist%20Era%20to%20Anno%20Domini.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function convertBEtoAD(text) {
        return text.replace(/(\d{4})\s?BE/g, (match, year) => `${year - 543}`);
    }

    function processTextNodes(node) {
        if (
            node.nodeType === Node.TEXT_NODE &&
            !node.parentElement.closest('input, textarea, [contenteditable="true"]')
        ) {
            node.textContent = convertBEtoAD(node.textContent);
        } else if (node.nodeType === Node.ELEMENT_NODE && node.childNodes) {
            node.childNodes.forEach(processTextNodes);
        }
    }

    function processMutations(mutations) {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                processTextNodes(node);
            });
        });
    }

    processTextNodes(document.body);

    const observer = new MutationObserver(processMutations);
    observer.observe(document.body, { childList: true, subtree: true });
})();
