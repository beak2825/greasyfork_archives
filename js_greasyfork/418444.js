// ==UserScript==
// @name         没有问题！
// @namespace    https://greasyfork.org/zh-CN/users/76579-%E4%BB%99%E5%9C%A3
// @version      0.1
// @description  自动刷新页面，SB逼乎最近总是搞“出了一点问题”，于是就有了这个脚本。
// @author       仙圣
// @include        https://*.zhihu.com/*
// @grant        none
// @icon          https://static.zhihu.com/static/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/418444/%E6%B2%A1%E6%9C%89%E9%97%AE%E9%A2%98%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/418444/%E6%B2%A1%E6%9C%89%E9%97%AE%E9%A2%98%EF%BC%81.meta.js
// ==/UserScript==

(function() {
    setInterval(function() {
         if(document.title=="出了一点问题")
             location.reload();
    },500);
})();