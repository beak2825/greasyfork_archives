// ==UserScript==
// @name         YouTube视频统计信息弹窗
// @namespace    http://tampermonkey.net/
// @version      2.7.1
// @description  提取YouTube视频数据(赞数、观看次数、发布日期)，显示在可拖拽的半透明弹窗中，支持位置记录、侧边收起、全屏隐藏和数字格式化
// @author       生财:一万
// @license      MIT
// @match        *://*.youtube.com/**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540402/YouTube%E8%A7%86%E9%A2%91%E7%BB%9F%E8%AE%A1%E4%BF%A1%E6%81%AF%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/540402/YouTube%E8%A7%86%E9%A2%91%E7%BB%9F%E8%AE%A1%E4%BF%A1%E6%81%AF%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 调试开关 - 设置为false可关闭所有console输出
    const DEBUG_MODE = false;
    
    // 调试输出封装函数
    function debugLog(...args) {
        if (DEBUG_MODE) {
            console.log(...args);
        }
    }
    
    function debugError(...args) {
        if (DEBUG_MODE) {
            console.error(...args);
        }
    }

    let statsPopup = null;
    let miniTab = null;
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let isCollapsed = false;
    let isFullscreen = false;
    let wasHiddenForFullscreen = false;
    let fullscreenPreviousState = null;
    let isIconOnRight = true; // 图标位置状态
    
    // 位置和状态记录相关变量
    const POSITION_STORAGE_KEY = 'yt-stats-popup-position';
    const COLLAPSE_STATE_KEY = 'yt-stats-popup-collapsed';
    const ICON_POSITION_KEY = 'yt-stats-icon-position';
    let savedPosition = null;
    
    // 保存弹窗位置到localStorage
    function savePopupPosition(x, y) {
        const position = { x: x, y: y };
        try {
            localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(position));
        } catch (error) {
            debugError('YouTube Stats: 位置保存失败:', error);
        }
    }
    
    // 保存收起状态到localStorage
    function saveCollapseState(collapsed) {
        try {
            localStorage.setItem(COLLAPSE_STATE_KEY, collapsed.toString());
        } catch (error) {
            debugError('YouTube Stats: 收起状态保存失败:', error);
        }
    }
    
    // 保存图标位置状态到localStorage
    function saveIconPosition(isRight, top) {
        try {
            const iconState = { isRight: isRight, top: top };
            localStorage.setItem(ICON_POSITION_KEY, JSON.stringify(iconState));
        } catch (error) {
            debugError('YouTube Stats: 图标位置保存失败:', error);
        }
    }
    
    // 从localStorage加载弹窗位置
    function loadPopupPosition() {
        try {
            const positionStr = localStorage.getItem(POSITION_STORAGE_KEY);
            if (positionStr) {
                savedPosition = JSON.parse(positionStr);
                return savedPosition;
            }
        } catch (error) {
            debugError('YouTube Stats: 位置加载失败:', error);
        }
        
        // 返回默认位置
        return { x: window.innerWidth - 300, y: 100 };
    }

    // 从localStorage加载收起状态
    function loadCollapseState() {
        try {
            const collapsed = localStorage.getItem(COLLAPSE_STATE_KEY);
            return collapsed === 'true';
        } catch (error) {
            debugError('YouTube Stats: 收起状态加载失败:', error);
        }
        return false;
    }
    
    // 从localStorage加载图标位置状态
    function loadIconPosition() {
        try {
            const iconStateStr = localStorage.getItem(ICON_POSITION_KEY);
            if (iconStateStr) {
                const iconState = JSON.parse(iconStateStr);
                return iconState;
            }
        } catch (error) {
            debugError('YouTube Stats: 图标位置加载失败:', error);
        }
        // 返回默认位置（右侧，顶部100px）
        return { isRight: true, top: 100 };
    }

    // 检测全屏状态
    function isInFullscreen() {
        return !!(document.fullscreenElement || 
                  document.webkitFullscreenElement || 
                  document.mozFullScreenElement || 
                  document.msFullscreenElement);
    }

    // 处理全屏状态变化
    function handleFullscreenChange() {
        const currentFullscreen = isInFullscreen();
        
        if (currentFullscreen && !isFullscreen) {
            // 进入全屏
            isFullscreen = true;
            if (statsPopup) {
                // 记录当前状态
                fullscreenPreviousState = {
                    collapsed: isCollapsed,
                    visible: statsPopup.style.display !== 'none'
                };
                
                // 隐藏弹窗和侧边图标
                statsPopup.style.display = 'none';
                if (miniTab) {
                    miniTab.style.display = 'none';
                }
                wasHiddenForFullscreen = true;
                debugLog('YouTube Stats: 全屏模式，已隐藏弹窗和侧边图标');
            }
        } else if (!currentFullscreen && isFullscreen) {
            // 退出全屏
            isFullscreen = false;
            if (wasHiddenForFullscreen && fullscreenPreviousState) {
                // 恢复之前的状态
                if (statsPopup && fullscreenPreviousState.visible) {
                    statsPopup.style.display = '';
                }
                
                if (fullscreenPreviousState.collapsed && miniTab) {
                    miniTab.style.display = 'flex';
                }
                
                wasHiddenForFullscreen = false;
                fullscreenPreviousState = null;
                debugLog('YouTube Stats: 退出全屏，已恢复弹窗和侧边图标');
            }
        }
    }

    // 数字格式化函数 - 转换为中文易读格式
    function formatNumber(numStr) {
        if (!numStr || numStr === '未找到' || numStr === '无') return numStr;
        
        // 移除非数字字符，只保留数字
        const cleanNum = numStr.replace(/[^\d]/g, '');
        if (!cleanNum) return numStr;
        
        const num = parseInt(cleanNum);
        if (isNaN(num)) return numStr;
        
        // 转换为中文数字格式
        if (num >= 100000000) {
            // 亿及以上
            const yi = (num / 100000000).toFixed(1);
            return yi.endsWith('.0') ? yi.slice(0, -2) + '亿' : yi + '亿';
        } else if (num >= 10000) {
            // 万及以上
            const wan = (num / 10000).toFixed(1);
            return wan.endsWith('.0') ? wan.slice(0, -2) + '万' : wan + '万';
        } else {
            // 小于万的直接显示
            return num.toString();
        }
    }

    // 日期格式化函数 - 转换为年月日顺序
    function formatDate(value, label) {
        // 情况1: 标签包含"年" (例如: 值="6月14日" 标签="2025年")
        if (label.includes('年')) {
            if (value.includes('月') || value.includes('日')) {
                // 年份在标签中，月日在值中 -> "2025年6月14日"
                return label + value;
            } else {
                // 值可能是年份数字 -> "2025年"
                return value + label;
            }
        }
        
        // 情况2: 值包含年份，标签包含月日 (例如: 值="2025" 标签="年6月14日")  
        else if (value.match(/^\d{4}$/) && (label.includes('月') || label.includes('日'))) {
            return value + '年' + label.replace('年', '');
        }
        
        // 情况3: 默认直接组合
        else {
            return value + label;
        }
    }

    // 创建弹窗样式
    function createPopupStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .yt-stats-popup {
                position: fixed;
                width: 280px;
                background: rgba(128, 128, 128, 0.3);
                color: white;
                border-radius: 8px;
                padding: 15px;
                font-family: 'Roboto', Arial, sans-serif;
                font-size: 14px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                z-index: 10000;
                border: 1px solid rgba(200, 200, 200, 0.3);
                user-select: none;
                cursor: move;
                backdrop-filter: blur(5px);
                transition: transform 0.3s ease-in-out;
            }
            

            
            .yt-stats-popup-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
                padding-bottom: 8px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .yt-stats-popup-title {
                font-weight: bold;
                font-size: 16px;
                color: #ff6b6b;
            }
            
            .yt-stats-collapse-btn {
                background: none;
                border: none;
                color: #fff;
                font-size: 18px;
                cursor: pointer;
                padding: 2px 6px;
                border-radius: 4px;
                opacity: 0.7;
                transition: opacity 0.2s;
            }
            
            .yt-stats-collapse-btn:hover {
                opacity: 1;
                background: rgba(255, 255, 255, 0.1);
            }
            
            .yt-stats-mini-tab {
                display: none;
            }
            
            .yt-stats-side-icon {
                position: fixed;
                width: 30px;
                height: 30px;
                background: rgba(128, 128, 128, 0.9);
                color: white;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 18px;
                cursor: move;
                z-index: 10000;
                backdrop-filter: blur(5px);
                transition: all 0.3s ease-in-out;
                user-select: none;
                border: 1px solid rgba(200, 200, 200, 0.3);
            }
            
            .yt-stats-side-icon.right {
                right: 0;
                border-radius: 8px 0 0 8px;
                border-right: none;
            }
            
            .yt-stats-side-icon.left {
                left: 0;
                border-radius: 0 8px 8px 0;
                border-left: none;
            }
            
            .yt-stats-side-icon:hover {
                width: 35px;
                background: rgba(128, 128, 128, 0.95);
            }
            
            .yt-stats-mini-tab .mini-icon {
                font-size: 16px;
                margin-bottom: 2px;
            }

            .yt-stats-item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
                padding: 6px 0;
            }
            
            .yt-stats-label {
                color: #ccc;
                font-weight: 500;
            }
            
            .yt-stats-value {
                color: #4fc3f7;
                font-weight: bold;
            }
            
            .yt-stats-popup.dragging {
                transition: none;
            }
        `;
        document.head.appendChild(style);
    }

    // 提取统计数据 - 支持普通视频和Shorts
    function extractVideoStats() {
        const stats = {
            likes: '未找到',
            views: '未找到', 
            date: '未找到'
        };

        // 优先检查factoids容器（无论什么页面类型）
        const factoidsContainer = document.getElementById('factoids');
        if (factoidsContainer) {
            extractRegularVideoStats(stats);
        } else {
            // 如果没有factoids，可能是广告页面，显示"无"
            stats.likes = '无';
            stats.views = '无';
            stats.date = '无';
        }

        return stats;
    }

    // 收起弹窗
    function collapsePopup() {
        if (!statsPopup || isCollapsed) return;
        
        isCollapsed = true;
        // 隐藏弹窗
        statsPopup.style.display = 'none';
        
        // 创建侧边图标
        createMiniTab();
        
        // 保存收起状态
        saveCollapseState(true);
        
        debugLog('YouTube Stats: 弹窗已收起');
    }

    // 展开弹窗
    function expandPopup() {
        if (!statsPopup || !isCollapsed) return;
        
        isCollapsed = false;
        // 显示弹窗
        statsPopup.style.display = '';
        
        // 移除侧边图标
        if (miniTab) {
            miniTab.remove();
            miniTab = null;
        }
        
        // 保存展开状态
        saveCollapseState(false);
        
        debugLog('YouTube Stats: 弹窗已展开');
    }

    // 切换收起状态
    function toggleCollapseState() {
        if (isCollapsed) {
            expandPopup();
        } else {
            collapsePopup();
        }
    }

    // 创建侧边图标
    function createMiniTab() {
        if (miniTab) {
            miniTab.remove();
        }
        
        // 加载保存的图标位置状态
        const iconState = loadIconPosition();
        isIconOnRight = iconState.isRight;
        
        const icon = document.createElement('div');
        icon.className = isIconOnRight ? 'yt-stats-side-icon right' : 'yt-stats-side-icon left';
        
        // 使用保存的位置
        icon.style.top = iconState.top + 'px';
        icon.style.display = 'flex';
        
        // 只显示图标
        icon.textContent = '📊';
        icon.title = '拖拽移动 | 点击展开';
        
        // 添加拖拽和点击事件
        let isDraggingIcon = false;
        let dragStartX = 0;
        let dragStartY = 0;
        
        icon.addEventListener('mousedown', (e) => {
            isDraggingIcon = false;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            
            const handleMouseMove = (e) => {
                if (!isDraggingIcon && (Math.abs(e.clientX - dragStartX) > 5 || Math.abs(e.clientY - dragStartY) > 5)) {
                    isDraggingIcon = true;
                    // 拖拽时移除定位类，使用绝对定位
                    icon.className = 'yt-stats-side-icon';
                    icon.style.transition = 'none';
                }
                
                if (isDraggingIcon) {
                    // 图标跟随鼠标移动
                    const x = e.clientX - 15; // 居中偏移
                    const y = e.clientY - 15; // 居中偏移
                    
                    // 限制在屏幕范围内
                    const maxX = window.innerWidth - 30;
                    const maxY = window.innerHeight - 30;
                    
                    icon.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
                    icon.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
                    icon.style.right = 'auto';
                }
            };
            
            const handleMouseUp = (e) => {
                if (!isDraggingIcon) {
                    // 单击事件
                    expandPopup();
                } else {
                    // 拖拽结束，判断贴靠位置
                    const screenWidth = window.innerWidth;
                    const iconCenterX = e.clientX;
                    
                    // 恢复过渡动画
                    icon.style.transition = 'all 0.3s ease-in-out';
                    
                                         if (iconCenterX < screenWidth / 2) {
                         // 贴靠左侧
                         isIconOnRight = false;
                         icon.className = 'yt-stats-side-icon left';
                         icon.style.left = '0';
                         icon.style.right = 'auto';
                     } else {
                         // 贴靠右侧
                         isIconOnRight = true;
                         icon.className = 'yt-stats-side-icon right';
                         icon.style.right = '0';
                         icon.style.left = 'auto';
                     }
                     
                     // 保存图标位置状态
                     const currentTop = parseInt(icon.style.top) || 0;
                     saveIconPosition(isIconOnRight, currentTop);
                }
                
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            e.preventDefault();
        });
        
        document.body.appendChild(icon);
        miniTab = icon;
    }

    // 提取普通视频页面统计数据
    function extractRegularVideoStats(stats) {
        const factoidsContainer = document.getElementById('factoids');
        if (!factoidsContainer) {
            return;
        }

        debugLog('YouTube Stats: 开始实时提取factoids数据...');

        // 重新查询确保数据最新
        const freshFactoids = document.getElementById('factoids');
        if (!freshFactoids) {
            debugLog('YouTube Stats: factoids容器消失');
            return;
        }

        // 提取观看次数（view-count-factoid-renderer）
        const viewCountRenderer = freshFactoids.querySelector('view-count-factoid-renderer');
        if (viewCountRenderer) {
            const viewValue = viewCountRenderer.querySelector('.ytwFactoidRendererValue');
            if (viewValue && viewValue.textContent.trim()) {
                stats.views = viewValue.textContent.trim();
                debugLog('YouTube Stats: 实时观看次数:', stats.views);
            }
        }

        // 提取赞数和日期（factoid-renderer元素）
        const factoidRenderers = freshFactoids.querySelectorAll('factoid-renderer');
        debugLog(`YouTube Stats: 找到${factoidRenderers.length}个factoid元素`);
        
        factoidRenderers.forEach((renderer, index) => {
            const label = renderer.querySelector('.ytwFactoidRendererLabel');
            const value = renderer.querySelector('.ytwFactoidRendererValue');
            
            if (label && value) {
                const labelText = label.textContent.trim();
                const valueText = value.textContent.trim();
                
                debugLog(`YouTube Stats: 元素${index} - 标签:"${labelText}", 值:"${valueText}"`);
                
                if (labelText.includes('赞') || labelText.includes('点赞')) {
                    stats.likes = valueText;
                    debugLog('YouTube Stats: 实时赞数:', stats.likes);
                } else if (labelText.includes('年') || labelText.includes('月') || labelText.includes('日')) {
                    // 格式化日期为年月日顺序
                    const fullDate = formatDate(valueText, labelText);
                    stats.date = fullDate;
                    debugLog('YouTube Stats: 实时日期:', stats.date);
                } else if (labelText.includes('前')) {
                    // 相对时间，如"1天前"
                    stats.date = valueText + labelText;
                    debugLog('YouTube Stats: 实时相对时间:', stats.date);
                }
            }
        });

        // 如果还没找到观看次数，尝试其他选择器
        if (stats.views === '未找到') {
            debugLog('YouTube Stats: 尝试备用观看次数提取...');
            const alternativeViewSelectors = [
                '#factoids .ytwFactoidRendererValue',
                '#factoids span[class*="view"]',
                '#factoids span[aria-label*="观看"]'
            ];
            
            for (const selector of alternativeViewSelectors) {
                const elements = freshFactoids.querySelectorAll(selector);
                for (const el of elements) {
                    const text = el.textContent.trim();
                    // 检查是否包含数字且可能是观看次数
                    if (text && /^\d[\d,]*$/.test(text) && !text.includes('年') && !text.includes('月')) {
                        stats.views = text;
                        debugLog('YouTube Stats: 备用方法找到观看次数:', stats.views);
                        break;
                    }
                }
                if (stats.views !== '未找到') break;
            }
        }

        debugLog('YouTube Stats: 最终提取结果:', stats);
    }



    // 创建弹窗 - 使用安全的DOM操作
    function createStatsPopup(stats) {
        if (statsPopup) {
            statsPopup.remove();
        }

        // 创建主容器
        const popup = document.createElement('div');
        popup.className = 'yt-stats-popup';

        // 创建头部
        const header = document.createElement('div');
        header.className = 'yt-stats-popup-header';
        
        const title = document.createElement('div');
        title.className = 'yt-stats-popup-title';
        title.textContent = '📊 视频统计';
        
        // 创建收起按钮
        const collapseBtn = document.createElement('button');
        collapseBtn.className = 'yt-stats-collapse-btn';
        collapseBtn.textContent = '收起';
        collapseBtn.title = '收起到侧边';
        collapseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            collapsePopup();
        });
        
        header.appendChild(title);
        header.appendChild(collapseBtn);

        // 创建数据项
        function createStatsItem(icon, label, value) {
            const item = document.createElement('div');
            item.className = 'yt-stats-item';
            
            const labelSpan = document.createElement('span');
            labelSpan.className = 'yt-stats-label';
            labelSpan.textContent = `${icon} ${label}:`;
            
            const valueSpan = document.createElement('span');
            valueSpan.className = 'yt-stats-value';
            valueSpan.textContent = value;
            
            item.appendChild(labelSpan);
            item.appendChild(valueSpan);
            return item;
        }

        // 添加统计项（只对观看次数格式化）
        const likesItem = createStatsItem('👍', '赞数', stats.likes);
        const viewsItem = createStatsItem('👀', '观看', formatNumber(stats.views));
        const dateItem = createStatsItem('📅', '发布', stats.date);

        // 组装弹窗
        popup.appendChild(header);
        popup.appendChild(likesItem);
        popup.appendChild(viewsItem);
        popup.appendChild(dateItem);

        // 设置弹窗位置
        const position = loadPopupPosition();
        popup.style.left = position.x + 'px';
        popup.style.top = position.y + 'px';
        popup.style.right = 'auto'; // 取消right定位，使用left定位

        // 添加拖拽功能
        popup.addEventListener('mousedown', startDrag);

        document.body.appendChild(popup);
        statsPopup = popup;
        
        // 恢复收起状态
        const savedCollapsed = loadCollapseState();
        if (savedCollapsed) {
            // 延迟执行收起，确保弹窗完全创建
            setTimeout(() => {
                collapsePopup();
            }, 100);
        }
        
        return popup;
    }

    // 开始拖拽
    function startDrag(e) {
        isDragging = true;
        statsPopup.classList.add('dragging');
        
        const rect = statsPopup.getBoundingClientRect();
        dragOffsetX = e.clientX - rect.left;
        dragOffsetY = e.clientY - rect.top;
        
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
        e.preventDefault();
    }

    // 拖拽过程
    function drag(e) {
        if (!isDragging || !statsPopup) return;
        
        const x = e.clientX - dragOffsetX;
        const y = e.clientY - dragOffsetY;
        
        // 限制拖拽范围
        const maxX = window.innerWidth - statsPopup.offsetWidth;
        const maxY = window.innerHeight - statsPopup.offsetHeight;
        
        const finalX = Math.max(0, Math.min(x, maxX));
        const finalY = Math.max(0, Math.min(y, maxY));
        
        statsPopup.style.left = finalX + 'px';
        statsPopup.style.top = finalY + 'px';
        statsPopup.style.right = 'auto';
    }

    // 停止拖拽
    function stopDrag() {
        isDragging = false;
        if (statsPopup) {
            statsPopup.classList.remove('dragging');
            
            // 保存当前位置
            const rect = statsPopup.getBoundingClientRect();
            savePopupPosition(rect.left, rect.top);
        }
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);
    }

    // 清空弹窗数据
    function clearPopupData() {
        if (statsPopup) {
            const items = statsPopup.querySelectorAll('.yt-stats-value');
            if (items.length >= 3) {
                items[0].textContent = '加载中...';
                items[1].textContent = '加载中...';
                items[2].textContent = '加载中...';
            }
        }
    }

    // 清理所有弹窗元素
    function cleanupPopup() {
        if (statsPopup) {
            statsPopup.remove();
            statsPopup = null;
        }
        if (miniTab) {
            miniTab.remove();
            miniTab = null;
        }
        isCollapsed = false;
    }

    // 更新统计信息
    function updateStats() {
        try {
            const stats = extractVideoStats();
            
            if (stats) {
                if (statsPopup) {
                    // 更新现有弹窗内容（只对观看次数格式化）
                    const items = statsPopup.querySelectorAll('.yt-stats-value');
                    if (items.length >= 3) {
                        items[0].textContent = stats.likes || '未找到';
                        items[1].textContent = formatNumber(stats.views || '未找到');
                        items[2].textContent = stats.date || '未找到';
                    }
                } else {
                    // 创建新弹窗
                    createStatsPopup(stats);
                    debugLog('YouTube Stats: 统计弹窗已显示');
                }
            }
        } catch (error) {
            debugError('YouTube Stats: 更新统计信息时出错:', error);
        }
    }

    // 初始化脚本
    function init() {
        createPopupStyles();
        
        // 延迟执行，等待页面完全加载
        setTimeout(() => {
            updateStats();
        }, 500);

        // 监听页面变化（YouTube是单页应用）
        let lastUrl = location.href;
        let factoidsObserver = null;
        
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                
                // 切换视频时清理弹窗
                cleanupPopup();
                
                // 断开之前的factoids监听器
                if (factoidsObserver) {
                    factoidsObserver.disconnect();
                }
                
                // 延迟执行，等待新页面内容加载
                setTimeout(() => {
                    updateStats();
                    // 重新建立factoids监听
                    setupFactoidsObserver();
                }, 800);
            }
        }).observe(document, {subtree: true, childList: true});

        // 设置factoids变化监听器的函数
        function setupFactoidsObserver() {
            factoidsObserver = new MutationObserver(() => {
                if (location.href.includes('/watch?') || location.href.includes('/shorts/')) {
                    debugLog('YouTube Stats: 检测到factoids变化，立即更新...');
                    setTimeout(() => updateStats(), 100);
                }
            });
            
            const checkFactoids = () => {
                const factoids = document.getElementById('factoids');
                if (factoids) {
                    factoidsObserver.observe(factoids, {
                        childList: true,
                        subtree: true,
                        characterData: true
                    });
                    debugLog('YouTube Stats: 开始监听factoids实时变化');
                } else {
                    setTimeout(checkFactoids, 500);
                }
            };
            checkFactoids();
        }

        // 高频实时更新统计信息
        setInterval(() => {
            if (location.href.includes('/watch?') || location.href.includes('/shorts/')) {
                updateStats();
            }
        }, 1000);

        // 初始化factoids监听
        setupFactoidsObserver();

        // 监听全屏状态变化
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('msfullscreenchange', handleFullscreenChange);
        
        debugLog('YouTube Stats: 全屏监听已启动');
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})(); 