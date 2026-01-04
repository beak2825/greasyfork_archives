// ==UserScript==
// @name         滚动到顶部或底部按钮
// @namespace    http://tampermonkey.net/
// @version      2.2.1
// @description  在网页添加一个“回到顶部”的按钮，可以快速回到页面顶部。
// @author       www.techwb.cn
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461172/%E6%BB%9A%E5%8A%A8%E5%88%B0%E9%A1%B6%E9%83%A8%E6%88%96%E5%BA%95%E9%83%A8%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/461172/%E6%BB%9A%E5%8A%A8%E5%88%B0%E9%A1%B6%E9%83%A8%E6%88%96%E5%BA%95%E9%83%A8%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮元素
    var scrollButton = document.createElement('button');
    scrollButton.textContent = '顶';
    scrollButton.id = 'scroll-top-button';

    // 添加按钮样式
    scrollButton.style.background = 'red'; // 将背景颜色改为红色
    scrollButton.style.border = 'none'; // 去掉边框
    scrollButton.style.color = 'white'; // 文字颜色为白色
    scrollButton.style.padding = '10px 10px'; // 设定按钮的内边距
    scrollButton.style.textAlign = 'center'; // 文字居中
    scrollButton.style.textDecoration = 'none'; // 去掉下划线
    scrollButton.style.display = 'none'; // 默认不显示
    scrollButton.style.borderRadius = '10px'; // 设定圆角
    scrollButton.style.boxShadow = '2px 2px 3px rgba(0, 0, 0, 0.3)'; // 添加阴影效果
    scrollButton.style.cursor = 'pointer'; // 设定鼠标样式为手型
    scrollButton.style.position = 'fixed'; // 设定固定定位
    scrollButton.style.bottom = '20%'; // 设定距离底部的距离
    scrollButton.style.right = '20px'; // 设定距离右侧的距离
    scrollButton.style.zIndex = '9999'; // 设定 z-index

    // 添加鼠标悬停效果
    scrollButton.addEventListener('mouseenter', function() {
        scrollButton.style.backgroundColor = '#ff6347'; // 鼠标悬停时的背景颜色
    });

    scrollButton.addEventListener('mouseleave', function() {
        if (scrollButton.textContent === '顶') {
            scrollButton.style.backgroundColor = 'red'; // 鼠标离开时的背景颜色
        } else {
            scrollButton.style.backgroundColor = 'blue'; // 鼠标离开时的背景颜色
        }
    });

    // 添加按钮到页面
    document.body.appendChild(scrollButton);

    // 当用户滚动页面时，如果已经滚动了一定距离，就显示按钮
    var lastScrollPosition = window.pageYOffset; // 上一次滚动的位置
    var hideButtonTimeout;

    window.addEventListener('scroll', function() {
        var currentScrollPosition = window.pageYOffset;
        if (currentScrollPosition > lastScrollPosition) { // 向下滚动
            scrollButton.textContent = '底';
            scrollButton.style.background = 'blue';
        } else { // 向上滚动
            scrollButton.textContent = '顶';
            scrollButton.style.background = 'red';
        }
        lastScrollPosition = currentScrollPosition;
        if (window.pageYOffset > 100) { // 滚动距离超过 100px 时
            scrollButton.style.display = 'block'; // 显示按钮
        } else {
            scrollButton.style.display = 'none'; // 否则隐藏按钮
        }

        // 清除之前的计时器
        clearTimeout(hideButtonTimeout);
        // 设置新的计时器，在 3000 毫秒（3 秒）后隐藏按钮
        hideButtonTimeout = setTimeout(function() {
            scrollButton.style.display = 'none';
        }, 3000);
    });

    // 点击按钮时，回到页面顶部或底部
    scrollButton.addEventListener('click', function() {
        if (scrollButton.textContent === '顶') {
            window.scrollTo(0, 0); // 将页面滚动到顶部
        } else {
            window.scrollTo(0, document.documentElement.scrollHeight - window.innerHeight); // 将页面滚动到底部
        }
    });
})();