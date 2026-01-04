// ==UserScript==
// @name         LinkedIn Saved Posts Extractor
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Extracts and exports URLs, author names, and a summary from LinkedIn saved posts.
// @author       Gemini assisted by @ProtoPioneer
// @match        https://www.linkedin.com/my-items/saved-posts/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linkedin.com
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        window.scrollTo
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/540204/LinkedIn%20Saved%20Posts%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/540204/LinkedIn%20Saved%20Posts%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Constants and Selectors ---
    const TARGET_PATHNAME = '/my-items/saved-posts/'; // Explicitly define the target pathname
    const PAGE_LOAD_SELECTOR = '.scaffold-finite-scroll__content';
    const SIDEBAR_CONTAINER_SELECTOR = 'section.artdeco-card'; // Selector for the sidebar section
    const POST_ITEM_SELECTOR = 'div.workflow-results-container ul[role=list] li';
    // Updated selector to target the div containing the URN
    const POST_URN_DIV_SELECTOR = 'div [data-chameleon-result-urn^="urn:li:activity:"]';
    const AUTHOR_NAME_SELECTOR = 'div [data-chameleon-result-urn^="urn:li:activity:"] div.entity-result__content-actor span a';
    const SHOW_MORE_BUTTON_SELECTOR = 'button.scaffold-finite-scroll__load-button';
    const SUMMARY_SELECTOR = 'div [data-chameleon-result-urn^="urn:li:activity:"] p.entity-result__content-summary'; // Selector for the summary
    const SCROLL_DELAY_MS = 2000; // Increased delay after scrolling/clicking to allow content to load
    const MAX_AUTO_SCROLL_DURATION_MS = 5 * 60 * 1000; // 5 minutes for automatic scroll mode

    let extractedPosts = new Map(); // Using Map to store unique posts by URL
    let extractionInProgress = false;
    let extractionButton = null;
    let scrollModeDropdown = null; // Reference to the new scroll mode dropdown
    let numPagesInput = null;      // Reference to the new number of pages input
    let numPagesLabel = null;      // Reference to the new number of pages label
    let outputFormatDropdown = null; // Reference to the new output format dropdown

    // --- Utility Functions ---

    /**
     * Sanitize string by removing control characters that might cause encoding issues.
     * Preserves printable ASCII and most common Unicode characters.
     * @param {string} str - The input string to sanitize.
     * @returns {string} The sanitized string.
     */
    function sanitizeString(str) {
        if (typeof str !== 'string') return '';
        // Remove ASCII control characters (0x00-0x1F) and C1 control characters (0x7F-0x9F)
        // This regex ensures that only printable characters and common Unicode characters remain.
        return str.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
    }

    /**
     * Waits for an element to appear on the page.
     * @param {string} selector - The CSS selector of the element to wait for.
     * @param {number} timeout - Maximum time to wait in milliseconds.
     * @returns {Promise<HTMLElement>} A promise that resolves with the element or rejects if timed out.
     */
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const interval = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(interval);
                    resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    clearInterval(interval);
                    reject(new Error(`Timeout waiting for element: ${selector}`));
                }
            }, 500); // Check every 500ms
        });
    }

    /**
     * Extracts data from all currently visible saved posts.
     */
    function extractVisiblePosts() {
        const postElements = document.querySelectorAll(POST_ITEM_SELECTOR);
        postElements.forEach((postElement, index) => { // Added index parameter
            console.log(`Processing post element at index: ${index}`); // Log the current index
            try {
                // Find the div containing the URN
                const urnDivElement = postElement.querySelector(POST_URN_DIV_SELECTOR);
                let postUrl = null;

                if (urnDivElement) {
                    const urn = urnDivElement.dataset.chameleonResultUrn;
                    if (urn) {
                        // Construct the full LinkedIn URL from the URN
                        postUrl = `https://www.linkedin.com/feed/update/${urn}/`;
                    }
                }

                const authorNameElements = postElement.querySelectorAll(AUTHOR_NAME_SELECTOR);
                let authorNames = Array.from(authorNameElements)
                                        .map(el => el.innerText.split('\n')[0].trim())
                                        .filter(name => name)
                                        .join(';');

                // Sanitize authorNames
                authorNames = sanitizeString(authorNames);

                // Extract the summary content
                const summaryElement = postElement.querySelector(SUMMARY_SELECTOR);
                // Clean up summary text: remove "…ver mais" and trim whitespace
                let summary = summaryElement ? summaryElement.textContent.replace(/…ver mais$/, '').trim() : '';
                // Replace line breaks with spaces for CSV compatibility
                summary = summary.replace(/(\r\n|\n|\r)/gm, " ");
                // Sanitize summary
                summary = sanitizeString(summary);

                // Ensure summary is not empty (after sanitization)
                if(summary.length === 0) {
                    console.warn('%cWarning: Summary is empty for this post.', 'color: orange;', summaryElement);
                } else {
                    // Escape double quotes for CSV only if it's not empty
                    summary = summary.replace(/"/g, '""');
                }

                if (postUrl && authorNames) {
                    if (!extractedPosts.has(postUrl)) {
                        extractedPosts.set(postUrl, { author: authorNames, url: postUrl, summary: summary });
                        console.info(`Extracted: Author(s) - "${authorNames}", URL - "${postUrl}", Summary - "${summary}"`); // Added console.info
                    }
                } else {
                    console.warn('%cError: Could not extract full data for a post.', 'color: yellow;');
                    console.warn('%cPost Element:', 'color: yellow;', postElement);
                    console.warn('%cExtracted urnDivElement: ', 'color: yellow;', urnDivElement);
                    console.warn('%cExtracted URL:', 'color: yellow;', postUrl);
                    console.warn('%cExtracted Author(s):', 'color: yellow;', authorNames);
                    console.warn('%cExtracted Summary:', 'color: yellow;', summary);
                }
            } catch (error) {
                console.warn(`%cError processing a post element: ${error.message}`, 'color: yellow;');
                console.warn('%cProblematic element:', 'color: yellow;', postElement);
            }
        });
    }

    /**
     * Scrolls the page to the bottom.
     */
    function scrollToBottom() {
        window.scrollTo(0, document.body.scrollHeight);
    }

    /**
     * Clicks the "Show more results" button if it exists.
     * @returns {boolean} True if the button was clicked, false otherwise.
     */
    function clickShowMoreButton() {
        const showMoreButton = document.querySelector(SHOW_MORE_BUTTON_SELECTOR);
        if (showMoreButton && !showMoreButton.disabled) {
            showMoreButton.click();
            return true;
        }
        return false;
    }

    /**
     * Handles the scrolling and extraction logic based on the chosen mode.
     * @param {number} scrollMode - 1 for manual pages, 2 for auto until end/timeout.
     * @param {number} numPagesToScroll - Number of pages to scroll for manual mode.
     * @returns {Promise<void>}
     */
    async function handleScrolling(scrollMode, numPagesToScroll) {
        if (scrollMode === 1) { // Manual pages
            for (let i = 0; i < numPagesToScroll; i++) {
                scrollToBottom();
                await new Promise(resolve => setTimeout(resolve, SCROLL_DELAY_MS / 2)); // Short wait for scroll
                const clicked = clickShowMoreButton();
                if (!clicked && i < numPagesToScroll - 1) {
                    console.log('No more "Show more results" button found, stopping manual scroll early.');
                    break;
                }
                await new Promise(resolve => setTimeout(resolve, SCROLL_DELAY_MS)); // Wait for content to load
                extractVisiblePosts();
            }
        } else if (scrollMode === 2) { // Auto until end/timeout
            const startTime = Date.now();
            let noNewContentCount = 0;
            const MAX_NO_NEW_CONTENT_CHECKS = 3; // Stop if no new content for a few checks

            while (Date.now() - startTime < MAX_AUTO_SCROLL_DURATION_MS) {
                const initialHeight = document.body.scrollHeight;
                scrollToBottom();
                await new Promise(resolve => setTimeout(resolve, SCROLL_DELAY_MS)); // Wait for scroll and potential initial content load

                // Check if the "Show more" button exists and is clickable
                const buttonExistsAndClickable = clickShowMoreButton();

                // Wait again for content to load after potential button click
                await new Promise(resolve => setTimeout(resolve, SCROLL_DELAY_MS));
                extractVisiblePosts();

                const newHeight = document.body.scrollHeight;

                if (newHeight === initialHeight && !buttonExistsAndClickable) {
                    // No new content loaded and no button to click, increment counter
                    noNewContentCount++;
                    console.log(`No new content or button. No new content count: ${noNewContentCount}`);
                    if (noNewContentCount >= MAX_NO_NEW_CONTENT_CHECKS) {
                        console.log('Page height not changing and no clickable "Show more results" button. Assuming end of content.');
                        break; // Exit loop if no new content for several checks
                    }
                } else {
                    // Content loaded or button was clicked, reset counter
                    noNewContentCount = 0;
                }
            }
            console.log('Automatic scrolling finished (either reached end or timed out).');
        }
    }

    /**
     * Initiates the extraction process.
     */
    async function startExtraction() {
        if (extractionInProgress) {
            console.log('Extraction already in progress.');
            return;
        }
        extractionInProgress = true;
        extractionButton.textContent = 'Extracting...';
        extractionButton.disabled = true;

        // Get values from UI elements
        const scrollMode = parseInt(scrollModeDropdown.value, 10);
        let numPagesToScroll = 0;
        if (scrollMode === 1) {
            numPagesToScroll = parseInt(numPagesInput.value, 10);
        }
        const outputFormat = outputFormatDropdown.value;

        // Validation based on UI values
        if (isNaN(scrollMode) || (scrollMode !== 1 && scrollMode !== 2)) {
            alert('Invalid scroll mode selected.');
            extractionInProgress = false;
            extractionButton.textContent = 'Extract LinkedIn Posts';
            extractionButton.disabled = false;
            return;
        }

        if (scrollMode === 1 && (isNaN(numPagesToScroll) || numPagesToScroll <= 0)) {
            alert('Invalid number of pages for manual scroll. Please enter a positive number.');
            extractionInProgress = false;
            extractionButton.textContent = 'Extract LinkedIn Posts';
            extractionButton.disabled = false;
            return;
        }

        if (!['1', '2', '3'].includes(outputFormat)) {
            alert('Invalid output format selected.');
            extractionInProgress = false;
            extractionButton.textContent = 'Extract LinkedIn Posts';
            extractionButton.disabled = false;
            return;
        }

        extractedPosts.clear(); // Clear previous extraction
        extractVisiblePosts(); // Extract initially visible posts

        try {
            await handleScrolling(scrollMode, numPagesToScroll);
            extractVisiblePosts(); // Final extraction after all scrolling is done

            const postsArray = Array.from(extractedPosts.values());
            let output = '';

            switch (outputFormat) {
                case '1': // Clipboard (URLs only)
                    output = postsArray.map(post => post.url).join('\n');
                    GM_setClipboard(output);
                    alert(`Copied ${postsArray.length} URLs to clipboard!`);
                    break;
                case '2': // CSV (now comma-separated)
                    // Add Summary header and properly quote summary content
                    output = 'Author(s),Post URL,Summary\n' + postsArray.map(post => {
                        // The summary is already sanitized and double quotes escaped in extractVisiblePosts
                        // So, just wrap it in double quotes for CSV
                        return `${post.author},${post.url},"${post.summary}"`;
                    }).join('\n');
                    openNewTabWithContent('text/csv', output, 'linkedin_saved_posts.csv');
                    alert(`Generated CSV for ${postsArray.length} posts. Check new tab.`);
                    break;
                case '3': // JSON Array
                    output = JSON.stringify(postsArray, null, 2);
                    openNewTabWithContent('application/json', output, 'linkedin_saved_posts.json');
                    alert(`Generated JSON for ${postsArray.length} posts. Check new tab.`);
                    break;
            }

        } catch (error) {
            console.error('An error occurred during extraction:', error);
            alert('An error occurred during extraction. Check console for details.');
        } finally {
            extractionInProgress = false;
            extractionButton.textContent = 'Extract LinkedIn Posts';
            extractionButton.disabled = false;
        }
    }

    /**
     * Opens a new tab with the given content.
     * @param {string} mimeType - The MIME type of the content (e.g., 'text/csv', 'application/json').
     * @param {string} content - The content string.
     * @param {string} filename - The suggested filename for download.
     */
    function openNewTabWithContent(mimeType, content, filename) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.target = '_blank';
        document.body.appendChild(a); // Append to body to make it clickable
        a.click();
        document.body.removeChild(a); // Clean up
        URL.revokeObjectURL(url); // Release the object URL
    }

    // --- UI Setup ---

    /**
     * Adds the extraction button and options to the page.
     */
    function addExtractionButton() {
        // Only add the button if the current URL's pathname matches the target
        if (window.location.pathname === TARGET_PATHNAME) {
            GM_addStyle(`
                .linkedin-extractor-controls {
                    padding: 10px;
                    border-top: 1px solid #e0e0e0;
                    margin-top: 10px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .linkedin-extractor-controls label {
                    font-size: 14px;
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 5px;
                    display: block;
                }
                .linkedin-extractor-controls select,
                .linkedin-extractor-controls input[type="number"] {
                    width: calc(100% - 20px); /* Adjust width to fit sidebar with padding */
                    padding: 6px 8px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 14px;
                    box-sizing: border-box; /* Include padding and border in the element's total width and height */
                    position: relative; /* Ensure z-index works */
                    z-index: 10001; /* Higher than other elements */
                    background-color: white; /* Ensure background is white for visibility */
                }
                .linkedin-extractor-button {
                    width: calc(100% - 20px); /* Adjust width to fit sidebar with padding */
                    margin: 10px auto 0; /* Center button and add vertical margin */
                    display: block; /* Make it a block element for margin:auto to work */
                    background-color: #0073b1; /* LinkedIn blue */
                    color: white;
                    padding: 10px 15px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 16px;
                    z-index: 10000;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                    transition: background-color 0.3s ease, transform 0.2s ease;
                    font-family: "Inter", sans-serif;
                }
                .linkedin-extractor-button:hover:not(:disabled) {
                    background-color: #005f91;
                    transform: translateY(-2px);
                }
                .linkedin-extractor-button:disabled {
                    background-color: #cccccc;
                    cursor: not-allowed;
                }
            `);

            const sidebarContainer = document.querySelector(SIDEBAR_CONTAINER_SELECTOR);
            if (!sidebarContainer) {
                console.error('Could not find the sidebar container to add the button and controls.');
                return;
            }

            // Create a container for all controls
            const controlsContainer = document.createElement('div');
            controlsContainer.className = 'linkedin-extractor-controls';

            // --- Output Format Dropdown ---
            const outputFormatLabel = document.createElement('label');
            outputFormatLabel.textContent = 'Output Format:';
            outputFormatDropdown = document.createElement('select');
            outputFormatDropdown.id = 'linkedin-output-format';

            // Create and append options for output format
            const outputOptionClipboard = document.createElement('option');
            outputOptionClipboard.value = '1';
            outputOptionClipboard.textContent = 'Clipboard (URLs only)';
            outputFormatDropdown.appendChild(outputOptionClipboard);

            const outputOptionCSV = document.createElement('option');
            outputOptionCSV.value = '2';
            outputOptionCSV.textContent = 'CSV (Author,URL,Summary)'; // Updated text for CSV option
            outputFormatDropdown.appendChild(outputOptionCSV);

            const outputOptionJSON = document.createElement('option');
            outputOptionJSON.value = '3';
            outputOptionJSON.textContent = 'JSON Array';
            outputFormatDropdown.appendChild(outputOptionJSON);

            controlsContainer.appendChild(outputFormatLabel);
            controlsContainer.appendChild(outputFormatDropdown);

            // --- Scroll Mode Dropdown ---
            const scrollModeLabel = document.createElement('label');
            scrollModeLabel.textContent = 'Scroll Mode:';
            scrollModeDropdown = document.createElement('select');
            scrollModeDropdown.id = 'linkedin-scroll-mode';

            // Create and append options for scroll mode
            const optionAuto = document.createElement('option');
            optionAuto.value = '2';
            optionAuto.textContent = 'Automatic (until end or 5 min)';
            scrollModeDropdown.appendChild(optionAuto);

            const optionManual = document.createElement('option');
            optionManual.value = '1';
            optionManual.textContent = 'Manual (specify pages)';
            scrollModeDropdown.appendChild(optionManual);

            controlsContainer.appendChild(scrollModeLabel);
            controlsContainer.appendChild(scrollModeDropdown);

            // --- Number of Pages Input (initially hidden) ---
            numPagesLabel = document.createElement('label'); // Assign to global variable
            numPagesLabel.textContent = 'Number of Pages:';
            numPagesInput = document.createElement('input'); // Assign to global variable
            numPagesInput.type = 'number';
            numPagesInput.id = 'linkedin-num-pages';
            numPagesInput.min = '1';
            numPagesInput.value = '5'; // Default value
            // Initially hide both label and input
            numPagesLabel.style.display = 'none';
            numPagesInput.style.display = 'none';
            controlsContainer.appendChild(numPagesLabel);
            controlsContainer.appendChild(numPagesInput);

            // Toggle visibility of numPagesInput and numPagesLabel based on scrollModeDropdown selection
            scrollModeDropdown.addEventListener('change', () => {
                console.log('Scroll Mode changed to:', scrollModeDropdown.value); // Log change
                if (scrollModeDropdown.value === '1') {
                    numPagesLabel.style.display = 'block';
                    numPagesInput.style.display = 'block';
                } else {
                    numPagesLabel.style.display = 'none';
                    numPagesInput.style.display = 'none';
                }
            });

            // --- Extraction Button ---
            extractionButton = document.createElement('button');
            extractionButton.className = 'linkedin-extractor-button';
            extractionButton.textContent = 'Extract LinkedIn Posts';
            extractionButton.addEventListener('click', startExtraction);
            controlsContainer.appendChild(extractionButton);

            // Append the entire controls container to the sidebar
            sidebarContainer.appendChild(controlsContainer);
            console.log('Extraction button and controls added to the sidebar.');

        } else {
            console.log(`Current path "${window.location.pathname}" does not match target path "${TARGET_PATHNAME}". Button and controls not added.`);
        }
    }

    // --- Main Execution ---
    waitForElement(PAGE_LOAD_SELECTOR)
        .then(() => {
            console.log('LinkedIn saved posts page loaded. Attempting to add extraction button and controls.');
            addExtractionButton();
        })
        .catch(error => {
            console.error('Failed to load LinkedIn saved posts page or element not found:', error);
        });

})();
