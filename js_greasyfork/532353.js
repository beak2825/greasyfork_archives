// ==UserScript==
// @name         YouTube "damn is 😂" Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a "damn is 😂" button to YouTube comments
// @author       Claude
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/532353/YouTube%20%22damn%20is%20%F0%9F%98%82%22%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/532353/YouTube%20%22damn%20is%20%F0%9F%98%82%22%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set debug mode to true for more console logging
    const DEBUG = true;

    function log(...args) {
        if (DEBUG) {
            console.log('[damn-is-button]', ...args);
        }
    }

    // Function to generate random emoji string
    function generateRandomEmojiString() {
        const emojis = ["😂", "❤️", "🎉"];
        const length = 5 + Math.floor(Math.random() * 46); // Between 5 and 50
        let result = "";

        for (let i = 0; i < length; i++) {
            result += emojis[Math.floor(Math.random() * emojis.length)];
        }

        return "damn is " + result;
    }

    // Function to process a single toolbar
    function processToolbar(toolbar) {
        // Skip if already processed
        if (toolbar.querySelector('.damn-is-button')) {
            return;
        }

        // Create a simple button
        const damnIsButton = document.createElement('button');
        damnIsButton.className = 'damn-is-button';
        damnIsButton.textContent = 'damn is 😂';
        damnIsButton.title = 'Add a "damn is 😂" comment';

        // Style the button to match YouTube's design
        damnIsButton.style.marginLeft = '8px';
        damnIsButton.style.border = 'none';
        damnIsButton.style.borderRadius = '18px';
        damnIsButton.style.padding = '0 16px';
        damnIsButton.style.height = '36px';
        damnIsButton.style.cursor = 'pointer';
        damnIsButton.style.fontSize = '14px';
        damnIsButton.style.fontFamily = 'Roboto, Arial, sans-serif';
        damnIsButton.style.color = 'var(--yt-spec-text-primary, #0f0f0f)';
        damnIsButton.style.backgroundColor = 'var(--yt-spec-badge-chip-background, rgba(0, 0, 0, 0.05))';

        // Add hover effects
        damnIsButton.addEventListener('mouseover', function() {
            this.style.backgroundColor = 'var(--yt-spec-10-percent-layer, rgba(0, 0, 0, 0.1))';
        });

        damnIsButton.addEventListener('mouseout', function() {
            this.style.backgroundColor = 'var(--yt-spec-badge-chip-background, rgba(0, 0, 0, 0.05))';
        });

        // Add click event
        damnIsButton.addEventListener('click', function() {
            log('Button clicked!');

            // Step 1: Click the reply button
            const replyButton = toolbar.querySelector('#reply-button-end>yt-button-shape>button');

            if (replyButton) {
                replyButton.click();
                log('Clicked reply button');
            } else {
                log('Reply button not found');
                return;
            }

            // Step 2: Wait for the input field to appear
            setTimeout(() => {
                // Find the input field
                const commentContainer = toolbar.closest('ytd-comment-thread-renderer');

                if (!commentContainer) {
                    log('Comment container not found');
                    return;
                }

                // Try different selectors for the input field
                const possibleSelectors = [
                    '#contenteditable-root',
                    'div[contenteditable="true"]',
                    '#commentbox div[contenteditable="true"]',
                    '#reply-dialog div[contenteditable="true"]'
                ];

                let inputField = null;

                // Try selectors on the comment container first
                for (const selector of possibleSelectors) {
                    inputField = commentContainer.querySelector(selector);
                    if (inputField) {
                        log('Found input field with selector:', selector);
                        break;
                    }
                }

                // If not found, try document-wide
                if (!inputField) {
                    for (const selector of possibleSelectors) {
                        inputField = document.querySelector(selector);
                        if (inputField) {
                            log('Found input field in document with selector:', selector);
                            break;
                        }
                    }
                }

                if (!inputField) {
                    log('Input field not found');
                    return;
                }

                // Generate and set the text
                const randomText = generateRandomEmojiString();
                log('Setting text:', randomText);

                inputField.textContent = randomText;
                inputField.dispatchEvent(new Event('input', { bubbles: true }));

                // Step 3: Wait for the submit button to become enabled
                const trySubmit = (attempts = 0) => {
                    if (attempts > 10) {
                        log('Max submit attempts reached');
                        return;
                    }

                    // Try different selectors for the submit button
                    const submitSelectors = [
                        '#submit-button button',
                        'ytd-button-renderer[id="submit-button"] button',
                        '#reply-dialog #submit-button button'
                    ];

                    let submitButton = null;

                    // Try selectors on the comment container first
                    for (const selector of submitSelectors) {
                        submitButton = commentContainer.querySelector(selector);
                        if (submitButton && !submitButton.disabled) {
                            log('Found enabled submit button with selector:', selector);
                            submitButton.click();
                            log('Clicked submit button');
                            return;
                        }
                    }

                    // If not found, try document-wide
                    for (const selector of submitSelectors) {
                        submitButton = document.querySelector(selector);
                        if (submitButton && !submitButton.disabled) {
                            log('Found enabled submit button in document with selector:', selector);
                            submitButton.click();
                            log('Clicked submit button');
                            return;
                        }
                    }

                    // Not found or disabled, try again
                    log(`Submit button not found or disabled, attempt ${attempts + 1}/10`);
                    setTimeout(() => trySubmit(attempts + 1), 300);
                };

                // Start trying to submit
                setTimeout(() => trySubmit(), 500);

            }, 500); // Wait for reply box to appear
        });

        // Append the button to the toolbar
        toolbar.appendChild(damnIsButton);
        log('Added button to toolbar');
    }

    // Function to process all comments
    function processComments() {
        const toolbars = document.querySelectorAll('ytd-comment-engagement-bar > #toolbar');
        log(`Found ${toolbars.length} comment toolbars`);

        toolbars.forEach(toolbar => {
            processToolbar(toolbar);
        });
    }

    // Set up MutationObserver to detect new comments
    function setupObserver() {
        const commentsSection = document.querySelector('ytd-comments, #comments');
        if (!commentsSection) {
            log('Comments section not found, will retry in 1s');
            setTimeout(setupObserver, 1000);
            return;
        }

        log('Comments section found, setting up observer');

        // Process existing comments
        processComments();

        // Create observer for new comments
        const observer = new MutationObserver(mutations => {
            let shouldProcess = false;

            for (const mutation of mutations) {
                if (mutation.addedNodes.length) {
                    shouldProcess = true;
                    break;
                }
            }

            if (shouldProcess) {
                if (observer.timeout) {
                    clearTimeout(observer.timeout);
                }

                observer.timeout = setTimeout(() => {
                    log('New content detected, processing comments');
                    processComments();
                    observer.timeout = null;
                }, 500);
            }
        });

        // Start observing
        observer.observe(commentsSection, {
            childList: true,
            subtree: true
        });

        // Also run periodically
        setInterval(processComments, 5000);

        log('Observer set up successfully');
    }

    // Initialize when DOM is ready
    log('Script loaded, waiting for page to fully load');
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupObserver);
    } else {
        setupObserver();
    }

    // Also run on page navigation (for SPA behavior)
    let lastUrl = location.href;
    const urlObserver = new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            log('URL changed, reinitializing');
            setTimeout(setupObserver, 2000);
        }
    });

    if (document.querySelector('head > title')) {
        urlObserver.observe(document.querySelector('head > title'), { subtree: true, childList: true });
    }
})();