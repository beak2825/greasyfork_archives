// ==UserScript==
// @name         Infinite Craft Rarity Highlighter
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Highlight words with rarity based on difficulty when dragged out of the panel
// @author       carbonara crab
// @license      MIT
// @match        https://neal.fun/infinite-craft/
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/518968/Infinite%20Craft%20Rarity%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/518968/Infinite%20Craft%20Rarity%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getRarity(textLength) {
        if (textLength <= 30) return 'common';
        if (textLength <= 55) return 'uncommon';
        if (textLength <= 69) return 'rare';
        if (textLength <= 92) return 'epic';
        if (textLength <= 120) return 'legendary';
        return 'exotic';
    }

    function getColor(rarity) {
        const colors = {
            common: 'white',
            uncommon: 'lightgreen',
            rare: 'cornflowerblue',
            epic: 'plum',
            legendary: 'gold',
            exotic: 'cyan'
        };
        return colors[rarity] || 'black';
    }

    function highlightElement(element) {
        const textContent = element.textContent.trim();
        if (textContent) {
            const rarity = getRarity(textContent.length);
            element.style.color = getColor(rarity);
        }
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('instance')) {
                    highlightElement(node);
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();