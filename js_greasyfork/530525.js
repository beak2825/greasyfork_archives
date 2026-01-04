// ==UserScript==
// @name         YouTube Video Page Auto Refresh
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  仅在打开 YouTube 视频页面时执行一次自动刷新
// @author       BH3GEI
// @match        *://*.youtube.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530525/YouTube%20Video%20Page%20Auto%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/530525/YouTube%20Video%20Page%20Auto%20Refresh.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("YT Refresh: 脚本已加载，当前URL:", window.location.href);

    // 如果URL中包含"/watch"，认为是视频页面
    if (window.location.pathname.indexOf("/watch") !== -1) {
        console.log("YT Refresh: 当前为视频页面。");

        // 利用 sessionStorage 防止无限刷新：如果未设置刷新标记，则刷新一次
        if (!sessionStorage.getItem('ytAutoRefreshDone')) {
            sessionStorage.setItem('ytAutoRefreshDone', 'true');
            console.log("YT Refresh: 未检测到刷新标记，执行刷新操作。");
            // reload(true) 传参确保从服务器重新加载
            window.location.reload(true);
        } else {
            console.log("YT Refresh: 已检测到刷新标记，取消刷新。");
            // 刷新后移除标记，便于下次手动刷新时生效
            sessionStorage.removeItem('ytAutoRefreshDone');
        }
    } else {
        console.log("YT Refresh: 当前页面不是视频页面，无需刷新。");
    }
})();