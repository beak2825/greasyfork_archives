// ==UserScript==
// @name         ChatGPT: Auto-Click Send Button on Enter
// @namespace    chatgptfixes
// @version      0.2
// @description  Clicks the send button when Enter is pressed
// @match        https://chat.openai.com/*
// @grant        none
// @license      The Unlicense
// @downloadURL https://update.greasyfork.org/scripts/486047/ChatGPT%3A%20Auto-Click%20Send%20Button%20on%20Enter.user.js
// @updateURL https://update.greasyfork.org/scripts/486047/ChatGPT%3A%20Auto-Click%20Send%20Button%20on%20Enter.meta.js
// ==/UserScript==

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        var sendButton = document.querySelector('[data-testid="send-button"]');
        if (sendButton) {
            sendButton.click();
        }
    }
});
