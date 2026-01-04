// ==UserScript==
// @name         谷歌必应哔哩哔哩搜索引擎快速切换【自用】
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  在谷歌google、必应bing（包含cn版）、哔哩哔哩Bilibili搜索结果页添加可拖动、可锁定、可切换横向/竖向布局、可自定义按钮顺序的搜索工具栏。让AI写的自用脚本。
// @author       Users & AI Assistant
// @match        https://www.google.com/search*
// @match        https://www.bing.com/search*
// @match        https://cn.bing.com/search*
// @match        https://search.bilibili.com/all*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539113/%E8%B0%B7%E6%AD%8C%E5%BF%85%E5%BA%94%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%BF%AB%E9%80%9F%E5%88%87%E6%8D%A2%E3%80%90%E8%87%AA%E7%94%A8%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/539113/%E8%B0%B7%E6%AD%8C%E5%BF%85%E5%BA%94%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%BF%AB%E9%80%9F%E5%88%87%E6%8D%A2%E3%80%90%E8%87%AA%E7%94%A8%E3%80%91.meta.js
// ==/UserScript==

    /* jshint esversion: 8 */
(function() {
    'use strict';

    // =================================================================================
    // --- 1. 全局配置 (Global Configuration) ---
    // =================================================================================

    // 在此数组中添加或修改搜索引擎
    const engines = [
        { name: 'Google', url: 'https://www.google.com/search?q=' },
        { name: 'Bing', url: 'https://www.bing.com/search?q=' },
        { name: 'Bilibili', url: 'https://search.bilibili.com/all?keyword=' }
    ];
    // 将引擎数组转换为Map，方便通过名称快速查找
    const engineMap = new Map(engines.map(e => [e.name, e]));

    // 用于在油猴脚本管理器中存储设置的键名
    const LAYOUT_KEY = 'switcher_layout_v4'; // 存储布局模式 ('horizontal' / 'vertical')
    const ORDER_KEY = 'switcher_engine_order_v4'; // 存储引擎按钮的顺序
    const POSITIONING_KEY = 'switcher_positioning_v5';// 存储定位模式 ('fixed' / 'absolute')

    // =================================================================================
    // --- 2. 注册油猴菜单命令 (Register Tampermonkey Menu Commands) ---
    // --- 此部分代码负责在油猴扩展的弹出菜单中创建设置选项 ---
    // =================================================================================
    (async () => {
        // --- 菜单项1: 切换布局 ---
        const currentLayout = await GM_getValue(LAYOUT_KEY, 'horizontal');
        GM_registerMenuCommand(`[切换布局] 当前为: ${currentLayout === 'horizontal' ? '横向' : '竖向'}`, async () => {
            await GM_setValue(LAYOUT_KEY, currentLayout === 'horizontal' ? 'vertical' : 'horizontal');
            alert('布局模式已更改，请刷新页面以应用。');
        });

        // --- 菜单项2: 自定义引擎顺序 ---
        GM_registerMenuCommand('[自定义] 引擎顺序', async () => {
            const defaultOrder = engines.map(e => e.name).join(',');
            const currentOrder = await GM_getValue(ORDER_KEY, defaultOrder);
            const newOrderStr = prompt('请输入新的引擎顺序，用英文逗号 (,) 分隔。\n\n可用引擎: ' + defaultOrder, currentOrder);

            if (newOrderStr === null) return; // 用户点击了取消

            // 验证用户输入的合法性
            const newOrderArray = newOrderStr.split(',').map(s => s.trim());
            const newOrderSet = new Set(newOrderArray);
            const defaultNameSet = new Set(engines.map(e => e.name));
            if (newOrderSet.size !== defaultNameSet.size || ![...newOrderSet].every(name => defaultNameSet.has(name))) {
                alert('输入错误！请确保所有引擎都已包含且名称正确。\n\n可用引擎: ' + defaultOrder);
                return;
            }
            await GM_setValue(ORDER_KEY, newOrderStr);
            alert('引擎顺序已更新，请刷新页面以应用。');
        });

        // --- 菜单项3: 切换定位模式 ---
        const currentPositioning = await GM_getValue(POSITIONING_KEY, 'fixed');
        GM_registerMenuCommand(`[切换定位] 当前为: ${currentPositioning === 'fixed' ? '固定屏幕' : '跟随页面'}`, async () => {
            await GM_setValue(POSITIONING_KEY, currentPositioning === 'fixed' ? 'absolute' : 'fixed');
            alert('定位模式已更改，请刷新页面以应用。');
        });
    })();


    // =================================================================================
    // --- 3. 动态样式生成 (Dynamic Style Generation) ---
    // =================================================================================
    /**
     * 根据用户选择的布局和定位模式，生成对应的CSS样式字符串。
     * @param {string} layout - 'horizontal' 或 'vertical'
     * @param {string} positioning - 'fixed' 或 'absolute'
     * @returns {string} CSS样式字符串
     */
    function getStyles(layout, positioning) {
        return `
            #search-switcher-container {
                position: ${positioning}; /* 'fixed': 固定在屏幕, 'absolute': 跟随页面滚动 */
                width: auto;
                background-color: rgba(245, 245, 247, 0.85);
                backdrop-filter: blur(12px) saturate(1.2);
                border: 1px solid rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                z-index: 9999;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                display: flex;
                flex-direction: ${layout === 'vertical' ? 'column' : 'row'}; /* 决定主容器是垂直还是水平 */
            }
            #search-switcher-header {
                padding: 8px 6px;
                cursor: move;
                background-color: rgba(0, 0, 0, 0.05);
                display: flex;
                align-items: center;
                justify-content: ${layout === 'vertical' ? 'flex-start' : 'center'}; /* 竖向时内容居左, 横向时居中 */
                user-select: none;
                border-bottom: ${layout === 'vertical' ? '1px solid rgba(0, 0, 0, 0.1)' : 'none'};
                border-right: ${layout === 'horizontal' ? '1px solid rgba(0, 0, 0, 0.1)' : 'none'};
                border-radius: ${layout === 'vertical' ? '8px 8px 0 0' : '8px 0 0 8px'};
                font-size: 14px;
                color: #555;
            }
            #search-switcher-body {
                padding: 8px;
                display: flex;
                gap: 6px;
                align-items: center;
                flex-direction: ${layout === 'vertical' ? 'column' : 'row'}; /* 按钮区域也同步方向 */
                align-items: ${layout === 'vertical' ? 'stretch' : 'center'}; /* 竖向时按钮拉伸宽度 */
            }
            .search-switcher-btn {
                padding: 5px 12px;
                font-size: 12px;
                border: 1px solid rgba(0, 0, 0, 0.1);
                border-radius: 5px;
                background-color: rgba(255, 255, 255, 0.7);
                color: #333;
                text-align: center;
                white-space: nowrap;
                transition: all 0.2s;
            }
            .search-switcher-btn:not(.search-switcher-btn-active) { cursor: pointer; }
            .search-switcher-btn:not(.search-switcher-btn-active):hover { background-color: rgba(255, 255, 255, 1); border-color: rgba(0, 0, 0, 0.15); }
            .search-switcher-btn-active { background-color: #e8f0fe; color: #5f6368; border-color: #d2e3fc; cursor: default; }
            #lock-button {
                cursor: pointer; font-size: 14px; border: none; background: none; padding: 0 4px;
                line-height: 1; color: #555;
            }
            #lock-button:hover { color: #000; }
        `;
    }

    /**
     * 从当前页面的URL中提取搜索关键词。
     * @returns {string} 搜索关键词，如果找不到则返回空字符串。
     */
    function getQueryParam() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('q') || urlParams.get('keyword') || '';
    }

    // =================================================================================
    // --- 4. UI创建与事件处理主函数 (Main Function for UI and Events) ---
    // =================================================================================
    async function createUI() {
        const query = getQueryParam();
        if (!query) return; // 如果不是搜索结果页，则不执行

        // --- 步骤1: 读取所有用户配置 ---
        const layout = await GM_getValue(LAYOUT_KEY, 'horizontal');
        const positioning = await GM_getValue(POSITIONING_KEY, 'fixed');
        const orderedEngineNames = (await GM_getValue(ORDER_KEY, engines.map(e => e.name).join(','))).split(',');

        // --- 步骤2: 注入动态样式 ---
        const styleSheet = document.createElement("style");
        styleSheet.innerText = getStyles(layout, positioning);
        document.head.appendChild(styleSheet);

        // --- 步骤3: 创建DOM元素 (在内存中) ---
        const container = document.createElement('div');
        container.id = 'search-switcher-container';
        const header = document.createElement('div'); // 拖动区域
        header.id = 'search-switcher-header';
        const body = document.createElement('div'); // 按钮容器
        body.id = 'search-switcher-body';
        const lockButton = document.createElement('button');
        lockButton.id = 'lock-button';

        // --- 步骤4: 根据配置创建引擎按钮 ---
        const currentPageHostname = window.location.hostname;
        orderedEngineNames.forEach(name => {
            const engine = engineMap.get(name);
            if (!engine) return; // 如果配置错误，安全跳过

            const button = document.createElement('button');
            button.className = 'search-switcher-btn';
            button.textContent = engine.name;

            // 检查当前按钮是否为当前网站，是则设为“活动”状态
            let isActiveButton = false;
            try {
                const engineHostname = new URL(engine.url).hostname;
                if (currentPageHostname === engineHostname || (engine.name === 'Bing' && currentPageHostname.endsWith('.bing.com'))) {
                    button.classList.add('search-switcher-btn-active');
                    isActiveButton = true;
                }
            } catch (e) {
                console.warn('[Search Switcher] Error parsing engine URL:', engine.url, e);
            }

            // 非活动按钮才添加点击跳转事件
            if (!isActiveButton) {
                button.onclick = () => {
                    const currentQuery = getQueryParam(); // 在点击时重新获取关键词
                    window.location.href = engine.url + encodeURIComponent(currentQuery);
                };
            }
            body.appendChild(button);
        });

        // --- 步骤5: 根据布局组装UI ---
        if (layout === 'vertical') {
            // 竖向时：锁按钮在头部，左侧对齐
            header.appendChild(lockButton);
        } else {
            // 横向时：头部作为拖动柄，锁按钮在按钮行的最右侧
            header.textContent = '⠿'; // Unicode拖动图标
            body.appendChild(lockButton);
        }
        container.appendChild(header);
        container.appendChild(body);
        document.body.appendChild(container); // 最后将完整的UI添加到页面

        // --- 步骤6: 位置恢复与事件绑定 ---
        const posKey = `switcher_pos_v4_${currentPageHostname}`;
        const lockKey = 'switcher_locked_v4';
        let isLocked = await GM_getValue(lockKey, false);
        let isDragging = false;
        let offsetX, offsetY;

        // 从存储中读取位置信息，并根据定位模式恢复
        const savedPos = await GM_getValue(posKey, { top: '80px', left: 'auto', right: '20px' });
        if (positioning === 'absolute') {
            // 跟随页面模式：坐标需加上页面滚动距离
            container.style.top = (parseInt(savedPos.top) || 0) + window.scrollY + 'px';
            if (savedPos.left !== 'auto') {
                container.style.left = (parseInt(savedPos.left) || 0) + window.scrollX + 'px';
                container.style.right = 'auto';
            } else {
                container.style.right = savedPos.right;
                container.style.left = 'auto';
            }
        } else {
            // 固定屏幕模式：直接应用坐标
            container.style.top = savedPos.top;
            container.style.left = savedPos.left;
            container.style.right = savedPos.right;
        }

        // 更新锁图标和拖动区域的鼠标样式
        function updateLockState() {
            lockButton.textContent = isLocked ? '🔒' : '🔓';
            header.style.cursor = isLocked ? 'default' : 'move';
        }

        // 锁定按钮点击事件
        lockButton.onclick = () => { isLocked = !isLocked; updateLockState(); GM_setValue(lockKey, isLocked); };

        // 拖动开始事件
        header.onmousedown = (e) => {
            if (isLocked) return;
            isDragging = true;
            const rect = container.getBoundingClientRect(); // 获取元素相对于视窗的位置
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            container.style.right = 'auto'; // 拖动时统一使用left定位
            e.preventDefault();
        };

        // 拖动过程事件
        document.onmousemove = (e) => {
            if (!isDragging || isLocked) return;
            // 计算元素在视窗内的新位置
            let newLeft = e.clientX - offsetX;
            let newTop = e.clientY - offsetY;

            // 边界检测，防止拖出屏幕
            const containerWidth = container.offsetWidth;
            const containerHeight = container.offsetHeight;
            newTop = Math.max(0, Math.min(newTop, window.innerHeight - containerHeight));
            newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - containerWidth));

            // 根据定位模式应用最终坐标
            if (positioning === 'absolute') {
                container.style.top = (newTop + window.scrollY) + 'px';
                container.style.left = (newLeft + window.scrollX) + 'px';
            } else {
                container.style.top = newTop + 'px';
                container.style.left = newLeft + 'px';
            }
        };

        // 拖动结束事件
        document.onmouseup = () => {
            if (isDragging) {
                isDragging = false;
                // 核心：无论当前是什么模式，都保存相对于视窗的(fixed)坐标。
                // 这样做可以确保在不同定位模式间切换时，位置保持一致。
                const rect = container.getBoundingClientRect();
                GM_setValue(posKey, { top: rect.top + 'px', left: rect.left + 'px', right: 'auto' });
            }
        };

        // 初始化UI状态
        updateLockState();
    }


    // =================================================================================
    // --- 5. 脚本执行入口 (Script Execution Entry) ---
    // --- 确保在DOM加载完成后再执行UI创建函数 ---
    // =================================================================================
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', createUI);
    } else {
        createUI();
    }

})();