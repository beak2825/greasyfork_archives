// ==UserScript==
// @name         抖店运营小助手-观澜11208596
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  抓取抖音小店商品曝光但未购买人群和成交人群特征数据 + 核心用户转化率分析 + 直播UV价值计算器 + 竞对店铺真实数据查询
// @author       微信11208596
// @license MIT
// @match        https://compass.jinritemai.com/shop/goods-user-analysis/*
// @match        https://compass.jinritemai.com/shop/commodity/product-list*
// @match        https://compass.jinritemai.com/shop/core-users*
// @match        https://fxg.jinritemai.com/ffa/mshop/homepage/index*
// @match        https://compass.jinritemai.com/shop/live-detail*
// @match        https://compass.jinritemai.com/shop/chance/rank-shop/detail*
// @match        https://compass.jinritemai.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/540580/%E6%8A%96%E5%BA%97%E8%BF%90%E8%90%A5%E5%B0%8F%E5%8A%A9%E6%89%8B-%E8%A7%82%E6%BE%9C11208596.user.js
// @updateURL https://update.greasyfork.org/scripts/540580/%E6%8A%96%E5%BA%97%E8%BF%90%E8%90%A5%E5%B0%8F%E5%8A%A9%E6%89%8B-%E8%A7%82%E6%BE%9C11208596.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检测当前页面类型
    const isGoodsUserAnalysis = window.location.pathname.includes('/shop/goods-user-analysis/');
    const isProductList = window.location.pathname.includes('/shop/commodity/product-list');
    const isCoreUsers = window.location.pathname.includes('/shop/core-users');
    const isHomepage = window.location.href.includes('fxg.jinritemai.com/ffa/mshop/homepage/index');
    const isLiveDetail = window.location.pathname.includes('/shop/live-detail');
    const isCompetitorDetail = window.location.pathname.includes('/shop/chance/rank-shop/detail');
    // 电商罗盘首页：域名匹配但不是特定子页面
    const isCompassHome = window.location.hostname === 'compass.jinritemai.com' &&
                         !isGoodsUserAnalysis &&
                         !isProductList &&
                         !isCoreUsers &&
                         !isLiveDetail &&
                         !isCompetitorDetail &&
                         (window.location.pathname === '/' || window.location.pathname === '' || window.location.pathname === '/index');

    // 添加样式
    GM_addStyle(`
        #floating-button {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: #1890ff;
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 9999;
            cursor: move;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 14px;
            font-weight: bold;
            font-family: Arial, sans-serif;
            transition: all 0.3s ease;
            user-select: none;
        }

        #floating-button:hover {
            background: #40a9ff;
            transform: scale(1.1);
        }

        #api-data-panel, #core-users-panel, #competitor-data-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 450px;
            max-height: 700px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            z-index: 9999;
            font-family: Arial, sans-serif;
            display: none;
        }

        #core-users-panel {
            width: 800px;
            max-height: 80vh;
        }

        #competitor-data-panel {
            width: 600px;
            max-height: 85vh;
        }

        #api-data-header, #core-users-header, #competitor-data-header {
            background: #1890ff;
            color: white;
            padding: 12px 16px;
            border-radius: 8px 8px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
        }

        #competitor-data-header {
            background: #722ed1;
        }

        #api-data-content, #core-users-content, #competitor-data-content {
            padding: 16px;
            max-height: 600px;
            overflow-y: auto;
        }

        .api-status {
            padding: 8px 12px;
            border-radius: 4px;
            margin-bottom: 12px;
            font-weight: bold;
        }

        .status-success {
            background: #f6ffed;
            color: #52c41a;
            border: 1px solid #b7eb8f;
        }

        .status-error {
            background: #fff2f0;
            color: #ff4d4f;
            border: 1px solid #ffccc7;
        }

        .status-loading {
            background: #e6f7ff;
            color: #1890ff;
            border: 1px solid #91d5ff;
        }

        .json-data {
            background: #fafafa;
            padding: 12px;
            border-radius: 4px;
            white-space: pre-wrap;
            font-family: Monaco, 'Courier New', monospace;
            font-size: 11px;
            border: 1px solid #d9d9d9;
            max-height: 250px;
            overflow-y: auto;
        }

        .btn {
            background: #1890ff;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            margin: 4px;
            font-size: 12px;
            display: inline-block;
        }

        .btn:hover {
            background: #40a9ff;
        }

        .btn-success {
            background: #52c41a;
        }

        .btn-success:hover {
            background: #73d13d;
        }

        .btn-close {
            background: transparent;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 16px;
        }

        .btn-minimize {
            background: transparent;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 14px;
            margin-right: 10px;
        }

        .crowd-section {
            border: 1px solid #e8e8e8;
            border-radius: 6px;
            padding: 12px;
            margin-bottom: 12px;
            background: #fafafa;
        }

        .crowd-title {
            font-weight: bold;
            margin-bottom: 8px;
            color: #1890ff;
        }

        .button-group {
            margin-bottom: 8px;
        }

        .analysis-table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
            font-size: 12px;
        }

        .analysis-table th, .analysis-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: center;
        }

        .analysis-table th {
            background: #f5f5f5;
            font-weight: bold;
        }

        .increase {
            color: #ff4d4f;
            font-weight: bold;
        }

        .decrease {
            color: #52c41a;
            font-weight: bold;
        }

        .suggestion-box {
            background: #e6f7ff;
            border: 1px solid #91d5ff;
            border-radius: 4px;
            padding: 12px;
            margin: 10px 0;
        }

        .suggestion-title {
            font-weight: bold;
            color: #1890ff;
            margin-bottom: 8px;
        }

        #homepage-tools-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 400px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.15);
            z-index: 9999;
            font-family: Arial, sans-serif;
            display: none;
        }

        #homepage-tools-header {
            background: #1890ff;
            color: white;
            padding: 16px 20px;
            border-radius: 8px 8px 0 0;
            text-align: center;
            font-size: 16px;
            font-weight: bold;
        }

        #homepage-tools-content {
            padding: 24px 20px;
        }

        .tool-option {
            display: flex;
            align-items: center;
            padding: 16px;
            margin: 12px 0;
            border: 2px solid #f0f0f0;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            background: #fafafa;
        }

        .tool-option:hover {
            border-color: #1890ff;
            background: #e6f7ff;
            transform: translateY(-2px);
        }

        .tool-icon {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            font-weight: bold;
            color: white;
            margin-right: 16px;
        }

        .tool-option:nth-child(1) .tool-icon {
            background: #52c41a;
        }

        .tool-option:nth-child(2) .tool-icon {
            background: #1890ff;
        }

        .tool-info {
            flex: 1;
        }

        .tool-title {
            font-size: 16px;
            font-weight: bold;
            color: #262626;
            margin-bottom: 4px;
        }

        .tool-desc {
            font-size: 12px;
            color: #8c8c8c;
            line-height: 1.4;
        }

        .homepage-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 9998;
            display: none;
        }

        /* 表格增强样式 */
        .custom-column {
            min-width: 80px;
            width: 80px;
            padding: 8px 6px !important;
            background: #fff !important;
            border-right: 1px solid #f0f0f0 !important;
            position: relative;
            resize: horizontal;
            overflow: hidden;
        }

        .custom-column.ecom-table-column-has-sorters {
            cursor: pointer;
        }

        .custom-column .ecom-table-column-title {
            color: #262626 !important;
            font-weight: 500 !important;
            font-size: 12px !important;
        }

        .custom-column:hover {
            background: #fafafa !important;
        }

        .custom-column.sort-asc .ecom-table-column-sorter-up.active,
        .custom-column.sort-desc .ecom-table-column-sorter-down.active {
            color: #1890ff !important;
        }

        .custom-column .value-FjtXW3 {
            color: #262626 !important;
            font-weight: 400 !important;
            font-size: 12px !important;
            line-height: 1.5 !important;
        }

        .custom-column .ecom-table-column-sorters {
            justify-content: flex-end !important;
        }

        .custom-column .ecom-table-column-sorter {
            margin-left: 4px !important;
        }

        .custom-column td {
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
        }

        /* 列宽拖拽手柄 */
        .custom-column::after {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 4px;
            height: 100%;
            cursor: col-resize;
            background: transparent;
            z-index: 1;
        }

        .custom-column:hover::after {
            background: rgba(24, 144, 255, 0.3);
        }

        /* 手动计算按钮样式 */
        #manual-calculate-btn {
            position: fixed;
            top: 120px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 9998;
            transition: all 0.3s ease;
            font-family: Arial, sans-serif;
            display: none;
        }

        #manual-calculate-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
            background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        }

        #manual-calculate-btn:active {
            transform: translateY(0);
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }

        #manual-calculate-btn.processing {
            background: linear-gradient(135deg, #ffa726 0%, #ff7043 100%);
            cursor: not-allowed;
            animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }

        #manual-calculate-btn.success {
            background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
            animation: none;
        }

        /* 竞对数据面板样式 */
        .competitor-info {
            background: #f6ffed;
            border: 1px solid #b7eb8f;
            border-radius: 6px;
            padding: 12px;
            margin: 8px 0;
        }

        .data-chart {
            margin: 12px 0;
            padding: 12px;
            background: #fafafa;
            border-radius: 6px;
            border: 1px solid #e8e8e8;
        }

        .data-row {
            display: flex;
            justify-content: space-between;
            padding: 6px 0;
            border-bottom: 1px solid #f0f0f0;
        }

        .data-label {
            font-weight: bold;
            color: #666;
        }

        .data-value {
            color: #1890ff;
            font-weight: bold;
        }

        .trend-up {
            color: #52c41a;
        }

        .trend-down {
            color: #ff4d4f;
        }

        .competitor-section {
            border: 1px solid #e8e8e8;
            border-radius: 6px;
            padding: 12px;
            margin-bottom: 12px;
            background: #fafafa;
        }

        .competitor-title {
            font-weight: bold;
            margin-bottom: 8px;
            color: #722ed1;
        }

        .competitor-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
            margin: 10px 0;
        }

        .competitor-table th,
        .competitor-table td {
            border: 1px solid #d9d9d9;
            padding: 8px;
            text-align: center;
        }

        .competitor-table th {
            background: #722ed1;
            color: white;
            font-weight: bold;
        }

        .competitor-table tbody tr:nth-child(even) {
            background: #fafafa;
        }

        .competitor-table tbody tr:hover {
            background: #e6f7ff;
        }

        .competitor-table tfoot tr {
            background: #e6f7ff;
            font-weight: bold;
        }
    `);

    // 创建悬浮按钮
    function createFloatingButton() {
        console.log('=== 开始创建悬浮按钮 ===');
        console.log('当前页面检测状态:', { isHomepage, isCompassHome, isCoreUsers, isGoodsUserAnalysis, isCompetitorDetail });

        const button = document.createElement('div');
        button.id = 'floating-button';

        if (isHomepage || isCompassHome) {
            button.textContent = '工具';
            button.title = '点击选择数据分析工具';
            console.log('✓ 设置为工具选择按钮');
        } else if (isCoreUsers) {
            button.textContent = '转化';
            button.title = '点击打开转化率分析工具';
            console.log('✓ 设置为转化分析按钮');
        } else if (isLiveDetail) {
            button.textContent = '直播';
            button.title = '点击添加直播数据分析';
            console.log('✓ 设置为直播分析按钮');
        } else if (isCompetitorDetail) {
            button.textContent = '竞对';
            button.title = '点击查询竞对店铺真实数据';
            console.log('✓ 设置为竞对数据查询按钮');
        } else {
            button.textContent = '人群';
            button.title = '点击打开人群数据抓取工具';
            console.log('✓ 设置为人群抓取按钮');
        }



        document.body.appendChild(button);
        console.log('✓ 悬浮按钮已添加到页面');
        makeFloatingButtonDraggable(button);
        console.log('✓ 悬浮按钮拖拽功能已启用');
        return button;
    }

    // 使悬浮按钮可拖拽
    function makeFloatingButtonDraggable(button) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        let isDragging = false;

        console.log('为悬浮按钮添加拖拽功能');

        // 添加鼠标悬停提示
        button.style.cursor = 'move';

        button.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;

            // 检查是否是左键点击
            if (e.button !== 0) return;

            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            isDragging = false;

            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();

            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            // 如果移动超过阈值，则标记为拖拽
            if (Math.abs(pos1) > 3 || Math.abs(pos2) > 3) {
                isDragging = true;
            }

            if (isDragging) {
                let newTop = button.offsetTop - pos2;
                let newLeft = button.offsetLeft - pos1;

                // 限制在窗口范围内
                const maxLeft = window.innerWidth - button.offsetWidth;
                const maxTop = window.innerHeight - button.offsetHeight;

                newLeft = Math.max(0, Math.min(newLeft, maxLeft));
                newTop = Math.max(0, Math.min(newTop, maxTop));

                button.style.top = newTop + "px";
                button.style.left = newLeft + "px";
                button.style.right = 'auto';
                button.style.bottom = 'auto';
                button.style.position = 'fixed';
                button.style.opacity = '0.8';
                button.style.transform = 'scale(1.1)';
            }
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;

            // 恢复按钮样式
            button.style.opacity = '1';
            button.style.transform = 'scale(1)';

            // 如果没有拖拽，则触发点击事件
            if (!isDragging) {
                setTimeout(() => {
                    if (isHomepage || isCompassHome) {
                        showHomepageToolsPanel();
                    } else if (isLiveDetail) {
                        addLiveAnalysisCard();
                    } else if (isCompetitorDetail) {
                        button.style.display = 'none';
                        const panel = document.getElementById('competitor-data-panel');
                        if (panel) {
                            panel.style.display = 'block';
                        } else {
                            createCompetitorDataPanel();
                            const newPanel = document.getElementById('competitor-data-panel');
                            if (newPanel) newPanel.style.display = 'block';
                        }
                    } else {
                        button.style.display = 'none';
                        if (isCoreUsers) {
                            const panel = document.getElementById('core-users-panel');
                            if (panel) {
                                panel.style.display = 'block';
                            } else {
                                createCoreUsersPanel();
                                const newPanel = document.getElementById('core-users-panel');
                                if (newPanel) newPanel.style.display = 'block';
                            }
                        } else {
                            const panel = document.getElementById('api-data-panel');
                            if (panel) {
                                panel.style.display = 'block';
                            } else {
                                createApiDataPanel();
                                const newPanel = document.getElementById('api-data-panel');
                                if (newPanel) newPanel.style.display = 'block';
                            }
                        }
                    }
                }, 10);
            }

            isDragging = false;
        }
    }

    // 创建首页工具选择面板
    function createHomepageToolsPanel() {
        const overlay = document.createElement('div');
        overlay.className = 'homepage-overlay';

        const panel = document.createElement('div');
        panel.id = 'homepage-tools-panel';
        panel.innerHTML = `
            <div id="homepage-tools-header">
                抖音小店数据分析工具
            </div>
            <div id="homepage-tools-content">
                <div class="tool-option" data-tool="goods-user-analysis">
                    <div class="tool-icon">人</div>
                    <div class="tool-info">
                        <div class="tool-title">人群数据抓取</div>
                        <div class="tool-desc">分析商品曝光但未购买人群和成交人群特征数据</div>
                    </div>
                </div>
                <div class="tool-option" data-tool="core-users">
                    <div class="tool-icon">转</div>
                    <div class="tool-info">
                        <div class="tool-title">核心用户转化率分析</div>
                        <div class="tool-desc">分析A1-A5各阶段用户转化情况，提供运营建议</div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(panel);

        // 绑定事件
        overlay.addEventListener('click', hideHomepageToolsPanel);

        const toolOptions = panel.querySelectorAll('.tool-option');
        toolOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const toolType = option.getAttribute('data-tool');
                navigateToTool(toolType);
            });
        });

        return { overlay, panel };
    }

    // 显示首页工具选择面板
    function showHomepageToolsPanel() {
        let overlay = document.querySelector('.homepage-overlay');
        let panel = document.getElementById('homepage-tools-panel');

        if (!overlay || !panel) {
            const elements = createHomepageToolsPanel();
            overlay = elements.overlay;
            panel = elements.panel;
        }

        overlay.style.display = 'block';
        panel.style.display = 'block';
    }

    // 隐藏首页工具选择面板
    function hideHomepageToolsPanel() {
        const overlay = document.querySelector('.homepage-overlay');
        const panel = document.getElementById('homepage-tools-panel');

        if (overlay) overlay.style.display = 'none';
        if (panel) panel.style.display = 'none';
    }

    // 导航到指定工具页面
    function navigateToTool(toolType) {
        let targetUrl = '';

        if (toolType === 'goods-user-analysis') {
            targetUrl = 'https://compass.jinritemai.com/shop/goods-user-analysis/';
        } else if (toolType === 'core-users') {
            targetUrl = 'https://compass.jinritemai.com/shop/core-users';
        }

        if (targetUrl) {
            window.location.href = targetUrl;
        }
    }

    // 创建竞对数据面板
    function createCompetitorDataPanel() {
        console.log('=== 创建竞对数据面板 ===');

        const panel = document.createElement('div');
        panel.id = 'competitor-data-panel';
        panel.innerHTML = `
            <div id="competitor-data-header">
                <span>竞对店铺真实数据查询</span>
                <div>
                    <button class="btn-minimize" onclick="document.getElementById('competitor-data-panel').style.display='none'; document.getElementById('floating-button').style.display='block';">-</button>
                    <button class="btn-close" onclick="document.getElementById('competitor-data-panel').style.display='none'; document.getElementById('floating-button').style.display='block';">×</button>
                </div>
            </div>
            <div id="competitor-data-content">
                <div class="competitor-info">
                    <strong>店铺信息获取中...</strong>
                    <div id="shop-info"></div>
                </div>

                <div class="competitor-section">
                    <div class="competitor-title">数据查询</div>
                    <div class="button-group">
                        <button class="btn" id="fetch-both-competitor">查询竞对数据</button>
                        <button class="btn" id="copy-table-data" style="display: none;">导出表格</button>
                    </div>
                    <div class="api-status" id="query-status">等待查询...</div>
                </div>

                <div class="competitor-section" id="data-table-section" style="display: none;">
                    <div class="competitor-title">数据详情</div>
                    <div id="data-table-container"></div>
                </div>

                <div class="competitor-section" id="analysis-section" style="display: none;">
                    <div class="competitor-title">数据分析</div>
                    <div id="data-analysis"></div>
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        makeCompetitorPanelDraggable(panel);
        bindCompetitorPanelEvents();

        // 提取店铺信息
        extractShopInfo();

        console.log('✓ 竞对数据面板创建完成');
        return panel;
    }

    // 使竞对数据面板可拖拽
    function makeCompetitorPanelDraggable(panel) {
        const header = panel.querySelector('#competitor-data-header');
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        header.style.cursor = 'move';
        header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            panel.style.top = (panel.offsetTop - pos2) + "px";
            panel.style.left = (panel.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // 绑定竞对面板事件
    function bindCompetitorPanelEvents() {
        const buttons = {
            'fetch-both-competitor': () => fetchAllCompetitorData(),
            'copy-table-data': () => exportCompetitorTableData()
        };

        Object.entries(buttons).forEach(([buttonId, handler]) => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.addEventListener('click', handler);
                console.log(`✓ 绑定按钮: ${buttonId}`);
            } else {
                console.error(`✗ 找不到按钮: ${buttonId}`);
            }
        });
    }

    // 提取店铺信息
    function extractShopInfo() {
        const shopInfo = document.getElementById('shop-info');
        const url = new URL(window.location.href);
        const shopId = url.searchParams.get('shop_id');
        const dateValue = url.searchParams.get('date_value');

        if (shopId) {
            const startDate = dateValue ? new Date(parseInt(dateValue.split(',')[0]) * 1000) : null;
            const endDate = dateValue ? new Date(parseInt(dateValue.split(',')[1]) * 1000) : null;

            shopInfo.innerHTML = `
                <div class="data-row">
                    <span class="data-label">店铺ID:</span>
                    <span class="data-value">${shopId}</span>
                </div>
                ${startDate && endDate ? `
                <div class="data-row">
                    <span class="data-label">查询时间:</span>
                    <span class="data-value">${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}</span>
                </div>
                ` : ''}
            `;
        } else {
            shopInfo.innerHTML = '<span style="color: red;">无法获取店铺信息</span>';
        }
    }

    // 构建竞对API URL
    function buildCompetitorApiUrl(indexSelected) {
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);

        console.log('当前页面URL:', window.location.href);
        console.log('页面URL参数:', Object.fromEntries(params));

        // 基础API URL
        const baseUrl = 'https://compass.jinritemai.com/compass_api/shop/mall/market/shop_core_data_trend';

        // 动态获取日期范围
        let beginDate, endDate;

        // 方法1: 从URL参数获取
        const dateValue = params.get('date_value');
        if (dateValue) {
            const dates = dateValue.split(',');
            if (dates.length === 2) {
                const startTimestamp = parseInt(dates[0]);
                const endTimestamp = parseInt(dates[1]);
                beginDate = new Date(startTimestamp * 1000).toISOString().slice(0, 19).replace('T', ' ');
                endDate = new Date(endTimestamp * 1000).toISOString().slice(0, 19).replace('T', ' ');
                console.log('从URL解析日期:', { beginDate, endDate });
            }
        }

        // 方法2: 尝试从页面元素获取日期
        if (!beginDate || !endDate) {
            try {
                const dateInputs = document.querySelectorAll('input[type="date"], .date-picker input, [placeholder*="日期"]');
                dateInputs.forEach(input => {
                    console.log('找到日期输入框:', input.value, input.placeholder);
                });

                // 使用默认的30天范围
                const now = new Date();
                const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                beginDate = thirtyDaysAgo.toISOString().slice(0, 19).replace('T', ' ');
                endDate = now.toISOString().slice(0, 19).replace('T', ' ');
                console.log('使用默认日期范围:', { beginDate, endDate });
            } catch (e) {
                console.log('无法获取页面日期，使用固定范围');
                beginDate = '2025/05/28 00:00:00';
                endDate = '2025/06/26 00:00:00';
            }
        }

        // 构建查询参数 - 完全使用页面实际参数
        const apiParams = new URLSearchParams();

        // 核心参数：shop_id必须有
        const shopId = params.get('shop_id');
        if (!shopId) {
            console.error('⚠️ 未找到shop_id参数，可能无法查询数据');
        }

        apiParams.set('shop_id', shopId || '');
        apiParams.set('index_selected', indexSelected);
        apiParams.set('begin_date', beginDate);
        apiParams.set('end_date', endDate);

        // 其他参数：优先使用页面参数
        const paramMapping = {
            'rank_type': params.get('rank_type') || '0',
            'date_type': params.get('date_type') || '23',
            'activity_id': params.get('activity_id') || '',
            'industry_id': params.get('industry_id') || params.get('cid1') || '13',
            'category_id': params.get('category_id') || params.get('cid2') || '20104,21665',
            'content_type': params.get('content_type') || '0',
            'platform': params.get('platform') || '0'
        };

        // 添加所有页面参数（保持原有逻辑）
        params.forEach((value, key) => {
            if (!apiParams.has(key) && value && !['index_selected', 'begin_date', 'end_date'].includes(key)) {
                apiParams.set(key, value);
                console.log(`复制页面参数: ${key} = ${value}`);
            }
        });

        // 覆盖映射参数
        Object.entries(paramMapping).forEach(([key, value]) => {
            if (value) {
                apiParams.set(key, value);
            }
        });

        // 添加认证参数
        const authParams = extractCompetitorAuthParams();
        console.log('提取的认证参数:', authParams);

        Object.entries(authParams).forEach(([key, value]) => {
            if (value) {
                apiParams.set(key, value);
            }
        });

        const finalUrl = `${baseUrl}?${apiParams.toString()}`;
        console.log('构建的API URL:', finalUrl);

        return finalUrl;
    }

    // 深度搜索时间序列数据
    function deepSearchForTimeSeriesData(obj, path = '', maxDepth = 6) {
        if (maxDepth <= 0) return { data: [], source: 'max_depth_reached' };

        if (Array.isArray(obj)) {
            // 检查数组元素是否包含时间序列数据格式
            if (obj.length > 0) {
                const sample = obj[0];
                if (sample && typeof sample === 'object') {
                    // 检查是否有常见的时间序列字段组合
                    const timeFields = ['x_str', 'date', 'time', 'day', 'x', 'timestamp', 'dt'];
                    const valueFields = ['y', 'value', 'amount', 'count', 'val', 'data', 'num'];

                    const hasTimeField = timeFields.some(field => field in sample);
                    const hasValueField = valueFields.some(field => field in sample);

                    if (hasTimeField && hasValueField) {
                        console.log(`✓ 找到标准时间序列数据: ${path}`);
                        console.log(`样本数据:`, sample);
                        console.log(`数组长度: ${obj.length}`);
                        return { data: obj, source: path };
                    }

                    // 检查是否有index_name字段（特定格式）
                    if ('index_name' in sample && ('x_str' in sample || 'y' in sample)) {
                        console.log(`✓ 找到index_name格式数据: ${path}`);
                        console.log(`样本数据:`, sample);
                        console.log(`数组长度: ${obj.length}`);
                        return { data: obj, source: path + ' (index_name_format)' };
                    }

                    // 特殊情况：检查是否所有元素都有数字属性（可能是纯数值数组）
                    const keys = Object.keys(sample);
                    if (keys.length === 1 && typeof sample[keys[0]] === 'number') {
                        console.log(`✓ 找到数值数组: ${path}, 样本:`, sample);
                        return { data: obj, source: path + ' (numeric_array)' };
                    }
                }
            }
        } else if (obj && typeof obj === 'object') {
            // 优先搜索一些常见的数据字段名
            const priorityKeys = ['data', 'series', 'trend_data', 'chart_data', 'values', 'items', 'list', 'records', 'axis_data', 'pay_amt', 'pay_cnt'];

            // 先搜索优先级高的字段
            for (const key of priorityKeys) {
                if (key in obj) {
                    const newPath = path ? `${path}.${key}` : key;
                    const result = deepSearchForTimeSeriesData(obj[key], newPath, maxDepth - 1);
                    if (result.data.length > 0) {
                        return result;
                    }
                }
            }

            // 然后搜索其他字段
            for (const [key, value] of Object.entries(obj)) {
                if (!priorityKeys.includes(key)) {
                    const newPath = path ? `${path}.${key}` : key;
                    const result = deepSearchForTimeSeriesData(value, newPath, maxDepth - 1);
                    if (result.data.length > 0) {
                        return result;
                    }
                }
            }
        }

        return { data: [], source: 'not_found' };
    }

    // 提取认证参数
    function extractCompetitorAuthParams() {
        const authParams = {};

        // 从cookie获取必要参数
        const cookies = document.cookie.split(';');
        cookies.forEach(cookie => {
            const [name, value] = cookie.trim().split('=');
            if (['msToken', 'verifyFp', 'fp', '_lid'].includes(name) && value) {
                authParams[name] = decodeURIComponent(value);
            }
        });

        // 从URL获取更多参数
        const urlParams = new URLSearchParams(window.location.search);
        ['a_bogus', 'verifyFp', 'fp', 'msToken', '_lid'].forEach(param => {
            const value = urlParams.get(param);
            if (value) {
                authParams[param] = value;
            }
        });

        // 尝试从页面获取其他必要的认证信息
        try {
            const scripts = document.querySelectorAll('script');
            scripts.forEach(script => {
                const content = script.textContent || '';
                // 查找可能的认证令牌
                const tokenMatch = content.match(/["\']([a-f0-9]{32,})["\'/]/);
                if (tokenMatch && !authParams.verifyFp) {
                    authParams.verifyFp = tokenMatch[1];
                }
            });
        } catch (e) {
            console.log('无法从页面脚本提取认证信息');
        }

        return authParams;
    }

    // 获取单项竞对数据
    function fetchSingleCompetitorData(indexSelected) {
        return new Promise((resolve, reject) => {
            const apiUrl = buildCompetitorApiUrl(indexSelected);
            console.log(`=== 查询${indexSelected === 'pay_amt' ? '成交金额' : '成交订单'}数据 ===`);
            console.log('API URL:', apiUrl);

            GM_xmlhttpRequest({
                method: 'GET',
                url: apiUrl,
                headers: {
                    'User-Agent': navigator.userAgent,
                    'Referer': window.location.href,
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json, text/plain, */*',
                    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
                },
                onload: function(response) {
                    console.log(`=== ${indexSelected === 'pay_amt' ? '成交金额' : '成交订单'}数据响应 ===`);
                    console.log('Status:', response.status);
                    console.log('Response:', response.responseText);

                    try {
                        const data = JSON.parse(response.responseText);
                        console.log('API响应数据:', data);

                        let targetData = null;

                        // 方法1: 直接找axis_data
                        try {
                            if (data.data && data.data.module_data && data.data.module_data.trend_data && data.data.module_data.trend_data.axis_data && data.data.module_data.trend_data.axis_data[indexSelected]) {
                                targetData = data.data.module_data.trend_data.axis_data[indexSelected];
                                console.log(`✓ 从axis_data找到${indexSelected}数据:`, targetData.length, '条');
                            }
                        } catch (e) {
                            console.log('axis_data查找失败:', e);
                        }

                        // 方法2: 暴力搜索所有数组
                        if (!targetData) {
                            function findArrays(obj) {
                                if (Array.isArray(obj) && obj.length > 0 && obj[0] && obj[0].x_str && typeof obj[0].y !== 'undefined') {
                                    return obj;
                                }
                                if (typeof obj === 'object' && obj !== null) {
                                    for (var key in obj) {
                                        var result = findArrays(obj[key]);
                                        if (result) return result;
                                    }
                                }
                                return null;
                            }
                            targetData = findArrays(data);
                            if (targetData) {
                                console.log(`✓ 暴力搜索找到${indexSelected}数据:`, targetData.length, '条');
                            }
                        }

                        if (targetData && targetData.length > 0) {
                            resolve({
                                type: indexSelected,
                                data: targetData,
                                success: true
                            });
                        } else {
                            reject({
                                type: indexSelected,
                                error: '没找到数据',
                                rawData: data
                            });
                        }
                    } catch (error) {
                        console.error(`${indexSelected} 解析失败:`, error);
                        reject({
                            type: indexSelected,
                            error: '数据解析失败',
                            details: error.message,
                            rawResponse: response.responseText
                        });
                    }
                },
                onerror: function(error) {
                    reject({
                        type: indexSelected,
                        error: '网络请求失败',
                        details: error
                    });
                }
            });
        });
    }

    // 获取全部竞对数据
    function fetchAllCompetitorData() {
        console.log('=== 开始获取全部竞对数据 ===');

        const statusElement = document.getElementById('query-status');
        const tableSection = document.getElementById('data-table-section');
        const copyButton = document.getElementById('copy-table-data');

        // 更新状态
        statusElement.className = 'api-status status-loading';
        statusElement.textContent = '正在查询成交金额和订单数据...';
        tableSection.style.display = 'none';
        copyButton.style.display = 'none';

        // 同时获取成交金额和订单数据
        Promise.all([
            fetchSingleCompetitorData('pay_amt'),
            fetchSingleCompetitorData('pay_cnt')
        ]).then(results => {
            console.log('=== 所有数据获取成功 ===');

            const [amtResult, cntResult] = results;

            // 更新状态
            statusElement.className = 'api-status status-success';
            statusElement.textContent = '✓ 数据获取成功';

            // 生成表格
            generateDataTable(amtResult.data, cntResult.data);

            // 存储数据用于分析
            window.competitor_pay_amt_data = { data: { data: amtResult.data } };
            window.competitor_pay_cnt_data = { data: { data: cntResult.data } };

            // 显示表格和复制按钮
            tableSection.style.display = 'block';
            copyButton.style.display = 'inline-block';

            // 生成分析
            generateCompetitorAnalysis();

                }).catch(error => {
            console.error('=== 数据获取失败 ===', error);

            statusElement.className = 'api-status status-error';
            statusElement.textContent = `✗ 查询失败: ${error.error || '未知错误'}`;

            // 显示简化的错误信息，重点是数据结构
            const tableContainer = document.getElementById('data-table-container');

            tableContainer.innerHTML = `
                <div style="padding: 15px; background: #fff2f0; border: 1px solid #ffccc7; border-radius: 6px;">
                    <h4 style="margin: 0 0 10px 0; color: #d32f2f;">查询失败</h4>
                    <p><strong>错误:</strong> ${error.error}</p>
                    ${error.code ? `<p><strong>错误码:</strong> ${error.code}</p>` : ''}
                    ${error.hint ? `<p><strong>提示:</strong> ${error.hint}</p>` : ''}

                    <div style="margin: 15px 0; padding: 10px; background: #e3f2fd; border-radius: 4px;">
                        <strong>🔍 请检查控制台日志</strong><br>
                        按F12打开开发者工具，查看Console选项卡中的详细信息
                    </div>

                    <details style="margin-top: 15px;">
                        <summary style="cursor: pointer; color: #1976d2;">📋 查看API响应数据</summary>
                        <pre style="margin-top: 8px; font-size: 11px; background: #f5f5f5; padding: 10px; border-radius: 4px; overflow: auto; max-height: 200px; white-space: pre-wrap;">${error.rawResponse || JSON.stringify(error.rawData, null, 2)}</pre>
                    </details>
                </div>
            `;
            tableSection.style.display = 'block';
        });
    }

    // 生成数据表格
    function generateDataTable(amtData, cntData) {
        console.log('=== 生成数据表格 ===');
        console.log('成交金额数据:', amtData);
        console.log('订单数据:', cntData);

        const tableContainer = document.getElementById('data-table-container');

        if (!amtData || !cntData || amtData.length === 0 || cntData.length === 0) {
            tableContainer.innerHTML = '<p style="color: red;">数据为空，无法生成表格</p>';
            return;
        }

        // 将两组数据按日期合并
        const mergedData = [];
        const dateMap = new Map();

        // 添加成交金额数据
        amtData.forEach(item => {
            if (item.x_str && typeof item.y !== 'undefined') {
                dateMap.set(item.x_str, {
                    date: item.x_str,
                    amount: item.y || 0,
                    count: 0
                });
            }
        });

        // 添加订单数据
        cntData.forEach(item => {
            if (item.x_str && typeof item.y !== 'undefined') {
                const existing = dateMap.get(item.x_str);
                if (existing) {
                    existing.count = item.y || 0;
                } else {
                    dateMap.set(item.x_str, {
                        date: item.x_str,
                        amount: 0,
                        count: item.y || 0
                    });
                }
            }
        });

        // 转换为数组并排序
        mergedData.push(...dateMap.values());
        mergedData.sort((a, b) => new Date(a.date) - new Date(b.date));

        // 计算总计和客单价
        const totalAmount = mergedData.reduce((sum, item) => sum + item.amount, 0);
        const totalCount = mergedData.reduce((sum, item) => sum + item.count, 0);
        const avgOrderValue = totalCount > 0 ? totalAmount / totalCount : 0;

        // 生成表格HTML
        let tableHTML = `
            <div style="margin-bottom: 15px; padding: 10px; background: #f0f9ff; border-radius: 6px; border: 1px solid #bae7ff;">
                <strong>数据概览：</strong>
                总成交金额 <span style="color: #1890ff;">¥${totalAmount.toLocaleString()}</span> |
                总订单数 <span style="color: #1890ff;">${totalCount.toLocaleString()}单</span> |
                平均客单价 <span style="color: #1890ff;">¥${avgOrderValue.toFixed(2)}</span>
            </div>
            <table class="competitor-table">
                <thead>
                    <tr>
                        <th>日期</th>
                        <th>成交金额(¥)</th>
                        <th>订单数(单)</th>
                        <th>客单价(¥)</th>
                    </tr>
                </thead>
                <tbody>
        `;

        mergedData.forEach(item => {
            const customerPrice = item.count > 0 ? (item.amount / item.count) : 0;

            tableHTML += `
                <tr>
                    <td>${item.date}</td>
                    <td style="text-align: right;">${item.amount.toLocaleString()}</td>
                    <td style="text-align: right;">${item.count.toLocaleString()}</td>
                    <td style="text-align: right;">${customerPrice.toFixed(2)}</td>
                </tr>
            `;
        });

        tableHTML += `
                </tbody>
                <tfoot>
                    <tr>
                        <td>合计</td>
                        <td style="text-align: right;">${totalAmount.toLocaleString()}</td>
                        <td style="text-align: right;">${totalCount.toLocaleString()}</td>
                        <td style="text-align: right;">${avgOrderValue.toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>
        `;

        tableContainer.innerHTML = tableHTML;

        // 存储表格数据用于复制
        window.competitorTableData = mergedData;

        console.log('✓ 表格生成完成');
    }

    // 导出竞对表格数据为Excel
    function exportCompetitorTableData() {
        const exportButton = document.getElementById('copy-table-data');

        console.log('=== 开始导出表格 ===');

        // 直接从页面表格提取数据（最可靠的方法）
        const extractTableData = () => {
            const tableRows = document.querySelectorAll('.competitor-table tbody tr');
            if (tableRows.length === 0) {
                console.log('未找到表格数据行');
                return null;
            }

            const data = [];
            tableRows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 4) {
                    const date = cells[0].textContent.trim();
                    const amount = parseFloat(cells[1].textContent.replace(/[,¥]/g, '')) || 0;
                    const count = parseFloat(cells[2].textContent.replace(/[,单]/g, '')) || 0;

                    if (date && date !== '合计') {
                        data.push({
                            date: date,
                            amount: amount,
                            count: count
                        });
                    }
                }
            });

            console.log('从表格提取到', data.length, '条数据:', data);
            return data;
        };

        const tableData = extractTableData();

        if (!tableData || tableData.length === 0) {
            console.log('⚠️ 页面没有表格数据可导出');
            exportButton.textContent = '表格无数据';
            setTimeout(() => {
                exportButton.textContent = '导出表格';
            }, 2000);
            return;
        }

        // 获取店铺名称
        const getShopName = () => {
            console.log('=== 开始提取店铺名称 ===');

            // 方法1: 从指定的div获取（你提到的样式）
            const shopNameDiv = document.querySelector('div[style*="text-overflow: ellipsis"][style*="-webkit-line-clamp: 1"]');
            if (shopNameDiv && shopNameDiv.textContent.trim()) {
                const name = shopNameDiv.textContent.trim();
                console.log('方法1找到店铺名称:', name);
                return name;
            }

            // 方法2: 更广泛的样式匹配
            const ellipsisSelectors = [
                'div[style*="text-overflow: ellipsis"]',
                'div[style*="-webkit-line-clamp"]',
                'span[style*="text-overflow: ellipsis"]',
                '[title*="店"]', '[title*="旗舰"]', '[title*="专营"]'
            ];

            for (const selector of ellipsisSelectors) {
                const elements = document.querySelectorAll(selector);
                for (const element of elements) {
                    const text = element.textContent.trim();
                    if (text && (text.includes('店') || text.includes('旗舰') || text.includes('专营')) && text.length < 100) {
                        console.log('方法2找到店铺名称:', text);
                        return text;
                    }
                }
            }

            // 方法3: 从页面标题获取
            const titleMatch = document.title.match(/(.+?)[\s\-_].*竞对|(.+?)[\s\-_].*店铺/);
            if (titleMatch) {
                const name = titleMatch[1] || titleMatch[2];
                console.log('方法3从标题找到店铺名称:', name);
                return name;
            }

            // 方法4: 从数据概览区域获取
            const overviewArea = document.querySelector('.data-chart, .shop-info, .competitor-info');
            if (overviewArea) {
                const text = overviewArea.textContent;
                const shopMatch = text.match(/([^，。！？\s]{2,20}[店铺旗舰专营]{1,2})/);
                if (shopMatch) {
                    console.log('方法4从概览区域找到店铺名称:', shopMatch[1]);
                    return shopMatch[1];
                }
            }

            // 方法5: 从URL参数获取
            const urlParams = new URLSearchParams(window.location.search);
            const shopId = urlParams.get('shop_id');
            if (shopId) {
                const name = `店铺_${shopId}`;
                console.log('方法5从URL参数生成店铺名称:', name);
                return name;
            }

            console.log('所有方法都未找到店铺名称，使用默认名称');
            return '竞对店铺';
        };

        const shopName = getShopName();
        console.log('提取的店铺名称:', shopName);
        console.log('当前表格数据:', window.competitorTableData);

        // 生成Excel数据
        const createExcelData = () => {
            const data = [];

            // 添加表头信息
            data.push(['店铺名称', shopName]);
            data.push(['导出时间', new Date().toLocaleString('zh-CN')]);
            data.push(['数据周期', `${tableData.length}天`]);
            data.push([]); // 空行

            // 添加数据概览
            const totalAmount = tableData.reduce((sum, item) => sum + item.amount, 0);
            const totalCount = tableData.reduce((sum, item) => sum + item.count, 0);
            const avgOrderValue = totalCount > 0 ? totalAmount / totalCount : 0;

            data.push(['📊 数据总览']);
            data.push(['总成交金额(¥)', totalAmount.toLocaleString()]);
            data.push(['总订单数(单)', totalCount]);
            data.push(['平均客单价(¥)', avgOrderValue.toFixed(2)]);
            data.push([]); // 空行

            // 添加最佳表现日分析
            if (tableData.length > 0) {
                const maxAmountDay = tableData.reduce((max, item) => item.amount > max.amount ? item : max);
                const maxCountDay = tableData.reduce((max, item) => item.count > max.count ? item : max);

                data.push(['🏆 最佳表现日']);
                data.push(['最高成交额', `${maxAmountDay.date} - ¥${maxAmountDay.amount.toLocaleString()}`]);
                data.push(['最高订单数', `${maxCountDay.date} - ${maxCountDay.count}单`]);
                data.push([]); // 空行

                // 添加趋势分析
                const avgDailyAmount = totalAmount / tableData.length;
                const avgDailyCount = totalCount / tableData.length;

                data.push(['📈 趋势分析']);
                data.push(['数据周期', `${tableData.length}天`]);
                data.push(['日均成交额(¥)', avgDailyAmount.toFixed(2)]);
                data.push(['日均订单数(单)', avgDailyCount.toFixed(1)]);
                data.push(['分析建议', '建议关注客单价变化趋势，优化产品定价策略']);
                data.push([]); // 空行
            }

            // 添加明细数据表头
            data.push(['📋 明细数据']);
            data.push(['日期', '成交金额(¥)', '订单数(单)', '客单价(¥)']);

            // 添加明细数据
            tableData.forEach(item => {
                const customerPrice = item.count > 0 ? (item.amount / item.count) : 0;
                data.push([
                    item.date,
                    item.amount,
                    item.count,
                    customerPrice.toFixed(2)
                ]);
            });

            // 添加合计行
            data.push(['合计', totalAmount, totalCount, avgOrderValue.toFixed(2)]);

            return data;
        };

        try {
            const excelData = createExcelData();

            // 转换为CSV格式（Excel兼容）
            const csvContent = excelData.map(row =>
                row.map(cell => `"${cell}"`).join(',')
            ).join('\n');

            // 添加BOM以支持中文
            const BOM = '\uFEFF';
            const blob = new Blob([BOM + csvContent], {
                type: 'text/csv;charset=utf-8;'
            });

            // 创建下载链接
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);

            // 生成文件名
            const now = new Date();
            const dateStr = now.toISOString().slice(0, 10);
            const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '-');
            const fileName = `${shopName}_竞对数据_${dateStr}_${timeStr}.csv`;

            link.setAttribute('download', fileName);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // 更新按钮状态
            const originalText = exportButton.textContent;
            exportButton.textContent = '✓ 导出成功';
            exportButton.className = 'btn btn-success';

            setTimeout(() => {
                exportButton.textContent = originalText;
                exportButton.className = 'btn';
            }, 2000);

            console.log(`✓ 表格已导出: ${fileName}`);

        } catch (error) {
            console.error('导出失败:', error);
            exportButton.textContent = '导出失败';
            exportButton.className = 'btn btn-error';

            setTimeout(() => {
                exportButton.textContent = '导出表格';
                exportButton.className = 'btn';
            }, 2000);
        }
    }

    // 降级复制方法
    function fallbackCopyCompetitor(text, btn) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();

        try {
            document.execCommand('copy');
            const originalText = btn.textContent;
            btn.textContent = '✓ 已复制';
            btn.className = 'btn btn-success';

            setTimeout(() => {
                btn.textContent = originalText;
                btn.className = 'btn';
            }, 2000);
        } catch (error) {
            console.error('复制失败:', error);
            btn.textContent = '复制失败';
        } finally {
            document.body.removeChild(textArea);
        }
    }

    // 生成竞对分析
    function generateCompetitorAnalysis() {
        console.log('=== 开始生成竞对分析 ===');

        const amtData = window.competitor_pay_amt_data;
        const cntData = window.competitor_pay_cnt_data;

        const analysisSection = document.getElementById('analysis-section');
        const analysisContent = document.getElementById('data-analysis');

        if (!amtData?.data?.data || !cntData?.data?.data) {
            console.log('数据不完整，无法进行分析');
            return;
        }

        try {
            const amtList = amtData.data.data;
            const cntList = cntData.data.data;

            // 计算总计
            const totalAmt = amtList.reduce((sum, item) => sum + (item.y || 0), 0);
            const totalCnt = cntList.reduce((sum, item) => sum + (item.y || 0), 0);
            const avgOrderValue = totalCnt > 0 ? totalAmt / totalCnt : 0;

            // 找出最高和最低的日期
            const sortedAmtData = [...amtList].sort((a, b) => (b.y || 0) - (a.y || 0));
            const sortedCntData = [...cntList].sort((a, b) => (b.y || 0) - (a.y || 0));

            const bestAmtDay = sortedAmtData[0];
            const bestCntDay = sortedCntData[0];

            // 生成分析内容
            analysisContent.innerHTML = `
                <div class="data-chart">
                    <h4 style="margin: 0 0 12px 0; color: #722ed1;">📊 数据总览</h4>
                    <div class="data-row">
                        <span class="data-label">总成交金额:</span>
                        <span class="data-value">¥${totalAmt.toLocaleString()}</span>
                    </div>
                    <div class="data-row">
                        <span class="data-label">总订单数:</span>
                        <span class="data-value">${totalCnt.toLocaleString()}单</span>
                    </div>
                    <div class="data-row">
                        <span class="data-label">平均客单价:</span>
                        <span class="data-value">¥${avgOrderValue.toFixed(2)}</span>
                    </div>
                </div>

                <div class="data-chart">
                    <h4 style="margin: 0 0 12px 0; color: #722ed1;">🏆 最佳表现日</h4>
                    <div class="data-row">
                        <span class="data-label">最高成交额:</span>
                        <span class="data-value">${bestAmtDay.x_str} - ¥${bestAmtDay.y.toLocaleString()}</span>
                    </div>
                    <div class="data-row">
                        <span class="data-label">最高订单数:</span>
                        <span class="data-value">${bestCntDay.x_str} - ${bestCntDay.y.toLocaleString()}单</span>
                    </div>
                </div>

                <div class="data-chart">
                    <h4 style="margin: 0 0 12px 0; color: #722ed1;">📈 趋势分析</h4>
                    <div style="font-size: 12px; color: #666;">
                        <p>• 数据周期：${amtList.length}天</p>
                        <p>• 日均成交额：¥${(totalAmt / amtList.length).toFixed(2)}</p>
                        <p>• 日均订单数：${(totalCnt / cntList.length).toFixed(1)}单</p>
                        <p>• 建议关注客单价变化趋势，优化产品定价策略</p>
                    </div>
                </div>
            `;

            analysisSection.style.display = 'block';
            console.log('✓ 竞对分析生成完成');

        } catch (error) {
            console.error('分析生成失败:', error);
            analysisContent.innerHTML = '<p style="color: red;">分析生成失败，请检查数据格式</p>';
            analysisSection.style.display = 'block';
        }
    }

    // 创建人群数据抓取面板
    function createApiDataPanel() {
        const panel = document.createElement('div');
        panel.id = 'api-data-panel';
        panel.innerHTML = `
            <div id="api-data-header">
                <span>人群数据抓取工具</span>
                <div>
                    <button class="btn-minimize" id="minimize-api-panel">−</button>
                    <button class="btn-close" id="close-api-panel">×</button>
                </div>
            </div>
            <div id="api-data-content">
                <div class="crowd-section">
                    <div class="crowd-title">曝光但未购买人群 (exposure_not_purchase_crowd)</div>
                    <div class="button-group">
                        <button class="btn" id="fetch-exposure-data">抓取曝光未购买数据</button>
                        <button class="btn" id="copy-exposure-data">复制数据</button>
                    </div>
                    <div id="exposure-status" class="api-status status-loading">准备就绪</div>
                    <div id="exposure-result"></div>
                </div>

                <div class="crowd-section">
                    <div class="crowd-title">成交人群 (purchase_crowd)</div>
                    <div class="button-group">
                        <button class="btn" id="fetch-purchase-data">抓取成交人群数据</button>
                        <button class="btn" id="copy-purchase-data">复制数据</button>
                    </div>
                    <div id="purchase-status" class="api-status status-loading">准备就绪</div>
                    <div id="purchase-result"></div>
                </div>

                <div class="button-group">
                    <button class="btn btn-success" id="fetch-both-data">同时抓取两个指标</button>
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        makeDraggable(panel);

        // 绑定事件
        setTimeout(() => {
            bindApiDataPanelEvents();
        }, 100);

        return panel;
    }

    // 使面板可拖拽
    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = element.querySelector('#api-data-header');

        header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
            element.style.right = 'auto';
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // 绑定人群数据面板事件
    function bindApiDataPanelEvents() {
        console.log('开始绑定人群数据面板事件...');

        // 初始化数据存储
        window.crowdData = {
            exposure_not_purchase: null,
            purchase: null
        };

        const buttons = {
            'close-api-panel': () => {
                document.getElementById('api-data-panel').style.display = 'none';
                document.getElementById('floating-button').style.display = 'flex';
            },
            'minimize-api-panel': () => {
                document.getElementById('api-data-panel').style.display = 'none';
                document.getElementById('floating-button').style.display = 'flex';
            },
            'fetch-exposure-data': () => {
                console.log('点击了抓取曝光未购买人群按钮');
                fetchCrowdData('exposure_not_purchase_crowd', 'exposure-status', 'exposure-result');
            },
            'fetch-purchase-data': () => {
                console.log('点击了抓取成交人群按钮');
                fetchCrowdData('purchase_crowd', 'purchase-status', 'purchase-result');
            },
            'copy-exposure-data': () => {
                console.log('点击了复制曝光数据按钮');
                copyData('exposure_not_purchase');
            },
            'copy-purchase-data': () => {
                console.log('点击了复制成交数据按钮');
                copyData('purchase');
            },
            'fetch-both-data': () => {
                console.log('点击了同时抓取两个指标按钮');
                fetchBothData();
            }
        };

        Object.keys(buttons).forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                console.log(`✓ 绑定按钮: ${buttonId}`);
                button.addEventListener('click', buttons[buttonId]);
            } else {
                console.error(`✗ 找不到按钮: ${buttonId}`);
            }
        });

        console.log('人群数据面板事件绑定完成');
    }

    // 提取URL参数
    function extractParams() {
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);

        return {
            product_id: params.get('product_id'),
            date_type: params.get('date_type') || '21',
            begin_date: params.get('begin_date'),
            end_date: params.get('end_date'),
            page_type: params.get('page_type') || '1',
            is_package: params.get('is_package') || 'false',
            is_activity: params.get('is_activity') || 'false'
        };
    }

    // 获取认证参数
    function getAllAuthParams() {
        const currentUrl = new URL(window.location.href);
        const urlParams = new URLSearchParams(currentUrl.search);

        const cookies = document.cookie.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            if (key && value) acc[key] = decodeURIComponent(value);
            return acc;
        }, {});

        return { urlParams, cookies };
    }

    // 构建API URL
    function buildApiUrl(crowdType) {
        const baseUrl = 'https://compass.jinritemai.com/business_api/shop/crowd/goods/feature_single';
        const params = extractParams();

        if (!params.product_id) {
            throw new Error('请选择【单商品维度】再点击人群画像');
        }

        const { urlParams, cookies } = getAllAuthParams();
        const apiParams = new URLSearchParams();

        // 添加基础参数
        Object.entries(params).forEach(([key, value]) => {
            if (value) apiParams.append(key, value);
        });

        // 设置人群类型
        apiParams.append('crowd', crowdType);

        // 添加feature_single特有的参数
        apiParams.append('second_prefer_rank', '3');
        // 两个人群都使用crowd_tag=101
        apiParams.append('crowd_tag', '101');

        // 添加认证参数
        const authParams = ['_lid', 'verifyFp', 'fp', 'msToken', 'a_bogus'];
        authParams.forEach(param => {
            let value = urlParams.get(param) || cookies[param];
            if (value) {
                apiParams.append(param, value);
            }
        });

        const finalUrl = `${baseUrl}?${apiParams.toString()}`;
        console.log(`构建的API URL (${crowdType}):`, finalUrl);
        return finalUrl;
    }

    // 发起API请求
    function fetchCrowdData(crowdType, statusElementId, resultElementId) {
        const statusEl = document.getElementById(statusElementId);
        const resultEl = document.getElementById(resultElementId);

        const crowdNames = {
            'exposure_not_purchase_crowd': '曝光但未购买人群',
            'purchase_crowd': '成交人群'
        };

        statusEl.className = 'api-status status-loading';
        statusEl.textContent = `正在抓取${crowdNames[crowdType]}数据...`;
        resultEl.innerHTML = '';

        try {
            const apiUrl = buildApiUrl(crowdType);

            GM_xmlhttpRequest({
                method: 'GET',
                url: apiUrl,
                headers: {
                    'Referer': window.location.href,
                    'User-Agent': navigator.userAgent,
                    'Accept': 'application/json, text/plain, */*',
                    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Cache-Control': 'no-cache',
                    'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-origin'
                },
                onload: function(response) {
                    console.log(`=== ${crowdNames[crowdType]} API Response ===`);
                    console.log('Status:', response.status);
                    console.log('Response Text:', response.responseText);

                    try {
                        const data = JSON.parse(response.responseText);

                        // 根据业务状态码判断
                        if (data.st === 0 || data.st === '0') {
                            statusEl.className = 'api-status status-success';
                            statusEl.textContent = `${crowdNames[crowdType]}数据获取成功`;

                            // 显示数据详情
                            if (data.data && data.data.single_index && data.data.single_index.data_result) {
                                const dataResult = data.data.single_index.data_result;
                                if (Array.isArray(dataResult)) {
                                    statusEl.textContent += ` [${dataResult.length}条特征数据]`;
                                }
                            }
                        } else if (data.st === 11001 || data.st === '11001') {
                            statusEl.className = 'api-status status-error';
                            statusEl.textContent = `网络不稳定 (${data.st}): ${data.msg}`;
                        } else {
                            statusEl.className = 'api-status status-error';
                            statusEl.textContent = `业务错误 (${data.st}): ${data.msg || '未知错误'}`;
                        }

                        resultEl.innerHTML = `
                            <div class="json-data" id="${crowdType}-data-content">${JSON.stringify(data, null, 2)}</div>
                        `;

                        // 存储数据
                        if (crowdType === 'exposure_not_purchase_crowd') {
                            window.crowdData.exposure_not_purchase = data;
                        } else if (crowdType === 'purchase_crowd') {
                            window.crowdData.purchase = data;
                        }

                    } catch (e) {
                        console.error('JSON解析错误:', e);
                        statusEl.className = 'api-status status-error';
                        statusEl.textContent = `JSON解析失败: ${e.message}`;

                        resultEl.innerHTML = `
                            <div class="json-data" id="${crowdType}-data-content">${response.responseText}</div>
                        `;

                        // 存储原始文本
                        if (crowdType === 'exposure_not_purchase_crowd') {
                            window.crowdData.exposure_not_purchase = response.responseText;
                        } else if (crowdType === 'purchase_crowd') {
                            window.crowdData.purchase = response.responseText;
                        }
                    }
                },
                onerror: function(error) {
                    console.error('API Error:', error);
                    statusEl.className = 'api-status status-error';
                    statusEl.textContent = '请求失败';

                    resultEl.innerHTML = `
                        <div class="json-data">错误详情: ${error.error || '网络错误'}</div>
                    `;
                }
            });

        } catch (error) {
            statusEl.className = 'api-status status-error';
            statusEl.textContent = error.message;
        }
    }

    // 复制数据功能
    function copyData(crowdType) {
        const crowdNames = {
            'exposure_not_purchase': '曝光但未购买人群',
            'purchase': '成交人群'
        };

        const btnId = crowdType === 'exposure_not_purchase' ? 'copy-exposure-data' : 'copy-purchase-data';
        const btn = document.getElementById(btnId);
        const data = window.crowdData[crowdType];

        if (!data) {
            btn.textContent = '无数据';
            setTimeout(() => {
                btn.textContent = '复制数据';
            }, 1000);
            return;
        }

        try {
            let textToCopy;
            if (typeof data === 'string') {
                textToCopy = data;
            } else {
                textToCopy = JSON.stringify(data, null, 2);
            }

            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    btn.textContent = '已复制';
                    btn.style.background = '#52c41a';
                    setTimeout(() => {
                        btn.textContent = '复制数据';
                        btn.style.background = '#1890ff';
                    }, 1000);
                }).catch(() => {
                    fallbackCopy(textToCopy, btn);
                });
            } else {
                fallbackCopy(textToCopy, btn);
            }
        } catch (error) {
            console.error('复制失败:', error);
            btn.textContent = '复制失败';
            setTimeout(() => {
                btn.textContent = '复制数据';
            }, 1000);
        }
    }

    // 传统复制方法
    function fallbackCopy(text, btn) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            btn.textContent = '已复制';
            btn.style.background = '#52c41a';
            setTimeout(() => {
                btn.textContent = '复制数据';
                btn.style.background = '#1890ff';
            }, 1000);
        } catch (err) {
            console.error('复制失败:', err);
            btn.textContent = '复制失败';
            setTimeout(() => {
                btn.textContent = '复制数据';
            }, 1000);
        } finally {
            document.body.removeChild(textArea);
        }
    }

    // 同时抓取两个指标
    function fetchBothData() {
        fetchCrowdData('exposure_not_purchase_crowd', 'exposure-status', 'exposure-result');
        setTimeout(() => {
            fetchCrowdData('purchase_crowd', 'purchase-status', 'purchase-result');
        }, 1000); // 间隔1秒避免请求过快
    }

    // 核心用户数据抓取功能
    function extractCoreUsersData() {
        const data = {
            A1: { current: 0, change: 0 },
            A2A3: { current: 0, change: 0 },
            A4: { current: 0, change: 0 },
            A5: { current: 0, change: 0 }
        };

        try {
            const selectors = ['.QLsy6.YlUDT', '.QLsy6.FD7L4.YlUDT', '.QLsy6'];
            let cards = [];

            for (const selector of selectors) {
                cards = document.querySelectorAll(selector);
                if (cards.length >= 4) break;
            }

            console.log(`找到 ${cards.length} 个数据卡片`);

            cards.forEach((card, index) => {
                const titleEl = card.querySelector('.PibzG') || card.querySelector('[style*="color: rgb(85, 88, 92)"]');
                const valueEl = card.querySelector('.kudyr span') || card.querySelector('span:not(.wuW5c):not(.cp-change-ratio-value)');
                const changeEl = card.querySelector('.cp-change-ratio-value') || card.querySelector('.P9UU1');

                if (titleEl && valueEl) {
                    const title = titleEl.textContent.trim();
                    const value = parseInt(valueEl.textContent.replace(/[,，]/g, '')) || 0;
                    const change = changeEl ? parseInt(changeEl.textContent.replace(/[,，]/g, '')) || 0 : 0;

                    console.log(`卡片 ${index}: ${title} = ${value} (变化: ${change})`);

                    if (title.includes('商品展示用户')) {
                        data.A1 = { current: value, change: change };
                        console.log('✓ 匹配到商品展示用户(A1):', value);
                    } else if (title.includes('商品兴趣用户')) {
                        data.A2A3 = { current: value, change: change };
                        console.log('✓ 匹配到商品兴趣用户(A2/A3):', value);
                    } else if (title.includes('首购客户')) {
                        data.A4 = { current: value, change: change };
                        console.log('✓ 匹配到首购客户(A4):', value);
                    } else if (title.includes('复购客户')) {
                        data.A5 = { current: value, change: change };
                        console.log('✓ 匹配到复购客户(A5):', value);
                    } else {
                        console.log('⚠ 未匹配的卡片标题:', title);
                    }
                }
            });

            console.log('提取的核心用户数据:', data);

            if (data.A1.current === 0 && data.A2A3.current === 0 && data.A4.current === 0 && data.A5.current === 0) {
                throw new Error('未能提取到有效数据，请确认页面已完全加载');
            }

            return data;
        } catch (error) {
            console.error('数据提取失败:', error);
            throw error;
        }
    }

    // 计算转化率
    function calculateConversionRates(data) {
        const current = {
            A1_A2A3: data.A2A3.current / data.A1.current * 100,
            A2A3_A4: data.A4.current / data.A2A3.current * 100,
            A4_A5: data.A5.current / data.A4.current * 100,
            A1_A4: data.A4.current / data.A1.current * 100
        };

        const previous = {
            A1_A2A3: (data.A2A3.current - data.A2A3.change) / (data.A1.current - data.A1.change) * 100,
            A2A3_A4: (data.A4.current - data.A4.change) / (data.A2A3.current - data.A2A3.change) * 100,
            A4_A5: (data.A5.current - data.A5.change) / (data.A4.current - data.A4.change) * 100,
            A1_A4: (data.A4.current - data.A4.change) / (data.A1.current - data.A1.change) * 100
        };

        const absoluteChange = {
            A1_A2A3: current.A1_A2A3 - previous.A1_A2A3,
            A2A3_A4: current.A2A3_A4 - previous.A2A3_A4,
            A4_A5: current.A4_A5 - previous.A4_A5,
            A1_A4: current.A1_A4 - previous.A1_A4
        };

        const relativeChange = {
            A1_A2A3: absoluteChange.A1_A2A3 / previous.A1_A2A3 * 100,
            A2A3_A4: absoluteChange.A2A3_A4 / previous.A2A3_A4 * 100,
            A4_A5: absoluteChange.A4_A5 / previous.A4_A5 * 100,
            A1_A4: absoluteChange.A1_A4 / previous.A1_A4 * 100
        };

        return { current, previous, absoluteChange, relativeChange };
    }

    // 生成建议
    function generateSuggestions(data, conversions) {
        const suggestions = [];
        const scaleChange = data.A1.change > 0 ? '升' : '降';
        const efficiencyChange = conversions.absoluteChange.A1_A4 > 0 ? '升' : '降';

        if (scaleChange === '降' && efficiencyChange === '升') {
            suggestions.push('规模降、效率升：要看看市场变化的问题，是不是内部的流量衰退，是不是你的品本身在这个赛道里的竞争力不足');
        } else if (scaleChange === '降' && efficiencyChange === '降') {
            suggestions.push('规模降、效率降：要看看人群变化');
        } else if (scaleChange === '升' && efficiencyChange === '升') {
            suggestions.push('规模升、效率升：优先扩规模，提 GMV');
        } else if (scaleChange === '升' && efficiencyChange === '降') {
            suggestions.push('规模升、效率降：人群变泛了需要拉回你的主力人群');
        }

        return suggestions;
    }

    // 创建核心用户分析面板
    function createCoreUsersPanel() {
        const panel = document.createElement('div');
        panel.id = 'core-users-panel';
        panel.innerHTML = `
            <div id="core-users-header">
                <span>核心用户转化率分析</span>
                <div>
                    <button class="btn-minimize" id="minimize-core-panel">−</button>
                    <button class="btn-close" id="close-core-panel">×</button>
                </div>
            </div>
            <div id="core-users-content">
                <div class="button-group">
                    <button class="btn" id="extract-core-data">提取页面数据</button>
                    <button class="btn" id="manual-input-data">手动输入数据</button>
                    <button class="btn" id="export-table">导出表格</button>
                    <button class="btn btn-success" id="ai-analysis">AI分析</button>
                </div>
                <div id="core-users-result"></div>
            </div>
        `;

        document.body.appendChild(panel);

        // 延迟绑定事件
        setTimeout(() => {
            bindCoreUsersPanelEvents();
        }, 100);

        return panel;
    }

    // 绑定核心用户面板事件
    function bindCoreUsersPanelEvents() {
        console.log('开始绑定核心用户面板事件...');

        const buttons = {
            'close-core-panel': () => {
                document.getElementById('core-users-panel').style.display = 'none';
                document.getElementById('floating-button').style.display = 'flex';
            },
            'minimize-core-panel': () => {
                document.getElementById('core-users-panel').style.display = 'none';
                document.getElementById('floating-button').style.display = 'flex';
            },
            'extract-core-data': () => {
                console.log('点击了提取页面数据按钮');
                extractAndAnalyzeCoreUsers();
            },
            'manual-input-data': () => {
                console.log('点击了手动输入数据按钮');
                showManualInputDialog();
            },
            'export-table': () => {
                console.log('点击了导出表格按钮');
                exportTableData();
            },
            'ai-analysis': () => {
                console.log('点击了AI分析按钮');
                performAIAnalysis();
            }
        };

        Object.keys(buttons).forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                console.log(`✓ 绑定按钮: ${buttonId}`);
                button.addEventListener('click', buttons[buttonId]);
            } else {
                console.error(`✗ 找不到按钮: ${buttonId}`);
            }
        });

        console.log('事件绑定完成');
    }

    // 添加直播分析卡片
    function addLiveAnalysisCard() {
        console.log('=== 开始添加直播分析卡片 ===');

        // 检查是否已经添加过
        if (document.getElementById('live-analysis-card')) {
            console.log('直播分析卡片已存在');
            return;
        }

        // 等待页面数据加载
        const waitForData = () => {
            const cardGroup = document.querySelector('.cardGroup-XMhwXm');
            if (!cardGroup) {
                console.log('等待卡片容器加载...');
                setTimeout(waitForData, 1000);
                return;
            }

            const exposureTimesCard = Array.from(cardGroup.querySelectorAll('.card-DT0mYq')).find(card => {
                const title = card.querySelector('.title-PibzGF');
                return title && title.textContent.includes('直播间曝光次数');
            });

            const exposurePeopleCard = Array.from(cardGroup.querySelectorAll('.card-DT0mYq')).find(card => {
                const title = card.querySelector('.title-PibzGF');
                return title && title.textContent.includes('直播间曝光人数');
            });

            if (!exposureTimesCard || !exposurePeopleCard) {
                console.log('等待数据卡片加载...');
                setTimeout(waitForData, 1000);
                return;
            }

            // 提取数据
            const exposureTimesValue = extractCardValue(exposureTimesCard);
            const exposurePeopleValue = extractCardValue(exposurePeopleCard);

            if (exposureTimesValue && exposurePeopleValue) {
                console.log('曝光次数:', exposureTimesValue);
                console.log('曝光人数:', exposurePeopleValue);

                // 计算平均每人曝光次数
                const avgExposurePerPerson = (exposureTimesValue / exposurePeopleValue).toFixed(2);

                // 创建新卡片
                createLiveAnalysisCard(cardGroup, avgExposurePerPerson, exposurePeopleValue, exposureTimesValue);
                console.log('✓ 直播分析卡片创建完成');

                // 添加UV价值计算功能
                setTimeout(() => {
                    // 重置重试计数器
                    window.uvCalculatorRetryCount = 0;
                    addUVValueCalculator();
                }, 1000);
            } else {
                console.log('无法提取到有效数据，重试...');
                setTimeout(waitForData, 1000);
            }
        };

        waitForData();
    }

    // 提取卡片中的数值
    function extractCardValue(card) {
        const valueElement = card.querySelector('.value-kudyrI span span:last-child');
        if (valueElement) {
            const valueText = valueElement.textContent.trim();

            // 检查是否有单位（万）
            const unitElement = card.querySelector('.attach-Bj7xNd');
            let value = parseFloat(valueText.replace(/,/g, '')) || 0;

            // 如果有万单位，需要乘以10000
            if (unitElement && unitElement.textContent.includes('万')) {
                value = value * 10000;
                console.log(`检测到万单位: ${valueText}万 -> ${value}`);
            }

            return Math.round(value);
        }
        return 0;
    }

    // 创建直播分析卡片
    function createLiveAnalysisCard(cardGroup, avgExposurePerPerson, exposurePeople, exposureTimes) {
        const analysisCard = document.createElement('div');
        analysisCard.className = 'card-DT0mYq';
        analysisCard.id = 'live-analysis-card';
        analysisCard.style.cursor = 'pointer';
        analysisCard.innerHTML = `
            <div data-btm="d328531_custom_analysis" data-btm-config="">
                <div class="title-PibzGF cardTitle-K4xIR9">
                    平均每人曝光次数
                    <span data-index-uuid="custom" data-index-name="平均每人曝光次数" class="questionIconTooltip-PGRQ4J md-qOlwfv" style="vertical-align: text-bottom;">
                        <span class="ecom-sp-icon sp-icon-parcel">
                            <svg class="icon" aria-hidden="true">
                                <use href="#icon-yiwen"></use>
                            </svg>
                        </span>
                    </span>
                </div>
                <div class="value-kudyrI valueText-hKLgqL">
                    <span>
                        <span elementtiming="pccp_element"></span>
                        <span>${avgExposurePerPerson}</span>
                    </span>
                    <div class="attach-Bj7xNd" elementtiming="pccp_element"></div>
                </div>
            </div>
            <div class="bottomText-ZNQkoN">
                <div>点击计算曝光成本</div>
                <div>曝光次数(${exposureTimes}) ÷ 曝光人数(${exposurePeople})</div>
                <div class="changeRatioWrap-RAhF_G changeValue-bp05C2">
                    <span class="cp-change-ratio-trend"></span>
                    <span class="value-P9UU1b cp-change-ratio-value" style="color: #1890ff;">点击输入成本</span>
                </div>
            </div>
        `;

        // 插入到卡片组的最后
        cardGroup.appendChild(analysisCard);

        // 添加点击事件显示成本计算
        analysisCard.addEventListener('click', () => {
            showCostCalculationDialog(avgExposurePerPerson, exposurePeople, exposureTimes);
        });

        console.log('直播分析卡片已添加到页面');
    }

    // 显示成本计算对话框
    function showCostCalculationDialog(avgExposurePerPerson, exposurePeople, exposureTimes) {
        // 创建模态对话框
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: Arial, sans-serif;
        `;

        dialog.innerHTML = `
            <div style="
                background: white;
                border-radius: 8px;
                padding: 24px;
                max-width: 450px;
                width: 90%;
                box-shadow: 0 8px 24px rgba(0,0,0,0.15);
            ">
                <h3 style="margin: 0 0 20px 0; color: #1890ff; text-align: center;">
                    📊 直播曝光成本计算器
                </h3>

                <div style="background: #f5f5f5; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                    <div style="margin-bottom: 8px;">
                        <strong>📈 当前数据：</strong>
                    </div>
                    <div style="font-size: 14px; line-height: 1.5;">
                        • 直播间曝光次数：${exposureTimes.toLocaleString()} 次<br>
                        • 直播间曝光人数：${exposurePeople.toLocaleString()} 人<br>
                        • 平均每人曝光次数：${avgExposurePerPerson} 次
                    </div>
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: bold;">
                        💰 请输入全域投放成本（元）：
                    </label>
                    <input
                        type="number"
                        id="total-cost-input"
                        placeholder="例如：1000"
                        style="
                            width: 100%;
                            padding: 10px;
                            border: 2px solid #d9d9d9;
                            border-radius: 4px;
                            font-size: 16px;
                            box-sizing: border-box;
                        "
                    >
                </div>

                <div id="cost-result" style="
                    background: #e6f7ff;
                    border: 1px solid #91d5ff;
                    border-radius: 4px;
                    padding: 15px;
                    margin-bottom: 20px;
                    display: none;
                ">
                    <div style="font-weight: bold; color: #1890ff; margin-bottom: 8px;">
                        🎯 计算结果：
                    </div>
                    <div id="cost-details"></div>
                </div>

                <div style="display: flex; justify-content: space-between; gap: 10px;">
                    <button
                        id="calculate-cost-btn"
                        style="
                            flex: 1;
                            background: #1890ff;
                            color: white;
                            border: none;
                            padding: 12px;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 16px;
                            font-weight: bold;
                        "
                    >
                        计算成本
                    </button>
                    <button
                        id="close-dialog-btn"
                        style="
                            flex: 1;
                            background: #f5f5f5;
                            color: #666;
                            border: 1px solid #ddd;
                            padding: 12px;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 16px;
                        "
                    >
                        关闭
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);

        // 绑定事件
        const costInput = document.getElementById('total-cost-input');
        const calculateBtn = document.getElementById('calculate-cost-btn');
        const closeBtn = document.getElementById('close-dialog-btn');
        const resultDiv = document.getElementById('cost-result');
        const detailsDiv = document.getElementById('cost-details');

                 // 计算成本
         const calculateCost = () => {
             const totalCost = parseFloat(costInput.value);
             if (!totalCost || totalCost <= 0) {
                 alert('请输入有效的成本金额');
                 return;
             }

             // 计算最终结果：总成本 ÷ 直播间曝光人数
             const finalCost = (totalCost / exposurePeople).toFixed(2);

             // 先在弹窗中显示结果
             detailsDiv.innerHTML = `
                 <div style="line-height: 1.6;">
                     💵 <strong>平均获客成本：${finalCost} 元/人</strong><br><br>

                     <div style="font-size: 12px; color: #666;">
                         计算公式：<br>
                         总成本(${totalCost}) ÷ 直播间曝光人数(${exposurePeople}) = ${finalCost}元/人
                     </div>

                     <div style="margin-top: 15px; padding: 10px; background: #f0f9ff; border-radius: 4px; font-size: 12px;">
                         💡 点击"应用到页面"按钮，将结果添加到网页卡片中
                     </div>
                 </div>
             `;
             resultDiv.style.display = 'block';

             // 更新按钮文本和功能
             calculateBtn.textContent = '应用到页面';
             calculateBtn.onclick = () => {
                 // 添加获客成本卡片到页面
                 addCostCardToPage(finalCost, totalCost, exposurePeople);
                 // 关闭弹窗
                 closeDialog();
             };
         };

        // 关闭对话框
        const closeDialog = () => {
            document.body.removeChild(dialog);
        };

        calculateBtn.addEventListener('click', calculateCost);
        closeBtn.addEventListener('click', closeDialog);
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) closeDialog();
        });

        // 回车键计算
        costInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') calculateCost();
        });

                 // 自动聚焦输入框
         setTimeout(() => costInput.focus(), 100);
     }

     // 添加UV价值计算器
     function addUVValueCalculator() {
         console.log('=== 开始添加UV价值计算器 ===');

         // 检查是否已经添加过
         if (document.getElementById('uv-value-calculator')) {
             console.log('UV价值计算器已存在');
             return;
         }

         // 增强的漏斗查找逻辑
         console.log('🔍 查找成交转化漏斗...');

         // 尝试多种选择器来查找转化漏斗
         const funnelSelectors = [
             '.title-ptCmBQ',
             '.title-PibzGF',
             '[class*="title"]',
             'div:contains("成交转化漏斗")',
             'div:contains("转化漏斗")',
             'div:contains("漏斗")'
         ];

         let funnelContainer = null;
         let foundSelector = '';

         for (const selector of funnelSelectors) {
             const elements = document.querySelectorAll(selector);
             console.log(`  尝试选择器 "${selector}": 找到${elements.length}个元素`);

             for (const element of elements) {
                 const text = element.textContent.trim();
                 console.log(`    元素文本: "${text}"`);

                 if (text.includes('成交转化漏斗') || text.includes('转化漏斗') || text.includes('漏斗')) {
                     funnelContainer = element;
                     foundSelector = selector;
                     console.log(`✅ 找到转化漏斗: "${text}" (选择器: ${selector})`);
                     break;
                 }
             }

             if (funnelContainer) break;
         }

         // 如果还是没找到，尝试通过转化率元素定位
         if (!funnelContainer) {
             console.log('🔍 尝试通过转化率元素定位漏斗...');
             const conversionElements = document.querySelectorAll('.conversionRatio-uFnPwa, .conversionLabel-toGSt0, [class*="conversion"], [class*="funnel"]');
             console.log(`  找到${conversionElements.length}个转化率相关元素`);

             if (conversionElements.length > 0) {
                 // 找到最靠近的容器
                 funnelContainer = conversionElements[0].closest('div[style*="margin-right"]') ||
                                  conversionElements[0].closest('div') ||
                                  conversionElements[0].parentElement;
                 foundSelector = '转化率元素定位';
                 console.log('✅ 通过转化率元素定位到容器');
             }
         }

         if (!funnelContainer) {
             console.log('❌ 未找到成交转化漏斗，重试...');
             console.log('页面当前所有包含"漏斗"、"转化"的文本:');

             // 打印页面中所有可能相关的文本
             const allElements = document.querySelectorAll('*');
             for (const el of allElements) {
                 const text = el.textContent?.trim();
                 if (text && (text.includes('漏斗') || text.includes('转化') || text.includes('成交'))) {
                     console.log(`  - "${text}" (${el.tagName}.${el.className})`);
                 }
             }

             // 增加重试次数和时间
             if (!window.uvCalculatorRetryCount) window.uvCalculatorRetryCount = 0;
             window.uvCalculatorRetryCount++;

             if (window.uvCalculatorRetryCount < 10) {
                 console.log(`第${window.uvCalculatorRetryCount}次重试，等待3秒...`);
                 setTimeout(addUVValueCalculator, 3000);
             } else {
                 console.log('❌ 重试次数过多，可能页面结构不匹配');
                 // 强制创建计算器（即使没有找到漏斗）
                 forceCreateUVCalculator();
             }
             return;
         }

         console.log(`✅ 成功找到漏斗容器 (${foundSelector})`);

         // 提取转化率数据
         const conversionData = extractConversionRates();
         if (!conversionData.success) {
             console.log('❌ 提取转化率数据失败，但仍创建计算器...');
             // 即使提取失败，也创建一个手动输入的计算器
             createUVCalculatorCard({ success: false, rates: { watchToExposure: 0, exposureToClick: 0, clickToOrder: 0 } }, funnelContainer);
             return;
         }

         // 创建UV价值计算器卡片
         createUVCalculatorCard(conversionData, funnelContainer);
     }

     // 强制创建UV计算器（当找不到漏斗时）
     function forceCreateUVCalculator() {
         console.log('🚀 强制创建UV价值计算器...');

         // 查找任何可以插入的容器
         const possibleContainers = [
             document.querySelector('.cardGroup-XMhwXm'),
             document.querySelector('[class*="card"]'),
             document.querySelector('main'),
             document.querySelector('body')
         ];

         let targetContainer = null;
         for (const container of possibleContainers) {
             if (container) {
                 targetContainer = container;
                 break;
             }
         }

         if (targetContainer) {
             console.log('✅ 找到插入容器，创建手动输入版本的UV计算器');
             createUVCalculatorCard(
                 { success: false, rates: { watchToExposure: 0, exposureToClick: 0, clickToOrder: 0 } },
                 targetContainer,
                 true // 手动模式
             );
         } else {
             console.log('❌ 无法找到任何可插入的容器');
         }
     }

     // 提取转化率数据
     function extractConversionRates() {
         console.log('🔍 开始提取转化率数据...');

         try {
             // 查找所有转化率元素
             const conversionElements = document.querySelectorAll('.conversionRatio-uFnPwa');
             const conversionLabels = document.querySelectorAll('.conversionLabel-toGSt0');

             console.log(`找到${conversionElements.length}个转化率元素`);
             console.log(`找到${conversionLabels.length}个转化率标签`);

             const rates = {
                 exposureToWatch: 0,     // 观看-商品曝光率
                 watchToExposure: 0,     // 商品曝光-点击率
                 exposureToClick: 0,     // 商品点击-成交转化率
                 clickToOrder: 0,
                 exposureToOrder: 0      // 曝光-成交转化率
             };

             // 遍历所有转化率元素，根据标签匹配对应的数据
             for (let i = 0; i < conversionElements.length && i < conversionLabels.length; i++) {
                 const rateText = conversionElements[i].textContent.trim();
                 const labelText = conversionLabels[i].textContent.trim();
                 const rate = parseFloat(rateText.replace('%', ''));

                 console.log(`转化率 ${i + 1}: ${rateText} - ${labelText}`);

                 if (labelText.includes('观看-商品曝光率')) {
                     rates.watchToExposure = rate;
                     console.log(`✅ 观看-商品曝光率: ${rate}%`);
                 } else if (labelText.includes('商品曝光-点击率')) {
                     rates.exposureToClick = rate;
                     console.log(`✅ 商品曝光-点击率: ${rate}%`);
                 } else if (labelText.includes('商品点击-成交转化率')) {
                     rates.clickToOrder = rate;
                     console.log(`✅ 商品点击-成交转化率: ${rate}%`);
                 } else if (labelText.includes('曝光-成交转化率')) {
                     rates.exposureToOrder = rate;
                     console.log(`✅ 曝光-成交转化率: ${rate}%`);
                 } else if (labelText.includes('曝光-观看率')) {
                     rates.exposureToWatch = rate;
                     console.log(`✅ 曝光-观看率: ${rate}%`);
                 }
             }

             // 验证必要的转化率是否都获取到了
             if (rates.watchToExposure > 0 && rates.exposureToClick > 0 && rates.clickToOrder > 0) {
                 console.log('✅ 成功提取转化率数据:', rates);
                 return { success: true, rates: rates };
             } else {
                 console.log('❌ 缺少必要的转化率数据:', rates);
                 return { success: false, rates: rates };
             }

         } catch (error) {
             console.error('❌ 提取转化率数据失败:', error);
             return { success: false, error: error.message };
         }
     }

     // 创建UV价值计算器卡片
     function createUVCalculatorCard(conversionData, targetContainer = null, isManualMode = false) {
         console.log('📋 创建简洁的UV价值展示...');

         const { rates } = conversionData;
         const isDataAvailable = conversionData.success;

         // 查找转化漏斗的容器
         let funnelElement = targetContainer;
         if (!funnelElement) {
             // 尝试找到包含转化率的漏斗图容器
             const canvasContainer = document.querySelector('canvas').closest('div');
             if (canvasContainer) {
                 funnelElement = canvasContainer.parentElement;
             }
         }

         if (!funnelElement) {
             console.log('❌ 未找到转化漏斗容器');
             return;
         }

         // 创建UV价值输入/显示元素
         const uvElement = document.createElement('div');
         uvElement.id = 'uv-value-calculator';
         uvElement.className = 'yangko-html-annotation';
         uvElement.style.cssText = `
             pointer-events: auto;
             position: absolute;
             left: 0px;
             bottom: -60px;
             z-index: 7;
         `;

         // 根据是否有数据显示不同内容
         if (isDataAvailable && rates.watchToExposure > 0 && rates.exposureToClick > 0 && rates.clickToOrder > 0) {
             // 自动模式：显示输入客单价的界面
             uvElement.innerHTML = `
                 <div>
                     <div class="funnel_wrapper__Qw9N0">
                         <div class="funnel-small-arrow">
                             <div style="display: flex; flex-direction: column;">
                                 <span class="conversionRatio-uFnPwa" id="uv-value-display">输入客单价</span>
                                 <div class="conversionLabel-toGSt0">
                                     UV价值<span class="ecom-sp-icon sp-icon-parcel" style="font-size: 12px; margin-left: 2px;">
                                         <svg class="icon" aria-hidden="true">
                                             <use href="#icon-yiwen"></use>
                                         </svg>
                                     </span>
                                 </div>
                                 <input
                                     type="number"
                                     id="uv-avg-price-input"
                                     placeholder="请输入客单价"
                                     style="
                                         width: 100px;
                                         padding: 4px 6px;
                                         border: 1px solid #ddd;
                                         border-radius: 4px;
                                         font-size: 12px;
                                         margin-top: 4px;
                                         text-align: center;
                                     "
                                 >
                             </div>
                         </div>
                     </div>
                 </div>
             `;
         } else {
             // 手动模式：显示需要手动输入的提示
             uvElement.innerHTML = `
                 <div>
                     <div class="funnel_wrapper__Qw9N0">
                         <div class="funnel-small-arrow" style="cursor: pointer;" id="manual-uv-input">
                             <div style="display: flex; flex-direction: column;">
                                 <span class="conversionRatio-uFnPwa">点击计算</span>
                                 <div class="conversionLabel-toGSt0">
                                     UV价值<span class="ecom-sp-icon sp-icon-parcel" style="font-size: 12px; margin-left: 2px;">
                                         <svg class="icon" aria-hidden="true">
                                             <use href="#icon-yiwen"></use>
                                         </svg>
                                     </span>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>
             `;
         }

         // 插入到转化漏斗底部
         funnelElement.appendChild(uvElement);

         // 绑定事件
         bindSimpleUVEvents(rates, isDataAvailable);

         console.log('✅ UV价值展示创建完成');
     }

     // 绑定简洁UV计算器事件
     function bindSimpleUVEvents(rates, isDataAvailable) {
         const uvDisplay = document.getElementById('uv-value-display');
         const priceInput = document.getElementById('uv-avg-price-input');
         const manualInput = document.getElementById('manual-uv-input');

         if (isDataAvailable && priceInput) {
             // 自动模式：监听客单价输入
             const calculateUV = () => {
                 const avgPrice = parseFloat(priceInput.value);
                 if (avgPrice > 0) {
                     const conversionRate = (rates.watchToExposure / 100) * (rates.exposureToClick / 100) * (rates.clickToOrder / 100);
                     const uvValue = conversionRate * avgPrice;
                     uvDisplay.textContent = `¥${uvValue.toFixed(2)}`;
                     uvDisplay.style.color = '#52c41a';

                     console.log(`UV价值计算: ${rates.watchToExposure}% × ${rates.exposureToClick}% × ${rates.clickToOrder}% × ¥${avgPrice} = ¥${uvValue.toFixed(2)}`);
                 } else {
                     uvDisplay.textContent = '输入客单价';
                     uvDisplay.style.color = '';
                 }
             };

             priceInput.addEventListener('input', calculateUV);
             priceInput.addEventListener('change', calculateUV);
         } else if (manualInput) {
             // 手动模式：点击打开输入对话框
             manualInput.addEventListener('click', () => {
                 showManualUVDialog();
             });
         }
     }

     // 显示手动UV计算对话框
     function showManualUVDialog() {
         const dialog = document.createElement('div');
         dialog.style.cssText = `
             position: fixed;
             top: 0;
             left: 0;
             width: 100%;
             height: 100%;
             background: rgba(0,0,0,0.5);
             z-index: 10000;
             display: flex;
             justify-content: center;
             align-items: center;
             font-family: Arial, sans-serif;
         `;

         dialog.innerHTML = `
             <div style="
                 background: white;
                 border-radius: 8px;
                 padding: 24px;
                 max-width: 400px;
                 width: 90%;
                 box-shadow: 0 8px 24px rgba(0,0,0,0.15);
             ">
                 <h3 style="margin: 0 0 20px 0; color: #1890ff; text-align: center;">
                     💰 UV价值计算器
                 </h3>

                 <div style="background: #f0f9ff; padding: 12px; border-radius: 6px; margin-bottom: 16px; font-size: 12px;">
                     <strong>计算公式：</strong><br>
                     UV价值 = 观看-商品曝光率 × 商品曝光-点击率 × 商品点击-成交转化率 × 客单价
                 </div>

                 <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
                     <div>
                         <label style="display: block; margin-bottom: 4px; font-size: 12px; font-weight: bold;">观看-商品曝光率(%):</label>
                         <input type="number" id="manual-watch-rate" placeholder="97.23" step="0.01" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
                     </div>
                     <div>
                         <label style="display: block; margin-bottom: 4px; font-size: 12px; font-weight: bold;">商品曝光-点击率(%):</label>
                         <input type="number" id="manual-click-rate" placeholder="22.66" step="0.01" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
                     </div>
                     <div>
                         <label style="display: block; margin-bottom: 4px; font-size: 12px; font-weight: bold;">商品点击-成交转化率(%):</label>
                         <input type="number" id="manual-order-rate" placeholder="8.38" step="0.01" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
                     </div>
                     <div>
                         <label style="display: block; margin-bottom: 4px; font-size: 12px; font-weight: bold;">客单价(元):</label>
                         <input type="number" id="manual-avg-price" placeholder="100" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
                     </div>
                 </div>

                 <div id="manual-result" style="
                     display: none;
                     background: #e6f7ff;
                     border: 1px solid #91d5ff;
                     border-radius: 4px;
                     padding: 12px;
                     margin-bottom: 16px;
                     text-align: center;
                 "></div>

                 <div style="display: flex; justify-content: space-between; gap: 10px;">
                     <button id="manual-calculate" style="
                         flex: 1;
                         background: #1890ff;
                         color: white;
                         border: none;
                         padding: 10px;
                         border-radius: 4px;
                         cursor: pointer;
                         font-size: 14px;
                         font-weight: bold;
                     ">计算UV价值</button>
                     <button id="manual-close" style="
                         flex: 1;
                         background: #f5f5f5;
                         color: #666;
                         border: 1px solid #ddd;
                         padding: 10px;
                         border-radius: 4px;
                         cursor: pointer;
                         font-size: 14px;
                     ">关闭</button>
                 </div>
             </div>
         `;

         document.body.appendChild(dialog);

         // 绑定事件
         const calculateBtn = document.getElementById('manual-calculate');
         const closeBtn = document.getElementById('manual-close');
         const resultDiv = document.getElementById('manual-result');

         calculateBtn.addEventListener('click', () => {
             const watchRate = parseFloat(document.getElementById('manual-watch-rate').value);
             const clickRate = parseFloat(document.getElementById('manual-click-rate').value);
             const orderRate = parseFloat(document.getElementById('manual-order-rate').value);
             const avgPrice = parseFloat(document.getElementById('manual-avg-price').value);

             if (!watchRate || !clickRate || !orderRate || !avgPrice) {
                 alert('请填写所有字段');
                 return;
             }

             const conversionRate = (watchRate / 100) * (clickRate / 100) * (orderRate / 100);
             const uvValue = conversionRate * avgPrice;

             resultDiv.style.display = 'block';
             resultDiv.innerHTML = `
                 <div style="font-size: 12px; color: #666; margin-bottom: 8px;">计算过程：</div>
                 <div style="font-size: 12px; margin-bottom: 8px;">
                     ${watchRate}% × ${clickRate}% × ${orderRate}% × ¥${avgPrice} = ¥${uvValue.toFixed(2)}
                 </div>
                 <div style="font-size: 16px; font-weight: bold; color: #1890ff;">
                     💰 UV价值：¥${uvValue.toFixed(2)}
                 </div>
             `;

             // 更新页面显示
             const uvDisplay = document.getElementById('uv-value-display');
             const manualDisplay = document.querySelector('#manual-uv-input .conversionRatio-uFnPwa');
             if (uvDisplay) {
                 uvDisplay.textContent = `¥${uvValue.toFixed(2)}`;
                 uvDisplay.style.color = '#52c41a';
             } else if (manualDisplay) {
                 manualDisplay.textContent = `¥${uvValue.toFixed(2)}`;
                 manualDisplay.style.color = '#52c41a';
             }
         });

         closeBtn.addEventListener('click', () => {
             document.body.removeChild(dialog);
         });

         dialog.addEventListener('click', (e) => {
             if (e.target === dialog) {
                 document.body.removeChild(dialog);
             }
         });
     }



     // 添加UV价值卡片到页面
     function addUVValueCardToPage(uvValue, rates, avgOrderValue) {
         console.log('📌 添加UV价值卡片到页面...');

         // 查找卡片容器
         const cardGroup = document.querySelector('.cardGroup-XMhwXm');
         if (!cardGroup) {
             alert('未找到卡片容器');
             return;
         }

         // 移除可能存在的旧UV价值卡片
         const existingUVCard = document.getElementById('uv-value-card');
         if (existingUVCard) {
             existingUVCard.remove();
         }

         // 创建UV价值卡片
         const uvCard = document.createElement('div');
         uvCard.className = 'card-DT0mYq';
         uvCard.id = 'uv-value-card';
         uvCard.innerHTML = `
             <div data-btm="d328531_uv_value" data-btm-config="">
                 <div class="title-PibzGF cardTitle-K4xIR9">
                     UV价值
                     <span data-index-uuid="uv" data-index-name="UV价值" class="questionIconTooltip-PGRQ4J md-qOlwfv" style="vertical-align: text-bottom;">
                         <span class="ecom-sp-icon sp-icon-parcel">
                             <svg class="icon" aria-hidden="true">
                                 <use href="#icon-yiwen"></use>
                             </svg>
                         </span>
                     </span>
                 </div>
                 <div class="value-kudyrI valueText-hKLgqL">
                     <span>
                         <span elementtiming="pccp_element"></span>
                         <span>¥${uvValue.toFixed(2)}</span>
                     </span>
                     <div class="attach-Bj7xNd" elementtiming="pccp_element"></div>
                 </div>
             </div>
             <div class="bottomText-ZNQkoN">
                 <div>转化率链条计算</div>
                 <div>${rates.watchToExposure}% × ${rates.exposureToClick}% × ${rates.clickToOrder}% × ¥${avgOrderValue}</div>
                 <div class="changeRatioWrap-RAhF_G changeValue-bp05C2">
                     <span class="cp-change-ratio-trend"></span>
                     <span class="value-P9UU1b cp-change-ratio-value" style="color: #52c41a;">已计算</span>
                 </div>
             </div>
         `;

         // 添加点击事件重新计算
         uvCard.addEventListener('click', () => {
             const calculator = document.getElementById('uv-value-calculator');
             if (calculator) {
                 calculator.scrollIntoView({ behavior: 'smooth' });
                 const input = document.getElementById('avg-order-value-input');
                 if (input) {
                     setTimeout(() => input.focus(), 500);
                 }
             }
         });

         uvCard.style.cursor = 'pointer';
         uvCard.title = '点击重新计算UV价值';

         // 添加到卡片组
         cardGroup.appendChild(uvCard);

         console.log('✅ UV价值卡片已添加到页面');
     }

     // 添加获客成本卡片到页面
     function addCostCardToPage(finalCost, totalCost, exposurePeople) {
         console.log('=== 添加获客成本卡片到页面 ===');

         // 移除可能存在的旧成本卡片
         const existingCostCard = document.getElementById('cost-analysis-card');
         if (existingCostCard) {
             existingCostCard.remove();
         }

         // 找到卡片容器
         const cardGroup = document.querySelector('.cardGroup-XMhwXm');
         if (!cardGroup) {
             alert('无法找到卡片容器，请稍后重试');
             return;
         }

         // 创建获客成本卡片
         const costCard = document.createElement('div');
         costCard.className = 'card-DT0mYq';
         costCard.id = 'cost-analysis-card';
         costCard.innerHTML = `
             <div data-btm="d328531_cost_analysis" data-btm-config="">
                 <div class="title-PibzGF cardTitle-K4xIR9">
                     平均获客成本
                     <span data-index-uuid="cost" data-index-name="平均获客成本" class="questionIconTooltip-PGRQ4J md-qOlwfv" style="vertical-align: text-bottom;">
                         <span class="ecom-sp-icon sp-icon-parcel">
                             <svg class="icon" aria-hidden="true">
                                 <use href="#icon-yiwen"></use>
                             </svg>
                         </span>
                     </span>
                 </div>
                 <div class="value-kudyrI valueText-hKLgqL">
                     <span>
                         <span elementtiming="pccp_element"></span>
                         <span>¥${finalCost}</span>
                     </span>
                     <div class="attach-Bj7xNd" elementtiming="pccp_element"></div>
                 </div>
             </div>
             <div class="bottomText-ZNQkoN">
                 <div>基于全域投放成本</div>
                 <div>总成本 ¥${totalCost} ÷ 曝光人数 ${exposurePeople.toLocaleString()}</div>
                 <div class="changeRatioWrap-RAhF_G changeValue-bp05C2">
                     <span class="cp-change-ratio-trend"></span>
                     <span class="value-P9UU1b cp-change-ratio-value" style="color: #52c41a;">已计算</span>
                 </div>
             </div>
         `;

         // 添加点击事件重新计算
         costCard.addEventListener('click', () => {
             const avgExposurePerPerson = (document.querySelector('#live-analysis-card .value-kudyrI span span:last-child')?.textContent || '0');
             // 重新获取曝光次数
             const exposureTimesCard = Array.from(document.querySelectorAll('.card-DT0mYq')).find(card => {
                 const title = card.querySelector('.title-PibzGF');
                 return title && title.textContent.includes('直播间曝光次数');
             });
             const exposureTimesValue = exposureTimesCard ? extractCardValue(exposureTimesCard) : 0;
             showCostCalculationDialog(avgExposurePerPerson, exposurePeople, exposureTimesValue);
         });

         costCard.style.cursor = 'pointer';

         // 插入到分析卡片之后
         const analysisCard = document.getElementById('live-analysis-card');
         if (analysisCard && analysisCard.nextSibling) {
             cardGroup.insertBefore(costCard, analysisCard.nextSibling);
         } else {
             cardGroup.appendChild(costCard);
         }

         console.log('✓ 获客成本卡片已添加到页面');

         // 显示成功消息
         showSuccessMessage();
     }

     // 显示成功消息
     function showSuccessMessage() {
         const message = document.createElement('div');
         message.style.cssText = `
             position: fixed;
             top: 20px;
             right: 20px;
             background: #52c41a;
             color: white;
             padding: 12px 20px;
             border-radius: 6px;
             box-shadow: 0 4px 12px rgba(0,0,0,0.15);
             z-index: 10001;
             font-family: Arial, sans-serif;
             font-size: 14px;
             font-weight: bold;
         `;
         message.textContent = '🎉 获客成本已添加到页面！';

         document.body.appendChild(message);

         // 3秒后自动消失
         setTimeout(() => {
             if (document.body.contains(message)) {
                 document.body.removeChild(message);
             }
         }, 3000);
    }

    // 提取并分析核心用户数据
    function extractAndAnalyzeCoreUsers() {
        console.log('开始提取核心用户数据...');
        const resultEl = document.getElementById('core-users-result');

        if (!resultEl) {
            console.error('找不到结果显示区域！');
            alert('错误：找不到结果显示区域');
            return;
        }

        resultEl.innerHTML = '<div class="api-status status-loading">正在提取页面数据...</div>';

        try {
            const data = extractCoreUsersData();
            console.log('数据提取成功:', data);
            analyzeUserData(data);
        } catch (error) {
            console.error('数据提取失败:', error);
            resultEl.innerHTML = `
                <div class="api-status status-error">
                    <strong>数据提取失败: ${error.message}</strong>
                    <p>请尝试使用"手动输入数据"功能</p>
                </div>
            `;
        }
    }

    // 导出表格数据
    function exportTableData() {
        console.log('尝试导出表格数据...');

        if (!window.coreUsersAnalysisData) {
            alert('请先提取或输入数据进行分析');
            return;
        }

        const { data, conversions, suggestions, analysisTime } = window.coreUsersAnalysisData;

        // 获取当前导出时间
        const exportTime = new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        const csvContent = [
            '核心用户转化率分析报告',
            `分析时间: ${analysisTime || '未知'}`,
            `导出时间: ${exportTime}`,
            '',
            '规模数据表',
            '指标,A1(展示),A2/A3(兴趣),A4(首购),A5(复购)',
            `本周期规模,${data.A1.current},${data.A2A3.current},${data.A4.current},${data.A5.current}`,
            `上周期规模,${data.A1.current - data.A1.change},${data.A2A3.current - data.A2A3.change},${data.A4.current - data.A4.change},${data.A5.current - data.A5.change}`,
            `规模变化,${data.A1.change},${data.A2A3.change},${data.A4.change},${data.A5.change}`,
            '',
            '转化率数据表',
            '转化率,A1-A2/A3,A2/A3-A4,A4-A5,A1-A4',
            `本周期转化率,${conversions.current.A1_A2A3.toFixed(2)}%,${conversions.current.A2A3_A4.toFixed(2)}%,${conversions.current.A4_A5.toFixed(2)}%,${conversions.current.A1_A4.toFixed(2)}%`,
            `上周期转化率,${conversions.previous.A1_A2A3.toFixed(2)}%,${conversions.previous.A2A3_A4.toFixed(2)}%,${conversions.previous.A4_A5.toFixed(2)}%,${conversions.previous.A1_A4.toFixed(2)}%`,
            `转化率变化(绝对值),${conversions.absoluteChange.A1_A2A3.toFixed(2)}%,${conversions.absoluteChange.A2A3_A4.toFixed(2)}%,${conversions.absoluteChange.A4_A5.toFixed(2)}%,${conversions.absoluteChange.A1_A4.toFixed(2)}%`,
            `转化率变化(比例),${conversions.relativeChange.A1_A2A3.toFixed(2)}%,${conversions.relativeChange.A2A3_A4.toFixed(2)}%,${conversions.relativeChange.A4_A5.toFixed(2)}%,${conversions.relativeChange.A1_A4.toFixed(2)}%`
        ];

        // 添加数据分析建议
        if (suggestions && suggestions.length > 0) {
            csvContent.push('');
            csvContent.push('数据分析建议');
            csvContent.push('序号,建议内容');
            suggestions.forEach((suggestion, index) => {
                // 处理建议文本中的逗号，用分号替换以避免CSV格式问题
                const cleanSuggestion = suggestion.replace(/,/g, '；');
                csvContent.push(`${index + 1},"${cleanSuggestion}"`);
            });
        }

        const csvString = csvContent.join('\n');

        const blob = new Blob(['\ufeff' + csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `核心用户转化率分析_${new Date().toISOString().slice(0, 10)}.csv`;
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // 手动输入数据对话框
    function showManualInputDialog() {
        console.log('显示手动输入对话框...');
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: white; border: 2px solid #1890ff; border-radius: 8px; padding: 20px;
            z-index: 10000; box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-family: Arial, sans-serif;
        `;

        dialog.innerHTML = `
            <h3 style="margin: 0 0 15px 0; color: #1890ff;">手动输入核心用户数据</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                <div style="font-weight: bold; text-align: center;">指标</div>
                <div style="font-weight: bold; text-align: center;">当前值</div>
                <div style="font-weight: bold; text-align: center;">变化值</div>

                <div>商品展示用户(A1):</div>
                <input type="number" id="a1-current" placeholder="2521" style="padding: 5px; border: 1px solid #ddd; border-radius: 4px;">
                <input type="number" id="a1-change" placeholder="1473" style="padding: 5px; border: 1px solid #ddd; border-radius: 4px;">

                <div>商品兴趣用户(A2/A3):</div>
                <input type="number" id="a2a3-current" placeholder="286" style="padding: 5px; border: 1px solid #ddd; border-radius: 4px;">
                <input type="number" id="a2a3-change" placeholder="187" style="padding: 5px; border: 1px solid #ddd; border-radius: 4px;">

                <div>首购客户(A4):</div>
                <input type="number" id="a4-current" placeholder="332" style="padding: 5px; border: 1px solid #ddd; border-radius: 4px;">
                <input type="number" id="a4-change" placeholder="282" style="padding: 5px; border: 1px solid #ddd; border-radius: 4px;">

                <div>复购客户(A5):</div>
                <input type="number" id="a5-current" placeholder="21" style="padding: 5px; border: 1px solid #ddd; border-radius: 4px;">
                <input type="number" id="a5-change" placeholder="17" style="padding: 5px; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            <div style="text-align: center;">
                <button id="confirm-manual-input" style="background: #1890ff; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-right: 10px;">确认分析</button>
                <button id="cancel-manual-input" style="background: #f5f5f5; color: #666; border: 1px solid #ddd; padding: 8px 16px; border-radius: 4px; cursor: pointer;">取消</button>
            </div>
        `;

        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); z-index: 9999;
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(dialog);

        document.getElementById('confirm-manual-input').addEventListener('click', () => {
            const data = {
                A1: {
                    current: parseInt(document.getElementById('a1-current').value) || 0,
                    change: parseInt(document.getElementById('a1-change').value) || 0
                },
                A2A3: {
                    current: parseInt(document.getElementById('a2a3-current').value) || 0,
                    change: parseInt(document.getElementById('a2a3-change').value) || 0
                },
                A4: {
                    current: parseInt(document.getElementById('a4-current').value) || 0,
                    change: parseInt(document.getElementById('a4-change').value) || 0
                },
                A5: {
                    current: parseInt(document.getElementById('a5-current').value) || 0,
                    change: parseInt(document.getElementById('a5-change').value) || 0
                }
            };

            document.body.removeChild(dialog);
            document.body.removeChild(overlay);
            analyzeUserData(data);
        });

        document.getElementById('cancel-manual-input').addEventListener('click', () => {
            document.body.removeChild(dialog);
            document.body.removeChild(overlay);
        });

        overlay.addEventListener('click', () => {
            document.body.removeChild(dialog);
            document.body.removeChild(overlay);
        });
    }

    // AI分析功能
    function performAIAnalysis() {
        if (!window.coreUsersAnalysisData) {
            alert('请先提取或输入数据进行分析');
            return;
        }

        const { data, conversions, suggestions, analysisTime } = window.coreUsersAnalysisData;

        // 生成表格数据文本
        const analysisText = `
核心用户转化率分析报告
分析时间: ${analysisTime || '未知'}

规模数据表:
- A1(展示用户): 本周期${data.A1.current}, 上周期${data.A1.current - data.A1.change}, 变化${data.A1.change > 0 ? '+' : ''}${data.A1.change}
- A2/A3(兴趣用户): 本周期${data.A2A3.current}, 上周期${data.A2A3.current - data.A2A3.change}, 变化${data.A2A3.change > 0 ? '+' : ''}${data.A2A3.change}
- A4(首购客户): 本周期${data.A4.current}, 上周期${data.A4.current - data.A4.change}, 变化${data.A4.change > 0 ? '+' : ''}${data.A4.change}
- A5(复购客户): 本周期${data.A5.current}, 上周期${data.A5.current - data.A5.change}, 变化${data.A5.change > 0 ? '+' : ''}${data.A5.change}

转化率数据表:
- A1→A2/A3转化率: 本周期${conversions.current.A1_A2A3.toFixed(2)}%, 上周期${conversions.previous.A1_A2A3.toFixed(2)}%, 变化${conversions.absoluteChange.A1_A2A3.toFixed(2)}%
- A2/A3→A4转化率: 本周期${conversions.current.A2A3_A4.toFixed(2)}%, 上周期${conversions.previous.A2A3_A4.toFixed(2)}%, 变化${conversions.absoluteChange.A2A3_A4.toFixed(2)}%
- A4→A5转化率: 本周期${conversions.current.A4_A5.toFixed(2)}%, 上周期${conversions.previous.A4_A5.toFixed(2)}%, 变化${conversions.absoluteChange.A4_A5.toFixed(2)}%
- A1→A4整体转化率: 本周期${conversions.current.A1_A4.toFixed(2)}%, 上周期${conversions.previous.A1_A4.toFixed(2)}%, 变化${conversions.absoluteChange.A1_A4.toFixed(2)}%

阅读上面的链接，分析`;

        // URL编码
        const encodedPrompt = encodeURIComponent(analysisText);
        const kimiUrl = `https://kimi.moonshot.cn/_prefill_chat?prefill_prompt=${encodedPrompt}&send_immediately=true&force_search=true`;

        // 在新窗口打开
        window.open(kimiUrl, '_blank');
    }

    // 分析用户数据
    function analyzeUserData(data) {
        const resultEl = document.getElementById('core-users-result');

        try {
            const conversions = calculateConversionRates(data);
            const suggestions = generateSuggestions(data, conversions);

            // 获取当前时间
            const now = new Date();
            const currentTime = now.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });

            const timeInfo = `
                <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 4px; padding: 8px; margin-bottom: 10px; font-size: 12px; color: #0369a1;">
                    📊 分析时间: ${currentTime}
                </div>
            `;

            const scaleTable = `
                <h3>规模数据表</h3>
                <table class="analysis-table">
                    <thead>
                        <tr><th>指标</th><th>A1(展示)</th><th>A2/A3(兴趣)</th><th>A4(首购)</th><th>A5(复购)</th></tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>本周期规模</td>
                            <td>${data.A1.current}</td><td>${data.A2A3.current}</td><td>${data.A4.current}</td><td>${data.A5.current}</td>
                        </tr>
                        <tr>
                            <td>上周期规模</td>
                            <td>${data.A1.current - data.A1.change}</td>
                            <td>${data.A2A3.current - data.A2A3.change}</td>
                            <td>${data.A4.current - data.A4.change}</td>
                            <td>${data.A5.current - data.A5.change}</td>
                        </tr>
                        <tr>
                            <td>规模变化</td>
                            <td class="${data.A1.change > 0 ? 'increase' : 'decrease'}">${data.A1.change > 0 ? '+' : ''}${data.A1.change}</td>
                            <td class="${data.A2A3.change > 0 ? 'increase' : 'decrease'}">${data.A2A3.change > 0 ? '+' : ''}${data.A2A3.change}</td>
                            <td class="${data.A4.change > 0 ? 'increase' : 'decrease'}">${data.A4.change > 0 ? '+' : ''}${data.A4.change}</td>
                            <td class="${data.A5.change > 0 ? 'increase' : 'decrease'}">${data.A5.change > 0 ? '+' : ''}${data.A5.change}</td>
                        </tr>
                    </tbody>
                </table>
            `;

            const conversionTable = `
                <h3>转化率数据表</h3>
                <table class="analysis-table">
                    <thead>
                        <tr><th>转化率</th><th>A1-A2/A3</th><th>A2/A3-A4</th><th>A4-A5</th><th>A1-A4</th></tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>本周期转化率</td>
                            <td>${conversions.current.A1_A2A3.toFixed(2)}%</td>
                            <td>${conversions.current.A2A3_A4.toFixed(2)}%</td>
                            <td>${conversions.current.A4_A5.toFixed(2)}%</td>
                            <td>${conversions.current.A1_A4.toFixed(2)}%</td>
                        </tr>
                        <tr>
                            <td>上周期转化率</td>
                            <td>${conversions.previous.A1_A2A3.toFixed(2)}%</td>
                            <td>${conversions.previous.A2A3_A4.toFixed(2)}%</td>
                            <td>${conversions.previous.A4_A5.toFixed(2)}%</td>
                            <td>${conversions.previous.A1_A4.toFixed(2)}%</td>
                        </tr>
                        <tr>
                            <td>转化率变化(绝对值)</td>
                            <td class="${conversions.absoluteChange.A1_A2A3 > 0 ? 'increase' : 'decrease'}">${conversions.absoluteChange.A1_A2A3 > 0 ? '+' : ''}${conversions.absoluteChange.A1_A2A3.toFixed(2)}%</td>
                            <td class="${conversions.absoluteChange.A2A3_A4 > 0 ? 'increase' : 'decrease'}">${conversions.absoluteChange.A2A3_A4 > 0 ? '+' : ''}${conversions.absoluteChange.A2A3_A4.toFixed(2)}%</td>
                            <td class="${conversions.absoluteChange.A4_A5 > 0 ? 'increase' : 'decrease'}">${conversions.absoluteChange.A4_A5 > 0 ? '+' : ''}${conversions.absoluteChange.A4_A5.toFixed(2)}%</td>
                            <td class="${conversions.absoluteChange.A1_A4 > 0 ? 'increase' : 'decrease'}">${conversions.absoluteChange.A1_A4 > 0 ? '+' : ''}${conversions.absoluteChange.A1_A4.toFixed(2)}%</td>
                        </tr>
                        <tr>
                            <td>转化率变化(比例)</td>
                            <td class="${conversions.relativeChange.A1_A2A3 > 0 ? 'increase' : 'decrease'}">${conversions.relativeChange.A1_A2A3 > 0 ? '+' : ''}${conversions.relativeChange.A1_A2A3.toFixed(2)}%</td>
                            <td class="${conversions.relativeChange.A2A3_A4 > 0 ? 'increase' : 'decrease'}">${conversions.relativeChange.A2A3_A4 > 0 ? '+' : ''}${conversions.relativeChange.A2A3_A4.toFixed(2)}%</td>
                            <td class="${conversions.relativeChange.A4_A5 > 0 ? 'increase' : 'decrease'}">${conversions.relativeChange.A4_A5 > 0 ? '+' : ''}${conversions.relativeChange.A4_A5.toFixed(2)}%</td>
                            <td class="${conversions.relativeChange.A1_A4 > 0 ? 'increase' : 'decrease'}">${conversions.relativeChange.A1_A4 > 0 ? '+' : ''}${conversions.relativeChange.A1_A4.toFixed(2)}%</td>
                        </tr>
                    </tbody>
                </table>
            `;

            const suggestionHtml = suggestions.length > 0 ? `
                <div class="suggestion-box">
                    <div class="suggestion-title">数据分析建议</div>
                    ${suggestions.map(s => `<div>• ${s}</div>`).join('')}
                </div>
            ` : '';

            resultEl.innerHTML = timeInfo + scaleTable + conversionTable + suggestionHtml;
            window.coreUsersAnalysisData = { data, conversions, suggestions, analysisTime: currentTime };

        } catch (error) {
            resultEl.innerHTML = `<div class="api-status status-error">数据分析失败: ${error.message}</div>`;
        }
    }

    // 表格增强功能 - 为商品分析页面添加新列（手动计算版本）
    function enhanceGoodsAnalysisTable() {
        console.log('🚀 启动表格增强功能（手动计算版本）...');

        let isProcessing = false;
        let lastUrl = window.location.href;
        let manualButton = null;

        // 创建手动计算按钮
        const createManualButton = () => {
            if (manualButton) return manualButton;

            manualButton = document.createElement('button');
            manualButton.id = 'manual-calculate-btn';
            manualButton.innerHTML = '🔢 手动计算指标';
            manualButton.title = '点击重新计算当前页面的UV价值、客单价、OPM、GPM';

            document.body.appendChild(manualButton);

            // 绑定点击事件
            manualButton.addEventListener('click', (event) => {
                if (isProcessing) {
                    console.log('⏳ 正在处理中，请稍候...');
                    return;
                }

                // 判断是自动点击还是用户点击
                const isAutoClick = event.isTrusted === false || manualButton.innerHTML.includes('自动计算');

                if (isAutoClick) {
                    console.log('🤖 自动触发计算按钮');
                } else {
                    console.log('👆 用户手动点击计算按钮');
                }

                manualCalculate(isAutoClick);
            });

            console.log('✅ 手动计算按钮已创建');
            return manualButton;
        };

        // 手动计算函数
        const manualCalculate = async (isAutoClick = false) => {
            try {
                isProcessing = true;

                // 更新按钮状态
                manualButton.className = 'processing';
                manualButton.innerHTML = isAutoClick ? '🤖 自动计算中...' : '⏳ 手动计算中...';

                console.log(`🔧 开始${isAutoClick ? '自动' : '手动'}计算...`);

                const table = document.querySelector('.ecom-table');
                if (!table) {
                    throw new Error('未找到表格');
                }

                // 处理表格
                const processedCount = await processTableDirectly();

                // 成功状态
                manualButton.className = 'success';
                manualButton.innerHTML = isAutoClick ?
                    `🤖 自动完成 (${processedCount}行)` :
                    `✅ 计算完成 (${processedCount}行)`;

                console.log(`✅ ${isAutoClick ? '自动' : '手动'}计算完成，处理了${processedCount}行数据`);

                // 3秒后恢复按钮状态
                setTimeout(() => {
                    manualButton.className = '';
                    manualButton.innerHTML = '🔢 手动计算指标';
                    manualButton.style.background = '';
                }, 3000);

            } catch (error) {
                console.error(`❌ ${isAutoClick ? '自动' : '手动'}计算失败:`, error);

                // 错误状态
                manualButton.className = '';
                manualButton.innerHTML = isAutoClick ? '🤖 自动失败' : '❌ 计算失败';
                manualButton.style.background = 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)';

                // 3秒后恢复按钮状态
                setTimeout(() => {
                    manualButton.style.background = '';
                    manualButton.innerHTML = '🔢 手动计算指标';
                }, 3000);

            } finally {
                isProcessing = false;
            }
        };

        // 简单直接的表格增强函数（自动）
        const enhanceTable = () => {
            if (isProcessing) {
                console.log('⏳ 正在处理中，跳过自动计算...');
                return;
            }

            try {
                isProcessing = true;
                console.log('🔧 开始自动表格增强...');

                const table = document.querySelector('.ecom-table');
                if (!table) {
                    console.log('❌ 未找到表格');
                    return;
                }

                // 显示手动计算按钮
                if (manualButton) {
                    manualButton.style.display = 'block';
                }

                // 仅在首次加载时自动处理
                if (!document.querySelector('.custom-column')) {
                    console.log('🎯 首次加载，执行自动计算...');
                    processTableDirectly();
                } else {
                    console.log('💡 已有自定义列，请使用手动计算按钮重新计算');
                }

                console.log('✅ 表格增强完成');
            } catch (error) {
                console.error('❌ 表格增强失败:', error);
            } finally {
                isProcessing = false;
            }
        };

        // 监听页面变化
        const startMonitoring = () => {
            console.log('📡 开始监听页面变化...');

            // 简单的轮询监听
            setInterval(() => {
                const currentUrl = window.location.href;
                if (currentUrl !== lastUrl) {
                    console.log('🔄 检测到URL变化:', currentUrl);
                    lastUrl = currentUrl;

                    // 页面变化时自动点击按钮
                    if (manualButton && !isProcessing) {
                        console.log('🤖 页面变化，准备自动点击计算按钮...');
                        manualButton.style.display = 'block';
                        manualButton.innerHTML = '🔄 自动计算中...';
                        manualButton.style.background = 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)';

                        // 延迟2秒等待页面稳定后自动点击
                        setTimeout(() => {
                            if (!isProcessing && manualButton) {
                                console.log('🎯 自动点击计算按钮');
                                manualButton.click();
                            }
                        }, 2000);
                    }
                }
            }, 1000);
        };

        // 初始化
        setTimeout(() => {
            createManualButton();
            enhanceTable();
            startMonitoring();
        }, 3000);
    }

    // 添加新的表头列
    function addNewColumns() {
        const headerRow = document.querySelector('.ecom-table thead tr');
        if (!headerRow) return;

        // 检查是否已经有自定义列，如果有则不重复添加
        if (headerRow.querySelector('.custom-column')) {
            console.log('表头已存在自定义列，跳过添加');
            return;
        }

        // 找到商品信息列（第二列）
        const productInfoHeader = headerRow.children[1];
        if (!productInfoHeader) return;

        // 创建排序图标HTML
        const sortIconsHTML = `
            <span class="ecom-table-column-sorter ecom-table-column-sorter-full" style="margin-left: 4px;">
                <span class="ecom-table-column-sorter-inner">
                    <span role="img" aria-label="caret-up" class="anticon anticon-caret-up ecom-table-column-sorter-up">
                        <svg viewBox="0 0 1024 1024" focusable="false" data-icon="caret-up" width="0.8em" height="0.8em" fill="currentColor" aria-hidden="true">
                            <path d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z"></path>
                        </svg>
                    </span>
                    <span role="img" aria-label="caret-down" class="anticon anticon-caret-down ecom-table-column-sorter-down">
                        <svg viewBox="0 0 1024 1024" focusable="false" data-icon="caret-down" width="0.8em" height="0.8em" fill="currentColor" aria-hidden="true">
                            <path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"></path>
                        </svg>
                    </span>
                </span>
            </span>
        `;

        // 创建可拖拽列
        function createResizableHeader(title, className = 'custom-column') {
            const header = document.createElement('th');
            header.className = `ecom-table-cell ecom-table-column-has-sorters ${className}`;
            header.setAttribute('tabindex', '0');
            header.style.textAlign = 'right';
            header.style.width = '80px';
            header.style.padding = '8px 6px';
            header.innerHTML = `
                <div class="ecom-table-column-sorters" style="display: flex; align-items: center; justify-content: flex-end;">
                    <span class="ecom-table-column-title" style="font-size: 12px;">${title}</span>
                    ${sortIconsHTML}
                </div>
                <div class="resize-handle" style="position: absolute; top: 0; right: 0; width: 4px; height: 100%; cursor: col-resize; background: transparent; z-index: 10;"></div>
            `;

            // 添加拖拽功能
            const resizeHandle = header.querySelector('.resize-handle');
            let isResizing = false;
            let startX = 0;
            let startWidth = 0;

            resizeHandle.addEventListener('mousedown', (e) => {
                e.preventDefault();
                isResizing = true;
                startX = e.clientX;
                startWidth = header.offsetWidth;
                document.body.style.cursor = 'col-resize';
            });

            document.addEventListener('mousemove', (e) => {
                if (!isResizing) return;
                e.preventDefault();

                const width = startWidth + e.clientX - startX;
                const minWidth = 60;
                const maxWidth = 200;
                const newWidth = Math.max(minWidth, Math.min(maxWidth, width));

                header.style.width = newWidth + 'px';

                // 同步更新对应的数据列宽度
                const columnIndex = Array.from(header.parentElement.children).indexOf(header);
                const tbody = header.closest('table').querySelector('tbody');
                tbody.querySelectorAll(`tr td:nth-child(${columnIndex + 1})`).forEach(cell => {
                    cell.style.width = newWidth + 'px';
                });
            });

            document.addEventListener('mouseup', () => {
                if (isResizing) {
                    isResizing = false;
                    document.body.style.cursor = '';
                }
            });

            return header;
        }

        // 创建三个列
        const avgOrderValueHeader = createResizableHeader('客单价', 'custom-column avg-order-value');
        const opmHeader = createResizableHeader('OPM', 'custom-column opm');
        const gpmHeader = createResizableHeader('GPM', 'custom-column gpm');

        // 在商品信息列后插入新列
        productInfoHeader.insertAdjacentElement('afterend', avgOrderValueHeader);
        avgOrderValueHeader.insertAdjacentElement('afterend', opmHeader);
        opmHeader.insertAdjacentElement('afterend', gpmHeader);

        console.log('表头新列添加完成');
    }

    // 强制添加新列（不检查是否存在）
    function addNewColumnsForce() {
        console.log('🔧 强制添加表头列...');
        const headerRow = document.querySelector('.ecom-table thead tr');
        if (!headerRow) {
            console.log('❌ 未找到表头行');
            return false;
        }

        // 找到商品信息列（第二列）
        const productInfoHeader = headerRow.children[1];
        if (!productInfoHeader) {
            console.log('❌ 未找到商品信息列');
            return false;
        }

        console.log('✅ 找到插入位置，开始添加列...');

        // 创建排序图标HTML
        const sortIconsHTML = `
            <span class="ecom-table-column-sorter ecom-table-column-sorter-full" style="margin-left: 4px;">
                <span class="ecom-table-column-sorter-inner">
                    <span role="img" aria-label="caret-up" class="anticon anticon-caret-up ecom-table-column-sorter-up">
                        <svg viewBox="0 0 1024 1024" focusable="false" data-icon="caret-up" width="0.8em" height="0.8em" fill="currentColor" aria-hidden="true">
                            <path d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z"></path>
                        </svg>
                    </span>
                    <span role="img" aria-label="caret-down" class="anticon anticon-caret-down ecom-table-column-sorter-down">
                        <svg viewBox="0 0 1024 1024" focusable="false" data-icon="caret-down" width="0.8em" height="0.8em" fill="currentColor" aria-hidden="true">
                            <path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"></path>
                        </svg>
                    </span>
                </span>
            </span>
        `;

        // 创建简化的表头列
        function createSimpleHeader(title, className) {
            const header = document.createElement('th');
            header.className = `ecom-table-cell ecom-table-column-has-sorters custom-column ${className}`;
            header.setAttribute('tabindex', '0');
            header.style.cssText = 'text-align: right; width: 80px; padding: 8px 6px; background: #fff; border-right: 1px solid #f0f0f0;';
            header.innerHTML = `
                <div class="ecom-table-column-sorters" style="display: flex; align-items: center; justify-content: flex-end;">
                    <span class="ecom-table-column-title" style="font-size: 12px; color: #262626; font-weight: 500;">${title}</span>
                    ${sortIconsHTML}
                </div>
            `;
            return header;
        }

        // 创建三个列
        const avgOrderValueHeader = createSimpleHeader('客单价', 'avg-order-value');
        const opmHeader = createSimpleHeader('OPM', 'opm');
        const gpmHeader = createSimpleHeader('GPM', 'gpm');

        // 在商品信息列后插入新列
        productInfoHeader.insertAdjacentElement('afterend', avgOrderValueHeader);
        avgOrderValueHeader.insertAdjacentElement('afterend', opmHeader);
        opmHeader.insertAdjacentElement('afterend', gpmHeader);

        console.log('✅ 表头列强制添加完成');
        return true;
    }

    // 为表格数据行添加新列数据
    function addDataToRows() {
        const dataRows = document.querySelectorAll('.ecom-table tbody tr');

        dataRows.forEach(row => {
            // 检查是否已经添加过自定义列
            if (row.querySelector('.custom-column')) {
                return; // 已经添加过，跳过
            }

            // 获取现有数据
            const cells = row.querySelectorAll('td');
            if (cells.length < 6) return; // 确保有足够的列

            // 检查是否是有效的数据行（不是空行或加载中的行）
            const hasValidData = Array.from(cells).some(cell => {
                const text = cell.textContent.trim();
                return text && text !== '-' && text !== '加载中' && !text.includes('暂无数据');
            });

            if (!hasValidData) return; // 跳过无效行

            // 动态查找数据列索引
            let gmvText = 0, orderCountText = 0, exposureTimesText = 0;

            // 智能识别数据列
            cells.forEach((cell, index) => {
                const valueEl = cell.querySelector('.value-FjtXW3') || cell.querySelector('div[class*="value"]') || cell;
                if (!valueEl) return;

                const text = valueEl.textContent.trim();

                // 更宽泛的数据识别规则
                if (text.includes('¥') && (text.includes(',') || text.includes('.'))) {
                    // 成交金额列：包含¥符号和数字分隔符
                    if (gmvText === 0 && !text.includes('%')) {
                        gmvText = extractNumericValue(cell);
                        console.log(`找到GMV列 [${index}]: ${text} -> ${gmvText}`);
                    }
                } else if (/^\d{1,4}$/.test(text) && index > 2) {
                    // 成交订单数列：纯数字，1-4位数
                    if (orderCountText === 0) {
                        orderCountText = extractNumericValue(cell);
                        console.log(`找到订单数列 [${index}]: ${text} -> ${orderCountText}`);
                    }
                } else if ((text.includes('万') || /^\d{1,2}\.\d{2}万$/.test(text)) && index > 5) {
                    // 曝光次数列：包含"万"字的数字
                    if (exposureTimesText === 0) {
                        exposureTimesText = extractNumericValue(cell);
                        console.log(`找到曝光次数列 [${index}]: ${text} -> ${exposureTimesText}`);
                    }
                }
            });

            // 如果没有找到曝光次数，尝试查找其他可能的格式
            if (exposureTimesText === 0) {
                for (let i = cells.length - 6; i < cells.length; i++) {
                    if (i >= 0 && cells[i]) {
                        const text = cells[i].textContent.trim();
                        if (/\d+[,，]\d+/.test(text) && !text.includes('¥') && !text.includes('%')) {
                            // 包含逗号分隔的大数字
                            exposureTimesText = extractNumericValue(cells[i]);
                            console.log(`找到曝光次数列(备选) [${i}]: ${text} -> ${exposureTimesText}`);
                            break;
                        }
                    }
                }
            }

            console.log(`最终数据提取: GMV=${gmvText}, 订单数=${orderCountText}, 曝光次数=${exposureTimesText}`);

            // 计算新指标
            const avgOrderValue = orderCountText > 0 ? (gmvText / orderCountText) : 0;
            const opm = exposureTimesText > 0 ? (orderCountText / exposureTimesText * 1000) : 0;
            const gpm = exposureTimesText > 0 ? (gmvText / exposureTimesText * 1000) : 0;

            // 创建新的单元格
            const avgOrderValueCell = createDataCell(avgOrderValue, '¥', 2);
            const opmCell = createDataCell(opm, '', 2);
            const gpmCell = createDataCell(gpm, '¥', 2);

            // 在商品信息列后插入
            if (cells[1]) {
                cells[1].insertAdjacentElement('afterend', avgOrderValueCell);
                avgOrderValueCell.insertAdjacentElement('afterend', opmCell);
                opmCell.insertAdjacentElement('afterend', gpmCell);
            }
        });

        console.log('数据行新列添加完成');
    }

    // 强制为所有数据行添加列
    function addDataToRowsForce() {
        console.log('🔧 强制为数据行添加列...');
        const dataRows = document.querySelectorAll('.ecom-table tbody tr');
        let processedCount = 0;

        dataRows.forEach((row, index) => {
            // 获取现有数据
            const cells = row.querySelectorAll('td');
            if (cells.length < 6) {
                console.log(`  跳过第${index + 1}行: 列数不足 (${cells.length})`);
                return;
            }

            // 检查是否是有效的数据行
            const hasValidData = Array.from(cells).some(cell => {
                const text = cell.textContent.trim();
                return text && text !== '-' && text !== '加载中' && !text.includes('暂无数据');
            });

            if (!hasValidData) {
                console.log(`  跳过第${index + 1}行: 无有效数据`);
                return;
            }

            console.log(`  处理第${index + 1}行...`);

            // 提取数据
            let gmvValue = 0, orderCount = 0, exposureTimes = 0;
            let foundGMV = false, foundOrder = false, foundExposure = false;

            cells.forEach((cell, cellIndex) => {
                const valueEl = cell.querySelector('.value-FjtXW3') || cell.querySelector('div[class*="value"]') || cell;
                if (!valueEl) return;

                const text = valueEl.textContent.trim();

                // 识别成交金额（包含¥符号）
                if (text.includes('¥') && !foundGMV) {
                    const numStr = text.replace(/[¥,，]/g, '');
                    const num = parseFloat(numStr);
                    if (!isNaN(num) && num > 0) {
                        gmvValue = num;
                        foundGMV = true;
                        console.log(`    GMV: ${text} -> ${gmvValue}`);
                    }
                }

                // 识别订单数（纯数字，通常在中间位置）
                if (/^\d{1,4}$/.test(text) && cellIndex > 2 && !foundOrder) {
                    const num = parseInt(text);
                    if (num > 0) {
                        orderCount = num;
                        foundOrder = true;
                        console.log(`    订单数: ${text} -> ${orderCount}`);
                    }
                }

                // 识别曝光次数（包含万或大数字）
                if ((text.includes('万') || /\d+[,，]\d+/.test(text)) && cellIndex > 4 && !foundExposure) {
                    let num = 0;
                    if (text.includes('万')) {
                        const baseNum = parseFloat(text.replace(/[万,，]/g, ''));
                        num = baseNum * 10000;
                    } else {
                        num = parseInt(text.replace(/[,，]/g, ''));
                    }
                    if (!isNaN(num) && num > 0) {
                        exposureTimes = num;
                        foundExposure = true;
                        console.log(`    曝光次数: ${text} -> ${exposureTimes}`);
                    }
                }
            });

            // 计算指标
            const avgOrderValue = orderCount > 0 ? (gmvValue / orderCount) : 0;
            const opm = exposureTimes > 0 ? (orderCount / exposureTimes * 1000) : 0;
            const gpm = exposureTimes > 0 ? (gmvValue / exposureTimes * 1000) : 0;

            console.log(`    计算结果: 客单价=${avgOrderValue.toFixed(2)}, OPM=${opm.toFixed(2)}, GPM=${gpm.toFixed(2)}`);

            // 创建新的单元格
            const avgCell = createSimpleDataCell(avgOrderValue, '¥', 2);
            const opmCell = createSimpleDataCell(opm, '', 2);
            const gpmCell = createSimpleDataCell(gpm, '¥', 2);

            // 在商品信息列后插入
            if (cells[1]) {
                cells[1].insertAdjacentElement('afterend', avgCell);
                avgCell.insertAdjacentElement('afterend', opmCell);
                opmCell.insertAdjacentElement('afterend', gpmCell);
                processedCount++;
            }
        });

                 console.log(`✅ 数据行强制添加完成，共处理${processedCount}行`);
     }

     // 直接处理表格（最简单的方式）
     function processTableDirectly() {
         return new Promise((resolve, reject) => {
             try {
                 console.log('📋 直接处理表格...');

                 // 0. 先清理所有旧的自定义列（确保重新计算当前页面数据）
                 console.log('🧹 清理旧的自定义列...');
                 const oldCustomColumns = document.querySelectorAll('.ecom-table .custom-column');
                 oldCustomColumns.forEach(col => col.remove());
                 console.log(`  清理了${oldCustomColumns.length}个旧列`);

                 // 短暂延迟确保DOM更新
                 setTimeout(() => {
                     try {
                         // 1. 检查并添加表头
                         const headerRow = document.querySelector('.ecom-table thead tr');
                         if (!headerRow) {
                             throw new Error('未找到表头');
                         }

                         console.log('➕ 重新添加表头列...');
                         addHeadersDirectly(headerRow);

                         // 2. 处理数据行 - 重新抓取每一行的当前数据
                         const dataRows = document.querySelectorAll('.ecom-table tbody tr');
                         let processedCount = 0;

                         console.log(`🔄 开始处理${dataRows.length}行数据...`);

                         dataRows.forEach((row, index) => {
                             console.log(`\n--- 处理第${index + 1}行 ---`);

                             // 检查这行是否有有效数据
                             const cells = row.querySelectorAll('td');
                             if (cells.length < 6) {
                                 console.log(`  跳过: 列数不足 (${cells.length})`);
                                 return;
                             }

                             const hasData = Array.from(cells).some(cell => {
                                 const text = cell.textContent.trim();
                                 return text && text !== '-' && !text.includes('加载中') && !text.includes('暂无数据');
                             });

                             if (hasData) {
                                 console.log(`  ✅ 有效数据行，开始处理...`);
                                 addRowDataDirectly(row, cells);
                                 processedCount++;
                             } else {
                                 console.log(`  跳过: 无有效数据`);
                             }
                         });

                         console.log(`\n🎉 表格处理完成！共处理了${processedCount}行数据`);
                         resolve(processedCount);

                     } catch (error) {
                         console.error('❌ 表格处理过程出错:', error);
                         reject(error);
                     }
                 }, 100);

             } catch (error) {
                 console.error('❌ 直接处理表格失败:', error);
                 reject(error);
             }
         });
     }

     // 直接添加表头
     function addHeadersDirectly(headerRow) {
         const productColumn = headerRow.children[1]; // 商品信息列
         if (!productColumn) {
             console.log('❌ 未找到商品信息列');
             return;
         }

         // 创建四个带排序功能的表头，UV价值在客单价左侧
         const headers = [
             { title: 'UV价值', class: 'uv-value' },
             { title: '客单价', class: 'avg-order-value' },
             { title: 'OPM', class: 'opm' },
             { title: 'GPM', class: 'gpm' }
         ];

         let insertAfter = productColumn;

         headers.forEach(headerInfo => {
             const th = document.createElement('th');
             th.className = `ecom-table-cell custom-column ${headerInfo.class} sortable-header`;
             th.style.cssText = 'text-align: right; width: 80px; padding: 8px 6px; background: #fff; cursor: pointer; user-select: none;';
             th.setAttribute('data-sort', 'none');
             th.setAttribute('data-column-name', headerInfo.class);

             th.innerHTML = `
                 <div style="display: flex; align-items: center; justify-content: flex-end; gap: 4px;">
                     <span style="font-size: 12px; color: #262626; font-weight: 500;">${headerInfo.title}</span>
                     <div style="display: flex; flex-direction: column; opacity: 0.6;">
                         <svg class="sort-up-icon" width="8" height="4" viewBox="0 0 8 4" style="margin-bottom: 1px;">
                             <path d="M0 4L4 0L8 4Z" fill="currentColor"/>
                         </svg>
                         <svg class="sort-down-icon" width="8" height="4" viewBox="0 0 8 4">
                             <path d="M0 0L4 4L8 0Z" fill="currentColor"/>
                         </svg>
                     </div>
                 </div>
             `;

             // 添加点击事件监听器
             th.addEventListener('click', () => {
                 sortCustomColumn(th, headerInfo.class);
             });

             // 悬停效果
             th.addEventListener('mouseenter', () => {
                 th.style.backgroundColor = '#f5f5f5';
             });

             th.addEventListener('mouseleave', () => {
                 th.style.backgroundColor = '#fff';
             });

             insertAfter.insertAdjacentElement('afterend', th);
             insertAfter = th;
         });

         console.log('✅ 带排序功能的表头添加完成');
     }

     // 自定义列排序函数
     function sortCustomColumn(headerElement, columnClass) {
         console.log(`🔄 开始排序列: ${columnClass}`);

         const table = document.querySelector('.ecom-table tbody');
         if (!table) {
             console.log('❌ 未找到表格主体');
             return;
         }

         // 获取当前排序状态
         let currentSort = headerElement.getAttribute('data-sort');
         let newSort = currentSort === 'asc' ? 'desc' : 'asc';

         // 清除其他列的排序状态
         const allHeaders = document.querySelectorAll('.sortable-header');
         allHeaders.forEach(header => {
             if (header !== headerElement) {
                 header.setAttribute('data-sort', 'none');
                 const icons = header.querySelectorAll('svg');
                 icons.forEach(icon => icon.style.opacity = '0.6');
             }
         });

         // 设置当前列的排序状态
         headerElement.setAttribute('data-sort', newSort);

         // 更新排序图标
         const sortUpIcon = headerElement.querySelector('.sort-up-icon');
         const sortDownIcon = headerElement.querySelector('.sort-down-icon');

         if (newSort === 'asc') {
             sortUpIcon.style.opacity = '1';
             sortDownIcon.style.opacity = '0.3';
             console.log(`📈 ${columnClass} 升序排列`);
         } else {
             sortUpIcon.style.opacity = '0.3';
             sortDownIcon.style.opacity = '1';
             console.log(`📉 ${columnClass} 降序排列`);
         }

         // 获取所有数据行
         const rows = Array.from(table.querySelectorAll('tr'));
         console.log(`📊 找到${rows.length}行数据`);

         // 排序行
         rows.sort((a, b) => {
             // 查找对应的自定义列
             const cellA = a.querySelector(`.custom-column.${columnClass}`);
             const cellB = b.querySelector(`.custom-column.${columnClass}`);

             if (!cellA || !cellB) {
                 console.log(`⚠️ 某些行缺少${columnClass}列`);
                 return 0;
             }

             // 获取数值进行比较
             const valueA = parseFloat(cellA.getAttribute('data-value')) || 0;
             const valueB = parseFloat(cellB.getAttribute('data-value')) || 0;

             console.log(`比较: ${valueA} vs ${valueB}`);

             if (newSort === 'asc') {
                 return valueA - valueB;
             } else {
                 return valueB - valueA;
             }
         });

         // 重新排列DOM
         console.log('🔄 重新排列表格行...');
         rows.forEach(row => {
             table.appendChild(row);
         });

         console.log(`✅ ${columnClass}列排序完成 (${newSort})`);
     }

     // 直接为行添加数据（重新抓取当前页面数据）
     function addRowDataDirectly(row, cells) {
         console.log('🔍 开始分析行数据...');
         console.log('📋 原始行HTML:', row.innerHTML.substring(0, 200) + '...');

         // 重新抓取这一行的实时数据
         let gmv = 0, orders = 0, exposure = 0, exposurePeople = 0;
         let foundData = { gmv: false, orders: false, exposure: false, exposurePeople: false };

         // 先打印所有列的内容，帮助调试
         console.log('📊 所有列的数据:');
         for (let i = 0; i < cells.length; i++) {
             const cell = cells[i];
             const allText = cell.textContent.trim();
             const innerElements = cell.querySelectorAll('*');
             console.log(`  列${i}: "${allText}" [包含${innerElements.length}个子元素]`);

             // 显示所有子元素的内容
             innerElements.forEach((el, idx) => {
                 if (el.textContent.trim()) {
                     console.log(`    子元素${idx}: "${el.textContent.trim()}" (${el.tagName}.${el.className})`);
                 }
             });
         }

         // 增强的数据提取逻辑 - 按列位置精确匹配
         for (let i = 0; i < cells.length; i++) {
             const cell = cells[i];

             // 尝试多种方式获取文本内容
             const methods = [
                 () => cell.querySelector('.value-FjtXW3')?.textContent?.trim(),
                 () => cell.querySelector('[class*="value"]')?.textContent?.trim(),
                 () => cell.querySelector('span')?.textContent?.trim(),
                 () => cell.querySelector('div')?.textContent?.trim(),
                 () => cell.textContent?.trim()
             ];

             let text = '';
             for (const method of methods) {
                 try {
                     const result = method();
                     if (result && result !== '-' && result !== '') {
                         text = result;
                         break;
                     }
                 } catch (e) {
                     // 忽略错误，继续下一个方法
                 }
             }

             if (!text) continue;

             console.log(`🔍 列${i}分析: "${text}"`);

             // 根据列位置和内容特征精确识别数据

             // 成交金额识别 - 查找"成交金额"列（通常在中间位置且数值较大）
             if (text.includes('¥')) {
                 console.log(`  🔍 检测到¥符号，分析GMV...`);
                 const patterns = [
                     /¥([\d,，.]+)/,           // ¥123.45
                     /￥([\d,，.]+)/,          // ￥123.45
                     /([\d,，.]+)元/            // 123.45元
                 ];

                 for (const pattern of patterns) {
                     const match = text.match(pattern);
                     if (match) {
                         const num = parseFloat(match[1].replace(/[,，]/g, ''));
                         if (!isNaN(num) && num >= 0) {
                             console.log(`    💰 发现金额: ${num} (列${i})`);

                             // 策略：选择最大的金额作为成交金额
                             // 因为成交金额通常是所有¥数值中最大的
                             if (num > gmv) {
                                 gmv = num;
                                 foundData.gmv = true;
                                 console.log(`    ✅ 更新GMV: ${gmv} (列${i}, 原因: 数值更大)`);
                             }
                         }
                     }
                 }
             }

             // 订单数识别 - 查找合适范围的纯数字
             if (!foundData.orders && i > 1) {
                 const cleanText = text.replace(/[^\d]/g, '');
                 if (/^\d{1,6}$/.test(cleanText)) {
                     const num = parseInt(cleanText);
                     if (!isNaN(num) && num > 0 && num < 100000) {
                         // 确保不是价格或曝光次数
                         if (!text.includes('¥') && !text.includes('万') && !text.includes(',') && !text.includes('.')) {
                             orders = num;
                             foundData.orders = true;
                             console.log(`    ✅ 找到订单数: ${orders} (列${i})`);
                         }
                     }
                 }
             }

             // 曝光次数和曝光人数识别 - 查找最后几列中的大数字
             if ((!foundData.exposure || !foundData.exposurePeople) && i >= Math.max(3, cells.length - 4)) {
                 let foundExposure = false;

                 // 万单位格式 - 优先识别
                 if (text.includes('万')) {
                     console.log(`  🔍 检测到万单位，分析曝光数据...`);
                     const match = text.match(/([\d.]+)万/);
                     if (match) {
                         const num = parseFloat(match[1]) * 10000;
                         if (!isNaN(num) && num >= 1000) {
                             // 策略：较大的数值优先作为曝光次数，较小的作为曝光人数
                             if (!foundData.exposure || num > exposure) {
                                 // 如果之前有曝光次数，把它转为曝光人数
                                 if (foundData.exposure && exposure < num) {
                                     exposurePeople = exposure;
                                     foundData.exposurePeople = true;
                                 }
                                 exposure = num;
                                 foundData.exposure = true;
                                 foundExposure = true;
                                 console.log(`    ✅ 找到曝光次数(万): ${exposure} (列${i})`);
                             } else if (!foundData.exposurePeople && num < exposure) {
                                 exposurePeople = num;
                                 foundData.exposurePeople = true;
                                 console.log(`    ✅ 找到曝光人数(万): ${exposurePeople} (列${i})`);
                             }
                         }
                     }
                 }

                 // 逗号分隔的大数字
                 if (!foundExposure && /\d+[,，]\d+/.test(text) && !text.includes('¥')) {
                     console.log(`  🔍 检测到逗号数字，分析曝光数据...`);
                     const cleanNum = text.replace(/[,，]/g, '').replace(/[^\d]/g, '');
                     const num = parseInt(cleanNum);
                     if (!isNaN(num) && num > 1000) {
                         // 策略：较大的数值作为曝光次数，较小的作为曝光人数
                         if (!foundData.exposure || num > exposure) {
                             if (foundData.exposure && exposure < num) {
                                 exposurePeople = exposure;
                                 foundData.exposurePeople = true;
                             }
                             exposure = num;
                             foundData.exposure = true;
                             console.log(`    ✅ 找到曝光次数(逗号): ${exposure} (列${i})`);
                         } else if (!foundData.exposurePeople && num < exposure) {
                             exposurePeople = num;
                             foundData.exposurePeople = true;
                             console.log(`    ✅ 找到曝光人数(逗号): ${exposurePeople} (列${i})`);
                         }
                     }
                 }

                 // 纯大数字（作为备选）
                 if (!foundExposure && /^\d{3,}$/.test(text)) {
                     const num = parseInt(text);
                     if (!isNaN(num) && num > 100) {
                         if (!foundData.exposure || num > exposure) {
                             if (foundData.exposure && exposure < num) {
                                 exposurePeople = exposure;
                                 foundData.exposurePeople = true;
                             }
                             exposure = num;
                             foundData.exposure = true;
                             console.log(`    ✅ 找到曝光次数(纯数字): ${exposure} (列${i})`);
                         } else if (!foundData.exposurePeople && num < exposure && num > 50) {
                             exposurePeople = num;
                             foundData.exposurePeople = true;
                             console.log(`    ✅ 找到曝光人数(纯数字): ${exposurePeople} (列${i})`);
                         }
                     }
                 }
             }
         }

         // 数据验证和纠正
         console.log(`\n🔧 验证数据合理性...`);

         // 如果没有找到曝光人数，尝试用曝光次数估算（通常曝光人数 = 曝光次数 * 0.6-0.8）
         if (!foundData.exposurePeople && foundData.exposure && exposure > 0) {
             exposurePeople = Math.round(exposure * 0.7); // 假设平均每人看1.43次
             foundData.exposurePeople = true;
             console.log(`   💡 基于曝光次数估算曝光人数: ${exposurePeople} (${exposure} × 0.7)`);
         }

         // 验证客单价是否合理
         if (gmv > 0 && orders > 0) {
             const avgOrderValue = gmv / orders;
             console.log(`   客单价验证: ${avgOrderValue.toFixed(2)}`);

             // 如果客单价过低，可能GMV抓取错误
             if (avgOrderValue < 5) {
                 console.log(`   ⚠️ 客单价异常偏低(${avgOrderValue.toFixed(2)})，可能GMV抓取有误`);

                 // 重新查找所有金额，寻找更合理的GMV
                 console.log(`   🔍 重新扫描所有¥金额...`);
                 let allAmounts = [];

                 for (let i = 0; i < cells.length; i++) {
                     const cell = cells[i];
                     const cellText = cell.textContent.trim();

                     const matches = cellText.match(/¥([\d,，.]+)/g);
                     if (matches) {
                         matches.forEach(match => {
                             const num = parseFloat(match.replace(/[¥,，]/g, ''));
                             if (!isNaN(num) && num > 0) {
                                 allAmounts.push({ value: num, column: i, text: match });
                             }
                         });
                     }
                 }

                 // 按数值大小排序
                 allAmounts.sort((a, b) => b.value - a.value);
                 console.log(`   💰 所有发现的金额:`, allAmounts);

                 // 选择能产生合理客单价的GMV（5-500元范围）
                 for (const amount of allAmounts) {
                     const testAvgPrice = amount.value / orders;
                     if (testAvgPrice >= 5 && testAvgPrice <= 500) {
                         console.log(`   ✅ 采用更合理的GMV: ${amount.value} (客单价: ${testAvgPrice.toFixed(2)})`);
                         gmv = amount.value;
                         foundData.gmv = true;
                         break;
                     }
                 }
             }
         }

         // 验证GPM计算是否合理（通常在0.1-1000之间）
         if (gmv > 0 && exposure > 0) {
             const calculatedGpm = (gmv / exposure * 1000);
             console.log(`   预计算GPM: ${calculatedGpm.toFixed(2)}`);

             // 如果GPM异常，可能是数据抓取错误
             if (calculatedGpm < 0.01 || calculatedGpm > 10000) {
                 console.log(`   ⚠️ GPM值异常，可能数据抓取有误`);
             }
         }

         console.log(`\n📊 最终提取结果:`);
         console.log(`   GMV(成交金额): ${gmv} (${foundData.gmv ? '✅' : '❌'})`);
         console.log(`   订单数: ${orders} (${foundData.orders ? '✅' : '❌'})`);
         console.log(`   曝光次数: ${exposure} (${foundData.exposure ? '✅' : '❌'})`);
         console.log(`   曝光人数: ${exposurePeople} (${foundData.exposurePeople ? '✅' : '❌'})`);
         console.log(`   期望GPM: ${exposure > 0 ? (gmv / exposure * 1000).toFixed(2) : '无法计算'}`);

         // 计算指标
         const uvValue = exposurePeople > 0 ? (gmv / exposurePeople) : 0;
         const avgPrice = orders > 0 ? (gmv / orders) : 0;
         const opm = exposure > 0 ? (orders / exposure * 1000) : 0;
         const gpm = exposure > 0 ? (gmv / exposure * 1000) : 0;

         console.log(`\n📈 计算结果:`);
         console.log(`   UV价值: ¥${uvValue.toFixed(2)} = GMV(${gmv}) ÷ 曝光人数(${exposurePeople})`);
         console.log(`   客单价: ¥${avgPrice.toFixed(2)} = GMV(${gmv}) ÷ 订单数(${orders})`);
         console.log(`   OPM: ${opm.toFixed(2)} = 订单数(${orders}) ÷ 曝光次数(${exposure}) × 1000`);
         console.log(`   GPM: ¥${gpm.toFixed(2)} = GMV(${gmv}) ÷ 曝光次数(${exposure}) × 1000`);

         // 创建单元格
         const values = [
             { value: uvValue, prefix: '¥', name: 'UV价值' },
             { value: avgPrice, prefix: '¥', name: '客单价' },
             { value: opm, prefix: '', name: 'OPM' },
             { value: gpm, prefix: '¥', name: 'GPM' }
         ];

         let insertAfter = cells[1]; // 商品信息列后

         values.forEach((item, index) => {
             const td = document.createElement('td');

             // 添加对应的类名以支持排序
             let columnClass = '';
             if (item.name === 'UV价值') {
                 columnClass = 'uv-value';
             } else if (item.name === '客单价') {
                 columnClass = 'avg-order-value';
             } else if (item.name === 'OPM') {
                 columnClass = 'opm';
             } else if (item.name === 'GPM') {
                 columnClass = 'gpm';
             }

             td.className = `ecom-table-cell custom-column ${columnClass}`;
             td.style.cssText = 'text-align: right; padding: 8px 6px; font-size: 12px; background: #fff; border-right: 1px solid #f0f0f0;';

             const formatted = item.value === 0 ? '0.00' : item.value.toFixed(2);

             // 根据列类型添加计算公式提示
             let formula = '';
             if (item.name === 'UV价值') {
                 formula = `${gmv}÷${exposurePeople}`;
             } else if (item.name === '客单价') {
                 formula = `${gmv}÷${orders}`;
             } else if (item.name === 'OPM') {
                 formula = `${orders}÷${exposure}×1000`;
             } else if (item.name === 'GPM') {
                 formula = `${gmv}÷${exposure}×1000`;
             }

             td.innerHTML = `<div style="color: #262626; font-weight: 400;" title="计算公式: ${formula}">${item.prefix}${formatted}</div>`;
             td.setAttribute('data-value', item.value);
             td.setAttribute('data-name', item.name);
             td.setAttribute('data-debug', `GMV:${gmv},Orders:${orders},Exposure:${exposure},ExposurePeople:${exposurePeople}`);

             insertAfter.insertAdjacentElement('afterend', td);
             insertAfter = td;

             console.log(`  ➕ 添加了${item.name}列: ${item.prefix}${formatted} (类名: ${columnClass})`);
         });

         console.log('✅ 行数据处理完成\n');
     }

    // 创建简化的数据单元格
    function createSimpleDataCell(value, prefix = '', decimals = 2) {
        const cell = document.createElement('td');
        cell.className = 'ecom-table-cell custom-column';
        cell.style.cssText = 'text-align: right; padding: 8px 6px; font-size: 12px; line-height: 1.5; background: #fff; border-right: 1px solid #f0f0f0;';

        // 格式化数值显示
        let formattedValue;
        if (value === 0) {
            formattedValue = '0.00';
        } else if (value < 1) {
            formattedValue = value.toFixed(3);
        } else {
            formattedValue = value.toFixed(decimals);
        }

        cell.innerHTML = `<div style="color: #262626; font-weight: 400;">${prefix}${formattedValue}</div>`;
        cell.dataset.sortValue = value.toString();

        return cell;
    }

    // 提取数字值（处理各种格式）
    function extractNumericValue(cell) {
        if (!cell) return 0;

        const valueEl = cell.querySelector('.value-FjtXW3');
        if (!valueEl) return 0;

        const text = valueEl.textContent.trim();
        // 移除货币符号、逗号、万等单位
        let numStr = text.replace(/[¥,，万]/g, '');

        // 处理万单位
        if (text.includes('万')) {
            numStr = numStr.replace('万', '');
            return parseFloat(numStr) * 10000 || 0;
        }

        return parseFloat(numStr) || 0;
    }

    // 创建数据单元格
    function createDataCell(value, prefix = '', decimals = 2) {
        const cell = document.createElement('td');
        cell.className = 'ecom-table-cell custom-column';
        cell.style.textAlign = 'right';
        cell.style.padding = '8px 6px';
        cell.style.fontSize = '12px';
        cell.style.lineHeight = '1.5';

        // 格式化数值显示
        let formattedValue;
        if (value === 0) {
            formattedValue = '0.00';
        } else if (value < 1) {
            formattedValue = value.toFixed(3);
        } else {
            formattedValue = value.toFixed(decimals);
        }

        cell.innerHTML = `
            <div style="color: #262626; font-weight: 400;">${prefix}${formattedValue}</div>
        `;

        // 存储原始数值用于排序
        cell.dataset.sortValue = value.toString();

        return cell;
    }

    // 绑定排序事件
    function bindSortingEvents() {
        const customHeaders = document.querySelectorAll('.custom-column.ecom-table-column-has-sorters');

        customHeaders.forEach((header, index) => {
            header.addEventListener('click', () => {
                const columnIndex = getColumnIndex(header);
                sortTableByColumn(columnIndex);
            });
        });

        console.log('排序事件绑定完成');
    }

    // 获取列索引
    function getColumnIndex(header) {
        const headers = header.parentElement.children;
        for (let i = 0; i < headers.length; i++) {
            if (headers[i] === header) {
                return i;
            }
        }
        return -1;
    }

    // 按列排序表格
    function sortTableByColumn(columnIndex) {
        const table = document.querySelector('.ecom-table tbody');
        const rows = Array.from(table.querySelectorAll('tr'));
        const header = document.querySelector('.ecom-table thead tr').children[columnIndex];

        // 判断当前排序状态
        const isAscending = !header.classList.contains('sort-asc');

        // 清除其他列的排序状态
        document.querySelectorAll('.ecom-table thead th').forEach(th => {
            th.classList.remove('sort-asc', 'sort-desc');
            const downIcon = th.querySelector('.ecom-table-column-sorter-down');
            const upIcon = th.querySelector('.ecom-table-column-sorter-up');
            if (downIcon) downIcon.classList.remove('active');
            if (upIcon) upIcon.classList.remove('active');
        });

        // 设置当前列排序状态
        header.classList.add(isAscending ? 'sort-asc' : 'sort-desc');
        const targetIcon = isAscending ?
            header.querySelector('.ecom-table-column-sorter-up') :
            header.querySelector('.ecom-table-column-sorter-down');
        if (targetIcon) targetIcon.classList.add('active');

        // 排序行
        rows.sort((a, b) => {
            const cellA = a.children[columnIndex];
            const cellB = b.children[columnIndex];

            if (!cellA || !cellB) return 0;

            const valueA = parseFloat(cellA.dataset.sortValue || '0');
            const valueB = parseFloat(cellB.dataset.sortValue || '0');

            return isAscending ? valueA - valueB : valueB - valueA;
        });

        // 重新插入排序后的行
        rows.forEach(row => table.appendChild(row));

        console.log(`按第${columnIndex}列${isAscending ? '升序' : '降序'}排序完成`);
    }

    // 添加分页大小选择器
    function addPageSizeSelector() {
        const pagination = document.querySelector('.ecom-pagination');
        if (!pagination || pagination.querySelector('.page-size-selector')) {
            return; // 没找到分页器或已经添加过
        }

        console.log('开始添加分页大小选择器...');

        // 创建分页大小选择器容器
        const pageSizeContainer = document.createElement('li');
        pageSizeContainer.className = 'ecom-pagination-options page-size-selector';
        pageSizeContainer.style.marginRight = '16px';

        // 创建选择器HTML
        pageSizeContainer.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px; font-size: 12px;">
                <span style="color: #666;">每页显示</span>
                <select id="page-size-select" style="
                    padding: 4px 8px;
                    border: 1px solid #d9d9d9;
                    border-radius: 4px;
                    font-size: 12px;
                    background: white;
                    cursor: pointer;
                    outline: none;
                ">
                    <option value="10">10 条</option>
                    <option value="20" selected>20 条</option>
                    <option value="50">50 条</option>
                    <option value="100">100 条</option>
                    <option value="200">200 条</option>
                </select>
            </div>
        `;

        // 插入到跳转输入框前面
        const quickJumper = pagination.querySelector('.ecom-pagination-options-quick-jumper');
        if (quickJumper && quickJumper.parentElement) {
            quickJumper.parentElement.insertBefore(pageSizeContainer, quickJumper.parentElement);
        } else {
            // 如果没有跳转输入框，插入到最后
            pagination.appendChild(pageSizeContainer);
        }

        // 绑定选择器事件
        const pageSelect = document.getElementById('page-size-select');
        if (pageSelect) {
            pageSelect.addEventListener('change', handlePageSizeChange);

            // 尝试从当前URL或页面获取当前的页面大小
            const currentPageSize = getCurrentPageSize();
            if (currentPageSize) {
                pageSelect.value = currentPageSize;
            }
        }

        console.log('分页大小选择器添加完成');
    }

    // 获取当前页面大小
    function getCurrentPageSize() {
        try {
            // 方法1: 从URL参数获取
            const urlParams = new URLSearchParams(window.location.search);
            const pageSize = urlParams.get('page_size') || urlParams.get('pageSize') || urlParams.get('size');
            if (pageSize) return pageSize;

            // 方法2: 从分页信息推断
            const totalText = document.querySelector('.ecom-pagination-total-text');
            if (totalText) {
                const match = totalText.textContent.match(/共(\d+)条/);
                if (match) {
                    const total = parseInt(match[1]);
                    const tableRows = document.querySelectorAll('.ecom-table tbody tr').length;
                    if (tableRows > 0 && tableRows <= total) {
                        // 如果当前显示的行数小于等于总数，可能就是页面大小
                        return tableRows.toString();
                    }
                }
            }

            // 默认返回20
            return '20';
        } catch (error) {
            console.log('获取当前页面大小失败:', error);
            return '20';
        }
    }

    // 处理页面大小变化
    function handlePageSizeChange(event) {
        const newPageSize = event.target.value;
        console.log(`页面大小改变为: ${newPageSize}`);

        try {
            // 方法1: 更新URL参数并刷新
            const url = new URL(window.location.href);
            url.searchParams.set('page_size', newPageSize);
            url.searchParams.set('page', '1'); // 重置到第一页

            // 显示加载提示
            showPageSizeChangeLoading();

            // 延迟刷新，给用户看到加载效果
            setTimeout(() => {
                window.location.href = url.toString();
            }, 300);

        } catch (error) {
            console.error('更新页面大小失败:', error);

            // 备用方案: 尝试触发页面的分页事件
            triggerPageSizeEvent(newPageSize);
        }
    }

    // 显示页面大小变更加载提示
    function showPageSizeChangeLoading() {
        // 创建加载遮罩
        const loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'page-size-loading';
        loadingOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            font-family: Arial, sans-serif;
        `;

        loadingOverlay.innerHTML = `
            <div style="
                background: white;
                padding: 24px 32px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                display: flex;
                align-items: center;
                gap: 12px;
            ">
                <div style="
                    width: 20px;
                    height: 20px;
                    border: 2px solid #f3f3f3;
                    border-top: 2px solid #1890ff;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                "></div>
                <span style="color: #666; font-size: 14px;">正在更新页面大小...</span>
            </div>
        `;

        // 添加旋转动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(loadingOverlay);
    }

    // 尝试触发页面的分页事件（备用方案）
    function triggerPageSizeEvent(pageSize) {
        try {
            // 尝试查找并触发页面原有的分页大小改变事件
            console.log('尝试触发页面分页事件...');

            // 可以在这里添加更多特定于抖音页面的事件触发逻辑
            // 比如模拟点击、触发自定义事件等

            // 简单的重新加载页面
            setTimeout(() => {
                window.location.reload();
            }, 500);

                 } catch (error) {
             console.error('触发分页事件失败:', error);
         }
     }

     // 设置表格内容变化监听器
     function setupTableObserver() {
         console.log('设置表格变化监听器...');

         const tableBody = document.querySelector('.ecom-table tbody');
         if (!tableBody) {
             console.log('未找到表格tbody，跳过监听器设置');
             return;
         }

         // 防止重复设置监听器
         if (window.tableObserverSetup) {
             console.log('表格监听器已设置，跳过重复设置');
             return;
         }
         window.tableObserverSetup = true;

         // 创建观察器来监听表格内容变化
         const observer = new MutationObserver((mutations) => {
             let shouldUpdate = false;

             mutations.forEach((mutation) => {
                 if (mutation.type === 'childList') {
                     // 检查是否有新的行被添加或现有行被替换
                     if (mutation.addedNodes.length > 0) {
                         const hasNewRows = Array.from(mutation.addedNodes).some(node =>
                             node.nodeType === Node.ELEMENT_NODE && node.tagName === 'TR'
                         );
                         if (hasNewRows) {
                             shouldUpdate = true;
                         }
                     }
                 }
             });

             if (shouldUpdate) {
                 console.log('检测到表格内容变化，更新自定义列...');
                 // 延迟一下确保新内容完全加载
                 setTimeout(() => {
                     updateTableColumnsCarefully();
                 }, 800);
             }
         });

         // 开始观察
         observer.observe(tableBody, {
             childList: true,
             subtree: true
         });

         // 同时监听分页器点击事件
         setupPaginationListener();

         console.log('表格变化监听器设置完成');
     }

     // 设置分页器点击监听
     function setupPaginationListener() {
         const pagination = document.querySelector('.ecom-pagination');
         if (!pagination) return;

         // 防止重复绑定事件
         if (pagination.dataset.listenerAdded) return;
         pagination.dataset.listenerAdded = 'true';

         // 监听分页器点击事件
         pagination.addEventListener('click', (event) => {
             const target = event.target;

             // 检查是否点击了分页相关的元素
             const isPaginationClick = target.closest('.ecom-pagination-item') ||
                                     target.closest('.ecom-pagination-prev') ||
                                     target.closest('.ecom-pagination-next');

             if (isPaginationClick) {
                 console.log('检测到分页点击，准备更新列数据...');
                 // 延迟更新，等待新数据加载
                 setTimeout(() => {
                     updateTableColumnsCarefully();
                 }, 1200);
             }
         });

         // 监听页面跳转输入框
         const jumpInput = pagination.querySelector('.ecom-pagination-options-quick-jumper input');
         if (jumpInput) {
             jumpInput.addEventListener('keypress', (event) => {
                 if (event.key === 'Enter') {
                     console.log('检测到页面跳转，准备更新列数据...');
                     setTimeout(() => {
                         updateTableColumnsCarefully();
                     }, 1200);
                 }
             });
         }
     }

     // 更新表格列（重新添加自定义列数据）
     function updateTableColumns() {
         console.log('开始更新表格列数据...');

         try {
             // 检查表头是否还有自定义列，如果没有则重新添加
             const header = document.querySelector('.ecom-table thead tr');
             if (header && !header.querySelector('.custom-column')) {
                 console.log('表头缺少自定义列，重新添加...');
                 addNewColumns();
                 bindSortingEvents();
             }

             // 为新的数据行添加自定义列
             addDataToRows();

             console.log('表格列数据更新完成');
         } catch (error) {
             console.error('更新表格列数据失败:', error);
         }
     }

     // 谨慎更新表格列（先清理再添加）
     function updateTableColumnsCarefully() {
         console.log('开始谨慎更新表格列数据...');

         try {
             // 第一步：清理所有自定义列
             cleanupCustomColumns();

             // 第二步：等待一下确保清理完成，然后重新添加
             setTimeout(() => {
                 const header = document.querySelector('.ecom-table thead tr');
                 if (header) {
                     console.log('重新添加表头列...');
                     addNewColumns();
                     bindSortingEvents();

                     // 第三步：为数据行添加列
                     setTimeout(() => {
                         console.log('重新添加数据列...');
                         addDataToRows();
                         console.log('谨慎更新完成');
                     }, 200);
                 }
             }, 100);

         } catch (error) {
             console.error('谨慎更新表格列数据失败:', error);
         }
     }

     // 清理自定义列
     function cleanupCustomColumns() {
         console.log('开始清理自定义列...');

         // 清理表头中的自定义列
         const headerCustomColumns = document.querySelectorAll('.ecom-table thead .custom-column');
         headerCustomColumns.forEach(col => {
             console.log('移除表头自定义列');
             col.remove();
         });

         // 清理所有数据行中的自定义列
         const dataCustomColumns = document.querySelectorAll('.ecom-table tbody .custom-column');
         dataCustomColumns.forEach(col => {
             col.remove();
         });

         console.log(`清理完成，共移除${headerCustomColumns.length}个表头列和${dataCustomColumns.length}个数据列`);
     }

     // 改进的数据行添加函数，增加更多检查
     function addDataToRowsImproved() {
         const dataRows = document.querySelectorAll('.ecom-table tbody tr');
         let addedCount = 0;

         dataRows.forEach((row, index) => {
             // 检查是否已经添加过自定义列
             if (row.querySelector('.custom-column')) {
                 return; // 已经添加过，跳过
             }

             // 获取现有数据
             const cells = row.querySelectorAll('td');
             if (cells.length < 6) return; // 确保有足够的列

             // 检查是否是有效的数据行
             const hasValidData = Array.from(cells).some(cell => {
                 const text = cell.textContent.trim();
                 return text && text !== '-' && text !== '加载中' && !text.includes('暂无数据');
             });

             if (!hasValidData) return; // 跳过无效行

             console.log(`处理第${index + 1}行数据...`);

             // 动态查找数据列索引
             let gmvText = 0, orderCountText = 0, exposureTimesText = 0;

             // 智能识别数据列
             cells.forEach((cell, cellIndex) => {
                 const valueEl = cell.querySelector('.value-FjtXW3') || cell.querySelector('div[class*="value"]') || cell;
                 if (!valueEl) return;

                 const text = valueEl.textContent.trim();

                 // 更宽泛的数据识别规则
                 if (text.includes('¥') && (text.includes(',') || text.includes('.'))) {
                     if (gmvText === 0 && !text.includes('%')) {
                         gmvText = extractNumericValue(cell);
                         console.log(`行${index + 1} 找到GMV列 [${cellIndex}]: ${text} -> ${gmvText}`);
                     }
                 } else if (/^\d{1,4}$/.test(text) && cellIndex > 2) {
                     if (orderCountText === 0) {
                         orderCountText = extractNumericValue(cell);
                         console.log(`行${index + 1} 找到订单数列 [${cellIndex}]: ${text} -> ${orderCountText}`);
                     }
                 } else if ((text.includes('万') || /^\d{1,2}\.\d{2}万$/.test(text)) && cellIndex > 5) {
                     if (exposureTimesText === 0) {
                         exposureTimesText = extractNumericValue(cell);
                         console.log(`行${index + 1} 找到曝光次数列 [${cellIndex}]: ${text} -> ${exposureTimesText}`);
                     }
                 }
             });

             // 如果没有找到曝光次数，尝试查找其他可能的格式
             if (exposureTimesText === 0) {
                 for (let i = cells.length - 6; i < cells.length; i++) {
                     if (i >= 0 && cells[i]) {
                         const text = cells[i].textContent.trim();
                         if (/\d+[,，]\d+/.test(text) && !text.includes('¥') && !text.includes('%')) {
                             exposureTimesText = extractNumericValue(cells[i]);
                             console.log(`行${index + 1} 找到曝光次数列(备选) [${i}]: ${text} -> ${exposureTimesText}`);
                             break;
                         }
                     }
                 }
             }

             // 计算新指标
             const avgOrderValue = orderCountText > 0 ? (gmvText / orderCountText) : 0;
             const opm = exposureTimesText > 0 ? (orderCountText / exposureTimesText * 1000) : 0;
             const gpm = exposureTimesText > 0 ? (gmvText / exposureTimesText * 1000) : 0;

             // 创建新的单元格
             const avgOrderValueCell = createDataCell(avgOrderValue, '¥', 2);
             const opmCell = createDataCell(opm, '', 2);
             const gpmCell = createDataCell(gpm, '¥', 2);

             // 在商品信息列后插入
             if (cells[1]) {
                 cells[1].insertAdjacentElement('afterend', avgOrderValueCell);
                 avgOrderValueCell.insertAdjacentElement('afterend', opmCell);
                 opmCell.insertAdjacentElement('afterend', gpmCell);
                 addedCount++;
             }
         });

                  console.log(`数据行新列添加完成，共处理${addedCount}行`);
     }

     // 刷新表格列（简化版本）
     function refreshTableColumns() {
         console.log('开始刷新表格列...');

         try {
             // 检查是否需要重新添加表头
             const header = document.querySelector('.ecom-table thead tr');
             if (!header) {
                 console.log('未找到表头，跳过刷新');
                 return;
             }

             // 检查表头是否有自定义列
             const hasCustomHeaders = header.querySelector('.custom-column');
             if (!hasCustomHeaders) {
                 console.log('表头缺少自定义列，重新添加...');
                 addNewColumns();
                 bindSortingEvents();
             }

             // 检查数据行是否需要更新
             const allRows = document.querySelectorAll('.ecom-table tbody tr');
             const rowsWithoutCustomColumns = Array.from(allRows).filter(row =>
                 !row.querySelector('.custom-column') &&
                 row.querySelectorAll('td').length >= 6 &&
                 Array.from(row.querySelectorAll('td')).some(cell => {
                     const text = cell.textContent.trim();
                     return text && text !== '-' && text !== '加载中' && !text.includes('暂无数据');
                 })
             );

             if (rowsWithoutCustomColumns.length > 0) {
                 console.log(`发现${rowsWithoutCustomColumns.length}行需要添加自定义列`);
                 addDataToRows();
             } else {
                 console.log('所有数据行都已有自定义列');
             }

             console.log('表格列刷新完成');
         } catch (error) {
             console.error('刷新表格列失败:', error);
         }
     }

     // 强制重建所有列（彻底解决方案）
     function forceRebuildColumns() {
         console.log('🔨 开始强制重建表格列...');

         try {
             // 第1步：彻底清理所有自定义内容
             console.log('📝 步骤1: 彻底清理自定义列');
             const allCustomElements = document.querySelectorAll('.custom-column, .avg-order-value, .opm, .gpm');
             allCustomElements.forEach((element, index) => {
                 console.log(`  移除元素 ${index + 1}: ${element.className}`);
                 element.remove();
             });

             // 第2步：等待DOM更新
             setTimeout(() => {
                 console.log('📝 步骤2: 检查表格状态');
                 const table = document.querySelector('.ecom-table');
                 const header = document.querySelector('.ecom-table thead tr');
                 const tbody = document.querySelector('.ecom-table tbody');

                 if (!table || !header || !tbody) {
                     console.log('❌ 表格结构不完整，跳过重建');
                     return;
                 }

                 const dataRows = tbody.querySelectorAll('tr');
                 console.log(`   表格状态: ${dataRows.length}行数据`);

                 // 第3步：重新添加表头列
                 setTimeout(() => {
                     console.log('📝 步骤3: 重新添加表头列');
                     const result = addNewColumnsForce();

                     if (result) {
                         // 第4步：重新添加数据列
                         setTimeout(() => {
                             console.log('📝 步骤4: 重新添加数据列');
                             addDataToRowsForce();

                             // 第5步：重新绑定事件
                             setTimeout(() => {
                                 console.log('📝 步骤5: 重新绑定排序事件');
                                 bindSortingEvents();
                                 console.log('✅ 强制重建完成！');
                             }, 200);
                         }, 300);
                     }
                 }, 200);
             }, 300);

         } catch (error) {
             console.error('❌ 强制重建失败:', error);
         }
     }

    // 初始化
    function init() {
        console.log('=== 抖音小店数据抓取脚本初始化 ===');
        console.log('当前URL:', window.location.href);
        console.log('=== 页面检测详情 ===');
        console.log('当前域名:', window.location.hostname);
        console.log('当前路径:', window.location.pathname);
        console.log('完整URL:', window.location.href);
        console.log('检测结果 - isHomepage:', isHomepage, 'isCompassHome:', isCompassHome, 'isCoreUsers:', isCoreUsers, 'isGoodsUserAnalysis:', isGoodsUserAnalysis, 'isProductList:', isProductList, 'isLiveDetail:', isLiveDetail, 'isCompetitorDetail:', isCompetitorDetail);

        setTimeout(() => {
            try {
                createFloatingButton();

                if (isHomepage || isCompassHome) {
                    console.log('进入工具选择模式，功能已就绪...');
                } else if (isCoreUsers) {
                    console.log('进入核心用户页面模式，创建转化率分析面板...');
                    createCoreUsersPanel();
                } else if (isLiveDetail) {
                    console.log('进入直播详情页面模式，准备添加直播分析卡片...');
                    // 延迟执行，等待页面完全加载
                    setTimeout(() => {
                        addLiveAnalysisCard();
                    }, 2000);
                } else if (isCompetitorDetail) {
                    console.log('进入竞对店铺页面模式，创建竞对数据查询面板...');
                    createCompetitorDataPanel();
                } else if (isGoodsUserAnalysis || isProductList) {
                    console.log('进入商品分析页面模式，增强表格功能...');
                    if (isGoodsUserAnalysis) {
                        createApiDataPanel();
                    }
                    // 添加表格增强功能
                    enhanceGoodsAnalysisTable();
                } else {
                    console.log('进入默认模式...');
                }
            } catch (error) {
                console.error('初始化过程中发生错误:', error);
            }
        }, 1000);
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();