// ==UserScript==
// @name          网页分享小按钮 ／ Share Button
// @namespace     http://tampermonkey.net/
// @version       1.3
// @description   在页面右上方添加“分享”按钮，将页面标题和URL复制到剪贴板，并支持下载Internet快捷方式(.url)；Adds a share button to copy page title and URL to clipboard and download .url shortcut
// @author        Grok & 南竹
// @match         *://*/*
// @grant         none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/539967/%E7%BD%91%E9%A1%B5%E5%88%86%E4%BA%AB%E5%B0%8F%E6%8C%89%E9%92%AE%20%EF%BC%8F%20Share%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/539967/%E7%BD%91%E9%A1%B5%E5%88%86%E4%BA%AB%E5%B0%8F%E6%8C%89%E9%92%AE%20%EF%BC%8F%20Share%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮
    const button = document.createElement('button');
    button.style.position = 'fixed';
    button.style.top = '50px'; // 将按钮向下移动，从10px改为50px
    button.style.right = '10px';
    button.style.padding = '4px 8px'; // 减小内边距以减小按钮大小，从6px 10px改为4px 8px
    button.style.backgroundColor = '#e6f3ff';
    button.style.color = '#333';
    button.style.border = '1px solid #99ccff';
    button.style.borderRadius = '4px';
    button.style.fontFamily = '"SimHei", sans-serif';
    button.style.fontSize = '13px'; // 稍微减小字体，从14px改为13px，以适应更小的按钮
    button.style.fontWeight = 'bold';
    button.style.cursor = 'pointer';
    button.style.zIndex = '9999';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.opacity = '0.6'; // 修正透明度值

    // 添加分享文字
    const shareText = document.createElement('span');
    shareText.textContent = '分享';
    shareText.style.padding = '0 5px'; // 相应调整内边距
    shareText.style.cursor = 'pointer';
    button.appendChild(shareText);

    // 添加分隔线
    const separator = document.createElement('span');
    separator.style.width = '1px';
    separator.style.height = '10px'; // 相应减小高度
    separator.style.backgroundColor = '#99ccff';
    separator.style.margin = '0 3px'; // 相应调整边距
    button.appendChild(separator);

    // 添加下载图标（下箭头）
    const downloadIcon = document.createElement('span');
    downloadIcon.innerHTML = '↓';
    downloadIcon.style.padding = '0 5px'; // 相应调整内边距
    downloadIcon.style.backgroundColor = '#d9e6ff';
    downloadIcon.style.borderRadius = '2px';
    downloadIcon.style.cursor = 'pointer';
    downloadIcon.style.fontSize = '13px'; // 相应减小字体
    downloadIcon.style.fontWeight = 'bold';
    button.appendChild(downloadIcon);

    // 鼠标悬停效果
    button.addEventListener('mouseover', () => {
        button.style.backgroundColor = '#d9e6ff';
        button.style.opacity = '1.0';
        downloadIcon.style.backgroundColor = '#cce0ff';
    });
    button.addEventListener('mouseout', () => {
        button.style.backgroundColor = '#e6f3ff';
        button.style.opacity = '0.6';
        downloadIcon.style.backgroundColor = '#d9e6ff';
    });

    // 获取页面标题或帖子名
    function getPageTitle() {
        let title = document.title || '未命名页面';
        const selectors = [
            'h1',
            '.post-title',
            '.article-title',
            '.topic-title',
            '[itemprop="name"]',
            '.entry-title',
        ];
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                title = element.textContent.trim();
                break;
            }
        }
        // 清理标题中的多余空格、换行和非法文件名字符
        title = title.replace(/\s+/g, ' ').trim();
        return title.replace(/[<>:"/\\|?*]/g, '').replace(/\.url$/i, '');
    }

    // 复制到剪贴板
    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            alert('已复制到剪贴板！');
        } catch (err) {
            console.error('复制失败:', err);
            alert('复制失败，请手动复制！');
        }
    }

    // 下载 .url 快捷方式
    function downloadUrlShortcut(title, url) {
        const urlContent = `[InternetShortcut]\nURL=${url}\n`;
        const blob = new Blob([urlContent], { type: 'application/x-ms-shortcut' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${title}.url`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }

    // 按钮点击事件
    button.addEventListener('click', (event) => {
        const title = getPageTitle();
        const url = window.location.href;

        // 检查点击区域
        if (event.target === downloadIcon || event.target.closest('span') === downloadIcon) {
            // 下载 .url 文件
            downloadUrlShortcut(title, url);
        } else {
            // 复制到剪贴板
            const text = `网页名称：${title}\n链接：${url}`;
            copyToClipboard(text);
        }
    });

    // 将按钮添加到页面
    document.body.appendChild(button);
})();