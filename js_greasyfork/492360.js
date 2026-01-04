// ==UserScript==
// @name         Bilibili 跳转按钮
// @namespace    https://www.bilibili.com/
// @version      1.2
// @description  在Bilibili首页和带有特定参数的Bilibili页面添加一个跳转按钮，跳转到指定页面
// @author       咖啡_l
// @match        https://www.bilibili.com/*
// @match        https://www.bilibili.com/*?spm_id_from=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492360/Bilibili%20%E8%B7%B3%E8%BD%AC%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/492360/Bilibili%20%E8%B7%B3%E8%BD%AC%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查当前页面是否为Bilibili主页或带有特定参数的页面
    var isBilibiliHomepage = window.location.href === 'https://www.bilibili.com/';
    var isBilibiliTrackedPage = /https:\/\/www\.bilibili\.com\/.*\?spm_id_from=.*/.test(window.location.href);

    // 如果是Bilibili主页或带有特定参数的页面，则创建跳转按钮
    if (isBilibiliHomepage || isBilibiliTrackedPage) {
        // 创建一个按钮
        var jumpButton = document.createElement('button');
        jumpButton.innerText = '当前在线';
        jumpButton.style.position = 'fixed';
        jumpButton.style.top = '60%'; // 放置在页面中间
        jumpButton.style.right = '0px'; // 靠右
        jumpButton.style.transform = 'translateY(-50%)'; // 垂直居中
        jumpButton.style.backgroundColor = 'lightblue'; // 设置背景颜色为淡蓝色
        jumpButton.style.border = 'none'; // 去除边框
        jumpButton.style.padding = '10px 20px'; // 设置内边距
        jumpButton.style.color = '#fff'; // 设置文字颜色为白色
        jumpButton.style.fontWeight = 'bold'; // 设置文字加粗
        jumpButton.style.cursor = 'pointer'; // 鼠标指针样式为手型
        jumpButton.style.zIndex = '9999';

        // 给按钮添加点击事件，点击时跳转到指定页面
        jumpButton.addEventListener('click', function() {
            window.location.href = 'https://online.梦.link';
        });

        // 将按钮添加到页面上
        document.body.appendChild(jumpButton);
    }
})();
