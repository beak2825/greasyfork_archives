// ==UserScript==
// @name         访问桌面版网页
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  当打开移动端网页时重新定向至桌面版网页
// @author       Dylan_Zhang
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475099/%E8%AE%BF%E9%97%AE%E6%A1%8C%E9%9D%A2%E7%89%88%E7%BD%91%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/475099/%E8%AE%BF%E9%97%AE%E6%A1%8C%E9%9D%A2%E7%89%88%E7%BD%91%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前网址
var currentUrl = window.location.href;

// 检查网址中是否包含"/m."、"/mobile/"或".m."
if (currentUrl.includes("/m.") || currentUrl.includes("/mobile/") || currentUrl.includes(".m.")) {
    // 替换"/m."、"/mobile/"和".m."为空字符串
    currentUrl = currentUrl.replace("/m.", "/").replace("/mobile/", "/").replace(".m.", ".");

    // 重定向到修改后的网址
    window.location.href = currentUrl;
}



})();