// ==UserScript==
// @name         ChatGPT UwUifier
// @namespace    https://github.com/rastr1sr
// @version      1.0
// @description  Adds a button to uwuify ChatGPT responses, preserving formatting.
// @author       Rastrisr
// @match        *://chat.openai.com/*
// @match        *://chatgpt.com/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534237/ChatGPT%20UwUifier.user.js
// @updateURL https://update.greasyfork.org/scripts/534237/ChatGPT%20UwUifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const UWU_BUTTON_ID = 'uwuifier-button';
    const ORIGINAL_CONTENT_ATTR = 'data-original-content-uwu';
    const ASSISTANT_MESSAGE_SELECTOR = '[data-message-author-role="assistant"]';
    const CONTENT_SELECTORS = [
        '.markdown',
        '[class*="prose"]',
        'div.text-message',
        'div > p'
    ];
    const DEBOUNCE_DELAY = 300;
    const TAGS_TO_SKIP_UWUIFY = new Set(['PRE', 'CODE', 'SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'BUTTON']);

    // --- State ---
    let isUwuActive = false;
    let uwuButton = null;
    let modifiedElements = new Set();
    let initTimeoutId = null;
    let observerDebounceTimeout = null;

    // --- Core UwUify Logic (Text Only) ---
    function uwuifyText(text) {
        return text
            .replace(/(?:[rl])(?![aeiou])/gi, (match) => (match === 'r' || match === 'l' ? 'w' : 'W'))
            .replace(/[rl](?=[aeiou])/gi, 'w')
            .replace(/[RL](?=[AEIOU])/g, 'W')
            .replace(/ove/gi, 'uv')
            .replace(/O([^a-zA-Z]|$)/g, 'OwO$1')
            .replace(/n([aeiou])/gi, (match, p1) => Math.random() > 0.4 ? `ny${p1}` : match)
            .replace(/\b(Y)ou\b/g, 'Yuw').replace(/\b(y)ou\b/g, 'yuw')
            .replace(/\b(T)he\b/g, 'Da').replace(/\b(t)he\b/g, 'da')
            .replace(/\b(Y)ou're\b/g, "Yuw'we").replace(/\b(y)ou're\b/g, "yuw'we")
            // ... More text replacement rules here, reply in comments if you have any suggestions ...
            .replace(/([.!?])\s+/g, (match, p1) => {
                const random = Math.random();
                if (random < 0.05) return `${p1} uwu `;
                if (random < 0.10) return `${p1} owo `;
                if (random < 0.15) return `${p1} >w< `;
                return match;
            })
             .replace(/(!+)/g, (match) => Math.random() < 0.7 ? `${match}~` : match)
             .replace(/([.!?])($|\n)/gm, (match, p1, p2) => {
                 const random = Math.random();
                 let suffix = '';
                 if (random < 0.08) suffix = ` (✿◠‿◠)`;
                 else if (random < 0.16) suffix = ` (◕ᴗ◕✿)`;
                 else if (random < 0.24) suffix = ` (。◕‿◕。)`;
                 return `${p1}${suffix}${p2}`;
             });
    }

    // --- DOM Processing ---
    function traverseAndUwuify(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            if (node.parentNode && TAGS_TO_SKIP_UWUIFY.has(node.parentNode.tagName)) {
                return;
            }
            const trimmedText = node.nodeValue.trim();
            if (trimmedText.length > 0) {
                 // Check for our placeholders - DO NOT uwuify them
                 if (!trimmedText.startsWith('[[CODE_BLOCK_') && !trimmedText.startsWith('[[INLINE_CODE_')) {
                     node.nodeValue = uwuifyText(node.nodeValue);
                 }
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (TAGS_TO_SKIP_UWUIFY.has(node.tagName)) {
                return;
            }
            node.childNodes.forEach(traverseAndUwuify);
        }
    }

    function uwuifyHtmlContent(htmlString) {
        // Protect code blocks and inline code with placeholders
        const codeBlocks = [];
        let processedHtml = htmlString.replace(/```([\s\S]*?)```/g, (match, codeContent) => {
             const placeholder = `<pre class="uwu-placeholder-block">[[CODE_BLOCK_${codeBlocks.length}]]</pre>`;
             codeBlocks.push(match);
            return placeholder;
        });

        const inlineCode = [];
        processedHtml = processedHtml.replace(/`([^`]+?)`/g, (match, codeContent) => {
             const placeholder = `<code class="uwu-placeholder-inline">[[INLINE_CODE_${inlineCode.length}]]</code>`;
             inlineCode.push(match);
             return placeholder;
        });

        // Parse the HTML with placeholders into a DOM fragment
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = processedHtml;

        // Traverse the DOM fragment and apply uwuifyText to safe text nodes
        traverseAndUwuify(tempDiv);

        // Serialize the modified DOM fragment back to an HTML string
        let uwuifiedHtml = tempDiv.innerHTML;

        // Restore original code blocks and inline code
        uwuifiedHtml = uwuifiedHtml.replace(/<pre class="uwu-placeholder-block">\[\[CODE_BLOCK_(\d+)\]\]<\/pre>/g, (match, index) => {
            return codeBlocks[parseInt(index, 10)] || match;
        });
         uwuifiedHtml = uwuifiedHtml.replace(/<code class="uwu-placeholder-inline">\[\[INLINE_CODE_(\d+)\]\]<\/code>/g, (match, index) => {
             return inlineCode[parseInt(index, 10)] || match;
         });

        return uwuifiedHtml;
    }

    // --- DOM Manipulation ---
    function findContentElements(parentElement) {
        for (const selector of CONTENT_SELECTORS) {
            const elements = parentElement.querySelectorAll(selector);
            if (elements.length > 0) {
                 const filtered = Array.from(elements).filter(el => el.textContent.trim().length > 0 && !el.querySelector(CONTENT_SELECTORS.join(',')));
                 if (filtered.length > 0) return filtered;
                return Array.from(elements);
            }
        }
        // Fallback: Look for direct div children that aren't just simple containers
        const directDivs = parentElement.querySelectorAll(':scope > div:not(:has(button):only-child)');
        if (directDivs.length > 0) return Array.from(directDivs).filter(el => el.textContent.trim().length > 10);

        // Fallback: Use the parent itself if it has significant text and few children
        if (parentElement.textContent.trim().length > 50 && parentElement.childElementCount < 5) {
             return [parentElement];
        }
        return [];
    }

    function applyUwU() {
        modifiedElements.clear();

        const assistantMessages = document.querySelectorAll(ASSISTANT_MESSAGE_SELECTOR);
        assistantMessages.forEach(messageContainer => {
            const contentElements = findContentElements(messageContainer);
            contentElements.forEach(element => {
                 if (element.closest(ASSISTANT_MESSAGE_SELECTOR) !== messageContainer || modifiedElements.has(element)) {
                   return;
                 }
                 if (!element.hasAttribute(ORIGINAL_CONTENT_ATTR)) {
                    element.setAttribute(ORIGINAL_CONTENT_ATTR, element.innerHTML);
                 }
                 const originalContent = element.getAttribute(ORIGINAL_CONTENT_ATTR);
                 if (originalContent !== null) {
                     element.innerHTML = uwuifyHtmlContent(originalContent);
                     modifiedElements.add(element);
                 }
            });
        });
    }

    function revertUwU() {
        modifiedElements.forEach(element => {
            if (element.hasAttribute(ORIGINAL_CONTENT_ATTR)) {
                element.innerHTML = element.getAttribute(ORIGINAL_CONTENT_ATTR);
            }
        });
    }

    function toggleUwU() {
        isUwuActive = !isUwuActive;
        if (isUwuActive) {
            applyUwU();
            uwuButton.textContent = 'De-UwUify';
            uwuButton.setAttribute('data-active', 'true');
        } else {
            revertUwU();
            uwuButton.textContent = 'UwUify';
            uwuButton.setAttribute('data-active', 'false');
        }
    }

    // --- Button Creation and Injection ---
    function createUwUButton() {
        const button = document.createElement('button');
        button.id = UWU_BUTTON_ID;
        button.className = 'uwu-button flex items-center justify-center rounded-md border h-9 w-auto px-3 py-2 text-sm font-medium transition-colors';
        button.textContent = 'UwUify';
        button.setAttribute('data-active', 'false');
        button.addEventListener('click', toggleUwU);
        return button;
    }


     function addStyles() {
         const styleId = 'uwuifier-styles';
         if (document.getElementById(styleId)) return;

         const style = document.createElement('style');
         style.id = styleId;
         style.textContent = `
             #${UWU_BUTTON_ID} {
                 position: fixed; top: 60px; right: 20px; z-index: 9999;
                 cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                 font-family: inherit;
                 background-color: var(--button-secondary-background, #ffffff);
                 color: var(--button-secondary-color, #374151);
                 border-color: var(--button-secondary-border-color, #d1d5db);
                 transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
             }
             #${UWU_BUTTON_ID}:hover {
                 background-color: var(--button-secondary-background-hover, #f3f4f6);
                 transform: scale(1.03);
             }
             #${UWU_BUTTON_ID}[data-active="true"] { background-color: #d8b4fe; border-color: #c084fc; color: #3b0764; }
             #${UWU_BUTTON_ID}[data-active="true"]:hover { background-color: #c084fc; }

             @media (prefers-color-scheme: dark) {
                 #${UWU_BUTTON_ID} { background-color: #374151; color: #d1d5db; border-color: #4b5563; }
                 #${UWU_BUTTON_ID}:hover { background-color: #4b5563; color: #f9fafb; }
                 #${UWU_BUTTON_ID}[data-active="true"] { background-color: #a855f7; border-color: #9333ea; color: #ffffff; }
                 #${UWU_BUTTON_ID}[data-active="true"]:hover { background-color: #9333ea; }
             }
         `;
         document.head.appendChild(style);
     }

    function initialize() {
        if (initTimeoutId) clearTimeout(initTimeoutId);

        if (document.getElementById(UWU_BUTTON_ID)) {
             if (!uwuButton) uwuButton = document.getElementById(UWU_BUTTON_ID);
             if (uwuButton && uwuButton.getAttribute('data-active') !== String(isUwuActive)) {
                 uwuButton.setAttribute('data-active', String(isUwuActive));
                 uwuButton.textContent = isUwuActive ? 'De-UwUify' : 'UwUify';
             }
             return;
        }

        const chatContainer = document.querySelector('main') || document.body;
        if (chatContainer) {
            addStyles();
            uwuButton = createUwUButton();
            document.body.appendChild(uwuButton);
             if (isUwuActive) {
                 applyUwU();
             }
        } else {
            initTimeoutId = setTimeout(initialize, 1000);
        }
    }

    // --- Mutation Observer ---
    const observer = new MutationObserver((mutations) => {
        let potentiallyNewContent = false;
        let needsButtonCheck = !document.getElementById(UWU_BUTTON_ID);

        for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                 if (needsButtonCheck) {
                     potentiallyNewContent = true;
                     break;
                 }
                 for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                       if ((node.matches && node.matches(ASSISTANT_MESSAGE_SELECTOR)) || (node.querySelector && node.querySelector(ASSISTANT_MESSAGE_SELECTOR))) {
                           potentiallyNewContent = true;
                           break;
                       }
                    }
                 }
            }
            if (potentiallyNewContent && !needsButtonCheck) break;
        }

        if (potentiallyNewContent || needsButtonCheck) {
            clearTimeout(observerDebounceTimeout);
            observerDebounceTimeout = setTimeout(() => {
                 initialize();
                 if (isUwuActive && potentiallyNewContent) {
                     applyUwU();
                 }
            }, DEBOUNCE_DELAY);
        }
    });

    // --- Start Script ---
    observer.observe(document.body, { childList: true, subtree: true });
    initialize();

})();