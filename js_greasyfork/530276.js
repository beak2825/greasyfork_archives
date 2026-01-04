// ==UserScript==
// @name         Freshservice Editor Enhancements
// @namespace    freshservice_enhancements
// @version      2.7
// @description  Automatically removes quoted text and sets cursor position inside the Freshservice reply editor, works with all navigation patterns
// @match        https://*.freshservice.com/a/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530276/Freshservice%20Editor%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/530276/Freshservice%20Editor%20Enhancements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        editorSelector: '.fr-element',
        replyButtonSelector: '[data-test-id="ticket-reply-btn"]',
        removeQuoteBtnSelector: '.remove-quoted-text-btn',
        debounceDelay: 50,
        cursorPositionDelay: 100,
        pollInterval: 10,
        maxPollAttempts: 20,
        // Add URL tracking for ticket navigation detection
        ticketUrlRegex: /\/tickets\/(\d+)/,
        // Check interval for non-history navigation (ms)
        urlCheckInterval: 500
    };

    // Global observer and interval handles for cleanup
    let mainObserver = null;
    let pollHandle = null;
    let urlCheckHandle = null;
    let lastTicketId = null;
    let lastPath = null;
    let isInitialized = false;

    // Remove quoted content by clicking the removal button (if not yet processed)
    function removeQuotedText() {
        const buttons = document.querySelectorAll(`${CONFIG.removeQuoteBtnSelector}:not([data-auto-processed])`);
        buttons.forEach(button => {
            button.setAttribute('data-auto-processed', 'true');
            button.click();
        });
        return buttons.length > 0;
    }

    // Check if there's an existing draft (now considers both meaningful text and images)
    function hasExistingDraft(content, firstLineEndIdx, ticketPos) {
        if (ticketPos - firstLineEndIdx > 10) {
            // Get the content between greeting and ticket URL
            const middleContent = content.substring(firstLineEndIdx, ticketPos).trim();
            // Remove HTML tags to check actual text content
            const textOnlyContent = middleContent.replace(/<[^>]*>/g, '').trim();
            // Consider it a draft if there's any meaningful text or any <img> tags present
            return textOnlyContent.length > 0 || /<img\s[^>]*>/i.test(middleContent);
        }
        return false;
    }

    // Position the text cursor within the editor
    function setCursorPosition(editor) {
        const content = editor.innerHTML;
        const ticketRegex = /Ticket: https:\/\/.*\/tickets\/\d+/;
        const ticketMatch = content.match(ticketRegex);
        if (!ticketMatch) return false;

        const ticketPos = content.indexOf(ticketMatch[0]);
        let firstLineEndIdx = content.indexOf('<br>');
        if (firstLineEndIdx === -1 || firstLineEndIdx > ticketPos) {
            const periodIdx = (content.indexOf('.') >= 0 && content.indexOf('.') < ticketPos) ? content.indexOf('.') : -1;
            const commaIdx = (content.indexOf(',') >= 0 && content.indexOf(',') < ticketPos) ? content.indexOf(',') : -1;
            const newlineIdx = (content.indexOf('\n') >= 0 && content.indexOf('\n') < ticketPos) ? content.indexOf('\n') : -1;
            if (periodIdx > -1) {
                firstLineEndIdx = periodIdx + 1;
            } else if (commaIdx > -1) {
                firstLineEndIdx = commaIdx + 1;
            } else if (newlineIdx > -1) {
                firstLineEndIdx = newlineIdx;
            } else {
                firstLineEndIdx = ticketPos;
            }
        }

        // Check if there's already content (draft) between greeting and ticket URL
        if (hasExistingDraft(content, firstLineEndIdx, ticketPos)) {
            // If there's a draft, position cursor at the end of the draft, right before the ticket URL
            const range = document.createRange();
            const selection = window.getSelection();

            // Find the correct node and position to place cursor
            const nodeIterator = document.createNodeIterator(editor, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
            let curNode;
            let foundPosition = false;
            let lastTextNode = null;
            let lastTextNodeContent = "";

            // Iterate through nodes to find the one right before the ticket URL
            while ((curNode = nodeIterator.nextNode()) && !foundPosition) {
                if (curNode.nodeType === Node.TEXT_NODE) {
                    const nodeContent = curNode.textContent;
                    if (nodeContent.includes(ticketMatch[0])) {
                        // Found the node with ticket URL
                        const ticketNodePos = nodeContent.indexOf(ticketMatch[0]);
                        if (ticketNodePos > 0) {
                            // If ticket is not at the start of this node, place cursor right before it
                            range.setStart(curNode, ticketNodePos);
                            foundPosition = true;
                        } else if (lastTextNode) {
                            // If ticket is at start of this node, place cursor at end of previous text node
                            range.setStart(lastTextNode, lastTextNodeContent.length);
                            foundPosition = true;
                        }
                    } else {
                        // Keep track of the last text node we saw
                        lastTextNode = curNode;
                        lastTextNodeContent = nodeContent;
                    }
                }
            }

            // If we couldn't find the exact position, just focus the editor
            if (!foundPosition) {
                editor.focus();
                return true;
            }

            // Set the cursor
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
            editor.focus();
            return true;
        }

        // Otherwise, proceed with the original cursor positioning logic for new replies
        const before = content.substring(0, firstLineEndIdx);
        const after = content.substring(ticketPos);
        editor.innerHTML = before + '<br><br><br><br>' + after;

        const brs = editor.querySelectorAll('br');
        if (brs.length >= 3) {
            const range = document.createRange();
            const selection = window.getSelection();
            const dummyTextNode = document.createTextNode('');
            // Insert dummy text node before the third break to mark the cursor position
            brs[1].parentNode.insertBefore(dummyTextNode, brs[2]);
            range.setStart(dummyTextNode, 0);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
            editor.focus();
        }
        return true;
    }

    // Process the single editor: remove quotes and adjust cursor positioning
    function processEditors() {
        removeQuotedText();
        const editor = document.querySelector(CONFIG.editorSelector);
        if (!editor) {
            return false;
        }
        if (editor.getAttribute('data-cursor-processed')) {
            return true;
        }

        editor.setAttribute('data-cursor-processed', 'true');
        setTimeout(() => setCursorPosition(editor), CONFIG.cursorPositionDelay);
        observeEditorRemoval(editor);
        return true;
    }

    // Watch for removal of the editor element to clean-up its observer.
    function observeEditorRemoval(editor) {
        if (!editor.parentNode) return;
        const removalObserver = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && Array.from(mutation.removedNodes).includes(editor)) {
                    removalObserver.disconnect();
                    return;
                }
            }
        });
        removalObserver.observe(editor.parentNode, { childList: true });
        editor._removalObserver = removalObserver;
    }

    // Poll the DOM briefly after a reply button click for new editors.
    function startEditorPolling() {
        if (pollHandle) clearInterval(pollHandle);
        let attempts = 0;

        pollHandle = setInterval(() => {
            const editorFound = document.querySelector(CONFIG.editorSelector);
            const editorProcessed = editorFound && editorFound.getAttribute('data-cursor-processed');

            if ((editorFound && editorProcessed) || attempts >= CONFIG.maxPollAttempts) {
                clearInterval(pollHandle);
                pollHandle = null;
            } else if (editorFound && !editorProcessed) {
                processEditors();
            }
            attempts++;
        }, CONFIG.pollInterval);
    }

    // Set up the main MutationObserver to catch dynamic DOM changes.
    function setupMainObserver() {
        if (mainObserver) {
            mainObserver.takeRecords();
            mainObserver.disconnect();
        }
        let debounceTimer = null;
        mainObserver = new MutationObserver(() => {
            if (debounceTimer) clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                processEditors();
                debounceTimer = null;
            }, CONFIG.debounceDelay);
        });
        mainObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });
    }

    // Reset the processed state of editor elements when navigating between tickets
    function resetEditorProcessedStates() {
        document.querySelectorAll(CONFIG.editorSelector).forEach(editor => {
            editor.removeAttribute('data-cursor-processed');
        });
        document.querySelectorAll(CONFIG.removeQuoteBtnSelector).forEach(button => {
            button.removeAttribute('data-auto-processed');
        });
        // Force reprocessing
        processEditors();
    }

    // Check for ticket ID changes through URL monitoring
    function checkUrlChange() {
        const currentPath = window.location.pathname;

        // Skip if path hasn't changed
        if (currentPath === lastPath) return;

        // Update last path
        lastPath = currentPath;

        // Check if we're on a ticket page
        const ticketMatch = currentPath.match(CONFIG.ticketUrlRegex);

        if (ticketMatch) {
            const currentTicketId = ticketMatch[1];

            // First time seeing a ticket or changed ticket
            if (currentTicketId !== lastTicketId) {
                console.log('Freshservice Enhancements: Detected ticket change from',
                    lastTicketId ? lastTicketId : 'non-ticket page', 'to', currentTicketId);
                lastTicketId = currentTicketId;

                // Initialize if not already (for first navigation from dashboard)
                if (!isInitialized) {
                    console.log('Freshservice Enhancements: First ticket page detected, initializing...');
                    setupMainObserver();
                    isInitialized = true;
                }

                resetEditorProcessedStates();
            }
        } else {
            // We're not on a ticket page
            lastTicketId = null;
        }
    }

    // Set up URL monitoring using History API interception
    function setupUrlMonitoring() {
        // Initial URL check
        lastPath = window.location.pathname;
        const initialMatch = lastPath.match(CONFIG.ticketUrlRegex);
        if (initialMatch) {
            lastTicketId = initialMatch[1];
            isInitialized = true;
        }

        // Listen for popstate events (back/forward navigation)
        window.addEventListener('popstate', () => {
            setTimeout(checkUrlChange, 100);
        });

        // Monitor URL changes through pushState/replaceState interception
        const originalPushState = window.history.pushState;
        const originalReplaceState = window.history.replaceState;

        window.history.pushState = function() {
            originalPushState.apply(this, arguments);
            setTimeout(checkUrlChange, 100);
        };

        window.history.replaceState = function() {
            originalReplaceState.apply(this, arguments);
            setTimeout(checkUrlChange, 100);
        };

        // Set up a regular interval check as a fallback for non-history navigation
        urlCheckHandle = setInterval(checkUrlChange, CONFIG.urlCheckInterval);
    }

    // Cleanup global observers, polling intervals, and editor-specific observers.
    function cleanup() {
        if (mainObserver) {
            mainObserver.takeRecords();
            mainObserver.disconnect();
            mainObserver = null;
        }
        if (pollHandle) {
            clearInterval(pollHandle);
            pollHandle = null;
        }
        if (urlCheckHandle) {
            clearInterval(urlCheckHandle);
            urlCheckHandle = null;
        }
        document.querySelectorAll(CONFIG.editorSelector).forEach(editor => {
            if (editor._removalObserver) {
                editor._removalObserver.disconnect();
                delete editor._removalObserver;
            }
        });
    }

    function initialize() {
        const currentPath = window.location.pathname;
        const isTicketPage = CONFIG.ticketUrlRegex.test(currentPath);

        // Only set up the main observer if we're already on a ticket page
        if (isTicketPage) {
            processEditors();
            setupMainObserver();
            isInitialized = true;
        }

        // Always set up URL monitoring regardless of current page
        setupUrlMonitoring();

        window.addEventListener('beforeunload', cleanup);
        document.addEventListener('click', e => {
            if (e.target.closest(CONFIG.replyButtonSelector)) {
                startEditorPolling();
            }
        }, true);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();