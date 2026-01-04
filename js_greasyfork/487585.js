// ==UserScript==
// @name         修改用户代理
// @namespace    http://your.namespace.com
// @version      0.3
// @description  修改用户代理字符串
// @author       Your Name
// @license      MIT
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487585/%E4%BF%AE%E6%94%B9%E7%94%A8%E6%88%B7%E4%BB%A3%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/487585/%E4%BF%AE%E6%94%B9%E7%94%A8%E6%88%B7%E4%BB%A3%E7%90%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 设置新的用户代理字符串为 Microsoft Edge
    var newUserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36 Edg/96.0.1054.62";

    // 重写 navigator.userAgent 属性
    Object.defineProperty(navigator, 'userAgent', {
        value: newUserAgent,
        writable: false,
        configurable: false,
        enumerable: true
    });
})();
