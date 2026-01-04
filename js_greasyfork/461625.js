// ==UserScript==
// @name         防止未经授权的自动复制
// @version      35
// @description  在非选词复制时显示图标提示用户以防止未经授权的自动复制，脚本菜单还加入了禁止写入剪贴板功能
// @author       DeepSeek
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @run-at       document-start
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/461625/%E9%98%B2%E6%AD%A2%E6%9C%AA%E7%BB%8F%E6%8E%88%E6%9D%83%E7%9A%84%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/461625/%E9%98%B2%E6%AD%A2%E6%9C%AA%E7%BB%8F%E6%8E%88%E6%9D%83%E7%9A%84%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const domain = window.location.hostname;
    let isEnabledClipboard = GM_getValue(domain + '_clipboard', false);
    let isEnabledAutoCopy = GM_getValue(domain + '_autocopy', true);

    GM_registerMenuCommand((isEnabledClipboard ? '允许' : '禁止') + '写入剪贴板', () => {
        isEnabledClipboard = !isEnabledClipboard;
        GM_setValue(domain + '_clipboard', isEnabledClipboard);
        location.reload();
    });

    GM_registerMenuCommand((isEnabledAutoCopy ? '禁用' : '启用') + '复制监听', () => {
        isEnabledAutoCopy = !isEnabledAutoCopy;
        GM_setValue(domain + '_autocopy', isEnabledAutoCopy);
        location.reload();
    });

    if (isEnabledClipboard) {
        ['execCommand', 'writeText', 'write'].forEach(method => {
            const target = method === 'execCommand' ? document : navigator.clipboard;
            Object.defineProperty(target, method, {
                value: () => {},
                writable: false,
                configurable: false
            });
        });
    }

    if (!isEnabledAutoCopy) return;

    let redDot = null;
    let pendingCopyText = '';
    let timeoutId = null;
    let isUserSelection = false;
    let isInitialized = false;
    
    // 存储事件监听器引用，以便移除
    let eventListeners = {
        selectionchange: null,
        copy: null,
        touchstart: null,
        touchmove: null
    };
    
    // 存储原始函数引用，以便恢复
    let originalFunctions = {
        writeText: null,
        execCommand: null
    };

    function createRedDot() {
        if (redDot) return redDot;
        
        const dot = document.createElement('div');
        dot.innerHTML = `
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                <path d="M4 14h.01"></path>
                <path d="M20 14h.01"></path>
                <path d="M4 18h.01"></path>
                <path d="M20 18h.01"></path>
            </svg>
        `;

        // 现代化的毛玻璃 + 渐变 + 呼吸光 + 微波纹
        dot.style.cssText = `
            position: fixed;
            right: 20px;
            top: 50%;
            transform: translateY(-50%) scale(0);
            width: 64px;
            height: 64px;
            background: linear-gradient(135deg, rgba(255, 59, 92, 0.95), rgba(255, 20, 80, 0.95));
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            z-index: 2147483647;
            box-shadow: 0 10px 30px rgba(255, 40, 100, 0.4),
                        0 0 0 8px rgba(255, 60, 100, 0.15);
            backdrop-filter: blur(12px);
            border: 3px solid rgba(255,255,255,0.25);
            opacity: 0;
            pointer-events: none;
            transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
        `;

        // 呼吸光环动画
        const pulse = document.createElement('div');
        pulse.style.cssText = `
            position: absolute;
            inset: -12px;
            border-radius: 50%;
            border: 2px solid rgba(255, 80, 120, 0.4);
            animation: pulseRing 2.5s ease-out infinite;
            pointer-events: none;
        `;
        dot.appendChild(pulse);

        // 鼠标悬停放大 + 高亮
        dot.addEventListener('mouseenter', () => {
            dot.style.transform = 'translateY(-50%) scale(1.15)';
            dot.style.boxShadow = '0 15px 40px rgba(255, 40, 100, 0.6), 0 0 0 12px rgba(255, 80, 120, 0.3)';
        });
        dot.addEventListener('mouseleave', () => {
            dot.style.transform = 'translateY(-50%) scale(1)';
            dot.style.boxShadow = '0 10px 30px rgba(255, 40, 100, 0.4), 0 0 0 8px rgba(255, 60, 100, 0.15)';
        });

        dot.addEventListener('click', handleRedDotClick);
        redDot = dot;
        return dot;
    }

    function ensureRedDot() {
        if (!redDot && document.body) {
            createRedDot();
            document.body.appendChild(redDot);
        }
        return redDot;
    }

    function showRedDot() {
        const dot = ensureRedDot();
        if (dot) {
            dot.style.display = 'flex';
            dot.style.opacity = '1';
            dot.style.transform = 'translateY(-50%) scale(1)';
            dot.style.pointerEvents = 'auto';

            clearTimeout(timeoutId);
            timeoutId = setTimeout(hideRedDot, 6000);
        }
    }

    function hideRedDot() {
        if (redDot) {
            redDot.style.opacity = '0';
            redDot.style.transform = 'translateY(-50%) scale(0)';
            redDot.style.pointerEvents = 'none';
            setTimeout(() => {
                if (redDot) redDot.style.display = 'none';
            }, 450);
        }
        pendingCopyText = '';
        clearTimeout(timeoutId);
        timeoutId = null;
    }

    function handleRedDotClick() {
        if (!pendingCopyText) return;
        
        const promptText = `检测到复制请求，是否允许复制以下内容？\n\n"${pendingCopyText.substring(0, 100)}${pendingCopyText.length > 100 ? '...' : ''}"`;
        const allowCopy = confirm(promptText);
        
        if (allowCopy && typeof GM_setClipboard === "function") {
            GM_setClipboard(pendingCopyText);
        }
        hideRedDot();
    }

    function cleanupEventListeners() {
        // 移除所有事件监听器
        if (eventListeners.selectionchange) {
            document.removeEventListener('selectionchange', eventListeners.selectionchange);
            eventListeners.selectionchange = null;
        }
        
        if (eventListeners.copy) {
            document.removeEventListener('copy', eventListeners.copy, true);
            eventListeners.copy = null;
        }
        
        if (eventListeners.touchstart) {
            document.removeEventListener('touchstart', eventListeners.touchstart);
            eventListeners.touchstart = null;
        }
        
        if (eventListeners.touchmove) {
            document.removeEventListener('touchmove', eventListeners.touchmove);
            eventListeners.touchmove = null;
        }
        
        // 恢复原始函数
        if (originalFunctions.writeText && navigator.clipboard) {
            Object.defineProperty(navigator.clipboard, 'writeText', {
                value: originalFunctions.writeText,
                writable: true,
                configurable: true
            });
            originalFunctions.writeText = null;
        }
        
        if (originalFunctions.execCommand && document.execCommand) {
            Object.defineProperty(document, 'execCommand', {
                value: originalFunctions.execCommand,
                writable: true,
                configurable: true
            });
            originalFunctions.execCommand = null;
        }
    }

    function setupSelectionTracking() {
        // 移除旧的监听器
        if (eventListeners.selectionchange) {
            document.removeEventListener('selectionchange', eventListeners.selectionchange);
        }
        
        // 创建新的监听器并保存引用
        const selectionHandler = function() {
            const selection = window.getSelection();
            if (selection && selection.toString().length > 0) {
                isUserSelection = true;
            }
        };
        
        document.addEventListener('selectionchange', selectionHandler);
        eventListeners.selectionchange = selectionHandler;
    }

    function setupClipboardInterception() {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            // 保存原始函数
            if (!originalFunctions.writeText) {
                originalFunctions.writeText = navigator.clipboard.writeText;
            }
            
            // 设置新的拦截函数
            Object.defineProperty(navigator.clipboard, 'writeText', {
                value: function(text) {
                    if (isUserSelection) {
                        isUserSelection = false;
                        return originalFunctions.writeText.call(navigator.clipboard, text);
                    }
                    if (!text || text.trim().length === 0) return Promise.resolve();
                    pendingCopyText = text;
                    showRedDot();
                    return Promise.resolve();
                },
                writable: true,
                configurable: true,
            });
        }
    }

    function setupExecCommandInterception() {
        const originalExecCommand = document.execCommand;
        if (originalExecCommand) {
            // 保存原始函数
            if (!originalFunctions.execCommand) {
                originalFunctions.execCommand = originalExecCommand;
            }
            
            Object.defineProperty(document, 'execCommand', {
                value: function(command) {
                    if (command === 'copy') {
                        const selection = window.getSelection();
                        if (selection && selection.toString().length > 0) {
                            if (isUserSelection) {
                                isUserSelection = false;
                                return originalFunctions.execCommand.apply(document, arguments);
                            }
                            pendingCopyText = selection.toString();
                            showRedDot();
                            return true;
                        }
                    }
                    return originalFunctions.execCommand.apply(document, arguments);
                },
                writable: true,
                configurable: true,
            });
        }
    }

    function setupCopyEventInterception() {
        // 移除旧的监听器
        if (eventListeners.copy) {
            document.removeEventListener('copy', eventListeners.copy, true);
        }
        
        // 创建新的监听器并保存引用
        const copyHandler = function(e) {
            const selection = window.getSelection();
            if (selection && selection.toString().length > 0) {
                if (isUserSelection) {
                    isUserSelection = false;
                    return;
                }
                pendingCopyText = selection.toString();
                showRedDot();
                e.preventDefault();
                e.stopPropagation();
            }
        };
        
        document.addEventListener('copy', copyHandler, true);
        eventListeners.copy = copyHandler;
    }

    function setupTouchEvents() {
        let startX = null;
        let startY = null;
        
        // 移除旧的监听器
        if (eventListeners.touchstart) {
            document.removeEventListener('touchstart', eventListeners.touchstart);
        }
        if (eventListeners.touchmove) {
            document.removeEventListener('touchmove', eventListeners.touchmove);
        }
        
        // 创建新的触摸事件监听器
        const touchStartHandler = function(e) { 
            startX = e.touches[0].clientX; 
            startY = e.touches[0].clientY; 
        };
        
        const touchMoveHandler = function(e) {
            if (startX === null || startY === null) return;
            const diffX = Math.abs(e.touches[0].clientX - startX);
            const diffY = Math.abs(e.touches[0].clientY - startY);
            if ((diffX > 10 || diffY > 10) && redDot && redDot.style.opacity === '1') {
                hideRedDot();
            }
        };
        
        document.addEventListener('touchstart', touchStartHandler);
        document.addEventListener('touchmove', touchMoveHandler);
        
        eventListeners.touchstart = touchStartHandler;
        eventListeners.touchmove = touchMoveHandler;
    }

    function initUI() {
        if (isInitialized) return;
        ensureRedDot();
        setupTouchEvents();
        isInitialized = true;
    }

    function setupInterceptions() {
        // 清理旧监听器
        cleanupEventListeners();
        
        // 重新设置所有监听
        setupSelectionTracking();
        setupClipboardInterception();
        setupExecCommandInterception();
        setupCopyEventInterception();
    }

    function initialize() {
        setupInterceptions();
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initUI);
        } else {
            initUI();
        }
    }

    // 添加呼吸光环动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulseRing {
            0% { transform: scale(0.8); opacity: 0.6; }
            70% { transform: scale(1.4); opacity: 0; }
            100% { transform: scale(1.6); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    initialize();
    
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM加载完成，重新设置监听');
        
        // 重新设置所有监听器（会先清理旧监听器）
        setupInterceptions();
        
        // 确保红点存在
        ensureRedDot();
        
        // 重新绑定触摸事件
        setupTouchEvents();
    });
})();