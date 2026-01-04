// ==UserScript==
// @name         移动端网页元素查看器3
// @name:zh-CN   移动端网页元素查看器3
// @namespace    https://greasyfork.org/users/cj920815
// @version      1.0.1
// @description  在手机上查看网页元素信息，帮助分析广告位置
// @description:zh-CN 在手机上查看网页元素信息，帮助分析广告位置
// @author       cj920815
// @match        *://*/*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/534696/%E7%A7%BB%E5%8A%A8%E7%AB%AF%E7%BD%91%E9%A1%B5%E5%85%83%E7%B4%A0%E6%9F%A5%E7%9C%8B%E5%99%A83.user.js
// @updateURL https://update.greasyfork.org/scripts/534696/%E7%A7%BB%E5%8A%A8%E7%AB%AF%E7%BD%91%E9%A1%B5%E5%85%83%E7%B4%A0%E6%9F%A5%E7%9C%8B%E5%99%A83.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 创建悬浮按钮
    const button = document.createElement('button');
    button.textContent = '查看元素';
    button.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 999999;
        background: #4CAF50;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        font-size: 14px;
    `;
    
    // 创建信息面板
    const panel = document.createElement('div');
    panel.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 10px;
        font-size: 12px;
        z-index: 999998;
        max-height: 50vh;
        overflow-y: auto;
        display: none;
    `;

    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: transparent;
        z-index: 999996;
        display: none;
    `;
    
    let isInspecting = false;
    let highlightBox = null;
    let lastTouchTime = 0;
    const DOUBLE_TAP_DELAY = 300; // 双击间隔时间（毫秒）
    
    // 创建高亮框
    function createHighlightBox() {
        const box = document.createElement('div');
        box.style.cssText = `
            position: absolute;
            border: 2px solid #ff0000;
            background: rgba(255,0,0,0.2);
            pointer-events: none;
            z-index: 999997;
            display: none;
        `;
        document.body.appendChild(box);
        return box;
    }
    
    // 显示元素信息
    function showElementInfo(element) {
        const rect = element.getBoundingClientRect();
        const styles = window.getComputedStyle(element);
        
        // 获取元素的所有父元素
        let parents = [];
        let currentElement = element;
        while (currentElement && currentElement !== document.body) {
            parents.unshift(currentElement);
            currentElement = currentElement.parentElement;
        }
        
        // 构建元素路径
        const elementPath = parents.map(el => {
            let str = el.tagName.toLowerCase();
            if (el.id) str += '#' + el.id;
            if (el.className) str += '.' + el.className.replace(/\s+/g, '.');
            return str;
        }).join(' > ');
        
        panel.innerHTML = `
            <div style="margin-bottom: 8px;">
                <strong>标签:</strong> ${element.tagName.toLowerCase()}<br>
                <strong>ID:</strong> ${element.id || '无'}<br>
                <strong>类名:</strong> ${element.className || '无'}<br>
                <strong>位置:</strong> 上${Math.round(rect.top)}px, 左${Math.round(rect.left)}px<br>
                <strong>尺寸:</strong> ${Math.round(rect.width)}x${Math.round(rect.height)}px<br>
                <strong>定位:</strong> ${styles.position}<br>
                <strong>z-index:</strong> ${styles.zIndex}<br>
                <strong>display:</strong> ${styles.display}<br>
                <strong>visibility:</strong> ${styles.visibility}<br>
                <strong>元素路径:</strong> ${elementPath}<br>
            </div>
            <div style="margin-bottom: 8px;">
                <strong>内部HTML:</strong><br>
                <div style="background: rgba(255,255,255,0.1); padding: 5px; margin-top: 5px; word-break: break-all;">
                    ${element.outerHTML.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
                </div>
            </div>
            <div style="color: #ffeb3b; margin-top: 10px;">
                提示：双击元素可以复制元素信息
            </div>
        `;
        
        // 更新高亮框位置
        highlightBox.style.display = 'block';
        highlightBox.style.left = rect.left + window.scrollX + 'px';
        highlightBox.style.top = rect.top + window.scrollY + 'px';
        highlightBox.style.width = rect.width + 'px';
        highlightBox.style.height = rect.height + 'px';
    }
    
    // 切换检查模式
    function toggleInspect() {
        isInspecting = !isInspecting;
        button.textContent = isInspecting ? '停止查看' : '查看元素';
        button.style.background = isInspecting ? '#f44336' : '#4CAF50';
        panel.style.display = isInspecting ? 'block' : 'none';
        overlay.style.display = isInspecting ? 'block' : 'none';
        highlightBox.style.display = 'none';
        
        if (!isInspecting) {
            panel.innerHTML = '';
        }

        // 在检查模式下禁用页面滚动
        document.body.style.overflow = isInspecting ? 'hidden' : '';
    }
    
    // 复制元素信息到剪贴板
    function copyElementInfo() {
        const info = panel.innerText;
        const textarea = document.createElement('textarea');
        textarea.value = info;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            z-index: 999999;
        `;
        notification.textContent = '元素信息已复制到剪贴板';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 2000);
    }
    
    // 初始化
    document.body.appendChild(button);
    document.body.appendChild(panel);
    document.body.appendChild(overlay);
    highlightBox = createHighlightBox();
    
    // 事件处理
    button.addEventListener('click', toggleInspect);
    
    overlay.addEventListener('click', function(e) {
        if (!isInspecting) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const element = document.elementFromPoint(e.clientX, e.clientY);
        if (element) {
            showElementInfo(element);
        }
    });
    
    // 添加触摸支持
    overlay.addEventListener('touchstart', function(e) {
        if (!isInspecting) return;
        
        e.preventDefault();
        
        const now = Date.now();
        const touch = e.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        
        if (element) {
            showElementInfo(element);
            
            // 检测双击
            if (now - lastTouchTime < DOUBLE_TAP_DELAY) {
                copyElementInfo();
            }
            lastTouchTime = now;
        }
    }, {passive: false});

    // 防止页面滚动穿透
    overlay.addEventListener('touchmove', function(e) {
        if (isInspecting) {
            e.preventDefault();
        }
    }, {passive: false});

    // 添加键盘快捷键支持
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isInspecting) {
            toggleInspect();
        }
    });
})(); 