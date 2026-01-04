// ==UserScript==
// @name         B站♥更好的拉黑
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  在Bilibili视频卡片和视频页面UP主名字旁添加“黑名单”按钮
// @author       Zawinzala
// @match        https://www.bilibili.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532702/B%E7%AB%99%E2%99%A5%E6%9B%B4%E5%A5%BD%E7%9A%84%E6%8B%89%E9%BB%91.user.js
// @updateURL https://update.greasyfork.org/scripts/532702/B%E7%AB%99%E2%99%A5%E6%9B%B4%E5%A5%BD%E7%9A%84%E6%8B%89%E9%BB%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建提示框元素
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.padding = '10px';
    toast.style.backgroundColor = 'rgba(0,0,0,0.7)';
    toast.style.color = 'white';
    toast.style.borderRadius = '5px';
    toast.style.zIndex = '9999';
    toast.style.display = 'none';
    document.body.appendChild(toast);

    // 显示提示框
    function showToast(message, x, y) {
        toast.textContent = message;
        toast.style.left = `${x}px`;
        toast.style.top = `${y}px`;
        toast.style.display = 'block';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 2000);
    }

    // 拉黑函数
    function blacklistUP(uid, event) {
        event.preventDefault();
        event.stopPropagation();

        const bili_jct = document.cookie.split('; ').find(row => row.startsWith('bili_jct='))
            ?.split('=')[1] || '';

        if (!bili_jct) {
            showToast('无法获取 CSRF 令牌，请确保已登录', event.clientX, event.clientY);
            return;
        }

        const data = new URLSearchParams({
            fid: uid,
            act: '5',
            csrf: bili_jct
        });

        fetch('https://api.bilibili.com/x/relation/modify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Origin': 'https://www.bilibili.com',
                'Referer': 'https://www.bilibili.com/',
                'User-Agent': navigator.userAgent
            },
            body: data,
            credentials: 'include'
        })
        .then(response => response.json())
        .then(result => {
            if (result.code === 0) {
                showToast(`成功拉黑 UID: ${uid}`, event.clientX, event.clientY);
            } else {
                showToast(`拉黑失败: ${result.message || '未知错误'}`, event.clientX, event.clientY);
            }
        })
        .catch(error => {
            showToast(`请求失败: ${error.message}`, event.clientX, event.clientY);
        });
    }

    // 为视频卡片添加按钮
    function addBlacklistButtons() {
        const upLinks = document.querySelectorAll('a.bili-video-card__info--owner:not([data-blacklist-btn])');
        upLinks.forEach(link => {
            link.setAttribute('data-blacklist-btn', 'true');
            const href = link.getAttribute('href');
            const uidMatch = href.match(/\/\/space\.bilibili\.com\/(\d+)/);
            if (!uidMatch) return;
            const uid = uidMatch[1];

            const authorSpan = link.querySelector('span.bili-video-card__info--author');
            if (!authorSpan) return;

            const blacklistBtn = document.createElement('button');
BlacklistBtn.textContent = '拉黑';
blacklistBtn.style.marginLeft = '8px';
blacklistBtn.style.backgroundColor = 'rgba(244, 67, 54, 0.5)';
blacklistBtn.style.color = 'white';
blacklistBtn.style.border = 'none';
blacklistBtn.style.cursor = 'pointer';
blacklistBtn.style.padding = '2px 6px';
blacklistBtn.style.fontSize = '12px';
blacklistBtn.style.verticalAlign = 'middle';

            authorSpan.insertAdjacentElement('afterend', blacklistBtn);

            blacklistBtn.addEventListener('click', function(event) {
                blacklistUP(uid, event);
            });
        });
    }

    // 为视频页面添加按钮
    function addBlacklistButtonOnVideoPage() {
        const upDetails = document.querySelectorAll('div.up-detail-top:not([data-blacklist-btn])');
        upDetails.forEach(div => {
            div.setAttribute('data-blacklist-btn', 'true');
            const upLink = div.querySelector('a.up-name');
            if (!upLink) return;
            const href = upLink.getAttribute('href');
            const uidMatch = href.match(/\/\/space\.bilibili\.com\/(\d+)/);
            if (!uidMatch) return;
            const uid = uidMatch[1];

            const blacklistBtn = document.createElement('button');
            blacklistBtn.textContent = '拉黑';
            blacklistBtn.style.marginLeft = '8px';
            blacklistBtn.style.backgroundColor = 'rgba(244, 67, 54, 0.5)';
            blacklistBtn.style.color = 'white';
            blacklistBtn.style.border = 'none';
            blacklistBtn.style.cursor = 'pointer';
            blacklistBtn.style.padding = '2px 6px';
            blacklistBtn.style.fontSize = '12px';
            blacklistBtn.style.verticalAlign = 'middle';

            const sendMsgLink = div.querySelector('a.send-msg');
            if (sendMsgLink) {
                sendMsgLink.insertAdjacentElement('afterend', blacklistBtn);
            } else {
                div.appendChild(blacklistBtn);
            }

            blacklistBtn.addEventListener('click', function(event) {
                blacklistUP(uid, event);
            });
        });
    }

    // 初始加载时添加按钮
    window.addEventListener('load', () => {
        addBlacklistButtons();
        addBlacklistButtonOnVideoPage();
    });

    // 监听 DOM 变化，处理动态加载的内容
    const observer = new MutationObserver(() => {
        addBlacklistButtons();
        addBlacklistButtonOnVideoPage();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();