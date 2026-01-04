// ==UserScript==
// @name         Text Replacement
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replaces all text on a webpage with "fuc"
// @author       DAC
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479265/Text%20Replacement.user.js
// @updateURL https://update.greasyfork.org/scripts/479265/Text%20Replacement.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const replaceText = () => {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        while (walker.nextNode()) {
            const node = walker.currentNode;
            node.nodeValue = 'this page has been hacked';
        }
    };

    // Wait for the page to load, then replace the text
    window.addEventListener('load', () => {
        replaceText();
    });
})();