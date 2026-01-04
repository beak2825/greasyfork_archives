// ==UserScript==
// @name     网页字体替换[苹方]并加阴影
// @version      1.6
// @description  个人向
// @author       iSwfe

// 匹配所有网址
// @match        *://*/*

// @run-at       document-start
// @grant        unsafeWindow
// @license      MIT
// @namespace    https://greasyfork.org/zh-CN/users/208142-iswfe
// @downloadURL https://update.greasyfork.org/scripts/381320/%E7%BD%91%E9%A1%B5%E5%AD%97%E4%BD%93%E6%9B%BF%E6%8D%A2%5B%E8%8B%B9%E6%96%B9%5D%E5%B9%B6%E5%8A%A0%E9%98%B4%E5%BD%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/381320/%E7%BD%91%E9%A1%B5%E5%AD%97%E4%BD%93%E6%9B%BF%E6%8D%A2%5B%E8%8B%B9%E6%96%B9%5D%E5%B9%B6%E5%8A%A0%E9%98%B4%E5%BD%B1.meta.js
// ==/UserScript==

(function() {
    function addStyle(rules) {
        var styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
        styleElement.appendChild(document.createTextNode(rules));
    }
    addStyle('* {font-family : "PingFangSC-Medium","iconfont","FontAwesome"}');
    addStyle('* {text-shadow : 0.03em 0.03em 0.03em #666666}');
})();