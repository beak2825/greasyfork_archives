// ==UserScript==
// @name         ArXiv-AlphaXiv Navigator
// @namespace    https://github.com/pangahn/arxiv-navigator
// @version      0.1
// @description  Add buttons to jump between arxiv.org and alphaxiv.org for the same paper
// @author       pangahn
// @match        https://*.arxiv.org/abs/*
// @match        https://www.alphaxiv.org/abs/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538595/ArXiv-AlphaXiv%20Navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/538595/ArXiv-AlphaXiv%20Navigator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Debug utility function
    function log(message) {
        const DEBUG = true; // Set to false to disable logs in production
        if (DEBUG) console.log(`[ArXiv-AlphaXiv Navigator] ${message}`);
    }

    // Determine which site we're on
    const isArXiv = window.location.hostname.includes('arxiv.org');
    const isAlphaXiv = window.location.hostname.includes('alphaxiv.org');

    // Function to get the paper ID from the URL
    function getPaperId() {
        try {
            const url = window.location.href;
            let match;

            if (isArXiv) {
                // Match both formats: 2504.04736 and 2504.04736v2
                match = url.match(/arxiv\.org\/abs\/(\d+\.\d+(?:v\d+)?)/);
            } else if (isAlphaXiv) {
                match = url.match(/alphaxiv\.org\/abs\/(.+)$/);
            }

            if (!match) {
                log(`Failed to extract paper ID from URL: ${url}`);
                return null;
            }

            return match[1];
        } catch (error) {
            log(`Error extracting paper ID: ${error.message}`);
            return null;
        }
    }

    // Function to create and add jump button on ArXiv pages
    function addAlphaXivButton() {
        try {
            // Check if button already exists
            if (document.querySelector('a[href^="https://www.alphaxiv.org/abs/"]')) {
                log('AlphaXiv button already exists');
                return true;
            }

            const paperId = getPaperId();
            if (!paperId) {
                log('No paper ID found, cannot add AlphaXiv button');
                return false;
            }

            // Extract the base paper ID without version if present
            const baseId = paperId.split('v')[0];

            // Create the button element with consistent styling
            const button = document.createElement('a');
            button.href = `https://www.alphaxiv.org/abs/${baseId}`;
            button.className = 'abs-button download-pdf alphaxiv-jump-button';
            button.target = '_blank';
            button.textContent = 'View on AlphaXiv';
            button.style.display = 'inline-block';
            button.setAttribute('data-arxiv-navigator', 'true');
            button.setAttribute('title', 'Open this paper on AlphaXiv');

            // Find the View PDF link
            const pdfLink = document.querySelector('a.download-pdf');
            if (pdfLink) {
                // Find the parent li element
                const parentLi = pdfLink.closest('li');
                if (parentLi) {
                    // Create a new li element for our button
                    const newLi = document.createElement('li');
                    newLi.appendChild(button);

                    // Insert after the PDF link's li element
                    if (parentLi.nextSibling) {
                        parentLi.parentNode.insertBefore(newLi, parentLi.nextSibling);
                    } else {
                        parentLi.parentNode.appendChild(newLi);
                    }
                    log('AlphaXiv button added successfully');
                    return true;
                }
            }
            return false;
        } catch (error) {
            log(`Error adding AlphaXiv button: ${error.message}`);
            return false;
        }
    }

    // Function to create and add jump button on AlphaXiv pages
    function addArXivButton() {
        try {
            // Check if button already exists - faster than checking DOM structure
            if (document.querySelector('.arxiv-jump-button')) {
                log('ArXiv jump button already exists');
                return true;
            }

            // Use more precise selectors to find the target div container
            // Prioritize the most specific selector, then use backup selectors
            let targetDiv = document.querySelector('[data-sentry-component="RightSection"] .flex.items-center.space-x-2');

            // Backup selector 1: Locate through div containing the download button
            if (!targetDiv) {
                const downloadButton = document.querySelector('button[aria-label="Download from arXiv"]');
                if (downloadButton) {
                    targetDiv = downloadButton.closest('.flex.items-center.space-x-2');
                }
            }

            // Backup selector 2: Locate through button containing thumbs-up
            if (!targetDiv) {
                const thumbsUpButton = document.querySelector('svg.lucide-thumbs-up');
                if (thumbsUpButton) {
                    targetDiv = thumbsUpButton.closest('.flex.items-center.space-x-2');
                }
            }

            // Backup selector 3: Locate through div containing bookmark
            if (!targetDiv) {
                const bookmarkDiv = document.querySelector('[data-sentry-component="PaperFeedBookmarks"]');
                if (bookmarkDiv) {
                    targetDiv = bookmarkDiv.closest('.flex.items-center.space-x-2');
                }
            }

            // Backup selector 4: Last generic selector
            if (!targetDiv) {
                targetDiv = document.querySelector('.flex.items-center.space-x-2');
            }

            if (!targetDiv) {
                log('Target div not found, retrying...');
                return false;
            }

            // Double check if button has already been added
            if (targetDiv.querySelector('.arxiv-jump-button')) {
                return true;
            }

            // Get paper ID from current URL
            const paperId = getPaperId();
            if (!paperId) {
                log('Paper ID not found in URL');
                return true;
            }

            const arxivUrl = `https://www.arxiv.org/abs/${paperId}`;

            // Create ArXiv jump button
            const arxivButton = document.createElement('button');
            arxivButton.className = 'arxiv-jump-button inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm ring-offset-white transition-all duration-200 outline-hidden focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-neutral-950 hover:bg-[#9a20360a] hover:text-custom-red dark:text-white dark:hover:bg-custom-red/25 enabled:active:ring-2 enabled:active:ring-[#9a20360a] size-10 rounded-full! h-8 w-8';
            arxivButton.setAttribute('aria-label', 'Jump to ArXiv');
            arxivButton.setAttribute('title', 'Jump to ArXiv');
            arxivButton.setAttribute('data-arxiv-navigator', 'true');

            // Add ArXiv icon (using external link icon)
            arxivButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-external-link size-4" aria-hidden="true">
                    <path d="M15 3h6v6"></path>
                    <path d="M10 14 21 3"></path>
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                </svg>
            `;

            // Add click event
            arxivButton.addEventListener('click', function(e) {
                e.preventDefault();
                window.open(arxivUrl, '_blank');
            });

            // Insert button at the first position in div
            targetDiv.insertBefore(arxivButton, targetDiv.firstChild);

            log('ArXiv jump button added successfully');
            return true;
        } catch (error) {
            log(`Error adding ArXiv button: ${error.message}`);
            return false;
        }
    }

    // Main initialization function
    function initNavigator() {
        let success = false;

        if (isArXiv) {
            success = addAlphaXivButton();
        } else if (isAlphaXiv) {
            success = addArXivButton();
        }

        return success;
    }

    // Maintain state of button addition attempts
    let buttonAddAttempts = 0;
    const MAX_ATTEMPTS = 10;

    // Rate limiter for observer callback to prevent excessive processing
    let lastProcessTime = 0;
    const THROTTLE_INTERVAL = 200; // ms

    // Function to handle initialization with retry logic
    function tryAddButton() {
        // Check if button already exists
        if ((isArXiv && document.querySelector('.alphaxiv-jump-button')) ||
            (isAlphaXiv && document.querySelector('.arxiv-jump-button'))) {
            log('Button already exists, no need to add');
            return true;
        }

        // Try to add the button
        const success = initNavigator();

        // Increment attempt counter
        buttonAddAttempts++;

        if (success) {
            log(`Successfully added button on attempt ${buttonAddAttempts}`);
            return true;
        } else if (buttonAddAttempts >= MAX_ATTEMPTS) {
            log(`Failed to add button after ${MAX_ATTEMPTS} attempts, giving up`);
            return true; // Return true to stop retrying
        }

        return false;
    }

    // Throttled mutation observer callback
    function throttledObserverCallback(mutations) {
        const now = Date.now();
        if (now - lastProcessTime < THROTTLE_INTERVAL) return;

        lastProcessTime = now;

        // Check if button already exists
        if ((isArXiv && document.querySelector('.alphaxiv-jump-button')) ||
            (isAlphaXiv && document.querySelector('.arxiv-jump-button'))) {
            observer.disconnect();
            return;
        }

        // Process mutations
        for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Delay execution to ensure DOM is fully updated
                setTimeout(function() {
                    if (tryAddButton()) {
                        observer.disconnect();
                    }
                }, 100);
                break;
            }
        }
    }

    // Create MutationObserver
    const observer = new MutationObserver(throttledObserverCallback);

    // First attempt after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(function() {
                if (!tryAddButton()) {
                    // Start observing DOM changes if button wasn't added
                    observer.observe(document.body, {
                        childList: true,
                        subtree: true
                    });
                }
            }, 300);
        });
    } else {
        // If page is already loaded, try immediately
        setTimeout(function() {
            if (!tryAddButton()) {
                // Start observing DOM changes if button wasn't added
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
        }, 300);
    }

    // Stop observing after 10 seconds (to prevent infinite observation)
    setTimeout(function() {
        if (observer) {
            observer.disconnect();
            log('Disconnected observer after timeout');
        }
    }, 10000);

})();
