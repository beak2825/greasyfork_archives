// ==UserScript==
// @name         GitHub Auto-fill PR Title
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Auto-fill PR title based on branch name extracted from the URL. needs reload (for now)
// @author       SebRF
// @match        https://github.com/*/compare/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/516085/GitHub%20Auto-fill%20PR%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/516085/GitHub%20Auto-fill%20PR%20Title.meta.js
// ==/UserScript==

(function() {
    'use strict';


    function getBranchNameFromURL() {
        const url = window.location.href;
        const match = url.match(/compare\/(.+)\?/);
        if (match && match[1]) {
            return decodeURIComponent(match[1]);
        }
        return null;
    }


    function formatPRTitle(branchName) {
        const regex = /(\w+)\/(CVH-\d+)-(.+)/;
        const match = branchName.match(regex);

        if (match) {
            const branchType = match[1];
            const issueNumber = match[2];
            const description = match[3].replace(/-/g, ' ');
            return `[${issueNumber}] ${branchType}: ${description}`;
        }
        return branchName;
    }

    function autoFillPRTitle() {
        const branchName = getBranchNameFromURL();
        if (branchName) {
            const formattedTitle = formatPRTitle(branchName);
            const titleInput = document.querySelector("input[name='pull_request[title]']");
            if (titleInput) {
                titleInput.value = formattedTitle;
            }
        }
    }

    window.onload = autoFillPRTitle;
})();
