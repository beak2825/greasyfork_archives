// ==UserScript==
// @name         GitHub PR Auto Merge Type
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically set merge type on GitHub PR page
// @author       Steven Cotterill
// @match        https://github.com/*/pull/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476251/GitHub%20PR%20Auto%20Merge%20Type.user.js
// @updateURL https://update.greasyfork.org/scripts/476251/GitHub%20PR%20Auto%20Merge%20Type.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to set the merge type based on the target branch
    function setMergeType() {
        const targetBranchElement = document.querySelector('.head-ref');
        if (targetBranchElement) {
            const targetBranch = targetBranchElement.textContent.trim();

            const mergeMethodDropdown = document.querySelector('.js-merge-method-menu button');
            if (mergeMethodDropdown) {
                mergeMethodDropdown.click();

                setTimeout(() => {
                    const squashAndMergeOption = document.querySelector('.js-squash-and-merge');
                    const createMergeCommitOption = document.querySelector('.js-create-merge-commit');

                    if (squashAndMergeOption && createMergeCommitOption) {
                        if (targetBranch !== 'master') {
                            squashAndMergeOption.click();
                        } else {
                            createMergeCommitOption.click();
                        }
                    }
                }, 500); // Adjust this delay as needed
            }
        }
    }

    // Execute the setMergeType function when the PR page is loaded
    window.addEventListener('load', setMergeType);
})();
