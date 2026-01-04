// ==UserScript==
// @name         自动刷新微博网页
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动刷新打开的微博网页
// @author       ddd
// @match        https://*.weibo.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444930/%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E5%BE%AE%E5%8D%9A%E7%BD%91%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/444930/%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E5%BE%AE%E5%8D%9A%E7%BD%91%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let timeout = 30 // 几秒，例如10就是10秒刷新一次
    console.log('%s秒后刷新: ', timeout);
    setTimeout(() => {
      location.reload()
    }, timeout*1000);
})();