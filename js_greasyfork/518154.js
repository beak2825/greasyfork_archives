// ==UserScript==
// @name         Remove the AI summary from Google Search
// @namespace    http://tampermonkey.net/
// @version      2024-11-20
// @description  Remove the "AI summary" results from Google Search
// @author       jonbakerfish
// @include      https://www.google.com/search?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518154/Remove%20the%20AI%20summary%20from%20Google%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/518154/Remove%20the%20AI%20summary%20from%20Google%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // The following code is from: https://github.com/zbarnz/Google_AI_Overviews_Blocker
    const patterns = [
        /ai overview/i,
        /AI による概要/
    ]

    const observer = new MutationObserver(() => {
        // each time there's a mutation in the document see if there's an ai overview to hide
        const aiOverviewH1 = [...document.querySelectorAll('h1')].find(h1 => patterns.some(pattern => pattern.test(h1.innerText)));

        if(aiOverviewH1?.parentElement) {
            aiOverviewH1.parentElement.style.display = 'none';
        }
    });

    observer.observe(document, {
        childList: true,
        subtree: true,
    });

})();