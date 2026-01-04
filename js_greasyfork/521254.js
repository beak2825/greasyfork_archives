// ==UserScript==
// @name         自动模糊图片
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  打开网站帖子时图片自动模糊，点击后显示正常
// @author       你的名字
// @match        *://yaohuo.me/*
// @match        *://*.yaohuo.me/*
// @icon         https://yaohuo.me/css/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521254/%E8%87%AA%E5%8A%A8%E6%A8%A1%E7%B3%8A%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/521254/%E8%87%AA%E5%8A%A8%E6%A8%A1%E7%B3%8A%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 检查页面中的图片
    function blurImages() {
        const images = document.querySelectorAll('img'); // 获取所有图片
        images.forEach(img => {
            img.style.filter = 'blur(10px)'; // 设置模糊效果
            img.style.transition = 'filter 0.3s ease'; // 添加过渡效果

            // 添加点击事件移除模糊
            img.addEventListener('click', function () {
                img.style.filter = 'none'; // 取消模糊
            });
        });
    }

    // 初始执行一次
    blurImages();

    // 监听动态加载内容
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                blurImages();
            }
        });
    });

    // 监听整个页面的变化
    observer.observe(document.body, { childList: true, subtree: true });
})();
