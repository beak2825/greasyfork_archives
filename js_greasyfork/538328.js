// ==UserScript==
// @name         Hide Solved Count on Codeforces
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hides the number of participants who solved each problem on Codeforces
// @author       joonyou
// @match        https://codeforces.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=codeforces.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538328/Hide%20Solved%20Count%20on%20Codeforces.user.js
// @updateURL https://update.greasyfork.org/scripts/538328/Hide%20Solved%20Count%20on%20Codeforces.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let hideSolvedCounts = () => {
        const solvedLinks = document.querySelectorAll('a[title="Participants solved the problem"]');
        solvedLinks.forEach(el => {
            el.style.display = 'none';
        });
    };

    // Run initially and also on AJAX navigation
    hideSolvedCounts();
    document.addEventListener('DOMContentLoaded', hideSolvedCounts);
    new MutationObserver(hideSolvedCounts).observe(document.body, { childList: true, subtree: true });
})();