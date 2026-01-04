// ==UserScript==
// @name         自动复制网页标题和链接为Markdown格式
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  按Ctrl+Shift+X快捷键，自动将当前网页的标题和URL复制为Markdown格式（[标题](URL)），并在右上角显示临时消息提示，2秒后自动消失。适合快速分享链接或记录笔记。
// @author       李丰华
// @match        *://*/*
// @grant        GM_setClipboard
// @license      MIT
// @homepageURL  https://gist.github.com/your-username/your-script-id
// @supportURL   https://gist.github.com/your-username/your-script-id/issues
// @downloadURL https://update.greasyfork.org/scripts/528187/%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98%E5%92%8C%E9%93%BE%E6%8E%A5%E4%B8%BAMarkdown%E6%A0%BC%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/528187/%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98%E5%92%8C%E9%93%BE%E6%8E%A5%E4%B8%BAMarkdown%E6%A0%BC%E5%BC%8F.meta.js
// ==/UserScript==

/* 
 * 功能说明：
 *   - 快捷键：Ctrl + Shift + X
 *   - 作用：将当前网页的标题和URL生成Markdown格式（如：[Google](https://www.google.com)）并复制到剪贴板
 *   - 提示：右上角显示“Markdown链接已复制”，2秒后自动消失
 *   - 适用场景：快速记录网页链接、分享到Markdown文档或笔记软件
 * 
 * 操作步骤：
 *   1. 安装Tampermonkey扩展
 *   2. 创建新脚本，将此代码粘贴并保存
 *   3. 打开任意网页，按Ctrl+Shift+X触发
 *   4. 粘贴到任意文本编辑器查看结果
 * 
 * 自定义选项：
 *   - 修改快捷键：更改下方 'KeyX' 为其他键码（如 'KeyC'）
 *   - 修改提示时间：调整 showNotification 中的 duration 值（单位：毫秒）
 *   - 修改提示位置：调整 CSS 中的 top 和 right 值
 */

(function() {
    'use strict';

    // 创建消息提示的样式
    const style = document.createElement('style');
    style.textContent = `
        .copy-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            background: #333;
            color: white;
            border-radius: 5px;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
            font-family: Arial, sans-serif;
            font-size: 14px;
        }
    `;
    document.head.appendChild(style);

    // 显示消息提示的函数
    function showNotification(message, duration = 2000) {
        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        // 淡入效果
        setTimeout(() => {
            notification.style.opacity = '0.9';
        }, 10);

        // 几秒后淡出并移除
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300); // 等淡出动画完成再移除
        }, duration);
    }

    // 监听键盘事件
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyX') {
            e.preventDefault(); // 防止触发浏览器默认行为

            // 获取标题和链接，添加容错处理
            const title = document.title?.trim() || '无标题';
            const url = window.location.href || '';
            
            // 生成Markdown格式链接
            const markdownLink = `[${title}](${url})`;
            
            // 复制到剪贴板并显示提示
            GM_setClipboard(markdownLink);
            showNotification('Markdown链接已复制');
        }
    });
})();