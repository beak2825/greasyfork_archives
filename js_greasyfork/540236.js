// ==UserScript==
// @name         iDontLikeRufus
// @namespace    https://greasyfork.org/en/scripts/540236-idontlikerufus
// @version      1.0.5
// @description  Removes mentions of "Rufus," Amazon's AI assistant, from the US Amazon webpage.
// @author       nexnot
// @match        https://www.amazon.com/*
// @match        https://smile.amazon.com/*
// @license      unlicense
// @downloadURL https://update.greasyfork.org/scripts/540236/iDontLikeRufus.user.js
// @updateURL https://update.greasyfork.org/scripts/540236/iDontLikeRufus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeRufusText() {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
            acceptNode: (node) => {
                if (node.parentElement && node.parentElement.offsetParent !== null) {
                    return NodeFilter.FILTER_ACCEPT;
                }
                return NodeFilter.FILTER_REJECT;
            },
        });

        let node;
        while ((node = walker.nextNode())) {
            if (node.nodeValue.includes('Rufus')) {
                node.nodeValue = node.nodeValue.replace(/Rufus/g, '');
                // You can change the ('') above to a different name (i.e. (/Rufus/g, 'myName') ) if you'd like to rename Rufus. Default is to replace it with whitespace (i.e. empty string). 
            }
        }
    }
    window.addEventListener('load', removeRufusText);

    const observer = new MutationObserver(() => removeRufusText());
    observer.observe(document.body, { childList: true, subtree: true });
})();