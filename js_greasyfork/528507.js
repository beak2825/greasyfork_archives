// ==UserScript==
// @name         Trump Text Styler
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Makes instances of "trump" more prominent on webpages
// @author       Ethan
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/528507/Trump%20Text%20Styler.user.js
// @updateURL https://update.greasyfork.org/scripts/528507/Trump%20Text%20Styler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Flag to prevent processing our own mutations
    let isProcessing = false;
    
    // Custom attribute to mark elements we've already processed
    const PROCESSED_ATTR = 'data-trump-processed';

    function isEditable(node) {
        const editableTags = ['INPUT', 'TEXTAREA'];
        
        // Check if node itself is editable
        if (editableTags.includes(node?.tagName) || node?.isContentEditable) {
            return true;
        }
        
        // Check if node is inside an editable element
        let parent = node?.parentNode;
        while (parent) {
            if (editableTags.includes(parent.tagName) || parent.isContentEditable) {
                return true;
            }
            parent = parent.parentNode;
        }
        
        return false;
    }

    function styleTrump(node) {
        // Skip if not a valid node
        if (!node) return;
        
        // Skip if already processed
        if (node.nodeType === Node.ELEMENT_NODE && 
            node.getAttribute && 
            node.getAttribute(PROCESSED_ATTR) === 'true') {
            return;
        }
        
        // First check if node is inside an editable element
        if (isEditable(node)) {
            return;
        }
        
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent;
            const regex = /\b(trump)\b/gi;
            
            if (regex.test(text)) {
                // Temporarily disable observer
                isProcessing = true;
                
                const span = document.createElement('span');
                span.innerHTML = text.replace(regex, '<b style="font-size: 1.2em;">$1</b>');
                span.setAttribute(PROCESSED_ATTR, 'true');
                
                if (node.parentNode) {
                    node.parentNode.replaceChild(span, node);
                }
                
                // Re-enable observer after a small delay
                setTimeout(() => {
                    isProcessing = false;
                }, 0);
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // Mark this element as processed
            if (node.setAttribute) {
                node.setAttribute(PROCESSED_ATTR, 'true');
            }
            
            // Process children
            if (node.childNodes && node.childNodes.length > 0) {
                // Safe copy of childNodes to avoid modification during iteration
                Array.from(node.childNodes).forEach(child => styleTrump(child));
            }
        }
    }

    // Wait for the DOM to be fully loaded
    window.addEventListener('DOMContentLoaded', () => {
        // Process initial page after a small delay
        setTimeout(() => {
            styleTrump(document.body);
        }, 500);
    });
    
    // For pages where DOMContentLoaded might have already fired
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(() => {
            styleTrump(document.body);
        }, 500);
    }

    const observer = new MutationObserver(mutations => {
        // Skip processing if we're already handling mutations
        if (isProcessing) return;
        
        mutations.forEach(mutation => {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    // Only process if it's a DOM node and not already processed
                    if (node.nodeType && 
                        !(node.nodeType === Node.ELEMENT_NODE && 
                          node.getAttribute && 
                          node.getAttribute(PROCESSED_ATTR) === 'true') &&
                        !isEditable(node)) {
                        styleTrump(node);
                    }
                });
            }
        });
    });

    // Start observing with a delay to let the page load first
    setTimeout(() => {
        observer.observe(document.body, { 
            childList: true, 
            subtree: true 
        });
    }, 1000);
})();
