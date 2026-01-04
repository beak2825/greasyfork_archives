// ==UserScript==
// @name         Polymarket Blocker
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Filter comments from specific users on Polymarket. Store the block list in storage.
// @author       You
// @match        https://polymarket.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518325/Polymarket%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/518325/Polymarket%20Blocker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Get the block list from localStorage or initialize it
    const blockListKey = 'polymarketBlockList';
    let blockList = JSON.parse(localStorage.getItem(blockListKey)) || [];

    // Save the updated block list to localStorage
    function saveBlockList() {
        localStorage.setItem(blockListKey, JSON.stringify(blockList));
    }

    // Add "Block" buttons to top-level comments only
    function addBlockButtons() {
        // Select only top-level comment containers with a profile link
        const topLevelComments = document.querySelectorAll('.c-dhzjXW.c-dhzjXW-igqgJBL-css'); // Main containers for comments
        topLevelComments.forEach(comment => {
            const profileLink = comment.querySelector('a[href^="/profile"]'); // First profile link in the comment
            //const isReply = comment.closest('[class*="Reply"]'); // Check if it's a reply

            // Skip if:
            // 1. No profile link is found.
            // 2. Comment is a reply (not a top-level comment).
            // 3. Block button already exists.
            if (!profileLink || comment.querySelector('.block-user-button')) return;

            const profileHref = profileLink.getAttribute('href');

            // Create the "Block" button
            const blockButton = document.createElement('button');
            blockButton.textContent = '🚫';
            blockButton.className = 'block-user-button';
            blockButton.style.marginLeft = '10px';
            blockButton.style.backgroundColor = '#112233';
            blockButton.style.color = '#ffffff';
            blockButton.style.border = 'none';
            blockButton.style.cursor = 'pointer';
            blockButton.style.padding = '5px 10px';
            blockButton.style.borderRadius = '5px';

            // Block button click event
            blockButton.addEventListener('click', () => {
                if (!blockList.includes(profileHref)) {
                    blockList.push(profileHref);
                    saveBlockList();
                    alert(`${profileHref} has been blocked.`);
                    filterComments(); // Apply filter immediately
                }
            });

            // Append the button next to the user's name or profile link
            profileLink.parentElement.appendChild(blockButton);
        });
    }

    // Filter comments based on the block list
    function filterComments() {
        const allComments = document.querySelectorAll('.c-dhzjXW.c-dhzjXW-icSayFg-css'); // All possible comment containers
        allComments.forEach(comment => {
            const profileLink = comment.querySelector('a[href^="/profile"]');
            if (profileLink && blockList.includes(profileLink.getAttribute('href'))) {
                comment.style.display = 'none'; // Hide the entire comment
            }
        });
    }

    // Observe for dynamic content
    function observePage() {
        const observer = new MutationObserver(() => {
            addBlockButtons();
            filterComments();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Initial run
    addBlockButtons();
    filterComments();
    observePage();
})();
