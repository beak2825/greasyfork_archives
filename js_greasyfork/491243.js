// ==UserScript==
// @name         VP Blocker
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Block VP and VP Extended Universe on IP2
// @include      https://communities.win/c/IP2Always*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491243/VP%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/491243/VP%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const wordsToBlock = ["Vegan Patriot", "VP", "giraffe", "IBL", "gloryhole", "Gloryhole", "Dex", "Brandon Que", "Mike", "Eric", "Strokeoff", "Abbey", "Abbie", "Abby", "Nano", "Homeless RV", "IncelBinLaden", "Daddies Little Princess", "methwhore", "distracted driving", "Doordash", "Tapeworm"];

    function hasForbiddenWord(text) {
        return wordsToBlock.some(word => text.includes(word));
    }

    function blockContent() {
        // Target only divs with the class 'post'
        const postElements = document.querySelectorAll('div.post');

        postElements.forEach(post => {
            if (hasForbiddenWord(post.textContent)) {
                // Hide the entire 'post' div if the condition is met
                post.style.display = 'none';
            }
        });
    }

    // Run the blockContent function when the page loads and whenever the page is modified
    window.addEventListener('load', blockContent);
    document.addEventListener('DOMNodeInserted', blockContent);
})();