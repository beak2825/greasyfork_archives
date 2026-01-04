// ==UserScript==
// @name         Lock Scroll to Bottom
// @namespace    https://github.com/prudentbird
// @version      1.1
// @description  Automatically keep the scroll locked to the bottom of the chat container on t3.chat
// @author       Prudent Bird
// @match        https://t3.chat/*
// @match        https://beta.t3.chat/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=t3.chat
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536379/Lock%20Scroll%20to%20Bottom.user.js
// @updateURL https://update.greasyfork.org/scripts/536379/Lock%20Scroll%20to%20Bottom.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function waitForElement(selector, callback) {
        const el = document.querySelector(selector);
        if (el) {
            callback(el);
        } else {
            setTimeout(() => waitForElement(selector, callback), 500);
        }
    }

    waitForElement('div.absolute.inset-0.overflow-y-scroll', (el) => {
        const threshold = 50;
        let autoScrollEnabled = true;

        const scrollToBottom = () => {
            setTimeout(() => {
                el.scrollTop = el.scrollHeight;
            autoScrollEnabled = true;
        }, 0);
        };

        el.addEventListener('scroll', () => {
            const distanceToBottom = el.scrollHeight - el.clientHeight - el.scrollTop;
            autoScrollEnabled = distanceToBottom <= threshold;
        });

        scrollToBottom();

        const observer = new MutationObserver(() => {
            if (autoScrollEnabled) {
                scrollToBottom();
            }
        });

        observer.observe(el, { childList: true, subtree: true });
    });
})();