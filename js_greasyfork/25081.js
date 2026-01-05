// ==UserScript==
// @name         雅黑排除iconfont
// @version      1.0
// @description  雅黑排除iconfont！
// @include      *
// @run-at       document-start
// @grant        unsafeWindow
// @license      MIT
// @namespace https://greasyfork.org/users/82349
// @downloadURL https://update.greasyfork.org/scripts/25081/%E9%9B%85%E9%BB%91%E6%8E%92%E9%99%A4iconfont.user.js
// @updateURL https://update.greasyfork.org/scripts/25081/%E9%9B%85%E9%BB%91%E6%8E%92%E9%99%A4iconfont.meta.js
// ==/UserScript==

(function() {
    var element = document.createElement("link");
    element.rel="stylesheet";
    element.type="text/css";
    element.href='data:text/css,*:not([class*="icon"]):not(i):not(s):not(em){font-family:FontAwesome,"Microsoft YaHei UI Light"!important;}.iconfont{font-family:iconfont,shop-iconfont,global-iconfont,"Microsoft YaHei UI Light"!important;}.res_top_banner{display:none}';
    document.documentElement.appendChild(element);
})();

