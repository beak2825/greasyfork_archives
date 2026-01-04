// ==UserScript==
// @name         网易云隐藏评论
// @namespace    http://tampermonkey.net/
// @version      2025-07-01
// @description  用于默认折叠网易云音乐详情页内的评论区
// @author       hydra
// @match        *://music.163.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541327/%E7%BD%91%E6%98%93%E4%BA%91%E9%9A%90%E8%97%8F%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/541327/%E7%BD%91%E6%98%93%E4%BA%91%E9%9A%90%E8%97%8F%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 隐藏评论区
        const commentBox = document.getElementById('comment-box');
        if (commentBox) {
            commentBox.style.display = 'none';
        }

        // 隐藏指定的div
        const multiDivs = document.querySelectorAll('div.m-multi');
        multiDivs.forEach(div => {
            div.style.display = 'none';
        });

        // 在指定div中添加自定义按钮，样式与现有按钮一致
        const targetDiv = document.querySelector('div.out.s-fc3.to-app-listen');
        if (targetDiv) {
            // 查找现有按钮以获取样式
            const existingBtn = targetDiv.querySelector('.btn');
            const customBtn = document.createElement('div');
            // 复制现有按钮的类和样式
            if (existingBtn) {
                customBtn.className = existingBtn.className;
                customBtn.style.cssText = existingBtn.style.cssText;
            } else {
                // 如果找不到现有按钮，使用默认样式
                customBtn.className = 'btn';
                customBtn.style.marginLeft = '10px';
                customBtn.style.padding = '8px 16px';
                customBtn.style.borderRadius = '4px';
                customBtn.style.cursor = 'pointer';
                customBtn.style.display = 'inline-block';
                customBtn.style.fontFamily = 'Arial, sans-serif';
                customBtn.style.fontSize = '14px';
            }
            // 设置初始样式
            customBtn.style.backgroundColor = '#2196F3';
            customBtn.style.color = 'white';
            customBtn.style.transition = 'background-color 0.3s';
            customBtn.textContent = '显示评论区';

            // 添加点击事件
            customBtn.addEventListener('click', function() {
                if (commentBox) {
                    if (commentBox.style.display === 'none') {
                        commentBox.style.display = 'block';
                        customBtn.textContent = '隐藏评论区';
                        customBtn.style.backgroundColor = '#f44336';
                    } else {
                        commentBox.style.display = 'none';
                        customBtn.textContent = '显示评论区';
                        customBtn.style.backgroundColor = '#2196F3';
                    }
                }
            });

            // 将按钮添加到目标div
            targetDiv.appendChild(customBtn);
        }
    });
})();