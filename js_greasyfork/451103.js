// ==UserScript==
// @name         网站字体统一使用微软雅黑
// @namespace    blak-kong
// @version      0.3
// @description  统一浏览器字体：所有网站使用微软雅黑，防止技术文档使用特殊字体库，无法正常浏览!
// @author       blak-kong
// @icon         https://www.google.com/s2/favicons?sz=64&domain=web3doc.top
// @grant        GM_addStyle
// @run-at       document-start
// @match        *://*/*
// @downloadURL https://update.greasyfork.org/scripts/451103/%E7%BD%91%E7%AB%99%E5%AD%97%E4%BD%93%E7%BB%9F%E4%B8%80%E4%BD%BF%E7%94%A8%E5%BE%AE%E8%BD%AF%E9%9B%85%E9%BB%91.user.js
// @updateURL https://update.greasyfork.org/scripts/451103/%E7%BD%91%E7%AB%99%E5%AD%97%E4%BD%93%E7%BB%9F%E4%B8%80%E4%BD%BF%E7%94%A8%E5%BE%AE%E8%BD%AF%E9%9B%85%E9%BB%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    GM_addStyle("*:not(i) { font-family: '微软雅黑','Microsoft YaHei' !important;text-shadow : 0.01em 0.01em 0.01em #999999; }")

    /**
    function addStyle(rules) {
        var styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
        styleElement.appendChild(document.createTextNode(rules));
    }
    addStyle("*{ font-family: '微软雅黑','Microsoft YaHei' !important;text-shadow : 0.01em 0.01em 0.01em #999999; }");
    */
})();