// ==UserScript==
// @name         墨刀侧边栏定位元素
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  在网页右上角悬浮一个按钮，点击可滚动到侧边栏元素
// @author       jeffer
// @match        *://modao.cc/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499345/%E5%A2%A8%E5%88%80%E4%BE%A7%E8%BE%B9%E6%A0%8F%E5%AE%9A%E4%BD%8D%E5%85%83%E7%B4%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/499345/%E5%A2%A8%E5%88%80%E4%BE%A7%E8%BE%B9%E6%A0%8F%E5%AE%9A%E4%BD%8D%E5%85%83%E7%B4%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮
    var btn = document.createElement('button');
    btn.textContent = '定位当前页面';

    // 添加内联CSS样式
    btn.style = `
    position: fixed;
    top: 192px;
    right: 10px;
    z-index: 9999;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: #3498db; /* 漂亮的蓝色背景 */
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease; /* 平滑的背景颜色过渡效果 */
`;

    // 为按钮添加悬停效果
    btn.addEventListener('mouseover', function() {
        btn.style.backgroundColor = '#2980b9'; // 鼠标悬停时更深的蓝色
    });

    btn.addEventListener('mouseout', function() {
        btn.style.backgroundColor = '#3498db'; // 鼠标移出时恢复原色
    });

    // 将按钮添加到页面
    document.body.appendChild(btn);

    // 添加点击事件
    btn.addEventListener('click', function() {
        // 指定要滚动到的元素的class
        var targetElement = document.getElementsByClassName("active")[1];

        // 检查元素是否存在
        if (targetElement) {
            // 滚动到元素
            targetElement.scrollIntoViewIfNeeded({ behavior: 'smooth' });
        }
    });
})();