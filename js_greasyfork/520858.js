// ==UserScript==
// @name         Wallhaven 增强下载
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  带动态通知的图片下载功能
// @author       dantaKing
// @match        https://wallhaven.cc/w/*
// @grant        GM_download
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520858/Wallhaven%20%E5%A2%9E%E5%BC%BA%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/520858/Wallhaven%20%E5%A2%9E%E5%BC%BA%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 动态通知系统（居中顶部布局）
    const notificationSystem = (() => {
        const container = Object.assign(document.createElement('div'), {
            style: `position:fixed;top:20px;left:50%;
                    transform:translateX(-50%);
                    z-index:2147483647;display:flex;
                    flex-direction:column;align-items:center;
                    gap:8px;pointer-events:none;`
        });
        document.body.appendChild(container);

        return {
            show: (text, type = 'info') => {
                const notification = document.createElement('div');
                notification.textContent = text;
                Object.assign(notification.style, {
                    padding: '12px 24px',
                    background: type === 'error' ? '#ff4444' : '#2196F3',
                    color: 'white',
                    borderRadius: '24px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    animation: 'notificationIn 0.3s cubic-bezier(0.22, 0.61, 0.36, 1)',
                    fontFamily: 'system-ui',
                    fontSize: '14px',
                    backdropFilter: 'blur(4px)',
                    maxWidth: '80vw',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                });

                container.prepend(notification);
                setTimeout(() => {
                    notification.style.animation = 'notificationOut 0.3s forwards';
                    setTimeout(() => notification.remove(), 300);
                }, 2500);
            }
        };
    })();

    // 增强型下载按钮（保持原位置）
    function createEnhancedDownloadButton() {
        const btn = Object.assign(document.createElement('button'), {
            innerHTML: `<svg style="width:18px;height:18px;margin-right:8px;transition:transform 0.3s" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z"/>
                        </svg>
                        <span>下载原图</span>`,
            style: `position:fixed;top:80px;right:20px;z-index:2147483646;
                    padding:10px 20px;background:linear-gradient(145deg,#2196F3,#1976D2);
                    color:white;border:none;border-radius:8px;
                    cursor:pointer;display:flex;align-items:center;
                    box-shadow:0 4px 6px rgba(0,0,0,0.1);transition:all 0.2s;`
        });

        // 保持原有交互逻辑
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-2px)';
            btn.style.boxShadow = '0 6px 8px rgba(0,0,0,0.15)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
            btn.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        });
        btn.addEventListener('click', () => {
            btn.querySelector('svg').style.transform = 'translateY(2px)';
            setTimeout(() => {
                btn.querySelector('svg').style.transform = '';
            }, 200);
        });

        return btn;
    }

    // 核心功能（保持不变）
    function initCoreFunctionality() {
        const wallpaper = document.querySelector('#wallpaper');
        if (!wallpaper) {
            notificationSystem.show('未检测到有效壁纸元素', 'error');
            return;
        }

        const downloadBtn = createEnhancedDownloadButton();
        downloadBtn.addEventListener('click', () => {
            const fileName = wallpaper.src.split('/').pop();
            GM_download({
                url: wallpaper.src,
                name: fileName,
                onerror: e => notificationSystem.show(`下载失败: ${e.error}`, 'error'),
                onload: () => notificationSystem.show('下载完成')
            });
        });

        document.body.appendChild(downloadBtn);
    }

    // 更新动画样式
    const dynamicStyles = document.createElement('style');
    dynamicStyles.textContent = `
        @keyframes notificationIn {
            from { opacity:0; transform:translateY(-20px); }
            to { opacity:1; transform:translateY(0); }
        }
        @keyframes notificationOut {
            to { opacity:0; transform:translateY(-20px); }
        }
    `;
    document.head.appendChild(dynamicStyles);

    // 初始化流程
    if (document.readyState === 'complete') {
        initCoreFunctionality();
    } else {
        window.addEventListener('load', initCoreFunctionality);
    }
})();
