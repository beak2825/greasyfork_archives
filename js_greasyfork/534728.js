// ==UserScript==
// @name         Hacker News Content Blocker (Replies + Stories) with Persistence and Block Button
// @namespace    
// @version      0.8
// @description  Hide comments, their replies, and stories from specific users on Hacker News, with persistent storage and an easy block button.
// @match        https://news.ycombinator.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534728/Hacker%20News%20Content%20Blocker%20%28Replies%20%2B%20Stories%29%20with%20Persistence%20and%20Block%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/534728/Hacker%20News%20Content%20Blocker%20%28Replies%20%2B%20Stories%29%20with%20Persistence%20and%20Block%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'hnBlockedUsers'; // Key for storing blocked users in GM storage

    let blockedUsers = [];
    let blockedUsersRegex; // Will be updated dynamically

    // --- Persistence Functions ---

    // Load blocked users from storage
    function loadBlockedUsers() {
        const storedUsersJson = GM_getValue(STORAGE_KEY, '[]'); // Default to empty array JSON string
        try {
            blockedUsers = JSON.parse(storedUsersJson);
        } catch (e) {
            console.error("Hacker News Blocker: Failed to parse stored blocked users.", e);
            blockedUsers = []; // Fallback to empty array on error
        }
        updateBlockedUsersRegex(); // Update the regex after loading
        console.log(`Hacker News Blocker: Loaded ${blockedUsers.length} blocked users.`);
    }

    // Save blocked users to storage
    function saveBlockedUsers() {
        GM_setValue(STORAGE_KEY, JSON.stringify(blockedUsers));
        updateBlockedUsersRegex(); // Update the regex after saving
        console.log(`Hacker News Blocker: Saved ${blockedUsers.length} blocked users.`);
    }

    // Update the regex used for checking blocked users
    function updateBlockedUsersRegex() {
        if (blockedUsers.length === 0) {
            // If no users are blocked, create a regex that never matches
            blockedUsersRegex = new RegExp('^$');
        } else {
            // Escape special regex characters in usernames just in case, although HN usernames are typically simple.
            const escapedUsers = blockedUsers.map(name => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
            blockedUsersRegex = new RegExp('^(' + escapedUsers.join('|') + ')$');
        }
    }

    // --- Hiding Logic ---

    function hideBlockedContent() {
        // --- Hide Comments and their Replies ---
        const commentRows = document.querySelectorAll('tr.athing.comtr');

        commentRows.forEach(commentRow => {
            // Check if the comment is already hidden or marked to be skipped
            if (commentRow.style.display === 'none' || commentRow.classList.contains('hn-blocker-processed-comment')) {
                 // Adding a processed class helps prevent re-processing the same comment row multiple times
                 // within a single run if the observer triggers frequently.
                 return;
            }

            const userLink = commentRow.querySelector('a.hnuser');
            if (userLink) {
                const username = userLink.innerText;

                if (blockedUsersRegex.test(username)) {
                    // Hide the initial comment row
                    commentRow.style.display = 'none';

                    // Attempt to hide replies by checking indentation levels
                    const indentTd = commentRow.querySelector('td.ind');
                    if (indentTd) {
                        const parentIndent = parseInt(indentTd.getAttribute('indent') || '0', 10);
                        let currentRowToHide = commentRow.nextElementSibling;

                        while (currentRowToHide) {
                            const replyIndentTd = currentRowToHide.querySelector('td.ind');
                            if (replyIndentTd) {
                                const replyIndent = parseInt(replyIndentTd.getAttribute('indent') || '0', 10);

                                // If the reply's indentation is greater than the parent's, it's a reply in this thread
                                if (replyIndent > parentIndent) {
                                    currentRowToHide.style.display = 'none';
                                    currentRowToHide = currentRowToHide.nextElementSibling;
                                } else {
                                    // Found a sibling at the same or lower indentation, end of this reply subtree
                                    break;
                                }
                            } else {
                                // Not a comment row with indentation (e.g., 'more comments'), end of tree branch
                                break;
                            }
                        }
                    }
                }
            }
             commentRow.classList.add('hn-blocker-processed-comment'); // Mark as processed
        });

        // --- Hide Stories ---
        // This logic hides the two rows that make up a story entry on listing pages.
        const subtextRows = document.querySelectorAll('td.subtext');

        subtextRows.forEach(subtextTd => {
            // Check if this story entry is already hidden or marked to be skipped
             const secondStoryRow = subtextTd.closest('tr');
             if (secondStoryRow && secondStoryRow.classList.contains('hn-blocker-processed-story')) {
                 return;
             }

            const userLink = subtextTd.querySelector('a.hnuser');
            if (userLink) {
                const username = userLink.innerText;
                 if (blockedUsersRegex.test(username)) {
                     // Found a subtext td with a blocked user, get its parent tr (the second story row)
                     if (secondStoryRow && secondStoryRow.style.display !== 'none') {
                          secondStoryRow.style.display = 'none';

                          // Find and hide the preceding sibling tr (the first story row)
                          const firstStoryRow = secondStoryRow.previousElementSibling;
                           if (firstStoryRow && firstStoryRow.classList.contains('athing') && firstStoryRow.classList.contains('submission') && firstStoryRow.style.display !== 'none') {
                               firstStoryRow.style.display = 'none';
                           }
                     }
                 }
             }
             if(secondStoryRow) {
                 secondStoryRow.classList.add('hn-blocker-processed-story'); // Mark as processed
             }
        });
    }

    // --- Button Logic ---

    // Adds a "block" button next to a given user link element
    function addBlockButton(userLink) {
        // Prevent adding multiple buttons to the same link
        if (userLink.classList.contains('hn-block-button-added')) {
            return;
        }

        const username = userLink.innerText;

        // Don't add a block button if the user is already blocked (button not needed)
        if (blockedUsers.includes(username)) {
             userLink.classList.add('hn-blocked-user-link'); // Mark the user link if they are blocked on load
             return; // Skip adding button if already blocked
        }

        const blockButton = document.createElement('button');
        blockButton.innerText = '[block]'; // Button text
        blockButton.title = `Block user "${username}"`; // Tooltip
        // Basic styling to make the button small and less intrusive
        blockButton.style.cssText = `
            font-size: x-small;
            margin-left: 5px;
            cursor: pointer;
            border: 1px solid #ccc;
            border-radius: 3px;
            background: #f0f0f0;
            color: #555;
            padding: 0 3px;
            line-height: 1;
        `;

        blockButton.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent any default action (like navigating if link wraps button)
            event.stopPropagation(); // Stop the event from bubbling up

            if (!blockedUsers.includes(username)) {
                blockedUsers.push(username);
                saveBlockedUsers(); // Save the updated list

                // Immediately hide content from this user
                hideBlockedContent();

                console.log(`Hacker News Blocker: Blocked user "${username}".`);

                // Hide the button after blocking
                blockButton.style.display = 'none';
                 // Optionally mark the user link itself
                 userLink.classList.add('hn-blocked-user-link');
            }
        });

        // Insert the button right after the user link
        userLink.insertAdjacentElement('afterend', blockButton);

        // Mark the user link as having a button added
        userLink.classList.add('hn-block-button-added');
    }

    // Find all user links and add block buttons
    function addButtonsToUserLinks() {
        // Select all a.hnuser elements that haven't been processed yet
        const userLinks = document.querySelectorAll('a.hnuser:not(.hn-block-button-added):not(.hn-blocked-user-link)');
        userLinks.forEach(addBlockButton);
    }

    // --- Style for blocked users (Optional) ---
     function addCustomStyles() {
        const style = document.createElement('style');
        style.type = 'text/css';
        // Add a style to indicate a user link is blocked (e.g., strikethrough)
        style.innerHTML = `
            .hn-blocked-user-link {
                text-decoration: line-through !important;
                opacity: 0.6;
            }
        `;
        document.head.appendChild(style);
     }


    // --- Script Initialization ---

    // Add custom styles first
    addCustomStyles();

    // 1. Load the blocked users list from storage
    loadBlockedUsers();

    // 2. Add block buttons to any user links already present on the page
    addButtonsToUserLinks();

    // 3. Hide content from the initially loaded blocked users
    hideBlockedContent();

    // 4. Use a MutationObserver to detect dynamic content loading (like "More" buttons)
    // and add buttons/hide content for new elements.
    const observer = new MutationObserver((mutations) => {
         let needsButtonCheck = false;
         let needsHidingCheck = false;

         mutations.forEach(mutation => {
             // If nodes were added, we need to check for new user links (to add buttons)
             // and potentially new comments/stories (to hide blocked ones).
             if (mutation.addedNodes.length > 0) {
                 needsButtonCheck = true;
                 needsHidingCheck = true;
             }
             // You could potentially optimize by checking the added nodes,
             // but simply re-running the functions is often sufficient and simpler
             // given the checks within addButtonsToUserLinks and hideBlockedContent.
         });

         if (needsButtonCheck) {
             addButtonsToUserLinks();
         }
         if (needsHidingCheck) {
             hideBlockedContent();
         }
    });

    // Observe the main table that contains stories and comments.
    const mainContentArea = document.getElementById('hnmain');

    if (mainContentArea) {
        // Observe for added nodes and changes within subtrees
        // childList: true -> observe direct children being added/removed
        // subtree: true  -> observe changes in the entire subtree of the target node
        observer.observe(mainContentArea, { childList: true, subtree: true });
    } else {
        console.warn("Hacker News Blocker: Could not find the main content area to observe for dynamic loading.");
    }

})();