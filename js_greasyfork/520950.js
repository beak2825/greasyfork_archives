// ==UserScript==
// @name         Discord Message Colorizer Enhanced
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Colors <em> text yellow and text within parentheses blue in Discord messages, handling split spans
// @author       Vishanka
// @match        https://discord.com/channels/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520950/Discord%20Message%20Colorizer%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/520950/Discord%20Message%20Colorizer%20Enhanced.meta.js
// ==/UserScript==



(function() {
    // 1. Inject CSS classes for styling
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Baseline color for all message content */
            div[class*="messageContent_"] {
                color: #A2A2AC;
            }

            /* Highlight colors for specific patterns */
            .highlight-yellow {
                color: #E0DF7F !important;
            }
            .highlight-blue {
                color: #737373 !important;
            }
            .highlight-white {
                color: #FFFFFF !important;
            }
        `;
        document.head.appendChild(style);
    }

    // 2. Function to style message content
    function styleMessageContent() {
        // Select all message items based on the class prefix
        const messageItems = document.querySelectorAll('li[class^="messageListItem_"]');

        messageItems.forEach(messageItem => {
            const contentDiv = messageItem.querySelector('div[class*="messageContent_"]');
            if (!contentDiv) return; // Skip if no content div found

            // a. Color all <em> elements yellow
            const emElements = contentDiv.querySelectorAll('em');
            emElements.forEach(em => {
                if (!em.classList.contains('highlight-yellow')) { // Prevent reapplying
                    em.classList.add('highlight-yellow');
                }
            });

            // b. Color text within parentheses blue
            colorTextWithinDelimiters(contentDiv, '(', ')', 'highlight-blue', false);

            // c. Color text within quotation marks white (#FFFFFF)
            // Supports straight quotes and smart quotes
            colorTextWithinQuotes(contentDiv, ['"', '“', '‘'], ['"', '”', '’'], 'highlight-white');
        });
    }

    /**
     * Helper function to color text within matched quotation marks.
     * @param {HTMLElement} container - The container element to search within.
     * @param {string[]} openDelimiters - The opening quotation marks.
     * @param {string[]} closeDelimiters - The closing quotation marks.
     * @param {string} highlightClass - The CSS class to apply for highlighting.
     */
    function colorTextWithinQuotes(container, openDelimiters, closeDelimiters, highlightClass) {
        const spans = Array.from(container.querySelectorAll('span'));
        let buffer = []; // Collect spans inside the current quote

        spans.forEach(span => {
            const text = span.textContent;

            // Process span content character by character
            for (let i = 0; i < text.length; i++) {
                const char = text[i];

                if (openDelimiters.includes(char) && buffer.length === 0) {
                    // Start a new quote
                    buffer.push(span);
                } else if (closeDelimiters.includes(char) && buffer.length > 0) {
                    // End the current quote
                    buffer.forEach(s => s.classList.add(highlightClass));
                    buffer = []; // Clear buffer
                } else if (buffer.length > 0) {
                    // Inside a quote
                    buffer.push(span);
                }
            }
        });
    }

    /**
     * Helper function to color text within specified delimiters.
     * For non-quotation mark delimiters like parentheses.
     * @param {HTMLElement} container - The container element to search within.
     * @param {string|string[]} openDelimiter - The opening delimiter character(s).
     * @param {string|string[]} closeDelimiter - The closing delimiter character(s).
     * @param {string} highlightClass - The CSS class to apply for highlighting.
     * @param {boolean} isToggle - Whether to toggle highlighting (true for quotes).
     */
    function colorTextWithinDelimiters(container, openDelimiter, closeDelimiter, highlightClass, isToggle) {
        const spans = container.querySelectorAll('span');
        let isWithin = false;

        // Normalize delimiters to arrays
        const openDelims = Array.isArray(openDelimiter) ? openDelimiter : [openDelimiter];
        const closeDelims = Array.isArray(closeDelimiter) ? closeDelimiter : [closeDelimiter];

        spans.forEach(span => {
            const text = span.textContent;

            if (isToggle) {
                let hasOpening = false;
                let hasClosing = false;

                // Check for any closing delimiters first
                closeDelims.forEach(close => {
                    if (text.includes(close)) {
                        hasClosing = true;
                    }
                });

                if (hasClosing && isWithin) {
                    // Apply highlight before closing
                    span.classList.add(highlightClass);
                    isWithin = false;
                }

                // Apply highlight if currently within delimiters
                if (isWithin) {
                    span.classList.add(highlightClass);
                }

                // Check for any opening delimiters
                openDelims.forEach(open => {
                    if (text.includes(open)) {
                        hasOpening = true;
                        isWithin = true;
                    }
                });

                if (hasOpening) {
                    // Apply highlight for the span containing the opening delimiter
                    span.classList.add(highlightClass);
                }
            } else {
                // Non-toggle: e.g., parentheses
                if (text.includes(openDelimiter)) {
                    isWithin = true;
                }

                if (isWithin) {
                    span.classList.add(highlightClass);
                }

                if (text.includes(closeDelimiter)) {
                    isWithin = false;
                }
            }
        });
    }

    // 3. Initialize the styling process
    function initializeStyling() {
        injectStyles();
        styleMessageContent();

        // Observe for new messages being added to the DOM
        const observer = new MutationObserver(mutations => {
            mutations.forEach(() => {
                styleMessageContent();
            });
        });

        // Start observing the entire document body for changes
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 4. Run the initialization
    initializeStyling();
})();

