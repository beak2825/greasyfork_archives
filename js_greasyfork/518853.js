// ==UserScript==
// @name        Show all Jira Cloud comments (and more)
// @namespace   https://greasyfork.org/users/1047370
// @description Clicks buttons like 'View ... remaining ...' and 'Show more replies'. Works on Jira Cloud as of May 2025. Inspired by https://greasyfork.org/scripts/432731 (no external dependencies).
// @include     https://jira.*
// @include     http://jira.*
// @include     https://*.atlassian.net/jira/*
// @include     https://*.atlassian.net/browse/*
// @include     https://*.atlassian.net/issues/*
// @match       https://jira.*
// @match       http://jira.*
// @match       https://*.atlassian.net/jira/*
// @match       https://*.atlassian.net/browse/*
// @match       https://*.atlassian.net/issues/*
// @version     0.6
// @author      Marnix Klooster <marnix.klooster@gmail.com>
// @copyright   public domain
// @license     public domain
// @homepage    https://greasyfork.org/scripts/518853
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/518853/Show%20all%20Jira%20Cloud%20comments%20%28and%20more%29.user.js
// @updateURL https://update.greasyfork.org/scripts/518853/Show%20all%20Jira%20Cloud%20comments%20%28and%20more%29.meta.js
// ==/UserScript==
 
(function() {
    var theInterval = null;
    var lastClickedButton = null;
 
    function start() {
        if (theInterval) {
            console.log(`SOMETHING WENT WRONG.  Ignoring this call to start().`);
            return;
        }
 
        theInterval = setInterval(function() {
            // click any 'View ... remaining ...' or 'Load more' button in sight...
            var remainingButtons = document.querySelectorAll(
                [
                    '[data-testid="issue.activity.common.component.load-more-button.loading-button"]',
                    '[data-testid="issue-view-activity-comment.comment-show-more-replies.show-more-button"]',
                    '[data-testid="issue-history.ui.history-items.load-more-button"]>button',
                ].join(','));
            if (lastClickedButton) {
                for (var b of remainingButtons) {
                    if (b.isSameNode(lastClickedButton)) {
                        console.log(`waiting for last click to have been handled`);
                        return;
                    }
                }
                lastClickedButton = null;
                console.log(`wait one more round, just to be certain, before we potentially click other buttons`);
                return;
            }
            if (remainingButtons.length > 0) {
                lastClickedButton = remainingButtons[0];
                console.log(`Clicking the button marked "${lastClickedButton.innerText}"...`);
                lastClickedButton.click();
                return;
            }
        }, 1000);
    }
 
    start();
})();