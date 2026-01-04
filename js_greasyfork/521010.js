// ==UserScript==
// @name         智慧树网课滚动到当前集
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  在页面右上角添加一个固定按钮，点击后跳转到激活的文件项，加载时自动跳转一次
// @author       You
// @match        https://hike.zhihuishu.com/aidedteaching/sourceLearning/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521010/%E6%99%BA%E6%85%A7%E6%A0%91%E7%BD%91%E8%AF%BE%E6%BB%9A%E5%8A%A8%E5%88%B0%E5%BD%93%E5%89%8D%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/521010/%E6%99%BA%E6%85%A7%E6%A0%91%E7%BD%91%E8%AF%BE%E6%BB%9A%E5%8A%A8%E5%88%B0%E5%BD%93%E5%89%8D%E9%9B%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮并设置样式
    const button = document.createElement('button');
    button.innerText = '滚动到当前';
    button.style.padding = '10px 20px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.zIndex = '1000';
    button.style.position = 'fixed';
    button.style.top='10px';

    // 获取div.course-name元素
    const courseNameDiv = document.querySelector('div.course-name');

    // 如果找到了course-name元素，将按钮添加到该元素的后面
    if (courseNameDiv) {
        courseNameDiv.appendChild(button);
    } else {
        // 如果没有找到course-name元素，则添加到body
        document.body.appendChild(button);
    }

    // 获取激活的文件项并跳转
    function scrollToActiveElement() {
        const activeElement = document.querySelector('.file-item.active');
        if (activeElement) {
            activeElement.scrollIntoView({ behavior: 'instant', block: 'center' });
        } else {
            alert('未找到激活的文件项！');
        }
    }

    // 点击按钮时跳转
    button.addEventListener('click', scrollToActiveElement);

    // 页面加载时自动跳转
    window.addEventListener('load', function() {
        setTimeout(scrollToActiveElement, 500); // 加载后500ms自动跳转
    });
})();
