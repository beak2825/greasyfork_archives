// ==UserScript==
// @name         V2EX红心
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  V2EX感谢数变成红心
// @author       Mother Ship
// @include        https://*.v2ex.com/*
// @include        https://v2ex.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386843/V2EX%E7%BA%A2%E5%BF%83.user.js
// @updateURL https://update.greasyfork.org/scripts/386843/V2EX%E7%BA%A2%E5%BF%83.meta.js
// ==/UserScript==

(function() {
    document.querySelectorAll('span').forEach(item => {
        if("small fade"==item.className) {
            item.style.color="red";
        }
    });
})();