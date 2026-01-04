// ==UserScript==
// @name         GitLab Merge Confirmation
// @namespace    https://github.com/rvoortman/gitlab-merge-confirmation
// @version      1.0
// @description  Adds a confirmation prompt before merging in GitLab
// @author       Robbin Voortman
// @match        https://gitlab.com/*/-/merge_requests/*
// @license      MIT
// @homepage     https://github.com/rvoortman/gitlab-merge-confirmation
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545552/GitLab%20Merge%20Confirmation.user.js
// @updateURL https://update.greasyfork.org/scripts/545552/GitLab%20Merge%20Confirmation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Observe the DOM for dynamic loading of the merge button
    const observer = new MutationObserver(() => {
        const mergeButton = document.querySelector('button[data-testid="merge-button"]');

        if (mergeButton && !mergeButton.dataset.confirmAdded) {
            mergeButton.addEventListener('click', function(e) {
                const confirmed = confirm("Are you sure you want to merge this request?");
                if (!confirmed) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                }
            }, true);

            // Prevent multiple bindings
            mergeButton.dataset.confirmAdded = "true";
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
