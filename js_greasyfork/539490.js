// ==UserScript==
// @name         网页百度悬浮窗口
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在网页上层生成一个显示百度的小窗口，支持拖动和缩放
// @author       豆包
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/539490/%E7%BD%91%E9%A1%B5%E7%99%BE%E5%BA%A6%E6%82%AC%E6%B5%AE%E7%AA%97%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/539490/%E7%BD%91%E9%A1%B5%E7%99%BE%E5%BA%A6%E6%82%AC%E6%B5%AE%E7%AA%97%E5%8F%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 窗口配置
    const windowConfig = {
        width: 400,            // 初始宽度
        height: 500,           // 初始高度
        left: 10,              // 初始左距
        top: 10,               // 初始上距
        zIndex: 99999          // 层级
    };
    
    // 添加自定义样式
    GM_addStyle(`
        #baidu-float-window {
            position: fixed;
            border: 2px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            overflow: hidden;
            display: none;
        }
        #baidu-title-bar {
            background-color: #fff;
            padding: 8px 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
            border-bottom: 1px solid #eee;
        }
        #baidu-title {
            font-weight: bold;
            color: #333;
        }
        #baidu-actions {
            display: flex;
            gap: 8px;
        }
        .btn {
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border-radius: 4px;
            transition: background-color 0.2s;
        }
        .btn:hover {
            background-color: #f0f0f0;
        }
        #baidu-close {
            color: #999;
        }
        #baidu-close:hover {
            color: #f00;
        }
        #baidu-resize {
            color: #666;
            font-size: 12px;
        }
        #baidu-content {
            width: 100%;
            height: calc(100% - 36px);
        }
        #baidu-iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
    `);
    
    // 创建悬浮窗口
    function createFloatWindow() {
        const window = document.createElement('div');
        window.id = 'baidu-float-window';
        window.style.width = `${windowConfig.width}px`;
        window.style.height = `${windowConfig.height}px`;
        window.style.left = `${windowConfig.left}px`;
        window.style.top = `${windowConfig.top}px`;
        window.style.zIndex = windowConfig.zIndex;
        
        // 标题栏
        const titleBar = document.createElement('div');
        titleBar.id = 'baidu-title-bar';
        
        const title = document.createElement('div');
        title.id = 'baidu-title';
        title.textContent = '百度搜索';
        
        const actions = document.createElement('div');
        actions.id = 'baidu-actions';
        
        const closeBtn = document.createElement('div');
        closeBtn.id = 'baidu-close';
        closeBtn.className = 'btn';
        closeBtn.innerHTML = '×';
        
        const resizeBtn = document.createElement('div');
        resizeBtn.id = 'baidu-resize';
        resizeBtn.className = 'btn';
        resizeBtn.innerHTML = '□';
        
        actions.appendChild(closeBtn);
        actions.appendChild(resizeBtn);
        titleBar.appendChild(title);
        titleBar.appendChild(actions);
        
        // 内容区域
        const content = document.createElement('div');
        content.id = 'baidu-content';
        
        const iframe = document.createElement('iframe');
        iframe.id = 'baidu-iframe';
        iframe.src = 'https://www.baidu.com';
        iframe.setAttribute('allow', 'clipboard-write');
        
        content.appendChild(iframe);
        window.appendChild(titleBar);
        window.appendChild(content);
        document.body.appendChild(window);
        
        // 显示窗口
        window.style.display = 'block';
        
        return {
            element: window,
            iframe: iframe
        };
    }
    
    // 初始化窗口
    let floatWindow = null;
    
    // 注册菜单命令
    GM_registerMenuCommand("显示百度悬浮窗口", () => {
        if (!floatWindow) {
            floatWindow = createFloatWindow();
            setupDragAndResize(floatWindow);
        } else {
            floatWindow.element.style.display = 
                floatWindow.element.style.display === 'block' ? 'none' : 'block';
        }
    });
    
    // 设置拖动和缩放功能
    function setupDragAndResize(windowObj) {
        const window = windowObj.element;
        const titleBar = window.querySelector('#baidu-title-bar');
        const resizeBtn = window.querySelector('#baidu-resize');
        const closeBtn = window.querySelector('#baidu-close');
        
        let isDragging = false;
        let offsetX, offsetY;
        
        // 拖动功能
        titleBar.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - parseInt(window.style.left);
            offsetY = e.clientY - parseInt(window.style.top);
            window.style.transition = 'none';
            document.body.style.cursor = 'grabbing';
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const left = e.clientX - offsetX;
                const top = e.clientY - offsetY;
                window.style.left = `${left}px`;
                window.style.top = `${top}px`;
            }
        });
        
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                window.style.transition = '';
                document.body.style.cursor = '';
            }
        });
        
        // 缩放功能（点击切换全屏/原始大小）
        resizeBtn.addEventListener('click', () => {
            if (window.style.width === '100%' && window.style.height === '100%') {
                window.style.width = `${windowConfig.width}px`;
                window.style.height = `${windowConfig.height}px`;
                window.style.left = `${windowConfig.left}px`;
                window.style.top = `${windowConfig.top}px`;
            } else {
                window.style.width = '100%';
                window.style.height = '100%';
                window.style.left = '0';
                window.style.top = '0';
            }
        });
        
        // 关闭功能
        closeBtn.addEventListener('click', () => {
            window.style.display = 'none';
        });
    }
})();