// ==UserScript==
// @name         小黑盒跳转社区
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  小黑盒分享链接自动跳转小黑盒社区
// @author       Apine
// @match        *://api.xiaoheihe.cn/v3/bbs/app/api/web/*
// @icon         https://imgheybox.max-c.com/oa/2024/11/27/3912834da32296bd985281f8944e75fc.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528975/%E5%B0%8F%E9%BB%91%E7%9B%92%E8%B7%B3%E8%BD%AC%E7%A4%BE%E5%8C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/528975/%E5%B0%8F%E9%BB%91%E7%9B%92%E8%B7%B3%E8%BD%AC%E7%A4%BE%E5%8C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    console.log(window.location.search)
    const linkId = window.location.search.match(/link_id=(\w+)/)?.[1]
    if(linkId) {
      window.location.replace(`https://www.xiaoheihe.cn/app/bbs/link/${linkId}`)
    }
})();