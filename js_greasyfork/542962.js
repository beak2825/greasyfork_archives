// ==UserScript==
// @name         Savemyexams Unlimiter
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Bypasses the new savemyexams topic question blocking and revision notes limit
// @author       Hexanut
// @match        *://*.savemyexams.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542962/Savemyexams%20Unlimiter.user.js
// @updateURL https://update.greasyfork.org/scripts/542962/Savemyexams%20Unlimiter.meta.js
// ==/UserScript==

setInterval(() => {
    localStorage.removeItem("SME.topic-question-views");
    localStorage.removeItem("SME.topic-question-part-solution-views");
    localStorage.removeItem("SME.revision-note-views");
    localStorage.removeItem("SME.first-viewed-topic-question-at");
}, 1000);

(function() {
    'use strict';

    function processTabPanes() {
        let processed = false;

        // Find all divs with ID containing "tabpane" (case-insensitive)
        document.querySelectorAll('div[id]').forEach(tabPane => {
            if (!/tabpane/i.test(tabPane.id)) return;

            // Handle blur elements (case-insensitive)
            const blurElement = tabPane.querySelector('[class*="blur" i]');
            if (blurElement) {
                blurElement.className = '';
                processed = true;
            }

            // Handle limit walls
            const limitWall = tabPane.querySelector('[class*="limit-wall_wrapper" i]');
            if (limitWall) {
                limitWall.remove();
                processed = true;
            }
        });

        return processed;
    }

    // First attempt
    if (processTabPanes()) return;

    // Persistent observer for dynamic content
    const observer = new MutationObserver(mutations => {
        mutations.forEach(() => {
            processTabPanes();
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });

})();