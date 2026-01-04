// ==UserScript==
// @name         纯七AI助手
// @namespace    http://xzbzq.com
// @version      1.5
// @description  在页面上添加一个悬浮窗，用于访问 https://ai.xzbzq.com 搜题
// @author       纯七
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license MIT
// @homepage     https://xzbzq.com
// @downloadURL https://update.greasyfork.org/scripts/498727/%E7%BA%AF%E4%B8%83AI%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/498727/%E7%BA%AF%E4%B8%83AI%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // 悬浮窗的HTML代码
    const iframeHtml = `
        <div id="floating-window">
            <div id="floating-header">
                <span>纯七AI助手</span>
                <button id="close-btn">×</button>
            </div>
            <iframe src="https://ai.xzbzq.com" frameborder="0"></iframe>
            <div id="resize-handle"></div>
        </div>
    `;
    // 将悬浮窗添加到页面
    const body = document.querySelector('body');
    body.insertAdjacentHTML('beforeend', iframeHtml);
    // 悬浮窗样式
    GM_addStyle(`
        #floating-window {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 30%;
            height: 60%;
            background: rgba(255, 255, 255, 0.8);
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            border-radius: 8px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            z-index: 9999;
            cursor: move;
        }
        #floating-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(255, 255, 255, 0.9);
            color: #333;
            padding: 10px;
            font-size: 18px;
            cursor: move;
        }
        #floating-header #close-btn {
            background: none;
            border: none;
            color: #333;
            font-size: 20px;
            cursor: pointer;
        }
        #floating-window iframe {
            flex-grow: 1;
            width: 100%;
            border: none;
        }
        #resize-handle {
            width: 20px;
            height: 20px;
            background: #333;
            opacity: 0.5;
            position: absolute;
            bottom: 0;
            right: 0;
            cursor: se-resize;
        }
        @media (max-width: 768px) {
            #floating-window {
                width: 80%;
                height: 50%;
                bottom: 10px;
                right: 10px;
            }
            #floating-header {
                font-size: 16px;
                padding: 8px;
            }
            #floating-header #close-btn {
                font-size: 18px;
            }
        }
        @media (max-width: 480px) {
            #floating-window {
                width: 90%;
                height: 40%;
                bottom: 5px;
                right: 5px;
            }
            #floating-header {
                font-size: 14px;
                padding: 6px;
            }
            #floating-header #close-btn {
                font-size: 16px;
            }
        }
    `);
    // 关闭按钮事件
    document.getElementById('close-btn').addEventListener('click', function() {
        document.getElementById('floating-window').style.display = 'none';
    });
    // 添加菜单命令以显示/隐藏悬浮窗
    let isWindowVisible = true;
    const toggleWindow = () => {
        const window = document.getElementById('floating-window');
        if (isWindowVisible) {
            window.style.display = 'none';
        } else {
            window.style.display = 'block';
        }
        isWindowVisible = !isWindowVisible;
    };
    GM_registerMenuCommand('切换 AI搜题悬浮窗', toggleWindow);
    // 拖拽功能
    const floatingWindow = document.getElementById('floating-window');
    const floatingHeader = document.getElementById('floating-header');
    let offsetX = 0, offsetY = 0, initialX = 0, initialY = 0;
    floatingHeader.addEventListener('mousedown', (e) => {
        offsetX = e.clientX;
        offsetY = e.clientY;
        document.addEventListener('mousemove', moveWindow);
        document.addEventListener('mouseup', stopMoveWindow);
    });
    const moveWindow = (e) => {
        e.preventDefault();
        initialX = offsetX - e.clientX;
        initialY = offsetY - e.clientY;
        offsetX = e.clientX;
        offsetY = e.clientY;
        const rect = floatingWindow.getBoundingClientRect();
        floatingWindow.style.top = (rect.top - initialY) + "px";
        floatingWindow.style.left = (rect.left - initialX) + "px";
    };
    const stopMoveWindow = () => {
        document.removeEventListener('mousemove', moveWindow);
        document.removeEventListener('mouseup', stopMoveWindow);
    };
    // 调整大小功能
    const resizeHandle = document.getElementById('resize-handle');
    let startX, startY, startWidth, startHeight;
    resizeHandle.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        startY = e.clientY;
        const rect = floatingWindow.getBoundingClientRect();
        startWidth = rect.width;
        startHeight = rect.height;
        document.addEventListener('mousemove', resizeWindow);
        document.addEventListener('mouseup', stopResizeWindow);
    });
    const resizeWindow = (e) => {
        e.preventDefault();
        floatingWindow.style.width = (startWidth + e.clientX - startX) + 'px';
        floatingWindow.style.height = (startHeight + e.clientY - startY) + 'px';
    };
    const stopResizeWindow = () => {
        document.removeEventListener('mousemove', resizeWindow);
        document.removeEventListener('mouseup', stopResizeWindow);
    };
    // 添加透明度调整选项
    const setOpacity = (opacity) => {
        floatingWindow.style.background = `rgba(255, 255, 255, ${opacity})`;
    };
    GM_registerMenuCommand('设置透明度为100%', () => setOpacity(1));
    GM_registerMenuCommand('设置透明度为80%', () => setOpacity(0.8));
    GM_registerMenuCommand('设置透明度为60%', () => setOpacity(0.6));
    GM_registerMenuCommand('设置透明度为40%', () => setOpacity(0.4));
    GM_registerMenuCommand('设置透明度为20%', () => setOpacity(0.2));
})();
