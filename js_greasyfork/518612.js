// ==UserScript==
// @name         KaTeX Discord
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Allows the use of LaTeX formatting in Discord messages
// @author       gnew
// @license      MIT
// @match        https://discordapp.com/*
// @match        https://discord.com/*
// @resource     katexCSS https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.css
// @require      https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js
// @require      https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/518612/KaTeX%20Discord.user.js
// @updateURL https://update.greasyfork.org/scripts/518612/KaTeX%20Discord.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!renderMathInElement) throw "KaTeX failed to load";

    const options = {
        delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false}
        ],
        throwOnError: false
    };

    GM_addStyle(GM_getResourceText("katexCSS"));

    // Function to combine adjacent spans and render math
    function renderMathInMessage(element) {
        const messageContent = element.querySelector('[id^="message-content-"]');

        // Combine the text content of all spans
        const combinedText = Array.from(messageContent.querySelectorAll('span'))
            .map(span => span.textContent)
            .join('');

        // Create a temporary div with the combined text
        const tempDiv = document.createElement('div');
        tempDiv.textContent = combinedText;

        // Render math in the temporary div
        renderMathInElement(tempDiv, options);

        // Only update if the content actually changed (had math)
        if (tempDiv.innerHTML !== combinedText) {
            messageContent.innerHTML = tempDiv.innerHTML;
        }
    }

    const observer = new MutationObserver(function(mutations) {
        for (const mutation of mutations) {
            for (const added of mutation.addedNodes) {
                if (added.nodeType === Node.ELEMENT_NODE && added.id?.startsWith('chat-messages-')) {
                    renderMathInMessage(added);
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial render for any existing messages
    document.querySelectorAll('[id^="chat-messages-"]').forEach(renderMathInMessage);
})();