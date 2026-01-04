// ==UserScript==
// @name         Jira history diff
// @version      2025-11-12
// @description  Highliht diff in Jira issue history.
// @author       vctls
// @match        https://*.atlassian.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atlassian.net
// @grant        none
// @require      https://cdn.jsdelivr.net/gh/google/diff-match-patch@62f2e689f498f9c92dbc588c58750addec9b1654/javascript/diff_match_patch_uncompressed.js
// @license      MIT
// @namespace    https://greasyfork.org/users/299396
// @downloadURL https://update.greasyfork.org/scripts/494919/Jira%20history%20diff.user.js
// @updateURL https://update.greasyfork.org/scripts/494919/Jira%20history%20diff.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const handleMessage = () => {

        // Get all history entries that have description changes.
        // TODO Find a more reliable selector.
        const descChanges = document.querySelectorAll('[data-testid="issue-history.ui.history-items.generic-history-item.history-item"] >:nth-child(2):has(div:nth-child(1) > ._1reo1wug) ._1e0c1txw');

        descChanges.forEach((element, index) => {
            if (element.dataset.diffed) return;
            const right = element.querySelector('._syazi7uo:nth-of-type(1) ._1reo1wug');
            // nth-of-type(2) is the arrow icon between left and right items
            const left = element.querySelector('._syazi7uo:nth-of-type(3) ._1reo1wug');

            if (!left || !right) return;
            element.style.display = "block";
            const dmp = new diff_match_patch();
            const diff = dmp.diff_main(right.innerText, left.innerText);
            dmp.diff_cleanupSemantic(diff);
            element.innerHTML = dmp.diff_prettyHtml(diff);
            element.dataset.diffed = true;
        });
    };

    let timeoutId;
    const delayedHandler = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => handleMessage(), 10);
    };

    (new MutationObserver(delayedHandler)).observe(document, {childList: true, subtree: true});

})();