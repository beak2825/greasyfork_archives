// ==UserScript==
// @name         ChatGPT变宽
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Apply custom CSS styles
// @match        https://chatgpt.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/514782/ChatGPT%E5%8F%98%E5%AE%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/514782/ChatGPT%E5%8F%98%E5%AE%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var style = document.createElement('style');
    style.innerHTML = `
        @media (min-width: 1280px) {
            .mx-auto.flex.flex-1.gap-4.text-base.md\\:gap-5.lg\\:gap-6.md\\:max-w-3xl.lg\\:max-w-\\[40rem\\].xl\\:max-w-\\[48rem\\] {
                max-width: 999rem !important;
            }
        }
    `;
    document.head.appendChild(style);
})();
