// ==UserScript==
// @name         LinkedIn Post Enhancer: Copy Link & Save to Raindrop.io
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds "Copy Link" and "Save to Raindrop.io" buttons to LinkedIn posts, including single post pages.
// @author       Gemini assisted by @ProtoPioneer
// @match        https://www.linkedin.com/feed/*
// @match        https://www.linkedin.com/posts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linkedin.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540241/LinkedIn%20Post%20Enhancer%3A%20Copy%20Link%20%20Save%20to%20Raindropio.user.js
// @updateURL https://update.greasyfork.org/scripts/540241/LinkedIn%20Post%20Enhancer%3A%20Copy%20Link%20%20Save%20to%20Raindropio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // SVG icon for the "Copy Link" button (clipboard)
    const copySVG = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="artdeco-button__icon">
            <path d="M16 1H4C2.9 1 2 1.9 2 3v14h2V3h12V1zm3 4H8C6.9 5 6 5.9 6 7v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
        </svg>
    `;

    // SVG icon for the "Copied!" state (clipboard with checkmark)
    const copiedSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0073B1" class="artdeco-button__icon">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
    `;

    // SVG icon for the "Save to Raindrop.io" button (simple raindrop/cloud)
    const raindropSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="artdeco-button__icon">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
        </svg>
    `;

    // Base URL for the Raindrop.io bookmarklet to add new links
    const raindropBaseUrl = 'https://app.raindrop.io/add';

    /**
     * Creates a styled button element that matches LinkedIn's social action bar buttons.
     * @param {string} iconHtml - The SVG HTML string to be used as the button's icon.
     * @param {string} text - The text label for the button.
     * @param {function} onClickHandler - The event handler function to execute when the button is clicked.
     * @returns {HTMLElement} The created HTML button element, wrapped in a span for correct LinkedIn styling.
     */
    function createActionButton(iconHtml, text, onClickHandler) {
        // Create the wrapper span that LinkedIn uses for its action buttons
        const buttonSpan = document.createElement('span');
        buttonSpan.classList.add(
            'feed-shared-social-action-bar__action-button',
            'feed-shared-social-action-bar--new-padding' // Maintains consistent padding with other buttons
        );
        buttonSpan.setAttribute('tabindex', '-1'); // Ensures proper tab navigation behavior

        // Create the actual button element
        const button = document.createElement('button');
        button.classList.add(
            'artdeco-button',
            'artdeco-button--muted',
            'artdeco-button--3',
            'artdeco-button--tertiary',
            'ember-view', // Mimic ember-view for consistent behavior, though not strictly functional
            'social-actions-button',
            'flex-wrap' // For flexible content layout within the button
        );
        button.setAttribute('role', 'button'); // Explicitly define role for accessibility
        button.setAttribute('type', 'button'); // Standard button type
        button.setAttribute('aria-label', text); // Provide an accessible label for screen readers

        // Create the inner content for the button (icon and text)
        const buttonContent = document.createElement('span');
        buttonContent.classList.add('artdeco-button__text');
        buttonContent.innerHTML = `
            <div class="flex-wrap justify-center artdeco-button__text align-items-center">
                ${iconHtml} <!-- Inject the SVG icon -->
                <span aria-hidden="true" class="artdeco-button__text social-action-button__text">${text}</span>
            </div>
        `;

        // Append content to button, and button to its wrapper span
        button.appendChild(buttonContent);
        button.addEventListener('click', onClickHandler); // Attach the click handler
        buttonSpan.appendChild(button);

        return buttonSpan;
    }

    /**
     * Extracts the canonical LinkedIn post URL from a given post element.
     * LinkedIn posts have a unique URN (Uniform Resource Name) in their data-id or data-urn attribute.
     * This URN is used to construct the direct link to the post.
     * @param {HTMLElement} postElement - The DOM element representing a single LinkedIn post.
     * @returns {string|null} The full URL of the post, or null if the URN cannot be found.
     */
    function extractLinkedInPostUrl(postElement) {
        let urn = postElement.getAttribute('data-id') || postElement.getAttribute('data-urn');
        if (urn && urn.startsWith('urn:li:activity:')) {
            const postId = urn.split(':').pop();
            return `https://www.linkedin.com/feed/update/urn:li:activity:${postId}/`;
        }
        return null;
    }

    /**
     * Extracts a suitable title, author, and content snippet for the LinkedIn post for bookmarking purposes.
     * @param {HTMLElement} postElement - The DOM element representing a single LinkedIn post.
     * @returns {{title: string, author: string, description: string}} An object containing the extracted data.
     */
    function extractLinkedInPostDetails(postElement) {
        let authorName = '';
        let postDescription = '';
        let postTitle = 'LinkedIn Post'; // Default title

        // Extract author name
        const actorNameElement = postElement.querySelector('.update-components-actor__title span[dir="ltr"] span[aria-hidden="true"]');
        if (actorNameElement) {
            authorName = actorNameElement.innerText.trim();
        }

        // Extract main text content/commentary of the post
        const commentaryElement = postElement.querySelector('.update-components-text span[dir="ltr"]');
        if (commentaryElement) {
            postDescription = commentaryElement.innerText.trim();
        }

        // Construct a more descriptive title for Raindrop.io
        if (authorName && postDescription) {
            postTitle = `${authorName} - ${postDescription.substring(0, 70).replace(/\n/g, ' ')}... - LinkedIn`;
        } else if (authorName) {
            postTitle = `${authorName}'s LinkedIn Post`;
        } else if (postDescription) {
             postTitle = `${postDescription.substring(0, 70).replace(/\n/g, ' ')}... - LinkedIn`;
        }

        return {
            title: postTitle,
            author: authorName,
            description: postDescription
        };
    }

    /**
     * Adds the custom "Copy Link" and "Save to Raindrop.io" buttons to a specific LinkedIn post.
     * It ensures buttons are only added once per post by marking the post element.
     * @param {HTMLElement} postElement - The DOM element of the LinkedIn post to which buttons should be added.
     */
    function addCustomButtons(postElement) {
        const socialActionBar = postElement.querySelector('.feed-shared-social-action-bar');

        // Check if the social action bar exists and if buttons have already been added to this specific post
        if (socialActionBar && !postElement.dataset.customButtonsAdded) {
            const postUrl = extractLinkedInPostUrl(postElement);
            const postDetails = extractLinkedInPostDetails(postElement);

            // If a URL cannot be extracted, log a warning and do not proceed with adding buttons
            if (!postUrl) {
                console.warn('Could not extract LinkedIn post URL for:', postElement);
                return;
            }

            // Mark this post element to indicate that custom buttons have been added,
            // preventing duplicate buttons on subsequent DOM mutations.
            postElement.dataset.customButtonsAdded = 'true';

            // --- 1. Create and configure the "Copy Link" Button ---
            const copyButton = createActionButton(copySVG, 'Copy Link', (event) => {
                event.stopPropagation(); // Stop event propagation to prevent triggering LinkedIn's default click handlers on the parent button area.

                // Attempt to copy the URL to the clipboard using the modern Clipboard API
                navigator.clipboard.writeText(postUrl)
                    .then(() => {
                        // Store original icon and text to revert after visual feedback
                        const originalIconHtml = copyButton.querySelector('.artdeco-button__icon').outerHTML;
                        const originalText = copyButton.querySelector('.social-action-button__text').innerText;

                        // Provide visual feedback: change icon to a checkmark and text to "Copied!"
                        copyButton.querySelector('.artdeco-button__icon').outerHTML = copiedSVG;
                        copyButton.querySelector('.social-action-button__text').innerText = 'Copied!';

                        // Revert the button's appearance back to its original state after a short delay
                        setTimeout(() => {
                            copyButton.querySelector('.artdeco-button__icon').outerHTML = originalIconHtml;
                            copyButton.querySelector('.social-action-button__text').innerText = originalText;
                        }, 1500); // Revert after 1.5 seconds
                        console.log('LinkedIn post link copied:', postUrl);
                    })
                    .catch(err => {
                        // Fallback for environments where navigator.clipboard.writeText() is not supported or blocked (e.g., some older browsers or stricter iframe policies)
                        console.error('Error copying LinkedIn link with Clipboard API, attempting fallback: ', err);
                        const tempInput = document.createElement('input');
                        tempInput.value = postUrl;
                        document.body.appendChild(tempInput);
                        tempInput.select(); // Select the text in the input
                        try {
                            document.execCommand('copy'); // Execute the copy command
                            console.log('LinkedIn post link copied (fallback):', postUrl);
                            // Provide visual feedback for fallback success
                            const originalIconHtml = copyButton.querySelector('.artdeco-button__icon').outerHTML;
                            const originalText = copyButton.querySelector('.social-action-button__text').innerText;
                            copyButton.querySelector('.artdeco-button__icon').outerHTML = copiedSVG;
                            copyButton.querySelector('.social-action-button__text').innerText = 'Copied!';
                            setTimeout(() => {
                                copyButton.querySelector('.artdeco-button__icon').outerHTML = originalIconHtml;
                                copyButton.querySelector('.social-action-button__text').innerText = originalText;
                            }, 1500);
                        } catch (fallbackErr) {
                            console.error('Fallback copy failed: ', fallbackErr);
                        } finally {
                            document.body.removeChild(tempInput); // Clean up the temporary input element
                        }
                    });
            });

            // --- 2. Create and configure the "Save to Raindrop.io" Button ---
            // Use dash as separator for author name in tags, and add "author-" prefix
            const sanitizedAuthorTag = 'author-' + postDetails.author.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();
            const tags = `linkedin.com,${sanitizedAuthorTag}`;

            // Construct the Raindrop.io bookmarklet URL with all extracted details
            const raindropUrl = `${raindropBaseUrl}?link=${encodeURIComponent(postUrl)}&title=${encodeURIComponent(postDetails.title)}&description=${encodeURIComponent(postDetails.description)}&tags=${encodeURIComponent(tags)}`;

            const raindropButton = createActionButton(raindropSVG, 'Save to Raindrop', (event) => {
                event.stopPropagation(); // Stop event propagation
                // Open the Raindrop.io bookmarking page in a new browser tab/window
                window.open(raindropUrl, '_blank');
                console.log('Opening Raindrop.io for:', postUrl);
            });

            // --- Append the new buttons to the social action bar ---
            // Find the last existing social action button (e.g., "Enviar" / "Send")
            const existingButtons = socialActionBar.querySelectorAll('.feed-shared-social-action-bar__action-button');
            if (existingButtons.length > 0) {
                const lastButton = existingButtons[existingButtons.length - 1];
                // Insert the new buttons immediately after the last existing button
                lastButton.after(copyButton);
                copyButton.after(raindropButton); // Insert Raindrop button after Copy button
            } else {
                // Fallback: If for some reason no existing buttons are found, just append to the action bar
                socialActionBar.appendChild(copyButton);
                socialActionBar.appendChild(raindropButton);
            }
        }
    }

    /**
     * Finds all LinkedIn post elements on the page and adds custom buttons if not already present.
     * This function now also accounts for the structure of single post pages.
     */
    function processAllLinkedInPosts() {
        // Select all elements that are identified as LinkedIn posts on the feed page
        document.querySelectorAll('div[data-id^="urn:li:activity:"]').forEach(postElement => {
            addCustomButtons(postElement);
        });

        // Additionally, select the main post element if on a single post detail page
        // The HTML structure on a single post page is slightly different.
        // It uses `data-urn` on the `feed-shared-update-v2` element itself.
        const singlePostElement = document.querySelector('.feed-shared-update-v2[data-urn^="urn:li:activity:"]');
        if (singlePostElement) {
            addCustomButtons(singlePostElement);
        }
    }

    /**
     * Sets up a MutationObserver to continuously watch for new LinkedIn posts being added to the DOM.
     * LinkedIn dynamically loads content, so this ensures that new posts also get the custom buttons.
     */
    function observeLinkedInFeed() {
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // Ensure it's an element node
                            // Check if the added node is directly a LinkedIn feed post
                            if (node.matches('div[data-id^="urn:li:activity:"]')) {
                                addCustomButtons(node);
                            }
                            // Check if the added node is directly a single LinkedIn post on a detail page
                            else if (node.matches('.feed-shared-update-v2[data-urn^="urn:li:activity:"]')) {
                                addCustomButtons(node);
                            }
                            // Also, check for posts nested within the added node's subtree.
                            // This catches cases where a larger container element is added, which then holds posts.
                            node.querySelectorAll('div[data-id^="urn:li:activity:"]').forEach(nestedPostElement => {
                                addCustomButtons(nestedPostElement);
                            });
                            node.querySelectorAll('.feed-shared-update-v2[data-urn^="urn:li:activity:"]').forEach(nestedSinglePostElement => {
                                addCustomButtons(nestedSinglePostElement);
                            });
                        }
                    });
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
        // Perform an initial scan on page load to add buttons to any posts
        // already present in the DOM before dynamic loading occurs.
        processAllLinkedInPosts();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', observeLinkedInFeed);
    } else {
        observeLinkedInFeed();
    }

})();
