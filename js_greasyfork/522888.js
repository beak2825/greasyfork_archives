// ==UserScript==
// @name         Bilibili  复制BV号、标题和简介 
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在B站视频页面显示并快速复制BV号、标题和简介，支持折叠
// @author       Your Name
// @match        *://*.bilibili.com/video/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/522888/Bilibili%20%20%E5%A4%8D%E5%88%B6BV%E5%8F%B7%E3%80%81%E6%A0%87%E9%A2%98%E5%92%8C%E7%AE%80%E4%BB%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/522888/Bilibili%20%20%E5%A4%8D%E5%88%B6BV%E5%8F%B7%E3%80%81%E6%A0%87%E9%A2%98%E5%92%8C%E7%AE%80%E4%BB%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 添加样式
    GM_addStyle(`
        .bv-float-icon {
            position: fixed;
            top: 80px;
            right: 20px;
            width: 40px;
            height: 40px;
            background: #00a1d6;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: all 0.3s;
        }
        .bv-float-icon:hover {
            background: #0088b7;
            transform: scale(1.1);
        }
        .bv-float-icon svg {
            width: 24px;
            height: 24px;
            fill: white;
        }
        .bv-container {
            position: fixed;
            top: 80px;
            right: 70px;
            background: rgba(255, 255, 255, 0.95);
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 9998;
            font-size: 14px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 300px;
            border: 1px solid #e3e5e7;
            transition: all 0.3s;
            opacity: 1;
            transform: translateX(0);
        }
        .bv-container.collapsed {
            opacity: 0;
            transform: translateX(100%);
            pointer-events: none;
        }
        .info-group {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        .info-label {
            font-size: 12px;
            color: #666;
        }
        .info-content {
            color: #00a1d6;
            font-weight: bold;
            word-break: break-all;
            background: #f6f7f8;
            padding: 5px;
            border-radius: 4px;
            max-height: 60px;
            overflow-y: auto;
        }
        .copy-btn {
            background: #00a1d6;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.3s;
            font-size: 12px;
        }
        .copy-btn:hover {
            background: #0088b7;
        }
        .copy-success {
            background: #2ecc71 !important;
        }
        .all-copy-btn {
            background: #ff6699;
            margin-top: 5px;
        }
        .all-copy-btn:hover {
            background: #ff4488;
        }
    `);

    // BV图标SVG
    const ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M3 3h18v18H3V3zm2 2v14h14V5H5zm2 2h2v10H7V7zm6 0h-2v10h2V7zm2 0h2v10h-2V7z"/>
    </svg>`;

    // 创建悬浮图标
    function createFloatIcon() {
        const icon = document.createElement('div');
        icon.className = 'bv-float-icon';
        icon.innerHTML = ICON_SVG;
        icon.title = '点击显示/隐藏视频信息';
        
        // 从localStorage获取上次的状态
        const isCollapsed = localStorage.getItem('bvGrabberCollapsed') === 'true';
        
        icon.addEventListener('click', () => {
            const container = document.querySelector('.bv-container');
            if (container) {
                container.classList.toggle('collapsed');
                // 保存状态到localStorage
                localStorage.setItem('bvGrabberCollapsed', container.classList.contains('collapsed'));
            }
        });
        
        document.body.appendChild(icon);
        return isCollapsed;
    }

    // 创建复制按钮
    function createCopyButton(text, label) {
        const btn = document.createElement('button');
        btn.className = 'copy-btn';
        btn.textContent = `复制${label}`;
        
        btn.addEventListener('click', () => {
            navigator.clipboard.writeText(text).then(() => {
                btn.textContent = '已复制！';
                btn.classList.add('copy-success');
                setTimeout(() => {
                    btn.textContent = `复制${label}`;
                    btn.classList.remove('copy-success');
                }, 1500);
            });
        });
        
        return btn;
    }

    // 获取视频信息
    function getVideoInfo() {
        const bvNumber = window.location.href.match(/\/video\/(BV[a-zA-Z0-9]+)/)?.[1] || '未找到BV号';
        const title = document.querySelector('.video-title')?.textContent?.trim() || 
                     document.querySelector('h1')?.textContent?.trim() || '未找到标题';
        const desc = document.querySelector('.desc-info-text')?.textContent?.trim() || 
                    document.querySelector('.video-desc')?.textContent?.trim() || '未找到简介';
        
        return { bvNumber, title, desc };
    }

    // 创建信息面板
    function createUI() {
        const { bvNumber, title, desc } = getVideoInfo();
        
        const container = document.createElement('div');
        container.className = 'bv-container';
        
        // 如果之前是折叠状态，添加collapsed类
        if (localStorage.getItem('bvGrabberCollapsed') === 'true') {
            container.classList.add('collapsed');
        }

        // BV号组
        const bvGroup = document.createElement('div');
        bvGroup.className = 'info-group';
        const bvLabel = document.createElement('div');
        bvLabel.className = 'info-label';
        bvLabel.textContent = 'BV号';
        const bvContent = document.createElement('div');
        bvContent.className = 'info-content';
        bvContent.textContent = bvNumber;
        bvGroup.appendChild(bvLabel);
        bvGroup.appendChild(bvContent);
        bvGroup.appendChild(createCopyButton(bvNumber, 'BV号'));

        // 标题组
        const titleGroup = document.createElement('div');
        titleGroup.className = 'info-group';
        const titleLabel = document.createElement('div');
        titleLabel.className = 'info-label';
        titleLabel.textContent = '标题';
        const titleContent = document.createElement('div');
        titleContent.className = 'info-content';
        titleContent.textContent = title;
        titleGroup.appendChild(titleLabel);
        titleGroup.appendChild(titleContent);
        titleGroup.appendChild(createCopyButton(title, '标题'));

        // 简介组
        const descGroup = document.createElement('div');
        descGroup.className = 'info-group';
        const descLabel = document.createElement('div');
        descLabel.className = 'info-label';
        descLabel.textContent = '简介';
        const descContent = document.createElement('div');
        descContent.className = 'info-content';
        descContent.textContent = desc;
        descGroup.appendChild(descLabel);
        descGroup.appendChild(descContent);
        descGroup.appendChild(createCopyButton(desc, '简介'));

        // 一键复制所有信息
        const allCopyBtn = document.createElement('button');
        allCopyBtn.className = 'copy-btn all-copy-btn';
        allCopyBtn.textContent = '复制所有信息';
        allCopyBtn.addEventListener('click', () => {
            const allInfo = `BV号：${bvNumber}\n标题：${title}\n简介：${desc}`;
            navigator.clipboard.writeText(allInfo).then(() => {
                allCopyBtn.textContent = '已复制所有信息！';
                allCopyBtn.classList.add('copy-success');
                setTimeout(() => {
                    allCopyBtn.textContent = '复制所有信息';
                    allCopyBtn.classList.remove('copy-success');
                }, 1500);
            });
        });

        container.appendChild(bvGroup);
        container.appendChild(titleGroup);
        container.appendChild(descGroup);
        container.appendChild(allCopyBtn);
        document.body.appendChild(container);
    }

    // 初始化
    function init() {
        createFloatIcon();
        createUI();
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 监听URL变化（用于SPA页面）
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            const oldContainer = document.querySelector('.bv-container');
            const oldIcon = document.querySelector('.bv-float-icon');
            if (oldContainer) oldContainer.remove();
            if (oldIcon) oldIcon.remove();
            setTimeout(init, 500);
        }
    }).observe(document, { subtree: true, childList: true });
})();
