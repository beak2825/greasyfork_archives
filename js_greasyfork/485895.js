// ==UserScript==
// @name         Copy Magnet Links
// @namespace    http://your.namespace.com
// @version      0.8
// @description  Copy all unique magnet links on a webpage with a button（一键复制所有磁力链接）
// @author       0x0413
// @match        https://www.javbus.com/*
// @grant        none
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/485895/Copy%20Magnet%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/485895/Copy%20Magnet%20Links.meta.js
// ==/UserScript==





(function() {
    'use strict';

    // 配置选项
    const config = {
        buttonPosition: {
            top: '80px',
            left: '10px'
        },
        buttonStyle: {
            backgroundColor: '#1a1a1a',
            color: '#ffffff',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
        }
    };

    // 定义磁力链接的正则表达式
    const magnetRegex = /magnet:?\?xt=urn:btih:[0-9a-f]{40}/ig;

    // 创建通知元素
    function createNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '12px 24px';
        notification.style.borderRadius = '4px';
        notification.style.zIndex = '10000';
        notification.style.animation = 'fadeInOut 2.5s ease';
        notification.style.backgroundColor = type === 'success' ? '#4caf50' : '#f44336';
        notification.style.color = '#ffffff';
        notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateY(-20px); }
                15% { opacity: 1; transform: translateY(0); }
                85% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-20px); }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2500);
    }

    // 添加复制按钮
    function addCopyButton() {
        const copyButton = document.createElement('button');
        copyButton.textContent = '复制磁力链接';
        copyButton.style.position = 'fixed';
        copyButton.style.top = config.buttonPosition.top;
        copyButton.style.left = config.buttonPosition.left;
        copyButton.style.zIndex = '9999';

        // 应用按钮样式
        Object.assign(copyButton.style, config.buttonStyle);

        // 添加悬停效果
        copyButton.addEventListener('mouseover', () => {
            copyButton.style.backgroundColor = '#333333';
            copyButton.style.transform = 'translateY(-1px)';
        });

        copyButton.addEventListener('mouseout', () => {
            copyButton.style.backgroundColor = config.buttonStyle.backgroundColor;
            copyButton.style.transform = 'translateY(0)';
        });

        copyButton.addEventListener('click', copyAllMagnetLinks);
        document.body.appendChild(copyButton);
   return copyButton;
    }

    // 获取所有分页URL
    function getAllPageUrls() {
        const pageLinks = document.querySelectorAll('.pg a');
        const urls = Array.from(pageLinks)
            .filter(link => link.textContent.trim() !== '下一頁')
            .map(link => link.href);
        return [...new Set(urls)]; // 去除重复的URL
    }

    // 从单个页面获取磁力链接
    async function getMagnetLinksFromPage(url) {
        const magnetLinksSet = new Set();

        try {
            const response = await fetch(url);
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');

            const elements = doc.querySelectorAll('a[href^="magnet:"], div, span, p');
            elements.forEach(element => {
                const text = element.textContent || '';
                const matches = text.match(magnetRegex);
                if (matches) {
                    matches.forEach(match => magnetLinksSet.add(match));
                }

                if (element.href && element.href.match(magnetRegex)) {
                    magnetLinksSet.add(element.href);
                }
            });

            return Array.from(magnetLinksSet);
        } catch (error) {
            console.error(`获取页面 ${url} 失败:`, error);
            return [];
        }
    }

    // 复制所有磁力链接
    async function copyAllMagnetLinks() {
        const button = this;
        button.disabled = true;
        button.style.opacity = '0.7';
        button.textContent = '正在复制...';

        try {
            const urls = getAllPageUrls();
            const currentUrl = window.location.href;
            if (!urls.includes(currentUrl)) {
                urls.unshift(currentUrl);
            }

            const allMagnetLinks = new Set();
            let processedPages = 0;

            // 使用 Promise.all 并发处理所有页面
            const updateProgress = () => {
                processedPages++;
                button.textContent = `正在复制... (${processedPages}/${urls.length}页)`;
            };

            const pageResults = await Promise.all(
                urls.map(async url => {
                    const links = await getMagnetLinksFromPage(url);
                    updateProgress();
                    return links;
                })
            );

            // 合并所有页面的结果
            pageResults.flat().forEach(link => allMagnetLinks.add(link));

            if (allMagnetLinks.size > 0) {
                const allLinks = Array.from(allMagnetLinks).join('\n');
                await navigator.clipboard.writeText(allLinks);
                createNotification(`成功复制 ${allMagnetLinks.size} 个磁力链接！`);
            } else {
                createNotification('未找到磁力链接', 'error');
            }
        } catch (error) {
            console.error('复制失败:', error);
            createNotification('复制失败，请重试', 'error');
        } finally {
            // 恢复按钮状态
            setTimeout(() => {
                button.disabled = false;
                button.style.opacity = '1';
                button.textContent = '复制磁力链接';
            }, 1000);
        }
    }

    // 初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addCopyButton);
    } else {
        addCopyButton();
    }
})();