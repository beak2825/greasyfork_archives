// ==UserScript==
// @name         Toggle Low Heat Posts
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  切换隐藏/显示热度低于150的帖子，并使按钮更加显眼
// @author       Your Name
// @match        https://bbs.hupu.com/topic-daily-hot
// @license      LGPL
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522081/Toggle%20Low%20Heat%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/522081/Toggle%20Low%20Heat%20Posts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isHidden = false; // 状态变量，初始为未隐藏

    // 创建Toggle按钮并添加到页面右上方
    const toggleButton = document.createElement('button');
    updateButtonText();
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '20px';
    toggleButton.style.right = '20px';
    toggleButton.style.zIndex = '9999';
    toggleButton.style.padding = '10px 20px';
    toggleButton.style.fontSize = '16px';
    toggleButton.style.backgroundColor = '#1890ff'; // 蓝色背景
    toggleButton.style.color = '#ffffff'; // 白色文字
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '5px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
    document.body.appendChild(toggleButton);

    // 添加按钮悬停效果
    toggleButton.addEventListener('mouseenter', function() {
        toggleButton.style.backgroundColor = '#40a9ff'; // 悬停时颜色变深
    });
    toggleButton.addEventListener('mouseleave', function() {
        toggleButton.style.backgroundColor = '#1890ff'; // 恢复原始颜色
    });

    // 更新按钮文本和状态
    function updateButtonText() {
        toggleButton.innerText = isHidden ? 'Show Low Heat Posts' : 'Hide Low Heat Posts';
    }

    // 点击Toggle按钮时执行函数
    toggleButton.addEventListener('click', function() {
        const posts = document.querySelectorAll('.bbs-sl-web-post-body');
        posts.forEach(post => {
            const replyCountText = post.querySelector('.post-datum').innerText.split('/')[0].trim();
            const replyCount = parseInt(replyCountText, 10);
            if (replyCount < 150) {
                post.style.display = isHidden ? '' : 'none'; // 根据状态显示或隐藏
            }
        });
        isHidden = !isHidden; // 切换状态
        updateButtonText(); // 更新按钮文本
    });
})();