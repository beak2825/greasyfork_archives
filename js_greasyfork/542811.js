// ==UserScript==
// @name         Teachable 課程章節收藏
// @namespace    https://gist.github.com/Aya-X
// @version      1.0.0
// @description  在 Teachable 課程側邊欄為每個章節新增收藏按鈕，並提供篩選功能
// @author       Aya
// @match        *://*.teachable.com/courses/*
// @match        *://*.hexschool.com/courses/*
// @grant        GM_addStyle
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgOTYgOTYwIDk2MCIgd2lkdGg9IjQ4Ij48cGF0aCBkPSJNMjAwIDg5Ni4wNDNWMjI0LjY1Mmg1NjB2Njc1LjM5MWwtMjgwLTEyMC4wNDMtMjgwIDEyMC4wNDNabTg0Ljg3LTYxLjY1MyAxOTQuNDM1LTgzLjM0OCAxOTUuMTMtODIuMzVWMzEwLjg3SDI4NC44N1Y4MzQuMzlabTAtNTE5LjUyMmg0NzkuNTY1SDI4NC44N1Y4MzQuMzlWMzE0LjM5WiIvPjwvc3ZnPg==
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542811/Teachable%20%E8%AA%B2%E7%A8%8B%E7%AB%A0%E7%AF%80%E6%94%B6%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/542811/Teachable%20%E8%AA%B2%E7%A8%8B%E7%AB%A0%E7%AF%80%E6%94%B6%E8%97%8F.meta.js
// ==/UserScript==

/* eslint-env browser, greasemonkey */

(function () {
    'use strict';

    // === 事件發送器 ===
    /**
     * @class EventEmitter
     * @description 事件發送器實作
     */
    class EventEmitter {
        constructor() {
            this.events = {};
        }

        on(event, callback) {
            if (!this.events[event]) this.events[event] = [];
            this.events[event].push(callback);
        }

        emit(event, ...args) {
            if (!this.events[event]) return;
            this.events[event].forEach(callback => callback(...args));
        }

        off(event, callback) {
            if (!this.events[event]) return;
            this.events[event] = this.events[event].filter(cb => cb !== callback);
        }
    }

    // === 設定用類別 ===
    /**
     * @class Config
     * @description 儲存腳本所需的設定
     */
    class Config {
        static LESSON_ITEM_SELECTOR = 'li.section-item';
        static LESSON_ID_ATTRIBUTE = 'data-lecture-id';
        static STORAGE_KEY = 'teachable_favorite_lessons';
        static BUTTON_CONTAINER_SELECTOR = '.lecture-left';
        static COURSE_SECTION_SELECTOR = '.course-section';
        static COURSE_SIDEBAR_SELECTOR = '.course-sidebar';
        static FILTER_CLASS_NAME = 'favorite-filter-active';

        static ICONS = {
            OUTLINED: `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="#555555"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"/></svg>`,
            FILLED: `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="#FB8C00"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>`,
            FILTER: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/></svg>`
        };

        static STYLES = `
            .teachable-course ${Config.LESSON_ITEM_SELECTOR} a.item {
                position: relative;
                display: flex;
                align-items: center;
                width: 100%;
            }
            .favorite-btn-container {
                position: absolute;
                right: 8px;
                top: 50%;
                transform: translateY(-50%);
                z-index: 10;
            }
            .favorite-btn {
                background: none;
                border: none;
                cursor: pointer;
                padding: 4px;
                border-radius: 50%;
                display: inline-flex;
                justify-content: center;
                align-items: center;
                transition: background-color 0.2s;
            }
            .favorite-btn:hover {
                background-color: rgba(0, 0, 0, 0.08);
            }
            .teachable-course ${Config.LESSON_ITEM_SELECTOR} .title-container {
                padding-right: 35px;
            }
            .favorite-filter-icon {
                display: inline-block;
                vertical-align: middle;
                line-height: 1;
                cursor: pointer;
                padding: 0 4px;
            }
            .favorite-filter-icon svg {
                display: block;
                fill: #ffffff;
                transition: fill 0.2s;
            }
            .favorite-filter-icon:hover svg {
                fill: #555555;
            }
            .favorite-filter-icon.active svg {
                fill: #FB8C00;
            }
            .${Config.FILTER_CLASS_NAME} ${Config.LESSON_ITEM_SELECTOR}:not(.is-favorite),
            .${Config.FILTER_CLASS_NAME} ${Config.COURSE_SECTION_SELECTOR}:not(.has-favorite) {
                display: none;
            }
        `;
    }

    // === 工具 ===
    /**
     * @class Utils
     * @description 提供通用的工具函式
     */
    class Utils {
        /**
         * 建立一個 Debounce 函式，該函式會延遲執行 func 函式，直到使用者停止觸發事件後的一段時間
         * @param {Function} func - 要進行 Debounce 的函式
         * @param {number} wait - 延遲的毫秒數
         * @returns {Function} 回傳新的 Debounce 化的函式
         */
        static debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
    }

    // === 資料管理類別 ===
    /**
     * @class FavoriteStorage
     * @description 處理收藏章節資料的載入、儲存和管理，使用 localStorage
     */
    class FavoriteStorage extends EventEmitter {
        /**
         * @param {string} [storageKey=Config.STORAGE_KEY] - 用於 localStorage 的鍵名
         */
        constructor(storageKey = Config.STORAGE_KEY) {
            super();
            this.storageKey = storageKey;
            this.favorites = new Set();
            this.load();
        }

        /**
         * 從 localStorage 載入收藏的章節 ID
         * @private
         */
        load() {
            try {
                const stored = localStorage.getItem(this.storageKey);
                if (stored) {
                    const parsedData = JSON.parse(stored);
                    this.favorites = new Set(Array.isArray(parsedData) ? parsedData : []);
                }
            } catch (error) {
                console.warn('載入收藏資料失敗:', error);
                this.favorites = new Set();
            }
        }

        /**
         * 將目前的收藏章節 ID 儲存到 localStorage
         * @private
         */
        save() {
            try {
                localStorage.setItem(this.storageKey, JSON.stringify(Array.from(this.favorites)));
            } catch (error) {
                console.error('儲存收藏資料失敗:', error);
            }
        }

        /**
         * 新增一個收藏章節
         * @param {string} lessonId - 章節 ID
         */
        add(lessonId) {
            this.favorites.add(lessonId);
            this.save();
            this.emit('change', { lessonId, action: 'add' });
        }

        /**
         * 移除一個收藏章節。
         * @param {string} lessonId - 章節 ID
         */
        remove(lessonId) {
            this.favorites.delete(lessonId);
            this.save();
            this.emit('change', { lessonId, action: 'remove' });
        }

        /**
         * 檢查某個章節是否已被收藏
         * @param {string} lessonId - 章節 ID
         * @returns {boolean} 如果已收藏則回傳 true，否則 false
         */
        has(lessonId) {
            return this.favorites.has(lessonId);
        }

        /**
         * 切換一個章節的收藏狀態
         * @param {string} lessonId - 章節 ID
         * @returns {boolean} 如果切換後為收藏狀態，回傳 true，否則 false
         */
        toggle(lessonId) {
            if (this.has(lessonId)) {
                this.remove(lessonId);
                return false;
            } else {
                this.add(lessonId);
                return true;
            }
        }

        /**
         * 取得所有收藏章節的 ID 列表
         * @returns {string[]} 收藏章節 ID 的陣列
         */
        getAll() {
            return Array.from(this.favorites);
        }

        /**
         * 取得收藏章節的總數
         * @returns {number} 收藏章節的數量
         */
        getCount() {
            return this.favorites.size;
        }

        /**
         * 清除所有收藏
         */
        clear() {
            this.favorites.clear();
            this.save();
            this.emit('clear');
        }
    }

    // === UI 類別 ===
    /**
     * @class FavoriteButton
     * @description 代表一個章節旁的收藏按鈕 UI 元件
     */
    class FavoriteButton extends EventEmitter {
        /**
         * @param {string} lessonId - 此按鈕對應的章節 ID
         * @param {FavoriteStorage} storage - 用於儲存狀態的 storage
         */
        constructor(lessonId, storage) {
            super();
            this.lessonId = lessonId;
            this.storage = storage;
            this.element = this.createElement();
            this.button = this.element.querySelector('.favorite-btn');
            this.updateState();
        }

        /**
         * 建立按鈕的 DOM 結構
         * @returns {HTMLDivElement} 包含按鈕的容器元素
         * @private
         */
        createElement() {
            const container = document.createElement('div');
            container.className = 'favorite-btn-container';
            const button = document.createElement('button');
            button.className = 'favorite-btn';
            button.addEventListener('click', this.handleClick.bind(this));
            container.appendChild(button);
            return container;
        }

        /**
         * 處理按鈕點擊事件
         * @param {MouseEvent} event - 點擊事件物件
         * @private
         */
        handleClick(event) {
            event.preventDefault();
            event.stopPropagation();
            const newState = this.storage.toggle(this.lessonId);
            this.updateState();
            this.emit('stateChanged', {
                lessonId: this.lessonId,
                isFavorited: newState
            });
        }

        /**
         * 根據收藏狀態更新按鈕的圖示、標題和 aria 屬性
         */
        updateState() {
            const isFavorited = this.storage.has(this.lessonId);
            this.button.innerHTML = isFavorited ? Config.ICONS.FILLED : Config.ICONS.OUTLINED;
            this.button.setAttribute('title', isFavorited ? '取消收藏' : '收藏此章節');
            this.button.setAttribute('aria-pressed', isFavorited.toString());
        }

        /**
         * 將按鈕附加到指定的元素
         * @param {HTMLElement} parentElement - 要附加到的元素
         */
        appendTo(parentElement) {
            parentElement.appendChild(this.element);
        }

        /**
         * 從 DOM 中移除此按鈕
         */
        remove() {
            if (this.element && this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }
        }

        /**
         * 檢查此按鈕對應的章節是否已收藏
         * @returns {boolean} 是否已收藏
         */
        isFavorited() {
            return this.storage.has(this.lessonId);
        }

        /**
         * 檢查按鈕元素是否仍在 DOM 中
         * @returns {boolean} 是否已連接到 DOM
         */
        isConnected() {
            return this.element && this.element.isConnected;
        }
    }

    // === 主要管理類別 ===
    /**
     * @class TeachableFavoriteManager
     * @description 腳本的主要控制器，管理收藏按鈕、篩選器和 DOM 監聽
     */
    class TeachableFavoriteManager extends EventEmitter {
        constructor() {
            super();
            this.storage = new FavoriteStorage();
            this.observer = null;
            this.lessonButtons = new Map();
            this.isFilterActive = false;
            this.filterButton = null;

            // 快取相關
            this._lessonItemsCache = null;
            this._cacheTimeout = null;
            this._observerTarget = null;

            this.debouncedProcess = Utils.debounce(() => {
                this.processExistingLessons();
                this.createFilterButton();
                if (this.isFilterActive) {
                    this.applyFavoriteFilter();
                }
            }, 300);

            // 監聽 storage 事件
            this.storage.on('change', () => {
                if (this.isFilterActive) {
                    this.applyFavoriteFilter();
                }
            });

            this.init();
        }

        /**
         * 初始化腳本，注入樣式、設定監聽器並處理現有章節
         * @private
         */
        init() {
            document.body.classList.add('teachable-course');
            this.injectStyles();
            this.createFilterButton();
            this.setupObserver();
            this.processExistingLessons();
        }

        /**
         * 注入腳本所需的 CSS 樣式
         * @private
         */
        injectStyles() {
            GM_addStyle(Config.STYLES);
        }

        /**
         * 取得章節項目，支援快取
         * @param {boolean} forceRefresh - 是否強制重新查詢
         * @returns {NodeList}
         */
        getLessonItems(forceRefresh = false) {
            if (!forceRefresh && this._lessonItemsCache) {
                return this._lessonItemsCache;
            }

            this._lessonItemsCache = document.querySelectorAll(Config.LESSON_ITEM_SELECTOR);

            // 5秒後清除快取
            clearTimeout(this._cacheTimeout);
            this._cacheTimeout = setTimeout(() => {
                this._lessonItemsCache = null;
            }, 5000);

            return this._lessonItemsCache;
        }

        /**
         * 設定 MutationObserver 來監聽課程列表的 DOM 變動，以動態新增或移除按鈕
         * @private
         */
        setupObserver() {
            // 優先找到更具體的容器
            this._observerTarget = document.querySelector(Config.COURSE_SIDEBAR_SELECTOR) ||
                document.querySelector('.course-content') ||
                document.body;

            const config = {
                childList: true,
                subtree: true,
                attributeFilter: ['data-lecture-id'] // 只監聽特定屬性的變化
            };

            this.observer = new MutationObserver((mutations) => {
                // 過濾相關的變動
                const relevantMutation = mutations.some(mutation => {
                    // 檢查是否有相關的節點變動
                    if (mutation.type === 'childList') {
                        // 檢查新增或移除的節點是否包含課程項目
                        return [...mutation.addedNodes, ...mutation.removedNodes].some(node => {
                            if (node.nodeType !== Node.ELEMENT_NODE) return false;
                            return node.matches && (
                                node.matches(Config.LESSON_ITEM_SELECTOR) ||
                                (node.querySelector && node.querySelector(Config.LESSON_ITEM_SELECTOR))
                            );
                        });
                    }
                    return false;
                });

                if (!relevantMutation) return;

                // 清除快取，因為 DOM 已改變
                this._lessonItemsCache = null;

                if (!document.querySelector(Config.BUTTON_CONTAINER_SELECTOR)) return;
                this.debouncedProcess();
            });

            this.observer.observe(this._observerTarget, config);
        }

        /**
         * 處理頁面上所有已存在的章節，為它們新增收藏按鈕
         */
        processExistingLessons() {
            const lessonItems = this.getLessonItems();
            this.cleanupDisconnectedButtons();

            lessonItems.forEach(item => {
                const lessonId = item.getAttribute(Config.LESSON_ID_ATTRIBUTE);
                if (!lessonId) return;

                // 如果按鈕已存在且仍在 DOM 中，則跳過
                if (this.lessonButtons.has(lessonId) && this.lessonButtons.get(lessonId).button.isConnected()) {
                    return;
                }

                const linkElement = item.querySelector('a.item');
                if (linkElement && linkElement.isConnected) {
                    this.addFavoriteButton(item, linkElement, lessonId);
                }
            });

            // 更新收藏狀態的 CSS 類別
            this.updateFavoriteClasses();
        }

        /**
         * 更新所有項目的收藏狀態 CSS 類別
         * @private
         */
        updateFavoriteClasses() {
            this.lessonButtons.forEach(({ item }, lessonId) => {
                item.classList.toggle('is-favorite', this.storage.has(lessonId));
            });

            // 更新區塊的收藏狀態
            const sections = document.querySelectorAll(Config.COURSE_SECTION_SELECTOR);
            sections.forEach(section => {
                const hasFavorite = section.querySelector('.is-favorite');
                section.classList.toggle('has-favorite', !!hasFavorite);
            });
        }

        /**
         * 為單一章節新增收藏按鈕。
         * @param {HTMLLIElement} item - 章節的 li 元素
         * @param {HTMLAnchorElement} linkElement - 章節的 a 連結元素
         * @param {string} lessonId - 章節 ID
         * @private
         */
        addFavoriteButton(item, linkElement, lessonId) {
            const favoriteButton = new FavoriteButton(lessonId, this.storage);

            // 監聽按鈕狀態改變事件
            favoriteButton.on('stateChanged', ({ lessonId, isFavorited }) => {
                item.classList.toggle('is-favorite', isFavorited);

                // 更新所屬區塊的狀態
                const section = item.closest(Config.COURSE_SECTION_SELECTOR);
                if (section) {
                    const hasFavorite = section.querySelector('.is-favorite');
                    section.classList.toggle('has-favorite', !!hasFavorite);
                }

                // 發送事件
                this.emit('favoriteChanged', { lessonId, isFavorited });
            });

            favoriteButton.appendTo(linkElement);
            const titleContainer = item.querySelector('.title-container');
            if (titleContainer) {
                titleContainer.style.paddingRight = '35px';
            }
            this.lessonButtons.set(lessonId, { item, button: favoriteButton });
        }

        /**
         * 清理已從 DOM 中移除的章節所對應的按鈕
         * @private
         */
        cleanupDisconnectedButtons() {
            for (const [lessonId, { item, button }] of this.lessonButtons.entries()) {
                if (!item.isConnected || !button.isConnected()) {
                    button.remove();
                    this.lessonButtons.delete(lessonId);
                }
            }
        }

        /**
         * 在課程側邊欄頂部建立「篩選收藏」按鈕
         */
        createFilterButton() {
            const container = document.querySelector(Config.BUTTON_CONTAINER_SELECTOR);
            if (container && !document.getElementById('favorite-filter-btn')) {
                const a = document.createElement('a');
                a.id = 'favorite-filter-btn';
                a.className = 'nav-icon-settings favorite-filter-icon';
                a.href = '#';
                a.setAttribute('role', 'button');
                a.title = '顯示已收藏章節';
                a.setAttribute('aria-label', '顯示已收藏章節');
                a.innerHTML = Config.ICONS.FILTER;

                a.addEventListener('click', (event) => {
                    event.preventDefault();
                    this.toggleFavoriteFilter();
                });

                const settingsDropdown = container.querySelector('.settings-dropdown');
                if (settingsDropdown) {
                    container.insertBefore(a, settingsDropdown);
                } else {
                    container.appendChild(a);
                }
                this.filterButton = a;
            }
        }

        /**
         * 切換收藏篩選器的啟用狀態
         */
        toggleFavoriteFilter() {
            this.isFilterActive = !this.isFilterActive;
            if (this.isFilterActive) {
                this.applyFavoriteFilter();
                this.filterButton.title = '顯示所有章節';
                this.filterButton.setAttribute('aria-label', '顯示所有章節');
                this.filterButton.classList.add('active');
            } else {
                this.clearFavoriteFilter();
                this.filterButton.title = '顯示已收藏章節';
                this.filterButton.setAttribute('aria-label', '顯示已收藏章節');
                this.filterButton.classList.remove('active');
            }
            this.emit('filterToggled', { isActive: this.isFilterActive });
        }

        /**
         * 套用收藏篩選，使用 CSS 類別控制顯示
         */
        applyFavoriteFilter() {
            // 先確保所有收藏狀態的類別都是最新的
            this.updateFavoriteClasses();
            // 只需要新增一個類別到 body，CSS 會處理其餘的顯示邏輯
            document.body.classList.add(Config.FILTER_CLASS_NAME);
        }

        /**
         * 清除收藏篩選
         */
        clearFavoriteFilter() {
            document.body.classList.remove(Config.FILTER_CLASS_NAME);
        }

        /**
         * 更新指定章節 ID 的按鈕狀態
         * @param {string} lessonId - 要更新按鈕的章節 ID
         */
        updateButtonState(lessonId) {
            const buttonInfo = this.lessonButtons.get(lessonId);
            if (buttonInfo && buttonInfo.button.isConnected()) {
                buttonInfo.button.updateState();
            }
        }

        /**
         * 更新所有收藏按鈕的狀態
         */
        updateAllButtons() {
            this.lessonButtons.forEach(({ button }) => {
                if (button.isConnected()) button.updateState();
            });
            this.updateFavoriteClasses();
        }

        /**
         * 移除所有監聽器、按鈕和樣式
         */
        destroy() {
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
            this.lessonButtons.forEach(({ button }) => button.remove());
            this.lessonButtons.clear();
            if (this.filterButton) {
                this.filterButton.remove();
                this.filterButton = null;
            }
            clearTimeout(this._cacheTimeout);
            this._lessonItemsCache = null;
        }

        /**
         * 重新執行一次初始化
         */
        refresh() {
            this.destroy();
            this.init();
        }

        // --- Public API methods ---
        getFavorites() {
            return this.storage.getAll();
        }
        addFavorite(lessonId) {
            this.storage.add(lessonId);
            this.updateButtonState(lessonId);
            this.updateFavoriteClasses();
        }
        removeFavorite(lessonId) {
            this.storage.remove(lessonId);
            this.updateButtonState(lessonId);
            this.updateFavoriteClasses();
        }
        isFavorite(lessonId) {
            return this.storage.has(lessonId);
        }
        getFavoriteCount() {
            return this.storage.getCount();
        }
        clearAllFavorites() {
            this.storage.clear();
            this.updateAllButtons();
        }
    }

    // === 腳本啟動 ===
    let favoriteManager = null;

    /**
     * 初始化應用程式，建立 TeachableFavoriteManager
     */
    function initializeApp() {
        try {
            if (!window.TeachableFavorites || !window.TeachableFavorites.getManager()) {
                favoriteManager = new TeachableFavoriteManager();
                console.log('Teachable 收藏功能已啟動 (優化版)');
            }
        } catch (error) {
            console.error('Teachable 收藏功能啟動失敗:', error);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }

    /**
     * @namespace TeachableFavorites
     * @description 將收藏功能 API 掛到 window 物件，以便從瀏覽器主控台進行操作
     */
    window.TeachableFavorites = {
        getFavorites: () => favoriteManager?.getFavorites() || [],
        addFavorite: (lessonId) => favoriteManager?.addFavorite(lessonId),
        removeFavorite: (lessonId) => favoriteManager?.removeFavorite(lessonId),
        isFavorite: (lessonId) => favoriteManager?.isFavorite(lessonId) || false,
        getCount: () => favoriteManager?.getFavoriteCount() || 0,
        clearAll: () => favoriteManager?.clearAllFavorites(),
        refresh: () => favoriteManager?.refresh(),
        getManager: () => favoriteManager,
        on: (event, callback) => favoriteManager?.on(event, callback),
        off: (event, callback) => favoriteManager?.off(event, callback)
    };
})();