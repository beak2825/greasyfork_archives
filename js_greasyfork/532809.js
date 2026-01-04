// ==UserScript==
// @name         CoCo 控件商城增强
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  现代化设计的控件商城集成方案
// @author       邋弼暁訫
// @match        https://coco.codemao.cn/editor/*
// @grant        GM_addStyle
// @license      未经允许禁止修改并发布脚本至其他平台
// @downloadURL https://update.greasyfork.org/scripts/532809/CoCo%20%E6%8E%A7%E4%BB%B6%E5%95%86%E5%9F%8E%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/532809/CoCo%20%E6%8E%A7%E4%BB%B6%E5%95%86%E5%9F%8E%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 现代感配色方案
    const theme = {
        primary: "#6366F1",
        secondary: "#4C4DCA",
        accent: "#10B981",
        background: "rgba(255,255,255,0.95)",
        text: "#1F2937",
        glass: "rgba(255,255,255,0.15)"
    };

    // 添加 Material Design 风格样式
    GM_addStyle(`
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes ripple {
            to { transform: scale(4); opacity: 0; }
        }

        @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
        }

        /* 按钮美化 */
        .enhanced-store-btn {
            position: relative !important;
            background: linear-gradient(135deg, ${theme.primary}, ${theme.secondary}) !important;
            color: white !important;
            border-radius: 999px !important;
            padding: 12px 24px !important;
            font-weight: 600 !important;
            box-shadow: 0 4px 20px -5px ${theme.primary}80 !important;
            transition: all 0.3s ease !important;
            overflow: hidden !important;
            border: none !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
        }

        .enhanced-store-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px -3px ${theme.primary}80 !important;
        }

        .enhanced-store-btn:active {
            transform: translateY(0);
            box-shadow: 0 2px 10px -2px ${theme.primary}80 !important;
        }

        .enhanced-store-btn::after {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            background: ${theme.glass};
            transform: translate(-50%, -50%) scale(0);
            border-radius: 50%;
            pointer-events: none;
        }

        .enhanced-store-btn:active::after {
            animation: ripple 0.6s ease-out;
        }

        .enhanced-store-btn .pulse-indicator {
            position: absolute;
            top: -6px;
            right: -6px;
            width: 16px;
            height: 16px;
            background: ${theme.accent};
            border-radius: 50%;
            border: 2px solid white;
            animation: pulse 1.5s infinite;
        }

        /* 朦胧背景 */
        .backdrop {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 2147483646;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }

        .backdrop.active {
            opacity: 1;
            visibility: visible;
        }

        /* 对话框样式 */
        .modern-dialog {
            z-index: 2147483647;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.95);
            width: min(90%, 1200px);
            height: 80vh;
            background: ${theme.background};
            backdrop-filter: blur(15px);
            border-radius: 24px;
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
            border: 1px solid rgba(255,255,255,0.3);
            animation: fadeIn 0.4s forwards cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
            transition: all 0.3s ease;
        }

        @keyframes fadeIn {
            to {
                transform: translate(-50%, -50%) scale(1);
                opacity: 1;
            }
        }

        .modern-dialog.exit {
            animation: fadeIn 0.3s reverse cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 0;
        }

        .dialog-header {
            padding: 20px;
            background: linear-gradient(135deg, ${theme.primary}, ${theme.secondary});
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
        }

        .dialog-title {
            font-size: 1.5rem;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .dialog-title svg {
            width: 24px;
            height: 24px;
        }

        .close-btn {
            cursor: pointer;
            padding: 8px;
            border-radius: 50%;
            transition: all 0.2s ease;
        }

        .close-btn:hover {
            background: rgba(255,255,255,0.1);
            transform: rotate(90deg);
        }

        .iframe-container {
            height: calc(100% - 68px);
            position: relative;
        }

        .loading-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${theme.background};
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            gap: 16px;
        }

        .loading-spinner {
            width: 48px;
            height: 48px;
            border: 3px solid ${theme.accent}20;
            border-top-color: ${theme.accent};
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .resize-handle {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 8px;
            cursor: ns-resize;
            z-index: 100;
        }
    `);

    // 创建现代化对话框
    function createModernDialog() {
        // 移除旧实例
        document.querySelector('.modern-dialog')?.remove();
        document.querySelector('.backdrop')?.remove();

        // 创建朦胧背景
        const backdrop = document.createElement('div');
        backdrop.className = 'backdrop active';
        document.body.appendChild(backdrop);

        // 创建对话框结构
        const dialog = document.createElement('div');
        dialog.className = 'modern-dialog';
        dialog.innerHTML = `
            <div class="dialog-header">
                <div class="dialog-title">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"/>
                    </svg>
                    <span>精品控件商城</span>
                </div>
                <div class="close-btn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                </div>
            </div>
            <div class="iframe-container">
                <div class="loading-overlay">
                    <div class="loading-spinner"></div>
                    <div>正在加载魔法控件库...</div>
                </div>
            </div>
        `;

        // 添加交互功能
        const iframe = document.createElement('iframe');
        iframe.style.cssText = `
            width: 100%;
            height: 100%;
            border: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        iframe.src = 'https://cocojs.lbxxsevensub.top/';

        // 加载完成处理
        iframe.onload = () => {
            iframe.style.opacity = '1';
            dialog.querySelector('.loading-overlay').remove();
        };

        dialog.querySelector('.iframe-container').appendChild(iframe);
        dialog.querySelector('.close-btn').addEventListener('click', () => {
            dialog.classList.add('exit');
            setTimeout(() => dialog.remove(), 300);
            backdrop.classList.remove('active');
            setTimeout(() => backdrop.remove(), 300);
        });

        // 添加拖拽调整大小功能
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'resize-handle';
        resizeHandle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            const startY = e.clientY;
            const startHeight = dialog.offsetHeight;
            document.body.style.userSelect = 'none';

            function handleMouseMove(moveEvent) {
                const newHeight = startHeight + (moveEvent.clientY - startY);
                dialog.style.height = `${Math.max(400, Math.min(window.innerHeight - 100, newHeight))}px`;
            }

            function handleMouseUp() {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                document.body.style.userSelect = '';
            }

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        });

        dialog.appendChild(resizeHandle);
        document.body.appendChild(dialog);
    }

    // 美化商城按钮
    function enhanceStoreButton() {
        const observer = new MutationObserver(() => {
            const originalBtn = document.querySelector('.WidgetList_widgetMallBtn__2_eHI');
            if (originalBtn && !originalBtn.classList.contains('enhanced')) {
                originalBtn.classList.add('enhanced-store-btn', 'enhanced');
                originalBtn.innerHTML = `
                    <span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"/>
                        </svg>
                        <span>控件商店</span>
                    </span>
                    <div class="pulse-indicator"></div>
                `;

                originalBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    createModernDialog();
                });
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 初始化
    function init() {
        enhanceStoreButton();
        // 添加键盘快捷键 (ESC关闭)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const dialog = document.querySelector('.modern-dialog');
                const backdrop = document.querySelector('.backdrop');
                if (dialog && backdrop) {
                    dialog.classList.add('exit');
                    backdrop.classList.remove('active');
                    setTimeout(() => {
                        dialog.remove();
                        backdrop.remove();
                    }, 300);
                }
            }
        });
    }

    // 页面加载处理
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();