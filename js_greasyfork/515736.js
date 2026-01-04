// ==UserScript==
// @name         Linux.do 链接新窗口打开控制
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  控制 linux.do 论坛帖子链接是否在新窗口打开
// @author       Gh0st&Claude
// @match        https://linux.do/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515736/Linuxdo%20%E9%93%BE%E6%8E%A5%E6%96%B0%E7%AA%97%E5%8F%A3%E6%89%93%E5%BC%80%E6%8E%A7%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/515736/Linuxdo%20%E9%93%BE%E6%8E%A5%E6%96%B0%E7%AA%97%E5%8F%A3%E6%89%93%E5%BC%80%E6%8E%A7%E5%88%B6.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2024 Gh0st&Claude

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function() {
    'use strict';
    
    // 获取设置状态，默认启用新窗口打开和状态指示器显示
    let isEnabled = GM_getValue('newWindowEnabled', true);
    let showStatus = GM_getValue('showStatusIndicator', true);
    
    // 添加状态指示器样式
    GM_addStyle(`
        #newWindowStatus {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 8px 15px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border-radius: 4px;
            z-index: 9999;
            font-size: 14px;
            cursor: pointer;
            display: none; /* 默认隐藏，通过 JS 控制显示 */
        }
        #newWindowStatus:hover {
            background: rgba(0, 0, 0, 0.8);
        }
    `);
    
    // 创建状态指示器
    const statusDiv = document.createElement('div');
    statusDiv.id = 'newWindowStatus';
    document.body.appendChild(statusDiv);
    
    // 更新状态显示
    function updateStatus() {
        statusDiv.textContent = isEnabled ? '新窗口打开：已启用' : '新窗口打开：已禁用';
        // 根据 showStatus 设置显示状态
        statusDiv.style.display = showStatus ? 'block' : 'none';
    }
    
    // 切换状态指示器显示
    function toggleStatusIndicator() {
        showStatus = !showStatus;
        GM_setValue('showStatusIndicator', showStatus);
        updateStatus();
    }
    
    // 点击状态指示器切换新窗口打开状态
    statusDiv.addEventListener('click', toggleNewWindow);
    
    // 注册菜单命令
    GM_registerMenuCommand('切换新窗口打开状态', toggleNewWindow);
    GM_registerMenuCommand('切换状态指示器显示', toggleStatusIndicator);
    
    // 切换功能开关
    function toggleNewWindow() {
        isEnabled = !isEnabled;
        GM_setValue('newWindowEnabled', isEnabled);
        updateStatus();
    }
    
    // 处理链接点击
    function handleLinkClick(e) {
        if (isEnabled) {
            e.preventDefault();
            e.stopPropagation(); // 阻止事件冒泡
            window.open(this.href, '_blank', 'noopener,noreferrer');
        }
    }
    
    // 主要功能
    function processLinks() {
        // 查找所有帖子标题链接
        const links = document.querySelectorAll('.link-top-line a.title:not([data-processed])');
        
        links.forEach(link => {
            // 标记该链接已处理
            link.setAttribute('data-processed', 'true');
            // 添加事件监听器
            link.addEventListener('click', handleLinkClick);
        });
    }
    
    // 监听 DOM 变化，处理动态加载的内容
    const observer = new MutationObserver((mutations) => {
        const hasNewLinks = mutations.some(mutation => {
            return Array.from(mutation.addedNodes).some(node => {
                return node.nodeType === 1 && (
                    node.classList.contains('link-top-line') ||
                    node.querySelector('.link-top-line')
                );
            });
        });
        
        if (hasNewLinks) {
            processLinks();
        }
    });
    
    // 开始观察
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // 初始处理
    processLinks();
    
    // 显示初始状态
    updateStatus();
})();
