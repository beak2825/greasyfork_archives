// ==UserScript==
// @name         Redirect to Baidu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Redirect to Baidu after 4 seconds
// @author       You
// @match        https://5aqmmo.mwtksrp.com/home.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479078/Redirect%20to%20Baidu.user.js
// @updateURL https://update.greasyfork.org/scripts/479078/Redirect%20to%20Baidu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待4秒
    setTimeout(function() {
        // 在此处添加跳转到百度首页的代码
        window.location.href = 'https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd=%E8%A7%86%E9%A2%91';
    }, 1500);
})();
