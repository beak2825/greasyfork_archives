// ==UserScript==
// @name         ChatGPT - Enable Edit Button
// @namespace    ChatGPT - Enable Edit Button
// @description  Re-enable the edit button in ChatGPT conversations.
// @version      1.1
// @author       aciid
// @match        *://*.chatgpt.com/*
// @supportURL   https://greasyfork.org/en/scripts/526998/feedback
// @downloadURL https://update.greasyfork.org/scripts/526998/ChatGPT%20-%20Enable%20Edit%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/526998/ChatGPT%20-%20Enable%20Edit%20Button.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function enableEditButton() {
        document.querySelectorAll('button[aria-label="Edit message"]').forEach(button => {
            button.removeAttribute('disabled');
        });
    }

    function applyStyles() {
        var style = document.createElement('style');
        style.innerHTML = "div.absolute.bottom-0.right-full.top-0{display:block!important;left:-50px!important;}";
        document.head.appendChild(style);
    }

    function observeChatChanges() {
        const chatContainer = document.querySelector('body');
        if (!chatContainer) return;

        const observer = new MutationObserver(() => {
            enableEditButton();
        });

        observer.observe(chatContainer, { childList: true, subtree: true });
    }

    // Apply styles and enable edit buttons for all messages on load
    applyStyles();
    enableEditButton();
    observeChatChanges();

    console.log('Tampermonkey script: Edit button enabled for all messages, including new ones, with styling applied.');
})();
