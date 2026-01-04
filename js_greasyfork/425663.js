// ==UserScript==
// @name         Remove promoted questions and answers on Quora
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Removes promoted answers that have nothing to do with the question you're looking up
// @author       https://greasyfork.org/en/users/728793-keyboard-shortcuts
// @match        https://www.quora.com/*
// @match        https://quora.com/*
// @icon         https://www.google.com/s2/favicons?domain=quora.com&sz=128
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/425663/Remove%20promoted%20questions%20and%20answers%20on%20Quora.user.js
// @updateURL https://update.greasyfork.org/scripts/425663/Remove%20promoted%20questions%20and%20answers%20on%20Quora.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    'use strict';
    var logRemovalsToDevConsole = false; // Change this to true to log removals to the console

    function selectNodesWithXpath(selector) {
        const xpathResult = document.evaluate(selector, document, null, XPathResult.ANY_TYPE, null);

        const elements = [];
        var curElement;
        while (xpathResult && (curElement = xpathResult.iterateNext()) !== null) {
            elements.push(curElement);
        }
        return elements;
    }

    setInterval(function() {
        const removedClass = '__quora_ad_removed__';

        // search for the "Promoted" or "Sponsored" string in a block with a small font ("q-text" or "q-click-wrapper")
        const elements = selectNodesWithXpath(`//div[(contains(@class, 'q-text') or contains(@class, 'q-click-wrapper')) and (not(contains(@class, '${removedClass}'))) and (text() = 'Promoted' or text() = 'Sponsored')]`);

        const toRemove = [];
        var textBlock = null;
        for (const textBlock of elements) {
            var node = textBlock;

            // find the first parent node with a class containing the string "Card_", this is the block we want to hide
            do {
                node = node.parentNode;
            } while (node && (node.className || '').indexOf('Card_') === -1);

            if (node) { // found!
                if (logRemovalsToDevConsole) {
                    console.log('Removing promoted block', node);
                }
                textBlock.classList.add(removedClass); // avoid picking up the same ad on the next page scan
                node.style.display = 'none';
            }
        }
    }, 250); // repeat as more results are loaded (every 250ms)
})();