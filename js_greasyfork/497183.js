// ==UserScript==
// @name         Zhihu free read
// @name:zh-CN   知乎无障碍阅读
// @description  Zhihu free read, no login required
// @description:zh-cn 知乎无障碍阅读免登陆
// @version      1.0
// @author       Anc
// @include      *://*zhihu.com/*
// @grant        none


// @namespace https://greasyfork.org/users/61607
// @downloadURL https://update.greasyfork.org/scripts/497183/Zhihu%20free%20read.user.js
// @updateURL https://update.greasyfork.org/scripts/497183/Zhihu%20free%20read.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 自动跳转到指定的网址
    if (window.location.href.includes("www.zhihu.com/question/")) {
        var newUrl = window.location.href.replace("www.zhihu.com/question/", "www.zhihu.com/aria/question/");
        console.log('redirect to', newUrl);
        window.location.href = newUrl;
    }

    // 等待页面加载完成后执行隐藏元素和缩放内容的操作
    window.onload = function() {
        // 隐藏id为toolbarHtml的元素
        var toolbar = document.getElementById("toolbarHtml");
        if (toolbar) {
            toolbar.style.display = "none";
            // 缩放页面内容到70%
            document.body.style.zoom = "70%";
        }

    };
})();