// ==UserScript==
// @name         Holotower Auto Scroll by Claude
// @namespace    http://tampermonkey.net/
// @version      1.4
// @author       You
// @license      MIT
// @description  Only scroll to new posts when user is already at bottom of page (with persistent state)
// @match        *://boards.holotower.org/*
// @match        *://holotower.org/*
// @grant        none
// @icon         https://boards.holotower.org/favicon.gif
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/540450/Holotower%20Auto%20Scroll%20by%20Claude.user.js
// @updateURL https://update.greasyfork.org/scripts/540450/Holotower%20Auto%20Scroll%20by%20Claude.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const VISIBILITY_THRESHOLD = 5; // pixels of post that need to be visible
    const STORAGE_KEY = 'holotower_auto_scroll_enabled';

    let originalScrollCheckbox = null;
    let autoScrollCheckbox = null;
    let lastPostElements = [];
    let observer = null;

    // Function to save auto scroll state
    function saveAutoScrollState(enabled) {
        try {
            localStorage.setItem(STORAGE_KEY, enabled ? 'true' : 'false');
        } catch (e) {
            console.warn('Could not save auto scroll state:', e);
        }
    }

    // Function to load auto scroll state
    function loadAutoScrollState() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved === null) {
                return false; // Default to disabled
            }
            return saved === 'true';
        } catch (e) {
            console.warn('Could not load auto scroll state:', e);
            return false;
        }
    }

    // Function to check if an element is in viewport
    function isElementInView(element) {
        if (!element) return false;

        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;

        // Check if at least VISIBILITY_THRESHOLD pixels of the element are visible
        return (
            rect.top < windowHeight &&
            rect.bottom > 0 &&
            (rect.bottom - Math.max(rect.top, 0)) >= VISIBILITY_THRESHOLD
        );
    }

    // Alternative: Check if user is near bottom of page
    function isNearBottom() {
        const scrollPosition = window.innerHeight + window.scrollY;
        const documentHeight = document.documentElement.scrollHeight;
        const distanceFromBottom = documentHeight - scrollPosition;
        return distanceFromBottom <= 200; // Within 200px of bottom
    }

    // Function to get all current posts
    function getCurrentPosts() {
        // Get all post containers (the p.intro elements contain post info)
        return Array.from(document.querySelectorAll('p.intro'));
    }

    // Function to get the last post element before new posts were added
    function getLastKnownPost() {
        if (lastPostElements.length === 0) return null;
        return lastPostElements[lastPostElements.length - 1];
    }

    // Function to check if the last known post is in view
    function isLastPostInView() {
        const lastPost = getLastKnownPost();
        if (!lastPost) return false;
        return isElementInView(lastPost);
    }

    // Function to check if user should scroll (using both methods)
    function shouldScroll() {
        const lastPostVisible = isLastPostInView();
        const nearBottom = isNearBottom();
        // Use either method - if last post is visible OR user is near bottom
        return lastPostVisible || nearBottom;
    }

    // Function to scroll to bottom smoothly
    function scrollToBottom() {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'instant'
        });
    }

    // Function to update our record of current posts
    function updatePostRecord() {
        lastPostElements = getCurrentPosts();
    }

    // Function to detect if new posts were added
    function checkForNewPosts() {
        const currentPosts = getCurrentPosts();
        return currentPosts.length > lastPostElements.length;
    }

    // Function to find the original scroll checkbox
    function findOriginalScrollCheckbox() {
        return document.querySelector('input.auto-scroll');
    }

    // Function to create auto scroll checkbox
    function createAutoScrollCheckbox() {
        const originalCheckbox = originalScrollCheckbox;
        if (!originalCheckbox) return null;

        // Hide the original checkbox
        originalCheckbox.style.display = 'none';

        // Find and hide the text node that says " Scroll to New posts)"
        let nextSibling = originalCheckbox.nextSibling;
        while (nextSibling) {
            if (nextSibling.nodeType === Node.TEXT_NODE &&
                nextSibling.textContent.includes('Scroll to New posts')) {
                // Create a span to wrap the text so we can hide it
                const span = document.createElement('span');
                span.style.display = 'none';
                span.textContent = nextSibling.textContent;
                nextSibling.parentNode.replaceChild(span, nextSibling);
                break;
            }
            nextSibling = nextSibling.nextSibling;
        }

        // Create the auto scroll checkbox element
        const autoCheckbox = document.createElement('input');
        autoCheckbox.type = 'checkbox';
        autoCheckbox.id = 'auto-scroll-claude';
        autoCheckbox.className = 'auto-scroll-claude';

        // Load and apply saved state
        const savedState = loadAutoScrollState();
        autoCheckbox.checked = savedState;

        // Create label text with closing parenthesis
        const labelText = document.createTextNode(' Auto Scroll)');

        // Find the parent container and replace the original checkbox
        const parentContainer = originalCheckbox.parentElement;

        // Insert the new checkbox in the same position as the original
        parentContainer.insertBefore(autoCheckbox, originalCheckbox);
        parentContainer.insertBefore(labelText, originalCheckbox);

        return autoCheckbox;
    }

    // Function to handle new posts detected
    function handleNewPosts() {
        // IMPORTANT: Check if we should scroll BEFORE updating our post record
        const shouldScrollToNew = shouldScroll();

        // Update our record of posts first
        updatePostRecord();

        // Check if auto scroll is enabled
        if (autoScrollCheckbox && autoScrollCheckbox.checked) {
            // Use the scroll decision we made before updating
            if (shouldScrollToNew) {
                scrollToBottom();
            }
        }
    }

    // Function to monitor for new posts
    function monitorForNewPosts() {
        if (checkForNewPosts()) {
            handleNewPosts();
        }
    }

    // Function to disable original scroll when auto scroll is active
    function manageScrollBehavior() {
        if (!originalScrollCheckbox || !autoScrollCheckbox) return;

        // When auto scroll is checked, uncheck the original scroll
        if (autoScrollCheckbox.checked && originalScrollCheckbox.checked) {
            originalScrollCheckbox.checked = false;
        }
    }

    // Function to set up checkbox event listeners
    function setupCheckboxListeners() {
        if (autoScrollCheckbox) {
            autoScrollCheckbox.addEventListener('change', function() {
                const isEnabled = this.checked;

                // Save the state
                saveAutoScrollState(isEnabled);

                if (isEnabled) {
                    // Disable original scroll to prevent conflicts
                    if (originalScrollCheckbox && originalScrollCheckbox.checked) {
                        originalScrollCheckbox.checked = false;
                    }
                }
            });
        }

        if (originalScrollCheckbox) {
            originalScrollCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    // Disable auto scroll to prevent conflicts
                    if (autoScrollCheckbox && autoScrollCheckbox.checked) {
                        autoScrollCheckbox.checked = false;
                        // Save the disabled state
                        saveAutoScrollState(false);
                    }
                }
            });
        }
    }

    // Function to set up DOM observer for new posts
    function setupObserver() {
        // Disconnect existing observer
        if (observer) {
            observer.disconnect();
        }

        // Create new observer to watch for DOM changes
        observer = new MutationObserver(function(mutations) {
            let shouldCheck = false;

            mutations.forEach(function(mutation) {
                // Check if nodes were added
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Check if any added nodes might be posts
                    for (let node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Check if it's a post or contains posts (holotower specific)
                            if (node.matches && (
                                node.matches('p.intro, div.post, .post_no') ||
                                node.querySelector('p.intro, div.post, .post_no')
                            )) {
                                shouldCheck = true;
                                break;
                            }
                        }
                    }
                }
            });

            if (shouldCheck) {
                // Delay slightly to allow DOM to settle
                setTimeout(monitorForNewPosts, 100);
            }
        });

        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Function to initialize the script
    function initialize() {
        // Remove any existing Smart Scroll elements from previous versions
        const existingSmartScrollElements = document.querySelectorAll('#smart-scroll, .smart-scroll');
        existingSmartScrollElements.forEach(el => {
            const parent = el.parentElement;
            if (parent && parent.tagName === 'SPAN') {
                parent.remove(); // Remove the entire span wrapper
            } else {
                el.remove(); // Remove just the element
            }
        });

        // Find the original scroll checkbox
        originalScrollCheckbox = findOriginalScrollCheckbox();
        if (!originalScrollCheckbox) return;

        // Create the auto scroll checkbox (this will load and apply saved state)
        autoScrollCheckbox = createAutoScrollCheckbox();
        if (!autoScrollCheckbox) return;

        // Initialize post record
        updatePostRecord();

        // Set up checkbox event listeners
        setupCheckboxListeners();

        // Set up observer for new posts
        setupObserver();

        // Apply initial state management
        manageScrollBehavior();
    }

    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        // DOM already loaded
        setTimeout(initialize, 500); // Small delay to ensure page is fully rendered
    }

    // Also try to re-initialize if page content changes significantly
    let reinitTimeout;
    const reinitializeIfNeeded = function() {
        clearTimeout(reinitTimeout);
        reinitTimeout = setTimeout(function() {
            if (!originalScrollCheckbox || !document.contains(originalScrollCheckbox) ||
                !autoScrollCheckbox || !document.contains(autoScrollCheckbox)) {
                initialize();
            }
        }, 1000);
    };

    // Watch for major page changes
    if (typeof MutationObserver !== 'undefined') {
        const pageObserver = new MutationObserver(reinitializeIfNeeded);
        pageObserver.observe(document.body, { childList: true, subtree: false });
    }

})();