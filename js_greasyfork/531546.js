// ==UserScript==
// @name         吾爱贴子去图片
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在吾爱破解论坛贴子上方添加“关闭图片”按钮，点击后隐藏贴子里的图片
// @author       StartMenu
// @match        *://*.52pojie.cn/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531546/%E5%90%BE%E7%88%B1%E8%B4%B4%E5%AD%90%E5%8E%BB%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/531546/%E5%90%BE%E7%88%B1%E8%B4%B4%E5%AD%90%E5%8E%BB%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', () => {
        // 确保 jQuery 已加载
        if (typeof jQuery === 'undefined') {
            console.error('jQuery 未正确加载');
            return;
        }

        // 使用 jQuery.noConflict() 避免与其他库冲突
        const $ = jQuery.noConflict();

        // 找到目标元素
        const postReplyElement = document.getElementById('pgt');
        if (!postReplyElement) {
            console.error('未找到 id="pgt" 的元素');
            return;
        }

        // 创建 "关闭图片" 按钮
        const closeButton = document.createElement('a');
        closeButton.href = 'javascript:void(0)';
        closeButton.textContent = '关闭图片';
        closeButton.id = 'close_images_button'; // 为按钮设置唯一 ID

        // 将按钮插入到目标元素后面
        postReplyElement.appendChild(closeButton);

        // 为按钮添加醒目的样式，并确保与其他按钮对齐
        GM_addStyle(`
            #close_images_button {
                display: inline-block; /* 使按钮与其他元素在同一行 */
                vertical-align: middle; /* 垂直居中对齐 */
                background-color: #ff4d4d; /* 红色背景 */
                color: white; /* 白色文字 */
                padding: 6px 12px; /* 内边距 */
                border-radius: 4px; /* 圆角 */
                cursor: pointer; /* 鼠标悬停时显示指针 */
                font-weight: bold; /* 加粗文字 */
                text-decoration: none; /* 去掉下划线 */
                margin-left: 10px; /* 左边距 */
                transition: background-color 0.3s; /* 平滑过渡效果 */
                height: 24px; /* 设置高度，使其与其他按钮一致 */
                line-height: 24px; /* 设置行高，确保文字垂直居中 */
            }
            #close_images_button:hover {
                background-color: #ff0000; /* 悬停时变为深红色 */
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* 添加阴影 */
            }
        `);

        // 点击按钮时隐藏图片
        closeButton.addEventListener('click', () => {
            // 隐藏 id 以 aimg_ 开头的图片
            $('img[id^="aimg_"]').prev().remove();
            $('img[id^="aimg_"]').remove();
        });
    });
})();