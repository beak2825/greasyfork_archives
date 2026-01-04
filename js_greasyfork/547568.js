// ==UserScript==
// @name         Google AI Studio Tab Title Modifier
// @namespace    Violentmonkey userscripts by ReporterX
// @author       ReporterX
// @version      1.11
// @description  Displays the title of the chat (in the Google AI Studio) in your browser tab while preventing the site from overwriting it. It helps you to quickly locate the chat you want when you have multiple chats.
// @match        https://aistudio.google.com/*
// @grant        none
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?domain=aistudio.google.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547568/Google%20AI%20Studio%20Tab%20Title%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/547568/Google%20AI%20Studio%20Tab%20Title%20Modifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Instructions for finding the selector ---
    // 1. Right-click on the chat title in Google AI Studio and select "Inspect".
    // 2. In the developer tools, find the HTML element that contains the title.
    // 3. Look for a unique class name or attribute. A good selector might be a class that seems specific to the title.
    //    For example, if you see <div class="chat-title">My Chat Title</div>, a good selector would be '.chat-title'.
    // 4. Change the value of "chatTitleSelector" with the selector you found.
    const chatTitleSelector = 'h1.actions.mode-title, h1.actions.v3-font-headline-2';

    // A variable to store the last known chat name from the H1 tag.
    let currentChatName = '';

    // --- The Title Enforcer ---
    // This observer's job is to watch the <title> element itself.
    // If the website tries to change it back to the default, this observer will immediately correct it.
    const titleObserver = new MutationObserver(() => {
        if (currentChatName) {
            const desiredTitle = `${currentChatName} - Google AI Studio`;
            if (document.title !== desiredTitle) {
                document.title = desiredTitle;
            }
        }
    });

    // --- The Content Scanner ---
    // This observer watches the whole page to find the chat title element (the H1).
    // It's persistent to handle navigation between different chats.
    const bodyObserver = new MutationObserver(() => {
        const titleElement = document.querySelector(chatTitleSelector);
        if (titleElement) {
            const newChatName = titleElement.textContent.trim();
            // If we found a new chat name, update our stored variable and set the title.
            if (newChatName && newChatName !== currentChatName) {
                currentChatName = newChatName;
                document.title = `${currentChatName} - Google AI Studio`;
            }
        }
    });

    // We need to wait until the <head> and <body> are available in the DOM.
    // 'DOMContentLoaded' is a reliable event for this.
    window.addEventListener('DOMContentLoaded', (event) => {
        const titleEl = document.querySelector('title');
        if (titleEl) {
            // Start the Title Enforcer
            titleObserver.observe(titleEl, { childList: true });
        }

        // Start the Content Scanner
        bodyObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    });

})();