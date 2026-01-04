// ==UserScript==
// @name         彩色来!
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  去除灰色
// @author       Rod
// @match        https://*/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455730/%E5%BD%A9%E8%89%B2%E6%9D%A5%21.user.js
// @updateURL https://update.greasyfork.org/scripts/455730/%E5%BD%A9%E8%89%B2%E6%9D%A5%21.meta.js
// ==/UserScript==

(function(){
    const styleSheet = document.createElement('style');
    document.head.appendChild(styleSheet);
    styleSheet.textContent = "html,body,div{-webkit-filter: none !important;-moz-filter: none !important;-ms-filter: none !important;-o-filter:none !important;filter: none !important;}";
})()