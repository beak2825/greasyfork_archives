// ==UserScript==
// @name         Gitee直接打开链接
// @namespace    http://tampermonkey.net/
// @version      2024-04-20
// @description  Gitee直接打开链接，不再有中转页面
// @author       微信搜索: weixin-OS
// @match        https://gitee.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gitee.com
// @grant        none
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/492992/Gitee%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/492992/Gitee%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function() {
        $("a[href*='https://gitee.com/link?target=']").each(function() {
            var href = $(this).attr("href");
            var targetPath = href.split("target=")[1];
            var decodedPath = decodeURIComponent(targetPath);

            $(this).attr("href", decodedPath);
            $(this).attr("target", "_blank");
        });
    });
})();