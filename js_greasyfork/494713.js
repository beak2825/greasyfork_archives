// ==UserScript==
// @name         自动点击分组管理

// @version      1.1
// @description  每5分钟自动点击分组管理图标
// @author       abuo
// @match        https://172.16.196.8*/*
// @grant        none
// @namespace https://greasyfork.org/users/1300232
// @downloadURL https://update.greasyfork.org/scripts/494713/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%88%86%E7%BB%84%E7%AE%A1%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/494713/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%88%86%E7%BB%84%E7%AE%A1%E7%90%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 每5分钟（300000毫秒）执行一次
    setInterval(function() {
        var icon = document.querySelector('i.icon10'); // 使用正确的选择器
        if (icon) {
            icon.click(); // 执行点击操作
        }
    }, 300000); // 300000毫秒 = 5分钟
})();