// ==UserScript==
// @name         去除首页内测
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去除99首页内测
// @author       You
// @match        https://web.jiujiupingou.com/ManyPG/Index*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428968/%E5%8E%BB%E9%99%A4%E9%A6%96%E9%A1%B5%E5%86%85%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/428968/%E5%8E%BB%E9%99%A4%E9%A6%96%E9%A1%B5%E5%86%85%E6%B5%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
// @run-at       document-body
   document.getElementsByClassName("layui-layer-btn0")[0].click();
    // Your code here...
})();