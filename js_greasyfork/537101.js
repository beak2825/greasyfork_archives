// ==UserScript==
// @name         Duolingo Table Header Tooltips
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds tooltips for table header columns on Duolingo tables and make them sticky.
// @author       BErnd14
// @match        https://duolingodata.com/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537101/Duolingo%20Table%20Header%20Tooltips.user.js
// @updateURL https://update.greasyfork.org/scripts/537101/Duolingo%20Table%20Header%20Tooltips.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const tooltips = {
        'Learning': 'Link to course structure (CEFR levels in red)',
        'from': "'from' links to a technical JSON file",
        'U': 'Units - Links to an image of the Path structure',
        'Lr': 'Learners - Number of learners (in millions), links to DuoRadios when green',
        'Ls': 'Lessons - Purple = Adventures, links to these',
        'S': 'Stories - Links to official or unofficial stories',
        'W': 'Words - Word list (if available)',
        'R': 'Release Date - Format: Year.Month, links to course versions',
        'D': 'Different Lessons - Ranking, links to alternative versions'
    };

    function addTooltips() {
        const headers = document.querySelectorAll('#DuolingoData thead th');
        if (!headers.length) return;

        headers.forEach(th => {
            const key = th.textContent.trim();
            if (tooltips[key]) {
                if (th.title !== tooltips[key]) {
                    th.title = tooltips[key];
                }
            }
        });
    }

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList' || mutation.type === 'subtree' || mutation.type === 'characterData') {
                addTooltips();
                break;
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });

    setTimeout(addTooltips, 1000);

    GM_addStyle(`
        #DuolingoData thead th {
            position: sticky !important;
            top: 0;
            background: white;
            z-index: 1000;
        }
    `);
})();
