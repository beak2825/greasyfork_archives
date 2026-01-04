// ==UserScript==
// @name         L站评论筛选器 (LDoLens)
// @namespace    https://github.com/YumingMa-CN/LDoLens
// @version      2.3.0
// @description  筛选LinuxDo论坛评论，只看指定用户的发言，支持移动端和深色模式
// @author       Yuming Ma
// @match        https://linux.do/t/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540675/L%E7%AB%99%E8%AF%84%E8%AE%BA%E7%AD%9B%E9%80%89%E5%99%A8%20%28LDoLens%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540675/L%E7%AB%99%E8%AF%84%E8%AE%BA%E7%AD%9B%E9%80%89%E5%99%A8%20%28LDoLens%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检测是否为移动设备
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    
    // 检测是否为深色模式
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // 深色模式颜色配置
    const darkColors = {
        background: '#1a1a1a',
        surface: '#2d2d2d',
        surfaceHover: '#3a3a3a',
        border: '#404040',
        text: '#e0e0e0',
        textSecondary: '#b0b0b0',
        primary: '#4a9eff',
        primaryHover: '#357abd'
    };
    
    // 浅色模式颜色配置
    const lightColors = {
        background: '#ffffff',
        surface: '#f8f9fa',
        surfaceHover: '#e9ecef',
        border: '#dee2e6',
        text: '#333333',
        textSecondary: '#6c757d',
        primary: '#007bff',
        primaryHover: '#0056b3'
    };
    
    const colors = isDarkMode ? darkColors : lightColors;

    // 状态管理
    let state = {
        commenters: new Map(),
        traceReplies: false,
        lastSelectedIds: [],
        pluginEnabled: GM_getValue('pluginEnabled', true)
    };

    let mainObserver = null;
    let currentTopicId = null;

    // 样式注入 - 适配移动端
    GM_addStyle(`
        #comment-filter-icon {
            position: fixed !important;
            display: flex !important;
            top: ${isMobile ? '70%' : '50%'};
            right: ${isMobile ? '10px' : '15px'} !important;
            width: ${isMobile ? '40px' : '48px'} !important;
            height: ${isMobile ? '40px' : '48px'} !important;
            background-image: linear-gradient(
                to bottom,
                black 0%,
                black 25%,
                rgb(221, 219, 219) 25%,
                rgb(221, 219, 219) 75%,
                rgb(255, 202, 56) 75%,
                rgb(255, 202, 56) 100%
            );
            border-radius: 50% !important;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2) !important;
            z-index: 99990 !important;
            align-items: center !important;
            justify-content: center !important;
            color: rgb(0, 0, 0) !important;
            cursor: pointer !important;
            transition: transform 0.2s ease-in-out;
        }

        #comment-filter-icon:hover {
            transform: scale(1.1) !important;
        }

        #comment-filter-icon:active {
            cursor: grabbing !important;
            transform: scale(0.9) !important;
        }

        #comment-filter-icon svg {
            width: 55%;
            height: 55%;
            fill: #000000;
        }

        /* 深色模式下的浮动按钮 */
        @media (prefers-color-scheme: dark) {
            #comment-filter-icon {
                box-shadow: 0 4px 12px rgba(0,0,0,0.5) !important;
            }
            
            #comment-filter-icon svg {
                fill: #ffffff;
            }
        }

        #comment-filter-modal {
            position: fixed !important;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            height: 100dvh; /* 使用动态视口高度，适应地址栏变化 */
            background-color: rgba(0, 0, 0, 0.5) !important;
            z-index: 99999 !important;
            display: flex !important;
            justify-content: center;
            align-items: ${isMobile ? 'flex-end' : 'center'};
            opacity: 1;
            visibility: visible;
            transition: opacity 0.3s, visibility 0.3s;
        }

        #comment-filter-modal.filter-modal-hidden {
            opacity: 0 !important;
            visibility: hidden !important;
        }

        .filter-modal-content {
            display: flex !important;
            flex-direction: column !important;
            max-width: ${isMobile ? '100%' : '500px'} !important;
            height: ${isMobile ? 'calc(75vh - env(safe-area-inset-bottom))' : 'auto'} !important;
            height: ${isMobile ? 'calc(75dvh - env(safe-area-inset-bottom))' : 'auto'} !important;
            max-height: ${isMobile ? 'calc(100vh - 20px)' : '70vh'} !important;
            max-height: ${isMobile ? 'calc(100dvh - 20px)' : '70vh'} !important;
            background-color: ${colors.background};
            border-radius: ${isMobile ? '16px 16px 0 0' : '8px'};
            width: ${isMobile ? '100%' : '90%'};
            box-shadow: 0 5px 15px rgba(0,0,0,${isDarkMode ? '0.5' : '0.3'});
            overflow: hidden;
            position: relative;
            ${isMobile ? 'padding-bottom: env(safe-area-inset-bottom);' : ''}
        }

        .filter-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: ${isMobile ? '16px' : '12px 20px'};
            border-bottom: 1px solid ${colors.border};
            background-color: ${colors.surface};
            flex-shrink: 0;
            position: sticky;
            top: 0;
            z-index: 10;
        }

        .filter-modal-header h3 {
            margin: 0;
            font-size: ${isMobile ? '16px' : '18px'};
            color: ${colors.text};
        }

        #close-filter-modal {
            border: none;
            background: none;
            font-size: ${isMobile ? '24px' : '28px'};
            cursor: pointer;
            color: ${colors.textSecondary};
            padding: ${isMobile ? '8px' : '0'};
            line-height: 1;
            transition: color 0.2s;
        }
        
        #close-filter-modal:hover {
            color: ${colors.text};
        }

        .filter-modal-body {
            flex: 1;
            min-height: 0;
            display: flex;
            flex-direction: column;
            padding: ${isMobile ? '12px' : '15px 20px'};
            overflow: hidden;
            background-color: ${colors.background};
        }

        #user-search-input {
            flex-shrink: 0;
            margin-bottom: 10px;
            padding: ${isMobile ? '10px' : '8px'};
            font-size: ${isMobile ? '16px' : '14px'};
            border: 1px solid ${colors.border};
            border-radius: 4px;
            -webkit-appearance: none;
            box-sizing: border-box;
            background-color: ${isDarkMode ? colors.surface : '#fff'};
            color: ${colors.text};
        }
        
        #user-search-input::placeholder {
            color: ${colors.textSecondary};
        }
        
        #user-search-input:focus {
            outline: none;
            border-color: ${colors.primary};
        }

        #user-filter-list {
            flex: 1;
            overflow-y: auto;
            overflow-x: hidden;
            list-style: none;
            padding: 0;
            margin: 0;
            -webkit-overflow-scrolling: touch;
            min-height: 0;
        }

        .filter-user-item {
            margin-bottom: ${isMobile ? '4px' : '2px'};
        }

        .filter-user-item label {
            display: flex;
            align-items: center;
            padding: ${isMobile ? '12px 8px' : '8px 5px'};
            cursor: pointer;
            border-radius: 4px;
            transition: background-color 0.2s;
        }

        .filter-user-item label:hover {
            background-color: ${colors.surfaceHover};
        }

        .user-checkbox {
            margin-right: 12px;
            width: ${isMobile ? '22px' : '20px'};
            height: ${isMobile ? '22px' : '20px'};
            cursor: pointer;
            accent-color: ${colors.primary};
        }

        .filter-user-avatar {
            width: ${isMobile ? '32px' : '25px'};
            height: ${isMobile ? '32px' : '25px'};
            border-radius: 50%;
            margin-right: 10px;
            object-fit: cover;
            background-color: ${colors.surface};
            border: 1px solid ${colors.border};
        }

        .filter-user-name {
            font-size: ${isMobile ? '15px' : '16px'};
            color: ${colors.text};
        }

        .filter-modal-footer {
            display: flex;
            flex-direction: ${isMobile ? 'column' : 'row'};
            justify-content: ${isMobile ? 'center' : 'space-between'};
            align-items: ${isMobile ? 'stretch' : 'center'};
            gap: ${isMobile ? '8px' : '10px'};
            padding: ${isMobile ? '16px' : '12px 20px'};
            ${isMobile ? 'padding-bottom: calc(16px + env(safe-area-inset-bottom));' : ''}
            border-top: 1px solid ${colors.border};
            background-color: ${colors.surface};
            flex-shrink: 0;
            position: sticky;
            bottom: 0;
            z-index: 10;
        }

        .trace-switch-container {
            display: flex;
            align-items: center;
            margin: ${isMobile ? '0 0 12px 0' : '0 auto 0 0'};
            justify-content: ${isMobile ? 'center' : 'flex-start'};
        }

        .trace-switch-container > span {
            margin-left: 8px;
            font-size: 14px;
            color: ${colors.text};
        }

        .action-buttons-container {
            display: flex;
            gap: ${isMobile ? '8px' : '10px'};
            width: ${isMobile ? '100%' : 'auto'};
            justify-content: ${isMobile ? 'space-between' : 'flex-end'};
        }

        #apply-filter-btn, #select-all-users, #deselect-all-users {
            padding: ${isMobile ? '10px 16px' : '8px 16px'};
            border: 1px solid ${isDarkMode ? colors.border : '#797d81'};
            background-color: ${isDarkMode ? colors.surface : '#fff'};
            color: ${isDarkMode ? colors.text : '#495057'};
            border-radius: 4px;
            cursor: pointer;
            flex: ${isMobile ? '1' : 'auto'};
            font-size: ${isMobile ? '14px' : '13px'};
            text-align: center;
            -webkit-tap-highlight-color: transparent;
            transition: all 0.2s;
        }

        #apply-filter-btn {
            background-color: ${colors.primary};
            color: #fff;
            border-color: ${colors.primary};
        }

        #apply-filter-btn:hover {
            background-color: ${colors.primaryHover};
            border-color: ${colors.primaryHover};
        }

        #select-all-users:hover, #deselect-all-users:hover {
            background-color: ${colors.surfaceHover};
            border-color: ${colors.primary};
        }

        .trace-switch {
            position: relative;
            display: inline-block;
            width: 40px;
            height: 22px;
        }

        .trace-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: ${isDarkMode ? '#555' : '#ccc'};
            transition: .4s;
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .4s;
        }

        input:checked + .slider {
            background-color: ${colors.primary};
        }

        input:checked + .slider:before {
            transform: translateX(18px);
        }

        .slider.round {
            border-radius: 22px;
        }

        .slider.round:before {
            border-radius: 50%;
        }

        /* 滚动条样式 - 深色模式适配 */
        #user-filter-list::-webkit-scrollbar {
            width: 6px;
        }
        
        #user-filter-list::-webkit-scrollbar-track {
            background: ${isDarkMode ? colors.surface : '#f1f1f1'};
        }
        
        #user-filter-list::-webkit-scrollbar-thumb {
            background: ${isDarkMode ? '#555' : '#888'};
            border-radius: 3px;
        }
        
        #user-filter-list::-webkit-scrollbar-thumb:hover {
            background: ${isDarkMode ? '#666' : '#555'};
        }

        /* 移动端滑动提示 */
        .mobile-drag-hint {
            position: absolute;
            top: -25px;
            right: 0;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
        }

        /* 确保移动端模态框不会超出视口 */
        @media (max-width: 768px) {
            #comment-filter-modal {
                align-items: flex-end;
                padding: 0;
            }
            
            .filter-modal-content {
                margin: 0;
                border-radius: 16px 16px 0 0;
                height: 75vh;
                height: 75dvh;
                max-height: calc(100vh - 20px);
                max-height: calc(100dvh - 20px);
                display: flex;
                flex-direction: column;
                touch-action: pan-y;
            }
            
            .filter-modal-body {
                flex: 1;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                min-height: 0;
            }
            
            #user-filter-list {
                flex: 1;
                overflow-y: auto;
                min-height: 0;
                overscroll-behavior: contain;
            }
            
            /* 防止滚动时触发浏览器的下拉刷新 */
            .filter-modal-content * {
                overscroll-behavior: contain;
            }
        }-height: 0;
            }
        }

        @keyframes slideUp {
            from {
                transform: translateY(100%);
            }
            to {
                transform: translateY(0);
            }
        }
    `);

    // 主要功能函数
    function resetStateAndUI() {
        if (mainObserver) mainObserver.disconnect();
        mainObserver = null;
        document.getElementById('comment-filter-icon')?.remove();
        document.getElementById('comment-filter-modal')?.remove();
        state.commenters = new Map();
        state.traceReplies = false;
        state.lastSelectedIds = [];
    }

    function initializeForTopic() {
        if (!state.pluginEnabled) return;
        createAndAppendUI();
        startMainObserver();
    }

    function startMainObserver() {
        if (mainObserver) mainObserver.disconnect();
        mainObserver = new MutationObserver(debounce(handleDOMChange, 300));
        mainObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src']
        });
    }

    function handleDOMChange() {
        if (!state.pluginEnabled) return;
        createAndAppendUI();
        updateFilterList();
        if (state.lastSelectedIds.length > 0) applyFilter(state.lastSelectedIds, false);
    }

    function updateFilterList() {
        const freshCommenters = getCommenters();
        const userListElement = document.getElementById('user-filter-list');
        if (!userListElement) return;
        
        const isFilterActive = state.lastSelectedIds.length > 0;
        freshCommenters.forEach((commenterData, userId) => {
            state.commenters.set(userId, commenterData);
            if (!userListElement.querySelector(`input[value="${userId}"]`)) {
                const isCheckedByDefault = isFilterActive && state.lastSelectedIds.includes(userId);
                const checkedAttribute = isCheckedByDefault ? 'checked' : '';
                const li = document.createElement('li');
                li.className = 'filter-user-item';
                li.innerHTML = `<label><input type="checkbox" class="user-checkbox" value="${userId}" ${checkedAttribute}><img src="${commenterData.avatar}" class="filter-user-avatar"><span class="filter-user-name">${commenterData.name}</span></label>`;
                userListElement.appendChild(li);
                
                // 防止新添加的复选框点击事件冒泡
                li.addEventListener('click', (e) => {
                    if (e.target.tagName === 'INPUT' || e.target.tagName === 'LABEL') {
                        return;
                    }
                    e.stopPropagation();
                });
            }
        });
    }

    function createAndAppendUI() {
        if (document.getElementById('comment-filter-icon')) return;
        const initialCommenters = getCommenters();
        if (initialCommenters.size === 0) return;
        state.commenters = initialCommenters;

        const filterIcon = document.createElement('div');
        filterIcon.id = 'comment-filter-icon';
        document.body.appendChild(filterIcon);

        filterIcon.title = '筛选评论用户';
        filterIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" viewBox="0 0 16 16">
            <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2z"/>
        </svg>`;

        makeElementDraggable(filterIcon);

        if (!document.getElementById('comment-filter-modal')) {
            const modal = document.createElement('div');
            modal.id = 'comment-filter-modal';
            modal.className = 'filter-modal-hidden';
            
            let userListHTML = Array.from(state.commenters.values())
                .map(c => `<li class="filter-user-item"><label><input type="checkbox" class="user-checkbox" value="${c.id}"><img src="${c.avatar}" class="filter-user-avatar"><span class="filter-user-name">${c.name}</span></label></li>`)
                .join('');
            
            modal.innerHTML = `
                <div class="filter-modal-content">
                    <div class="filter-modal-header">
                        <h3>筛选评论用户</h3>
                        <button id="close-filter-modal" title="关闭">&times;</button>
                    </div>
                    <div class="filter-modal-body">
                        <input type="text" id="user-search-input" placeholder="搜索用户...">
                        <ul id="user-filter-list">${userListHTML}</ul>
                    </div>
                    <div class="filter-modal-footer">
                        <div class="trace-switch-container">
                            <label class="trace-switch">
                                <input type="checkbox" id="trace-replies-checkbox">
                                <span class="slider round"></span>
                            </label>
                            <span>追踪回复链</span>
                        </div>
                        <div class="action-buttons-container">
                            <button id="select-all-users">全选</button>
                            <button id="deselect-all-users">取消</button>
                            <button id="apply-filter-btn">应用</button>
                        </div>
                    </div>
                </div>`;
            
            document.body.appendChild(modal);

            // 事件监听
            modal.querySelector('#close-filter-modal').addEventListener('click', () => {
                modal.classList.add('filter-modal-hidden');
            });

            modal.addEventListener('click', (e) => {
                // 只有点击背景遮罩时才关闭（移动端禁用此功能）
                if (!isMobile && e.target.id === 'comment-filter-modal') {
                    modal.classList.add('filter-modal-hidden');
                }
            });

            // 移动端不再支持滑动关闭，只能通过关闭按钮关闭

            // 防止复选框点击事件冒泡导致面板关闭
            modal.querySelectorAll('.filter-user-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    // 如果点击的是复选框或标签，不要阻止默认行为
                    if (e.target.tagName === 'INPUT' || e.target.tagName === 'LABEL') {
                        return;
                    }
                    // 其他情况下阻止事件冒泡
                    e.stopPropagation();
                });
            });

            modal.querySelector('#user-search-input').addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                modal.querySelectorAll('.filter-user-item').forEach(item => {
                    const username = item.querySelector('.filter-user-name').textContent.toLowerCase();
                    item.style.display = username.includes(searchTerm) ? '' : 'none';
                });
            });

            modal.querySelector('#select-all-users').addEventListener('click', () => {
                modal.querySelectorAll('.user-checkbox').forEach(cb => cb.checked = true);
            });

            modal.querySelector('#deselect-all-users').addEventListener('click', () => {
                modal.querySelectorAll('.user-checkbox').forEach(cb => cb.checked = false);
            });

            modal.querySelector('#apply-filter-btn').addEventListener('click', () => {
                applyFilter(Array.from(modal.querySelectorAll('.user-checkbox:checked')).map(cb => cb.value));
                modal.classList.add('filter-modal-hidden');
            });

            modal.querySelector('#trace-replies-checkbox').addEventListener('change', (e) => {
                state.traceReplies = e.target.checked;
                if (state.lastSelectedIds.length > 0) applyFilter(state.lastSelectedIds);
            });
        }

        filterIcon.addEventListener('click', (e) => {
            if (filterIcon.wasDragged) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            document.getElementById('comment-filter-modal')?.classList.remove('filter-modal-hidden');
        });

        // 移动端增加 touchend 事件监听，确保点击能正常工作
        if (isMobile) {
            filterIcon.addEventListener('touchend', (e) => {
                // 如果不是拖动，则打开弹窗
                if (!filterIcon.wasDragged) {
                    e.preventDefault();
                    document.getElementById('comment-filter-modal')?.classList.remove('filter-modal-hidden');
                }
            });
        }
    }

    function makeElementDraggable(element) {
        if (isMobile) {
            // 移动端触摸拖动
            let startY = 0;
            let elementTop = 0;
            let isDragging = false;
            let hasMoved = false;

            element.addEventListener('touchstart', (e) => {
                startY = e.touches[0].clientY;
                elementTop = element.offsetTop;
                element.wasDragged = false;
                hasMoved = false;
                isDragging = true;
                // 不要阻止默认事件，让点击事件能正常触发
            });

            element.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                const currentY = e.touches[0].clientY;
                const deltaY = currentY - startY;
                
                // 只有移动超过5像素才认为是拖动
                if (Math.abs(deltaY) > 5) {
                    hasMoved = true;
                    element.wasDragged = true;
                    const newTop = elementTop + deltaY;
                    const maxY = window.innerHeight - element.offsetHeight;
                    element.style.top = `${Math.max(0, Math.min(newTop, maxY))}px`;
                    e.preventDefault();
                }
            });

            element.addEventListener('touchend', (e) => {
                isDragging = false;
                if (hasMoved && element.wasDragged) {
                    GM_setValue('filterIconPositionTop', element.style.top);
                    // 阻止点击事件
                    e.preventDefault();
                    e.stopPropagation();
                }
                setTimeout(() => {
                    element.wasDragged = false;
                }, 100);
            });
        } else {
            // 桌面端鼠标拖动
            let pos_y = 0, initial_mouse_y = 0;
            
            const savedTop = GM_getValue('filterIconPositionTop', null);
            if (savedTop) {
                element.style.top = savedTop;
            }

            element.onmousedown = dragMouseDown;

            function dragMouseDown(e) {
                e.preventDefault();
                element.wasDragged = false;
                initial_mouse_y = e.clientY;
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
            }

            function elementDrag(e) {
                e.preventDefault();
                element.wasDragged = true;
                pos_y = initial_mouse_y - e.clientY;
                initial_mouse_y = e.clientY;
                
                const newTop = element.offsetTop - pos_y;
                const maxY = window.innerHeight - element.offsetHeight;
                
                element.style.top = `${Math.max(0, Math.min(newTop, maxY))}px`;
            }

            function closeDragElement() {
                document.onmouseup = null;
                document.onmousemove = null;
                if (element.wasDragged) {
                    GM_setValue('filterIconPositionTop', element.style.top);
                }
            }
        }
    }

    function applyFilter(selectedUserIds, isUserAction = true) {
        if (isUserAction) state.lastSelectedIds = selectedUserIds;
        const allPostsOnPage = document.querySelectorAll('article[data-post-id]');
        
        if (selectedUserIds.length === 0) {
            allPostsOnPage.forEach(post => post.style.display = '');
            return;
        }
        
        let finalUserIdsToShow = new Set(selectedUserIds);
        
        if (state.traceReplies) {
            const userIdToPostsMap = new Map();
            allPostsOnPage.forEach(post => {
                const userId = post.querySelector('.names a[data-user-card]')?.getAttribute('data-user-card');
                if (userId) {
                    if (!userIdToPostsMap.has(userId)) userIdToPostsMap.set(userId, []);
                    userIdToPostsMap.get(userId).push(post);
                }
            });
            
            const queue = [...selectedUserIds];
            const processedUsers = new Set(selectedUserIds);
            
            while (queue.length > 0) {
                const currentUserId = queue.shift();
                const userPosts = userIdToPostsMap.get(currentUserId) || [];
                
                for (const post of userPosts) {
                    const replyTab = post.querySelector('.reply-to-tab span');
                    if (!replyTab) continue;
                    
                    const parentUsername = replyTab.textContent.trim();
                    const parentUser = Array.from(state.commenters.values()).find(c => c.name === parentUsername);
                    
                    if (parentUser && !processedUsers.has(parentUser.id)) {
                        finalUserIdsToShow.add(parentUser.id);
                        processedUsers.add(parentUser.id);
                        queue.push(parentUser.id);
                    }
                }
            }
        }
        
        allPostsOnPage.forEach(post => {
            const postAuthorId = post.querySelector('.names a[data-user-card]')?.getAttribute('data-user-card');
            post.style.display = (postAuthorId && finalUserIdsToShow.has(postAuthorId)) ? '' : 'none';
        });
    }

    function getCommenters() {
        const posts = document.querySelectorAll('article[data-post-id]');
        const commenters = new Map();
        
        posts.forEach(post => {
            const userLink = post.querySelector('.names a[data-user-card]');
            if (userLink) {
                const username = userLink.textContent.trim();
                const userId = userLink.getAttribute('data-user-card');
                const avatarSrc = post.querySelector('.post-avatar img.avatar')?.src || '';
                
                if (userId && !commenters.has(userId)) {
                    commenters.set(userId, { id: userId, name: username, avatar: avatarSrc });
                } else if (userId && commenters.has(userId)) {
                    const existing = commenters.get(userId);
                    if (!existing.avatar && avatarSrc) existing.avatar = avatarSrc;
                }
            }
        });
        
        return commenters;
    }

    let debounceTimer;
    function debounce(func, delay) {
        return function() {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(this, arguments), delay);
        };
    }

    function waitForElement(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) return resolve(document.querySelector(selector));
            const observer = new MutationObserver(() => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    // 监听页面导航
    const navigationObserver = new MutationObserver(() => {
        const titleElement = document.querySelector('h1[data-topic-id]');
        const newTopicId = titleElement ? titleElement.getAttribute('data-topic-id') : null;
        
        if (newTopicId && newTopicId !== currentTopicId) {
            currentTopicId = newTopicId;
            resetStateAndUI();
            if (state.pluginEnabled) {
                waitForElement('article[data-post-id]').then(initializeForTopic);
            }
        }
    });

    navigationObserver.observe(document.body, { childList: true, subtree: true });

    // 初始化
    waitForElement('h1[data-topic-id]').then(element => {
        const initialTopicId = element.getAttribute('data-topic-id');
        if (initialTopicId !== currentTopicId) {
            currentTopicId = initialTopicId;
            if (state.pluginEnabled) {
                initializeForTopic();
            }
        }
    });

    // 添加快捷键支持
    document.addEventListener('keydown', (e) => {
        // Alt + F 打开筛选器
        if (e.altKey && e.key === 'f') {
            e.preventDefault();
            const modal = document.getElementById('comment-filter-modal');
            if (modal) {
                modal.classList.toggle('filter-modal-hidden');
            }
        }
        
        // Esc 关闭筛选器
        if (e.key === 'Escape') {
            const modal = document.getElementById('comment-filter-modal');
            if (modal && !modal.classList.contains('filter-modal-hidden')) {
                modal.classList.add('filter-modal-hidden');
            }
        }
    });

    // 油猴菜单命令
    if (typeof GM_registerMenuCommand !== 'undefined') {
        GM_registerMenuCommand('切换筛选器状态', () => {
            state.pluginEnabled = !state.pluginEnabled;
            GM_setValue('pluginEnabled', state.pluginEnabled);
            
            if (state.pluginEnabled) {
                initializeForTopic();
                alert('L站评论筛选器已启用');
            } else {
                resetStateAndUI();
                alert('L站评论筛选器已禁用');
            }
        });

        GM_registerMenuCommand('清除所有设置', () => {
            if (confirm('确定要清除所有设置吗？')) {
                GM_setValue('pluginEnabled', true);
                GM_setValue('filterIconPositionTop', null);
                state = {
                    commenters: new Map(),
                    traceReplies: false,
                    lastSelectedIds: [],
                    pluginEnabled: true
                };
                resetStateAndUI();
                initializeForTopic();
                alert('设置已清除');
            }
        });
    }
})();