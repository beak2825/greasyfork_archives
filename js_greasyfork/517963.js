// ==UserScript==
// @name         在新标签页打开链接
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  使用滑动开关图标的新标签页脚本，支持触屏操作，排除系统文件夹链接
// @author       晚风知我意
// @match        https://*/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517963/%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/517963/%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const CONFIG = {
        buttonSize: 48,
        activeColor: '#4CAF50',
        inactiveColor: '#F44336',
        hoverColor: '#388E3C',
        inactiveHoverColor: '#D32F2F',
        zIndex: 99999,
        positionOffset: 25,
        touchDelay: 300
    };

    // 主初始化函数
    const init = () => {
        const domain = location.hostname.replace(/\./g, '-');
        const toggleKey = `linkToggleEnabled_${domain}`;
        const positionKey = `buttonPosition_${domain}`;

        // 初始化设置
        const settings = {
            isEnabled: GM_getValue(toggleKey, true),
            savedPosition: GM_getValue(positionKey)
        };

        // 注入CSS样式
        GM_addStyle(`
    .ntb-container-${domain} {
        position: fixed;
        z-index: ${CONFIG.zIndex};
        cursor: move;
        transition: transform 0.2s;
        touch-action: none;
    }
    .ntb-button-${domain} {
        width: ${CONFIG.buttonSize}px;
        height: ${CONFIG.buttonSize}px;
        border-radius: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        box-shadow: none;
        cursor: pointer;
        border: none;
        outline: none;
        position: relative;
        overflow: visible;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
    }
    .ntb-switch-track-${domain} {
        width: 36px;
        height: 20px;
        border-radius: 10px;
        background: ${settings.isEnabled ? CONFIG.activeColor : '#aaa'};
        position: relative;
        transition: all 0.3s ease;
        opacity: 0.9;
    }
    .ntb-switch-thumb-${domain} {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: white;
        position: absolute;
        left: ${settings.isEnabled ? '18px' : '2px'};
        top: 2px;
        transition: all 0.3s ease;
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }
    .ntb-button-${domain}:hover .ntb-switch-track-${domain} {
        background: ${settings.isEnabled ? CONFIG.hoverColor : '#888'};
        opacity: 1;
    }
    .ntb-status-text-${domain} {
        position: absolute;
        bottom: 0px;
        font-size: 0px;
        color: ${settings.isEnabled ? 'white' : 'rgba(255,255,255,0.8)'};
        font-weight: bold;
        width: 100%;
        text-align: center;
        text-shadow: 0 1px 2px rgba(0,0,0,0.5);
    }
    
    .ntb-button-${domain}::after {
        content: '';
        position: absolute;
        top: -10px;
        left: -10px;
        right: -10px;
        bottom: -16px;
        z-index: -1;
    }
`);

        // 创建按钮元素
        const createButton = () => {
            const container = document.createElement('div');
            container.className = `ntb-container-${domain}`;
            
            const button = document.createElement('div');
            button.className = `ntb-button-${domain}`;
            button.title = settings.isEnabled ? '已启用: 链接将在新标签页打开 (点击关闭)' : '已禁用: 点击开启新标签页功能';
            
            button.innerHTML = `
                <div class="ntb-switch-track-${domain}">
                    <div class="ntb-switch-thumb-${domain}"></div>
                </div>
                <div class="ntb-status-text-${domain}">${settings.isEnabled ? 'ON' : 'OFF'}</div>
            `;
            
            container.appendChild(button);
            
            // 设置初始位置 - 右下角
            if (settings.savedPosition) {
                container.style.left = `${settings.savedPosition.x}px`;
                container.style.top = `${settings.savedPosition.y}px`;
            } else {
                const viewportHeight = window.innerHeight;
                container.style.right = `${CONFIG.positionOffset}px`;
                container.style.bottom = `${CONFIG.positionOffset}px`;
                container.style.top = 'auto';  
            }

            return { container, button };
        };

        // 添加按钮到页面
        const { container, button } = createButton();
        document.body.appendChild(container);

        // 更新按钮状态
        const updateButtonState = () => {
            const track = button.querySelector(`.ntb-switch-track-${domain}`);
            const thumb = button.querySelector(`.ntb-switch-thumb-${domain}`);
            const statusText = button.querySelector(`.ntb-status-text-${domain}`);
            
            if (settings.isEnabled) {
                track.style.background = CONFIG.activeColor;
                thumb.style.left = '18px';
                statusText.textContent = 'ON';
                statusText.style.color = CONFIG.activeColor;
                button.title = '已启用: 链接将在新标签页打开 (点击关闭)';
            } else {
                track.style.background = '#ccc';
                thumb.style.left = '2px';
                statusText.textContent = 'OFF';
                statusText.style.color = CONFIG.inactiveColor;
                button.title = '已禁用: 点击开启新标签页功能';
            }
            
            // 悬停效果
            const updateHoverState = () => {
                track.style.background = settings.isEnabled ? CONFIG.hoverColor : '#aaa';
            };
            const resetHoverState = () => {
                track.style.background = settings.isEnabled ? CONFIG.activeColor : '#ccc';
            };
            
            button.addEventListener('mouseenter', updateHoverState);
            button.addEventListener('mouseleave', resetHoverState);
            button.addEventListener('touchstart', updateHoverState);
            button.addEventListener('touchend', resetHoverState);
        };

        // 检查是否是系统文件夹链接
        const isSystemFolderLink = (href) => {
            // 匹配Windows文件路径 (如 file:///C:/ 或 file:///D:/)
            if (/^file:\/\/\/[a-zA-Z]:\//.test(href)) return true;
            
            // 匹配Mac/Linux文件路径 (如 file:///Users/ 或 file:///home/)
            if (/^file:\/\/\/(Users|home|etc|var|opt)\//.test(href)) return true;
            
            // 匹配网络共享路径 (如 file://server/share)
            if (/^file:\/\/\/\/[^\/]+\//.test(href)) return true;
            
            return false;
        };

        // 处理链接点击
        const handleLinkClick = (event) => {
            if (!settings.isEnabled) return;
            
            const link = event.target.closest('a');
            if (!link || !link.href) return;
            
            // 排除特殊情况
            if (link.hasAttribute('download') || 
                link.href.startsWith('javascript:') || 
                link.href.startsWith('mailto:') ||
                link.href.startsWith('tel:') ||
                isSystemFolderLink(link.href)) {
                return;
            }
            
            event.preventDefault();
            event.stopPropagation();
            window.open(link.href, '_blank');
        };

        // 拖拽功能 - 支持鼠标和触摸
        let isDragging = false;
        let startX, startY, startLeft, startTop;
        let dragStartTime = 0;
        let touchTimer = null;

        const startDrag = (e) => {
            e.preventDefault();
            
            // 获取初始位置
            const clientX = e.clientX || e.touches[0].clientX;
            const clientY = e.clientY || e.touches[0].clientY;
            
            // 获取当前计算位置
            const computedStyle = window.getComputedStyle(container);
            startLeft = parseInt(computedStyle.left) || 0;
            startTop = parseInt(computedStyle.top) || 0;
            
            // 如果使用right定位，转换为left定位
            if (computedStyle.right !== 'auto') {
                const rightPos = parseInt(computedStyle.right);
                startLeft = window.innerWidth - rightPos - CONFIG.buttonSize;
                container.style.right = 'auto';
                container.style.left = `${startLeft}px`;
            }
            
            startX = clientX;
            startY = clientY;
            dragStartTime = Date.now();
            
            // 对于触摸设备，延迟判定是否为拖动
            if (e.type === 'touchstart') {
                touchTimer = setTimeout(() => {
                    isDragging = true;
                    container.style.transition = 'none';
                }, CONFIG.touchDelay);
            } else {
                isDragging = true;
            }
            
            // 添加事件监听
            document.addEventListener('mousemove', drag);
            document.addEventListener('touchmove', drag, { passive: false });
            document.addEventListener('mouseup', endDrag);
            document.addEventListener('touchend', endDrag);
        };

        const drag = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            
            const clientX = e.clientX || e.touches[0].clientX;
            const clientY = e.clientY || e.touches[0].clientY;
            
            const dx = clientX - startX;
            const dy = clientY - startY;
            
            container.style.left = `${startLeft + dx}px`;
            container.style.top = `${startTop + dy}px`;
            container.style.right = 'auto';
        };

        const endDrag = (e) => {
            if (touchTimer) {
                clearTimeout(touchTimer);
                touchTimer = null;
            }
            
            if (!isDragging) {
                if (Date.now() - dragStartTime < CONFIG.touchDelay) {
                    toggleFunctionality(e);
                }
                return;
            }
            
            isDragging = false;
            container.style.transition = '';
            
            // 移除事件监听
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('touchmove', drag);
            document.removeEventListener('mouseup', endDrag);
            document.removeEventListener('touchend', endDrag);
            
            // 保存位置
            const rect = container.getBoundingClientRect();
            GM_setValue(positionKey, {
                x: rect.left,
                y: rect.top
            });
        };

        // 切换功能状态
        const toggleFunctionality = (e) => {
            if (e) e.stopPropagation();
            
            settings.isEnabled = !settings.isEnabled;
            GM_setValue(toggleKey, settings.isEnabled);
            updateButtonState();
            
            // 添加动画效果
            const thumb = button.querySelector(`.ntb-switch-thumb-${domain}`);
            thumb.style.transform = 'scale(1.2)';
            setTimeout(() => {
                thumb.style.transform = '';
            }, 200);
        };

        // 设置事件监听
        button.addEventListener('mousedown', startDrag);
        button.addEventListener('touchstart', startDrag, { passive: false });
        
        button.addEventListener('click', (e) => {
            if (!isDragging && Date.now() - dragStartTime > CONFIG.touchDelay) {
                toggleFunctionality(e);
            }
        });
        
        document.addEventListener('click', handleLinkClick, true);

        // 注册菜单命令
        GM_registerMenuCommand('切换新标签页功能', toggleFunctionality);
        GM_registerMenuCommand('重置按钮位置', () => {
            container.style.right = `${CONFIG.positionOffset}px`;
            container.style.bottom = `${CONFIG.positionOffset}px`;
            container.style.left = 'auto';
            container.style.top = 'auto';
            GM_setValue(positionKey, null);
        });

        // 初始状态
        updateButtonState();
    };

    // 确保DOM加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();