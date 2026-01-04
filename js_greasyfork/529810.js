// ==UserScript==
// @name         B站播放页显示关注时间
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  安全集成关注时间显示到视频工具栏
// @author       YourName
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/play/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      api.bilibili.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529810/B%E7%AB%99%E6%92%AD%E6%94%BE%E9%A1%B5%E6%98%BE%E7%A4%BA%E5%85%B3%E6%B3%A8%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/529810/B%E7%AB%99%E6%92%AD%E6%94%BE%E9%A1%B5%E6%98%BE%E7%A4%BA%E5%85%B3%E6%B3%A8%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

// 与Ai共同创作，主要功能就是在B站播放页面三连菜单显示Up主关注时间，其实也没啥用，目前Bug是如果联合投稿会无法显示，在播放页面如果直接点进一个新的视频会无法刷新关注信息。

(function() {
    'use strict';

    // 安全样式注入
    GM_addStyle(`
        .tt-follow-time-wrap {
            order: 3; /* 插入在点赞/投币之间 */
            margin-right: 16px !important;
        }
        .tt-follow-time {
            display: flex;
            align-items: center;
            height: 32px;
            color: var(--text1);
            opacity: 0.9;
            transition: opacity 0.2s;
        }
        .tt-follow-time:hover {
            opacity: 1;
        }
        .tt-follow-time svg {
            width: 24px;
            height: 24px;
            margin-right: 8px;
            flex-shrink: 0;
        }
        .tt-follow-time span {
            font-size: 16px;
            white-space: nowrap;
        }
    `);

    // 安全DOM操作方法
    function safeInject() {
        try {
            // 查找目标工具栏
            const toolbar = document.querySelector('.video-toolbar-left-main');
            if (!toolbar || toolbar.querySelector('.tt-follow-time-wrap')) return;

            // 创建容器
            const container = document.createElement('div');
            container.className = 'toolbar-left-item-wrap tt-follow-time-wrap';

            // 填充内容
            container.innerHTML = `
                <div class="tt-follow-time">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
                    </svg>
                    <span>加载关注时间...</span>
                </div>
            `;

            // 安全插入位置（在投硬币按钮之后）
            const coinBtn = toolbar.querySelector('.video-toolbar-left-item:has(.video-coin-icon)');
            if (coinBtn && coinBtn.parentElement) {
                coinBtn.parentElement.after(container);
            } else {
                toolbar.appendChild(container);
            }
        } catch (e) {
            console.warn('[关注时间插件] DOM操作异常:', e);
        }
    }

    // 安全获取UID
    function getUid() {
        try {
            const link = document.querySelector('a.up-name[href*="space.bilibili.com"]');
            return link?.href.match(/\/\/space\.bilibili\.com\/(\d+)/)?.[1];
        } catch (e) {
            console.warn('[关注时间插件] UID获取失败:', e);
            return null;
        }
    }

    // 安全数据请求
    function fetchData(uid) {
        if (!uid) return;

        try {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.bilibili.com/x/space/acc/relation?mid=${uid}`,
                headers: {
                    'Referer': location.href,
                    'Origin': 'https://www.bilibili.com'
                },
                timeout: 5000,
                onload: function(res) {
                    try {
                        const data = JSON.parse(res.responseText);
                        if (data.code === 0 && data.data?.relation?.mtime) {
                            updateTimeDisplay(data.data.relation.mtime);
                        }
                    } catch (e) {
                        console.warn('[关注时间插件] 数据解析失败:', e);
                    }
                },
                onerror: function(err) {
                    console.warn('[关注时间插件] 请求失败:', err);
                }
            });
        } catch (e) {
            console.warn('[关注时间插件] 请求异常:', e);
        }
    }

    // 安全更新显示
    function updateTimeDisplay(timestamp) {
        try {
            const display = document.querySelector('.tt-follow-time span');
            if (display) {
                const date = new Date(timestamp * 1000);
                display.textContent = `关注于 ${
    date.getFullYear()
}-${(date.getMonth()+1).toString().padStart(2,'0')
}-${date.getDate().toString().padStart(2,'0')
} ${date.getHours().toString().padStart(2,'0')
}:${date.getMinutes().toString().padStart(2,'0')
}:${date.getSeconds().toString().padStart(2,'0')}`;
            }
        } catch (e) {
            console.warn('[关注时间插件] 时间更新失败:', e);
        }
    }

    // 安全监听逻辑
    let currentUid = null;
    const safeObserver = new MutationObserver(() => {
        try {
            safeInject();
            const newUid = getUid();
            if (newUid && newUid !== currentUid) {
                currentUid = newUid;
                fetchData(newUid);
            }
        } catch (e) {
            console.warn('[关注时间插件] 监听异常:', e);
        }
    });

    // 安全启动
    setTimeout(() => {
        try {
            safeObserver.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: false
            });
            safeInject();
            fetchData(getUid());
        } catch (e) {
            console.warn('[关注时间插件] 初始化失败:', e);
        }
    }, 3000);
})();