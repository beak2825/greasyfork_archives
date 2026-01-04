// ==UserScript==
// @name         斗鱼直播间屏蔽器
// @namespace    https://github.com/yourname
// @version      2.0.0
// @description  完整的用户界面
// @author       专业前端工程师
// @match        *://www.douyu.com/*
// @match        *://www.douyu.com/directory/*
// @match        *://www.douyu.com/g_*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @run-at       document-start  // 关键：在DOM构建前执行
// @downloadURL https://update.greasyfork.org/scripts/450258/%E6%96%97%E9%B1%BC%E7%9B%B4%E6%92%AD%E9%97%B4%E5%B1%8F%E8%94%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/450258/%E6%96%97%E9%B1%BC%E7%9B%B4%E6%92%AD%E9%97%B4%E5%B1%8F%E8%94%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==============================
    // 第一部分：零延迟显示核心实现
    // ==============================

    // 1. 立即注入CSS，确保隐藏样式在页面渲染前就生效
    const blockerStyles = `
        .douyu-blocker-hidden {
            display: none !important;
        }
        .douyu-blocker-settings-panel {
            display: none;
        }
        .douyu-blocker-settings-panel.show {
            display: block;
        }
    `;

    // 尝试注入样式到head或documentElement
    try {
        if (document.head) {
            const style = document.createElement('style');
            style.id = 'douyu-blocker-styles';
            style.textContent = blockerStyles;
            document.head.appendChild(style);
        } else {
            // document-start阶段head可能不存在，直接注入到documentElement
            const style = document.createElement('style');
            style.id = 'douyu-blocker-styles';
            style.textContent = blockerStyles;
            document.documentElement.appendChild(style);
        }
    } catch (e) {
        console.log('[斗鱼屏蔽器] 样式注入失败:', e);
    }

    // 配置管理
    const CONFIG = {
        keywords: GM_getValue('keywords', []),
        roomIds: GM_getValue('roomIds', []),
        enabled: GM_getValue('enabled', true),

        // 优化：预编译正则表达式
        getKeywordRegexes: function() {
            if (!this._keywordRegexes) {
                this._keywordRegexes = this.keywords.map(keyword =>
                    new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
                );
            }
            return this._keywordRegexes;
        },

        // 优化：房间号转为Set提高查找速度
        getRoomIdSet: function() {
            if (!this._roomIdSet) {
                this._roomIdSet = new Set(this.roomIds);
            }
            return this._roomIdSet;
        },

        // 清除缓存
        clearCache: function() {
            delete this._keywordRegexes;
            delete this._roomIdSet;
        }
    };

    // 斗鱼直播间卡片选择器 - 基于网页源代码分析
    const SELECTORS = {
        roomCard: '.layout-Cover-item, .DyListCover-item, .Common-card, li[class*="Cover"]',
        titleLink: '.DyCardBottom-cardTitle, .DyLiveCard-title a, .Common-card-title a',
        coverLink: '.DyLiveListCover-livingMask, .Common-card-link',
        roomIdLink: 'a[href^="/"][target="_blank"]',
        mainContent: '#listAll, .layout-Main, .directory-list, [class*="layout-Module"]'
    };

    // ==============================
    // 第二部分：DOM拦截技术（零延迟核心）
    // ==============================

    // 重写DOM操作方法，在元素插入时立即检查
    const originalAppendChild = Element.prototype.appendChild;
    const originalInsertBefore = Element.prototype.insertBefore;

    // 用于存储需要检查的节点队列
    const pendingNodes = new Set();
    let isProcessing = false;

    // 检查节点是否应该被屏蔽
    function checkNodeForBlocking(node) {
        if (!node || node.nodeType !== 1 || !CONFIG.enabled) return false;

        // 检查节点本身是否是直播间卡片
        if (node.matches && node.matches(SELECTORS.roomCard)) {
            return shouldBlockElement(node);
        }

        // 检查节点的子节点
        if (node.querySelector && node.querySelector(SELECTORS.roomCard)) {
            const roomCards = node.querySelectorAll(SELECTORS.roomCard);
            for (let i = 0; i < roomCards.length; i++) {
                if (shouldBlockElement(roomCards[i])) {
                    roomCards[i].classList.add('douyu-blocker-hidden');
                }
            }
            return true;
        }

        return false;
    }

    // 处理待检查节点队列
    function processPendingNodes() {
        if (isProcessing || pendingNodes.size === 0) return;

        isProcessing = true;
        try {
            pendingNodes.forEach(node => {
                checkNodeForBlocking(node);
            });
            pendingNodes.clear();
        } finally {
            isProcessing = false;
        }
    }

    // 重写appendChild方法
    Element.prototype.appendChild = function(node) {
        const result = originalAppendChild.call(this, node);

        // 延迟处理，避免阻塞DOM操作
        if (node && node.nodeType === 1) {
            pendingNodes.add(node);
            setTimeout(processPendingNodes, 0);
        }

        return result;
    };

    // 重写insertBefore方法
    Element.prototype.insertBefore = function(newNode, referenceNode) {
        const result = originalInsertBefore.call(this, newNode, referenceNode);

        // 延迟处理，避免阻塞DOM操作
        if (newNode && newNode.nodeType === 1) {
            pendingNodes.add(newNode);
            setTimeout(processPendingNodes, 0);
        }

        return result;
    };

    // 判断元素是否应该被屏蔽
    function shouldBlockElement(element) {
        if (!CONFIG.enabled) return false;

        const roomIdSet = CONFIG.getRoomIdSet();
        const keywordRegexes = CONFIG.getKeywordRegexes();

        // 1. 检查房间号
        const links = element.querySelectorAll(SELECTORS.roomIdLink);
        for (let i = 0; i < links.length; i++) {
            const href = links[i].getAttribute('href');
            const roomIdMatch = href.match(/^\/(\d+)$/);
            if (roomIdMatch && roomIdSet.has(roomIdMatch[1])) {
                return true;
            }
        }

        // 2. 检查关键词
        if (keywordRegexes.length > 0) {
            const text = element.textContent || '';
            for (let i = 0; i < keywordRegexes.length; i++) {
                if (keywordRegexes[i].test(text)) {
                    return true;
                }
            }
        }

        return false;
    }

    // ==============================
    // 第三部分：用户界面（完整版）
    // ==============================

    // 创建设置面板HTML
    function createSettingsPanel() {
        const panelHTML = `
            <div class="douyu-blocker-settings-panel" id="douyuBlockerPanel">
                <div class="douyu-blocker-header">
                    <h3>⚙️ 斗鱼屏蔽设置</h3>
                    <button class="douyu-blocker-close-btn">×</button>
                </div>

                <div class="douyu-blocker-notice">
                    <strong>使用说明：</strong><br>
                    1. 关键词匹配直播间标题或主播名<br>
                    2. 房间号精确匹配特定直播间<br>
                    3. 支持滚动加载自动屏蔽
                </div>

                <div class="douyu-blocker-section">
                    <div class="douyu-blocker-section-title">
                        <span>关键词屏蔽</span>
                        <span class="douyu-blocker-count" id="keywordCount">${CONFIG.keywords.length}个</span>
                    </div>
                    <div class="douyu-blocker-input-group">
                        <input type="text" class="douyu-blocker-input" id="keywordInput" placeholder="输入屏蔽关键词">
                        <button class="douyu-blocker-btn" id="addKeywordBtn">添加</button>
                    </div>
                    <div class="douyu-blocker-list" id="keywordList"></div>
                </div>

                <div class="douyu-blocker-section">
                    <div class="douyu-blocker-section-title">
                        <span>房间号屏蔽</span>
                        <span class="douyu-blocker-count" id="roomIdCount">${CONFIG.roomIds.length}个</span>
                    </div>
                    <div class="douyu-blocker-input-group">
                        <input type="text" class="douyu-blocker-input" id="roomIdInput" placeholder="输入房间号">
                        <button class="douyu-blocker-btn" id="addRoomIdBtn">添加</button>
                    </div>
                    <div class="douyu-blocker-list" id="roomIdList"></div>
                </div>

                <div class="douyu-blocker-section">
                    <button class="douyu-blocker-btn douyu-blocker-toggle-btn" id="toggleBlockingBtn" style="width:100%;">
                        ${CONFIG.enabled ? '🔴 暂停屏蔽' : '🟢 启用屏蔽'}
                    </button>
                    <button class="douyu-blocker-btn douyu-blocker-clear-btn" id="clearAllBtn" style="width:100%;margin-top:10px;">
                        🗑️ 清空设置
                    </button>
                </div>
            </div>
        `;

        const panel = document.createElement('div');
        panel.innerHTML = panelHTML;
        return panel.firstElementChild;
    }

    // 创建控制按钮
    function createControlButton() {
        const button = document.createElement('button');
        button.id = 'douyuBlockerToggleBtn';
        button.innerHTML = '⚙️';
        button.title = '斗鱼屏蔽设置';

        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #ff6b6b, #ff5252);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-size: 24px;
            box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
            z-index: 10000;
            transition: all 0.3s ease;
        `;

        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.boxShadow = '0 6px 20px rgba(255, 107, 107, 0.6)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.4)';
        });

        return button;
    }

    // 添加UI样式
    function addUIStyles() {
        const uiStyles = `
            .douyu-blocker-settings-panel {
                position: fixed;
                top: 100px;
                right: 20px;
                width: 350px;
                background: white;
                border: 2px solid #ff6b6b;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                z-index: 10001;
                font-family: 'Microsoft YaHei', 'Segoe UI', sans-serif;
                padding: 20px;
                max-height: 80vh;
                overflow-y: auto;
                animation: panelSlideIn 0.3s ease;
            }

            @keyframes panelSlideIn {
                from {
                    opacity: 0;
                    transform: translateX(100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            .douyu-blocker-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                padding-bottom: 12px;
                border-bottom: 2px solid #f0f0f0;
            }

            .douyu-blocker-header h3 {
                margin: 0;
                color: #ff6b6b;
                font-size: 18px;
                font-weight: bold;
            }

            .douyu-blocker-close-btn {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #999;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.2s;
            }

            .douyu-blocker-close-btn:hover {
                background: #f5f5f5;
            }

            .douyu-blocker-notice {
                background: linear-gradient(135deg, #fff3cd, #ffeaa7);
                border: 1px solid #ffd166;
                color: #856404;
                padding: 12px;
                border-radius: 8px;
                margin-bottom: 20px;
                font-size: 13px;
                line-height: 1.5;
            }

            .douyu-blocker-section {
                margin-bottom: 25px;
            }

            .douyu-blocker-section-title {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }

            .douyu-blocker-section-title span:first-child {
                font-size: 16px;
                font-weight: 600;
                color: #333;
            }

            .douyu-blocker-count {
                background: #ff6b6b;
                color: white;
                padding: 3px 10px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: bold;
            }

            .douyu-blocker-input-group {
                display: flex;
                gap: 8px;
                margin-bottom: 12px;
            }

            .douyu-blocker-input {
                flex: 1;
                padding: 10px 14px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 14px;
                transition: border-color 0.2s;
            }

            .douyu-blocker-input:focus {
                outline: none;
                border-color: #ff6b6b;
            }

            .douyu-blocker-btn {
                padding: 10px 20px;
                background: linear-gradient(135deg, #ff6b6b, #ff5252);
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                transition: all 0.2s;
                white-space: nowrap;
            }

            .douyu-blocker-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
            }

            .douyu-blocker-clear-btn {
                background: linear-gradient(135deg, #6c757d, #5a6268);
            }

            .douyu-blocker-clear-btn:hover {
                box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
            }

            .douyu-blocker-list {
                max-height: 200px;
                overflow-y: auto;
                border: 2px solid #f0f0f0;
                border-radius: 8px;
                padding: 10px;
            }

            .douyu-blocker-list-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 12px;
                margin-bottom: 6px;
                background: #f8f9fa;
                border-radius: 6px;
                font-size: 14px;
                animation: itemFadeIn 0.3s ease;
            }

            @keyframes itemFadeIn {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .douyu-blocker-list-item:hover {
                background: #e9ecef;
            }

            .douyu-blocker-remove-btn {
                background: #ff6b6b;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 4px 10px;
                cursor: pointer;
                font-size: 12px;
                font-weight: bold;
                transition: background 0.2s;
            }

            .douyu-blocker-remove-btn:hover {
                background: #ff5252;
            }

            #douyuBlockerToggleBtn:active {
                transform: scale(0.95);
            }
        `;

        const style = document.createElement('style');
        style.textContent = uiStyles;
        document.head.appendChild(style);
    }

    // 更新列表显示
    function updateLists() {
        // 更新关键词列表
        const keywordList = document.getElementById('keywordList');
        if (keywordList) {
            keywordList.innerHTML = CONFIG.keywords.map(keyword => `
                <div class="douyu-blocker-list-item">
                    <span>${keyword}</span>
                    <button class="douyu-blocker-remove-btn" data-type="keyword" data-value="${keyword}">删除</button>
                </div>
            `).join('');
        }

        // 更新房间号列表
        const roomIdList = document.getElementById('roomIdList');
        if (roomIdList) {
            roomIdList.innerHTML = CONFIG.roomIds.map(roomId => `
                <div class="douyu-blocker-list-item">
                    <span>${roomId}</span>
                    <button class="douyu-blocker-remove-btn" data-type="roomId" data-value="${roomId}">删除</button>
                </div>
            `).join('');
        }

        // 更新计数
        const keywordCount = document.getElementById('keywordCount');
        const roomIdCount = document.getElementById('roomIdCount');
        const toggleBtn = document.getElementById('toggleBlockingBtn');

        if (keywordCount) keywordCount.textContent = `${CONFIG.keywords.length}个`;
        if (roomIdCount) roomIdCount.textContent = `${CONFIG.roomIds.length}个`;
        if (toggleBtn) {
            toggleBtn.textContent = CONFIG.enabled ? '🔴 暂停屏蔽' : '🟢 启用屏蔽';
            toggleBtn.style.background = CONFIG.enabled
                ? 'linear-gradient(135deg, #ff6b6b, #ff5252)'
                : 'linear-gradient(135deg, #28a745, #20c997)';
        }
    }

    // ==============================
    // 第四部分：事件处理函数
    // ==============================

    function addKeyword() {
        const input = document.getElementById('keywordInput');
        const keyword = input.value.trim();

        if (!keyword) return;

        if (!CONFIG.keywords.includes(keyword)) {
            CONFIG.keywords.push(keyword);
            GM_setValue('keywords', CONFIG.keywords);
            CONFIG.clearCache();
            updateLists();
            blockAllRooms(); // 重新屏蔽
        }

        input.value = '';
        input.focus();
    }

    function removeKeyword(keyword) {
        const index = CONFIG.keywords.indexOf(keyword);
        if (index > -1) {
            CONFIG.keywords.splice(index, 1);
            GM_setValue('keywords', CONFIG.keywords);
            CONFIG.clearCache();
            updateLists();
            blockAllRooms(); // 重新屏蔽
        }
    }

    function addRoomId() {
        const input = document.getElementById('roomIdInput');
        const roomId = input.value.trim();

        if (!roomId) return;

        if (!CONFIG.roomIds.includes(roomId)) {
            CONFIG.roomIds.push(roomId);
            GM_setValue('roomIds', CONFIG.roomIds);
            CONFIG.clearCache();
            updateLists();
            blockAllRooms(); // 重新屏蔽
        }

        input.value = '';
        input.focus();
    }

    function removeRoomId(roomId) {
        const index = CONFIG.roomIds.indexOf(roomId);
        if (index > -1) {
            CONFIG.roomIds.splice(index, 1);
            GM_setValue('roomIds', CONFIG.roomIds);
            CONFIG.clearCache();
            updateLists();
            blockAllRooms(); // 重新屏蔽
        }
    }

    function toggleBlocking() {
        CONFIG.enabled = !CONFIG.enabled;
        GM_setValue('enabled', CONFIG.enabled);
        updateLists();

        if (CONFIG.enabled) {
            blockAllRooms(); // 启用屏蔽
        } else {
            // 暂停屏蔽，显示所有内容
            document.querySelectorAll('.douyu-blocker-hidden').forEach(el => {
                el.classList.remove('douyu-blocker-hidden');
            });
        }
    }

    function clearAll() {
        if (confirm('确定要清空所有屏蔽设置吗？此操作不可撤销。')) {
            CONFIG.keywords = [];
            CONFIG.roomIds = [];
            GM_setValue('keywords', []);
            GM_setValue('roomIds', []);
            CONFIG.clearCache();
            updateLists();
            blockAllRooms();
        }
    }

    // ==============================
    // 第五部分：屏蔽功能函数
    // ==============================

    function blockAllRooms() {
        if (!CONFIG.enabled) return;

        const roomCards = document.querySelectorAll(SELECTORS.roomCard);
        let blockedCount = 0;

        roomCards.forEach(card => {
            if (shouldBlockElement(card)) {
                card.classList.add('douyu-blocker-hidden');
                blockedCount++;
            } else {
                card.classList.remove('douyu-blocker-hidden');
            }
        });

        if (blockedCount > 0) {
            console.log(`[斗鱼屏蔽器] 已屏蔽 ${blockedCount} 个直播间`);
        }

        return blockedCount;
    }

    // 设置MutationObserver监听动态加载
    function setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            let shouldCheck = false;

            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldCheck = true;
                    break;
                }
            }

            if (shouldCheck && CONFIG.enabled) {
                setTimeout(blockAllRooms, 50);
            }
        });

        // 监听主内容区域
        const mainContent = document.querySelector(SELECTORS.mainContent);
        if (mainContent) {
            observer.observe(mainContent, {
                childList: true,
                subtree: true
            });
        }

        // 监听整个文档变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        return observer;
    }

    // ==============================
    // 第六部分：初始化函数
    // ==============================

    function initUI() {
        // 添加UI样式
        addUIStyles();

        // 创建设置面板
        const panel = createSettingsPanel();
        document.body.appendChild(panel);

        // 创建控制按钮
        const toggleBtn = createControlButton();
        document.body.appendChild(toggleBtn);

        // 更新列表
        updateLists();

        // 绑定事件
        document.getElementById('douyuBlockerToggleBtn').addEventListener('click', function() {
            const panel = document.getElementById('douyuBlockerPanel');
            panel.classList.toggle('show');
        });

        document.querySelector('.douyu-blocker-close-btn').addEventListener('click', function() {
            document.getElementById('douyuBlockerPanel').classList.remove('show');
        });

        document.getElementById('addKeywordBtn').addEventListener('click', addKeyword);
        document.getElementById('addRoomIdBtn').addEventListener('click', addRoomId);
        document.getElementById('toggleBlockingBtn').addEventListener('click', toggleBlocking);
        document.getElementById('clearAllBtn').addEventListener('click', clearAll);

        // 关键词输入框回车事件
        document.getElementById('keywordInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') addKeyword();
        });

        // 房间号输入框回车事件
        document.getElementById('roomIdInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') addRoomId();
        });

        // 委托删除按钮事件
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('douyu-blocker-remove-btn')) {
                const type = e.target.getAttribute('data-type');
                const value = e.target.getAttribute('data-value');

                if (type === 'keyword') {
                    removeKeyword(value);
                } else if (type === 'roomId') {
                    removeRoomId(value);
                }
            }
        });

        // 点击外部关闭面板
        document.addEventListener('click', function(e) {
            const panel = document.getElementById('douyuBlockerPanel');
            const toggleBtn = document.getElementById('douyuBlockerToggleBtn');

            if (panel && panel.classList.contains('show') &&
                !panel.contains(e.target) &&
                e.target !== toggleBtn &&
                !toggleBtn.contains(e.target)) {
                panel.classList.remove('show');
            }
        });

        // 注册Tampermonkey菜单命令
        if (typeof GM_registerMenuCommand !== 'undefined') {
            GM_registerMenuCommand('打开屏蔽设置', () => {
                document.getElementById('douyuBlockerPanel').classList.add('show');
            });
            GM_registerMenuCommand('暂停/启用屏蔽', toggleBlocking);
        }

        console.log('[斗鱼屏蔽器] UI初始化完成');
    }

    // ==============================
    // 第七部分：主初始化函数
    // ==============================

    function init() {
        console.log('[斗鱼屏蔽器] 脚本加载，启用状态:', CONFIG.enabled);

        // 初始屏蔽
        if (CONFIG.enabled) {
            setTimeout(blockAllRooms, 500);
        }

        // 设置MutationObserver
        setupMutationObserver();

        // 延迟初始化UI（避免影响初始屏蔽性能）
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(initUI, 1000);
            });
        } else {
            setTimeout(initUI, 1000);
        }

        // 监听滚动事件，滚动时重新检查
        let scrollTimer = null;
        window.addEventListener('scroll', function() {
            if (scrollTimer) clearTimeout(scrollTimer);

            scrollTimer = setTimeout(function() {
                if (CONFIG.enabled) {
                    blockAllRooms();
                }
            }, 300);
        });

        // 监听页面可见性变化
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden && CONFIG.enabled) {
                setTimeout(blockAllRooms, 300);
            }
        });
    }

    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
