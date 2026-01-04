// ==UserScript==
// @name        Bluesky Enhanced Layout
// @namespace   https://greasyfork.org/en/users/567951-stuart-saddler
// @version     1.7
// @description Customizes the Bluesky Home feed by creating a responsive three-column feed layout, aligning the navigation menus, and hiding unnecessary elements for a cleaner and more streamlined interface.
// @author      Stuart Saddler
// @icon        https://i.ibb.co/Vv9LhQv/bluesky-logo-png-seeklogo-520643.png
// @license     MIT
// @match       https://bsky.app/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/520439/Bluesky%20Enhanced%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/520439/Bluesky%20Enhanced%20Layout.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    /**
     * Checks whether the user is logged in by verifying the presence of the navigation bar.
     * This ensures that the layout modifications run only after login.
     */
    function userIsLoggedIn() {
        return !!document.querySelector('nav[role="navigation"]');
    }
    
    // Exit early on profile or notifications pages since this layout tweak is intended only for the main feed.
    if (window.location.pathname.startsWith('/profile/') ||
        window.location.pathname.startsWith('/notifications')) {
        return;
    }

    /**
     * Injects custom CSS into the document head.
     * This CSS applies a multi‑column layout for the feed and uses break‑inside rules to keep posts stable,
     * preventing them from jumping or splitting between columns.
     */
    function injectCSS() {
        const style = document.createElement('style');
        style.textContent = `
            /* Left Navigation Panel Styling */
            nav[role="navigation"] {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 200px !important;
                height: 100vh !important;
                background-color: rgb(22, 30, 39) !important;
                border-right: 1px solid rgb(46, 64, 82) !important;
                overflow-y: auto !important;
                z-index: 1000 !important;
                display: flex !important;
                flex-direction: column !important;
                padding: 20px 0 !important;
                box-sizing: border-box !important;
                transform: translateZ(0);
                will-change: transform;
            }

            /* Main Feed Container with Multi‑Column Layout */
            [data-testid="FeedPage-feed"],
            [data-testid="customFeedPage-feed"],
            [data-testid="followingFeedPage-feed"] {
                column-count: 3 !important;
                -webkit-column-count: 3 !important;
                -moz-column-count: 3 !important;
                column-gap: 20px !important;
                -webkit-column-gap: 20px !important;
                -moz-column-gap: 20px !important;
                width: calc(100vw - 200px) !important;
                margin-left: 200px !important;
                padding: 20px !important;
                box-sizing: border-box !important;
                display: block !important;
                overflow: visible !important;
            }

            /* Responsive Layout Breakpoints */
            @media (max-width: 1600px) {
                [data-testid="FeedPage-feed"],
                [data-testid="customFeedPage-feed"],
                [data-testid="followingFeedPage-feed"] {
                    column-count: 3 !important;
                }
            }

            @media (max-width: 1200px) {
                [data-testid="FeedPage-feed"],
                [data-testid="customFeedPage-feed"],
                [data-testid="followingFeedPage-feed"] {
                    column-count: 2 !important;
                }
                nav[role="navigation"] {
                    width: 150px !important;
                }
                [data-testid="FeedPage-feed"],
                [data-testid="customFeedPage-feed"],
                [data-testid="followingFeedPage-feed"] {
                    width: calc(100vw - 150px) !important;
                    margin-left: 150px !important;
                }
            }

            @media (max-width: 768px) {
                [data-testid="FeedPage-feed"],
                [data-testid="customFeedPage-feed"],
                [data-testid="followingFeedPage-feed"] {
                    column-count: 1 !important;
                }
                nav[role="navigation"] {
                    position: absolute !important;
                    width: 100% !important;
                    height: auto !important;
                    border-right: none !important;
                    border-bottom: 1px solid rgb(46, 64, 82) !important;
                    flex-direction: row !important;
                    flex-wrap: wrap !important;
                    justify-content: space-between !important;
                    padding: 10px !important;
                }
                [data-testid="FeedPage-feed"],
                [data-testid="customFeedPage-feed"],
                [data-testid="followingFeedPage-feed"] {
                    width: 100% !important;
                    margin-left: 0 !important;
                }
                nav[role="navigation"] > .css-175oi2r.r-1ipicw7.r-1xcajam.r-1rnoaur.r-pm9dpa.r-196lrry.css-175oi2r > .css-175oi2r {
                    width: auto !important;
                    margin-top: 0 !important;
                }
            }

            /* Individual Post Card Styling for Stability */
            .css-175oi2r.r-1habvwh {
                display: block !important;
                width: 100% !important;
                margin: 0 0 20px !important;
                background: rgb(22, 30, 39) !important;
                border: 1px solid rgb(46, 64, 82) !important;
                border-radius: 8px !important;
                overflow: hidden !important;
                break-inside: avoid-column !important;
                page-break-inside: avoid !important;
                -webkit-column-break-inside: avoid !important;
                break-after: avoid-column !important;
                break-before: avoid-column !important;
                box-sizing: border-box !important;
                transition: all 0.2s ease-in-out !important;
                max-width: 100% !important;
                min-height: 150px !important;
                max-height: 500px !important;
                overflow-y: auto !important;
            }

            /* Hide Unnecessary Elements */
            .r-2llsf.css-175oi2r > div.css-175oi2r:nth-of-type(1) > .css-175oi2r,
            .css-175oi2r[style*="position: fixed"][style*="inset: 0px 0px 0px 50%"],
            .css-175oi2r.r-18u37iz.r-1niwhzg.r-1e084wi {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Adds event listeners to improve interactions.
     * For example, it prevents duplicate handling of like buttons.
     */
    function handleInteractions() {
        document.body.addEventListener('click', (e) => {
            const likeButton = e.target.closest('[data-testid*="like-button"]');
            if (likeButton && !likeButton.dataset.handled) {
                // Mark the like button to ensure the event isn't re-applied
                likeButton.dataset.handled = 'true';
            }
        }, { capture: true, passive: true });
    }

    /**
     * Ensures that individual posts do not break or jump between columns.
     * Re-applies CSS break-avoidance rules to every post card to maintain stability.
     */
    function stabilizePosts() {
        const feed = document.querySelector(
            '[data-testid="FeedPage-feed"], [data-testid="customFeedPage-feed"], [data-testid="followingFeedPage-feed"]'
        );
        if (!feed) return;

        feed.querySelectorAll('.css-175oi2r.r-1habvwh').forEach(post => {
            if (!post.dataset.stabilized) {
                post.style.display = 'block';
                post.style.breakInside = 'avoid-column';
                post.style.pageBreakInside = 'avoid';
                post.style.webkitColumnBreakInside = 'avoid';
                post.style.breakAfter = 'avoid-column';
                post.style.breakBefore = 'avoid-column';
                post.dataset.stabilized = 'true';
            }
        });
    }

    /**
     * Reorganizes the right-side menu into the left-hand navigation panel.
     * This creates a more uniform and accessible layout.
     */
    function moveRightMenuIntoNav() {
        const rightMenu = document.querySelector(
            'div[style*="padding: 20px 0px 20px 28px"][style*="position: fixed"][style*="left: 50%"][style*="width: 328px"]'
        );
        const leftNav = document.querySelector('nav[role="navigation"]');

        if (!rightMenu || !leftNav) return;

        // Reset styles for the right menu so it blends seamlessly into the left nav
        rightMenu.style.position = 'static';
        rightMenu.style.left = 'auto';
        rightMenu.style.top = 'auto';
        rightMenu.style.transform = 'none';
        rightMenu.style.width = 'auto';
        rightMenu.style.margin = '0';
        rightMenu.style.padding = '35px 15px 18px 15px';
        rightMenu.style.gap = '16px';
        rightMenu.style.maxHeight = '100%';
        rightMenu.style.overflowY = 'auto';

        leftNav.appendChild(rightMenu);
    }

    /**
     * Fine-tunes the top padding of a target container for visual consistency.
     */
    function adjustTopPadding() {
        const targetDiv = document.querySelector(
            'div.css-175oi2r[style*="gap: 10px;"][style*="padding-bottom: 2px;"][style*="overflow-y: auto"]'
        );
        if (targetDiv) {
            targetDiv.style.paddingTop = '11px';
        }
    }

    /**
     * Sets up a MutationObserver to monitor DOM changes.
     * When new posts or elements are injected, it re-applies the stabilization and layout tweaks.
     */
    function setupMutationObserver() {
        let debounceTimeout;
        const observer = new MutationObserver(() => {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => {
                stabilizePosts();
                moveRightMenuIntoNav();
                adjustTopPadding();
            }, 200);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        return observer;
    }

    /**
     * Disconnects the MutationObserver on page unload to clean up resources.
     */
    function setupCleanup(observer) {
        window.addEventListener('unload', () => observer.disconnect());
    }

    /**
     * Runs all layout modifications:
     * - Injects new CSS for a multi‑column, stable post layout.
     * - Reorganizes navigation elements.
     * - Handles interactive elements.
     * - Starts monitoring the DOM for dynamically added content.
     */
    function runLayoutScript() {
        injectCSS();
        moveRightMenuIntoNav();
        adjustTopPadding();
        handleInteractions();
        setupCleanup(setupMutationObserver());
    }

    /**
     * Waits until the user is logged in before running the layout modifications.
     * Uses an interval check to ensure the necessary UI elements are present.
     */
    function waitForLoginAndRun() {
        if (userIsLoggedIn()) {
            runLayoutScript();
            return;
        }
        const checkLoginInterval = setInterval(() => {
            if (userIsLoggedIn()) {
                clearInterval(checkLoginInterval);
                runLayoutScript();
            }
        }, 1000);
    }

    // Initialize the script when the document is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForLoginAndRun);
    } else {
        waitForLoginAndRun();
    }
})();
