// ==UserScript==
// @name         绕过草料二维码的微信限制
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  绕过草料二维码(clewm.net)的“仅允许微信打开”限制，直接在浏览器中跳转到目标网址。
// @author       xiangming
// @match        https://h5.clewm.net/*
// @grant        none
// @run-at       document-start
// @license MIT   ***
// @downloadURL https://update.greasyfork.org/scripts/542076/%E7%BB%95%E8%BF%87%E8%8D%89%E6%96%99%E4%BA%8C%E7%BB%B4%E7%A0%81%E7%9A%84%E5%BE%AE%E4%BF%A1%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/542076/%E7%BB%95%E8%BF%87%E8%8D%89%E6%96%99%E4%BA%8C%E7%BB%B4%E7%A0%81%E7%9A%84%E5%BE%AE%E4%BF%A1%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 关键代码：在网页脚本运行之前，修改浏览器的 userAgent
    // 我们在原始 userAgent 的末尾添加了微信的标识 'MicroMessenger'
    Object.defineProperty(navigator, 'userAgent', {
        value: navigator.userAgent + ' MicroMessenger/wxwork|MicroMessenger',
        writable: false,
        configurable: true,
        enumerable: true,
    });
})();