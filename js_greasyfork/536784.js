// ==UserScript==
// @name         Kill EM Dashes on ChatGPT
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Replaces em dashes with a comma on ChatGPT
// @author       livejamie
// @license      MIT
// @match        https://chatgpt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536784/Kill%20EM%20Dashes%20on%20ChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/536784/Kill%20EM%20Dashes%20on%20ChatGPT.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2025 livejamie
*/

(function() {
    'use strict';

    function replaceDashes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            node.textContent = node.textContent.replace(/\s*[—–]\s*/g, ', ');
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            node.childNodes.forEach(replaceDashes);
        }
    }

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(replaceDashes);
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    replaceDashes(document.body);
})();
