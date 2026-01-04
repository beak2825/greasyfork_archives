// ==UserScript==
// @name     Poe.com 宽屏
// @namespace http://tampermonkey.net/
// @version  1.0
// @description  在AI网站POE，宽屏显示
// @grant    none
// @match    https://*.poe.com/*
// @run-at   document-start
// @license  MIT
// @downloadURL https://update.greasyfork.org/scripts/476208/Poecom%20%E5%AE%BD%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/476208/Poecom%20%E5%AE%BD%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    var css = `
    /* 禁用 max-width 和 width */
    .Message_botMessageBubble__CPGMI,
    .Message_humanMessageBubble__Nld4j,
    .ChatPageMain_container__1aaCT {
        max-width: none;
    }
    .MainColumn_column__z1_q8 {
        width: 85%;
    }
    `;

    var style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    (document.head||document.documentElement).appendChild(style);
})();