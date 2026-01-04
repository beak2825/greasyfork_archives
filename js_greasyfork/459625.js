// ==UserScript==
// @name 体验微软AI NEW BING
// @namespace https://www.bing.com/
// @version 0.7.1
// @description 体验微软人工智能举例,比chatgpt的gpt3版本更高的GPT-3.5，使用必应时自动提示，每小时内第一次打开bing自动跳转到Bing AI搜索页面并将cn.bing.com替换为www.bing.com（请注意，该脚本仅在Edge浏览器和https://www.bing.com/*下运行） Telegram新频道：https://t.me/ShareFreely2025 原TG频道：https://t.me/data_share2021  国内可以用讯飞星火，配合去水印脚本https://greasyfork.org/zh-CN/scripts/464914-remove-xunfei-watermark-%E7%A7%BB%E9%99%A4%E8%AE%AF%E9%A3%9E%E6%98%9F%E7%81%ABgpt-ai%E6%B0%B4%E5%8D%B0
// @author skycloud
// @license Apache
// @include https://*.bing.com/*
// @include https://www.bing.com/search*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/459625/%E4%BD%93%E9%AA%8C%E5%BE%AE%E8%BD%AFAI%20NEW%20BING.user.js
// @updateURL https://update.greasyfork.org/scripts/459625/%E4%BD%93%E9%AA%8C%E5%BE%AE%E8%BD%AFAI%20NEW%20BING.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 定义一小时的毫秒数
    var oneHour = 60 * 60 * 1000;
    
    // 获取当前时间的毫秒数
    var currentTime = new Date().getTime();
    
    // 获取上次访问时间的毫秒数
    var lastVisitTime = localStorage.getItem('lastVisitTime');
    
    // 如果上次访问时间不存在或者与当前时间相差超过一小时，则进行跳转
    if (!lastVisitTime || (currentTime - lastVisitTime >= oneHour)) {
        localStorage.setItem('lastVisitTime', currentTime);
        window.location.href = "https://www.bing.com/search?q=Bing+AI&showconv=1&FORM=hpcodx";
    }

    // 如果是 cn.bing.com 则将其替换为 www.bing.com 并刷新页面
    if (window.location.hostname === 'cn.bing.com') {
        window.location.hostname = 'www.bing.com';
        window.location.reload();
    }
})();