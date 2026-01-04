// ==UserScript==
// @name         小红书高清图片替换
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  将小红书页面的图片替换为高清版本
// @author       You
// @match        https://www.xiaohongshu.com/*
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/483612/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E9%AB%98%E6%B8%85%E5%9B%BE%E7%89%87%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/483612/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E9%AB%98%E6%B8%85%E5%9B%BE%E7%89%87%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function replaceImageUrls() {
        // 获取所有带有样式 background-image 的 div 元素，选择器是 '.swiper-slide'
        var divElements = document.querySelectorAll('.swiper-slide');

        // 遍历每个 div 元素
        divElements.forEach(function(div) {
            // 获取原始背景图样式
            var originalStyle = div.style.backgroundImage;

            // 提取高清数值，调用 extractHdValue 函数
            var hdValue = extractHdValue(originalStyle);

            // 构建高清链接
            var hdUrl = 'https://ci.xiaohongshu.com/' + hdValue + '?imageView2/2/w/0/format/JPG';

            // 替换原始背景图样式为高清链接
            div.style.backgroundImage = 'url("' + hdUrl + '")';
        });
    }

    function extractHdValue(style) {
        // 使用正则表达式提取高清数值
        var match = style.match(/\/([^\/]+)!/);
        if (match && match[1]) {
            return match[1];
        }
        return null;
    }

    // 在页面加载完成后执行替换操作
    window.addEventListener('load', replaceImageUrls);
})();
