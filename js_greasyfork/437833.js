// ==UserScript==
// @name         Github AutoView
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @description  Automatically mark file renames and minor diffs as viewed
// @author       Machine Maker
// @match        https://*.github.com/*
// @icon         https://www.google.com/s2/favicons?domain=mozilla.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437833/Github%20AutoView.user.js
// @updateURL https://update.greasyfork.org/scripts/437833/Github%20AutoView.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Select the node that will be observed for mutations
    const targetNode = document.getRootNode();
    // Options for the observer (which mutations to observe)
    const config = { childList: true, subtree: true };

    let hasReviewsContainer = false;
    // Callback function to execute when mutations are observed
    const callback = () => {
        if (!location.pathname.match(/\w+\/\w+\/pull\/\d+\/files/)) {
            hasReviewsContainer = false;
            return;
        }

        if (hasReviewsContainer) {
            return;
        }

        const reviewsContainer = document.querySelector('.js-reviews-container');
        if (!reviewsContainer) {
            return;
        }

        hasReviewsContainer = true;

        const autoExpandButton = document.createElement('button');
        autoExpandButton.innerHTML = "AutoExpand";
        autoExpandButton.title = "Expand all collapsed diffs";
        autoExpandButton.classList.add('btn', 'btn-sm', 'd-inline-block', 'float-left', 'ml-2');
        autoExpandButton.onclick = function() {
            for (const checkbox of document.querySelectorAll('.js-reviewed-checkbox')) {
                if (checkbox.attributes["data-ga-click"].value.includes("value:false")) {
                    const closest = checkbox.closest('.js-file.js-details-container[data-file-type=".patch"]')
                    if (closest == null) {
                        continue;
                    }
                    const diffLoader = closest.querySelector('.js-file-content .js-diff-entry-loader .load-diff-button')
                    if (diffLoader) {
                        diffLoader.click();
                    }
                }
            }
        };
        document.querySelector('.js-reviews-container').parentElement.appendChild(autoExpandButton);

        const autoViewButton = document.createElement('button');
        autoViewButton.innerHTML = "AutoView";
        autoViewButton.title = "Mark all empty diffs as viewed";
        autoViewButton.classList.add('btn', 'btn-sm', 'd-inline-block', 'float-left', 'ml-2');
        autoViewButton.onclick = function() {
            for (const checkbox of document.querySelectorAll('.js-reviewed-checkbox')) {
                if (!checkbox.checked) {
                    const closest = checkbox.closest('.js-file.js-details-container[data-file-type=".patch"]')
                    if (closest == null) {
                        continue;
                    }
                    const diffLoader = closest.querySelector('.js-file-content .js-diff-entry-loader .load-diff-button')
                    if (diffLoader) {
                        diffLoader.click();
                    }
                    const dataContent = closest.querySelector('.js-file-content .data')
                    if (dataContent && dataContent.classList.contains('empty')) { // Is an empty diff
                        checkbox.click();
                    } else if (dataContent && dataContent.classList.contains('js-blob-wrapper')) {
                        let shouldCheck = true;
                        for (const diff of dataContent.querySelectorAll('.diff-table tbody tr[data-hunk] td.js-file-line:not(.blob-code-context) .blob-code-inner')) {
                            if (diff.textContent.match(/index\s[0-9a-f]+\.\.[0-9a-f]+\s\d+/)) { // is index change
                                continue;
                            } else if (diff.textContent.match(/@@\s-\d+,\d+\s\+\d+,\d+\s@@/)) { // is line num change
                                continue;
                            }
                            shouldCheck = false;
                            break;
                        }
                        if (shouldCheck) {
                            checkbox.click();
                        }
                    }
                }
            }
        };

        document.querySelector('.js-reviews-container').parentElement.appendChild(autoViewButton);
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
})();
