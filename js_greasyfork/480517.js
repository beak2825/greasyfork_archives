// ==UserScript==
// @name         ChatGPT防手误发送-Ctrl+Enter发送
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  当且仅当Ctrl+Enter时才发送问题
// @author       tutu辣么可爱(GreasyFork)
// @author       IcedWatermelonJuice(GitHub)
// @match        *://chat.openai.com
// @match        *://chat.openai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480517/ChatGPT%E9%98%B2%E6%89%8B%E8%AF%AF%E5%8F%91%E9%80%81-Ctrl%2BEnter%E5%8F%91%E9%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/480517/ChatGPT%E9%98%B2%E6%89%8B%E8%AF%AF%E5%8F%91%E9%80%81-Ctrl%2BEnter%E5%8F%91%E9%80%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const INPUT_BOX_ID = 'prompt-textarea';
    document.addEventListener('keydown', (e) => {
        if (e.target.id !== INPUT_BOX_ID || e.keyCode !== 13 || e.ctrlKey) {
            return;
        }
        e.stopPropagation();
    }, true);
})();