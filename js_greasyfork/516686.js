// ==UserScript==
// @name         BDImg jump2.bdimg.com重定向到百度贴吧tieba.baidu.com
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  访问 jump2.bdimg.com 时自动重定向到 tieba.baidu.com
// @author       life9211
// @match        https://jump2.bdimg.com/*
// @match        https://jump.bdimg.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516686/BDImg%20jump2bdimgcom%E9%87%8D%E5%AE%9A%E5%90%91%E5%88%B0%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7tiebabaiducom.user.js
// @updateURL https://update.greasyfork.org/scripts/516686/BDImg%20jump2bdimgcom%E9%87%8D%E5%AE%9A%E5%90%91%E5%88%B0%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7tiebabaiducom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前URL
    const currentUrl = window.location.href;

    // 创建新的URL对象
    const url = new URL(currentUrl);

    // 修改主机名
    url.hostname = 'tieba.baidu.com';

    // 添加延迟后重定向
    setTimeout(() => {
        window.location.replace(url.toString());
    }, 1000);// 1秒延迟，可以根据需要调整
})();