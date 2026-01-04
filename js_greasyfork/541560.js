// ==UserScript==
// @name         Twitter/X Bot and Flag Post Hider
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Hides posts from suspected bot accounts, users with specific flags, or users with certain keywords in their name. Hover the counter to see who's hidden.
// @author       CL
// @match        *://x.com/*
// @match        *://twitter.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541560/TwitterX%20Bot%20and%20Flag%20Post%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/541560/TwitterX%20Bot%20and%20Flag%20Post%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const BOT_USERNAME_PATTERN = /[a-zA-Z].*\d{2,}$/;
    const HIDE_IF_NAME_INCLUDES = ['🇮🇱', '🇺🇦'];
    const FORBIDDEN_WORDS = ['democracy', 'ukraine'];
    const CHECK_INTERVAL = 1000;
    // --- End Configuration ---

    // --- Script State ---
    let hiddenPostCount = 0;
    const processedPosts = new Set();
    const hiddenUsernames = new Set();

    // --- UI Elements ---
    let counterElement;
    let tooltipElement;

    /**
     * Creates UI elements (counter, tooltip) and attaches event listeners.
     */
    function setupUI() {
        // Create the main counter element
        counterElement = document.createElement('div');
        counterElement.id = 'bot-hider-counter';
        Object.assign(counterElement.style, {
            position: 'fixed',
            top: '15px',
            left: '15px',
            backgroundColor: 'rgba(29, 155, 240, 0.9)',
            color: 'white',
            padding: '5px 12px',
            borderRadius: '15px',
            zIndex: '10000',
            fontSize: '14px',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            userSelect: 'none',
            cursor: 'pointer', // Add a pointer cursor to indicate it's interactive
            transition: 'opacity 0.3s ease-in-out'
        });
        document.body.appendChild(counterElement);

        // Create the tooltip element for showing hidden names
        tooltipElement = document.createElement('div');
        tooltipElement.id = 'bot-hider-tooltip';
        Object.assign(tooltipElement.style, {
            position: 'fixed',
            top: '55px', // Position it just below the counter
            left: '15px',
            display: 'none', // Initially hidden
            backgroundColor: 'rgba(20, 20, 20, 0.95)',
            color: 'white',
            padding: '10px',
            borderRadius: '8px',
            zIndex: '9999',
            fontSize: '13px',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            maxHeight: '400px',
            overflowY: 'auto',
            border: '1px solid #333'
        });
        document.body.appendChild(tooltipElement);

        // Event listener for showing the tooltip on hover
        counterElement.addEventListener('mouseenter', () => {
            if (hiddenUsernames.size === 0) {
                tooltipElement.innerHTML = '<em>No accounts hidden yet.</em>';
            } else {
                // Format the list of names from the Set
                const userList = [...hiddenUsernames].map(name => `<div>${name}</div>`).join('');
                tooltipElement.innerHTML = `<strong>Hidden Accounts (${hiddenUsernames.size}):</strong>${userList}`;
            }
            tooltipElement.style.display = 'block';
        });

        // Event listener for hiding the tooltip when the mouse leaves
        counterElement.addEventListener('mouseleave', () => {
            tooltipElement.style.display = 'none';
        });
    }

    /**
     * Checks if a user's display name contains any of the strings specified in HIDE_IF_NAME_INCLUDES.
     * @param {string} displayName - The user's display name.
     * @returns {boolean}
     */
    function nameContainsHiddenString(displayName) {
        return HIDE_IF_NAME_INCLUDES.some(str => displayName.includes(str));
    }

    /**
     * Checks if a user's display name or username contains any of the exact words specified in FORBIDDEN_WORDS.
     * @param {string} displayName - The user's display name.
     * @param {string} username - The user's handle.
     * @returns {boolean}
     */
    function nameContainsForbiddenWord(displayName, username) {
        const combinedText = `${displayName} ${username}`;
        return FORBIDDEN_WORDS.some(word => {
            const regex = new RegExp(`\\b${word}\\b`, 'i');
            return regex.test(combinedText);
        });
    }

    /**
     * The main function that finds and hides posts based on configured rules.
     */
    function hidePosts() {
        const articles = document.querySelectorAll('article[data-testid="tweet"]');

        articles.forEach(article => {
            const articleId = article.getAttribute('aria-labelledby');
            if (!articleId || processedPosts.has(articleId)) {
                return;
            }
            processedPosts.add(articleId);

            const userLink = article.querySelector('a[href^="/"]:not([href*="/status/"])');
            const userDisplayNameElement = article.querySelector('[data-testid="User-Name"]');

            if (userLink && userDisplayNameElement) {
                const href = userLink.getAttribute('href');
                const username = href.substring(1);
                const displayName = userDisplayNameElement.textContent || '';

                const shouldHide = BOT_USERNAME_PATTERN.test(username) ||
                                   nameContainsHiddenString(displayName) ||
                                   nameContainsForbiddenWord(displayName, username);

                if (shouldHide) {
                    const postContainer = article.closest('[data-testid="cellInnerDiv"]');
                    if (postContainer) {
                        postContainer.style.display = 'none';
                        hiddenPostCount++;
                        // Add the user's name to our set for the tooltip display
                        hiddenUsernames.add(`${displayName.trim()} (@${username})`);
                    }
                }
            }
        });

        counterElement.textContent = `Hiding ${hiddenPostCount} posts`;
    }

    // --- Script Execution ---
    console.log('Twitter/X Bot & Flag Hider script is now active.');
    setupUI(); // Set up the counter and tooltip elements
    setInterval(hidePosts, CHECK_INTERVAL); // Start the main loop
})();