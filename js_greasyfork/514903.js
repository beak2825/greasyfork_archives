// ==UserScript==
// @name         秒画图片清晰度转换脚本
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  秒画图片清晰度转换脚本，替换图片地址中的_small.jpeg为_raw.jpg并跳转
// @author       骄阳
// @match        *://miaohua-cdn-cn.sensetime.com/*_small.jpeg
// @match        *://miaohua-cdn-cn.sensetime.com/*_large.jpeg
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514903/%E7%A7%92%E7%94%BB%E5%9B%BE%E7%89%87%E6%B8%85%E6%99%B0%E5%BA%A6%E8%BD%AC%E6%8D%A2%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/514903/%E7%A7%92%E7%94%BB%E5%9B%BE%E7%89%87%E6%B8%85%E6%99%B0%E5%BA%A6%E8%BD%AC%E6%8D%A2%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前网址
    const currentUrl = window.location.href;

    // 检查网址是否包含_small.jpeg或_large.jpeg
    if (currentUrl.includes('_small.jpeg') || currentUrl.includes('_large.jpeg')) {
        // 替换_small.jpeg或_large.jpeg为_raw.jpg
        const newUrl = currentUrl.replace(/(_small|_large)\.jpeg/, '_raw.jpg');

        // 跳转到新的网址
        window.location.href = newUrl;
    }
})();