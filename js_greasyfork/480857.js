// ==UserScript==
// @name         ChatGPT Markdown Formatter with Syntax Highlighting
// @version      0.2
// @description  Format user input in ChatGPT with Markdown and Syntax Highlighting
// @author       u/sarke1 (and gpt-4)
// @license      MIT
// @match        https://chat.openai.com/*
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/markdown-it/13.0.2/markdown-it.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js
// @namespace https://greasyfork.org/users/1224048
// @downloadURL https://update.greasyfork.org/scripts/480857/ChatGPT%20Markdown%20Formatter%20with%20Syntax%20Highlighting.user.js
// @updateURL https://update.greasyfork.org/scripts/480857/ChatGPT%20Markdown%20Formatter%20with%20Syntax%20Highlighting.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    const debug = false;

    const log = (...vars) => {
        if (!debug) {
            return;
        }

        console.log(...vars);
    };

    log("Script starting...");

    log("Libraries loaded...");

    const md = markdownit({
        highlight: function (str, lang) {
            let highlightedCode, detectedLang;

            if (lang && hljs.getLanguage(lang)) {
                try {
                    const result = hljs.highlight(str, { language: lang, ignoreIllegals: true });
                    highlightedCode = result.value;
                    detectedLang = lang;
                } catch (__) {}
            } else {
                const result = hljs.highlightAuto(str);
                highlightedCode = result.value;
                detectedLang = result.language;
            }

            return `<pre><div class="bg-black rounded-md mb-4">` +
                `<div class="flex items-center relative text-gray-200 bg-gray-800 px-4 py-2 text-xs font-sans justify-between rounded-t-md">` +
                `<span>${detectedLang || 'plaintext'}</span>` +
                //`<button class="flex ml-auto gap-2">Copy code</button>` +
                `</div>` +
                `<div class="p-4 overflow-y-auto"><code class="!whitespace-pre hljs language-${detectedLang || 'plaintext'}">` +
                highlightedCode +
                `</code></div></div></pre>`;
        }
    });

    log("Markdown-it initialized...");

    const formatMessages = (observer) => {
        log("Formatting messages...");

        // Disconnect observer to prevent recursion
        observer.disconnect();

        document.querySelectorAll('main > div[role=presentation] div[data-message-author-role="user"]').forEach(messageDiv => {
            log("Checking user message: ", messageDiv);

            const parentElement = messageDiv.parentElement;
            if (!parentElement.hasAttribute('data-user-message-container')) {
                parentElement.setAttribute('data-user-message-container', ''); // Tag the parent
            }

            if (messageDiv.hasAttribute('data-formatted')) {
                log("Message already formatted.");
                return;
            }

            const unformattedDiv = messageDiv.querySelector('div[class=""]');

            const originalText = unformattedDiv.textContent;
            log("Original Text: ", originalText);

            const formattedText = md.render(originalText);

            const formattedDiv = document.createElement('div');
            formattedDiv.className = 'formatted-message markdown prose w-full break-words dark:prose-invert light';
            formattedDiv.innerHTML = formattedText;
            formattedDiv.style.whiteSpace = 'normal';

            unformattedDiv.style.display = 'none';

            messageDiv.setAttribute('data-formatted', 'true'); // Mark message as formatted
            messageDiv.appendChild(formattedDiv);

            log("Message formatted.");
        });

        // Reconnect observer
        observer.observe(targetNode, config);
    };

    const userMessageSelector = '[data-message-author-role="user"]';
    let currentMessageCount = document.querySelectorAll(userMessageSelector).length;

    const observerCallback = (mutationsList, observer) => {
        log("Mutation observed...");

        const newMessageCount = document.querySelectorAll(userMessageSelector).length;
        if (newMessageCount !== currentMessageCount) {
            log(`New count: ${newMessageCount}`);
            currentMessageCount = newMessageCount;
            formatMessages(observer);
        }
    };

    // Initialize MutationObserver
    const targetNode = document.querySelector('main');
    log("Target node for MutationObserver: ", targetNode);

    const config = { childList: true, subtree: true };

    const observer = new MutationObserver(observerCallback);
    observer.observe(targetNode, config);
})();