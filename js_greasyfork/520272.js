// ==UserScript==
// @name         腾讯云保活，微信公众号保活
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.2
// @description  腾讯云保活+微信公众号-定时刷新页面token保活
// @author       You
// @match        https://console.cloud.tencent.com/*
// @match        https://mp.weixin.qq.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520272/%E8%85%BE%E8%AE%AF%E4%BA%91%E4%BF%9D%E6%B4%BB%EF%BC%8C%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E4%BF%9D%E6%B4%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/520272/%E8%85%BE%E8%AE%AF%E4%BA%91%E4%BF%9D%E6%B4%BB%EF%BC%8C%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E4%BF%9D%E6%B4%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(() => {
      location.reload();
    }, 1000 * 60 * 60 * 1.5);
    // Your code here...
})();