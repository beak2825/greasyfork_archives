// ==UserScript==
// @name         哔哩哔哩多分P检索
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  通过标题检索视频的分p,并且可以跳转到对应的分p。
// @author       You
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481950/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%A4%9A%E5%88%86P%E6%A3%80%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/481950/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%A4%9A%E5%88%86P%E6%A3%80%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 找到class为'video-info-detail-list'的div
    var div = document.querySelector('.video-info-container');

    if (div) {
        // 创建按钮元素
        var button = document.createElement("button");
        button.innerHTML = "分P检索";

        // 设置按钮样式
        button.style.position = "fixed";
        button.style.top = "40px";
        button.style.right = "20px";
        button.style.zIndex = "99999";
        button.style.padding = "10px";
        button.style.backgroundColor = "#008BBD";
        button.style.color = "white";
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.style.cursor = "pointer";

        // 将按钮添加到页面中
        document.body.appendChild(button);

        // 绑定点击事件
        button.addEventListener('click', function() {
            // 获取当前页面的URL
            var currentUrl = window.location.href;

            // 使用正则表达式获取bv号或av号
            var avOrBvNumber;
            var bvRegEx = /bv(\w+)/i;
            var avRegEx = /av(\d+)/i;

            if (bvRegEx.test(currentUrl)) {
                avOrBvNumber = bvRegEx.exec(currentUrl)[1];
            } else if (avRegEx.test(currentUrl)) {
                avOrBvNumber = avRegEx.exec(currentUrl)[1];
            }

            // 如果找到了bv号或av号，打开新窗口
            if (avOrBvNumber) {
                var newUrl = 'https://bilipages.2314.top?' + (bvRegEx.test(currentUrl) ? 'bv' : 'av') + '=' + (bvRegEx.test(currentUrl) ? 'BV' : 'av') + avOrBvNumber;
                window.open(newUrl, '_blank', 'height=500,width=500,top=100,left=100');
            } else {
                console.log('No av or bv number found in the current URL.');
            }
        });
    } else {
        console.log('No div with class "video-info-detail-list" found.');
    }

})();
