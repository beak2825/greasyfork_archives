// ==UserScript==
// @name         Linux.do clochat.com discourse Base64 script
// @namespace    http://tampermonkey.net/
// @version      1.5.3
// @description  Base64编解码工具，支持位置记忆、夜间模式和拖动功能
// @author       Xavier
// @match        https://linux.do/*
// @match        https://clochat.com/*
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/531421/Linuxdo%20clochatcom%20discourse%20Base64%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/531421/Linuxdo%20clochatcom%20discourse%20Base64%20script.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 创建主容器
    const container = document.createElement('div');
    container.id = 'b64Container';
    Object.assign(container.style, {
        position: 'fixed',
        zIndex: 9999,
        borderRadius: '8px',
        fontFamily: 'inherit',
        cursor: 'move'
    });

    // 初始化位置
    const savedPosition = GM_getValue('b64Position', null);
    if (savedPosition) {
        container.style.left = `${savedPosition.x}px`;
        container.style.top = `${savedPosition.y}px`;
        container.style.bottom = 'auto';
        container.style.right = 'auto';
    } else {
        container.style.bottom = '20px';
        container.style.right = '20px';
        container.style.left = 'auto';
        container.style.top = 'auto';
    }

    // 主触发器
    const trigger = document.createElement('div');
    trigger.innerHTML = 'Base64';
    Object.assign(trigger.style, {
        padding: '8px 16px',
        borderRadius: '6px',
        fontSize: '14px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        backgroundColor: 'var(--primary)',
        color: 'var(--secondary)',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        opacity: '0.5',
    });

    // 添加鼠标悬停效果
    trigger.onmouseover = () => {
        trigger.style.opacity = '1';
    };

    trigger.onmouseout = () => {
        trigger.style.opacity = '0.5';
    };

    // 拖动功能
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        const rect = container.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            container.style.left = `${x}px`;
            container.style.top = `${y}px`;
            container.style.right = 'auto';
            container.style.bottom = 'auto';
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            const rect = container.getBoundingClientRect();
            GM_setValue('b64Position', {
                x: rect.left,
                y: rect.top
            });
        }
        isDragging = false;
    });

    // 下拉菜单容器
    const menu = document.createElement('div');
    menu.style.cssText = `
        position: absolute;
        bottom: 100%;
        right: 0;
        width: 140px;
        background: var(--secondary);
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        margin-bottom: 8px;
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.25s ease;
        pointer-events: none;
        overflow: hidden;
    `;

    // 创建菜单项
    const createMenuItem = (text) => {
        const item = document.createElement('div');
        item.textContent = text;
        item.style.cssText = `
            padding: 10px 16px;
            font-size: 13px;
            cursor: pointer;
            color: var(--primary);
            transition: all 0.2s;
            text-align: left;
            line-height: 1.4;
        `;

        // 根据按钮文本设置不同圆角
        if (text === '解析本页 Base64') {
            item.style.borderRadius = '6px 6px 0 0';
        } else if (text === '文本转 Base64') {
            item.style.borderRadius = '0 0 6px 6px';
        }

        item.onmouseenter = () => {
            item.style.background = 'rgba(0,0,0,0.08)';
        };

        item.onmouseleave = () => {
            item.style.background = '';
        };

        return item;
    };

    let decodeItem = createMenuItem('解析本页 Base64');
    const encodeItem = createMenuItem('文本转 Base64');

    menu.append(decodeItem, encodeItem);
    container.append(trigger, menu);

    // 菜单切换逻辑
    const toggleMenu = (show) => {
        menu.style.opacity = show ? 1 : 0;
        menu.style.transform = show ? 'translateY(0)' : 'translateY(10px)';
        menu.style.pointerEvents = show ? 'all' : 'none';
    };

    // 主题适配
    const updateTheme = () => {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        trigger.style.backgroundColor = isDark ? 'var(--primary)' : 'var(--secondary)';
        trigger.style.color = isDark ? 'var(--secondary)' : 'var(--primary)';
        trigger.style.opacity = '0.5';
    };

    // 统一提示函数
    function showNotification(message, isSuccess) {
        const notification = document.createElement('div');
        notification.className = 'b64-copy-notification';
        notification.textContent = message;
        notification.style.background = isSuccess ? 'rgba(0, 200, 0, 0.9)' : 'rgba(200, 0, 0, 0.9)';
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 2500);
    }

    // 复制提示样式
    const notificationStyle = document.createElement('style');
    notificationStyle.textContent = `
        .b64-copy-notification {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 200, 0, 0.9);
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 10000;
            animation: fadeOut 2s forwards;
            animation-delay: 0.5s;
        }

        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(notificationStyle);

    // 解码功能
    let isParsed = false;
    let originalTexts = {};

    const decodeBase64 = () => {
        const base64Regex = /([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?/g;

        if (isParsed) {
            Object.entries(originalTexts).forEach(([wrapperId, text]) => {
                const wrapper = document.getElementById(wrapperId);
                if (wrapper) {
                    const textNode = document.createTextNode(text);
                    wrapper.replaceWith(textNode);
                }
            });
            originalTexts = {};
            isParsed = false;
            decodeItem.textContent = '解析本页 Base64';
            showNotification('已恢复原始内容', true);
            return;
        }

        let decodeSuccess = false;

        document.querySelectorAll('div.post, div.cooked').forEach(container => {
            const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);

            while (walker.nextNode()) {
                const node = walker.currentNode;
                if (node.textContent.length > 20) {
                    const decodedContent = node.textContent.replace(base64Regex, match => {
                        try {
                            const decoded = decodeURIComponent(escape(atob(match)));
                            if (decoded !== match) {
                                decodeSuccess = true;
                                return `<span class="b64-decoded" style="color: #FF7F28; background: rgba(255, 127, 40, 0.1); cursor: pointer; transition: all 0.2s; padding: 1px 2px; border-radius: 3px;">${decoded}</span>`;
                            }
                            return match;
                        } catch (e) {
                            return match;
                        }
                    });

                    if (decodedContent !== node.textContent) {
                        const wrapper = document.createElement('span');
                        const wrapperId = `b64-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
                        wrapper.id = wrapperId;
                        wrapper.innerHTML = decodedContent;

                        wrapper.querySelectorAll('.b64-decoded').forEach(span => {
                            span.onclick = (e) => {
                                GM_setClipboard(span.textContent);
                                showNotification('已复制到剪贴板', true);
                                e.target.style.opacity = '0.7';
                                setTimeout(() => e.target.style.opacity = '', 500);
                            };
                        });

                        originalTexts[wrapperId] = node.textContent;
                        node.replaceWith(wrapper);
                    }
                }
            }
        });

        if (decodeSuccess) {
            isParsed = true;
            decodeItem.textContent = '恢复本页 Base64';
            showNotification('解析成功', true);
        } else {
            showNotification('解析失败，未发现有效Base64', false);
        }
    };

    // 编码功能
    const encodeBase64 = () => {
        const text = prompt('请输入要编码的文本:');
        if (text) {
            try {
                const encoded = btoa(unescape(encodeURIComponent(text)));
                GM_setClipboard(encoded);
                showNotification('编码成功已复制', true);
            } catch (e) {
                showNotification('编码失败：无效字符', false);
            }
        } else {
            showNotification('编码已取消', false);
        }
    };

    // 事件绑定
    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu(menu.style.opacity === '0');
    });

    decodeItem.addEventListener('click', () => {
        decodeBase64();
        toggleMenu(false);
    });

    encodeItem.addEventListener('click', () => {
        encodeBase64();
        toggleMenu(false);
    });

    // 初始化
    document.body.appendChild(container);
    updateTheme();

    // 主题变化监听
    new MutationObserver(updateTheme).observe(document.body, {
        attributes: true,
        attributeFilter: ['data-theme']
    });

    // 点击外部关闭
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) toggleMenu(false);
    });

    // 监听前进和后退事件，重置解析状态
    function resetParseState() {
        isParsed = false;
        originalTexts = {};
        decodeItem.textContent = '解析本页 Base64';
    }
    window.addEventListener('popstate', resetParseState);

    // 全局样式
    const style = document.createElement('style');
    style.textContent = `
        .b64-decoded:hover {
            background: rgba(255, 127, 40, 0.2) !important;
        }
        .b64-decoded:active {
            background: rgba(255, 127, 40, 0.3) !important;
        }
    `;
    document.head.appendChild(style);

    // 确保原有复制提示兼容性
    function showCopyNotification() {
        showNotification('已复制到剪贴板', true);
    }
})();
