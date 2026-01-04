// ==UserScript==
// @name         修改页面元素时间
// @namespace    your-namespace
// @version      1.1
// @description  修改页面元素中的时间内容
// @match        https://mp.weixin.qq.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475497/%E4%BF%AE%E6%94%B9%E9%A1%B5%E9%9D%A2%E5%85%83%E7%B4%A0%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/475497/%E4%BF%AE%E6%94%B9%E9%A1%B5%E9%9D%A2%E5%85%83%E7%B4%A0%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 指定链接和对应的时间
    var linkTimeMap = {
        "https://mp.weixin.qq.com/s/AAA": "2023-09-01 18:00",
        "https://mp.weixin.qq.com/s/CCC": "2023-08-15 13:00"
    };

    // 获取当前链接
    var currentLink = window.location.href;

    // 检查当前链接是否在指定的链接和时间映射中
    if (currentLink in linkTimeMap) {
        // 获取要修改的元素
        var element = document.getElementById("publish_time");
        if (element) {
            // 修改元素的内容为指定的时间
            element.textContent = linkTimeMap[currentLink];
        }
    }
})();
