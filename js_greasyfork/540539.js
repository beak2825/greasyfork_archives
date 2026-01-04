// ==UserScript==
// @name         ChatGPT Scroll Fixer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically set overflowY:auto for scrollable elements in ChatGPT, including Project interface
// @author       You
// @match        https://chatgpt.com/*
// @icon         https://chatgpt.com/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540539/ChatGPT%20Scroll%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/540539/ChatGPT%20Scroll%20Fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Run once on page load
    function fixScrollableElements() {
        document.querySelectorAll('*').forEach(el => {
            if (el.scrollHeight > el.clientHeight) {
                el.style.maxHeight = 'none';
                el.style.overflowY = 'auto';
            }
        });
    }

    // Run initially
    fixScrollableElements();

})();