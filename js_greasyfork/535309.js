// ==UserScript==
// @name         Perplexity Code Block Copy (AFU IT)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Enhanced code blocks in Perplexity with better selection and copy features for inline code
// @author       AFU IT
// @match        https://www.perplexity.ai/*
// @license      MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/535309/Perplexity%20Code%20Block%20Copy%20%28AFU%20IT%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535309/Perplexity%20Code%20Block%20Copy%20%28AFU%20IT%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Custom CSS to maintain grey text color during selection with smaller padding
    const customCSS = `
        code.enhanced-code::selection {
            background-color: rgba(255, 255, 255, 0.3) !important;
            color: grey !important;
            padding-top: 0.5px;
            padding-bottom: 0.5px;
        }
        code.enhanced-code::-moz-selection {
            background-color: rgba(255, 255, 255, 0.3) !important;
            color: grey !important;
            padding-top: 0.5px;
            padding-bottom: 0.5px;
        }
    `;

    // Add custom CSS to the document
    function addCustomCSS() {
        if (!document.getElementById('perplexity-code-enhancer-css')) {
            const style = document.createElement('style');
            style.id = 'perplexity-code-enhancer-css';
            style.textContent = customCSS;
            document.head.appendChild(style);
        }
    }

    // Function to check if answer is still generating
    function isAnswerGenerating() {
        // Look for elements that indicate answer generation is in progress
        return document.querySelector('.answer-loading, .generating, [data-generating="true"], .typing') !== null;
    }

    // Variables to manage tooltip timer and last copied selection
    let tooltipTimer = null;
    let lastCopiedSelection = '';
    let generatingBlocks = new Set();

    // Function to apply styles and add copy functionality
    function enhanceCodeBlocks() {
        const generating = isAnswerGenerating();

        // Find all code blocks that haven't been enhanced yet
        const codeBlocks = document.querySelectorAll('code:not(.enhanced-code):not(.temp-styled):not(.enhanced-code-default)');

        codeBlocks.forEach(codeBlock => {
            // If answer is still generating, mark this block but don't style it yet
            if (generating) {
                codeBlock.classList.add('temp-styled');
                generatingBlocks.add(codeBlock);
                addCopyFunctionality(codeBlock);
                return;
            }

            // Answer is complete, apply full styling
            applyFinalStyling(codeBlock);
        });

        // If generation has completed, process any blocks that were marked during generation
        if (!generating && generatingBlocks.size > 0) {
            generatingBlocks.forEach(block => {
                block.classList.remove('temp-styled');
                applyFinalStyling(block);
            });
            generatingBlocks.clear();
        }
    }

    // Function to apply final styling to a code block after generation is complete
    function applyFinalStyling(codeBlock) {
        // Check if this is an inline code block (within a paragraph)
        const isInlineCode = !codeBlock.parentElement.tagName.toLowerCase().includes('pre') &&
                             codeBlock.textContent.split('\n').length === 1;

        // Apply styling for inline code blocks
        if (isInlineCode) {
            codeBlock.style.backgroundColor = '#20b8cb';
            codeBlock.style.color = 'black';
            codeBlock.classList.add('enhanced-code'); // Add class for selection styling
        } else {
            // Count the number of lines in the code block for multi-line blocks
            const lineCount = (codeBlock.textContent.match(/\n/g) || []).length + 1;

            // Keep default styling for all code blocks
            codeBlock.classList.add('enhanced-code-default');
        }

        // Add copy functionality if not already added
        if (!codeBlock.dataset.copyEnabled) {
            addCopyFunctionality(codeBlock);
        }
    }

    // Function to add copy functionality to a code block
    function addCopyFunctionality(codeBlock) {
        // Skip if already processed
        if (codeBlock.dataset.copyEnabled === 'true') return;

        // Common styling regardless of line count
        codeBlock.style.position = 'relative';

        // Add a subtle hover effect
        codeBlock.addEventListener('mouseover', function() {
            this.style.opacity = '0.9';
        });

        codeBlock.addEventListener('mouseout', function() {
            this.style.opacity = '1';
        });

        // Add click event to copy code for inline code
        codeBlock.addEventListener('click', function(e) {
            // Check if this is an inline code and no text is selected
            const selection = window.getSelection();
            const selectedText = selection.toString();

            // If this is an inline code and no specific selection, copy the whole inline code
            if (this.classList.contains('enhanced-code') && (!selectedText || selectedText.length === 0)) {
                const codeText = this.textContent;
                navigator.clipboard.writeText(codeText).then(() => {
                    showCopiedTooltip(this, "Copied!", e.clientX, e.clientY);
                });
                e.preventDefault(); // Prevent default to avoid text selection
                return;
            }
        });

        // Add mouseup event to copy selected text
        codeBlock.addEventListener('mouseup', function(e) {
            // Get selected text
            const selection = window.getSelection();
            const selectedText = selection.toString();

            // If text is selected and different from last copied, copy it
            if (selectedText && selectedText.length > 0 && selectedText !== lastCopiedSelection) {
                lastCopiedSelection = selectedText;
                navigator.clipboard.writeText(selectedText).then(() => {
                    showCopiedTooltip(this, "Selection copied!", e.clientX, e.clientY);
                    // Clear any existing timer
                    if (tooltipTimer) {
                        clearTimeout(tooltipTimer);
                    }
                    // Set timer to remove tooltip
                    tooltipTimer = setTimeout(() => {
                        const existingTooltip = document.querySelector('.code-copied-tooltip');
                        if (existingTooltip) {
                            existingTooltip.style.opacity = '0';
                            setTimeout(() => {
                                existingTooltip.remove();
                            }, 500);
                        }
                        tooltipTimer = null;
                        lastCopiedSelection = '';
                    }, 1500);
                });
            }
        });

        // Add double click event to copy entire code
        codeBlock.addEventListener('dblclick', function(e) {
            e.preventDefault();
            const codeText = this.textContent;
            navigator.clipboard.writeText(codeText).then(() => {
                showCopiedTooltip(this, "All code copied!", e.clientX, e.clientY);
                // Clear any existing timer
                if (tooltipTimer) {
                    clearTimeout(tooltipTimer);
                }
                // Set timer to remove tooltip
                tooltipTimer = setTimeout(() => {
                    const existingTooltip = document.querySelector('.code-copied-tooltip');
                    if (existingTooltip) {
                        existingTooltip.style.opacity = '0';
                        setTimeout(() => {
                            existingTooltip.remove();
                        }, 500);
                    }
                    tooltipTimer = null;
                    lastCopiedSelection = '';
                }, 1500);
            });
        });

        // Mark as processed
        codeBlock.dataset.copyEnabled = 'true';
    }

    // Function to show a temporary tooltip close to the mouse cursor
    function showCopiedTooltip(element, message, x, y) {
        // Remove any existing tooltips
        const existingTooltip = document.querySelector('.code-copied-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }

        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.textContent = message || 'Copied!';
        tooltip.className = 'code-copied-tooltip';

        // Style the tooltip - using Perplexity's font family
        tooltip.style.position = 'fixed';
        tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        tooltip.style.color = 'white';
        tooltip.style.padding = '4px 8px';
        tooltip.style.borderRadius = '4px';
        tooltip.style.fontSize = '12px'; // Smaller font size
        tooltip.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif'; // Perplexity default font
        tooltip.style.zIndex = '10000';
        tooltip.style.pointerEvents = 'none';

        // Add to document and get dimensions
        document.body.appendChild(tooltip);

        // Position tooltip very close to the right of the mouse cursor
        const offsetX = 20; // pixels to the right (closer now)

        // Use clientX/Y instead of pageX/Y for better positioning
        tooltip.style.left = (x + offsetX) + 'px';

        // Calculate vertical position to center the tooltip to the mouse
        // We need to wait for the tooltip to be in the DOM to get its height
        setTimeout(() => {
            const tooltipHeight = tooltip.offsetHeight;
            tooltip.style.top = (y - (tooltipHeight / 4.5)) + 'px';
        }, 0);
    }

    // Add the custom CSS
    addCustomCSS();

    // Run initially
    enhanceCodeBlocks();

    // Set up a MutationObserver to handle dynamically loaded content
    const observer = new MutationObserver(function(mutations) {
        enhanceCodeBlocks();
    });

    // Start observing the document body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Also run periodically to catch when answer generation completes
    setInterval(enhanceCodeBlocks, 500);
})();
