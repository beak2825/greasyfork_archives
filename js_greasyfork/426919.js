// ==UserScript==
// @name         比特球云盘 Lite
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Remove ads.
// @author       L
// @match        *://pan.bitqiu.com/*
// @icon         https://pan.bitqiu.com/Public/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/426919/%E6%AF%94%E7%89%B9%E7%90%83%E4%BA%91%E7%9B%98%20Lite.user.js
// @updateURL https://update.greasyfork.org/scripts/426919/%E6%AF%94%E7%89%B9%E7%90%83%E4%BA%91%E7%9B%98%20Lite.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 隐藏侧栏广告
    let sidebar_activity = document.querySelector('.js-activity-in-sidebar');
    sidebar_activity.style.display="none";
    let sidebar_svg = document.querySelector('.sidebar-bottom > svg');
    if (sidebar_svg) {
        sidebar_svg.parentNode.removeChild(sidebar_svg);
    }

    // 隐藏右下角广告
    let fixed_activity = document.querySelector('.fixed-activity.js-fixed-activity');
    fixed_activity.style.display="none";

    // 隐藏顶栏广告
    let top_activity = document.querySelector('.js-activity-in.pull-right');
    top_activity.style.display="none";

    // 隐藏下载客户端字样
    let download_client = document.querySelector('.download-entry.pull-right span');
    download_client.style.display="none";

    // 隐藏扩容入口
    let space = document.querySelector('.btn-space');
    space.style.display="none";
})();