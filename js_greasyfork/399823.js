// ==UserScript==
// @name         EWT听课助手（感谢513林士涵提供代码）
// @namespace    http://tampermonkey.net/
// @version      0.1.20
// @description  自动防止戛然而止
// @author       浙江省杭州第二中学林士涵 & 某个在没有经过他同意的情况下把它做成脚本的人（希望他不会怪我，逃）
// @match        https://live.ewt360.com/Live/Detail?id=*
// @match        http://live.ewt360.com/Live/Detail?id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399823/EWT%E5%90%AC%E8%AF%BE%E5%8A%A9%E6%89%8B%EF%BC%88%E6%84%9F%E8%B0%A2513%E6%9E%97%E5%A3%AB%E6%B6%B5%E6%8F%90%E4%BE%9B%E4%BB%A3%E7%A0%81%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/399823/EWT%E5%90%AC%E8%AF%BE%E5%8A%A9%E6%89%8B%EF%BC%88%E6%84%9F%E8%B0%A2513%E6%9E%97%E5%A3%AB%E6%B6%B5%E6%8F%90%E4%BE%9B%E4%BB%A3%E7%A0%81%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
reamarkAlert = function(){}
self.setInterval("attend()", 1000)

    // Your code here...
})();