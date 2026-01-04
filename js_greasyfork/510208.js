// ==UserScript==
// @name         Hideen Baidu Wenda
// @namespace    http://tampermonkey.net/
// @version      2024-09-26
// @description  Hide Wenda in Baidu search.
// @author       Leskur
// @license MIT
// @match        https://www.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510208/Hideen%20Baidu%20Wenda.user.js
// @updateURL https://update.greasyfork.org/scripts/510208/Hideen%20Baidu%20Wenda.meta.js
// ==/UserScript==

(function() {
    const style = document.createElement('style')
    style.innerHTML = '[tpl*="wenda_"] {display:none;}'
    document.documentElement.appendChild(style);
})();