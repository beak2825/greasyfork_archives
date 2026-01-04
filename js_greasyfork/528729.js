// ==UserScript==
// @name         YouTube Subscriptions Only
// @namespace    http://tampermonkey.net/
// @version      1.4.2
// @description  Removes Home and Shorts buttons, hides Shorts content, and redirects to Subscriptions feed
// @author       SanoKei
// @match        https://www.youtube.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528729/YouTube%20Subscriptions%20Only.user.js
// @updateURL https://update.greasyfork.org/scripts/528729/YouTube%20Subscriptions%20Only.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove Home and Shorts buttons
    function removeButtons() {
        // Target both mini-guide and regular guide entries
        const selectors = [
            'ytd-mini-guide-entry-renderer',
            'ytd-guide-entry-renderer'
        ];

        selectors.forEach(selector => {
            const entries = document.querySelectorAll(selector);
            entries.forEach(entry => {
                // Check if the entry is Home or Shorts by examining its title
                const title = entry.querySelector('.title');
                if (title && (title.textContent === 'Home' || title.textContent === 'Shorts')) {
                    entry.style.display = 'none';
                }
            });
        });
    }

    // Function to hide shorts videos in subscription feed
    function hideShorts() {
        // Only run on subscription feed
        if (window.location.pathname !== '/feed/subscriptions') return;

        // Hide individual shorts videos
        const videoRenderers = document.querySelectorAll('ytd-grid-video-renderer, ytd-rich-item-renderer');
        videoRenderers.forEach(renderer => {
            // Look for shorts indicator - either a "shorts" badge or shorts URL
            const shortsBadge = renderer.querySelector('[overlay-style="SHORTS"], [aria-label*="Shorts"]');
            const shortLink = renderer.querySelector('a[href*="/shorts/"]');

            // If this is a shorts video, hide it
            if (shortsBadge || shortLink) {
                renderer.style.display = 'none';
            }
        });

        // Find and hide entire shorts shelf/section
        const shortsShelves = document.querySelectorAll('ytd-rich-shelf-renderer');
        shortsShelves.forEach(shelf => {
            // Look for the title element that says "Shorts"
            const titleElement = shelf.querySelector('#title');
            if (titleElement && titleElement.textContent.trim() === 'Shorts') {
                // Get the parent container (usually has id="dismissible")
                const container = shelf.closest('#dismissible, .ytd-rich-section-renderer');
                if (container) {
                    container.style.display = 'none';
                } else {
                    // Hide the shelf itself if we can't find the parent container
                    shelf.style.display = 'none';
                }
            }
        });
    }

    // Function to redirect to subscriptions if on homepage
    function redirectToSubscriptions() {
        // Only redirect if we're on the homepage (not already on a video or other page)
        if (window.location.pathname === '/' || window.location.pathname === '/watch') {
            window.location.href = '/feed/subscriptions';
        }
    }

    // Function to modify YouTube logo links to go to subscriptions
    function modifyLogoLinks() {
        // Target all YouTube logo links
        const logoLinks = document.querySelectorAll('a.yt-simple-endpoint[href="/"]');

        logoLinks.forEach(link => {
            // Change the href attribute
            link.setAttribute('href', '/feed/subscriptions');

            // Remove any existing click event listeners to prevent YouTube from overriding our behavior
            const newLink = link.cloneNode(true);
            link.parentNode.replaceChild(newLink, link);

            // Add our own click event listener
            newLink.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                // Navigate to subscriptions using YouTube's internal navigation system
                const app = document.querySelector('ytd-app');
                if (app) {
                    app.fire('yt-navigate', {
                        endpoint: {
                            commandMetadata: {
                                webCommandMetadata: {
                                    url: '/feed/subscriptions'
                                }
                            },
                            browseEndpoint: {
                                browseId: 'FEsubscriptions'
                            }
                        }
                    });
                } else {
                    // Fallback to regular navigation if we can't use YouTube's internal system
                    window.location.href = '/feed/subscriptions';
                }
            });
        });
    }

    // Function to force subscription feed as background for miniplayer
    function fixMiniplayerBackground() {
        // Check if we're on the homepage when miniplayer is active
        const miniPlayer = document.querySelector('ytd-miniplayer[active]');

        if (miniPlayer && window.location.pathname === '/') {
            // Don't use history.pushState as it can break the miniplayer
            // Instead, try to load the subscriptions content without changing the URL

            try {
                // Find YouTube's app element
                const app = document.querySelector('ytd-app');
                if (app) {
                    // Only apply when miniplayer is present and we're on the homepage
                    const contentContainer = document.querySelector('ytd-browse[role="main"]');

                    if (contentContainer) {
                        // Load subscriptions content into the main content area
                        // We use YouTube's internal navigation system
                        app.fire('yt-navigate', {
                            endpoint: {
                                commandMetadata: {
                                    webCommandMetadata: {
                                        url: '/feed/subscriptions'
                                    }
                                },
                                browseEndpoint: {
                                    browseId: 'FEsubscriptions'
                                }
                            },
                            // Don't actually change the URL, which would break miniplayer
                            updateHistory: false,
                            // Make sure miniplayer stays active
                            preserveMiniplayerState: true
                        });
                    }
                }
            } catch (e) {
                console.error('Error fixing miniplayer background:', e);
            }
        }
    }

    // Run the functions periodically to catch dynamic content
    setInterval(() => {
        removeButtons();
        modifyLogoLinks();
        hideShorts();
        fixMiniplayerBackground();
    }, 1000);

    // Run once on initial page load
    removeButtons();
    modifyLogoLinks();
    hideShorts();
    fixMiniplayerBackground();

    // Redirect if on homepage
    if (window.location.pathname === '/') {
        redirectToSubscriptions();
    }

    // Monitor for navigation events within YouTube (for SPA behavior)
    const pushState = history.pushState;
    history.pushState = function() {
        pushState.apply(history, arguments);

        // Check if we've navigated to the homepage
        if (window.location.pathname === '/') {
            setTimeout(redirectToSubscriptions, 100);
        }

        // Run functions after navigation
        setTimeout(() => {
            removeButtons();
            modifyLogoLinks();
            hideShorts();
            fixMiniplayerBackground();
        }, 500);
    };
})();