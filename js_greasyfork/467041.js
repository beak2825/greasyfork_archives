// ==UserScript==
// @name         定时刷新网页
// @namespace    http://www.example.com
// @version      1.0
// @description  在指定时间间隔内自动刷新网页
// @match        https://www.baidu.com/*
// @grant        none
// @license      MIT
// @author       YJRQZ777(https://github.com/yjrqz777)
// @downloadURL https://update.greasyfork.org/scripts/467041/%E5%AE%9A%E6%97%B6%E5%88%B7%E6%96%B0%E7%BD%91%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/467041/%E5%AE%9A%E6%97%B6%E5%88%B7%E6%96%B0%E7%BD%91%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义刷新时间间隔（以毫秒为单位）
    var refreshInterval = 1000; // 1秒

    // 定义定时刷新函数
    function refreshPage() {
        location.reload();
    }

    // 启动定时器
    setInterval(refreshPage, refreshInterval);
})();