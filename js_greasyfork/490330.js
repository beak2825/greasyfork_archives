// ==UserScript==
// @name         bilibili 倍速
// @license MIT
// @version      0.5.0.0
// @description  按钮倍速
// @author       dfdy-yyc
// @match           https://www.bilibili.com/video/*
// @match           https://www.bilibili.com/list/*
// @match           https://www.bilibili.com/bangumi/play/*
// @match           https://www.bilibili.com/cheese/play/*
// @match           https://www.bilibili.com/festival/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @namespace https://greasyfork.org/users/1276921
// @downloadURL https://update.greasyfork.org/scripts/490330/bilibili%20%E5%80%8D%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/490330/bilibili%20%E5%80%8D%E9%80%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置项
    const config = {
        speeds: ['3.0', '4.0'],
        customItems: [
            {
                value: '设置',
                text: '设置',
                position: 'bottom' // 插入位置：top/bottom
            }
        ]
    };

    // 创建菜单项元素
    function createMenuItem(item) {
        const li = document.createElement('li');
        li.className = 'bpx-player-ctrl-playbackrate-menu-item';
        li.dataset.value = item.value;
        li.textContent = item.text;

        if (item.value === '设置') {
            li.addEventListener('click', (e) => {
                e.preventDefault();
                    const speed = prompt('请输入自定义倍速（最高16.0）');
                if (speed && parseFloat(speed) <= 16.0) {
                    document.querySelector('video').playbackRate = speed;
    }
            });
        }
        return li;
    }

    // 添加自定义菜单项
    function addCustomItems(menu) {
        // 添加倍速选项到顶部
        config.speeds.forEach(speed => {
            if (!menu.querySelector(`[data-value="${speed}"]`)) {
                const li = createMenuItem({
                    value: speed,
                    text: `${speed}x`
                });
                menu.insertBefore(li, menu.firstChild);
            }
        });

        // 添加自定义项到底部
        config.customItems.forEach(item => {
            if (!menu.querySelector(`[data-value="${item.value}"]`)) {
                const li = createMenuItem(item);
                if (item.position === 'bottom') {
                    menu.appendChild(li);
                } else {
                    menu.insertBefore(li, menu.firstChild);
                }
            }
        });
    }

    // 主处理函数
    function handlePlaybackRateMenu() {
        const rateMenu = document.querySelector('.bpx-player-ctrl-playbackrate-menu');
        if (rateMenu && !rateMenu.dataset.enhanced) {
            addCustomItems(rateMenu);
            rateMenu.dataset.enhanced = 'true'; // 标记已处理
            console.log('成功增强倍速菜单');
        }
    }

    // 使用MutationObserver监听DOM变化
    const observer = new MutationObserver(() => {
        handlePlaybackRateMenu();
    });

    // 初始化
    function init() {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        handlePlaybackRateMenu(); // 立即尝试一次

        // 处理SPA页面切换
        window.addEventListener('popstate', () => {
            setTimeout(handlePlaybackRateMenu, 500);
        });
    }

    // 延迟初始化以确保播放器加载
    window.addEventListener('load', init, { once: true });
})();




