// ==UserScript==
// @name         屏蔽大会员彩色弹幕(2025.4.19亲测可用)
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  装上就会自动屏蔽B站新出的大会员彩色渐变弹幕了
// @author       You
// @match        https://www.bilibili.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467782/%E5%B1%8F%E8%94%BD%E5%A4%A7%E4%BC%9A%E5%91%98%E5%BD%A9%E8%89%B2%E5%BC%B9%E5%B9%95%282025419%E4%BA%B2%E6%B5%8B%E5%8F%AF%E7%94%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/467782/%E5%B1%8F%E8%94%BD%E5%A4%A7%E4%BC%9A%E5%91%98%E5%BD%A9%E8%89%B2%E5%BC%B9%E5%B9%95%282025419%E4%BA%B2%E6%B5%8B%E5%8F%AF%E7%94%A8%29.meta.js
// ==/UserScript==

(function () {
 'use strict';
var StyleElement = document.createElement('style');
StyleElement.innerText = '.bili-danmaku-x-dm-vip{display:none !important; }';
document.body.appendChild(StyleElement);
StyleElement.innerText += '.bili-dm-vip{display:none !important; }';
document.body.appendChild(StyleElement);
StyleElement.innerText += '.bili-danmaku-x-colorful{display:none !important; }';
document.body.appendChild(StyleElement);
})();