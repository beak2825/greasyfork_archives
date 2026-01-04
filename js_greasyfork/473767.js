// ==UserScript==
// @name         Word Spreading Susifier
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Gradually turns webpage text into "sus" variations for fun.
// @author       jayrock09
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473767/Word%20Spreading%20Susifier.user.js
// @updateURL https://update.greasyfork.org/scripts/473767/Word%20Spreading%20Susifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const variations = ["sus", "suspicious", "suspect"];
    const susProbability = 0.03; // Probability of a word being changed to "sus"

    function susifyWord(word) {
        return variations[Math.floor(Math.random() * variations.length)];
    }

    function susifyNode(node) {
        if (node.nodeType === 3) { // Text node
            const originalText = node.nodeValue;
            let words = originalText.split(/\s+/); // Split text into words
            let susifiedWords = words.map(word => {
                if (Math.random() < susProbability) {
                    return susifyWord(word);
                } else {
                    return word;
                }
            });

            const susifiedText = susifiedWords.join(' ');
            if (susifiedText !== originalText) {
                node.nodeValue = susifiedText;
            }
        } else if (node.nodeType === 1) { // Element node
            for (let childNode of node.childNodes) {
                susifyNode(childNode);
            }
        }
    }

    setInterval(function() {
        susifyNode(document.body);
    }, 9000); // Change text every 9000 milliseconds (9 seconds)
})();
