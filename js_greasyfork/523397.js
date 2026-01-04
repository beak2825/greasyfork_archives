// ==UserScript==
// @name         B站稍后再看跳转
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  从B站稍后再看页面跳转到视频详情页
// @author       shxzz
// @match        https://www.bilibili.com/list/watchlater*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523397/B%E7%AB%99%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/523397/B%E7%AB%99%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建跳转按钮
    function createRedirectButton() {
        const button = document.createElement('div');
        button.className = 'fixed-sidenav-storage-item';
        button.title = '跳转到视频详情页';
        button.innerHTML = `
            <svg class="fixed-sidenav-storage-item-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="currentColor"/>
            </svg>
            详情页
        `;
        
        // 创建外层容器
        const container = document.createElement('div');
        container.className = 'custom-fixed-sidenav';
        container.style.cssText = `
            position: fixed;
            right: 6px;
            bottom: 226px;
            z-index: 100;
            width: 40px;
            border-radius: 8px;
            background: #fff;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;

        // 添加按钮样式
        button.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            padding: 7px 0;
            cursor: pointer;
            color: #18191c;
            font-size: 12px;
            line-height: 1.2;
            transition: all .2s;
            text-align: center;
        `;

        // 添加SVG图标样式
        const svg = button.querySelector('svg');
        svg.style.cssText = `
            margin-bottom: 4px;
        `;

        // 添加hover效果
        button.addEventListener('mouseenter', () => {
            button.style.color = '#00aeec';
            button.style.backgroundColor = 'var(--graph_bg_thin, #f1f2f3)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.color = '';
            button.style.backgroundColor = '';
        });

        // 点击事件处理
        button.addEventListener('click', redirectToVideoPage);

        container.appendChild(button);
        return container;
    }

    // 跳转到视频详情页
    function redirectToVideoPage() {
        const currentUrl = window.location.href;
        const bvid = new URLSearchParams(currentUrl.split('?')[1]).get('bvid');
        if (bvid) {
            // 使用相对路径
            window.location.href = `/video/${bvid}/`;
        }
    }

    // 初始化
    function init() {
        // 检查是否已存在按钮
        if (!document.querySelector('.custom-fixed-sidenav')) {
            const button = createRedirectButton();
            document.body.appendChild(button);
        }
    }

    // 页面加载完成后执行初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})(); 