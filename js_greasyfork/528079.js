// ==UserScript==
// @name         Bilibili查看关注时间
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  bilibili查看关注时间，桌面版web端关注页面的**全部关注**可用，不行的话刷新页面试试。
// @author        YuNi_Vsinger, AI
// @match        https://space.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528079/Bilibili%E6%9F%A5%E7%9C%8B%E5%85%B3%E6%B3%A8%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/528079/Bilibili%E6%9F%A5%E7%9C%8B%E5%85%B3%E6%B3%A8%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查是否在关注页面（支持带参数的URL）
    if (!window.location.pathname.includes('/relation/follow')) return;

    // 获取当前用户ID
    const uidMatch = window.location.pathname.match(/\/(\d+)/);
    if (!uidMatch) {
        console.error('无法提取UID');
        return;
    }
    const uid = uidMatch[1];

    // 获取关注数据的函数
    function fetchFollowings(page) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.bilibili.com/x/relation/followings?vmid=${uid}&pn=${page}&ps=50`,
                headers: { 'User-Agent': 'Mozilla/5.0' },
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.code === 0) resolve(data.data.list || []);
                        else reject(`API请求失败: ${data.message}`);
                    } catch (e) {
                        reject('响应解析失败');
                    }
                },
                onerror: function() { reject('网络错误'); }
            });
        });
    }

    // 插入关注时间到卡片
    function insertFollowTime(item, followData) {
        if (item.querySelector('.follow-time')) return; // 防止重复插入
        const followTime = new Date(followData.mtime * 1000).toLocaleString();
        const timeSpan = document.createElement('span');
        timeSpan.className = 'follow-time';
        timeSpan.style.cssText = 'color: #999; font-size: 12px; margin-top: 5px; display: block;';
        timeSpan.textContent = `关注时间: ${followTime}`;
        item.appendChild(timeSpan);
    }

    // 处理卡片
    function processCards(allFollowings) {
        const userItems = document.querySelectorAll('.relation-card-info a');
        userItems.forEach(item => {
            const href = item.getAttribute('href');
            const midMatch = href.match(/space\.bilibili\.com\/(\d+)/);
            if (midMatch) {
                const mid = midMatch[1];
                const followData = allFollowings.find(f => f.mid == mid);
                if (followData) insertFollowTime(item.parentElement, followData);
            }
        });
    }

    // 主函数
    async function main() {
        let page = 1;
        let allFollowings = [];
        while (true) {
            try {
                const followings = await fetchFollowings(page);
                if (followings.length === 0) break;
                allFollowings = allFollowings.concat(followings);
                page++;
            } catch (e) {
                console.error(e);
                break;
            }
        }

        // 初始处理
        processCards(allFollowings);

        // 设置MutationObserver监听动态加载
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length) processCards(allFollowings);
            });
        });

        const container = document.querySelector('.relation-list') || document.querySelector('#app');
        if (container) {
            observer.observe(container, { childList: true, subtree: true });
        } else {
            console.error('未找到可观察的容器');
        }
    }

    main();
})();