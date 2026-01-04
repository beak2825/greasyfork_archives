// ==UserScript==
// @name         Replace Twitter/X Emojis with System Emojis
// @namespace    http://tampermonkey.net/
// @version      0.3  
// @description  Replace all Twitter emoji images (Twemoji) on x.com with native system emojis.
// @author       Your Name (Updated)
// @match        https://x.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524619/Replace%20TwitterX%20Emojis%20with%20System%20Emojis.user.js
// @updateURL https://update.greasyfork.org/scripts/524619/Replace%20TwitterX%20Emojis%20with%20System%20Emojis.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Selector for Twitter's emoji images (covers SVG and potentially PNG)
    const EMOJI_SELECTOR = 'img[src*="/emoji/v2/"][alt]'; // Added alt requirement to selector

    /**
     * Replaces a given Twitter emoji IMG node with a SPAN containing the native system emoji.
     * @param {HTMLImageElement} imgNode The emoji image element to replace.
     */
    function replaceEmojiNode(imgNode) {
        // Check if already processed or lacks necessary attributes
        if (imgNode.dataset.emojiReplaced || !imgNode.parentNode || !imgNode.alt) {
            return;
        }

        const alt = imgNode.alt; // The actual emoji character(s)

        const span = document.createElement('span');
        span.textContent = alt; // Use the exact alt text (handles single/multiple emojis)
        span.setAttribute('role', 'img'); // Accessibility: Treat span like an image
        span.setAttribute('aria-label', alt); // Accessibility: Provide label

        // --- Styling ---
        // 1. Basic inline behavior and alignment (adjust if needed)
        span.style.display = 'inline-block'; // Or 'inline' might work depending on context
        span.style.verticalAlign = 'text-bottom'; // Common alignment, adjust based on visual tests

        // 2. Try to match the size of the original emoji image
        try {
            const computedStyle = window.getComputedStyle(imgNode);
            const height = computedStyle.height;
            // const width = computedStyle.width; // Width can be tricky with multiple chars, primarily use height

            // Use height for font size and line height for better vertical centering and scaling
            if (height && height !== 'auto' && parseFloat(height) > 0) {
                span.style.fontSize = height;
                span.style.lineHeight = height; // Match line height to font size for vertical centering
                span.style.height = height;     // Explicit height
                // Setting width can sometimes be problematic for multi-character emojis or variable-width system emojis.
                // Let the browser determine width based on content and font size unless specific issues arise.
                // span.style.width = 'auto'; // Allow natural width based on font/content
            } else {
                // Fallback size if computed style is unavailable or invalid
                span.style.fontSize = '1em'; // Inherit from parent or use a reasonable default
                span.style.lineHeight = '1';   // Normal line height
            }
            // Copy other potentially relevant styles (optional, can add complexity)
            // span.style.margin = computedStyle.margin;

        } catch (e) {
            console.warn("Replace Emojis Script: Couldn't get computed style for emoji, using default size.", e);
            // Apply fallback size on error
            span.style.fontSize = '1em';
            span.style.lineHeight = '1';
        }

        // Mark the original node as processed BEFORE replacing it
        imgNode.dataset.emojiReplaced = 'true';
        imgNode.style.display = 'none'; // Hide original immediately to prevent flash

        // Replace the image node with the new span node
        imgNode.parentNode.replaceChild(span, imgNode);
        // console.log(`Replaced emoji: ${alt}`); // For debugging
    }

    /**
     * Scans a given node and its descendants for emoji images and replaces them.
     * @param {Node} targetNode The node to scan.
     */
    function processNode(targetNode) {
        if (!targetNode || !targetNode.querySelectorAll) return;

        // Find all emoji images within the target node that haven't been replaced
        const emojiImages = targetNode.querySelectorAll(EMOJI_SELECTOR + ':not([data-emoji-replaced="true"])');
        emojiImages.forEach(replaceEmojiNode);
    }

    // --- Mutation Observer ---
    // Observe DOM changes to catch dynamically loaded content
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    // Check if the added node itself is an emoji
                    if (node.nodeType === Node.ELEMENT_NODE && node.matches(EMOJI_SELECTOR)) {
                        replaceEmojiNode(node);
                    }
                    // Check if the added node contains emojis
                    else if (node.nodeType === Node.ELEMENT_NODE && node.querySelector) {
                        processNode(node);
                    }
                });
            }
            // Optional: Handle attribute changes if emoji src/alt might change later
            // else if (mutation.type === 'attributes' && mutation.attributeName === 'src' && mutation.target.matches(EMOJI_SELECTOR)) {
            //     // Re-evaluate if needed, but usually replacement is permanent
            //     // Be careful not to cause infinite loops if you modify attributes observer listens to
            // }
        });
    });

    // Start observing the document body for additions and subtree modifications
    observer.observe(document.body, {
        childList: true,
        subtree: true
        // attributes: true, // Uncomment cautiously if needed
        // attributeFilter: ['src', 'alt'] // Specify attributes if uncommenting 'attributes'
    });

    // --- Initial Scan ---
    // Process existing emojis present on the page when the script initially runs
    console.log("Replace Emojis Script: Running initial scan...");
    processNode(document.body);
    console.log("Replace Emojis Script: Initial scan complete. Observer active.");

})();
