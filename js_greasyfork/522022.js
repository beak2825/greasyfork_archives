// ==UserScript==
// @name         Bluesky Unified Block & Hide
// @namespace    https://greasyfork.org/en/users/567951-stuart-saddler
// @version      1.2
// @description  Automatically hides Bluesky posts immediately after confirming the block action using the native Block button.
// @icon         https://i.ibb.co/Vv9LhQv/bluesky-logo-png-seeklogo-520643.png
// @match        https://bsky.app/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522022/Bluesky%20Unified%20Block%20%20Hide.user.js
// @updateURL https://update.greasyfork.org/scripts/522022/Bluesky%20Unified%20Block%20%20Hide.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Stores the username of the post being blocked
    let currentUsername = null;

    /**
     * Logs messages with a specific prefix for debugging.
     * @param {string} message - The message to log.
     */
    function log(message) {
        console.log(`[Bluesky Auto Hide Blocked Posts] ${message}`);
    }

    /**
     * Checks if an element is the "Three Dots" post options button.
     * @param {Element} element - The DOM element to check.
     * @returns {boolean} - True if it's the "Three Dots" button, else false.
     */
    function isPostOptionsButton(element) {
        if (!element) return false;
        const ariaLabel = element.getAttribute('aria-label') || '';
        return ariaLabel.includes('Open post options menu');
    }

    /**
     * Checks if an element is the "Block account" button.
     * @param {Element} element - The DOM element to check.
     * @returns {boolean} - True if it's the "Block account" button, else false.
     */
    function isBlockButton(element) {
        if (!element) return false;
        const blockButtonText = "Block account";
        return element.textContent.trim() === blockButtonText;
    }

    /**
     * Extracts the username from a post container.
     * @param {Element} postContainer - The post container element.
     * @returns {string|null} - The username or null if not found.
     */
    function getUsernameFromPost(postContainer) {
        if (!postContainer) return null;
        log('Extracting username from post.');

        // Locate the profile link
        const usernameLink = postContainer.querySelector('a[href*="/profile/"]');
        if (usernameLink) {
            const href = usernameLink.getAttribute('href');
            const parts = href.split('/');
            const username = parts[parts.length - 1] || null;
            if (username) {
                log(`Username found: ${username}`);
                return username.toLowerCase();
            }
        }

        // Alternative method: Locate a span starting with "@"
        const possibleUsernameElements = postContainer.querySelectorAll('span, div');
        for (let el of possibleUsernameElements) {
            const text = el.textContent.trim();
            if (text.startsWith('@')) {
                const username = text.substring(1);
                log(`Username extracted from span: ${username}`);
                return username.toLowerCase();
            }
        }

        log('Username extraction failed.');
        return null;
    }

    /**
     * Hides all posts from a specific username.
     * @param {string} username - The username whose posts should be hidden.
     */
    function hidePostsFromUser(username) {
        if (!username) return;
        log(`Hiding posts from: @${username}`);

        const selector = `div[role="link"][tabindex="0"], div[role="article"], section[role="article"]`;
        const posts = document.querySelectorAll(selector);

        let hiddenCount = 0;
        posts.forEach(post => {
            const postUsername = getUsernameFromPost(post);
            if (postUsername && postUsername === username) {
                post.style.display = 'none';
                log(`Hidden post from: @${username}`);
                hiddenCount++;
            }
        });

        log(`Total posts hidden from @${username}: ${hiddenCount}`);
    }

    /**
     * Handles blocking a user by hiding their posts.
     * @param {string} username - The username to block.
     */
    function addBlockedUser(username) {
        if (!username) return;
        hidePostsFromUser(username);
    }

    /**
     * Listens for clicks on the "Three Dots" button to capture the username.
     */
    function setupPostOptionsListener() {
        document.addEventListener('click', function(event) {
            let target = event.target;

            while (target && target !== document.body) {
                if (isPostOptionsButton(target)) {
                    log('"Three Dots" button clicked.');
                    const postContainer = target.closest('div[role="link"][tabindex="0"], div[role="article"], section[role="article"]');
                    if (postContainer) {
                        const username = getUsernameFromPost(postContainer);
                        if (username) {
                            currentUsername = username;
                            log(`Selected username: @${username}`);
                        } else {
                            log('Username not found.');
                            currentUsername = null;
                        }
                    } else {
                        log('Post container not found.');
                        currentUsername = null;
                    }
                    break;
                }
                target = target.parentElement;
            }
        }, true);
    }

    /**
     * Listens for clicks on the "Block account" button to handle confirmation.
     */
    function setupBlockButtonListener() {
        document.addEventListener('click', function(event) {
            let target = event.target;

            while (target && target !== document.body) {
                if (isBlockButton(target)) {
                    log('"Block account" button clicked.');
                    // Waiting for confirmation to hide posts
                    break;
                }
                target = target.parentElement;
            }
        }, true);
    }

    /**
     * Listens for clicks on the confirmation "Block" button to hide posts.
     */
    function setupConfirmationButtonListener() {
        document.addEventListener('click', function(event) {
            const target = event.target;

            // Target the confirmation button using data-testid
            const confirmBtn = target.closest('button[data-testid="confirmBtn"]');
            if (confirmBtn) {
                log('Confirmation "Block" button clicked.');
                if (currentUsername) {
                    addBlockedUser(currentUsername);
                    currentUsername = null;
                } else {
                    log('No username to block.');
                }
            }
        }, true);
    }

    /**
     * Debounces a function to limit its execution rate.
     * @param {Function} func - The function to debounce.
     * @param {number} delay - Delay in milliseconds.
     * @returns {Function} - The debounced function.
     */
    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    /**
     * Initializes the userscript by setting up event listeners.
     */
    function init() {
        setupPostOptionsListener();
        setupBlockButtonListener();
        setupConfirmationButtonListener();
        log('Bluesky Unified Block & Hide script initialized.');
    }

    /**
     * Ensures the script runs after the DOM is fully loaded.
     */
    function waitForDOM() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(init, 500);
            });
        } else {
            setTimeout(init, 500);
        }
    }

    // Start the script
    waitForDOM();

})();