// ==UserScript==
// @name         Douban Redirect Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  豆瓣书影音页面自动跳转到标签按字母顺序排列
// @author       selfcomm
// @match        https://*.douban.com/*/collect*
// @match        https://*.douban.com/*/do*
// @match        https://*.douban.com/*/wish*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490577/Douban%20Redirect%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/490577/Douban%20Redirect%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前页面的 URL
    var currentURL = window.location.href;

    // 检查当前页面是否匹配 collect、do 或 wish 页面
    var regex = /\/(collect|do|wish)$/;
    if (regex.test(currentURL)) {
        // 构建重定向 URL
        var newURL = currentURL + '?sort=time&start=0&filter=all&mode=grid&tags_sort=name';

        // 跳转到新的 URL
        if (newURL !== currentURL) {
            window.location.href = newURL;
        }
    }
})();