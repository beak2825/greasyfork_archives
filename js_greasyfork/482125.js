// ==UserScript==
// @name         滚动到顶/底
// @namespace    http://tampermonkey.net/
// @version      2.2.2
// @description  在网页右下添加一个的按钮，通过上下滑动可以切换按钮形态，快速回到页面顶部或底部。
// @author       techwb
// @match        *://*/*
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/482125/%E6%BB%9A%E5%8A%A8%E5%88%B0%E9%A1%B6%E5%BA%95.user.js
// @updateURL https://update.greasyfork.org/scripts/482125/%E6%BB%9A%E5%8A%A8%E5%88%B0%E9%A1%B6%E5%BA%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮元素
    var scrollButton = document.createElement('button');
    scrollButton.textContent = '▲';
    scrollButton.id = 'scroll-top-button';

    // 添加按钮样式
    
    scrollButton.style.border = 'none'; // 去掉边框
    scrollButton.style.color = 'black'; // 文字颜色为黑色
    scrollButton.style.fontFamily = 'Arial'; // 字体
    scrollButton.style.fontWeigh = 'normal'; // 设定按钮的内边距
    scrollButton.style.width = '35px'; // 设定按钮宽度
    scrollButton.style.height = '35px'; // 设定按钮高度
    scrollButton.style.fontSize = '13px'; // 设定字体大小
    scrollButton.style.textAlign = 'center'; // 文字水平居中
    scrollButton.style.verticalAlign = 'center'; // 文字垂直居中
    scrollButton.style.textDecoration = 'none'; // 去掉下划线
    scrollButton.style.padding = '0'; // 去掉内边距
    scrollButton.style.margin = '0'; // 去掉外边距
    scrollButton.style.display = 'none'; // 默认不显示
    scrollButton.style.border = '0'; // 去掉边框
    scrollButton.style.borderRadius = '10px'; // 设定圆角
    scrollButton.style.boxShadow = '2px 2px 3px rgba(0, 0, 0, 0.3)'; // 添加阴影效果
    scrollButton.style.position = 'fixed'; // 设定固定定位
    scrollButton.style.bottom = '15%'; // 设定距离底部的距离
    scrollButton.style.cursor = 'none';
    scrollButton.style.right = '15px'; // 设定距离右侧的距离
    scrollButton.style.zIndex = '999999'; // 设定 z-index

    // 添加鼠标悬停效果
    scrollButton.addEventListener('mouseenter', function() {
        scrollButton.style.backgroundColor = 'hsla(221, 41%, 98%, 0.8)'; // 鼠标悬停时的背景颜色
    });

    scrollButton.addEventListener('mouseleave', function() {
        if (scrollButton.textContent === '▲') {
            scrollButton.style.backgroundColor = 'hsla(221, 41%, 98%, 0.8)'; // 鼠标离开时的背景颜色
        } else {
            scrollButton.style.backgroundColor = 'hsla(221, 41%, 98%, 0.8)'; // 鼠标离开时的背景颜色
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
            scrollButton.textContent = '▼';
            scrollButton.style.background = 'hsla(221, 41%, 98%, 0.8)';
        } else { // 向上滚动
            scrollButton.textContent = '▲';
            scrollButton.style.background = 'hsla(221, 41%, 98%, 0.8)';
        }
        lastScrollPosition = currentScrollPosition;
        if (window.pageYOffset > 100) { // 滚动距离超过 100px 时
            scrollButton.style.display = 'block'; // 显示按钮
        } else {
            scrollButton.style.display = 'none'; // 否则隐藏按钮
        }

        // 清除之前的计时器
        clearTimeout(hideButtonTimeout);
        // 设置新的计时器，在 2000 毫秒（2 秒）后隐藏按钮
        hideButtonTimeout = setTimeout(function() {
            scrollButton.style.display = 'none';
        }, 2000);
    });

    // 点击按钮时，回到页面顶部或底部
    scrollButton.addEventListener('click', function() {
        if (scrollButton.textContent === '▲') {
            window.scrollTo(0, 0); // 将页面滚动到顶部
        } else {
            window.scrollTo(0, document.documentElement.scrollHeight - window.innerHeight); // 将页面滚动到底部
        }
    });
})();