// ==UserScript==
// @name         Torn Chat Enhancer 1.3 (Ultra Simple)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Colorful usernames without newMessage text
// @author       Mr_Awaken (Fixed)
// @match        *://www.torn.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/534166/Torn%20Chat%20Enhancer%2013%20%28Ultra%20Simple%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534166/Torn%20Chat%20Enhancer%2013%20%28Ultra%20Simple%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Simple style with basic selectors
    const style = document.createElement('style');
    style.textContent = `
        /* Show usernames with colors */
        [class*="chat-box-message__sender"] {
            display: inline !important;
            visibility: visible !important;
            font-weight: bold !important;
            margin-right: 5px !important;
        }
        
        /* Your messages in green */
        [class*="chat-box-message__box--self"] [class*="chat-box-message__sender"] {
            color: #00C853 !important;
        }
        
        /* Their messages in blue */
        [class*="chat-box-message__box"]:not([class*="--self"]) [class*="chat-box-message__sender"] {
            color: #2962FF !important;
        }
    `;
    
    // Insert style as soon as possible
    function addStyle() {
        if (document.head) {
            document.head.appendChild(style);
        } else {
            // If head isn't ready, wait for it
            document.addEventListener('DOMContentLoaded', () => {
                document.head.appendChild(style);
            });
        }
    }
    
    // Simple function to remove "newMessage" text
    function removeNewMessageText() {
        const messages = document.querySelectorAll('[class*="chat-box-message__box"]');
        
        messages.forEach(message => {
            // Walk through all text nodes
            const walker = document.createTreeWalker(
                message,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );
            
            let node;
            while (node = walker.nextNode()) {
                if (node.nodeValue && node.nodeValue.includes('newMessage')) {
                    node.nodeValue = node.nodeValue.replace(/newMessage/g, '');
                }
            }
        });
    }
    
    // Watch for changes to fix messages
    function watchForChanges() {
        // Initial run
        removeNewMessageText();
        
        // Set up observer for chat messages
        const observer = new MutationObserver(() => {
            removeNewMessageText();
        });
        
        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Also run periodically
        setInterval(removeNewMessageText, 1000);
    }
    
    // Add style immediately
    addStyle();
    
    // Set up the rest once DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', watchForChanges);
    } else {
        watchForChanges();
    }
})();