// ==UserScript==
// @name         Steam 游戏技术支持信息获取
// @copyright    2025, Yuxiang ZHANG (https://github.com/jamespaulzhang)
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动获取Steam游戏的技术支持邮箱和客服站点并显示在页面上，可关闭显示框
// @author       Yuxiang ZHANG
// @match        https://store.steampowered.com/app/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/541158/Steam%20%E6%B8%B8%E6%88%8F%E6%8A%80%E6%9C%AF%E6%94%AF%E6%8C%81%E4%BF%A1%E6%81%AF%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/541158/Steam%20%E6%B8%B8%E6%88%8F%E6%8A%80%E6%9C%AF%E6%94%AF%E6%8C%81%E4%BF%A1%E6%81%AF%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 从URL中提取appid
    const appIdMatch = window.location.pathname.match(/\/app\/(\d+)/);
    if (!appIdMatch || !appIdMatch[1]) {
        console.error('无法从URL中提取appid');
        return;
    }

    const appId = appIdMatch[1];
    const supportUrl = `https://help.steampowered.com/zh-cn/wizard/HelpWithGameTechnicalIssue?appid=${appId}`;

    // 创建显示结果的元素
    const resultDiv = document.createElement('div');
    resultDiv.style.position = 'fixed';
    resultDiv.style.top = '0';
    resultDiv.style.left = '0';
    resultDiv.style.right = '0';
    resultDiv.style.backgroundColor = '#171a21';
    resultDiv.style.color = '#c6d4df';
    resultDiv.style.padding = '10px';
    resultDiv.style.zIndex = '9999';
    resultDiv.style.borderBottom = '1px solid #5d7a9e';
    resultDiv.style.textAlign = 'center';
    resultDiv.style.fontFamily = 'Arial, sans-serif';
    resultDiv.style.fontSize = '14px';
    resultDiv.style.display = 'flex';
    resultDiv.style.justifyContent = 'center';
    resultDiv.style.alignItems = 'center';
    resultDiv.style.gap = '15px';

    // 添加关闭按钮
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.color = '#c6d4df';
    closeButton.style.fontSize = '16px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.padding = '0 5px';
    closeButton.style.marginLeft = '10px';
    closeButton.title = '关闭';
    closeButton.addEventListener('click', () => {
        resultDiv.style.display = 'none';
    });

    // 悬停效果
    closeButton.addEventListener('mouseover', () => {
        closeButton.style.color = '#ffffff';
    });
    closeButton.addEventListener('mouseout', () => {
        closeButton.style.color = '#c6d4df';
    });

    resultDiv.innerHTML = '正在获取技术支持信息...';
    document.body.appendChild(resultDiv);

    // 发送请求获取技术支持页面
    GM_xmlhttpRequest({
        method: 'GET',
        url: supportUrl,
        onload: function(response) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, 'text/html');

            // 查找客服站点链接
            let supportSite = null;
            const supportSiteRows = doc.querySelectorAll('.help_official_support_row');

            supportSiteRows.forEach(row => {
                const rowText = row.textContent.trim();
                if (rowText.includes('客服站点') || rowText.includes('Support Site')) {
                    const link = row.querySelector('a');
                    if (link) {
                        supportSite = link.href;
                    }
                }
            });

            // 查找电子邮件信息
            let contactInfo = null;
            const emailRows = doc.querySelectorAll('.help_official_support_row');

            emailRows.forEach(row => {
                const rowText = row.textContent.trim();

                if (rowText.includes('电子邮件') || rowText.includes('Email')) {
                    // 尝试获取链接
                    const link = row.querySelector('a');
                    if (link) {
                        contactInfo = link.href;
                    } else {
                        // 尝试从文本中提取URL
                        const urlMatch = rowText.match(/https?:\/\/[^\s]+/);
                        if (urlMatch) {
                            contactInfo = urlMatch[0];
                        } else {
                            // 如果没有URL，尝试提取邮箱地址
                            const emailMatch = rowText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
                            if (emailMatch) {
                                contactInfo = `mailto:${emailMatch[0]}`;
                            } else {
                                // 最后尝试提取"电子邮件:"后面的内容
                                const afterColon = rowText.split(':')[1]?.trim();
                                if (afterColon) {
                                    contactInfo = afterColon;
                                }
                            }
                        }
                    }
                }
            });

            // 构建结果显示
            let resultHTML = '<div style="display: flex; justify-content: center; align-items: center; gap: 20px;">';

            if (supportSite) {
                resultHTML += `<div>客服站点: <a href="${supportSite}" target="_blank" style="color: #67c1f5; text-decoration: none;">${supportSite}</a></div>`;
            }

            if (contactInfo) {
                // 如果contactInfo不是完整的URL，添加mailto:前缀
                if (!contactInfo.startsWith('http') && !contactInfo.startsWith('mailto') && contactInfo.includes('@')) {
                    contactInfo = `mailto:${contactInfo}`;
                }

                const displayText = contactInfo.replace('mailto:', '');
                resultHTML += `<div>技术支持: <a href="${contactInfo}" target="_blank" style="color: #67c1f5; text-decoration: none;">${displayText}</a></div>`;
            }

            resultHTML += '</div>';

            if (supportSite || contactInfo) {
                resultDiv.innerHTML = resultHTML;
                resultDiv.appendChild(closeButton); // 添加关闭按钮
            } else {
                resultDiv.innerHTML = '未找到技术支持信息';
                resultDiv.appendChild(closeButton); // 即使没找到信息也添加关闭按钮
            }
        },
        onerror: function(error) {
            console.error('请求技术支持页面失败:', error);
            resultDiv.innerHTML = '获取技术支持信息失败，请稍后再试';
            resultDiv.appendChild(closeButton); // 出错时也添加关闭按钮
        }
    });
})();