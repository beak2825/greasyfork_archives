// ==UserScript==
// @name         123pan JSON秒传链接工具
// @namespace    http://tampermonkey.net/
// @version      1.1.9
// @description  1.1.9:修复bug
// @author       Tocpomk
// @match        *://*.123pan.com/*
// @match        *://*.123pan.cn/*
// @match        *://*.123865.com/*
// @match        *://*.123684.com/*
// @match        *://*.123912.com/*m
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542463/123pan%20JSON%E7%A7%92%E4%BC%A0%E9%93%BE%E6%8E%A5%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/542463/123pan%20JSON%E7%A7%92%E4%BC%A0%E9%93%BE%E6%8E%A5%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        #json-tool-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.4s cubic-bezier(0.32, 0.72, 0, 1);
            pointer-events: none;
        }
        #json-tool-modal.show {
            opacity: 1;
            visibility: visible;
            pointer-events: all;
        }
        #json-tool-content {
            width: 90%;
            height: 90%;
            max-width: 1200px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transform: translateY(50px) scale(0.95);
            opacity: 0;
            transition: all 0.5s cubic-bezier(0.32, 0.72, 0, 1);
        }
        #json-tool-modal.show #json-tool-content {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        #json-tool-close {
            background: rgba(0,0,0,0.2);
            border: none;
            color: white;
            font-size: 26px;
            cursor: pointer;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            transition: all 0.3s ease;
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
            position: static;
        }
        #json-tool-close:hover {
            background: rgba(0,0,0,0.5);
            transform: scale(1.15) rotate(90deg);
        }
        #json-tool-iframe {
            width: 100%;
            height: 100%;
            border: none;
            border-radius: 0 0 16px 16px;
        }
        #json-tool-header {
            height: 60px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 24px;
            color: white;
            font-weight: bold;
            font-size: 18px;
            position: relative;
        }
        #json-tool-title {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        #json-tool-title svg {
            width: 24px;
            height: 24px;
            fill: white;
        }
        .json-tool-drag-handle {
            width: 100%;
            height: 30px;
            position: absolute;
            top: 0;
            left: 0;
            cursor: move;
            z-index: 1;
        }
        @media (max-width: 768px) {
            #json-tool-content {
                width: 95%;
                height: 95%;
            }
            #json-tool-header {
                padding: 0 15px;
                height: 50px;
                font-size: 16px;
            }
        }
        #json-tool-header-btns {
            display: flex;
            align-items: center;
            gap: 12px;
            position: absolute;
            top: 50%;
            right: 18px;
            transform: translateY(-50%);
            z-index: 10001;
        }
        #json-tool-maximize,
        #json-tool-close {
            background: rgba(0,0,0,0.2);
            border: none;
            color: white;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
            padding: 0;
            margin: 0;
            position: static;
        }
        #json-tool-maximize:hover,
        #json-tool-close:hover {
            background: rgba(0,0,0,0.4);
            transform: scale(1.1);
        }
        #json-tool-maximize svg,
        #json-tool-close svg {
            width: 22px;
            height: 22px;
            display: block;
            margin: auto;
            fill: white;
        }
        .json-tool-menu-item.selected, .json-tool-menu-item.active, .json-tool-menu-item:active {
            background: rgb(96, 126, 252) !important;
        }
        .json-tool-menu-item .menu-icon-wrapper svg {
            fill: #222;
        }
        .json-tool-menu-item .menu-text {
            color: rgb(96, 126, 252);
            font-weight: bold;
        }
        .json-tool-menu-item.selected .menu-text,
        .json-tool-menu-item.selected .menu-icon-wrapper svg,
        .json-tool-menu-item.active .menu-text,
        .json-tool-menu-item.active .menu-icon-wrapper svg {
            color: #fff !important;
            fill: #fff !important;
        }
        .json-tool-menu-item.selected .menu-icon-wrapper,
        .json-tool-menu-item.active .menu-icon-wrapper {
            background: #f5f6fa !important;
        }
        .json-tool-menu-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            user-select: none;
            margin-top: 8px;
            margin-bottom: 8px;
            background: transparent !important;
            border-radius: 12px;
            transition: background 0.2s;
        }
        .json-tool-menu-item.selected,
        .json-tool-menu-item.active {
            background: #fff !important;
        }
        .json-tool-menu-item .menu-icon-wrapper {
            display: inline-flex !important;
            align-items: center;
            justify-content: center;
            width: 40px !important;
            height: 40px !important;
            min-width: 40px !important;
            min-height: 40px !important;
            border-radius: 50% !important;
            background: #f5f6fa;
            margin: 0 auto 4px auto;
            transition: background 0.2s;
            box-sizing: border-box;
            overflow: visible !important;
        }
        .json-tool-menu-item .menu-icon-wrapper svg {
            width: 24px;
            height: 24px;
            display: block;
            fill: #222;
            transition: fill 0.2s;
        }
        .json-tool-menu-item .menu-text {
            color: #222;
            font-size: 14px;
            text-align: center;
            transition: color 0.2s;
        }
        .json-tool-menu-item.selected .menu-icon-wrapper,
        .json-tool-menu-item.active .menu-icon-wrapper {
            background: rgb(96, 126, 252) !important;
        }
        .json-tool-menu-item.selected .menu-icon-wrapper svg,
        .json-tool-menu-item.active .menu-icon-wrapper svg {
            fill: #fff !important;
        }
        .json-tool-menu-item.selected .menu-text,
        .json-tool-menu-item.active .menu-text {
            color: rgb(96, 126, 252) !important;
        }
        .json-tool-menu-item:hover .menu-icon-wrapper {
            background: #e6eaff;
        }
        .json-tool-menu-item:hover .menu-icon-wrapper svg {
            fill: rgb(96, 126, 252);
        }
        .json-tool-menu-item:hover .menu-text {
            color: rgb(96, 126, 252);
        }
        /* 新增：工具页面淡入动画 */
        #json-tool-page {
            opacity: 0;
            transform: scale(0.98);
            transition: opacity 0.4s cubic-bezier(0.32, 0.72, 0, 1), transform 0.4s cubic-bezier(0.32, 0.72, 0, 1);
        }
        #json-tool-page.show-anim {
            opacity: 1;
            transform: scale(1);
        }
    `);

    // 缓存相关常量
    const IFRAME_URL = 'https://123.musejie.top/';

    // 获取iframe内容（去除缓存逻辑，直接返回原始URL）
    function getIframeSrcUrl() {
        return IFRAME_URL;
    }

    // 工具页面渲染到主内容区
    async function showJsonToolPage() {
        const layout = document.querySelector('.ant-layout.site-layout');
        if (!layout) return;
        // 只隐藏主内容区（如.ant-layout-content），不隐藏菜单栏
        const nativeContent = layout.querySelector('.ant-layout-content');
        if (nativeContent) nativeContent.style.display = 'none';
        // 移除已有的工具页面
        const old = document.getElementById('json-tool-page');
        if (old) old.remove();
        // 创建工具页面容器
        const page = document.createElement('div');
        page.id = 'json-tool-page';
        page.style.width = '100%';
        page.style.height = '100%';
        page.style.background = '#fff';
        page.style.display = 'flex';
        page.style.flexDirection = 'column';
        // 获取iframe src
        const iframeSrc = getIframeSrcUrl();
        page.innerHTML = `
            <iframe src="${iframeSrc}" style="width:100%;height:100%;border:none;"></iframe>
        `;
        layout.appendChild(page);
        // 动画：先不透明度0，下一帧加class
        requestAnimationFrame(() => {
            page.classList.add('show-anim');
        });
    }
    // 移除工具页面并恢复原生内容
    function removeJsonToolPage() {
        const layout = document.querySelector('.ant-layout.site-layout');
        if (!layout) return;
        // 恢复主内容区显示
        const nativeContent = layout.querySelector('.ant-layout-content');
        if (nativeContent) nativeContent.style.display = '';
        // 移除工具页面
        const old = document.getElementById('json-tool-page');
        if (old) old.remove();
    }
    // 插入菜单按钮
    function insertMenuButton() {
        const menuLists = document.querySelectorAll('.ant-menu.ant-menu-root.ant-menu-inline.ant-menu-light.side-menu');
        let menuList = null;
        menuLists.forEach(ul => {
            if (!ul.classList.contains('bottom-menu')) menuList = ul;
        });
        if (!menuList) return;
        if (menuList.querySelector('.json-tool-menu-item')) return;
        const li = document.createElement('li');
        li.className = 'ant-menu-item ant-menu-item-only-child json-tool-menu-item';
        li.setAttribute('role', 'menuitem');
        li.style.paddingLeft = '24px';
        li.innerHTML = `
            <span class="ant-menu-title-content">
                <a class="menu-item" href="javascript:void(0)">
                    <div class="menu-icon-wrapper">
                        <svg viewBox="0 0 1024 1024">
                            <path d="M406.409701 486.995257h-332.769427a63.994121 63.994121 0 0 1-63.99412-67.193826V86.392063a63.994121 63.994121 0 0 1 63.99412-63.994121h332.769427a63.994121 63.994121 0 0 1 67.193827 63.994121v333.409368a63.994121 63.994121 0 0 1-67.193827 67.193826z m0-400.603194H76.83998l3.839648 330.209662h325.730073z m0 330.209662zM767.976482 503.633729a63.994121 63.994121 0 0 1-46.715708-19.198237L536.317766 299.492484a63.994121 63.994121 0 0 1 0-92.791475L720.620833 21.758001a63.994121 63.994121 0 0 1 92.791475 0l184.303067 184.943008a63.994121 63.994121 0 0 1 0 92.791475l-184.303067 184.943008a63.994121 63.994121 0 0 1-45.435826 19.198237zM589.432886 255.976482L767.976482 431.320372 945.240196 255.976482 767.976482 74.873121zM406.409701 1023.905929h-332.769427a63.994121 63.994121 0 0 1-63.99412-67.193827V620.742969a63.994121 63.994121 0 0 1 63.99412-63.99412h332.769427a63.994121 63.994121 0 0 1 67.193827 63.99412v333.409368A63.994121 63.994121 0 0 1 406.409701 1023.905929z m0-400.603195l-329.569721 3.199706 3.839648 330.209662 325.730073-3.199706z m0 330.209662zM933.721254 1023.905929H600.311886a63.994121 63.994121 0 0 1-63.99412-67.193827V620.742969a63.994121 63.994121 0 0 1 63.99412-63.99412h333.409368a63.994121 63.994121 0 0 1 63.994121 63.99412v333.409368a63.994121 63.994121 0 0 1-63.994121 69.753592z m-3.839647-403.16296l-329.569721 3.199706 3.839648 330.209662 325.730073-3.199706z m3.839647 330.209662z"/>
                        </svg>
                    </div>
                    <div class="menu-text">秒链工具</div>
                </a>
            </span>
        `;
        // 点击“秒链工具”按钮
        li.addEventListener('click', function(e) {
            document.querySelectorAll('.json-tool-menu-item').forEach(item => item.classList.remove('selected', 'active'));
            li.classList.add('selected');
            showJsonToolPage();
        });
        menuList.appendChild(li);
        // 给所有原生菜单按钮添加点击事件
        menuList.querySelectorAll('.ant-menu-item:not(.json-tool-menu-item)').forEach(item => {
            item.addEventListener('click', function() {
                removeJsonToolPage();
                document.querySelectorAll('.json-tool-menu-item.selected').forEach(btn => btn.classList.remove('selected'));
            });
        });
    }
    // 监听菜单切换，移除工具页面
    function observeMenu() {
        insertMenuButton();
        const observer = new MutationObserver(() => {
            insertMenuButton();
            // 如果“秒链工具”未被选中，移除工具页面
            const selected = document.querySelector('.json-tool-menu-item.selected');
            if (!selected) removeJsonToolPage();
        });
        observer.observe(document.body, { childList: true, subtree: true });
        window.addEventListener('hashchange', () => {
            insertMenuButton();
            const selected = document.querySelector('.json-tool-menu-item.selected');
            if (!selected) removeJsonToolPage();
        });
        window.addEventListener('popstate', () => {
            insertMenuButton();
            const selected = document.querySelector('.json-tool-menu-item.selected');
            if (!selected) removeJsonToolPage();
        });
    }

    // 创建弹窗
    function createModal() {
        const modal = document.createElement('div');
        modal.id = 'json-tool-modal';
        modal.innerHTML = `
            <div id="json-tool-content">
                <div class="json-tool-drag-handle"></div>
                <div id="json-tool-header">
                    <div id="json-tool-title">
                        <svg viewBox="0 0 24 24">
                            <path d="M14,11H10V9h4V11z M14,8H10V6h4V8z M20,4V20H4V4H20 M20,2H4C2.9,2,2,2.9,2,4v16c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V4 C22,2.9,21.1,2,20,2L20,2z M16,15H8v-2h8V15z M16,18H8v-2h8V18z M6,15H4v2h2V15z M6,18H4v2h2V18z M6,6H4v8h2V6z"></path>
                        </svg>
                        <span>JSON秒传链接工具</span>
                    </div>
                    <div id="json-tool-header-btns">
                        <button id="json-tool-maximize" title="最大化">
                            <svg viewBox="0 0 24 24">
                                <path id="json-tool-maximize-icon" d="M3 3h7v2H5v5H3V3zm11 0h7v7h-2V5h-5V3zm7 11v7h-7v-2h5v-5h2zm-11 7H3v-7h2v5h5v2z"/>
                            </svg>
                        </button>
                        <button id="json-tool-close" title="关闭">
                            <svg viewBox="0 0 24 24">
                                <path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12l-4.89 4.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <iframe id="json-tool-iframe" src="" style="width:100%;height:100%;border:none;"></iframe>
            </div>
        `;
        // 设置iframe src（异步）
        const iframe = modal.querySelector('#json-tool-iframe');
        if (iframe) iframe.src = getIframeSrcUrl();
        modal.querySelector('#json-tool-close').addEventListener('click', hideModal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideModal();
            }
        });
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                hideModal();
            }
        });
        // 拖拽弹窗功能
        let isModalDragging = false;
        let modalStartX, modalStartY;
        const dragHandle = modal.querySelector('.json-tool-drag-handle');
        const content = modal.querySelector('#json-tool-content');
        dragHandle.addEventListener('mousedown', startModalDrag);
        function startModalDrag(e) {
            isModalDragging = true;
            modalStartX = e.clientX;
            modalStartY = e.clientY;
            content.style.transition = 'none';
            document.addEventListener('mousemove', onModalDrag);
            document.addEventListener('mouseup', stopModalDrag);
        }
        function onModalDrag(e) {
            if (!isModalDragging) return;
            const deltaX = e.clientX - modalStartX;
            const deltaY = e.clientY - modalStartY;
            content.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        }
        function stopModalDrag() {
            if (!isModalDragging) return;
            isModalDragging = false;
            content.style.transition = '';
            content.style.transform = '';
            document.removeEventListener('mousemove', onModalDrag);
            document.removeEventListener('mouseup', stopModalDrag);
        }
        // 最大化/还原功能
        const maximizeBtn = modal.querySelector('#json-tool-maximize');
        const maximizeIcon = modal.querySelector('#json-tool-maximize-icon');
        const contentBox = modal.querySelector('#json-tool-content');
        let isMaximized = false;
        maximizeBtn.addEventListener('click', function() {
            isMaximized = !isMaximized;
            if (isMaximized) {
                contentBox.style.width = '100vw';
                contentBox.style.height = '100vh';
                contentBox.style.maxWidth = '100vw';
                contentBox.style.maxHeight = '100vh';
                contentBox.style.borderRadius = '0';
                contentBox.style.top = '0';
                contentBox.style.left = '0';
                contentBox.style.position = 'fixed';
                contentBox.style.zIndex = '10002';
                maximizeIcon.innerHTML = '<path d="M7 14H5v5h5v-2H7v-3zm7 3v2h5v-5h-2v3h-3zm3-10V5h-3V3h5v5h-2V7zm-7-2V3H3v5h2V5h3z"/>';
            } else {
                contentBox.style.width = '';
                contentBox.style.height = '';
                contentBox.style.maxWidth = '1200px';
                contentBox.style.maxHeight = '';
                contentBox.style.borderRadius = '16px';
                contentBox.style.top = '';
                contentBox.style.left = '';
                contentBox.style.position = '';
                contentBox.style.zIndex = '';
                maximizeIcon.innerHTML = '<path d="M3 3h7v2H5v5H3V3zm11 0h7v7h-2V5h-5V3zm7 11v7h-7v-2h5v-5h2zm-11 7H3v-7h2v5h5v2z"/>';
            }
        });
        document.body.appendChild(modal);
        return modal;
    }
    function showModal() {
        const modal = document.getElementById('json-tool-modal');
        if (modal) {
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
        }
    }
    function hideModal() {
        const modal = document.getElementById('json-tool-modal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                document.body.style.overflow = '';
            }, 300);
        }
        // 关闭弹窗时取消按钮选中
        document.querySelectorAll('.json-tool-menu-item.selected').forEach(item => item.classList.remove('selected'));
    }
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                createModal();
                observeMenu();
            });
        } else {
            createModal();
            observeMenu();
        }
    }
    init();
    // 剪贴板代理逻辑保留
    window.addEventListener('message', async function(event) {
        if (!event.origin.startsWith('https://123.musejie.top')) return;
        const { type, text } = event.data || {};
        if (type === 'copyToClipboard') {
            try {
                await navigator.clipboard.writeText(text);
                event.source.postMessage({ type: 'copyResult', success: true }, event.origin);
            } catch (e) {
                event.source.postMessage({ type: 'copyResult', success: false, error: e.message }, event.origin);
            }
        }
        if (type === 'pasteFromClipboard') {
            try {
                const clipText = await navigator.clipboard.readText();
                event.source.postMessage({ type: 'pasteResult', success: true, text: clipText }, event.origin);
            } catch (e) {
                event.source.postMessage({ type: 'pasteResult', success: false, error: e.message }, event.origin);
            }
        }
    });
})();