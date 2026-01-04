// ==UserScript==
// @name         GitLab tree selector
// @namespace    http://tampermonkey.net/
// @version      2025-03-05
// @description  Select current file name in the MR tree
// @author       nw
// @match        https://gitlab.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gitlab.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528921/GitLab%20tree%20selector.user.js
// @updateURL https://update.greasyfork.org/scripts/528921/GitLab%20tree%20selector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.innerHTML = `
    .gl-truncate-component {
        font-weight: initial;
    }
    .diff-file-row.is-active .gl-truncate-component {
        font-weight: bold;
    }
    `;
    document.body.appendChild(style);

    const observer = new MutationObserver((mutations, obs) => {
        const treeList = document.querySelector('.mr-tree-list');

        if (!treeList) {
            return;
        }

        window.addEventListener('scroll', function(event) {
            const treeFiles = {};

            document.querySelectorAll('.mr-tree-list .file-row:not(.folder)').forEach(treeFile => {
                const fileName = treeFile.querySelector('.gl-truncate-component').textContent.replace(/[\u200B-\u200F\u202A-\u202E\u2060-\u206F]/g, '').trim();

                treeFile.style.removeProperty("background-color");
                //treeFile.classList.remove("is-active");

                treeFiles[fileName] = treeFile;
            });

            const frontFileHeaders = document.querySelectorAll('.diff-files-holder .vue-recycle-scroller__item-view .file-title');
            const paginationHeaderHeight = document.querySelector('.top-bar-fixed').getBoundingClientRect().height;
            const titleHeaderHeight = document.querySelector('.issue-sticky-header').getBoundingClientRect().height;
            const offsetTop = paginationHeaderHeight + titleHeaderHeight;

            const filesBelowCenter = [];

            frontFileHeaders.forEach(frontFileTitleHeader => {
                const frontFileTitleHeaderTop = frontFileTitleHeader.getBoundingClientRect().top;
                const viewportCenter = ((window.innerHeight - offsetTop) / 2) + offsetTop;

                if (frontFileTitleHeaderTop > 0 && frontFileTitleHeaderTop < viewportCenter) {
                    filesBelowCenter.push(frontFileTitleHeader);
                }
            });

            if (filesBelowCenter.length === 0) {
                return;
            }

            const currentFile = filesBelowCenter[filesBelowCenter.length - 1];
            const filePaths = currentFile.querySelectorAll('.file-header-content > a strong');
            const filePath = filePaths[filePaths.length - 1].title;
            const filePathArray = filePath.split('/');
            const fileName = filePathArray[filePathArray.length - 1];

            if (treeFiles[fileName] === undefined) {
                return;
            }

            treeFiles[fileName].style.setProperty("background-color", "var(--gray-50, #ececef)");
        });

        obs.disconnect();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();