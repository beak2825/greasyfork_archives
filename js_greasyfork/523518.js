// ==UserScript==
// @name         ChatGPT Scroll Fix 2
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Fix scroll issues on ChatGPT for Safari iOS 15/16
// @author       0xkuj
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523518/ChatGPT%20Scroll%20Fix%202.user.js
// @updateURL https://update.greasyfork.org/scripts/523518/ChatGPT%20Scroll%20Fix%202.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Fix overflow hidden issues on all elements
    document.querySelectorAll('html *').forEach(function(node) {
        const computedStyle = getComputedStyle(node);
        if (computedStyle['overflow'] === 'hidden') {
            node.style['overflow'] = 'visible';
        }
    });
})();
