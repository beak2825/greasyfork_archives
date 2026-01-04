// ==UserScript==
// @name         GitHub Clone with Sourcetree
// @name:zh-CN   GitHub 使用 Sourcetree 克隆
// @namespace    https://github.com/cooaer/Tampermonkey-scripts
// @version      1.4
// @description  Adds an "Open with Sourcetree" button to the GitHub "Code" dropdown menu, allowing you to clone repositories directly into the Sourcetree application.
// @description:zh-CN 在 GitHub 的“Code”下拉菜单中添加一个“Open with Sourcetree”按钮，允许您直接将仓库克隆到 Sourcetree 应用程序中。
// @author       cooaer
// @match        https://github.com/*
// @icon         https://sourcetreeapp.com/favicon.ico
// @grant        none
// @license      MIT
// @homepageURL  https://github.com/cooaer/Tampermonkey-scripts
// @supportURL   https://github.com/cooaer/Tampermonkey-scripts/issues
// @downloadURL https://update.greasyfork.org/scripts/542175/GitHub%20Clone%20with%20Sourcetree.user.js
// @updateURL https://update.greasyfork.org/scripts/542175/GitHub%20Clone%20with%20Sourcetree.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const sourcetreeButtonId = 'open-with-sourcetree-btn';

    // Sourcetree SVG icon provided by the user, adapted for GitHub's UI
    const sourcetreeIconSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="16" height="16" fill="currentColor">
            <path d="M64 .73C29.114.73.73 29.113.73 64S29.114 127.27 64 127.27c34.888 0 63.27-28.384 63.27-63.27S98.887.73 64 .73zm3.335 120.17v-10.988l27.44-13.9a1.955 1.955 0 001.073-1.747v-6.29a5.98 5.98 0 003.99-6.258 5.978 5.978 0 10-11.892 1.225 5.97 5.97 0 003.99 5.03v5.09l-24.6 12.46v-10.22l10.843-5.017a1.957 1.957 0 001.135-1.773l.02-17.026 20.07-11.276c.617-.346 1-1 1-1.706V53.76a5.974 5.974 0 00-2.57-11.59 5.975 5.975 0 00-1.344 11.59v3.606l-20.07 11.27c-.617.35-1 1-1 1.706l-.02 16.92-8.068 3.73V54.2l16.884-8.257a1.95 1.95 0 001.097-1.755v-6.29a5.978 5.978 0 003.99-6.26 5.976 5.976 0 00-6.56-5.33 5.975 5.975 0 00-5.332 6.56 5.964 5.964 0 003.99 5.027v5.07l-14.068 6.877V28.598a5.977 5.977 0 10-7.902-5.03 5.97 5.97 0 003.988 5.028V63.24l-9.943-5.224V42.28a1.95 1.95 0 00-.767-1.552l-6.802-5.21a5.978 5.978 0 10-2.61 2.928l6.265 4.802V59.2c0 .728.404 1.395 1.048 1.733l12.81 6.73v12.724l-21.37-9.884.292-7.742a1.956 1.956 0 00-1.063-1.815l-9.797-5.025c.147-.63.2-1.292.13-1.97a5.978 5.978 0 00-11.892 1.227 5.977 5.977 0 006.56 5.33 5.91 5.91 0 003.1-1.268l9.004 4.616-.295 7.8c-.03.79.417 1.52 1.133 1.85L63.42 84.7v9.084a1.98 1.98 0 000 .516v26.693a57.53 57.53 0 01-6.093-.387V97.66c0-.766-.445-1.46-1.14-1.778l-15.182-6.987a5.974 5.974 0 00-6.563-6.527 5.976 5.976 0 104.924 10.08l14.047 6.463v21.092C27.022 115.028 6.992 91.815 6.992 64c0-31.434 25.574-57.01 57.01-57.01 31.433 0 57.006 25.576 57.006 57.01 0 30.315-23.787 55.17-53.674 56.902z"/>
        </svg>
    `;

    // Use MutationObserver to watch for the clone dialog to appear
    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // Check if the clone dialog has been added
                const desktopButton = findDesktopButton();
                if (desktopButton && !document.getElementById(sourcetreeButtonId)) {
                    addSourcetreeButton(desktopButton);
                }
            }
        }
    });

    // Start observing the document body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    function findDesktopButton() {
        // Find the "Open with GitHub Desktop" button based on its text content and structure
        const actionListItems = document.querySelectorAll('.prc-ActionList-ActionListItem-uq6I7');
        for (const item of actionListItems) {
            const label = item.querySelector('.prc-ActionList-ItemLabel-TmBhn');
            if (label && label.textContent.includes('Open with GitHub Desktop')) {
                return item;
            }
        }
        return null;
    }

    function addSourcetreeButton(desktopButton) {
        // 1. Get the repository clone URL (prefer HTTPS, fallback to SSH)
        function getCloneUrl() {
            const httpsInput = document.getElementById('clone-with-https');
            if (httpsInput && httpsInput.value) {
                return httpsInput.value;
            }

            const sshInput = document.getElementById('clone-with-ssh');
            if (sshInput && sshInput.value) {
                return sshInput.value;
            }

            // We don't handle gh-cli as it's not a direct URL for Sourcetree.
            return null;
        }

        const repoUrl = getCloneUrl();
        if (!repoUrl) {
            console.log('Sourcetree Script: Could not find a usable HTTPS or SSH clone URL.');
            return;
        }

        // 2. Clone the "GitHub Desktop" button's list item
        const sourcetreeListItem = desktopButton.cloneNode(true);

        // 3. Modify the cloned item for Sourcetree
        const sourcetreeButton = sourcetreeListItem.querySelector('button, a');
        if (!sourcetreeButton) return;

        // Replace the button with an anchor tag to make it a clickable link
        const sourcetreeAnchor = document.createElement('a');
        sourcetreeAnchor.href = `sourcetree://cloneRepo/${repoUrl}`;
        sourcetreeAnchor.className = sourcetreeButton.className;
        sourcetreeAnchor.innerHTML = sourcetreeButton.innerHTML;
        sourcetreeAnchor.id = sourcetreeButtonId;

        // Replace the original button inside the cloned list item with our new anchor
        sourcetreeListItem.replaceChild(sourcetreeAnchor, sourcetreeListItem.firstElementChild);

        // 4. Update the icon
        const iconContainer = sourcetreeAnchor.querySelector('.prc-ActionList-LeadingVisual-dxXxW');
        if (iconContainer) {
            iconContainer.innerHTML = sourcetreeIconSvg;
        }

        // 5. Update the label text
        const label = sourcetreeAnchor.querySelector('.prc-ActionList-ItemLabel-TmBhn');
        if (label) {
            label.textContent = 'Open with Sourcetree';
        }

        // 6. Insert the new button after the GitHub Desktop button
        desktopButton.parentNode.insertBefore(sourcetreeListItem, desktopButton.nextSibling);
    }
})();
