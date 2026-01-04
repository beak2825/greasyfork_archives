// ==UserScript==
// @name        ChatGPT / Claude / Gemini WideScreen 界面宽屏
// @namespace   https://example.com/efficient-lazy-panda
// @match       *://claude.ai/*
// @match       *://chatgpt.com/*
// @match       *://gemini.google.com/*
// @version     1.1
// @author      Efficient Lazy Panda
// @license     MIT
// @description  Makes Claude, ChatGPT and Gemini chat interfaces wider, and replace Claude's default font with a sans-serif font for better readability. | 扩展 Claude、ChatGPT 和 Gemini 的聊天界面布局，并将 Claude 的默认字体替换为无衬线字体，提升阅读体验。 update: 2025-08-10
// @downloadURL https://update.greasyfork.org/scripts/534072/ChatGPT%20%20Claude%20%20Gemini%20WideScreen%20%E7%95%8C%E9%9D%A2%E5%AE%BD%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/534072/ChatGPT%20%20Claude%20%20Gemini%20WideScreen%20%E7%95%8C%E9%9D%A2%E5%AE%BD%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Detect which platform we're on
    const isGemini = window.location.hostname.includes('gemini.google.com');
    const isClaude = window.location.hostname.includes('claude.ai');
    const isChatGPT = window.location.hostname.includes('chatgpt.com');

    // Create a style element
    const style = document.createElement('style');

    // Common font styles for all platforms
    const commonFontStyles = `
        /* Common normalized font styles */
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif !important;
        }
    `;

    // Set platform-specific CSS
    if (isGemini) {
        style.textContent = commonFontStyles + `
            /* Gemini wide screen CSS */
            .chat-window,
            .chat-container,
            .conversation-container,
            .gemini-conversation-container {
                max-width: 95% !important;
                width: 95% !important;
            }

            .input-area-container,
            textarea,
            .prompt-textarea,
            .prompt-container {
                max-width: 95% !important;
                width: 95% !important;
            }

            textarea {
                width: 100% !important;
            }

            .max-w-3xl,
            .max-w-4xl,
            .max-w-screen-md {
                max-width: 95% !important;
            }

            .message-content,
            .user-message,
            .model-response {
                width: 100% !important;
                max-width: 100% !important;
            }

            .pre-fullscreen {
                height: auto !important;
            }

            .input-buttons-wrapper-top {
                right: 8px !important;
            }
        `;
    } else if (isClaude) {
        style.textContent = commonFontStyles + `
            /* Claude wide screen CSS */
            .max-w-screen-md, .max-w-3xl, .max-w-4xl {
                max-width: 95% !important;
            }

            .w-full.max-w-3xl, .w-full.max-w-4xl {
                max-width: 95% !important;
                width: 95% !important;
            }

            .w-full.max-w-3xl textarea {
                width: 100% !important;
            }

            .mx-auto {
                max-width: 95% !important;
            }

            [data-message-author-role] {
                width: 100% !important;
            }

            .absolute.right-0 {
                right: 10px !important;
            }

            /* Claude specific font fixes */
            p, h1, h2, h3, h4, h5, h6, span, div, textarea, input, button {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif !important;
                font-weight: 400 !important;
            }

            /* Fix for code blocks */
            pre, code, .font-mono {
                font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
            }

            /* Fix for chat messages */
            [data-message-author-role] p {
                font-size: 16px !important;
                line-height: 1.5 !important;
                letter-spacing: normal !important;
            }

            /* Remove serif from headings */
            h1, h2, h3, h4, h5, h6 {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif !important;
            }
        `;
    } else if (isChatGPT) {
        style.textContent = commonFontStyles + `
            /* ChatGPT wide screen CSS - Updated for 2024/2025 */

            /* Main container selectors */
            .mx-auto,
            .max-w-3xl,
            .max-w-4xl,
            .max-w-2xl,
            .max-w-screen-md {
                max-width: 95% !important;
                width: 95% !important;
            }

            /* Chat container */
            main {
                max-width: 95% !important;
                width: 95% !important;
            }

            /* Conversation container */
            [role="main"],
            .conversation,
            .chat-container {
                max-width: 95% !important;
                width: 95% !important;
            }

            /* Message containers */
            .group,
            .text-base,
            .gap-4,
            .md\\:gap-6 {
                max-width: 100% !important;
                width: 100% !important;
            }

            /* Input area */
            .stretch,
            .flex-1,
            .textarea,
            textarea {
                width: 100% !important;
                max-width: 100% !important;
            }

            /* Form container */
            form {
                width: 100% !important;
                max-width: 95% !important;
            }

            /* Chat message wrapper */
            .w-full {
                width: 100% !important;
                max-width: 100% !important;
            }

            /* Specific class combinations that ChatGPT uses */
            .flex.flex-col.pb-2,
            .flex.w-full.flex-col,
            .relative.flex.w-full.flex-col {
                width: 100% !important;
                max-width: 100% !important;
            }

            /* Override any fixed width containers */
            [class*="max-w-"] {
                max-width: 95% !important;
            }

            /* Ensure message content uses full width */
            .prose {
                max-width: 100% !important;
            }

            /* Input field specific styling */
            [data-id] textarea,
            [contenteditable="true"] {
                width: 100% !important;
                max-width: 100% !important;
            }

            /* Button container adjustments */
            .absolute.bottom-0.right-0,
            .absolute.right-0 {
                right: 8px !important;
            }

            /* Responsive adjustments */
            @media (min-width: 768px) {
                .md\\:max-w-2xl,
                .md\\:max-w-3xl,
                .md\\:max-w-4xl {
                    max-width: 95% !important;
                }
            }

            @media (min-width: 1024px) {
                .lg\\:max-w-2xl,
                .lg\\:max-w-3xl,
                .lg\\:max-w-4xl {
                    max-width: 95% !important;
                }
            }

            @media (min-width: 1280px) {
                .xl\\:max-w-3xl,
                .xl\\:max-w-4xl {
                    max-width: 95% !important;
                }
            }
        `;
    }

    // Append the style element to the document head
    document.head.appendChild(style);

    // Function to apply wide mode to inline styles (especially for Gemini)
    function applyWideModeToInlineStyles() {
        if (!isGemini) return; // Only needed for Gemini

        // Find elements with inline styles containing max-width
        const elements = document.querySelectorAll('[style*="max-width"]');

        elements.forEach(el => {
            // Skip elements that might be side panels or navigation
            if (el.classList.contains('side-panel') ||
                el.classList.contains('navigation-panel')) {
                return;
            }

            // Set max-width to 95%
            el.style.maxWidth = '95%';
        });
    }

    // ChatGPT specific dynamic width application
    function applyChatGPTWideMode() {
        if (!isChatGPT) return;

        // Target common ChatGPT container classes
        const selectors = [
            '.mx-auto',
            '.max-w-3xl',
            '.max-w-2xl',
            '.max-w-4xl',
            'main',
            '[role="main"]',
            '.conversation',
            'form'
        ];

        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (!el.classList.contains('sidebar') &&
                    !el.classList.contains('menu') &&
                    !el.parentElement?.classList.contains('sidebar')) {
                    el.style.maxWidth = '95%';
                    el.style.width = '95%';
                }
            });
        });

        // Handle input areas specifically
        const inputElements = document.querySelectorAll('textarea, [contenteditable="true"]');
        inputElements.forEach(el => {
            el.style.width = '100%';
            el.style.maxWidth = '100%';
        });
    }

    // Apply the changes when the DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            applyWideModeToInlineStyles();
            applyChatGPTWideMode();
        });
    } else {
        applyWideModeToInlineStyles();
        applyChatGPTWideMode();
    }

    // Create a MutationObserver to watch for dynamically added elements
    if (isGemini) {
        const observer = new MutationObserver(function(mutations) {
            applyWideModeToInlineStyles();
        });

        // Start observing the document body for changes
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });
    }

    // Enhanced ChatGPT observer
    if (isChatGPT) {
        const chatGPTObserver = new MutationObserver(function(mutations) {
            if (chatGPTObserver.timeoutId) {
                return;
            }

            chatGPTObserver.timeoutId = setTimeout(function() {
                applyChatGPTWideMode();
                delete chatGPTObserver.timeoutId;
            }, 300);
        });

        // Observe the entire document for ChatGPT changes
        chatGPTObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style']
        });
    }

    // Claude observer (keeping original logic)
    if (isClaude) {
        const claudeObserver = new MutationObserver(function(mutations) {
            if (claudeObserver.timeoutId) {
                return;
            }

            claudeObserver.timeoutId = setTimeout(function() {
                const inputElements = document.querySelectorAll('textarea, [role="textbox"], div[contenteditable="true"]');
                inputElements.forEach(el => {
                    if (el && !el.dataset.widthFixed) {
                        el.style.width = '100%';
                        el.style.maxWidth = '100%';
                        el.dataset.widthFixed = 'true';
                    }
                });
                delete claudeObserver.timeoutId;
            }, 500);
        });

        const formElement = document.querySelector('form') || document.body;
        claudeObserver.observe(formElement, {
            childList: true,
            subtree: true,
            attributes: false
        });
    }

})();
