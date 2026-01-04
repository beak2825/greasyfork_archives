// ==UserScript==
// @name         bilibili网页端UP主屏蔽脚本
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  b站网页端屏蔽脚本
// @author       Heavrnl
// @license      MIT
// @match        *://www.bilibili.com/*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/514635/bilibili%E7%BD%91%E9%A1%B5%E7%AB%AFUP%E4%B8%BB%E5%B1%8F%E8%94%BD%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/514635/bilibili%E7%BD%91%E9%A1%B5%E7%AB%AFUP%E4%B8%BB%E5%B1%8F%E8%94%BD%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 从localStorage加载屏蔽列表
    const blockedUPs = JSON.parse(localStorage.getItem('blockedUPs')) || [];

    // 保存屏蔽列表到localStorage
    function saveBlockedUPs() {
        localStorage.setItem('blockedUPs', JSON.stringify(blockedUPs));
    }

    // 隐藏被屏蔽UP主的视频
    function hideBlockedVideos() {
        document.querySelectorAll('.bili-video-card').forEach(card => {
            const upName = card.querySelector('.bili-video-card__info--author')?.textContent.trim();
            if (blockedUPs.includes(upName)) {
                card.style.display = 'none';
            }
        });
    }

    // 悬停时添加屏蔽按钮
    function addBlockButton() {
        document.querySelectorAll('.bili-video-card').forEach(card => {
            if (card.querySelector('.block-up-button')) return;

            // 创建按钮
            const button = document.createElement('div');
            button.className = 'block-up-button';
            button.textContent = '×';
            button.style.position = 'absolute';
            button.style.bottom = '5px';
            button.style.right = '5px';
            button.style.width = '18px';
            button.style.height = '18px';
            button.style.lineHeight = '16px';
            button.style.textAlign = 'center';
            button.style.background = 'rgba(0, 0, 0, 0.6)';
            button.style.color = '#fff';
            button.style.borderRadius = '4px';
            button.style.fontSize = '14px';
            button.style.cursor = 'pointer';
            button.style.zIndex = '10';
            button.style.transition = 'all 0.3s';
            button.style.opacity = '0';
            button.style.userSelect = 'none';
            button.title = '屏蔽该UP主';

            // 悬停效果
            button.addEventListener('mouseenter', () => {
                button.style.background = 'rgba(0, 0, 0, 0.8)';
                button.style.transform = 'scale(1.1)';
            });
            button.addEventListener('mouseleave', () => {
                button.style.background = 'rgba(0, 0, 0, 0.6)';
                button.style.transform = 'scale(1)';
            });

            // 卡片悬停显示按钮
            card.addEventListener('mouseenter', () => {
                button.style.opacity = '1';
            });
            card.addEventListener('mouseleave', () => {
                button.style.opacity = '0';
            });

            // 添加屏蔽功能
            button.addEventListener('click', () => {
                const upName = card.querySelector('.bili-video-card__info--author')?.textContent.trim();
                if (upName && !blockedUPs.includes(upName)) {
                    blockedUPs.push(upName);
                    saveBlockedUPs();
                    hideBlockedVideos();
                }
            });

            // 将按钮添加到卡片中
            card.appendChild(button);
        });
    }

    // 打开使用 | 分隔符的黑名单编辑器提示框
    function openBlacklistEditor() {
        const currentList = blockedUPs.join(' | ');
        const newList = prompt("编辑黑名单列表，用 '|' 分隔每个UP主名称：", currentList);
        if (newList !== null) {
            // 用新条目更新黑名单
            blockedUPs.length = 0;
            blockedUPs.push(...newList.split('|').map(name => name.trim()).filter(name => name));
            saveBlockedUPs();
            hideBlockedVideos();
        }
    }

    // 注册Tampermonkey菜单命令以编辑黑名单
    GM_registerMenuCommand("编辑黑名单", openBlacklistEditor);

    // 初始化脚本
    function init() {
        hideBlockedVideos();
        addBlockButton();
        new MutationObserver(() => {
            hideBlockedVideos();
            addBlockButton();
        }).observe(document.body, { childList: true, subtree: true });
    }

    init();
})();