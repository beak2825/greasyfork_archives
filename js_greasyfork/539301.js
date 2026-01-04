// ==UserScript==
// @name         鼠标滚轮速度调节器
// @name:en      Mouse Wheel Speed Controller
// @namespace    https://greasyfork.org/users/1483317
// @version      1.1.0
// @description  可调节鼠标滚轮翻页速度的修改功能，支持0.1x到5.0x速度调节，带有现代化UI界面。新增B站双列滚动适配，优化隐藏面板功能
// @description:en  Adjustable mouse wheel scrolling speed controller with modern UI, supports 0.1x to 5.0x speed adjustment. Added Bilibili dual-column scrolling support and improved panel hiding
// @author       Rabbbit
// @match        *://*/*
// @exclude      https://*.google.com/recaptcha/*
// @exclude      https://accounts.google.com/*
// @exclude      https://login.microsoftonline.com/*
// @icon         data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzAiIGZpbGw9IiM0Q0FGNTAZZ0xaZXIoMTM1ZGVnLCAjNENBRjUwLCAjMjE5NjUzKSIvPgo8cGF0aCBkPSJNMzIgMTZWNDhNMTYgMzJINDgiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjxjaXJjbGUgY3g9IjMyIiBjeT0iMzIiIHI9IjgiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @run-at       document-end
// @noframes
// @license      MIT
// @compatible   chrome 支持Chrome浏览器
// @compatible   firefox 支持Firefox浏览器
// @compatible   edge 支持Edge浏览器
// @compatible   safari 支持Safari浏览器
// @compatible   opera 支持Opera浏览器
// @downloadURL https://update.greasyfork.org/scripts/539301/%E9%BC%A0%E6%A0%87%E6%BB%9A%E8%BD%AE%E9%80%9F%E5%BA%A6%E8%B0%83%E8%8A%82%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/539301/%E9%BC%A0%E6%A0%87%E6%BB%9A%E8%BD%AE%E9%80%9F%E5%BA%A6%E8%B0%83%E8%8A%82%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 防止在iframe中运行
    if (window.top !== window.self) {
        return;
    }
    
    console.log('🖱️ 鼠标滚轮速度调节器已启动');

    // 默认配置
    let config = {
        speedMultiplier: parseFloat(GM_getValue('scrollSpeedMultiplier', '1.0')),
        isEnabled: GM_getValue('scrollSpeedEnabled', 'true') === 'true',
        panelVisible: GM_getValue('panelVisible', 'true') === 'true'
    };
    
    // 添加样式
    GM_addStyle(`
        #scroll-speed-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(30, 30, 30, 0.9));
            color: white;
            padding: 16px;
            border-radius: 12px;
            z-index: 99999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            min-width: 220px;
            user-select: none;
            border: 1px solid rgba(255, 255, 255, 0.1);
            cursor: move;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        }
        
        #scroll-speed-panel:hover {
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
            transform: translateY(-2px);
        }
        
        #scroll-speed-panel.hidden {
            display: none !important;
        }
        
        #scroll-speed-panel .title {
            margin-bottom: 12px;
            font-weight: 600;
            text-align: center;
            font-size: 16px;
            color: #fff;
        }
        
        #scroll-speed-panel .speed-display {
            margin-bottom: 10px;
            text-align: center;
            font-weight: 500;
        }
        
        #scroll-speed-panel .speed-value {
            color: #4CAF50;
            font-weight: bold;
            font-size: 16px;
        }
        
        #scroll-speed-panel .slider-container {
            margin-bottom: 12px;
            position: relative;
        }
        
        #scroll-speed-panel .slider {
            width: 100%;
            height: 6px;
            border-radius: 3px;
            background: rgba(255, 255, 255, 0.2);
            outline: none;
            cursor: pointer;
            -webkit-appearance: none;
        }
        
        #scroll-speed-panel .slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #4CAF50;
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
            transition: all 0.2s ease;
        }
        
        #scroll-speed-panel .slider::-webkit-slider-thumb:hover {
            transform: scale(1.2);
            background: #66BB6A;
        }
        
        #scroll-speed-panel .slider::-moz-range-thumb {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #4CAF50;
            cursor: pointer;
            border: none;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
        
        #scroll-speed-panel .button-row {
            display: flex;
            gap: 8px;
            margin-bottom: 12px;
        }
        
        #scroll-speed-panel .btn {
            flex: 1;
            padding: 8px 12px;
            cursor: pointer;
            border: none;
            border-radius: 6px;
            color: white;
            font-size: 12px;
            font-weight: 500;
            transition: all 0.2s ease;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        #scroll-speed-panel .btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        
        #scroll-speed-panel .btn-reset {
            background: linear-gradient(135deg, #6c757d, #5a6268);
        }
        
        #scroll-speed-panel .btn-reset:hover {
            background: linear-gradient(135deg, #5a6268, #495057);
        }
        
        #scroll-speed-panel .btn-toggle {
            background: linear-gradient(135deg, #dc3545, #c82333);
        }
        
        #scroll-speed-panel .btn-toggle.enabled {
            background: linear-gradient(135deg, #28a745, #1e7e34);
        }
        
        #scroll-speed-panel .btn-toggle:hover {
            opacity: 0.9;
        }
        
        #scroll-speed-panel .btn-hide {
            background: linear-gradient(135deg, #6f42c1, #5a2d91);
            margin-top: 4px;
            width: 100%;
        }
        
        #scroll-speed-panel .btn-hide:hover {
            background: linear-gradient(135deg, #5a2d91, #4c2a85);
        }
        
        #scroll-speed-panel .help-text {
            font-size: 11px;
            color: #ccc;
            line-height: 1.4;
            text-align: center;
            margin-bottom: 8px;
        }
        
        #scroll-speed-panel .status {
            text-align: center;
            font-size: 11px;
            padding: 4px 8px;
            border-radius: 12px;
            margin-bottom: 8px;
        }
        
        #scroll-speed-panel .status.enabled {
            background: rgba(40, 167, 69, 0.2);
            color: #28a745;
        }
        
        #scroll-speed-panel .status.disabled {
            background: rgba(220, 53, 69, 0.2);
            color: #dc3545;
        }
        
        #scroll-speed-mini {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(30, 30, 30, 0.9));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 99999;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;
        }
        
        #scroll-speed-mini:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
        }
        
        #scroll-speed-mini .icon {
            color: white;
            font-size: 18px;
        }
    `);
    
    // 创建控制面板
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'scroll-speed-panel';
        panel.className = config.panelVisible ? '' : 'hidden';
        
        panel.innerHTML = `
            <div class="title">🖱️ 滚轮速度调节</div>
            <div class="status ${config.isEnabled ? 'enabled' : 'disabled'}">
                ${config.isEnabled ? '● 已启用' : '● 已禁用'}
            </div>
            <div class="speed-display">
                速度倍数: <span class="speed-value" id="speed-value">${config.speedMultiplier.toFixed(1)}x</span>
            </div>
            <div class="slider-container">
                <input type="range" id="speed-slider" class="slider" min="0.1" max="5.0" step="0.1" value="${config.speedMultiplier}">
            </div>
            <div class="button-row">
                <button id="reset-btn" class="btn btn-reset">重置</button>
                <button id="toggle-btn" class="btn btn-toggle ${config.isEnabled ? 'enabled' : ''}">
                    ${config.isEnabled ? '关闭' : '开启'}
                </button>
            </div>
            <div class="help-text">
                拖动滑块调节速度<br>
                0.1x=很慢 | 1.0x=正常 | 5.0x=很快
            </div>
            <button id="hide-btn" class="btn btn-hide">隐藏面板</button>
        `;
        
        document.body.appendChild(panel);
        
        // 如果面板隐藏，创建迷你图标
        if (!config.panelVisible) {
            createMiniIcon();
        }
        
        return panel;
    }
    
    // 创建迷你图标
    function createMiniIcon() {
        const existing = document.getElementById('scroll-speed-mini');
        if (existing) return;
        
        const mini = document.createElement('div');
        mini.id = 'scroll-speed-mini';
        mini.innerHTML = '<div class="icon">🖱️</div>';
        
        mini.addEventListener('click', function() {
            config.panelVisible = true;
            GM_setValue('panelVisible', 'true');
            
            const panel = document.getElementById('scroll-speed-panel');
            panel.className = '';
            panel.style.display = 'block';
            
            mini.remove();
        });
        
        document.body.appendChild(mini);
    }
    
    // 绑定控制面板事件
    function bindPanelEvents() {
        const speedSlider = document.getElementById('speed-slider');
        const speedValue = document.getElementById('speed-value');
        const resetBtn = document.getElementById('reset-btn');
        const toggleBtn = document.getElementById('toggle-btn');
        const hideBtn = document.getElementById('hide-btn');
        const statusEl = document.querySelector('.status');
        
        // 更新显示
        function updateDisplay() {
            speedValue.textContent = config.speedMultiplier.toFixed(1) + 'x';
            speedSlider.value = config.speedMultiplier;
            toggleBtn.textContent = config.isEnabled ? '关闭' : '开启';
            toggleBtn.className = `btn btn-toggle ${config.isEnabled ? 'enabled' : ''}`;
            statusEl.textContent = config.isEnabled ? '● 已启用' : '● 已禁用';
            statusEl.className = `status ${config.isEnabled ? 'enabled' : 'disabled'}`;
        }
        
        // 滑块事件
        speedSlider.addEventListener('input', function() {
            config.speedMultiplier = parseFloat(this.value);
            speedValue.textContent = config.speedMultiplier.toFixed(1) + 'x';
            GM_setValue('scrollSpeedMultiplier', config.speedMultiplier.toString());
        });
        
        // 重置按钮
        resetBtn.addEventListener('click', function() {
            config.speedMultiplier = 1.0;
            updateDisplay();
            GM_setValue('scrollSpeedMultiplier', '1.0');
        });
        
        // 开关按钮
        toggleBtn.addEventListener('click', function() {
            config.isEnabled = !config.isEnabled;
            updateDisplay();
            GM_setValue('scrollSpeedEnabled', config.isEnabled.toString());
        });
        
        // 隐藏按钮
        hideBtn.addEventListener('click', function() {
            config.panelVisible = false;
            GM_setValue('panelVisible', 'false');
            
            const panel = document.getElementById('scroll-speed-panel');
            panel.className = 'hidden';
            panel.style.display = 'none';
            
            // 立即创建小图标
            createMiniIcon();
        });
    }
    
    // 使面板可拖拽
    function makeDraggable() {
        const panel = document.getElementById('scroll-speed-panel');
        let isDragging = false;
        let startX, startY, initialX, initialY;
        
        panel.addEventListener('mousedown', function(e) {
            // 避免在控件上拖拽
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') {
                return;
            }
            
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialX = panel.offsetLeft;
            initialY = panel.offsetTop;
            
            panel.style.cursor = 'grabbing';
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            
            const newX = Math.max(0, Math.min(window.innerWidth - panel.offsetWidth, initialX + dx));
            const newY = Math.max(0, Math.min(window.innerHeight - panel.offsetHeight, initialY + dy));
            
            panel.style.left = newX + 'px';
            panel.style.top = newY + 'px';
            panel.style.right = 'auto';
        });
        
        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                panel.style.cursor = 'move';
            }
        });
    }
    
    // 滚轮事件处理 - 简化版本
    function handleWheel(e) {
        // 如果功能禁用，完全不干预
        if (!config.isEnabled) {
            return;
        }
        
        // 如果速度是1.0，也不干预
        if (config.speedMultiplier === 1.0) {
            return;
        }
        
        // 只有需要调节速度时才阻止默认行为
        e.preventDefault();
        e.stopPropagation();
        
        const deltaY = e.deltaY * config.speedMultiplier;
        const deltaX = e.deltaX * config.speedMultiplier;
        
        console.log(`滚轮事件 - 原始deltaY: ${e.deltaY}, 调整后: ${deltaY}, 倍数: ${config.speedMultiplier}`);
        
        // 直接使用window.scrollBy，简单可靠
        try {
            window.scrollBy({
                left: deltaX,
                top: deltaY,
                behavior: 'auto'
            });
            console.log('✅ Window滚动成功');
        } catch (error) {
            console.error('❌ Window滚动失败:', error);
        }
    }
    
    // B站特殊滚动处理
    function handleBilibiliScroll(deltaY, deltaX) {
        // 检测当前页面类型
        const isVideoPage = window.location.pathname.includes('/video/');
        const isHomePage = window.location.pathname === '/' || window.location.pathname === '';
        
        console.log(`B站页面类型 - 视频页: ${isVideoPage}, 首页: ${isHomePage}`);
        
        if (isVideoPage) {
            // 视频页面的双列布局处理
            handleVideoPageScroll(deltaY, deltaX);
        } else if (isHomePage) {
            // 首页的双列布局处理
            handleHomePageScroll(deltaY, deltaX);
        } else {
            // 其他页面使用通用处理
            handleGeneralBilibiliScroll(deltaY, deltaX);
        }
    }
    
    // 视频页面滚动处理
    function handleVideoPageScroll(deltaY, deltaX) {
        // 视频页面可能的选择器
        const leftContainerSticky = document.querySelector('.left-container.scroll-sticky');
        const rcmdTab = document.querySelector('.rcmd-tab');
        const leftContainer = document.querySelector('.left-container, .video-container-v1, .main-container');
        const rightContainer = document.querySelector('.right-container, .rec-list, .recommend-list-v1');
        
        console.log('视频页面滚动处理 - deltaY:', deltaY);
        
        let scrolled = false;
        
        // 优先使用精确选择器
        if (leftContainerSticky && rcmdTab) {
            scrolled = handleDualColumnScroll(leftContainerSticky, rcmdTab, deltaY, '视频页面精确选择器');
        }
        // 回退到通用选择器
        else if (leftContainer && rightContainer) {
            scrolled = handleDualColumnScroll(leftContainer, rightContainer, deltaY, '视频页面通用选择器');
        }
        // 单容器处理
        else if (leftContainerSticky) {
            try {
                leftContainerSticky.scrollTop += deltaY;
                scrolled = true;
                console.log('📱 仅左侧容器滚动');
            } catch (error) {
                console.error('左侧容器滚动失败:', error);
            }
        } else if (rcmdTab) {
            try {
                rcmdTab.scrollTop += deltaY;
                scrolled = true;
                console.log('📱 仅右侧推荐滚动');
            } catch (error) {
                console.error('右侧容器滚动失败:', error);
            }
        }
        
        // 最终回退到window滚动
        if (!scrolled) {
            try {
                window.scrollBy({ left: deltaX, top: deltaY, behavior: 'auto' });
                console.log('🌍 视频页面Window滚动');
            } catch (error) {
                console.error('Window滚动失败:', error);
            }
        }
    }
    
    // 首页滚动处理
    function handleHomePageScroll(deltaY, deltaX) {
        const feedBody = document.querySelector('.bili-feed-body, .feed-body');
        const rightSidebar = document.querySelector('.palette-right-sidebar, .right-sidebar');
        
        console.log('首页滚动处理 - deltaY:', deltaY);
        
        let scrolled = false;
        
        if (feedBody) {
            try {
                feedBody.scrollTop += deltaY;
                scrolled = true;
                console.log('🏠 首页主内容区滚动');
            } catch (error) {
                console.error('首页内容区滚动失败:', error);
            }
        }
        
        if (!scrolled) {
            try {
                window.scrollBy({ left: deltaX, top: deltaY, behavior: 'auto' });
                console.log('🌍 首页Window滚动');
            } catch (error) {
                console.error('首页Window滚动失败:', error);
            }
        }
    }
    
    // 通用B站页面滚动处理
    function handleGeneralBilibiliScroll(deltaY, deltaX) {
        const mainContainer = document.querySelector('.main-container, .container, .content');
        
        console.log('通用页面滚动处理 - deltaY:', deltaY);
        
        if (mainContainer) {
            try {
                mainContainer.scrollTop += deltaY;
                console.log('📄 通用页面容器滚动');
            } catch (error) {
                console.error('通用容器滚动失败:', error);
                // 回退到window滚动
                window.scrollBy({ left: deltaX, top: deltaY, behavior: 'auto' });
                console.log('🌍 通用页面Window滚动');
            }
        } else {
            try {
                window.scrollBy({ left: deltaX, top: deltaY, behavior: 'auto' });
                console.log('🌍 通用页面Window滚动');
            } catch (error) {
                console.error('通用页面Window滚动失败:', error);
            }
        }
    }
    
    // 双列滚动处理逻辑
    function handleDualColumnScroll(leftContainer, rightContainer, deltaY, source) {
        try {
            // 获取右侧滚动状态
            const rightScrollTop = rightContainer.scrollTop;
            const rightScrollHeight = rightContainer.scrollHeight;
            const rightClientHeight = rightContainer.clientHeight;
            const rightAtBottom = rightScrollTop + rightClientHeight >= rightScrollHeight - 20;
            
            console.log(`${source} - 右侧滚动状态: 位置${rightScrollTop}/${rightScrollHeight}, 到底:${rightAtBottom}`);
            
            if (!rightAtBottom) {
                // 双列同步滚动
                leftContainer.scrollTop += deltaY;
                rightContainer.scrollTop += deltaY;
                console.log(`🔄 ${source} - 双列同步滚动`);
            } else {
                // 仅左侧滚动
                leftContainer.scrollTop += deltaY;
                console.log(`⬇️ ${source} - 仅左侧滚动 (右侧已到底)`);
            }
            return true;
        } catch (error) {
            console.error(`${source} - 双列滚动失败:`, error);
            return false;
        }
    }
    
    // 注册菜单命令
    function registerMenuCommands() {
        GM_registerMenuCommand('显示/隐藏控制面板', function() {
            config.panelVisible = !config.panelVisible;
            GM_setValue('panelVisible', config.panelVisible.toString());
            
            const panel = document.getElementById('scroll-speed-panel');
            const mini = document.getElementById('scroll-speed-mini');
            
            if (config.panelVisible) {
                // 显示面板
                panel.className = '';
                panel.style.display = 'block';
                if (mini) mini.remove();
            } else {
                // 隐藏面板，显示小图标
                panel.className = 'hidden';
                panel.style.display = 'none';
                createMiniIcon();
            }
        });
        
        GM_registerMenuCommand('重置所有设置', function() {
            if (confirm('确定要重置所有设置吗？')) {
                config.speedMultiplier = 1.0;
                config.isEnabled = true;
                config.panelVisible = true;
                
                GM_setValue('scrollSpeedMultiplier', '1.0');
                GM_setValue('scrollSpeedEnabled', 'true');
                GM_setValue('panelVisible', 'true');
                
                location.reload();
            }
        });
    }
    
    // 初始化
    function init() {
        try {
            // 等待页面加载
            if (!document.body) {
                setTimeout(init, 100);
                return;
            }
            
            // 创建控制面板
            createControlPanel();
            
            // 绑定事件
            bindPanelEvents();
            makeDraggable();
            registerMenuCommands();
            
            // 添加滚轮事件监听 - 使用更兼容的方式
            document.addEventListener('wheel', handleWheel, {
                passive: false
            });
            
            // 备用事件监听（某些情况下wheel事件可能不生效）
            document.addEventListener('mousewheel', function(e) {
                console.log('mousewheel事件触发 - 作为备用');
                handleWheel(e);
            }, { passive: false });
            
            console.log('滚轮事件监听器已添加');
            
            console.log('鼠标滚轮速度调节器初始化完成！当前设置:', config);
            
            // B站特殊处理日志
            if (window.location.hostname.includes('bilibili.com')) {
                const isVideoPage = window.location.pathname.includes('/video/');
                const isHomePage = window.location.pathname === '/' || window.location.pathname === '';
                
                console.log('🎯 检测到B站页面，启用智能滚动处理');
                console.log(`📱 页面类型: ${isVideoPage ? '视频页面' : isHomePage ? '首页' : '其他页面'}`);
                
                // 延迟检测页面结构，确保页面完全加载
                setTimeout(() => {
                    if (isVideoPage) {
                        console.log('🎬 视频页面结构检测:');
                        const leftContainerSticky = document.querySelector('.left-container.scroll-sticky');
                        const rcmdTab = document.querySelector('.rcmd-tab');
                        const leftContainer = document.querySelector('.left-container, .video-container-v1, .main-container');
                        const rightContainer = document.querySelector('.right-container, .rec-list, .recommend-list-v1');
                        
                        console.log('- left-container.scroll-sticky:', leftContainerSticky ? '✅ 找到' : '❌ 未找到');
                        console.log('- .rcmd-tab:', rcmdTab ? '✅ 找到' : '❌ 未找到');
                        console.log('- 通用左侧容器:', leftContainer ? '✅ 找到' : '❌ 未找到');
                        console.log('- 通用右侧容器:', rightContainer ? '✅ 找到' : '❌ 未找到');
                        
                        if (rcmdTab) {
                            console.log('📊 右侧推荐栏详细信息:');
                            console.log('  - 总高度:', rcmdTab.scrollHeight + 'px');
                            console.log('  - 可见高度:', rcmdTab.clientHeight + 'px');
                            console.log('  - 当前位置:', rcmdTab.scrollTop + 'px');
                        }
                        
                    } else if (isHomePage) {
                        console.log('🏠 首页结构检测:');
                        const feedBody = document.querySelector('.bili-feed-body, .feed-body');
                        const rightSidebar = document.querySelector('.palette-right-sidebar, .right-sidebar');
                        
                        console.log('- 主内容区:', feedBody ? '✅ 找到' : '❌ 未找到');
                        console.log('- 右侧栏:', rightSidebar ? '✅ 找到' : '❌ 未找到');
                    }
                    
                    console.log('💡 现在可以测试滚动效果了！调节速度后尝试滚动页面');
                }, 2000);
            }
            
            // 显示欢迎通知（仅首次安装）
            if (GM_getValue('firstInstall', 'true') === 'true') {
                GM_setValue('firstInstall', 'false');
                setTimeout(() => {
                    GM_notification({
                        title: '🖱️ 滚轮速度调节器',
                        text: '安装成功！可在右上角看到控制面板',
                        timeout: 3000
                    });
                }, 1000);
            }
            
        } catch (error) {
            console.error('滚轮速度调节器初始化失败:', error);
        }
    }
    
    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();