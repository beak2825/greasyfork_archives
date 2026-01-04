// ==UserScript==
// @name         Auto Load GitHub Issue Comments
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically load all comments in GitHub issues
// @author       Your Name
// @match        https://github.com/*/*/issues/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520829/Auto%20Load%20GitHub%20Issue%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/520829/Auto%20Load%20GitHub%20Issue%20Comments.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let tryAttempts = 0;

    function loadComments() {
        let needRescheduling = false;

        // Find and click pagination buttons
        const paginationButtons = document.querySelectorAll(".ajax-pagination-btn[data-disable-with]");
        paginationButtons.forEach((button) => {
            button.click();
            needRescheduling = true;
            tryAttempts = 0; // Reset attempts if new pagination button is found
        });

        // Retry logic
        if (needRescheduling || tryAttempts < 5) {
            if (needRescheduling) {
                console.log("Loading more comments...");
            } else {
                console.log("Retrying to find comments to load...");
            }
            tryAttempts++;
            setTimeout(loadComments, 500); // Retry after 500ms
        } else {
            console.log("All comments loaded.");

            // Load resolved comments
            const resolvedButtons = document.querySelectorAll(".js-toggle-outdated-comments[data-view-component]");
            resolvedButtons.forEach((button) => {
                button.click();
            });

            console.log("All resolved comments loaded.");
        }
    }

    // Trigger on page load
    window.addEventListener('load', function () {
        console.log("GitHub Auto Comment Loader: Started");
        loadComments();
    });
})();
