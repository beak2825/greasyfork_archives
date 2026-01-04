// ==UserScript==
// @name         UGG论坛自动切换最新发帖时间
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  指定链接添加特定参数
// @author       as176590811
// @match        https://www.uu-gg.one./forum.php?mod=forumdisplay&fid=*
// @match        *://www.uu-gg.one/forum.php?mod=forumdisplay&fid=*
// @match        *://uu-gg.work.gd/forum.php?mod=forumdisplay&fid=*
// @match        *://uu-gg.work.gd./forum.php?mod=forumdisplay&fid=*
// @match        *://uu-gg.ggff.net./forum.php?mod=forumdisplay&fid=*
// @match        *://uu-gg.ggff.net/forum.php?mod=forumdisplay&fid=*
// @match        *://uu-gg.run.place./forum.php?mod=forumdisplay&fid=*
// @match        *://uu-gg.run.place/forum.php?mod=forumdisplay&fid=*
// @match        *://uu-gg.linkpc.net./forum.php?mod=forumdisplay&fid=*
// @match        *://uu-gg.linkpc.net/forum.php?mod=forumdisplay&fid=*
// @license     GPL License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525609/UGG%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%96%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/525609/UGG%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%96%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前页面的 URL
    let currentUrl = window.location.href;

    // 检查是否已经包含目标参数，避免重复添加
    if (!currentUrl.includes("filter=author") && !currentUrl.includes("orderby=dateline")) {
        // 添加参数
        let newUrl = currentUrl + "&filter=author&orderby=dateline";
        // 跳转到新的 URL
        window.location.href = newUrl;
    }
})();
