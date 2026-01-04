// ==UserScript==
// @name         Reddit bug workaround to allow posting on the r/userscript subreddit.
// @namespace    https://gist.github.com/f-steff
// @version      1.2
// @description  Redirects Reddit's submit page for r/userscripts to the old Reddit interface to fix the bug accessing the new interfaces's submit page for the subreddit.
// @author       Flemming Steffensen
// @license      MIT
// @match        https://www.reddit.com/r/userscripts/*
// @match        https://old.reddit.com/r/*/comments/*
// @grant        none
// @homepageURL  https://gist.github.com/f-steff/cd4c5fafc574e5595fc7a153516792ab
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/522742/Reddit%20bug%20workaround%20to%20allow%20posting%20on%20the%20ruserscript%20subreddit.user.js
// @updateURL https://update.greasyfork.org/scripts/522742/Reddit%20bug%20workaround%20to%20allow%20posting%20on%20the%20ruserscript%20subreddit.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Redirect old.reddit.com comment links to www.reddit.com
    if (window.location.href.includes('old.reddit.com') && window.location.href.includes('/comments/')) {
        window.location.href = window.location.href.replace('old.reddit.com', 'www.reddit.com');
    }

    // Function to modify the "Create Post" button
    function modifyCreatePostButton() {
        const createPostButton = document.querySelector('a[data-testid="create-post"]');
        if (createPostButton && createPostButton.href.includes('www.reddit.com')) {
            createPostButton.href = createPostButton.href.replace('www.reddit.com', 'old.reddit.com');
        }
    }

    // Ensure the DOM is fully loaded before running
    function init() {
        modifyCreatePostButton();

        // Observe for dynamic changes to the page and reapply the modification if needed
        const observer = new MutationObserver(() => {
            modifyCreatePostButton();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (window.location.href.includes('/r/userscripts/')) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    }
})();
