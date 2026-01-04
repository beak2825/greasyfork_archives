// ==UserScript==
// @name         Codeforces Rating Hider
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Changes the displayed difficulty on Codeforces problemset to XXXX
// @author       Zafir Hasan Anogh
// @match        https://codeforces.com/
// @match        https://codeforces.com/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537850/Codeforces%20Rating%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/537850/Codeforces%20Rating%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideDifficulty() {
        const difficultySpans = document.querySelectorAll('span[title="Difficulty"]');

        difficultySpans.forEach(span => {
            if (span.innerText !== 'XXXX') {
                span.innerText = 'XXXX';
            }
        });
    }

    hideDifficulty();

    const observer = new MutationObserver(function(mutationsList, observer) {
        let needsUpdate = false;
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches('span[title="Difficulty"]') || node.querySelector('span[title="Difficulty"]')) {
                            needsUpdate = true;
                            break;
                        }
                    }
                }
            }
            if (needsUpdate) break;
        }

        if (needsUpdate) {
            hideDifficulty();
        } else {
            const anyVisibleDifficulty = document.querySelector('span[title="Difficulty"]:not(:empty)');
            if (anyVisibleDifficulty && anyVisibleDifficulty.innerText !== 'XXXX') {
                hideDifficulty();
            }
        }
    });

    const targetNode = document.body;
    const config = { childList: true, subtree: true };

    if (targetNode) {
        observer.observe(targetNode, config);
    }

    window.addEventListener('load', hideDifficulty);

})();
