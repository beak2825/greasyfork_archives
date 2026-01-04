// ==UserScript==
// @name         ChatGPT Small Windows Enter Key Fix
// @namespace    https://chatgpt.com
// @version      1.1
// @description  Enable Enter to send (Shift+Enter for newline), will update whenever GPT updates.
// @description  Adapted from rbutera's version 2.1. His version has already stopped working.
// @author       Gavin (adapted from rbutera's version 2.1)
// @match        https://chatgpt.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533168/ChatGPT%20Small%20Windows%20Enter%20Key%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/533168/ChatGPT%20Small%20Windows%20Enter%20Key%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Try to wire up Enter→Send on the textarea
    function bindEnterKey() {
        const textarea = document.getElementById('prompt-textarea') || document.querySelector('textarea');
        if (!textarea || textarea._enterBound) return;

        textarea.addEventListener('keydown', e => {
            //console.log("hit if")
            console.log(e.key, e.shiftKey)
            if (e.key == 'Enter' && !e.shiftKey) {
                console.log("pass enter if")
                e.preventDefault();
                const sendBtn = document.querySelector('button[data-testid="send-button"]');
                if (sendBtn) sendBtn.click();
            }
        });

        // Mark it so we don't double-bind
        textarea._enterBound = true;
    }

    // Initial binding
    bindEnterKey();

    // Watch for re-renders (ChatGPT UI can swap out the textarea)
    new MutationObserver(bindEnterKey).observe(document.body, { childList: true, subtree: true });
})();