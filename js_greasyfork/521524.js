// ==UserScript==
// @name         智能链接识别助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  识别选中文本中的链接并提供快捷跳转
// @author       D0ublecl1ck
// @match        https://*/*/*
// @icon         data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23000" d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521524/%E6%99%BA%E8%83%BD%E9%93%BE%E6%8E%A5%E8%AF%86%E5%88%AB%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/521524/%E6%99%BA%E8%83%BD%E9%93%BE%E6%8E%A5%E8%AF%86%E5%88%AB%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建弹窗元素
    const popup = document.createElement('div');
    popup.id = 'url-popup';
    popup.style.cssText = `
        position: fixed;
        padding: 10px 20px;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        border-radius: 5px;
        font-size: 14px;
        z-index: 2147483647;
        display: none;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        pointer-events: auto;
        user-select: none;
        min-width: 200px;
    `;
    document.body.appendChild(popup);

    // URL正则表达式
    const urlRegex = /(?:https?:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi;

    // 在IIFE开始处定义点击处理函数
    let popupClickHandler = null;

    // 监听选中事件
    document.addEventListener('mouseup', function(e) {
        // 如果点击的是弹窗内部，不处理
        if (popup.contains(e.target)) {
            return;
        }

        const selectedText = window.getSelection().toString().trim();
        
        // 调试日志
        console.log('Selected text:', selectedText);
        
        if (!selectedText) {
            popup.style.display = 'none';
            return;
        }

        const matches = selectedText.match(urlRegex);
        // 调试日志
        console.log('Matched URLs:', matches);

        if (matches && matches.length > 0) {
            console.log('Processing matches...');
            
            const urlList = matches.map(url => {
                // 确保URL格式正确
                if (!url.match(/^https?:\/\//i)) {
                    url = 'https://' + url;
                }
                return url;
            });

            // 更新内容，为每个链接添加data-url属性
            popup.innerHTML = urlList.map((url, index) => 
                `<div class="popup-item" data-url="${url}" style="margin: 5px 0; padding: 5px; border-bottom: ${index < urlList.length-1 ? '1px solid rgba(255,255,255,0.2)' : 'none'}">
                    ${index + 1}. 点击跳转到: ${url}
                </div>`
            ).join('');

            // 先显示弹窗，但位置在屏幕外
            popup.style.display = 'block';
            popup.style.left = '-9999px';
            popup.style.top = '-9999px';

            // 等待DOM更新后再计算位置
            setTimeout(() => {
                console.log('Setting popup position...');
                console.log('Mouse position:', e.clientX, e.clientY);
                
                // 计算位置
                const x = Math.min(e.clientX, window.innerWidth - popup.offsetWidth - 20);
                const y = e.clientY + 100;
                
                console.log('Calculated position:', x, y);
                
                // 设置位置
                popup.style.left = Math.max(10, x) + 'px';
                popup.style.top = y + 'px';
                
                // 检查是否超出底部
                const rect = popup.getBoundingClientRect();
                if (rect.bottom > window.innerHeight) {
                    popup.style.top = (e.clientY - popup.offsetHeight - 10) + 'px';
                }
                
                console.log('Final popup position:', popup.style.left, popup.style.top);
            }, 0);

            // 移除旧的事件监听器
            if (popupClickHandler) {
                popup.removeEventListener('click', popupClickHandler);
            }

            // 更新点击处理函数
            popupClickHandler = function(e) {
                const item = e.target.closest('.popup-item');
                if (item) {
                    const url = item.dataset.url;
                    if (url) {
                        // 立即隐藏弹窗并跳转
                        popup.style.display = 'none';
                        window.open(url, '_blank');
                    }
                }
            };

            // 添加新的事件监听器
            popup.addEventListener('click', popupClickHandler);
        } else {
            popup.style.display = 'none';
        }
    });

    // 点击其他地方关闭弹窗
    document.addEventListener('mousedown', function(e) {
        // 如果点击的是弹窗内部，不处理
        if (popup.contains(e.target)) {
            return;
        }
        popup.style.display = 'none';
    });

    // 添加样式到文档
    const style = document.createElement('style');
    style.textContent = `
        #url-popup {
            font-family: Arial, sans-serif;
        }
        #url-popup .popup-item:hover {
            background: rgba(255, 255, 255, 0.1);
        }
    `;
    document.head.appendChild(style);
})(); 