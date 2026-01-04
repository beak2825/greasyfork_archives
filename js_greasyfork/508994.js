// ==UserScript==
// @name         Firefox/ChatGPT: Fix Copy While Editing
// @namespace    https://greasyfork.org/en/users/1337417-mevanlc
// @version      0.1
// @description  Firefox workaround for ChatGPT's buggy code that prevents text copy/cut while editing past chat messages
// @author       You
// @match        https://chatgpt.com/*
// @grant        none
// @run-at       document-start
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/508994/FirefoxChatGPT%3A%20Fix%20Copy%20While%20Editing.user.js
// @updateURL https://update.greasyfork.org/scripts/508994/FirefoxChatGPT%3A%20Fix%20Copy%20While%20Editing.meta.js
// ==/UserScript==

(() => {
    'use strict';
    const logPrefix = "userscript: Firefox/ChatGPT: Fix Copy While Editing:";
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        // console.log("userscript addEventListener override called; type:", type, " listener:", listener, " options:", options);
        if (type === "copy" || type === "cut") {
            const listenerWrapper = (event) => {
                const isEditingChatMsg = event.target && event.target.tagName === "TEXTAREA" && event.target.closest('article');
                if (isEditingChatMsg) {
                    console.log(`${logPrefix} isEditingChatMsg==true: allowing default browser behavior.`);
                } else {
                    console.log(`${logPrefix} isEditingChatMsg==false: invoking ChatGPT's built-in copy/cut handler.`);
                    listener.call(this, event);
                }
            };
            // only wrap 'copy' and 'cut' events
            originalAddEventListener.call(this, type, listenerWrapper, options);
        } else {
            // no custom behavior for events other than 'copy' and 'cut'
            originalAddEventListener.call(this, type, listener, options);
        }
    };
})();
