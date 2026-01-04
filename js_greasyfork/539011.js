// ==UserScript==
// @name         ChatGPT: Auto-Click Send Button on Enter
// @namespace    chatgpt
// @version      1
// @description  Clicks the send button when Enter is pressed
// @author       TheSina
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/539011/ChatGPT%3A%20Auto-Click%20Send%20Button%20on%20Enter.user.js
// @updateURL https://update.greasyfork.org/scripts/539011/ChatGPT%3A%20Auto-Click%20Send%20Button%20on%20Enter.meta.js
// ==/UserScript==

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        var sendButton = document.querySelector('[data-testid="send-button"]');
        if (sendButton) {
            sendButton.click();
        }
    }
});
