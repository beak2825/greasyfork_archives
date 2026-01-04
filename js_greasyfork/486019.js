// ==UserScript==
// @name         Bilibili-Tab内跳转
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Bilibili tab内跳转
// @author       You
// @match        https://*.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486019/Bilibili-Tab%E5%86%85%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/486019/Bilibili-Tab%E5%86%85%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('click', (event) => {
        event.preventDefault();
        var targetLink = event.target.closest('a');

        // Check if the clicked element is an anchor tag
        if (targetLink) {
            // Open the target '_self'
            window.open(targetLink.href, '_self')

        }
    })
})();