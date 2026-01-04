// ==UserScript==
// @name         知乎收藏夹静态化 - 深色网格布局
// @namespace    http://tampermonkey.net/
// @version      2.0.4
// @description  将知乎动态加载的收藏夹改为静态深色网格布局，支持搜索和手动刷新
// @author       You
// @match        https://www.zhihu.com/*
// @match        https://zhuanlan.zhihu.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538263/%E7%9F%A5%E4%B9%8E%E6%94%B6%E8%97%8F%E5%A4%B9%E9%9D%99%E6%80%81%E5%8C%96%20-%20%E6%B7%B1%E8%89%B2%E7%BD%91%E6%A0%BC%E5%B8%83%E5%B1%80.user.js
// @updateURL https://update.greasyfork.org/scripts/538263/%E7%9F%A5%E4%B9%8E%E6%94%B6%E8%97%8F%E5%A4%B9%E9%9D%99%E6%80%81%E5%8C%96%20-%20%E6%B7%B1%E8%89%B2%E7%BD%91%E6%A0%BC%E5%B8%83%E5%B1%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CACHE_KEY = 'zhihu_static_favlist_cache';
    const CACHE_VERSION_KEY = 'zhihu_static_favlist_version';
    const CURRENT_VERSION = '2.0.4'; // 修复刷新功能：恢复原始容器显示以触发懒加载

    // 添加自定义样式 - 深色模式
    GM_addStyle(`
        /* 网格布局容器 - 深色背景 */
        .static-favlists-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            padding: 16px;
            max-height: 500px;
            overflow-y: auto;
            background: #1a1a1a;
        }

        /* 自定义滚动条 - 深色 */
        .static-favlists-grid::-webkit-scrollbar {
            width: 8px;
        }

        .static-favlists-grid::-webkit-scrollbar-track {
            background: #2a2a2a;
            border-radius: 4px;
        }

        .static-favlists-grid::-webkit-scrollbar-thumb {
            background: #444;
            border-radius: 4px;
        }

        .static-favlists-grid::-webkit-scrollbar-thumb:hover {
            background: #555;
        }

        /* 单个收藏夹项 - 深色卡片 */
        .static-favlist-card {
            border: 1px solid #333;
            border-radius: 8px;
            padding: 12px;
            cursor: pointer;
            transition: all 0.2s;
            background: #2a2a2a;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-height: 100px;
        }

        .static-favlist-card:hover {
            border-color: #4a9eff;
            box-shadow: 0 2px 12px rgba(74, 158, 255, 0.25);
            transform: translateY(-2px);
            background: #303030;
        }

        .static-favlist-card.collected {
            background: #1e3a5f;
            border-color: #4a9eff;
        }

        .static-favlist-card.collected:hover {
            background: #24436e;
        }

        /* 收藏夹名称 - 浅色文字 */
        .static-favlist-name {
            font-size: 14px;
            font-weight: 500;
            color: #e8e8e8;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 4px;
            word-break: break-word;
        }

        .static-favlist-name svg {
            flex-shrink: 0;
            color: #999;
        }

        /* 内容数量 - 次要文字 */
        .static-favlist-count {
            font-size: 12px;
            color: #888;
            margin-bottom: 8px;
        }

        /* 收藏按钮 */
        .static-favlist-btn {
            padding: 6px 12px;
            border-radius: 4px;
            border: none;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s;
            width: 100%;
            font-weight: 500;
        }

        .static-favlist-btn.collect {
            background: #4a9eff;
            color: #fff;
        }

        .static-favlist-btn.collect:hover {
            background: #3a8eef;
        }

        .static-favlist-btn.collected {
            background: #3a3a3a;
            color: #888;
        }

        .static-favlist-btn.collected:hover {
            background: #424242;
        }

        /* 搜索框容器 - 深色 */
        .static-favlist-search-wrapper {
            padding: 16px;
            border-bottom: 1px solid #333;
            display: flex;
            gap: 8px;
            align-items: center;
            background: #1a1a1a;
        }

        .static-favlist-search {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #333;
            border-radius: 4px;
            font-size: 14px;
            outline: none;
            background: #2a2a2a;
            color: #e8e8e8;
            transition: all 0.2s;
        }

        .static-favlist-search::placeholder {
            color: #666;
        }

        .static-favlist-search:focus {
            border-color: #4a9eff;
            background: #303030;
        }

        /* 刷新按钮 - 深色 */
        .static-favlist-refresh {
            padding: 8px 16px;
            background: #2a2a2a;
            border: 1px solid #333;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            white-space: nowrap;
            transition: all 0.2s;
            color: #e8e8e8;
        }

        .static-favlist-refresh:hover {
            background: #333;
            border-color: #444;
        }

        .static-favlist-refresh.loading {
            opacity: 0.6;
            pointer-events: none;
        }

        /* 加载提示 - 深色 */
        .static-favlist-loading {
            text-align: center;
            padding: 40px;
            color: #888;
            font-size: 14px;
            background: #1a1a1a;
        }

        /* 空状态 - 深色 */
        .static-favlist-empty {
            text-align: center;
            padding: 40px;
            color: #888;
            font-size: 14px;
            background: #1a1a1a;
        }

        /* 响应式：屏幕较小时减少列数 */
        @media (max-width: 1400px) {
            .static-favlists-grid {
                grid-template-columns: repeat(4, 1fr);
            }
        }

        @media (max-width: 1000px) {
            .static-favlists-grid {
                grid-template-columns: repeat(3, 1fr);
            }
        }

        @media (max-width: 768px) {
            .static-favlists-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
    `);

    // 主控制器
    class StaticFavlistManager {
        constructor() {
            this.cachedData = null;
            this.isProcessing = false;
            this.domLoadPromise = null; // ✅ 新增：DOM加载完成的Promise
            this.loadCacheFromStorage();
            this.init();
        }

        init() {
            // 监听弹窗出现
            const observer = new MutationObserver(() => {
                const modal = document.querySelector('.FavlistsModal');
                if (modal && !modal.dataset.staticized && !this.isProcessing) {
                    this.handleModal(modal);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        async handleModal(modal) {
            this.isProcessing = true;
            modal.dataset.staticized = 'true';

            const container = modal.querySelector('.Favlists-content');
            if (!container) {
                this.isProcessing = false;
                return;
            }

            // ✅ 优化：检查缓存中是否有ID
            if (this.cachedData && this.cachedData.length > 0) {
                const hasAllIds = this.cachedData.every(f => f.id);

                if (hasAllIds) {
                    // 所有收藏夹都有ID，直接使用缓存渲染，但仍需加载DOM作为回退
                    console.log('[知乎收藏夹静态化] 使用缓存数据（含ID），后台加载DOM作为回退');
                    const itemsContainer = container.querySelector('.Favlists-items');

                    // 先渲染缓存的UI（快速响应）
                    this.renderStaticList(container, this.cachedData);

                    // ✅ 后台加载DOM以获取按钮引用（用于回退），并保存Promise
                    if (itemsContainer) {
                        this.domLoadPromise = (async () => {
                            await this._forceLoadAllOriginalItems(itemsContainer);
                            this.updateButtonReferences(itemsContainer, this.cachedData);
                            console.log('[知乎收藏夹静态化] 后台DOM加载完成，回退功能可用');

                            // ✅ 更新已渲染的UI（同步最新的收藏状态）
                            this.updateRenderedCards();
                        })();
                    }

                    this.isProcessing = false;
                } else {
                    // 部分收藏夹没有ID，需要加载DOM并更新
                    console.log('[知乎收藏夹静态化] 缓存数据不完整，重新加载');
                    const itemsContainer = container.querySelector('.Favlists-items');

                    if (itemsContainer) {
                        await this._forceLoadAllOriginalItems(itemsContainer);
                        this.updateButtonReferences(itemsContainer, this.cachedData);
                    }

                    this.renderStaticList(container, this.cachedData);
                    this.isProcessing = false;
                }
            } else {
                // 否则加载所有收藏夹
                console.log('[知乎收藏夹静态化] 首次加载，正在获取所有收藏夹...');
                await this.loadAllFavlists(container);
                this.isProcessing = false;
            }
        }

        updateButtonReferences(itemsContainer, cachedData) {
            // 从原始 DOM 中提取按钮引用和最新收藏状态
            const originalItems = itemsContainer.querySelectorAll('.Favlists-item');
            const dataMap = new Map();

            originalItems.forEach(item => {
                const nameEl = item.querySelector('.Favlists-itemNameText');
                const button = item.querySelector('.Favlists-updateButton');
                if (nameEl && button) {
                    const name = nameEl.textContent.trim();

                    // 实时检测收藏状态（解决知乎提前收藏到"我的收藏"的问题）
                    const isCollected = button.classList.contains('Button--grey') ||
                                       button.classList.contains('Button--primary') ||
                                       button.textContent.includes('已收藏');

                    dataMap.set(name, { button, isCollected });
                }
            });

            // 更新缓存数据中的 originalButton 引用和最新收藏状态
            cachedData.forEach(favlist => {
                const data = dataMap.get(favlist.name);
                if (data) {
                    favlist.originalButton = data.button;
                    favlist.isCollected = data.isCollected;  // ✅ 更新为最新状态
                }
            });

            console.log('[知乎收藏夹静态化] 已更新按钮引用和收藏状态:', dataMap.size, '个');
        }

        // ✅ 新增：更新已渲染的卡片状态
        updateRenderedCards() {
            const grid = document.querySelector('.static-favlists-grid');
            if (!grid) return;

            const cards = grid.querySelectorAll('.static-favlist-card');
            let updatedCount = 0;

            cards.forEach((card, index) => {
                if (index < this.cachedData.length) {
                    const favlist = this.cachedData[index];
                    const button = card.querySelector('.static-favlist-btn');

                    if (button && favlist) {
                        // 更新按钮状态
                        const currentText = button.textContent;
                        const shouldBeCollected = favlist.isCollected;
                        const newText = shouldBeCollected ? '已收藏' : '收藏';

                        if (currentText !== newText) {
                            button.className = `static-favlist-btn ${shouldBeCollected ? 'collected' : 'collect'}`;
                            button.textContent = newText;
                            card.classList.toggle('collected', shouldBeCollected);
                            updatedCount++;
                        }
                    }
                }
            });

            if (updatedCount > 0) {
                console.log('[知乎收藏夹静态化] 已更新', updatedCount, '个卡片的收藏状态');
                this.saveCacheToStorage();
            }
        }

        async _forceLoadAllOriginalItems(itemsContainer) {
            console.log('[知乎收藏夹静态化] 开始强制加载所有原始收藏夹...');
            let lastCount = 0;
            let stableCount = 0;
            const maxAttempts = 50; // 最多尝试50次

            for (let i = 0; i < maxAttempts; i++) {
                itemsContainer.scrollTop = itemsContainer.scrollHeight;
                await this.sleep(300);

                const currentCount = itemsContainer.querySelectorAll('.Favlists-item').length;
                console.log(`[知乎收藏夹静态化] 强制加载进度: ${currentCount} 个`);

                if (currentCount === lastCount) {
                    stableCount++;
                    if (stableCount >= 3) {
                        console.log(`[知乎收藏夹静态化] 强制加载完成，共 ${currentCount} 个`);
                        break;
                    }
                } else {
                    stableCount = 0;
                    lastCount = currentCount;
                }
            }
        }

        async loadAllFavlists(container, isRefresh = false) {
            const itemsContainer = container.querySelector('.Favlists-items');
            if (!itemsContainer) return;

            if (isRefresh) {
                const existingContent = container.querySelector('.static-favlist-search-wrapper')?.parentElement;
                if (existingContent) {
                    existingContent.innerHTML = '<div class="static-favlist-loading">正在刷新收藏夹列表...</div>';
                }

                // ✅ 刷新时需要重新显示原始容器，否则滚动加载无法触发
                console.log('[知乎收藏夹静态化] 刷新：重新显示原始容器以便触发懒加载');
                itemsContainer.style.display = '';
                const actionsContainer = container.querySelector('.Favlists-actions');
                if (actionsContainer) {
                    actionsContainer.style.display = '';
                }
            }

            await this.sleep(500);
            await this._forceLoadAllOriginalItems(itemsContainer);

            const favlistData = this.extractFavlistData(itemsContainer);
            console.log('[知乎收藏夹静态化] 提取数据:', favlistData);

            this.cachedData = favlistData;
            this.saveCacheToStorage();

            this.renderStaticList(container, favlistData);
        }

        extractFavlistData(itemsContainer) {
            const items = itemsContainer.querySelectorAll('.Favlists-item');
            const data = [];

            items.forEach(item => {
                const nameEl = item.querySelector('.Favlists-itemNameText');
                const countEl = item.querySelector('.Favlists-itemContent');
                const lockIcon = item.querySelector('.Zi--Lock');
                const button = item.querySelector('.Favlists-updateButton');

                if (!nameEl) return;

                // ✅ 从 React Fiber 中提取收藏夹ID
                let favlistId = null;
                try {
                    const fiberKey = Object.keys(item).find(key => key.startsWith('__reactFiber'));
                    if (fiberKey) {
                        const fiber = item[fiberKey];
                        if (fiber && fiber.return && fiber.return.memoizedProps) {
                            favlistId = fiber.return.memoizedProps.id;
                        }
                    }
                } catch (e) {
                    console.warn('[知乎收藏夹静态化] 提取ID失败:', e);
                }

                const favlistInfo = {
                    id: favlistId, // ✅ 新增：收藏夹ID
                    name: nameEl.textContent.trim(),
                    count: countEl ? countEl.textContent.trim() : '0 条内容',
                    isPrivate: !!lockIcon,
                    isCollected: button?.classList.contains('Button--grey') || button?.textContent.includes('已收藏'),
                    // 保存原始的 DOM 元素引用（仅作备用）
                    originalButton: button
                };

                data.push(favlistInfo);
            });

            console.log('[知乎收藏夹静态化] 提取到收藏夹ID:', data.filter(d => d.id).length, '/', data.length);
            return data;
        }

        renderStaticList(container, favlistData) {
            console.log('[知乎收藏夹静态化] 开始渲染静态列表，收藏夹数量:', favlistData?.length);

            // ✅ 不要清空！隐藏原始 DOM（保留以便 originalButton.click() 能正常工作）
            const itemsContainer = container.querySelector('.Favlists-items');
            const actionsContainer = container.querySelector('.Favlists-actions');

            if (itemsContainer) {
                itemsContainer.style.display = 'none';
            }
            if (actionsContainer) {
                actionsContainer.style.display = 'none';
            }

            // 移除之前渲染的静态列表（如果有）
            const existingStatic = container.querySelector('.static-favlist-wrapper');
            if (existingStatic) {
                console.log('[知乎收藏夹静态化] 移除旧的静态列表');
                existingStatic.remove();
            }

            // 创建新的容器
            const wrapper = document.createElement('div');
            wrapper.className = 'static-favlist-wrapper';
            console.log('[知乎收藏夹静态化] 创建新的wrapper');

            // 搜索框和刷新按钮
            const searchWrapper = document.createElement('div');
            searchWrapper.className = 'static-favlist-search-wrapper';
            searchWrapper.innerHTML = `
                <input
                    type="text"
                    class="static-favlist-search"
                    placeholder="搜索收藏夹..."
                >
                <button class="static-favlist-refresh">🔄 刷新列表</button>
            `;
            console.log('[知乎收藏夹静态化] 创建搜索框wrapper');

            // 网格容器
            const grid = document.createElement('div');
            grid.className = 'static-favlists-grid';
            console.log('[知乎收藏夹静态化] 创建grid容器');

            wrapper.appendChild(searchWrapper);
            wrapper.appendChild(grid);
            container.appendChild(wrapper);
            console.log('[知乎收藏夹静态化] 已将wrapper添加到container');

            // 渲染收藏夹卡片
            const renderCards = (filteredData) => {
                console.log('[知乎收藏夹静态化] renderCards被调用，数据数量:', filteredData?.length);
                grid.innerHTML = '';

                if (filteredData.length === 0) {
                    grid.innerHTML = '<div class="static-favlist-empty">没有找到匹配的收藏夹</div>';
                    console.log('[知乎收藏夹静态化] 没有数据，显示空状态');
                    return;
                }

                try {
                    filteredData.forEach(favlist => {
                        const card = this.createFavlistCard(favlist);
                        grid.appendChild(card);
                    });
                    console.log('[知乎收藏夹静态化] 成功渲染', filteredData.length, '个收藏夹卡片');
                } catch (error) {
                    console.error('[知乎收藏夹静态化] renderCards出错:', error);
                }
            };

            console.log('[知乎收藏夹静态化] 定义renderCards函数完成');
            renderCards(favlistData);
            console.log('[知乎收藏夹静态化] 初始渲染完成');

            // 搜索功能
            const searchInput = searchWrapper.querySelector('.static-favlist-search');
            if (searchInput) {
                console.log('[知乎收藏夹静态化] 搜索框已绑定事件监听器');
                searchInput.addEventListener('input', (e) => {
                    const keyword = e.target.value.trim().toLowerCase();
                    console.log('[知乎收藏夹静态化] 搜索关键词:', keyword);
                    const filtered = keyword
                        ? favlistData.filter(f => f.name.toLowerCase().includes(keyword))
                        : favlistData;
                    console.log('[知乎收藏夹静态化] 过滤结果:', filtered.length, '个收藏夹');
                    renderCards(filtered);
                });
            } else {
                console.error('[知乎收藏夹静态化] 错误：无法找到搜索框元素！');
            }

            // 刷新按钮
            const refreshBtn = searchWrapper.querySelector('.static-favlist-refresh');
            if (refreshBtn) {
                console.log('[知乎收藏夹静态化] 刷新按钮已绑定事件监听器');
                refreshBtn.addEventListener('click', async () => {
                    if (refreshBtn.classList.contains('loading')) return;

                    refreshBtn.classList.add('loading');
                    refreshBtn.textContent = '🔄 刷新中...';

                    // 清除缓存
                    this.cachedData = null;
                    localStorage.removeItem(CACHE_KEY);

                    // 重新加载
                    await this.loadAllFavlists(container, true);

                    // ✅ 注意：刷新后会创建新的按钮，这里的 refreshBtn 已经不在 DOM 中了
                    // 所以不需要手动恢复状态（新按钮会自动是正常状态）
                    console.log('[知乎收藏夹静态化] 刷新完成');
                });
            } else {
                console.error('[知乎收藏夹静态化] 错误：无法找到刷新按钮元素！');
            }
        }

        createFavlistCard(favlist) {
            const card = document.createElement('div');
            card.className = `static-favlist-card ${favlist.isCollected ? 'collected' : ''}`;

            const lockIcon = favlist.isPrivate ? `
                <svg width="16" height="16" viewBox="0 0 24 24" class="Zi Zi--Lock" fill="currentColor">
                    <path fill-rule="evenodd" d="M3.5 11.6A1.6 1.6 0 0 1 5.1 10h2.166c0-.177-.003-.377-.007-.594-.02-1.105-.048-2.662.35-3.996.246-.823.67-1.63 1.405-2.227.743-.603 1.73-.933 2.986-.933 1.256 0 2.243.33 2.986.933.735.598 1.159 1.404 1.405 2.227.398 1.334.37 2.891.35 3.996-.004.217-.008.417-.008.594H18.9a1.6 1.6 0 0 1 1.6 1.6v7.8a1.6 1.6 0 0 1-1.6 1.6H5.1a1.6 1.6 0 0 1-1.6-1.6v-7.8ZM9 14.75a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5H9ZM8.759 9.3c.004.242.007.476.007.7h6.467c0-.182.003-.37.006-.565l.002-.135c.017-1.112.037-2.375-.287-3.46-.19-.636-.482-1.142-.914-1.492-.424-.345-1.055-.598-2.04-.598-.985 0-1.616.253-2.04.598-.432.35-.724.856-.914 1.492-.324 1.085-.304 2.348-.287 3.46Z" clip-rule="evenodd"></path>
                </svg>
            ` : '';

            card.innerHTML = `
                <div>
                    <div class="static-favlist-name">
                        <span>${favlist.name}</span>
                        ${lockIcon}
                    </div>
                    <div class="static-favlist-count">${favlist.count}</div>
                </div>
                <button class="static-favlist-btn ${favlist.isCollected ? 'collected' : 'collect'}">
                    ${favlist.isCollected ? '已收藏' : '收藏'}
                </button>
            `;

            // ✅ 点击卡片或按钮时，优先使用API，如果失败则回退到模拟点击
            const button = card.querySelector('.static-favlist-btn');
            const clickHandler = async (e) => {
                e.stopPropagation();

                // 如果有收藏夹ID，尝试直接调用API
                if (favlist.id) {
                    console.log('[知乎收藏夹静态化] 点击:', favlist.name, 'ID:', favlist.id, '当前状态:', favlist.isCollected);

                    const contentInfo = this.getCurrentContentInfo();
                    if (!contentInfo) {
                        console.warn('[知乎收藏夹静态化] 无法获取内容信息');
                        return;
                    }

                    // 显示加载状态
                    const originalText = button.textContent;
                    button.textContent = '处理中...';
                    button.disabled = true;

                    // ✅ 对于取消收藏，由于API不稳定，直接使用模拟点击
                    if (favlist.isCollected) {
                        console.log('[知乎收藏夹静态化] 取消收藏操作，等待DOM加载后使用模拟点击');

                        // 等待DOM加载完成
                        if (this.domLoadPromise) {
                            await this.domLoadPromise;
                        }

                        if (favlist.originalButton) {
                            favlist.originalButton.click();

                            setTimeout(() => {
                                const newIsCollected = favlist.originalButton.classList.contains('Button--grey') ||
                                                      favlist.originalButton.classList.contains('Button--primary') ||
                                                      favlist.originalButton.textContent.includes('已收藏');

                                favlist.isCollected = newIsCollected;
                                button.className = `static-favlist-btn ${newIsCollected ? 'collected' : 'collect'}`;
                                button.textContent = newIsCollected ? '已收藏' : '收藏';
                                card.classList.toggle('collected', newIsCollected);
                                button.disabled = false;

                                this.saveCacheToStorage();
                            }, 500);
                        } else {
                            console.error('[知乎收藏夹静态化] originalButton不存在');
                            button.textContent = originalText;
                            button.disabled = false;
                        }
                        return;
                    }

                    // 对于收藏操作，使用API
                    const success = await this.collectToFavlist(favlist.id, contentInfo.contentId, contentInfo.contentType, favlist.isCollected);

                    if (success) {
                        // 更新状态
                        const newIsCollected = !favlist.isCollected;
                        favlist.isCollected = newIsCollected;
                        button.className = `static-favlist-btn ${newIsCollected ? 'collected' : 'collect'}`;
                        button.textContent = newIsCollected ? '已收藏' : '收藏';
                        card.classList.toggle('collected', newIsCollected);
                        button.disabled = false;

                        // 更新缓存
                        this.saveCacheToStorage();
                        console.log('[知乎收藏夹静态化] API调用成功，新状态:', newIsCollected);
                    } else {
                        // ✅ API失败，回退到模拟点击原始按钮
                        console.warn('[知乎收藏夹静态化] API调用失败，尝试回退到模拟点击');
                        button.textContent = originalText;
                        button.disabled = false;

                        if (favlist.originalButton) {
                            favlist.originalButton.click();

                            setTimeout(() => {
                                const newIsCollected = favlist.originalButton.classList.contains('Button--grey') ||
                                                      favlist.originalButton.classList.contains('Button--primary') ||
                                                      favlist.originalButton.textContent.includes('已收藏');

                                favlist.isCollected = newIsCollected;
                                button.className = `static-favlist-btn ${newIsCollected ? 'collected' : 'collect'}`;
                                button.textContent = newIsCollected ? '已收藏' : '收藏';
                                card.classList.toggle('collected', newIsCollected);

                                this.saveCacheToStorage();
                            }, 500);
                        }
                    }
                } else if (favlist.originalButton) {
                    // 回退方案：模拟点击原始按钮
                    console.log('[知乎收藏夹静态化] 无ID，回退到模拟点击:', favlist.name);
                    favlist.originalButton.click();

                    setTimeout(() => {
                        const newIsCollected = favlist.originalButton.classList.contains('Button--grey') ||
                                              favlist.originalButton.classList.contains('Button--primary') ||
                                              favlist.originalButton.textContent.includes('已收藏');

                        favlist.isCollected = newIsCollected;
                        button.className = `static-favlist-btn ${newIsCollected ? 'collected' : 'collect'}`;
                        button.textContent = newIsCollected ? '已收藏' : '收藏';
                        card.classList.toggle('collected', newIsCollected);

                        this.saveCacheToStorage();
                    }, 500);
                }
            };

            button.addEventListener('click', clickHandler);
            card.addEventListener('click', clickHandler);

            return card;
        }

        loadCacheFromStorage() {
            try {
                const version = localStorage.getItem(CACHE_VERSION_KEY);
                if (version !== CURRENT_VERSION) {
                    // 版本不匹配，清除旧缓存
                    localStorage.removeItem(CACHE_KEY);
                    localStorage.setItem(CACHE_VERSION_KEY, CURRENT_VERSION);
                    return;
                }

                const cached = localStorage.getItem(CACHE_KEY);
                if (cached) {
                    this.cachedData = JSON.parse(cached);
                    console.log('[知乎收藏夹静态化] 从缓存加载数据:', this.cachedData.length, '个收藏夹');
                }
            } catch (e) {
                console.error('[知乎收藏夹静态化] 加载缓存失败:', e);
            }
        }

        saveCacheToStorage() {
            try {
                // 移除 originalButton 引用（无法序列化），保留ID
                const dataToCache = this.cachedData.map(item => ({
                    id: item.id, // ✅ 保存收藏夹ID
                    name: item.name,
                    count: item.count,
                    isPrivate: item.isPrivate,
                    isCollected: item.isCollected
                }));
                localStorage.setItem(CACHE_KEY, JSON.stringify(dataToCache));
                localStorage.setItem(CACHE_VERSION_KEY, CURRENT_VERSION);
                console.log('[知乎收藏夹静态化] 缓存已保存（含', dataToCache.filter(d => d.id).length, '个ID）');
            } catch (e) {
                console.error('[知乎收藏夹静态化] 保存缓存失败:', e);
            }
        }

        // ✅ 新增：获取当前页面的内容ID和类型
        getCurrentContentInfo() {
            const url = window.location.href;
            let contentId = null;
            let contentType = null;

            // 匹配回答: /question/xxx/answer/yyy
            const answerMatch = url.match(/\/answer\/(\d+)/);
            if (answerMatch) {
                contentId = answerMatch[1];
                contentType = 'answer';
                return { contentId, contentType };
            }

            // 匹配文章: /p/xxx
            const articleMatch = url.match(/\/p\/(\d+)/);
            if (articleMatch) {
                contentId = articleMatch[1];
                contentType = 'article';
                return { contentId, contentType };
            }

            return null;
        }

        // ✅ 新增：获取XSRF Token
        getXsrfToken() {
            const cookies = document.cookie.split(';');
            for (const cookie of cookies) {
                const [name, value] = cookie.trim().split('=');
                if (name === '_xsrf') {
                    return value;
                }
            }
            return null;
        }

        // ✅ 新增：直接调用知乎API进行收藏/取消收藏
        async collectToFavlist(favlistId, contentId, contentType, isCollected) {
            const xsrfToken = this.getXsrfToken();
            if (!xsrfToken) {
                console.error('[知乎收藏夹静态化] 无法获取XSRF Token');
                return false;
            }

            try {
                const url = `https://www.zhihu.com/api/v4/collections/${favlistId}/contents?content_id=${contentId}&content_type=${contentType}`;
                const method = isCollected ? 'DELETE' : 'POST'; // 已收藏则取消，未收藏则添加

                const response = await fetch(url, {
                    method: method,
                    credentials: 'include',
                    headers: {
                        'x-requested-with': 'fetch',
                        'x-xsrftoken': xsrfToken,
                        'x-zse-93': '101_3_3.0',
                    }
                });

                if (response.ok) {
                    console.log(`[知乎收藏夹静态化] ${isCollected ? '取消收藏' : '收藏'}成功`);
                    return true;
                } else {
                    console.error(`[知乎收藏夹静态化] ${isCollected ? '取消收藏' : '收藏'}失败:`, response.status, response.statusText);
                    return false;
                }
            } catch (error) {
                console.error(`[知乎收藏夹静态化] ${isCollected ? '取消收藏' : '收藏'}请求失败:`, error);
                return false;
            }
        }

        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }

    // 启动
    console.log('[知乎收藏夹静态化] 脚本已加载');
    new StaticFavlistManager();
})();
