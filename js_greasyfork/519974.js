// ==UserScript==
// @name         Auto Close exhentai/e-hentai Download Page
// @namespace    http://your.namespace/
// @version      1.1
// @description  在e-hentai和exhentai归档下载后，自动关闭弹出的小窗口
// @author       puding
// @match        https://*.hath.network/archive/*
// @exclude      https://example.com/*  // 这里可以排除不需要处理的页面
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519974/Auto%20Close%20exhentaie-hentai%20Download%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/519974/Auto%20Close%20exhentaie-hentai%20Download%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义一个检查下载链接的函数
    function checkDownloadPage() {
        const currentUrl = window.location.href;

        // 检查当前 URL 是否符合下载链接模式
        if (currentUrl.match(/https:\/\/\w+\.hath\.network\/archive\/\d+\/[a-zA-Z0-9]+\/\w+\/\d+\?autostart=1/)) {
            // 关闭页面
            window.close();
        }
    }

    // 每秒检查一次当前页面 URL
    setInterval(checkDownloadPage, 5000);
})();