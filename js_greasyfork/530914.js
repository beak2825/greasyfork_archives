// ==UserScript==
// @name         SimpCity Replies
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  Adds a "View Replies" button under each post with improved performance and styling.
// @author       remuru
// @match        https://simpcity.cr/*
// @match        https://simpcity.su/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      simpcity.cr
// @connect      simpcity.su
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530914/SimpCity%20Replies.user.js
// @updateURL https://update.greasyfork.org/scripts/530914/SimpCity%20Replies.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Constants ---
    const BUTTON_TEXT_VIEW = "View Replies";
    const BUTTON_TEXT_HIDE = "Hide Replies";
    const LOADING_TEXT_BASE = "Loading replies";
    const NO_REPLIES_TEXT = "<strong>No replies found.</strong>";
    const ERROR_PREFIX = '<strong style="color: red;">Error:</strong>';

    let fullDomain = window.location.hostname;
    let domainParts = fullDomain.split('.');
    let mainDomain = domainParts.slice(-2).join('.');

    // --- CSS Styling ---
    GM_addStyle(`
        .sc-replies-button {
            margin-top: 10px;
            cursor: pointer;
            /* Add other button styles as needed - using default browser/site styles for now */
            padding: 5px 10px;
            border: 1px solid #555;
            background-color: #444;
            color: #ddd;
            border-radius: 3px;
        }
        .sc-replies-button:hover {
            background-color: #555;
        }
        .sc-replies-container {
            margin-top: 10px;
            border: 1px solid #444;
            padding: 10px;
            background-color: #2e2e2e; /* Slightly different background */
            border-radius: 3px;
        }
        .sc-replies-container[data-loading="true"] strong {
            display: inline-block; /* Needed for animation */
        }
        .sc-replies-loading-dots::after {
            display: inline-block;
            animation: sc-ellipsis 1.25s infinite;
            content: ".";
            width: 1em;
            text-align: left;
        }
        @keyframes sc-ellipsis {
            0% { content: "."; }
            33% { content: ".."; }
            66% { content: "..."; }
        }
        .sc-replies-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        .sc-replies-table th, .sc-replies-table td {
            padding: 8px;
            border: 1px solid #4a4a4a; /* Slightly adjusted border */
            text-align: left;
        }
        .sc-replies-table th {
            background: #3a3a3a; /* Adjusted header background */
            text-align: center;
            font-weight: bold;
        }
        .sc-replies-table tr:nth-child(even) {
            background-color: #333; /* Zebra striping */
        }
         .sc-replies-table td:nth-child(1), /* Post Num */
         .sc-replies-table td:nth-child(2)  /* Date */
         {
            text-align: center;
            white-space: nowrap; /* Prevent date/number wrapping */
         }
         .sc-replies-table th:nth-child(1), /* Post Num Header */
         .sc-replies-table th:nth-child(2)  /* Date Header */
         {
             width: 12%;
         }
         .sc-replies-table th:nth-child(3) { /* Reply Header */
             width: 76%;
             text-align: left;
         }
        .sc-replies-table a {
             color: #4b9dff; /* Link color */
        }
        .sc-replies-table a:hover {
             text-decoration: underline;
        }
    `);

    // --- Helper Functions ---

    const extractThreadId = (postHeaderLink) => {
        // Regex remains the same, seems specific enough
        const match = postHeaderLink?.match(/\.([0-9]+)\/post-/);
        return match ? match[1] : null;
    };

    const convertLinks = (text) => {
        if (!text) return '';
        // Basic URL regex, find http/https links
        const urlRegex = /(\b(https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        // Use textContent first to prevent potential XSS if source has raw HTML
        const safeText = document.createElement('div');
        safeText.textContent = text;
        // Replace URLs in the safe text
        return safeText.innerHTML.replace(urlRegex, (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`);
    };

    const createLoadingContainer = (parent) => {
        const container = document.createElement('div');
        container.className = 'sc-replies-container';
        container.dataset.loading = "true"; // Mark as loading

        const loadingText = document.createElement('strong');
        loadingText.textContent = LOADING_TEXT_BASE;
        loadingText.className = 'sc-replies-loading-dots'; // Add class for CSS animation
        container.appendChild(loadingText);

        parent.appendChild(container);
        return container;
    };

    const showError = (container, message) => {
        container.innerHTML = `${ERROR_PREFIX} ${message}`;
        container.dataset.loading = "false"; // Ensure loading state is cleared on error
    };

    const fetchAnswers = (searchURL, container) => {
        console.log("Fetching replies from:", searchURL);
        GM_xmlhttpRequest({
            method: "GET",
            url: searchURL,
            onload: (response) => {
                container.dataset.loading = "false"; // Stop loading animation

                if (response.status >= 200 && response.status < 300) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, "text/html");
                    // Use a more specific selector if possible, but this seems standard for XenForo search results
                    const answerBlocks = doc.querySelectorAll("li.block-row.block-row--separated.js-inlineModContainer[data-author]");

                    if (!answerBlocks || answerBlocks.length === 0) {
                        container.innerHTML = NO_REPLIES_TEXT;
                        return;
                    }

                    // Clear loading text
                    container.innerHTML = "";

                    // Create table structure
                    const table = document.createElement("table");
                    table.className = "sc-replies-table";
                    table.innerHTML = `
                        <thead>
                            <tr>
                                <th>Post #</th>
                                <th>Date</th>
                                <th>Reply Snippet</th>
                            </tr>
                        </thead>`;
                    const tbody = document.createElement("tbody");
                    const fragment = document.createDocumentFragment(); // Use fragment for efficiency

                    answerBlocks.forEach((block) => {
                        // Use optional chaining ?. for safer access
                        const postLink = block.querySelector('.contentRow-main a[href*="/post-"]');
                        const postTime = block.querySelector('time.u-dt');
                        const contentSnippet = block.querySelector('.contentRow-snippet');

                        // Extract post number more reliably from the link itself if possible
                        let postIdText = 'N/A';
                        const postIdMatch = postLink?.href?.match(/\/post-(\d+)/);
                        if (postIdMatch) {
                            postIdText = `#${postIdMatch[1]}`;
                        } else {
                             // Fallback to the list item if needed (less reliable)
                             const postIdElement = block.querySelector('.contentRow-minor.contentRow-minor--hideLinks li:nth-child(2)'); // Example: adjust if needed
                             if (postIdElement) postIdText = postIdElement.textContent.trim();
                        }


                        if (postLink?.href && postTime && contentSnippet) {
                            const row = document.createElement("tr");

                            // Post number (link)
                            const postIdCell = document.createElement("td");
                            const linkElement = document.createElement("a");
                            linkElement.href = postLink.href;
                            linkElement.textContent = postIdText;
                            linkElement.target = "_blank";
                            linkElement.rel = "noopener noreferrer";
                            postIdCell.appendChild(linkElement);

                            // Date
                            const timeCell = document.createElement("td");
                            timeCell.textContent = postTime.textContent.trim();
                            timeCell.title = postTime.getAttribute('datetime') || postTime.getAttribute('data-time-string') || ''; // Add tooltip with full date if available

                            // Reply content
                            const contentCell = document.createElement("td");
                            // Use convertLinks for safety and functionality
                            contentCell.innerHTML = convertLinks(contentSnippet.textContent.trim());

                            row.append(postIdCell, timeCell, contentCell);
                            fragment.appendChild(row); // Append row to fragment
                        } else {
                            console.warn("Skipping reply block, missing required elements:", block);
                        }
                    });

                    tbody.appendChild(fragment); // Append fragment to tbody
                    table.appendChild(tbody);
                    container.appendChild(table);

                } else {
                    showError(container, `Failed to load replies. Status: ${response.status}`);
                }
            },
            onerror: (error) => {
                console.error("GM_xmlhttpRequest error:", error);
                showError(container, "Network error while loading replies.");
                container.dataset.loading = "false";
            },
            ontimeout: () => {
                 showError(container, "Request timed out while loading replies.");
                 container.dataset.loading = "false";
            }
        });
    };

    const addAnswerButton = (postElement) => {
        const mainContainer = postElement.querySelector('.message-main.js-quickEditTarget') || postElement;
        if (!mainContainer) return; // Cannot add button if container not found

        // Check if button already exists
        if (mainContainer.querySelector('.sc-replies-button')) {
            return;
        }

        const btn = document.createElement('button');
        btn.textContent = BUTTON_TEXT_VIEW;
        btn.className = "sc-replies-button";

        mainContainer.appendChild(btn);

        btn.addEventListener('click', () => {
            let repliesContainer = postElement.querySelector('.sc-replies-container');

            if (repliesContainer) {
                // Toggle visibility
                const isHidden = repliesContainer.style.display === 'none';
                repliesContainer.style.display = isHidden ? 'block' : 'none';
                btn.textContent = isHidden ? BUTTON_TEXT_HIDE : BUTTON_TEXT_VIEW;
                return;
            }

            // --- Create container and fetch data ---
            repliesContainer = createLoadingContainer(mainContainer);
            btn.textContent = BUTTON_TEXT_HIDE; // Set text immediately

            // Find post ID (using data-content attribute often present on XenForo posts)
            const messageContent = postElement.closest('.message[data-content]');
            const postId = messageContent?.getAttribute('data-content')?.replace('post-', '');
            // Fallback to lb-id if data-content is not present
            const lbContainer = !postId ? postElement.querySelector('[data-lb-id]') : null;
            const postIdFallback = lbContainer?.getAttribute('data-lb-id')?.replace('post-', '');
            const finalPostId = postId || postIdFallback;

            if (!finalPostId) {
                showError(repliesContainer, "Could not determine Post ID.");
                btn.textContent = BUTTON_TEXT_VIEW; // Revert button text on immediate error
                btn.disabled = true; // Disable button if critical info missing
                return;
            }

            // Find thread ID
            const headerLink = postElement.querySelector('.message-attribution-main a[href*="/threads/"]');
            const threadId = extractThreadId(headerLink?.getAttribute("href"));

            if (!threadId) {
                showError(repliesContainer, "Could not determine Thread ID.");
                btn.textContent = BUTTON_TEXT_VIEW;
                btn.disabled = true;
                return;
            }

            const searchId = "1"; // Potentially fragile hardcoded value
            const searchURL = `https://${mainDomain}/search/${searchId}/?q=post-${finalPostId}&t=post&c[thread]=${threadId}&o=date`; // Added &o=date to sort by date (optional)

            fetchAnswers(searchURL, repliesContainer);
        });
    };

    // --- Main Execution ---

    // Function to process posts currently on the page
    const processPosts = () => {
        document.querySelectorAll(".message.message--post .message-inner").forEach(addAnswerButton);
    };

    // Initial run
    processPosts();


})();