// ==UserScript==
// @name         ChatGPT Cmd+Enter Send and Enter New Line
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Send messages on ChatGPT with Cmd+Enter, use Enter for new lines
// @author       15d23
// @match        https://chat.openai.com/*
// @grant        none
// @license      GPL
// @created      2023-04-17
// @updated      2023-05-01
// @downloadURL https://update.greasyfork.org/scripts/467833/ChatGPT%20Cmd%2BEnter%20Send%20and%20Enter%20New%20Line.user.js
// @updateURL https://update.greasyfork.org/scripts/467833/ChatGPT%20Cmd%2BEnter%20Send%20and%20Enter%20New%20Line.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function handleKeyPress(event) {
        const inputBox = document.querySelector('textarea');
        if (event.key === 'Enter' && !event.metaKey && inputBox) {
            event.stopPropagation();
        }
    }

    function overrideEnterKey() {
        const inputBox = document.querySelector('textarea');
        if (inputBox) {
            inputBox.removeEventListener('keydown', handleKeyPress, true);
            inputBox.addEventListener('keydown', handleKeyPress, true);
        }
    }

    const observer = new MutationObserver(overrideEnterKey);
    observer.observe(document, { childList: true, subtree: true });
})();
