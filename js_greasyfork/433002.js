// ==UserScript==
// @name        MangaDex Unread Chapters
// @namespace   Violentmonkey Scripts
// @include     https://mangadex.org/titles/feed*
// @icon        https://icons.duckduckgo.com/ip2/mangadex.org.ico
// @grant       none
// @run-at      document-end
// @version     11.0.2
// @author      xxshade
// @license     MIT
// @description Shows only unread chapters on mangadex. (Now with toggle button)
// @downloadURL https://update.greasyfork.org/scripts/433002/MangaDex%20Unread%20Chapters.user.js
// @updateURL https://update.greasyfork.org/scripts/433002/MangaDex%20Unread%20Chapters.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========================================================================
    // GLOBAL CONFIGURATION
    // ========================================================================

    // Performance-critical constants
    const HIDE_READ_DELAY = 100; // Reduced debounce time
    const PROCESSING_CHUNK_SIZE = 15; // Containers processed per frame
    const RAF_DEBOUNCE = 2; // Minimum frames between processing

    // UI Configuration
    const BUTTON_COLOR = '#fa6740';
    const BUTTON_HOVER_COLOR = '#FF4B1C';

    // DOM Selectors
    const CONTAINER_SELECTOR = '.chapter-feed__container.details.mb-4';
    const CHAPTER_SELECTOR = 'div.chapter.relative';
    const READ_CLASS = 'read';

    // CSS class names for efficient toggling
    const HIDDEN_CLASS = 'unread-hidden';
    const CONTAINER_HIDDEN_CLASS = 'unread-container-hidden';

    // ========================================================================
    // STATE MANAGEMENT
    // ========================================================================

    let hidden = true; // Current visibility state
    let buttonCreated = false; // Toggle button state
    let lastProcessTime = 0; // For RAF throttling
    let queuedMutation = false; // Mutation queue flag

    // ========================================================================
    // CSS
    // ========================================================================

    // Optimized CSS rules
    const style = document.createElement('style');
    style.textContent = `
        .${HIDDEN_CLASS} {
            display: none !important;
            contain: strict;
        }

        .${CONTAINER_HIDDEN_CLASS} {
            display: none !important;
            contain: strict;
        }

        #unread-toggle-btn {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            padding: 10px 15px;
            color: #fff;
            background-color: ${BUTTON_COLOR};
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: background-color 0.3s, transform 0.1s;
            contain: content;
        }

        #unread-toggle-btn:hover {
            background-color: ${BUTTON_HOVER_COLOR};
        }

        #unread-toggle-btn:active {
            transform: scale(0.98);
        }
    `;
    document.head.appendChild(style);

    // ========================================================================
    // DOM CACHE SYSTEM
    // ========================================================================

    // Efficient container tracking
    const containerCache = {
        // WeakMap for automatic garbage collection
        visibilityMap: new WeakMap(),

        // Set of all containers
        all: new Set(),

        // Add container to cache
        add(container) {
            this.all.add(container);
            this.visibilityMap.set(container, true);
        },

        // Remove container from cache
        remove(container) {
            this.all.delete(container);
            this.visibilityMap.delete(container);
        },

        // Update entire cache
        update() {
            const containers = document.querySelectorAll(CONTAINER_SELECTOR);
            this.all = new Set(containers);
            containers.forEach(container => {
                this.visibilityMap.set(container, true);
            });
        },

        // Get all visible containers
        get visibleContainers() {
            return Array.from(this.all).filter(container =>
                !container.classList.contains(CONTAINER_HIDDEN_CLASS)
            );
        }
    };

    // ========================================================================
    // HIDE READ CHAPTERS
    // ========================================================================

    /**
     * Hides read chapters using optimized RAF scheduling
     */
    function hideRead() {
        if (!hidden) return;

        // Get visible containers
        const containers = containerCache.visibleContainers;
        let showButton = false;
        let processed = 0;

        // Process containers in chunks
        for (const container of containers) {
            if (processed >= PROCESSING_CHUNK_SIZE) {
                // Schedule next chunk on next frame
                requestAnimationFrame(hideRead);
                return;
            }

            const chapters = container.querySelectorAll(CHAPTER_SELECTOR);
            let hasUnread = false;

            // First pass: check for unread chapters
            for (const chapter of chapters) {
                if (!chapter.classList.contains(READ_CLASS)) {
                    hasUnread = true;
                    break;
                }
            }

            if (!hasUnread) {
                // Hide entire container
                container.classList.add(CONTAINER_HIDDEN_CLASS);
                showButton = true;
            } else {
                // Hide individual read chapters
                let actionTaken = false;
                for (const chapter of chapters) {
                    if (chapter.classList.contains(READ_CLASS) &&
                        !chapter.classList.contains(HIDDEN_CLASS)) {
                        chapter.classList.add(HIDDEN_CLASS);
                        actionTaken = true;
                    }
                }
                if (actionTaken) showButton = true;
            }

            processed++;
        }

        // Create button if needed
        if (showButton && !buttonCreated) {
            createToggleButton();
        }
    }

    // ========================================================================
    // SHOW ALL CHAPTERS
    // ========================================================================

    /**
     * Shows all hidden elements with class removal
     */
    function showAll() {
        // Show hidden containers
        document.querySelectorAll(`.${CONTAINER_HIDDEN_CLASS}`).forEach(el => {
            el.classList.remove(CONTAINER_HIDDEN_CLASS);
        });

        // Show hidden chapters
        document.querySelectorAll(`.${HIDDEN_CLASS}`).forEach(el => {
            el.classList.remove(HIDDEN_CLASS);
        });
    }

    // ========================================================================
    // TOGGLE BUTTON
    // ========================================================================

    /**
     * Creates the toggle button with event handling
     */
    function createToggleButton() {
        const btn = document.createElement('button');
        btn.id = 'unread-toggle-btn';
        btn.textContent = 'Show';

        // Event handler for button click
        const clickHandler = () => {
            hidden = !hidden;
            btn.textContent = hidden ? 'Show' : 'Hide';

            if (hidden) {
                hideRead();
            } else {
                showAll();
            }
        };

        // Use event delegation pattern
        btn.addEventListener('click', clickHandler, { passive: true });

        document.body.appendChild(btn);
        buttonCreated = true;
    }

    // ========================================================================
    // MUTATION OBSERVER
    // ========================================================================

    // Efficient observer configuration
    const observer = new MutationObserver(mutations => {
        let shouldProcess = false;

        // Check only for added nodes
        for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                shouldProcess = true;
                break;
            }
        }

        if (shouldProcess) {
            // Update cache
            containerCache.update();

            // Queue processing with RAF throttling
            if (!queuedMutation) {
                queuedMutation = true;

                requestAnimationFrame(timestamp => {
                    // Throttle processing
                    if (timestamp - lastProcessTime > RAF_DEBOUNCE) {
                        lastProcessTime = timestamp;
                        if (hidden) hideRead();
                    }
                    queuedMutation = false;
                });
            }
        }
    });

    // Targeted observation - only specific subtree
    const contentRoot = document.querySelector('.container--default') || document.body;
    observer.observe(contentRoot, {
        childList: true,
        subtree: true
    });

    // ========================================================================
    // INITIALIZATION
    // ========================================================================

    function init() {
        // Initial cache update
        containerCache.update();

        // Initial processing
        if (hidden) hideRead();
    }

    // Start when DOM is ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    }
})();