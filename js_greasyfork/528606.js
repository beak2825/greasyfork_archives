// ==UserScript==
// @name         库街区一键点赞
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  自动点击页面所有点赞按钮，支持动态加载内容
// @author       小维151, ChatGPT
// @match        *://www.kurobbs.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528606/%E5%BA%93%E8%A1%97%E5%8C%BA%E4%B8%80%E9%94%AE%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/528606/%E5%BA%93%E8%A1%97%E5%8C%BA%E4%B8%80%E9%94%AE%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建悬浮按钮
    const btn = document.createElement('button');
    Object.assign(btn.style, {
        position: 'fixed',
        top: '80px',
        left: '20px',
        zIndex: 99999,
        padding: '12px 24px',
        background: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '25px',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        fontSize: '14px',
        transition: 'all 0.3s'
    });

    const MAX_LIKES = 50; // 限制一次最多点赞 50 个
    const LIKE_DELAY = 100; // 点赞速度（毫秒）
    let observer = null; // 存储 MutationObserver

    // 获取未点赞的 svg 元素
    function getLikeSvgs() {
        return Array.from(document.querySelectorAll('svg.mr-2, svg.like')).filter(svg => {
            const path = svg.querySelector('path');
            return path && path.getAttribute('fill') === '#AEB6C2'; // 确保是未点赞状态
        });
    }

    // 更新按钮状态
    function updateButton() {
        const svgs = getLikeSvgs();
        if (svgs.length > MAX_LIKES) {
            btn.textContent = `维の一键点赞 （发现${svgs.length}个，单次最多点赞${MAX_LIKES}个！）`;
        } else {
            btn.textContent = `维の一键点赞 （当前页面发现${svgs.length}个）`;
        }
        return svgs;
    }

    // 页面加载完成时点击“最新发布”
    function clickLatestPost() {
        setTimeout(() => {
            const latestPost = Array.from(document.querySelectorAll("li.item.text-18.pointer"))
                .find(li => li.textContent.includes("最新发布"));
            
            if (latestPost) {
                latestPost.dispatchEvent(new Event('click', { bubbles: true }));
            }
        }, 300);
    }

    // 监听 menu-item active 被点击时触发 clickLatestPost
    function observeMenuClicks() {
        document.body.addEventListener('click', (event) => {
            if (event.target.closest('.menu-item.active')) {
                clickLatestPost();
            }
        });
    }

    // 初始化
    function init() {
        document.body.appendChild(btn);
        updateButton();

        // 监听DOM变化，动态更新点赞数量
        let lastUpdate = 0;
        function throttledUpdateButton() {
            const now = Date.now();
            if (now - lastUpdate > 500) { // 至少间隔 500ms 才更新
                lastUpdate = now;
                updateButton();
            }
        }
        observer = new MutationObserver(() => throttledUpdateButton());

        // observer = new MutationObserver(() => updateButton());
        observer.observe(document.body, { subtree: true, childList: true });

        // 等待页面加载完成后尝试点击“最新发布”
        window.addEventListener('load', clickLatestPost);

        // 监听 .menu-item.active 点击事件
        observeMenuClicks();
    }

    // 点赞处理
    async function autoLike() {
        let svgs = getLikeSvgs(); // 直接获取点赞元素
        if (!svgs.length) {
            GM_notification({
                title: '操作完成',
                text: '没有发现可点赞的内容',
                timeout: 2000
            });
            return;
        }

        svgs = svgs.slice(0, MAX_LIKES); // 限制最多点赞 50 个

        // **暂停 MutationObserver**
        if (observer) observer.disconnect();

        btn.style.background = '#6c757d';
        btn.textContent = `点赞中... (0/${svgs.length})`;
        await new Promise(r => setTimeout(r, 300)); // 确保 UI 先更新

        for (let i = 0; i < svgs.length; i++) {
            svgs[i].dispatchEvent(new Event('click', { bubbles: true })); // 触发事件
            btn.textContent = `点赞中... (${i + 1}/${svgs.length})`; // 这里要用 i+1
            await new Promise(r => setTimeout(r, 100)); // 强制 UI 更新
            await new Promise(r => setTimeout(r, LIKE_DELAY)); // 避免点击太快
        }

        btn.style.background = '#28a745';
        btn.textContent = '已完成! 2秒后刷新';

        setTimeout(() => {
            btn.style.background = '#007bff';
            updateButton(); // 重新获取可点赞的数量

            // **恢复 MutationObserver**
            let lastUpdate = 0;
            function throttledUpdateButton() {
                const now = Date.now();
                if (now - lastUpdate > 500) { // 至少间隔 500ms 才更新
                    lastUpdate = now;
                    updateButton();
                }
            }
            observer = new MutationObserver(() => throttledUpdateButton());
            observer.observe(document.body, { subtree: true, childList: true });
        }, 2000);
    }

    // 事件绑定
    btn.addEventListener('click', autoLike);
    init();
})();
