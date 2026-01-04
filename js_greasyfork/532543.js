// ==UserScript==
// @name         bilibili播放器滚轮调播放速
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  悬浮调速区域即可用滚轮调整速度，无视觉干扰
// @author       dashsag
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532543/bilibili%E6%92%AD%E6%94%BE%E5%99%A8%E6%BB%9A%E8%BD%AE%E8%B0%83%E6%92%AD%E6%94%BE%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/532543/bilibili%E6%92%AD%E6%94%BE%E5%99%A8%E6%BB%9A%E8%BD%AE%E8%B0%83%E6%92%AD%E6%94%BE%E9%80%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentSpeed = 1.00;
    let isHovering = false;
    let menuElement = null;

    // 创建无提示的菜单项
    const createStealthItem = () => {
        const li = document.createElement('li');
        li.className = 'bpx-player-ctrl-playbackrate-menu-item';
        li.style.cssText = 'cursor: ns-resize; height: 22px; opacity: 0.8;';
        li.dataset.stealth = 'true';
        return li;
    };

    // 隐式更新显示
    const stealthUpdate = () => {
        // 查找现有标准菜单项
        const defaultItems = document.querySelectorAll('.bpx-player-ctrl-playbackrate-menu-item:not([data-stealth])');

        // 同步激活状态
        defaultItems.forEach(item => {
            const itemSpeed = parseFloat(item.dataset.value || 1);
            item.classList.toggle('active', itemSpeed === currentSpeed);
        });

        // 更新视频播放速率显示
        const video = document.querySelector('video');
        if (video) video.playbackRate = currentSpeed;
    };

    // 滚轮处理
    const handleWheel = (e) => {
        if (!isHovering) return;

        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.02 : -0.02;
        currentSpeed = parseFloat((currentSpeed + delta).toFixed(2));
        currentSpeed = Math.min(16.00, Math.max(0.10, currentSpeed));
        stealthUpdate();
    };

    // 智能悬停检测
    const checkHoverState = () => {
        if (!menuElement) return;
        const rect = menuElement.getBoundingClientRect();
        isHovering = !!(rect.width && rect.height &&
                       getComputedStyle(menuElement).visibility !== 'hidden');
    };

    // 初始化
    const observer = new MutationObserver(() => {
        const menu = document.querySelector('.bpx-player-ctrl-playbackrate-menu');

        if (menu && !menu.dataset.stealth) {
            menuElement = menu;
            menu.dataset.stealth = 'true';

            // 添加透明触发区域
            menu.prepend(createStealthItem());

            // 事件监听
            menu.addEventListener('wheel', handleWheel, { passive: false });
            menu.addEventListener('mouseenter', checkHoverState);
            menu.addEventListener('mouseleave', () => isHovering = false);

            // 视频同步
            const video = document.querySelector('video');
            if (video) {
                currentSpeed = video.playbackRate;
                video.addEventListener('ratechange', () => {
                    currentSpeed = parseFloat(video.playbackRate.toFixed(2));
                });
            }

            // 状态轮询
            setInterval(checkHoverState, 300);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style']
    });
})();
