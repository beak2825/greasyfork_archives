// ==UserScript==
// @name         Github - Open PR CheckList
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  check the base branch, reviews, and field updates
// @author       You
// @match        https://github.com/*/pull/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @license      MIT
// @require http://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/453813/Github%20-%20Open%20PR%20CheckList.user.js
// @updateURL https://update.greasyfork.org/scripts/453813/Github%20-%20Open%20PR%20CheckList.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */


(function () {
    'use strict';
    $(document).ready(function () {
        function validatePR() {
            var pr_target = $("div#partial-discussion-header div.gh-header-meta span.commit-ref:not(.head-ref)");
            var pr_status = $("div#partial-discussion-header div.gh-header-meta span.State").attr("title");
            var pr_reviews = $('form.js-issue-sidebar-form[aria-label="Select reviewers"] span.css-truncate').text();
            var currentUrl = window.location.href;

            if (currentUrl.indexOf("/pull/") != -1 && pr_status.indexOf("Open") != -1) { // only handle open PRs
                var pr_merge_message = $("div#discussion_bucket div.merge-pr.Details.is-merging div.mergeability-details div.merge-message div.select-menu");

                // always remind to check field updates for backward-compatibility
                pr_merge_message.prepend("<div style=\"color:pink;\"><h4>🤨 Did you DELETE/UPDATE api fields?? If so, are the clients ready?</h4></div>");

                let badBaseBranch = false;
                let badReviewers = false;

                if (pr_target.text() === "master" || pr_target.text() === "main") {
                    pr_merge_message.prepend("<div style=\"color:orange; \"><h4>⚠️ You are merging into Master/Main branch 😱 🪵 </h4></div>");
                    badBaseBranch = true;
                }

                if (pr_reviews.indexOf("No reviews") != -1) {
                    pr_merge_message.prepend("<div style=\"color:orange;\"><h4>⚠️ This PR has no reviewers! 👀 🤔 🔍 </h4></div>");
                    badReviewers = true;
                }
                let alertMessage = '';
                if (badBaseBranch) {
                    alertMessage = 'merging to MAIN?! 😱 🪵';
                }
                if (badReviewers) {
                    alertMessage += ' no reviewers!? 👀 🤔 🔍'
                }

                if (alertMessage.length > 0) {
                    alert(alertMessage);
                }


            }

        }
        setTimeout(validatePR, 2000)

    });
})();


