// ==UserScript==
// @name         Copy Feish
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  这是一个飞书复制描述
// @author       Jexxx
// @match        *
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451921/Copy%20Feish.user.js
// @updateURL https://update.greasyfork.org/scripts/451921/Copy%20Feish.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // First, scroll to bottom
    document.querySelector(".global-like-pc__wrapper").scrollIntoView();
    const str = [...document.querySelectorAll("[data-string='true']")].map(item => item.innerHTML).join("")
    navigator.clipboard.writeText(str);
})();