// ==UserScript==
// @name         清除迅雷网盘、UC网盘、夸克网盘多余的推广文字
// @namespace    https://axutongxue.com/
// @version      3.0
// @description  自动清理迅雷网盘、UC网盘和夸克网盘复制链接中的多余内容，获取纯净的分享链接
// @author       阿虚同学
// @match        https://pan.xunlei.com/*
// @match        https://drive.uc.cn/*
// @match        https://pan.quark.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537833/%E6%B8%85%E9%99%A4%E8%BF%85%E9%9B%B7%E7%BD%91%E7%9B%98%E3%80%81UC%E7%BD%91%E7%9B%98%E3%80%81%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98%E5%A4%9A%E4%BD%99%E7%9A%84%E6%8E%A8%E5%B9%BF%E6%96%87%E5%AD%97.user.js
// @updateURL https://update.greasyfork.org/scripts/537833/%E6%B8%85%E9%99%A4%E8%BF%85%E9%9B%B7%E7%BD%91%E7%9B%98%E3%80%81UC%E7%BD%91%E7%9B%98%E3%80%81%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98%E5%A4%9A%E4%BD%99%E7%9A%84%E6%8E%A8%E5%B9%BF%E6%96%87%E5%AD%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 监听复制事件
    document.addEventListener('copy', function(e) {
        // 获取复制的文本
        let clipboardText = '';

        // 尝试从选中的文本获取
        if (window.getSelection) {
            clipboardText = window.getSelection().toString();
        } else if (document.selection && document.selection.createRange) {
            clipboardText = document.selection.createRange().text;
        }

        // 如果没有选中文本，尝试从剪贴板数据获取
        if (!clipboardText && e.clipboardData) {
            clipboardText = e.clipboardData.getData('text/plain');
        }

        let cleanLink = '';
        let linkType = '';

        // 检查是否包含迅雷网盘链接
        if (clipboardText && clipboardText.includes('pan.xunlei.com')) {
            const linkRegex = /(https:\/\/pan\.xunlei\.com\/s\/[^?\s]+\?pwd=[^#\s]+#?)/;
            const match = clipboardText.match(linkRegex);

            if (match) {
                cleanLink = match[1];
                linkType = '迅雷网盘';
            }
        }
        // 检查是否包含UC网盘链接
        else if (clipboardText && clipboardText.includes('drive.uc.cn')) {
            const linkRegex = /(https:\/\/drive\.uc\.cn\/s\/[^?\s]+(?:\?[^\s]*)?)/;
            const match = clipboardText.match(linkRegex);

            if (match) {
                cleanLink = match[1];
                linkType = 'UC网盘';
            }
        }
        // 检查是否包含夸克网盘链接
        else if (clipboardText && clipboardText.includes('pan.quark.cn')) {
            const linkRegex = /(https:\/\/pan\.quark\.cn\/s\/[^\s]+)/;
            const match = clipboardText.match(linkRegex);

            if (match) {
                cleanLink = match[1];
                linkType = '夸克网盘';
            }
        }

        // 如果找到了链接，进行清理
        if (cleanLink) {
            // 阻止默认复制行为
            e.preventDefault();

            // 将清理后的链接写入剪贴板
            if (e.clipboardData) {
                e.clipboardData.setData('text/plain', cleanLink);
            } else {
                // 兼容旧版浏览器
                navigator.clipboard.writeText(cleanLink).catch(err => {
                    console.error('无法写入剪贴板:', err);
                });
            }

            // 显示提示信息
            console.log(`${linkType}链接已清理:`, cleanLink);
            showNotification(`${linkType}链接已清理并复制到剪贴板`);
        }
    });

    // 显示通知函数
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 9999;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            font-family: Arial, sans-serif;
        `;

        document.body.appendChild(notification);

        // 3秒后自动移除通知
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
})();
