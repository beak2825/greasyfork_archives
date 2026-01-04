// ==UserScript==
// @name         Bluesky Threading Improvements
// @namespace    zetaphor.com
// @description  Adds colors and expand/collapse functionality to Bluesky threads
// @version      0.4
// @license      MIT
// @match        https://bsky.app/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/518257/Bluesky%20Threading%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/518257/Bluesky%20Threading%20Improvements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add our styles
    GM_addStyle(`
        /* Thread depth colors */
        div[style*="border-left-width: 2px"] {
            border-left-width: 2px !important;
            border-left-style: solid !important;
        }

        /* Color definitions */
        div[style*="border-left-width: 2px"]:nth-child(1) { border-color: #2962ff !important; }  /* Blue */
        div[style*="border-left-width: 2px"]:nth-child(2) { border-color: #8e24aa !important; }  /* Purple */
        div[style*="border-left-width: 2px"]:nth-child(3) { border-color: #2e7d32 !important; }  /* Green */
        div[style*="border-left-width: 2px"]:nth-child(4) { border-color: #ef6c00 !important; }  /* Orange */
        div[style*="border-left-width: 2px"]:nth-child(5) { border-color: #c62828 !important; }  /* Red */
        div[style*="border-left-width: 2px"]:nth-child(6) { border-color: #00796b !important; }  /* Teal */
        div[style*="border-left-width: 2px"]:nth-child(7) { border-color: #c2185b !important; }  /* Pink */
        div[style*="border-left-width: 2px"]:nth-child(8) { border-color: #ffa000 !important; }  /* Amber */
        div[style*="border-left-width: 2px"]:nth-child(9) { border-color: #1565c0 !important; }  /* Dark Blue */
        div[style*="border-left-width: 2px"]:nth-child(10) { border-color: #6a1b9a !important; } /* Deep Purple */
        div[style*="border-left-width: 2px"]:nth-child(11) { border-color: #558b2f !important; } /* Light Green */
        div[style*="border-left-width: 2px"]:nth-child(12) { border-color: #d84315 !important; } /* Deep Orange */
        div[style*="border-left-width: 2px"]:nth-child(13) { border-color: #303f9f !important; } /* Indigo */
        div[style*="border-left-width: 2px"]:nth-child(14) { border-color: #b71c1c !important; } /* Dark Red */
        div[style*="border-left-width: 2px"]:nth-child(15) { border-color: #006064 !important; } /* Cyan */

        /* Collapse button styles */
        .thread-collapse-btn {
            cursor: pointer;
            width: 20px;
            height: 20px;
            position: absolute;
            left: -16px;
            top: 18px;
            background-color: #1e2937;
            color: #aebbc9;
            border: 1px solid #4a6179;
            border-radius: 25%;
            z-index: 100;
            padding: 0;
            transition: background-color 0.2s ease;
        }

        .thread-collapse-btn:hover {
            background-color: #2e4054;
        }

        /* Indicator styles */
        .thread-collapse-indicator {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-family: monospace;
            font-size: 16px;
            line-height: 1;
            user-select: none;
        }

        /* Collapsed thread styles */
        .thread-collapsed {
            display: none !important;
        }

        /* Post container relative positioning for collapse button */
        .post-with-collapse {
            position: relative;
        }

        /* Animation for button spin */
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .thread-collapse-btn.spinning {
            animation: spin 0.2s ease-in-out;
        }
    `);

    // Utility function to check if we're on a post page
    function isPostPage() {
        return window.location.pathname.match(/^\/profile\/[^\/]+\/post\/.+/);
    }

    function getIndentCount(postContainer) {
        const parent = postContainer.parentElement;
        if (!parent) return 0;

        const indents = Array.from(parent.parentElement.children).filter(child =>
            child.getAttribute('style')?.includes('border-left-width: 2px')
        );

        return indents.length;
    }

    function hasChildThreads(postContainer) {
        const currentIndents = getIndentCount(postContainer);
        const threadContainer = postContainer.closest('[data-thread-container]') ||
                              postContainer.parentElement?.parentElement?.parentElement?.parentElement;

        if (!threadContainer) return false;

        const nextThreadContainer = threadContainer.nextElementSibling;
        if (!nextThreadContainer) return false;

        const nextPost = nextThreadContainer.querySelector('div[role="link"][tabindex="0"]');
        if (!nextPost) return false;

        const nextIndents = getIndentCount(nextPost);
        return nextIndents > currentIndents;
    }

    function toggleThread(threadStart, isCollapsed) {
        const currentIndents = getIndentCount(threadStart);
        const threadContainer = threadStart.closest('[data-thread-container]') ||
                              threadStart.parentElement?.parentElement?.parentElement?.parentElement;

        let nextContainer = threadContainer?.nextElementSibling;
        while (nextContainer) {
            const nextPost = nextContainer.querySelector('div[role="link"][tabindex="0"]');
            if (nextPost) {
                const nextIndents = getIndentCount(nextPost);

                if (nextIndents <= currentIndents) break;

                if (isCollapsed) {
                    nextContainer.classList.add('thread-collapsed');
                } else {
                    nextContainer.classList.remove('thread-collapsed');
                }
            }
            nextContainer = nextContainer.nextElementSibling;
        }
    }

    function addCollapseButton(postContainer) {
        if (!postContainer || postContainer.querySelector('.thread-collapse-btn')) {
            return;
        }

        const button = document.createElement('button');
        button.className = 'thread-collapse-btn';
        button.setAttribute('aria-label', 'Collapse thread');

        const indicator = document.createElement('div');
        indicator.className = 'thread-collapse-indicator';
        indicator.textContent = '-';
        button.appendChild(indicator);

        postContainer.classList.add('post-with-collapse');
        postContainer.appendChild(button);

        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const isCollapsed = button.classList.toggle('collapsed');

            button.classList.add('spinning');

            setTimeout(() => {
                indicator.textContent = isCollapsed ? '+' : '-';
                button.classList.remove('spinning');
            }, 200);

            toggleThread(postContainer, isCollapsed);
        });
    }

    function initializeThreadCollapse() {
        if (!isPostPage()) return false;

        const posts = document.querySelectorAll('div[role="link"][tabindex="0"]');
        let hasAddedButtons = false;

        posts.forEach(post => {
            if (hasChildThreads(post)) {
                addCollapseButton(post);
                hasAddedButtons = true;
            }
        });

        return hasAddedButtons;
    }

    // Enhanced initialization with retry mechanism
    function initializeWithRetry() {
        const maxAttempts = 10;
        let attempts = 0;
        let initialized = false;

        function attempt() {
            if (attempts >= maxAttempts || initialized) return;

            attempts++;

            // Check if the main post container is present
            const mainPost = document.querySelector('div[role="link"][tabindex="0"]');
            if (!mainPost) {
                setTimeout(attempt, 500);
                return;
            }

            // Try to initialize
            initialized = initializeThreadCollapse();

            if (!initialized) {
                setTimeout(attempt, 500);
            }
        }

        // Start the first attempt
        attempt();
    }

    // Initialize on page load
    initializeWithRetry();

    // Set up observer for dynamic content changes
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1) {
                    const posts = node.querySelectorAll('div[role="link"][tabindex="0"]');
                    if (posts.length > 0) {
                        initializeWithRetry();
                        break;
                    }
                }
            }
        }
    });

    // Start observing after a short delay to ensure the page is ready
    setTimeout(() => {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }, 1000);
})();