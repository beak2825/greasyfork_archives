// ==UserScript==
// @name         微博直跳2024
// @namespace    http://tampermonkey.net/
// @version      2024-04-15
// @description  微博跳转第三方页面不再等待；修改自“微博直跳”插件
// @author       @me @私聊话题废
// @match        *://weibo.cn/sinaurl?u=http*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492570/%E5%BE%AE%E5%8D%9A%E7%9B%B4%E8%B7%B32024.user.js
// @updateURL https://update.greasyfork.org/scripts/492570/%E5%BE%AE%E5%8D%9A%E7%9B%B4%E8%B7%B32024.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let url = document.querySelector('div.open-url>a').href;
    window.location.href=url
})();