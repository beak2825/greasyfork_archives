// ==UserScript==
// @name         去除qq登录扫码提示
// @namespace    zsdroid
// @version      0.2.3
// @description  delete qrcode tips
// @author       zsdroid
// @match        https://xui.ptlogin2.qq.com/*
// @match        https://ssl.xui.ptlogin2.weiyun.com/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/37039/%E5%8E%BB%E9%99%A4qq%E7%99%BB%E5%BD%95%E6%89%AB%E7%A0%81%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/37039/%E5%8E%BB%E9%99%A4qq%E7%99%BB%E5%BD%95%E6%89%AB%E7%A0%81%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var qr_tips = document.getElementById("qr_tips");
    qr_tips && qr_tips.parentNode.removeChild(qr_tips);
})();
