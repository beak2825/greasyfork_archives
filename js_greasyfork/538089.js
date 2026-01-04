// ==UserScript==
// @name         AlphaXiv to ArXiv
// @namespace    https://github.com/pangahn/arxiv-navigator
// @version      0.1
// @description  Add a button to jump from alphaxiv.org to arxiv.org
// @author       pangahn
// @match        https://www.alphaxiv.org/abs/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538089/AlphaXiv%20to%20ArXiv.user.js
// @updateURL https://update.greasyfork.org/scripts/538089/AlphaXiv%20to%20ArXiv.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addArxivButton() {
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
            console.log('Target div not found, retrying...');
            return false;
        }

        // Check if button has already been added
        if (targetDiv.querySelector('.arxiv-jump-button')) {
            return true;
        }

        // Get paper ID from current URL
        const currentUrl = window.location.href;
        const match = currentUrl.match(/\/abs\/(.+)$/);

        if (!match) {
            console.log('Paper ID not found in URL');
            return true;
        }

        const paperId = match[1];
        const arxivUrl = `https://www.arxiv.org/abs/${paperId}`;

        // Create ArXiv jump button
        const arxivButton = document.createElement('button');
        arxivButton.className = 'arxiv-jump-button inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm ring-offset-white transition-all duration-200 outline-hidden focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-neutral-950 hover:bg-[#9a20360a] hover:text-custom-red dark:text-white dark:hover:bg-custom-red/25 enabled:active:ring-2 enabled:active:ring-[#9a20360a] size-10 rounded-full! h-8 w-8';
        arxivButton.setAttribute('aria-label', 'Jump to ArXiv');
        arxivButton.setAttribute('title', 'Jump to ArXiv');

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

        console.log('ArXiv jump button added successfully');
        return true;
    }

    // Try to add button after page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(addArxivButton, 100);
        });
    } else {
        // If page is already loaded, try immediately
        setTimeout(addArxivButton, 100);
    }

    // Use MutationObserver to monitor DOM changes, in case button container is dynamically loaded
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Delay execution to ensure DOM is fully updated
                setTimeout(function() {
                    if (addArxivButton()) {
                        observer.disconnect(); // Stop observing after button is successfully added
                    }
                }, 100);
            }
        });
    });

    // Start observing DOM changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Stop observing after 5 seconds (to prevent infinite observation)
    setTimeout(function() {
        observer.disconnect();
    }, 5000);

})();
