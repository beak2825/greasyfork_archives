// ==UserScript==
// @name         AI Dungeon Markdown Formatter
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Apply Markdown formatting to AI Dungeon.
// @author       masks_
// @match        *.aidungeon.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511900/AI%20Dungeon%20Markdown%20Formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/511900/AI%20Dungeon%20Markdown%20Formatter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Toggle this flag to enable or disable all console logs.
     * Set to true to enable logging, false to disable.
     * Default: false (logs are disabled).
     */
    const LOG_ENABLED = false;

    /**
     * Toggle this flag to enable or disable debug-level logs.
     * Only effective if LOG_ENABLED is true.
     * Set to true for verbose logging, false for minimal logs.
     * Default: false (only INFO and ERROR logs are shown).
     */
    const DEBUG_MODE = false;

    /**
     * Logging utility to manage different log levels.
     * @param {string} level - The log level (INFO, DEBUG, ERROR).
     * @param {string} message - The log message.
     * @param {...any} args - Additional arguments.
     */
    function log(level, message, ...args) {
        if (!LOG_ENABLED) return; // Disable all logs if LOG_ENABLED is false

        const levels = {
            INFO: 'INFO',
            DEBUG: 'DEBUG',
            ERROR: 'ERROR'
        };

        switch(level) {
            case levels.INFO:
                console.info(`[AI Dungeon Formatter] ${message}`, ...args);
                break;
            case levels.DEBUG:
                if (DEBUG_MODE) {
                    console.debug(`[AI Dungeon Formatter] ${message}`, ...args);
                }
                break;
            case levels.ERROR:
                console.error(`[AI Dungeon Formatter] ${message}`, ...args);
                break;
            default:
                console.log(`[AI Dungeon Formatter] ${message}`, ...args);
        }
    }

    /**
     * Throttle function to limit the rate at which a function can fire.
     * @param {function} func - The function to throttle.
     * @param {number} limit - The throttle interval in milliseconds.
     * @returns {function} - The throttled function.
     */
    function throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function(...args) {
            const context = this;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function() {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }

    /**
     * Flag to indicate when the script is updating the DOM to prevent recursive mutation handling.
     */
    let isUpdatingDOM = false;

    /**
     * WeakMap to keep track of processed spans and their texts.
     * Ensures spans are reprocessed only if their text content changes.
     */
    let processedSpans = new WeakMap();

    /**
     * Recursively finds all target span elements within a node.
     * Targets span elements that are direct children of #gameplay-output > span > span.
     * @param {Node} node - The node to search within.
     * @returns {Array} - An array of matching span elements.
     */
    function findTargetSpans(node) {
        const spans = [];
        if (node.nodeType === Node.ELEMENT_NODE) {
            // If the node itself is a target span
            if (node.matches('#gameplay-output > span > span')) {
                spans.push(node);
            }
            // Find all target spans within the node
            spans.push(...node.querySelectorAll('#gameplay-output > span > span'));
        }
        return spans;
    }

    /**
     * Parses a text string with Markdown syntax and returns an array of DOM nodes.
     * Supports *italic*, **bold**, ***bold italic***.
     * @param {string} text - The text to parse.
     * @returns {Array|null} - An array of DOM nodes representing the formatted text, or null if no formatting is applied.
     */
    function parseMarkdownToNodes(text) {
        const nodes = [];

        // Regular expression to match Markdown syntax
        const regex = /(\*\*\*[^*]+\*\*\*)|(\*\*[^*]+\*\*)|(\*[^*]+\*)/g;

        let lastIndex = 0;
        let match;

        while ((match = regex.exec(text)) !== null) {
            // Text before the match
            if (match.index > lastIndex) {
                const plainText = text.slice(lastIndex, match.index);
                nodes.push(document.createTextNode(plainText));
            }

            const matchedText = match[0];
            let content;
            let element;

            if (matchedText.startsWith('***')) {
                // Bold Italic
                content = matchedText.slice(3, -3);
                element = document.createElement('strong');
                const em = document.createElement('em');
                em.textContent = content;
                element.appendChild(em);
            } else if (matchedText.startsWith('**')) {
                // Bold
                content = matchedText.slice(2, -2);
                element = document.createElement('strong');
                element.textContent = content;
            } else if (matchedText.startsWith('*')) {
                // Italic
                content = matchedText.slice(1, -1);
                element = document.createElement('em');
                element.textContent = content;
            } else {
                // Should not reach here
                element = document.createTextNode(matchedText);
            }

            nodes.push(element);
            lastIndex = regex.lastIndex;
        }

        // Text after the last match
        if (lastIndex < text.length) {
            const plainText = text.slice(lastIndex);
            nodes.push(document.createTextNode(plainText));
        }

        // Return null if no formatting is applied
        if (nodes.length === 1 && nodes[0].nodeType === Node.TEXT_NODE) {
            return null;
        }

        return nodes;
    }

    /**
     * Processes multiple span elements in chunks to avoid blocking the main thread.
     * @param {Set} spans - The collection of span elements to process.
     * @param {number} chunkSize - Number of spans to process per chunk.
     */
    function processSpansInChunks(spans, chunkSize = 20) {
        const spanArray = Array.from(spans);
        let index = 0;

        function processChunk() {
            const limit = Math.min(index + chunkSize, spanArray.length);
            for (let i = index; i < limit; i++) {
                processSpan(spanArray[i]);
            }

            index = limit;

            if (index < spanArray.length) {
                // Schedule the next chunk using setTimeout to yield to the browser
                setTimeout(processChunk, 0);
            }
        }

        processChunk();  // Start processing the first chunk
    }

    /**
     * Processes a single span element to apply Markdown formatting if the text has changed.
     * @param {HTMLElement} span - The span element to process.
     */
    function processSpan(span) {
        const currentText = span.textContent;

        // Check if the span has been processed before and if the text has changed
        if (processedSpans.has(span) && processedSpans.get(span) === currentText) {
            log('DEBUG', 'Span already processed with the same text.');
            return; // Skip if text hasn't changed
        }

        // Check if the text contains any Markdown syntax before processing
        if (!(/(\*\*\*|\*\*|\*)/.test(currentText))) {
            log('DEBUG', 'No Markdown syntax found in span.');
            processedSpans.set(span, currentText); // Update stored text
            return;
        }

        // Parse the text and apply formatting directly to the span
        const nodes = parseMarkdownToNodes(currentText);
        if (nodes) {
            isUpdatingDOM = true;

            // Clear existing child nodes
            while (span.firstChild) {
                span.removeChild(span.firstChild);
            }

            // Append new nodes
            for (let node of nodes) {
                span.appendChild(node);
            }

            isUpdatingDOM = false;

            log('DEBUG', 'Applied Markdown formatting to span.');
        } else {
            log('DEBUG', 'No formatting applied to span.');
        }

        processedSpans.set(span, span.textContent); // Update stored text
    }

    /**
     * Waits for a DOM element to become available, then executes a callback.
     * @param {string} selector - The CSS selector of the target element.
     * @param {function} callback - The function to execute when the element is found.
     */
    function waitForElement(selector, callback) {
        const element = document.querySelector(selector);
        if (element) {
            log('DEBUG', `Element "${selector}" found immediately.`);
            callback(element);
        } else {
            log('DEBUG', `Waiting for element "${selector}" to appear...`);
            const observer = new MutationObserver((mutations, obs) => {
                for (const mutation of mutations) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const elem = node.matches(selector) ? node : node.querySelector(selector);
                            if (elem) {
                                log('DEBUG', `Element "${selector}" found via MutationObserver.`);
                                obs.disconnect(); // Stop observing once the element is found
                                callback(elem);
                                return;
                            }
                        }
                    }
                }
            });

            // Start observing the document body for added child elements
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    /**
     * Checks if the current URL matches the target patterns.
     * @returns {boolean} - True if URL matches, false otherwise.
     */
    function isTargetURL() {
        const url = window.location.href;
        const hostname = window.location.hostname;
        const pathname = window.location.pathname;

        log('DEBUG', `Checking if URL is target: ${url}`);

        // Check hostname
        if (!(/^(beta\.aidungeon\.com|play\.aidungeon\.com)$/.test(hostname))) {
            log('DEBUG', 'Hostname does not match target patterns.');
            return false;
        }

        // Check pathname: starts with /adventure/ or /scenario/, followed by ID and Name, and ends with /play
        const isMatch = /^\/(adventure|scenario)\/[^/]+\/[^/]+\/play\/?$/.test(pathname);
        log('DEBUG', `URL pathname "${pathname}" matches target patterns: ${isMatch}`);
        return isMatch;
    }

    /**
     * Configuration object for the MutationObserver.
     */
    const observerConfig = {
        childList: true,       // Watch for added or removed child elements
        subtree: true,         // Observe all descendants
        characterData: true,   // Watch for changes to text nodes
        characterDataOldValue: false // No need to store old value
    };

    /**
     * Initializes the Markdown formatter by setting up observers and processing existing content.
     */
    function initializeFormatter() {
        // Prevent multiple initializations
        if (window.AIDungeonMarkdownFormatterInitialized) {
            log('DEBUG', 'Markdown Formatter is already initialized.');
            return;
        }
        window.AIDungeonMarkdownFormatterInitialized = true;
        log('INFO', 'Initializing AI Dungeon Markdown Formatter.');

        waitForElement('#gameplay-output', function(gameplayOutput) {
            log('DEBUG', 'Setting up MutationObserver for #gameplay-output.');

            /**
             * Initial processing of existing spans in #gameplay-output.
             */
            function initialProcess() {
                const existingSpans = gameplayOutput.querySelectorAll('#gameplay-output > span > span');
                const spanSet = new Set(existingSpans);
                log('INFO', `Initial processing of ${spanSet.size} span(s).`);

                processSpansInChunks(spanSet);
            }

            // Perform initial processing
            initialProcess();

            /**
             * Handles mutations by processing only relevant added or modified nodes.
             * Throttled to prevent overloading the main thread.
             * @param {Array} mutations - The array of MutationRecord objects.
             */
            const handleMutations = throttle(function(mutations) {
                log('DEBUG', `Handling ${mutations.length} mutation(s).`);
                const spansToProcess = new Set();

                mutations.forEach(mutation => {
                    // Handle added nodes (new AI outputs or revealed content)
                    if (mutation.type === 'childList' && mutation.addedNodes.length) {
                        mutation.addedNodes.forEach(node => {
                            const foundSpans = findTargetSpans(node);
                            if (foundSpans.length > 0) {
                                log('DEBUG', `Found ${foundSpans.length} new span(s) in added nodes.`);
                            }
                            foundSpans.forEach(span => spansToProcess.add(span));
                        });
                    }

                    // Handle character data changes (edits made by the player)
                    if (mutation.type === 'characterData') {
                        const parentSpan = mutation.target.parentElement;
                        if (parentSpan && parentSpan.matches('#gameplay-output > span > span')) {
                            log('DEBUG', 'Detected character data change in span.');
                            spansToProcess.add(parentSpan);
                        }
                    }
                });

                // Process the collected spans
                if (spansToProcess.size > 0) {
                    log('INFO', `Processing ${spansToProcess.size} span(s) from mutations.`);
                    processSpansInChunks(spansToProcess);
                } else {
                    log('DEBUG', 'No spans to process from mutations.');
                }
            }, 200); // Adjusted throttle interval for optimal performance

            // Create a MutationObserver to watch for changes in #gameplay-output
            const observer = new MutationObserver(handleMutations);

            // Start observing #gameplay-output
            observer.observe(gameplayOutput, observerConfig);

            // Store the observer for potential cleanup
            window.AIDungeonMarkdownObserver = observer;

            log('DEBUG', 'MutationObserver setup complete.');
        });
    }

    /**
     * Cleans up the formatter by disconnecting observers and resetting flags.
     */
    function cleanupFormatter() {
        // Disconnect the MutationObserver if it exists
        if (window.AIDungeonMarkdownObserver) {
            window.AIDungeonMarkdownObserver.disconnect();
            window.AIDungeonMarkdownObserver = null;
            log('INFO', 'Disconnected MutationObserver.');
        }

        // Reset the initialization flag
        if (window.AIDungeonMarkdownFormatterInitialized) {
            window.AIDungeonMarkdownFormatterInitialized = false;
            log('INFO', 'Reset Markdown Formatter initialization flag.');
        }

        // Clear processed spans by reassigning to new WeakMaps
        processedSpans = new WeakMap();
        log('DEBUG', 'Cleared processedSpans WeakMap.');
    }

    /**
     * Monitors URL changes and initializes or cleans up the formatter accordingly.
     */
    function monitorURLChanges() {
        log('INFO', 'Starting URL change monitoring.');

        // Save original methods to restore later if needed
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        /**
         * Wrapper for history.pushState to detect URL changes.
         */
        history.pushState = function(...args) {
            originalPushState.apply(this, args);
            log('DEBUG', 'history.pushState called.');
            window.dispatchEvent(new Event('locationchange'));
        };

        /**
         * Wrapper for history.replaceState to detect URL changes.
         */
        history.replaceState = function(...args) {
            originalReplaceState.apply(this, args);
            log('DEBUG', 'history.replaceState called.');
            window.dispatchEvent(new Event('locationchange'));
        };

        // Listen to popstate and the custom locationchange event
        window.addEventListener('popstate', () => {
            log('DEBUG', 'popstate event detected.');
            window.dispatchEvent(new Event('locationchange'));
        });

        window.addEventListener('locationchange', () => {
            log('INFO', 'locationchange event detected.');
            if (isTargetURL()) {
                log('INFO', 'URL matches target patterns. Initializing formatter.');
                initializeFormatter();
            } else {
                log('INFO', 'URL does not match target patterns. Cleaning up formatter.');
                cleanupFormatter();
            }
        });

        // Initial check on script load
        if (isTargetURL()) {
            log('INFO', 'Initial URL matches target patterns. Initializing formatter.');
            initializeFormatter();
        } else {
            log('DEBUG', 'Initial URL does not match target patterns. Formatter not initialized.');
        }
    }

    // Start monitoring URL changes
    monitorURLChanges();

    /**
     * Cleanup when the page is unloaded to free resources.
     */
    window.addEventListener('beforeunload', () => {
        log('DEBUG', 'Page is unloading. Cleaning up formatter.');
        cleanupFormatter();
    });

})();
