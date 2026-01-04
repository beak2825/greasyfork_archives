// ==UserScript==
// @name         AddNewIssueButton
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Adds an issue creation button to GitHub repository pages.
// @author       zcf0508
// @match        https://github.com/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502775/AddNewIssueButton.user.js
// @updateURL https://update.greasyfork.org/scripts/502775/AddNewIssueButton.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const repoData = window.location.pathname.split('/');
    const repoName = repoData[2];
    const userName = repoData[1];
    const repo = `${userName}/${repoName}`;

    const createButton = () => {
        const button = document.createElement('button');
        button.textContent = 'Add Issue';
        button.className = 'btn btn-primary';
        button.addEventListener('click', () => {
            location.href = `https://github.com/${repo}/issues/new`;
        });
        return button;
    };

    const appendButton = () => {
        if (repoName && userName) {
            let parent = document.querySelector('.AppHeader-actions');
            let issuesTab = document.querySelector('#issues-tab');
            if (parent && issuesTab) {
                parent.appendChild(createButton());
            }
        }
    };

    // Use MutationObserver to ensure the button is added when the DOM changes
    const observer = new MutationObserver((mutationsList, observer) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                appendButton();
                observer.disconnect(); // Disconnect after adding the button
                break;
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Fallback to DOMContentLoaded in case the DOM is already loaded
    document.addEventListener('DOMContentLoaded', appendButton);
})();