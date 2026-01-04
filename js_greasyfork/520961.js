// ==UserScript==
// @name         ChatGPT Message Colorizer Enhanced v1.9
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Enhanced coloring of ChatGPT responses without hiding content, including streaming content.
// @match        https://chatgpt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520961/ChatGPT%20Message%20Colorizer%20Enhanced%20v19.user.js
// @updateURL https://update.greasyfork.org/scripts/520961/ChatGPT%20Message%20Colorizer%20Enhanced%20v19.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let debounceTimer = null;

    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            p, div.whitespace-pre-wrap {
                color: #A2A2AC;
            }
            em {
                color: #E0DF7F !important;
                font-weight: normal !important;
            }
            .highlight-blue { color: #737373 !important; }
            .highlight-white { color: #FFFFFF !important; }

            .highlight-blue * { color: inherit !important; }
            .highlight-white * { color: inherit !important; }
        `;
        document.head.appendChild(style);
    }

    function highlightMessageContent(messageElement) {
        if (!messageElement || messageElement.dataset.processed) return;

        // Process for parentheses and quotes
        safelyColorText(messageElement, /\(([^)]+)\)/g, 'highlight-blue'); // Parentheses
        safelyColorText(messageElement, /["“](.*?)["”]/g, 'highlight-white'); // Quotes

        // Mark as processed to avoid reprocessing static messages
        messageElement.dataset.processed = 'true';
    }

    function safelyColorText(container, regex, highlightClass) {
        const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
        const nodesToProcess = [];
        let node;

        while ((node = walker.nextNode())) {
            if (!node.parentElement.closest('[contenteditable="true"]')) {
                nodesToProcess.push(node);
            }
        }

        nodesToProcess.forEach(node => {
            const parent = node.parentNode;
            const text = node.textContent;
            let newHTML = '';
            let lastIndex = 0;

            regex.lastIndex = 0; // Reset regex state
            let match;

            while ((match = regex.exec(text)) !== null) {
                newHTML += escapeHTML(text.substring(lastIndex, match.index));
                newHTML += `<span class="${highlightClass}">${escapeHTML(match[0])}</span>`;
                lastIndex = regex.lastIndex;
            }
            newHTML += escapeHTML(text.substring(lastIndex));

            if (newHTML !== escapeHTML(text)) {
                const tempSpan = document.createElement('span');
                tempSpan.innerHTML = newHTML;
                parent.replaceChild(tempSpan, node);
            }
        });
    }

    function escapeHTML(str) {
        return str.replace(/&/g, "&amp;")
                  .replace(/</g, "&lt;")
                  .replace(/>/g, "&gt;")
                  .replace(/"/g, "&quot;")
                  .replace(/'/g, "&#039;");
    }



    function observeMessages() {
        const observer = new MutationObserver(mutations => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
            //    console.log("Reprocessing all messages after streaming delay.");
                processExistingMessages();
            }, 300);
        });

        const messageContainer = document.querySelector('body');
        if (messageContainer) {
            observer.observe(messageContainer, { childList: true, subtree: true, characterData: true });
        }
    }

    function processExistingMessages() {
        const messages = document.querySelectorAll('p, div.whitespace-pre-wrap');
        messages.forEach(message => {
            highlightMessageContent(message);
        });
    }


    // NEW FUNCTION TO MONITOR THE STREAMING ELEMENT
    function observeStreamingMessages() {
        const streamingMessage = document.querySelector('.result-streaming.markdown.prose.w-full.break-words.dark\\:prose-invert.dark');
        if (!streamingMessage) return;

        const streamingObserver = new MutationObserver(mutations => {
            // Any time the streaming element updates, re-highlight its content.
            highlightMessageContent(streamingMessage);
            // Remove the 'processed' attribute so we can continuously reprocess as new text comes in.
            streamingMessage.removeAttribute('data-processed');
        });

        streamingObserver.observe(streamingMessage, { childList: true, subtree: true, characterData: true });
    }

    function initialize() {
        injectStyles();
        processExistingMessages();
        observeMessages();
        observeStreamingMessages(); // Added line to specifically observe streaming content
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
