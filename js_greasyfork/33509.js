// ==UserScript==
// @name         跳过QQ邮箱跳转确认
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       xrr
// @include        *mail.qq.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33509/%E8%B7%B3%E8%BF%87QQ%E9%82%AE%E7%AE%B1%E8%B7%B3%E8%BD%AC%E7%A1%AE%E8%AE%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/33509/%E8%B7%B3%E8%BF%87QQ%E9%82%AE%E7%AE%B1%E8%B7%B3%E8%BD%AC%E7%A1%AE%E8%AE%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(window.location.href.indexOf('false')!==-1){
        setTimeout("goUrl(1)",1000);
    }
    // Your code here...
})();