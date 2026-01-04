// ==UserScript==
// @name         GitHub Enhanced Repo Buttons
// @version      1.0
// @description  Enhances GitHub repository pages with buttons to view active forks and open the repo in a VSCode-like interface.
// @license      MIT
// @author       Mobile46
// @match        https://github.com/*/*
// @icon         https://www.google.com/s2/favicons?domain=github.com&sz=32
// @namespace    https://greasyfork.org/users/1466082
// @downloadURL https://update.greasyfork.org/scripts/535034/GitHub%20Enhanced%20Repo%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/535034/GitHub%20Enhanced%20Repo%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function isValidRepoPage() {
        const path = window.location.pathname.split('/');
        return path.length >= 3 && !path[3];
    }

    function getRepoInfo() {
        const path = window.location.pathname.split('/');
        if (path.length >= 3) {
            return {
                owner: path[1],
                repo: path[2]
            };
        }
        return null;
    }

    function addButtons() {
        if (!isValidRepoPage()) {
            return;
        }

        const repoInfo = getRepoInfo();
        if (!repoInfo) {
            console.log('Could not extract repo info');
            return;
        }

        const actionsArea = document.querySelector('.pagehead-actions');
        if (!actionsArea) {
            console.log('Actions area not found');
            return;
        }

        const forksLi = document.createElement('li');
        const forksButton = document.createElement('a');
        forksButton.className = 'btn-sm btn';
        forksButton.setAttribute('data-view-component', 'true');
        forksButton.href = `https://techgaun.github.io/active-forks/index.html#${repoInfo.owner}/${repoInfo.repo}`;
        forksButton.target = '_blank';
        forksButton.rel = 'noopener noreferrer';
        forksButton.innerHTML = `
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-repo-forked mr-2">
                <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path>
            </svg>
            Active Forks
        `;
        forksLi.appendChild(forksButton);

        const vscodeLi = document.createElement('li');
        const vscodeButton = document.createElement('a');
        vscodeButton.className = 'btn-sm btn';
        vscodeButton.setAttribute('data-view-component', 'true');
        vscodeButton.href = `https://github1s.com/${repoInfo.owner}/${repoInfo.repo}`;
        vscodeButton.target = '_blank';
        vscodeButton.rel = 'noopener noreferrer';
        vscodeButton.innerHTML = `
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-code mr-2">
                <path d="m11.28 3.22 4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L13.69 8 10.22 4.53a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018ZM4.72 3.22a.75.75 0 0 1 1.06 1.06L2.31 8l3.47 3.47a.751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25Z"></path>
            </svg>
            View in VSCode
        `;
        vscodeLi.appendChild(vscodeButton);

        actionsArea.appendChild(forksLi);
        actionsArea.appendChild(vscodeLi);
    }

    addButtons();

    const observer = new MutationObserver(() => {
        if (document.querySelector('.pagehead-actions') &&
            !document.querySelector('a[href*="techgaun.github.io/active-forks"]') &&
            !document.querySelector('a[href*="github1s.com"]')) {
            addButtons();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();