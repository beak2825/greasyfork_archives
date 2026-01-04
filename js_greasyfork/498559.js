// ==UserScript==
// @name         ChatGPT.com Mobile Layout Enter Key Fix
// @namespace    https://chatgpt.com
// @version      1.1
// @description  Enables Enter key submission on mobile layout
// @author       MateyR
// @match        https://chatgpt.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498559/ChatGPTcom%20Mobile%20Layout%20Enter%20Key%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/498559/ChatGPTcom%20Mobile%20Layout%20Enter%20Key%20Fix.meta.js
// ==/UserScript==
 
// this is forked from work by Lodimas and rbutera on https://community.openai.com/t/pressing-enter-no-longer-submits/52333
 
(function () {
    'use strict';
 
    function handleKeyPress(event) {
        const textarea = document.getElementById('prompt-textarea');
 
        if (textarea && event.target === textarea && event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            const sendbutton = document.querySelector('button[data-testid="send-button"]');
            if (sendbutton) {
                sendbutton.click();
            }
        }
    }
 
    document.addEventListener('keydown', handleKeyPress);
})();