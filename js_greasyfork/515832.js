// ==UserScript==
// @name         Make ppv.land/ft Chat Links Clickable
// @namespace    https://ppv.land/ft
// @version      1.2.1
// @description  Turns URLs in chat messages into clickable links without affecting usernames or badges
// @match        https://ppv.land/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515832/Make%20ppvlandft%20Chat%20Links%20Clickable.user.js
// @updateURL https://update.greasyfork.org/scripts/515832/Make%20ppvlandft%20Chat%20Links%20Clickable.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to make URLs clickable while preserving styles and usernames
    function makeLinksClickable() {
        const messages = document.querySelectorAll('.message-text');

        messages.forEach(message => {
            // Skip if links already processed
            if (message.dataset.linksProcessed) return;

            // Separate the username part from the message text
            const usernameEnd = message.innerHTML.indexOf(':') + 1;
            const usernamePart = message.innerHTML.slice(0, usernameEnd);
            const textPart = message.innerHTML.slice(usernameEnd);

            // Only modify URLs in the text part, preserving any special username styling
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            const updatedTextPart = textPart.replace(urlRegex, (url) => `<a href="${url}" target="_blank" style="color: inherit;">${url}</a>`);

            // Combine the username part and the updated text part
            message.innerHTML = usernamePart + updatedTextPart;
            message.dataset.linksProcessed = 'true';
        });
    }

    // Run the function initially and whenever new messages are added
    makeLinksClickable();
    const observer = new MutationObserver(makeLinksClickable);
    observer.observe(document.getElementById('message-list'), { childList: true });
})();