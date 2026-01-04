// ==UserScript==
// @name         MubuPlus v4.2 Manual 
// @namespace    http://tampermonkey.net/
// @version      4.2 
// @author       Yeeel
// @match        *://mubu.com/*
// @match        *://*.mubu.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// @icon         https://mubu.com/favicon.ico
// @license      MIT
// @description v4
// @downloadURL https://update.greasyfork.org/scripts/533701/MubuPlus%20v42%20Manual.user.js
// @updateURL https://update.greasyfork.org/scripts/533701/MubuPlus%20v42%20Manual.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- [ ☆ 功能开关 (默认值) ☆ ] ---
    const FEATURES = {
        syncSearchBox: { enabled: true, label: '同步搜索框' },
        historyPanel: { enabled: true, label: '搜索历史面板' },
        pushContent: { enabled: true, label: '推开左侧文本' },
        hideTopBar: { enabled: true, label: '隐藏顶部栏' },
        selectSearchPopup: { enabled: true, label: '选中快速筛选' },
        copyTagOnHover: { enabled: false, label: '悬停复制标签' },
        transferPasteCopy: { enabled: false, label: '中转粘贴-复制' },
        transferPasteCut: { enabled: false, label: '中转粘贴-剪切' },
    };

    // --- [ ☆ 运行时功能状态 ☆ ] ---
    const runtimeFeatureState = {};
    for (const key in FEATURES) {
        runtimeFeatureState[key] = FEATURES[key].enabled;
    }
    const isFeatureEnabled = (key) => !!runtimeFeatureState[key];

    // --- [ ☆ 配置项 ☆ ] ---
    const config = {
        cacheTTL: 3000,                 // 元素缓存时间 (ms)
        initDelay: 2500,                // 脚本初始化延迟 (ms)
        interfaceCheckDelay: 3500,      // 幕布接口首次检查延迟 (ms)
        interfaceCheckInterval: 5000,   // 幕布接口检查重试间隔 (ms)
        interfaceCheckMaxAttempts: 5,   // 幕布接口检查最大尝试次数
        selectors: {
            originalInput: 'input[placeholder="搜索关键词"]:not([disabled])',
            domObserverTarget: 'div.search-wrap',       // 监听DOM变化的区域
            tagElement: 'span.tag',                     // 标签元素
            tagClickArea: 'div.outliner-page',          // 标签可点击的区域
            copyTagParentContainer: 'div.outliner-page',// 悬停复制标签的父容器
        },
        sync: {
            historySize: 30,                    // 历史记录条数
            mutationDebounce: 5,                // DOM变化检测防抖 (ms)
            throttleTime: 10,                   // 历史导航节流 (ms)
            activeItemBgColor: '#e9e8f9',       // 历史记录当前项背景色
            persistHighlightBgColor: '#ffe8cc', // 历史记录固定高亮背景色
            topBarId: 'custom-search-sync-container-v35',
            historyPanelId: 'search-history-panel-v35',
            historyListId: 'search-history-list-v35',
            simulatedClickRecoveryDelay: 1,     // 模拟标签点击后恢复状态延迟 (ms)
            instantSearchDelay: 1,              // 自定义输入框触发搜索延迟 (ms)
            historyItemDeleteBtnClass: 'search-history-delete-btn', // 历史记录删除按钮类名
        },
        select: {
            popupId: 'mubu-select-search-popup-v35',
            popupText: '🔍',                    // 选中筛选按钮文字
            popupAboveGap: 5,                   // 按钮距离选区上方的距离 (px)
            fallbackWidth: 35,                  // 按钮后备宽度 (px)
            fallbackHeight: 22,                 // 按钮后备高度 (px)
            popupAppearDelay: 50,               // 按钮出现延迟 (ms)
        },
        copyTag: {
            popupId: 'mubu-copy-tag-popup-hover-v35',
            feedbackId: 'mubu-copy-tag-feedback-v35',
            copyIcon: '📋',                     // 复制按钮图标
            copiedText: '✅ 已复制',             // 复制成功提示文字
            popupMarginBottom: 0,               // 复制按钮距离标签下方距离 (px)
            hoverDelay: 10,                     // 悬停显示复制按钮延迟 (ms)
            hideDelay: 50,                      // 鼠标移开后隐藏按钮延迟 (ms)
            copiedMessageDuration: 500,         // 复制成功提示显示时长 (ms)
            tagSelector: 'span.tag',            // 标签选择器
            popupFallbackWidth: 25,             // 复制按钮后备宽度
            popupFallbackHeight: 18,            // 复制按钮后备高度
            feedbackFallbackWidth: 60,          // 提示信息后备宽度
            feedbackFallbackHeight: 18,         // 提示信息后备高度
        },
        transferPaste: {
            editorContainerSelector: '#js-outliner', // 监听键盘事件的编辑器容器
            triggerButtonId: 'mu-transfer-copy-button-v35',
            cutButtonId: 'mu-transfer-cut-button-v35',
            pasteButtonId: 'mu-transfer-paste-button-v35',
            triggerButtonText: '📄',            // 复制按钮文字
            cutButtonText: '✂️',                 // 剪切按钮文字
            pasteButtonText: '📝',              // 粘贴按钮文字
            buttonHorizontalGap: 2,             // 按钮间水平间距 (px)
            cssPrefix: 'mu-transfer-paste-v35-',// CSS类名前缀
            btnBaseClass: 'btn-base',
            btnCopyClass: 'btn-copy',
            btnCutClass: 'btn-cut',
            btnPasteClass: 'btn-paste',
            buttonBaseStyleInline: {
                position: 'absolute', zIndex: '29998', top: '0', left: '0',
                opacity: '0', display: 'none', visibility: 'hidden',
            },
            initWaitMaxRetries: 15,             // 编辑器容器查找重试次数
            initWaitRetryInterval: 700,         // 编辑器容器查找重试间隔 (ms)
            buttonFallbackWidth: 35,            // 按钮后备宽度
            buttonFallbackHeight: 22,           // 按钮后备高度
            buttonsAppearDelay: 50,             // 粘贴按钮出现延迟 (ms)
        },
        togglePanel: {
            panelId: 'mubu-helper-toggle-panel-v35',
            triggerId: 'mubu-helper-toggle-trigger-v35',
            panelWidth: 160,                    // 开关面板宽度 (px)
            triggerWidth: 20,                   // 触发区域宽度 (px)
            triggerHeight: 230,                 // 触发区域高度 (px)
            hideDelay: 100,                     // 鼠标移开后隐藏面板延迟 (ms)
        },
        pushContent: {
            pushMarginLeft: 75,                 // 推开内容距离 (px)
            contentSelector: '#js-outliner',    // 主内容区域选择器
            pushClass: 'mu-content-pushed-v37', // 推开时添加的类名
            transitionDuration: '0.1s'          // 推开动画时长
        },
        hideTopBar: {
            selector: 'div.title.mm-editor', // 要隐藏的元素选择器， div.title.mm-editor（更小压缩）.outliner-header-container（更大压缩）
            hideClass: 'mu-top-bar-hidden-v37'      // 添加到 body 的类名
        }
    };
    const BUTTON_GAP = config.transferPaste.buttonHorizontalGap;

    // --- [ ☆ rAF 样式批量处理 ☆ ] ---
    let styleUpdateQueue = [];
    let isRafScheduled = false;

    function processStyleUpdates() {
        const tasksToProcess = [...styleUpdateQueue];
        styleUpdateQueue = [];
        tasksToProcess.forEach(task => {
            if (task.element && task.element.isConnected) {
                try {
                    Object.assign(task.element.style, task.styles);
                } catch (e) { /* silenced */ }
            }
        });
        isRafScheduled = false;
    }

    function scheduleStyleUpdate(element, styles) {
        if (!element) return;
        styleUpdateQueue.push({ element, styles });
        if (!isRafScheduled) {
            isRafScheduled = true;
            requestAnimationFrame(processStyleUpdates);
        }
    }

    // --- [ ☆ ResizeObserver 尺寸缓存 ☆ ] ---
    const elementDimensionsCache = new WeakMap();
    const elementObserverMap = new Map();

    const resizeObserverCallback = (entries) => {
        for (let entry of entries) {
            let width = 0, height = 0;
            if (entry.borderBoxSize?.length > 0) {
                width = entry.borderBoxSize[0].inlineSize;
                height = entry.borderBoxSize[0].blockSize;
            } else if (entry.contentRect) {
                width = entry.contentRect.width;
                height = entry.contentRect.height;
            }
            if (width <= 0 || height <= 0) {
                if (entry.target.offsetWidth > 0 && entry.target.offsetHeight > 0) {
                    width = entry.target.offsetWidth;
                    height = entry.target.offsetHeight;
                }
            }
            if (width > 0 && height > 0) {
                elementDimensionsCache.set(entry.target, { width, height });
            }
        }
    };
    const observerInstance = new ResizeObserver(resizeObserverCallback);

    function observeElementResize(element) {
        if (!element || elementObserverMap.has(element)) return;
        try {
            observerInstance.observe(element);
            elementObserverMap.set(element, observerInstance);
        } catch (e) { /* silenced */ }
    }

    function unobserveElementResize(element) {
        if (!element || !elementObserverMap.has(element)) return;
        try {
            observerInstance.unobserve(element);
            elementObserverMap.delete(element);
        } catch (e) { /* silenced */ }
    }

    // --- [ ☆ 内部状态与工具函数 ☆ ] ---

    // State Variables
    let originalInput = null, lastSyncedValue = null, isSyncing = false, domObserver = null, customInput = null;
    let originalInputHistoryHandler = null;
    let topBarControls = { container: null, input: null, prevBtn: null, nextBtn: null, clearBtn: null };
    let historyPanel = null, historyListElement = null, activeHistoryItemElement = null;
    let isSimulatingClick = false;
    let persistHighlightedTerm = null, persistHighlightedIndex = null;
    let isInterfaceAvailable = false; let interfaceCheckAttempts = 0; let interfaceCheckTimer = null;
    let customInputSearchTimeoutId = null;
    let isProgrammaticValueChange = false;

    // Other Feature State
    let popupElement = null, currentSelectedText = '';
    let ct_copyPopupElement = null, ct_feedbackElement = null, ct_currentHoveredTag = null, ct_currentTagText = '';
    let ct_showTimeout = null, ct_hideTimeout = null, ct_feedbackTimeout = null, ct_listenerTarget = null;
    let tp_editorContainer = null, tp_storedHTML = '', tp_storedText = '', tp_ctrlApressed = false, tp_listenersAttached = false;
    let togglePanelElement = null, toggleTriggerElement = null, togglePanelHideTimeout = null;
    const tp_triggerButtonRef = { element: null };
    const tp_cutButtonRef = { element: null };
    const tp_pasteButtonRef = { element: null };

    // Shared Utilities
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
    const inputEvent = new Event('input', { bubbles: true, cancelable: true });
    const debounce = (fn, delay) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn.apply(this, a), delay); }; };
    const throttle = (fn, delay) => { let l = 0, t; return (...a) => { const n = performance.now(); clearTimeout(t); if (n - l >= delay) { requestAnimationFrame(() => fn.apply(this, a)); l = n; } else { t = setTimeout(() => { requestAnimationFrame(() => fn.apply(this, a)); l = performance.now(); }, delay - (n - l)); } }; };
    const optimizedFindSearchBox = (() => { let c = null, l = 0; return () => { const n = performance.now(); if (c && c.isConnected && (n - l < config.cacheTTL)) { return c; } c = null; try { c = document.querySelector(config.selectors.originalInput); } catch (e) { c = null; } l = n; return c } })();
    const docBody = document.body;
    const isHistoryTrackingNeeded = () => isFeatureEnabled('syncSearchBox') || isFeatureEnabled('historyPanel');

    // --- [ ☆ 历史记录管理器 ☆ ] ---
    const historyManager = (() => {
        const history = new Array(config.sync.historySize);
        let writeIndex = 0;
        let count = 0;
        let navIndex = -1;
        const selectedIndices = new Set();

        const add = (value, source = 'unknown') => {
            if (!isHistoryTrackingNeeded()) return false;
            const term = String(value).trim();
            if (!term) return false;

            const lastAddedIdx = (writeIndex - 1 + config.sync.historySize) % config.sync.historySize;
            if (count > 0 && history[lastAddedIdx] === term) {
                navIndex = -1;
                return false;
            }

            if (count === config.sync.historySize) {
                const oldestLogicalIndex = 0;
                if (persistHighlightedIndex !== null) {
                    if (persistHighlightedIndex === oldestLogicalIndex) {
                        persistHighlightedTerm = null;
                        persistHighlightedIndex = null;
                    } else {
                        persistHighlightedIndex--;
                    }
                }
                if (selectedIndices.has(oldestLogicalIndex)) {
                    selectedIndices.delete(oldestLogicalIndex);
                }
                const newSelectedIndices = new Set();
                selectedIndices.forEach(idx => {
                    if (idx > oldestLogicalIndex) {
                        newSelectedIndices.add(idx - 1);
                    }
                });
                selectedIndices.clear();
                newSelectedIndices.forEach(idx => selectedIndices.add(idx));
            }

            history[writeIndex] = term;
            writeIndex = (writeIndex + 1) % config.sync.historySize;
            count = Math.min(count + 1, config.sync.historySize);
            navIndex = -1;
            return true;
        };

        const get = (logicalIndex) => {
            if (!isHistoryTrackingNeeded() || logicalIndex < 0 || logicalIndex >= count) return null;
            const physicalIndex = (writeIndex - count + logicalIndex + config.sync.historySize) % config.sync.historySize;
            return history[physicalIndex];
        };

        const size = () => isHistoryTrackingNeeded() ? count : 0;
        const getCurrentIndex = () => navIndex;
        const setCurrentIndex = (index) => { if (isHistoryTrackingNeeded()) navIndex = index; };
        const resetIndexToCurrent = () => { if (isHistoryTrackingNeeded()) navIndex = -1; };

        const deleteAt = (logicalIndex) => {
            if (!isHistoryTrackingNeeded() || logicalIndex < 0 || logicalIndex >= count) return false;
            const termToDelete = get(logicalIndex);

            const newHistoryArray = [];
            for (let i = 0; i < count; i++) {
                if (i !== logicalIndex) {
                    newHistoryArray.push(get(i));
                }
            }

            for (let i = 0; i < config.sync.historySize; i++) history[i] = undefined;
            writeIndex = 0;
            count = 0;
            for (const term of newHistoryArray) {
                history[writeIndex] = term;
                writeIndex = (writeIndex + 1) % config.sync.historySize;
                count++;
            }

            if (persistHighlightedIndex !== null) {
                if (logicalIndex === persistHighlightedIndex) {
                    persistHighlightedTerm = null;
                    persistHighlightedIndex = null;
                } else if (logicalIndex < persistHighlightedIndex) {
                    persistHighlightedIndex--;
                }
            }

            if (selectedIndices.has(logicalIndex)) {
                selectedIndices.delete(logicalIndex);
            }
            const newSelectedIndices = new Set();
            selectedIndices.forEach(idx => {
                if (idx > logicalIndex) {
                    newSelectedIndices.add(idx - 1);
                } else if (idx < logicalIndex) {
                    newSelectedIndices.add(idx);
                }
            });
            selectedIndices.clear();
            newSelectedIndices.forEach(idx => selectedIndices.add(idx));

            navIndex = -1;
            return true;
        };

        const toggleSelection = (logicalIndex) => {
            if (!isHistoryTrackingNeeded() || logicalIndex < 0 || logicalIndex >= count) return false;
            if (selectedIndices.has(logicalIndex)) {
                selectedIndices.delete(logicalIndex);
            } else {
                selectedIndices.add(logicalIndex);
            }
            return true;
        };

        const clearSelection = () => {
            if (selectedIndices.size > 0) {
                selectedIndices.clear();
                return true;
            }
            return false;
        };

        const getSelectedIndices = () => {
            return selectedIndices;
        };

        const deleteNonSelected = () => {
            if (!isHistoryTrackingNeeded() || count === 0) return false;
            if (selectedIndices.size === count) return false;

            const termsToKeep = [];
            const keptIndicesMap = new Map();

            for (let i = 0; i < count; i++) {
                const logicalIndex = i;
                if (selectedIndices.has(logicalIndex)) {
                    const term = get(logicalIndex);
                    if (term !== null && term !== undefined) {
                        keptIndicesMap.set(logicalIndex, termsToKeep.length);
                        termsToKeep.push(term);
                    }
                }
            }

            for (let i = 0; i < config.sync.historySize; i++) history[i] = undefined;
            writeIndex = 0;
            count = 0;
            for (const term of termsToKeep) {
                history[writeIndex] = term;
                writeIndex = (writeIndex + 1) % config.sync.historySize;
                count++;
            }

            if (persistHighlightedIndex !== null && keptIndicesMap.has(persistHighlightedIndex)) {
                persistHighlightedIndex = keptIndicesMap.get(persistHighlightedIndex);
            } else {
                persistHighlightedTerm = null;
                persistHighlightedIndex = null;
            }

            navIndex = -1;
            selectedIndices.clear();
            return true;
        };

        const clearAll = () => {
            if (!isHistoryTrackingNeeded()) return false;
            for (let i = 0; i < config.sync.historySize; i++) history[i] = undefined;
            writeIndex = 0; count = 0; navIndex = -1;
            persistHighlightedTerm = null; persistHighlightedIndex = null;
            selectedIndices.clear();
            return true;
        };

        const updatePanel = () => {
            if (!isFeatureEnabled('historyPanel') || !historyPanel || !historyListElement) return;

            const scrollTop = historyListElement.scrollTop;
            historyListElement.innerHTML = '';
            const numItems = historyManager.size();
            const currentNavIndex = historyManager.getCurrentIndex();
            const deleteBtnClass = config.sync.historyItemDeleteBtnClass;
            let newlyActiveElement = null;
            let matchFoundForLastSyncedValue = false;
            const fragment = document.createDocumentFragment();

            for (let i = 0; i < numItems; i++) {
                const logicalIndex = numItems - 1 - i;
                const term = historyManager.get(logicalIndex);
                if (term === null || term === undefined) continue;

                const li = document.createElement('li');
                li.className = 'search-history-item';
                li.title = term;
                li.dataset.term = term;
                li.dataset.historyIndex = String(logicalIndex);

                const textSpan = document.createElement('span');
                textSpan.className = 'search-history-item-text';
                textSpan.textContent = term;
                li.appendChild(textSpan);

                const deleteBtn = document.createElement('span');
                deleteBtn.className = deleteBtnClass;
                deleteBtn.textContent = '✕';
                deleteBtn.title = '删除此条记录';
                deleteBtn.dataset.deleteIndex = String(logicalIndex);
                li.appendChild(deleteBtn);

                if (selectedIndices.has(logicalIndex)) {
                    li.classList.add('search-history-item--multi-selected');
                }
                if (logicalIndex === currentNavIndex) {
                    li.classList.add('search-history-item--active');
                    newlyActiveElement = li;
                    matchFoundForLastSyncedValue = true;
                } else if (currentNavIndex === -1 && !matchFoundForLastSyncedValue && term && lastSyncedValue && term === lastSyncedValue && !selectedIndices.has(logicalIndex)) {
                    li.classList.add('search-history-item--active');
                    matchFoundForLastSyncedValue = true;
                }
                if (persistHighlightedIndex !== null && logicalIndex === persistHighlightedIndex && term === persistHighlightedTerm) {
                    li.classList.add('search-history-item--persist-highlight');
                }

                fragment.appendChild(li);
            }

            historyListElement.appendChild(fragment);
            try { historyListElement.scrollTop = scrollTop; } catch (e) { /* ignore */ }
            activeHistoryItemElement = newlyActiveElement;

            const clearSelectiveButton = document.getElementById('history-clear-all-btn');
            if (clearSelectiveButton) {
                clearSelectiveButton.disabled = (numItems === 0);
                const currentSelectedCount = selectedIndices.size;
                if (currentSelectedCount > 0 && currentSelectedCount < count) {
                    clearSelectiveButton.textContent = `删除未选 (${count - currentSelectedCount})`;
                    clearSelectiveButton.title = `删除未选中的 (${count - currentSelectedCount}) 条记录，保留选中的 ${currentSelectedCount} 条`;
                } else {
                    clearSelectiveButton.textContent = "删除未选记录";
                    clearSelectiveButton.title = "清空所有历史记录 (未选中任何条目)";
                }
            }
        };

        return {
            add, get, size, getCurrentIndex, setCurrentIndex, resetIndexToCurrent, updatePanel,
            deleteAt, clearAll, toggleSelection, clearSelection, getSelectedIndices, deleteNonSelected
        };
    })();

    // --- [ ☆ Tag Click Simulation Logic ☆ ] ---
    const findAndClickTag = (tagName) => {
        if (!tagName || !tagName.startsWith('#')) return false;
        const searchArea = document.querySelector(config.selectors.tagClickArea);
        if (!searchArea) return false;

        const tags = searchArea.querySelectorAll(config.selectors.tagElement);
        if (!tags || tags.length === 0) return false;

        let foundElement = null;
        const trimmedTagName = tagName.trim();
        for (const tagElement of tags) {
            if (tagElement.textContent.trim() === trimmedTagName) {
                let isVisible = false;
                try {
                    const rect = tagElement.getBoundingClientRect();
                    isVisible = rect && rect.width > 0 && rect.height > 0 && tagElement.offsetParent !== null;
                } catch (visError) { isVisible = false; }

                if (isVisible) {
                    foundElement = tagElement;
                    break;
                }
            }
        }

        if (foundElement) {
            isSimulatingClick = true;
            try {
                foundElement.click();
                return true;
            } catch (e) {
                return false;
            } finally {
                setTimeout(() => { isSimulatingClick = false; }, config.sync.simulatedClickRecoveryDelay);
            }
        } else {
            return false;
        }
    };

    // --- [ ☆ Instant Search Interface Logic ☆ ] ---
    function triggerInstantSearch(searchTerm) {
        if (!isInterfaceAvailable) {
            if (customInput) customInput.placeholder = '控制台输入: window.mysearch = t';
            return false;
        }
        if (typeof unsafeWindow === 'undefined' || typeof unsafeWindow.mysearch?.getService !== 'function') {
            if (customInput) customInput.placeholder = '接口结构错误,请刷新重试';
            return false;
        }

        try {
            const searchService = unsafeWindow.mysearch.getService("Search");
            if (!searchService) return false;

            const termToSearch = String(searchTerm).trim();
            if (termToSearch === '') {
                if (typeof searchService.clear === 'function') {
                    searchService.clear(); return true;
                }
            } else {
                if (typeof searchService.search === 'function') {
                    searchService.search(termToSearch); return true;
                }
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    function checkMubuInterface() {
        clearTimeout(interfaceCheckTimer);
        let found = false;
        if (typeof unsafeWindow !== 'undefined' && typeof unsafeWindow.mysearch?.getService === 'function') {
            try {
                const searchService = unsafeWindow.mysearch.getService("Search");
                if (searchService && (typeof searchService.search === 'function' || typeof searchService.clear === 'function')) {
                    found = true;
                }
            } catch (e) { /* Ignore errors during check */ }
        }

        isInterfaceAvailable = found;

        if (customInput) {
            customInput.disabled = !isInterfaceAvailable;
            customInput.placeholder = isInterfaceAvailable ? '筛选 (接口可用)' : '控制台输入: window.mysearch = t';
        }

        if (!isInterfaceAvailable) {
            interfaceCheckAttempts++;
            if (interfaceCheckAttempts < config.interfaceCheckMaxAttempts) {
                interfaceCheckTimer = setTimeout(checkMubuInterface, config.interfaceCheckInterval);
            }
        }
    }

    // --- [ ☆ 同步与历史记录核心逻辑 ☆ ] ---

    const updateCustomInputAndAddHistory = (newValue, source = 'unknown') => {
        if (isFeatureEnabled('syncSearchBox') && customInput && customInput.value !== newValue) {
            customInput.value = newValue;
        }

        const oldValue = lastSyncedValue;
        const valueChanged = newValue !== oldValue;
        lastSyncedValue = newValue;

        let historyChanged = false;
        if (isHistoryTrackingNeeded()) {
            historyChanged = historyManager.add(newValue, source);
            if (historyChanged || valueChanged) {
                historyManager.resetIndexToCurrent();
            }
        }

        if (isFeatureEnabled('historyPanel') && (historyChanged || valueChanged)) {
            historyManager.updatePanel();
        }
    };

    const findAndSetupDebounced = debounce(() => {
        if (!isHistoryTrackingNeeded()) return;

        const foundInput = optimizedFindSearchBox();

        if (foundInput) {
            const currentValue = foundInput.value;

            if (foundInput !== originalInput) {
                teardownInputListeners(originalInput);
                originalInput = foundInput;
                lastSyncedValue = currentValue;

                if (isFeatureEnabled('syncSearchBox') && customInput && customInput.value !== currentValue) {
                    customInput.value = currentValue;
                }
                setupInputListeners(originalInput);
                historyManager.resetIndexToCurrent();

                if (currentValue && isHistoryTrackingNeeded()) {
                    updateCustomInputAndAddHistory(currentValue, 'observer_new_input');
                } else if (isFeatureEnabled('historyPanel')) {
                    historyManager.updatePanel();
                }
            } else if (currentValue !== lastSyncedValue && !isSyncing && !isSimulatingClick && !isProgrammaticValueChange) {
                updateCustomInputAndAddHistory(currentValue, 'observer_external_change');
            }

        } else if (originalInput) {
            teardownInputListeners(originalInput);
            originalInput = null;
            lastSyncedValue = null;
            if (isFeatureEnabled('syncSearchBox')) isSyncing = false;
            if (isFeatureEnabled('historyPanel')) historyManager.updatePanel();
        }
    }, config.sync.mutationDebounce);


    function setOriginalInputValue(value) {
        if (!originalInput || !nativeInputValueSetter) return;
        const valueToSet = String(value);
        if (originalInput.value === valueToSet) return;

        isProgrammaticValueChange = true;
        try {
            nativeInputValueSetter.call(originalInput, valueToSet);
            originalInput.dispatchEvent(inputEvent);
        } finally {
            queueMicrotask(() => { isProgrammaticValueChange = false; });
        }
    }

    // --- [ ☆ 事件处理函数 ☆ ] ---

    function handleOriginalInputForHistory(event) {
        if (!event.isTrusted || !isHistoryTrackingNeeded() || isSyncing || isSimulatingClick || isProgrammaticValueChange) {
            return;
        }
        const val = event.target.value;
        if (val === lastSyncedValue) return;
        updateCustomInputAndAddHistory(val, 'native_input');
    }

    function handleCustomInputChange() {
        if (!isFeatureEnabled('syncSearchBox') || !customInput) return;

        const currentSearchTerm = customInput.value;
        if (customInputSearchTimeoutId) clearTimeout(customInputSearchTimeoutId);

        customInputSearchTimeoutId = setTimeout(() => {
            if (customInput.value === currentSearchTerm) {
                const termToProcess = currentSearchTerm.trim();
                triggerInstantSearch(termToProcess);
                updateCustomInputAndAddHistory(termToProcess, 'custom_input');
                setOriginalInputValue(termToProcess);
            }
            customInputSearchTimeoutId = null;
        }, config.sync.instantSearchDelay);
    }

    function handleHistoryListClick(event) {
        if (!isFeatureEnabled('historyPanel')) return;
        const item = event.target.closest('.search-history-item');
        if (!item) return;

        const deleteButton = event.target.closest(`.${config.sync.historyItemDeleteBtnClass}`);
        if (deleteButton) {
            event.stopPropagation();
            event.preventDefault();
            const indexStr = deleteButton.dataset.deleteIndex;
            if (indexStr !== undefined) {
                const indexToDelete = parseInt(indexStr, 10);
                if (!isNaN(indexToDelete)) {
                    const deletedTerm = item?.dataset?.term;
                    if (historyManager.deleteAt(indexToDelete)) {
                        if (lastSyncedValue && deletedTerm === lastSyncedValue) {
                            handleClear();
                        }
                        historyManager.updatePanel();
                    }
                }
            }
            return;
        }

        const isMultiSelectClick = event.ctrlKey || event.metaKey;
        if (isMultiSelectClick) {
            event.stopPropagation();
            event.preventDefault();
            let idxStr, idx;
            try {
                idxStr = item.dataset.historyIndex;
                if (idxStr === undefined) return;
                idx = parseInt(idxStr, 10);
                if (isNaN(idx)) return;
            } catch (e) { return; }

            if (historyManager.toggleSelection(idx)) {
                historyManager.updatePanel();
            }
            return;
        }

        let term, idxStr, idx;
        try {
            term = item.dataset.term;
            idxStr = item.dataset.historyIndex;
            if (term === undefined || idxStr === undefined) return;
            idx = parseInt(idxStr, 10);
            if (isNaN(idx)) return;
        } catch (e) { return; }

        historyManager.clearSelection();

        try {
            if (activeHistoryItemElement && activeHistoryItemElement !== item && activeHistoryItemElement.isConnected) {
                activeHistoryItemElement.classList.remove('search-history-item--active');
            }
            if (!item.classList.contains('search-history-item--active')) {
                item.classList.add('search-history-item--active');
            }
            activeHistoryItemElement = item;

            if (isHistoryTrackingNeeded()) {
                historyManager.setCurrentIndex(idx);
                lastSyncedValue = term;
                historyManager.updatePanel();
            }
            if (isFeatureEnabled('syncSearchBox') && customInput && customInput.value !== term) {
                customInput.value = term;
            }
        } catch (e) { /* silenced */ }

        const searchSuccess = triggerInstantSearch(term);
        setOriginalInputValue(term);

        if (searchSuccess && originalInput) {
            try { setTimeout(() => { if (document.activeElement !== originalInput) originalInput.focus(); }, 50); }
            catch (fe) { /* silenced */ }
        }
    }

    function togglePersistentHighlight(itemElement, term, logicalIndex) {
        if (!itemElement || term === undefined || isNaN(logicalIndex)) return false;

        const previouslyHighlightedElement = historyListElement?.querySelector('.search-history-item--persist-highlight');

        if (persistHighlightedIndex === logicalIndex && persistHighlightedTerm === term) {
            itemElement.classList.remove('search-history-item--persist-highlight');
            persistHighlightedTerm = null;
            persistHighlightedIndex = null;
        } else {
            if (previouslyHighlightedElement && previouslyHighlightedElement !== itemElement && previouslyHighlightedElement.isConnected) {
                try { previouslyHighlightedElement.classList.remove('search-history-item--persist-highlight'); } catch (e) { }
            }
            itemElement.classList.add('search-history-item--persist-highlight');
            persistHighlightedTerm = term;
            persistHighlightedIndex = logicalIndex;
        }
        return true;
    }

    function handleHistoryListDblClick(event) {
        if (event.target.closest(`.${config.sync.historyItemDeleteBtnClass}`)) {
            event.stopPropagation();
            event.preventDefault();
            return;
        }
        if (!isFeatureEnabled('historyPanel') || !historyListElement) return;

        const item = event.target.closest('.search-history-item');
        if (!item) return;
        const term = item.dataset.term;
        const idxStr = item.dataset.historyIndex;
        if (term === undefined || idxStr === undefined) return;
        const idx = parseInt(idxStr, 10);
        if (isNaN(idx)) return;

        togglePersistentHighlight(item, term, idx);
    }

    function handleSelectiveHistoryClear(event) {
        event.stopPropagation();
        if (!isFeatureEnabled('historyPanel')) return;
        const numItems = historyManager.size();
        if (numItems === 0) return;

        const selectedCount = historyManager.getSelectedIndices().size;
        let confirmMessage = "确定要删除所有未选中的历史记录吗？\n选中的条目将被保留。";
        if (selectedCount === 0) {
            confirmMessage = "未选中任何历史记录。\n确定要清空所有历史记录吗？此操作不可撤销。";
        }

        if (!confirm(confirmMessage)) return;

        if (historyManager.deleteNonSelected()) {
            historyManager.updatePanel();
        }
    }

    function handleHistoryNavigation(direction) {
        throttle((dir) => {
            if (!isHistoryTrackingNeeded()) return;
            const size = historyManager.size();
            if (size === 0) return;

            let currentActualIndex = historyManager.getCurrentIndex();
            let referenceIndex = currentActualIndex;

            if (referenceIndex === -1 && lastSyncedValue) {
                let matchedIndex = -1;
                for (let i = 0; i < size; i++) {
                    const logicalIndex = size - 1 - i;
                    if (historyManager.get(logicalIndex) === lastSyncedValue) {
                        matchedIndex = logicalIndex; break;
                    }
                }
                if (matchedIndex !== -1) referenceIndex = matchedIndex;
            }

            let nextIdx;
            if (dir === 1) { // Prev: Newer
                if (referenceIndex === -1) nextIdx = size - 1;
                else if (referenceIndex === size - 1) nextIdx = 0;
                else nextIdx = referenceIndex + 1;
            } else { // Next: Older (dir === -1)
                if (referenceIndex === -1) nextIdx = size > 0 ? size - 1 : 0;
                else if (referenceIndex === 0) nextIdx = size - 1;
                else nextIdx = referenceIndex - 1;
            }

            if (nextIdx < 0 || nextIdx >= size) nextIdx = Math.max(0, Math.min(nextIdx, size - 1));
            if (size === 0) return;

            historyManager.setCurrentIndex(nextIdx);
            const navigatedValue = historyManager.get(nextIdx) ?? '';
            lastSyncedValue = navigatedValue;

            if (isFeatureEnabled('syncSearchBox') && customInput && customInput.value !== navigatedValue) {
                customInput.value = navigatedValue;
            }

            const searchSuccess = triggerInstantSearch(navigatedValue);
            setOriginalInputValue(navigatedValue);

            if (isFeatureEnabled('historyPanel')) {
                historyManager.updatePanel();
                setTimeout(() => {
                    const activeItem = historyListElement?.querySelector('.search-history-item--active');
                    if (activeItem) {
                        try { activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
                        catch (scrollError) { try { activeItem.scrollIntoView({ block: 'nearest' }); } catch (e) { } }
                    }
                }, 50);
            }

            if (searchSuccess && originalInput) {
                try { setTimeout(() => { if (document.activeElement !== originalInput) originalInput.focus(); }, 50); }
                catch (fe) { /* silenced */ }
            }

        }, config.sync.throttleTime)(direction);
    }

    function handleHistoryItemHighlightKey(event) {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'a') {
            if (!isFeatureEnabled('historyPanel') || !historyListElement) return;
            const hoveredItem = historyListElement.querySelector('.search-history-item:hover');
            if (hoveredItem) {
                event.preventDefault();
                event.stopPropagation();
                const term = hoveredItem.dataset.term;
                const idxStr = hoveredItem.dataset.historyIndex;
                if (term === undefined || idxStr === undefined) return;
                const idx = parseInt(idxStr, 10);
                if (isNaN(idx)) return;
                togglePersistentHighlight(hoveredItem, term, idx);
            }
        }
    }

    function handleClear() {
        if (!isFeatureEnabled('syncSearchBox') || !customInput) return;

        if (customInput.value !== '') customInput.value = '';
        lastSyncedValue = '';
        historyManager.resetIndexToCurrent();
        triggerInstantSearch('');
        setOriginalInputValue('');

        if (isFeatureEnabled('historyPanel')) {
            historyManager.updatePanel();
        }
    }

    function handlePopupClick(event) {
        if (!isFeatureEnabled('selectSearchPopup')) return;
        event.preventDefault();
        event.stopPropagation();
        const term = currentSelectedText;
        if (!term) {
            hideSelectionActionButtons();
            return;
        }

        updateCustomInputAndAddHistory(term, 'select_popup');
        const searchSuccess = triggerInstantSearch(term);
        setOriginalInputValue(term);

        if (searchSuccess && originalInput) {
            try { setTimeout(() => { if (document.activeElement !== originalInput) originalInput.focus(); }, 50); }
            catch (error) { /* silenced */ }
        }
        hideSelectionActionButtons();
    }


    // --- [ ☆ Helper Functions for UI Elements (Popup, Transfer Paste, Copy Tag) ☆ ] ---

    function setupInputListeners(targetInput) {
        if (!targetInput) return;
        teardownInputListeners(targetInput);
        if (isHistoryTrackingNeeded()) {
            originalInputHistoryHandler = handleOriginalInputForHistory;
            targetInput.addEventListener('input', originalInputHistoryHandler, { passive: true });
        }
    }

    function teardownInputListeners(targetInput) {
        if (!targetInput || !originalInputHistoryHandler) return;
        try { targetInput.removeEventListener('input', originalInputHistoryHandler); }
        catch (e) { /* silenced */ }
        originalInputHistoryHandler = null;
    }

    function hideSelectionActionButtons() {
        if (popupElement?.isConnected && popupElement.style.visibility !== 'hidden') {
            scheduleStyleUpdate(popupElement, { opacity: '0', visibility: 'hidden' });
            setTimeout(() => { if (popupElement?.style.opacity === '0') scheduleStyleUpdate(popupElement, { display: 'none' }); }, 150);
        }
        if (tp_triggerButtonRef.element?.isConnected && tp_triggerButtonRef.element.style.visibility !== 'hidden') {
            scheduleStyleUpdate(tp_triggerButtonRef.element, { opacity: '0', visibility: 'hidden' });
            setTimeout(() => { if (tp_triggerButtonRef.element?.style.opacity === '0') scheduleStyleUpdate(tp_triggerButtonRef.element, { display: 'none' }); }, 150);
        }
        if (tp_cutButtonRef.element?.isConnected && tp_cutButtonRef.element.style.visibility !== 'hidden') {
            scheduleStyleUpdate(tp_cutButtonRef.element, { opacity: '0', visibility: 'hidden' });
            setTimeout(() => { if (tp_cutButtonRef.element?.style.opacity === '0') scheduleStyleUpdate(tp_cutButtonRef.element, { display: 'none' }); }, 150);
        }
        currentSelectedText = '';
    }

    function tp_hidePasteButton() {
        if (tp_pasteButtonRef.element) {
            scheduleStyleUpdate(tp_pasteButtonRef.element, { opacity: '0', visibility: 'hidden' });
            setTimeout(() => { if (tp_pasteButtonRef.element?.style.opacity === '0') scheduleStyleUpdate(tp_pasteButtonRef.element, { display: 'none' }) }, 150);
        }
    }

    function getCursorRect(selection) {
        if (!selection || !selection.focusNode || selection.rangeCount === 0) return null;
        const range = document.createRange();
        try {
            range.setStart(selection.focusNode, selection.focusOffset);
            range.setEnd(selection.focusNode, selection.focusOffset);
            const rect = range.getBoundingClientRect();
            if (rect.width === 0 && rect.height === 0 && selection.toString().trim().length > 0) {
                const selRange = selection.getRangeAt(0);
                const clientRects = selRange.getClientRects();
                return clientRects.length > 0 ? clientRects[clientRects.length - 1] : selRange.getBoundingClientRect();
            }
            return rect;
        } catch (e) {
            try { return selection.getRangeAt(0).getBoundingClientRect(); }
            catch { return null; }
        }
    }

    function tp_captureSelectionAndStore() {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed || selection.rangeCount === 0) return false;
        try {
            const range = selection.getRangeAt(0);
            const container = document.createElement("div");
            container.appendChild(range.cloneContents());
            tp_storedHTML = container.innerHTML;
            tp_storedText = selection.toString();
            return true;
        } catch (error) {
            tp_storedHTML = ""; tp_storedText = ""; return false;
        }
    }

    function tp_isElementEditable(element) {
        if (!element) return false;
        if (element instanceof Element && element.closest) {
            return !!element.closest('[contenteditable="true"], .mm-editor');
        } else if (element instanceof HTMLElement && ["INPUT", "TEXTAREA"].includes(element.tagName)) {
            return !element.readOnly && !element.disabled;
        }
        return false;
    }

    function tp_createButton(id, text, btnClass, clickHandler) {
        const cfg = config.transferPaste;
        let button = document.getElementById(id);
        if (button) {
            button.textContent = text;
            if (button.__clickHandler__) button.removeEventListener("click", button.__clickHandler__);
            if (button.__mousedownHandler__) button.removeEventListener("mousedown", button.__mousedownHandler__);
        } else {
            button = document.createElement("button");
            button.id = id;
            button.textContent = text;
            Object.assign(button.style, cfg.buttonBaseStyleInline);
            document.body.appendChild(button);
        }
        button.className = "";
        button.classList.add(cfg.cssPrefix + cfg.btnBaseClass, cfg.cssPrefix + btnClass);

        const stopPropagationHandler = (e) => e.stopPropagation();
        const clickWrapper = (e) => {
            e.stopPropagation();
            clickHandler(button);
        };

        button.addEventListener("mousedown", stopPropagationHandler);
        button.addEventListener("click", clickWrapper);
        button.__clickHandler__ = clickWrapper;
        button.__mousedownHandler__ = stopPropagationHandler;

        observeElementResize(button);
        return button;
    }

    function tp_showPasteButton(mouseEvent) {
        const cfg = config.transferPaste;
        hideSelectionActionButtons();
        tp_hidePasteButton();
        if (!tp_storedHTML && !tp_storedText) return;

        const target = mouseEvent.target instanceof Node ? mouseEvent.target : document.elementFromPoint(mouseEvent.clientX, mouseEvent.clientY);
        if (!tp_isElementEditable(target)) return;

        const targetRect = { top: mouseEvent.clientY, left: mouseEvent.clientX, bottom: mouseEvent.clientY, right: mouseEvent.clientX, width: 0, height: 0 };

        const positionButton = (buttonEl, refRect) => {
            try {
                if (!buttonEl || !refRect || !buttonEl.isConnected) return false;
                const dims = elementDimensionsCache.get(buttonEl);
                const buttonW = dims?.width || cfg.buttonFallbackWidth;
                const buttonH = dims?.height || cfg.buttonFallbackHeight;
                const vpW = window.innerWidth;
                const scrollY = window.pageYOffset;
                const scrollX = window.pageXOffset;

                let top = scrollY + refRect.top + 10;
                let left = scrollX + refRect.left - (buttonW / 2);

                top = Math.max(scrollY + 5, top);
                left = Math.max(scrollX + 5, Math.min(left, scrollX + vpW - buttonW - 5));

                scheduleStyleUpdate(buttonEl, {
                    transform: `translate(${left.toFixed(1)}px, ${top.toFixed(1)}px)`,
                    display: "inline-block",
                    opacity: "1",
                    visibility: "visible"
                });
                return true;
            } catch (error) {
                if (buttonEl) scheduleStyleUpdate(buttonEl, { display: "none", opacity: "0", visibility: "hidden" });
                return false;
            }
        };

        tp_pasteButtonRef.element = tp_createButton(cfg.pasteButtonId, cfg.pasteButtonText, cfg.btnPasteClass, (button) => {
            const selection = window.getSelection();
            const range = selection?.rangeCount > 0 ? selection.getRangeAt(0) : null;
            let pasteTarget = null;

            if (range) {
                pasteTarget = range.startContainer.nodeType === Node.ELEMENT_NODE
                    ? range.startContainer
                    : range.startContainer.parentElement;
                if (!tp_isElementEditable(pasteTarget)) {
                    pasteTarget = document.elementFromPoint(mouseEvent.clientX, mouseEvent.clientY);
                }
            } else {
                pasteTarget = document.elementFromPoint(mouseEvent.clientX, mouseEvent.clientY);
            }

            if (!tp_isElementEditable(pasteTarget)) {
                alert("无法粘贴：位置不可编辑。");
                tp_hidePasteButton();
                return;
            }

            try {
                let success = false;
                if (tp_storedHTML && document.queryCommandSupported("insertHTML")) {
                    try {
                        if (range) { selection.removeAllRanges(); selection.addRange(range); }
                        else if (pasteTarget instanceof HTMLElement) pasteTarget.focus();

                        if (document.execCommand("insertHTML", false, tp_storedHTML)) {
                            success = true;
                        }
                    } catch (cmdError) { /* console.warn("insertHTML error:", cmdError); */ }
                }
                if (!success && tp_storedText && document.queryCommandSupported("insertText")) {
                    try {
                        if (range) { selection.removeAllRanges(); selection.addRange(range); }
                        else if (pasteTarget instanceof HTMLElement) pasteTarget.focus();

                        if (document.execCommand("insertText", false, tp_storedText)) {
                            success = true;
                        }
                    } catch (cmdError) { /* console.warn("insertText error:", cmdError); */ }
                }

                if (!success) {
                    alert("粘贴失败。请尝试手动 Ctrl+V。");
                } else {
                    tp_storedHTML = ""; tp_storedText = "";
                }
            } catch (error) {
                alert(`粘贴时出错: ${error.message}`);
            } finally {
                tp_hidePasteButton();
            }
        });

        if (!positionButton(tp_pasteButtonRef.element, targetRect)) {
            tp_hidePasteButton();
        }
    }

    function calculateTransformForPopup(element, targetRect, marginBottom = 0) {
        if (!element || !targetRect || !element.isConnected) return null;
        const cfg = config.copyTag;
        const dims = elementDimensionsCache.get(element);
        let popupW, popupH;

        if (element === ct_copyPopupElement) {
            popupW = dims?.width || cfg.popupFallbackWidth;
            popupH = dims?.height || cfg.popupFallbackHeight;
        } else if (element === ct_feedbackElement) {
            popupW = dims?.width || cfg.feedbackFallbackWidth;
            popupH = dims?.height || cfg.feedbackFallbackHeight;
        } else {
            popupW = dims?.width || 30;
            popupH = dims?.height || 20;
        }

        const scrollX = window.pageXOffset;
        const scrollY = window.pageYOffset;
        const targetCenterX = targetRect.left + targetRect.width / 2;
        const top = scrollY + targetRect.top - popupH - marginBottom;
        const left = scrollX + targetCenterX - popupW / 2;

        return `translate(${left.toFixed(1)}px, ${top.toFixed(1)}px)`;
    }

    function ct_showCopyPopup(tagElement) {
        if (!isFeatureEnabled("copyTagOnHover")) return;
        ct_createElements();
        if (!ct_copyPopupElement || !tagElement || !ct_copyPopupElement.isConnected) return;

        const tagText = tagElement.textContent?.trim();
        if (!tagText) return;
        ct_currentTagText = tagText;

        const targetRect = tagElement.getBoundingClientRect();
        const transform = calculateTransformForPopup(ct_copyPopupElement, targetRect, config.copyTag.popupMarginBottom);

        if (transform) {
            scheduleStyleUpdate(ct_copyPopupElement, {
                transform: transform,
                display: "block",
                opacity: "1",
                visibility: "visible"
            });
        } else {
            scheduleStyleUpdate(ct_copyPopupElement, {
                transform: "translate(0px, -20px)",
                display: "block",
                opacity: "1",
                visibility: "visible"
            });
        }
    }

    function ct_hideCopyPopupImmediately(resetHoverState = true) {
        clearTimeout(ct_showTimeout); ct_showTimeout = null;
        clearTimeout(ct_hideTimeout); ct_hideTimeout = null;
        if (ct_copyPopupElement?.isConnected) {
            scheduleStyleUpdate(ct_copyPopupElement, { opacity: "0", visibility: "hidden" });
            setTimeout(() => { if (ct_copyPopupElement?.style.opacity === '0') scheduleStyleUpdate(ct_copyPopupElement, { display: "none" }) }, 150);
        }
        if (resetHoverState) {
            ct_currentHoveredTag = null;
            ct_currentTagText = "";
        }
    }

    function ct_scheduleHidePopup() {
        clearTimeout(ct_showTimeout); ct_showTimeout = null;
        clearTimeout(ct_hideTimeout);
        ct_hideTimeout = setTimeout(() => {
            const isOverTag = ct_currentHoveredTag?.matches(":hover");
            const isOverPopup = ct_copyPopupElement?.matches(":hover");
            if (!isOverTag && !isOverPopup) {
                ct_hideCopyPopupImmediately(true);
            }
            ct_hideTimeout = null;
        }, config.copyTag.hideDelay);
    }

    function ct_showFeedbackIndicator(tagElement) {
        if (!isFeatureEnabled("copyTagOnHover")) return;
        ct_createElements();
        if (!ct_feedbackElement || !tagElement || !ct_feedbackElement.isConnected) return;

        const duration = config.copyTag.copiedMessageDuration;
        clearTimeout(ct_feedbackTimeout);

        const targetRect = tagElement.getBoundingClientRect();
        const transform = calculateTransformForPopup(ct_feedbackElement, targetRect, config.copyTag.popupMarginBottom);

        if (transform) {
            scheduleStyleUpdate(ct_feedbackElement, {
                transform: transform,
                display: "block",
                opacity: "1",
                visibility: "visible"
            });
        } else {
            scheduleStyleUpdate(ct_feedbackElement, {
                transform: "translate(0px, -20px)",
                display: "block",
                opacity: "1",
                visibility: "visible"
            });
        }
        ct_feedbackTimeout = setTimeout(ct_hideFeedbackIndicator, duration);
    }

    function ct_hideFeedbackIndicator() {
        if (!ct_feedbackElement?.isConnected) return;
        scheduleStyleUpdate(ct_feedbackElement, { opacity: "0", visibility: "hidden" });
        setTimeout(() => { if (ct_feedbackElement?.style.opacity === '0') scheduleStyleUpdate(ct_feedbackElement, { display: "none" }) }, 150);
        ct_feedbackTimeout = null;
    }

    // --- [ ☆ UI 创建函数 ☆ ] ---

    function ct_createElements() {
        if (!isFeatureEnabled("copyTagOnHover")) return;
        const cfg = config.copyTag;
        const baseStyle = { position: "absolute", top: "0", left: "0", zIndex: "10010", display: "none", opacity: "0", visibility: "hidden" };
        const feedbackStyle = { ...baseStyle, zIndex: "10011", pointerEvents: "none" };

        if (!ct_copyPopupElement) {
            let existing = document.getElementById(cfg.popupId);
            if (existing) {
                ct_copyPopupElement = existing;
            } else {
                const button = document.createElement("button");
                button.id = cfg.popupId;
                button.textContent = cfg.copyIcon;
                Object.assign(button.style, baseStyle);
                button.addEventListener("click", ct_handleCopyButtonClick);
                button.addEventListener("mouseenter", () => { clearTimeout(ct_hideTimeout); ct_hideTimeout = null; });
                button.addEventListener("mouseleave", ct_scheduleHidePopup);
                button.addEventListener("mousedown", e => { e.preventDefault(); e.stopPropagation(); });
                document.body.appendChild(button);
                ct_copyPopupElement = button;
            }
            if (!elementObserverMap.has(ct_copyPopupElement)) observeElementResize(ct_copyPopupElement);
        }

        if (!ct_feedbackElement) {
            let existing = document.getElementById(cfg.feedbackId);
            if (existing) {
                ct_feedbackElement = existing;
            } else {
                const feedback = document.createElement("div");
                feedback.id = cfg.feedbackId;
                feedback.textContent = cfg.copiedText;
                Object.assign(feedback.style, feedbackStyle);
                document.body.appendChild(feedback);
                ct_feedbackElement = feedback;
            }
            if (!elementObserverMap.has(ct_feedbackElement)) observeElementResize(ct_feedbackElement);
        }
    }

    function createControlPanel() {
        if (document.getElementById(config.sync.topBarId)) return topBarControls;
        try {
            const container = document.createElement("div");
            container.id = config.sync.topBarId;
            container.style.display = "none";

            const clearBtn = document.createElement("button");
            clearBtn.className = "clear-btn";
            clearBtn.textContent = "✕";
            clearBtn.title = "清空";

            const prevBtn = document.createElement("button");
            prevBtn.className = "history-btn";
            prevBtn.textContent = "←";
            prevBtn.title = "上条";

            const nextBtn = document.createElement("button");
            nextBtn.className = "history-btn";
            nextBtn.textContent = "→";
            nextBtn.title = "下条";

            const input = document.createElement("input");
            input.className = "custom-search-input";
            input.type = "search";
            input.placeholder = "筛选 (检查接口...)";
            input.setAttribute("autocomplete", "off");
            input.disabled = true;

            container.append(clearBtn, prevBtn, nextBtn, input);
            document.body.appendChild(container);

            topBarControls = { container, input, prevBtn, nextBtn, clearBtn };
            observeElementResize(container);
            return topBarControls;
        } catch (e) {
            topBarControls = { container: null, input: null, prevBtn: null, nextBtn: null, clearBtn: null };
            return topBarControls;
        }
    }

    function createHistoryPanel() {
        const panelId = config.sync.historyPanelId;
        if (document.getElementById(panelId)) return historyPanel;

        try {
            const panel = document.createElement("div");
            panel.id = panelId;
            panel.style.display = "none";

            const list = document.createElement("ul");
            list.className = "search-history-list";
            list.id = config.sync.historyListId;
            panel.appendChild(list);

            const clearSelectiveButton = document.createElement("button");
            clearSelectiveButton.id = 'history-clear-all-btn';
            clearSelectiveButton.className = 'history-clear-all-button';
            clearSelectiveButton.textContent = "删除未选记录";
            clearSelectiveButton.title = "清空所有历史记录 (未选中任何条目)";
            clearSelectiveButton.disabled = true;
            panel.appendChild(clearSelectiveButton);

            document.body.appendChild(panel);
            historyPanel = panel;
            historyListElement = list;
            observeElementResize(panel);

            clearSelectiveButton.addEventListener('click', handleSelectiveHistoryClear);

            return panel;
        } catch (e) {
            historyPanel = null;
            historyListElement = null;
            return null;
        }
    }

    function createSelectPopup() {
        if (!isFeatureEnabled("selectSearchPopup")) return;
        const popupId = config.select.popupId;
        let button = document.getElementById(popupId);

        if (button) {
            popupElement = button;
            if (!elementObserverMap.has(popupElement)) observeElementResize(popupElement);
            Object.assign(popupElement.style, { display: "none", opacity: "0", visibility: "hidden" });
            if (!button.__clickAttached__) {
                button.addEventListener("mousedown", handlePopupClick);
                button.addEventListener("click", e => e.stopPropagation());
                button.__clickAttached__ = true;
            }
            return;
        }

        try {
            const newButton = document.createElement("button");
            newButton.id = popupId;
            newButton.textContent = config.select.popupText;
            Object.assign(newButton.style, {
                position: "absolute", top: "0", left: "0", zIndex: "10010",
                display: "none", opacity: "0", visibility: "hidden"
            });
            newButton.classList.add("mu-select-popup-btn");
            newButton.addEventListener("mousedown", handlePopupClick);
            newButton.addEventListener("click", e => e.stopPropagation());
            newButton.__clickAttached__ = true;
            document.body.appendChild(newButton);
            popupElement = newButton;
            observeElementResize(popupElement);
        } catch (e) {
            popupElement = null;
        }
    }

    function createTogglePanel() {
        const panelId = config.togglePanel.panelId;
        const triggerId = config.togglePanel.triggerId;
        if (document.getElementById(panelId)) return;

        try {
            toggleTriggerElement = document.createElement('div');
            toggleTriggerElement.id = triggerId;
            toggleTriggerElement.addEventListener('mouseenter', showTogglePanel);
            toggleTriggerElement.addEventListener('mouseleave', scheduleHideTogglePanel);
            document.body.appendChild(toggleTriggerElement);

            togglePanelElement = document.createElement('div');
            togglePanelElement.id = panelId;
            togglePanelElement.innerHTML = '<div class="toggle-panel-title">功能开关</div>';
            togglePanelElement.addEventListener('mouseenter', showTogglePanel);
            togglePanelElement.addEventListener('mouseleave', scheduleHideTogglePanel);

            for (const key in FEATURES) {
                if (FEATURES.hasOwnProperty(key)) {
                    const feature = FEATURES[key];
                    const isEnabled = runtimeFeatureState[key];

                    const div = document.createElement('div');
                    div.className = 'toggle-control';

                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.id = `toggle-${key}`;
                    checkbox.checked = isEnabled;
                    checkbox.dataset.featureKey = key;
                    checkbox.addEventListener('change', (event) => {
                        const changedKey = event.target.dataset.featureKey;
                        const newState = event.target.checked;
                        runtimeFeatureState[changedKey] = newState;
                        applyFeatureStateChange(changedKey, newState);
                    });

                    const label = document.createElement('label');
                    label.htmlFor = `toggle-${key}`;
                    label.textContent = feature.label;

                    div.appendChild(checkbox);
                    div.appendChild(label);
                    togglePanelElement.appendChild(div);
                }
            }
            document.body.appendChild(togglePanelElement);
        } catch (e) {
            togglePanelElement = null;
            toggleTriggerElement = null;
        }
    }

    // --- [ ☆ Feature-Specific Event Handlers & Logic ☆ ] ---

    function handleMouseDownPopup(event) {
        const target = event.target;
        if (target instanceof Node) {
            const isClickOnActionButton = popupElement?.contains(target)
                || tp_triggerButtonRef.element?.contains(target)
                || tp_cutButtonRef.element?.contains(target);
            const isClickOnToggle = togglePanelElement?.contains(target) || toggleTriggerElement?.contains(target);
            const isClickOnPasteButton = tp_pasteButtonRef.element?.contains(target);
            const isClickOnCopyTag = ct_copyPopupElement?.contains(target);
            const isClickOnHistory = historyPanel?.contains(target);

            if (!isClickOnActionButton && !isClickOnToggle && !isClickOnPasteButton && !isClickOnCopyTag && !isClickOnHistory) {
                hideSelectionActionButtons();
            }
            if (!isClickOnPasteButton && !isClickOnToggle && !isClickOnHistory) {
                tp_hidePasteButton();
            }
            if (!isClickOnCopyTag && ct_copyPopupElement?.style.visibility !== 'hidden' && !isClickOnHistory) {
                ct_hideCopyPopupImmediately(true);
            }
        } else {
            hideSelectionActionButtons();
            tp_hidePasteButton();
            ct_hideCopyPopupImmediately(true);
        }
    }

    function handleMouseUpSelectionEnd(event) {
        const target = event.target;
        if (target instanceof Node) {
            const isClickOnActionButton = popupElement?.contains(target)
                || tp_triggerButtonRef.element?.contains(target)
                || tp_cutButtonRef.element?.contains(target);
            const isClickOnToggle = togglePanelElement?.contains(target) || toggleTriggerElement?.contains(target);
            const isClickOnPasteButton = tp_pasteButtonRef.element?.contains(target);
            const isClickOnCopyTag = ct_copyPopupElement?.contains(target);
            const isClickOnHistory = historyPanel?.contains(target);
            if (isClickOnActionButton || isClickOnToggle || isClickOnPasteButton || isClickOnCopyTag || isClickOnHistory) {
                return;
            }
        }

        setTimeout(() => {
            requestAnimationFrame(() => {
                const selection = window.getSelection();
                if (selection && !selection.isCollapsed && selection.toString().trim().length > 0) {
                    const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
                    if (range) {
                        const containerNode = range.commonAncestorContainer;
                        const isInEditable = containerNode && (
                            (containerNode.nodeType === Node.ELEMENT_NODE && tp_isElementEditable(containerNode)) ||
                            (containerNode.nodeType === Node.TEXT_NODE && containerNode.parentElement && tp_isElementEditable(containerNode.parentElement))
                        );

                        if (isInEditable) {
                            showSelectionActionButtons(selection, false);
                        } else {
                            hideSelectionActionButtons();
                        }
                    } else {
                        hideSelectionActionButtons();
                    }
                } else {
                    hideSelectionActionButtons();
                }
            });
        }, config.select.popupAppearDelay);
    }

    function showSelectionActionButtons(selection, isCtrlA = false) {
        hideSelectionActionButtons();
        tp_hidePasteButton();
        if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;

        const selectionText = selection.toString().trim();
        if (selectionText.length === 0) return;

        const containerNode = selection.getRangeAt(0).commonAncestorContainer;
        const isInEditable = containerNode && (
            (containerNode.nodeType === Node.ELEMENT_NODE && tp_isElementEditable(containerNode)) ||
            (containerNode.nodeType === Node.TEXT_NODE && containerNode.parentElement && tp_isElementEditable(containerNode.parentElement))
        );
        if (!isInEditable) return;

        const buttonOrder = isCtrlA ? ['copy', 'cut'] : ['filter', 'copy', 'cut'];
        const visibleButtonsData = [];
        let maxHeight = 0;

        buttonOrder.forEach(type => {
            let buttonInfo = null;
            const shouldAppear = (
                (type === 'filter' && !isCtrlA && isFeatureEnabled('selectSearchPopup')) ||
                (type === 'copy' && isFeatureEnabled('transferPasteCopy')) ||
                (type === 'cut' && isFeatureEnabled('transferPasteCut'))
            );

            if (shouldAppear) {
                try {
                    if (type === 'filter') {
                        if (!popupElement) createSelectPopup();
                        if (!popupElement) return;
                        buttonInfo = { type: 'filter', element: popupElement, fallbackW: config.select.fallbackWidth, fallbackH: config.select.fallbackHeight };
                        currentSelectedText = selectionText;
                    } else if (type === 'copy') {
                        tp_triggerButtonRef.element = tp_createButton(
                            config.transferPaste.triggerButtonId, config.transferPaste.triggerButtonText, config.transferPaste.btnCopyClass,
                            (button) => {
                                if (!tp_captureSelectionAndStore()) alert('捕获选区失败！');
                                hideSelectionActionButtons();
                            }
                        );
                        if (!tp_triggerButtonRef.element) return;
                        buttonInfo = { type: 'copy', element: tp_triggerButtonRef.element, fallbackW: config.transferPaste.buttonFallbackWidth, fallbackH: config.transferPaste.buttonFallbackHeight };
                    } else if (type === 'cut') {
                        tp_cutButtonRef.element = tp_createButton(
                            config.transferPaste.cutButtonId, config.transferPaste.cutButtonText, config.transferPaste.btnCutClass,
                            (button) => {
                                const latestSel = window.getSelection();
                                if (latestSel && !latestSel.isCollapsed) {
                                    if (tp_captureSelectionAndStore()) {
                                        try {
                                            if (!document.execCommand('delete', false, null)) {
                                                latestSel.getRangeAt(0).deleteContents();
                                            }
                                        } catch (e) {
                                            try { latestSel.getRangeAt(0).deleteContents(); }
                                            catch (e2) { alert('剪切删除失败.'); }
                                        }
                                    } else { alert('捕获失败，无法剪切！'); }
                                } else { alert('选区失效，无法剪切！'); }
                                hideSelectionActionButtons();
                            }
                        );
                        if (!tp_cutButtonRef.element) return;
                        buttonInfo = { type: 'cut', element: tp_cutButtonRef.element, fallbackW: config.transferPaste.buttonFallbackWidth, fallbackH: config.transferPaste.buttonFallbackHeight };
                    }
                } catch (creationError) { return; }
            }

            if (buttonInfo && buttonInfo.element && buttonInfo.element.isConnected) {
                observeElementResize(buttonInfo.element);
                const dims = elementDimensionsCache.get(buttonInfo.element);
                buttonInfo.width = dims?.width || buttonInfo.fallbackW;
                buttonInfo.height = dims?.height || buttonInfo.fallbackH;

                if (buttonInfo.width <= 0 || buttonInfo.height <= 0) {
                    const ow = buttonInfo.element.offsetWidth; const oh = buttonInfo.element.offsetHeight;
                    if (ow > 0 && oh > 0) {
                        buttonInfo.width = ow; buttonInfo.height = oh;
                        elementDimensionsCache.set(buttonInfo.element, { width: ow, height: oh });
                    } else {
                        return;
                    }
                }

                maxHeight = Math.max(maxHeight, buttonInfo.height);
                visibleButtonsData.push(buttonInfo);
            }
        });

        if (visibleButtonsData.length === 0) return;

        const targetRect = getCursorRect(selection);
        if (!targetRect || (targetRect.width === 0 && targetRect.height === 0 && selectionText.length === 0)) {
            hideSelectionActionButtons(); return;
        }

        const totalWidth = visibleButtonsData.reduce((sum, btn) => sum + btn.width, 0) + Math.max(0, visibleButtonsData.length - 1) * BUTTON_GAP;
        const scrollY = window.pageYOffset;
        const scrollX = window.pageXOffset;
        const vpW = window.innerWidth;

        const groupTop = Math.max(scrollY + 5, scrollY + targetRect.top - maxHeight - config.select.popupAboveGap);
        const selectionCenterX = targetRect.left + targetRect.width / 2;
        let groupLeftStart = scrollX + selectionCenterX - totalWidth / 2;

        groupLeftStart = Math.max(scrollX + 5, groupLeftStart);
        if (groupLeftStart + totalWidth > scrollX + vpW - 5) {
            groupLeftStart = scrollX + vpW - totalWidth - 5;
            groupLeftStart = Math.max(scrollX + 5, groupLeftStart);
        }

        let currentLeftOffset = 0;
        visibleButtonsData.forEach((buttonInfo, index) => {
            const currentButtonLeft = groupLeftStart + currentLeftOffset;
            if (!buttonInfo.element.isConnected) {
                try { docBody.appendChild(buttonInfo.element); observeElementResize(buttonInfo.element); }
                catch (e) { return; }
            }
            scheduleStyleUpdate(buttonInfo.element, {
                transform: `translate(${currentButtonLeft.toFixed(1)}px, ${groupTop.toFixed(1)}px)`,
                display: 'inline-block',
                opacity: '1',
                visibility: 'visible'
            });
            currentLeftOffset += buttonInfo.width + (index < visibleButtonsData.length - 1 ? BUTTON_GAP : 0);
        });
    }

    // --- Transfer Paste Specific Handlers ---
    function tp_handleMouseUp(event) {
        const target = event.target;
        if (target instanceof Node) {
            const isClickOnActionButton = popupElement?.contains(target)
                || tp_triggerButtonRef.element?.contains(target)
                || tp_cutButtonRef.element?.contains(target);
            const isClickOnToggle = togglePanelElement?.contains(target) || toggleTriggerElement?.contains(target);
            const isClickOnCopyTag = ct_copyPopupElement?.contains(target);
            const isClickOnHistory = historyPanel?.contains(target);
            if (isClickOnActionButton || isClickOnToggle || isClickOnCopyTag || isClickOnHistory) return;
        }

        setTimeout(() => {
            requestAnimationFrame(() => {
                const latestSel = window.getSelection();
                if (!latestSel) return;

                const hasStoredContent = !!(tp_storedHTML || tp_storedText);
                const targetEl = event.target instanceof Node ? event.target : null;
                const targetEditable = tp_isElementEditable(targetEl);

                if (latestSel.isCollapsed && hasStoredContent && targetEditable) {
                    if (!popupElement || !popupElement.contains(event.target)) {
                        hideSelectionActionButtons();
                        tp_showPasteButton(event);
                    }
                } else {
                    tp_hidePasteButton();
                }
            });
        }, config.transferPaste.buttonsAppearDelay);
    }

    function tp_handleKeyDown(event) {
        if (togglePanelElement?.contains(document.activeElement)) return;

        const anyActionEnabled = isFeatureEnabled('transferPasteCopy') || isFeatureEnabled('transferPasteCut') || isFeatureEnabled('selectSearchPopup');
        if (!anyActionEnabled && (!tp_pasteButtonRef.element || tp_pasteButtonRef.element.style.visibility === 'hidden')) return;

        if ((event.ctrlKey || event.metaKey) && (event.key === 'a' || event.key === 'A')) {
            tp_ctrlApressed = true;
            hideSelectionActionButtons();
            tp_hidePasteButton();
        } else {
            if (tp_ctrlApressed && !(event.key === 'Control' || event.key === 'Meta' || event.key === 'Shift' || event.key === 'Alt')) {
                tp_ctrlApressed = false;
            }
            if (tp_pasteButtonRef.element?.style.visibility !== 'hidden' && !tp_pasteButtonRef.element.contains(event.target)) {
                if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown', 'Backspace', 'Delete', 'Enter'].includes(event.key)) {
                    tp_hidePasteButton();
                }
            }
            const actionButtonsVisible = (popupElement?.style.visibility !== 'hidden')
                || (tp_triggerButtonRef.element?.style.visibility !== 'hidden')
                || (tp_cutButtonRef.element?.style.visibility !== 'hidden');
            const targetOnActionButtons = popupElement?.contains(event.target)
                || tp_triggerButtonRef.element?.contains(event.target)
                || tp_cutButtonRef.element?.contains(event.target);

            if (actionButtonsVisible && !targetOnActionButtons) {
                if (['Backspace', 'Delete'].includes(event.key)) {
                    setTimeout(() => {
                        const selection = window.getSelection();
                        if (!selection || selection.isCollapsed) {
                            hideSelectionActionButtons();
                        }
                    }, 0);
                }
            }
        }
    }

    function tp_handleKeyUp(event) {
        if (togglePanelElement?.contains(document.activeElement)) return;

        const anyActionEnabled = isFeatureEnabled('transferPasteCopy') || isFeatureEnabled('transferPasteCut');
        if (!anyActionEnabled) return;

        if (tp_ctrlApressed && (event.key === 'Control' || event.key === 'Meta' || event.key === 'a' || event.key === 'A')) {
            setTimeout(() => {
                const modPressed = event.ctrlKey || event.metaKey;
                if ((event.key === 'Control' || event.key === 'Meta') || ((event.key === 'a' || event.key === 'A') && !modPressed)) {
                    if (tp_ctrlApressed) {
                        const currentSelection = window.getSelection();
                        if (currentSelection && !currentSelection.isCollapsed && currentSelection.toString().trim().length > 0) {
                            const range = currentSelection.rangeCount > 0 ? currentSelection.getRangeAt(0) : null;
                            if (range) {
                                const containerNode = range.commonAncestorContainer;
                                const isInEditable = containerNode && (
                                    (containerNode.nodeType === Node.ELEMENT_NODE && tp_isElementEditable(containerNode)) ||
                                    (containerNode.nodeType === Node.TEXT_NODE && containerNode.parentElement && tp_isElementEditable(containerNode.parentElement))
                                );
                                if (isInEditable) {
                                    requestAnimationFrame(() => { showSelectionActionButtons(currentSelection, true); });
                                } else { hideSelectionActionButtons(); }
                            } else { hideSelectionActionButtons(); }
                        } else { hideSelectionActionButtons(); }
                        tp_ctrlApressed = false;
                    }
                }
            }, 0);
        }
    }

    function tp_initialize() {
        const tpConfig = config.transferPaste;
        const MAX_RETRIES = tpConfig.initWaitMaxRetries;
        const RETRY_INTERVAL = tpConfig.initWaitRetryInterval;
        let retries = 0;

        const intervalId = setInterval(() => {
            if (tp_editorContainer) { clearInterval(intervalId); return; }

            const container = document.querySelector(tpConfig.editorContainerSelector);
            if (container) {
                clearInterval(intervalId);
                tp_editorContainer = container;
                if (isFeatureEnabled('transferPasteCopy') || isFeatureEnabled('transferPasteCut')) {
                    tp_attachListeners();
                }
            } else {
                retries++;
                if (retries >= MAX_RETRIES) {
                    clearInterval(intervalId);
                }
            }
        }, RETRY_INTERVAL);
    }

    function tp_attachListeners() {
        if (!tp_editorContainer || tp_listenersAttached) return;
        try {
            tp_editorContainer.addEventListener('keydown', tp_handleKeyDown, true);
            tp_editorContainer.addEventListener('keyup', tp_handleKeyUp, true);
            tp_listenersAttached = true;
        } catch (e) {
            tp_listenersAttached = false;
        }
    }

    function tp_detachListeners() {
        if (!tp_editorContainer || !tp_listenersAttached) return;
        try {
            tp_editorContainer.removeEventListener('keydown', tp_handleKeyDown, true);
            tp_editorContainer.removeEventListener('keyup', tp_handleKeyUp, true);
            tp_listenersAttached = false;
        } catch (e) {
            tp_listenersAttached = false;
        }
    }

    // --- Copy Tag Specific Handlers ---
    async function ct_handleCopyButtonClick(event) {
        if (!isFeatureEnabled('copyTagOnHover')) return;
        event.stopPropagation();
        event.preventDefault();
        if (!ct_currentTagText || !ct_copyPopupElement || !ct_currentHoveredTag) return;

        const text = " " + ct_currentTagText;
        try {
            await navigator.clipboard.writeText(text);
            ct_showFeedbackIndicator(ct_currentHoveredTag);
            ct_hideCopyPopupImmediately(false);
        } catch (err) {
            alert(`复制失败: ${err.message}`);
        }
    }

    function ct_handleMouseOver(event) {
        if (!isFeatureEnabled('copyTagOnHover')) return;
        if (!(event.target instanceof Element)) return;

        const relevant = event.target.closest(`${config.copyTag.tagSelector}, #${config.copyTag.popupId}`);

        if (!relevant) {
            if (ct_currentHoveredTag) {
                ct_scheduleHidePopup();
            }
            return;
        }

        ct_createElements();
        if (!ct_copyPopupElement) return;

        const tagEl = relevant.matches(config.copyTag.tagSelector) ? relevant : null;
        const isOverPopup = relevant === ct_copyPopupElement;

        if (tagEl) {
            if (tagEl === ct_currentHoveredTag) {
                clearTimeout(ct_hideTimeout); ct_hideTimeout = null;
                if (ct_copyPopupElement.style.visibility === 'hidden' || ct_copyPopupElement.style.opacity === '0') {
                    ct_showCopyPopup(tagEl);
                }
            } else {
                clearTimeout(ct_showTimeout);
                clearTimeout(ct_hideTimeout); ct_hideTimeout = null;
                if (ct_currentHoveredTag && ct_copyPopupElement.style.visibility !== 'hidden' && ct_copyPopupElement.style.opacity !== '0') {
                    ct_hideCopyPopupImmediately(false);
                }
                ct_currentHoveredTag = tagEl;
                ct_showTimeout = setTimeout(() => {
                    if (ct_currentHoveredTag === tagEl && tagEl.matches(':hover')) {
                        ct_showCopyPopup(tagEl);
                    }
                    ct_showTimeout = null;
                }, config.copyTag.hoverDelay);
            }
        } else if (isOverPopup) {
            clearTimeout(ct_hideTimeout); ct_hideTimeout = null;
            clearTimeout(ct_showTimeout); ct_showTimeout = null;
            if (ct_copyPopupElement.style.visibility === 'hidden' || ct_copyPopupElement.style.opacity === '0') {
                scheduleStyleUpdate(ct_copyPopupElement, { opacity: '1', visibility: 'visible', display: 'block' });
            }
        }
    }

    // --- Toggle Panel ---
    function hideTogglePanel() {
        if (togglePanelElement) {
            scheduleStyleUpdate(togglePanelElement, { transform: `translateX(100%)` });
        }
    }
    function scheduleHideTogglePanel() {
        clearTimeout(togglePanelHideTimeout);
        togglePanelHideTimeout = setTimeout(() => {
            const triggerHover = toggleTriggerElement?.matches(':hover');
            const panelHover = togglePanelElement?.matches(':hover');
            if (!triggerHover && !panelHover) {
                hideTogglePanel();
            }
        }, config.togglePanel.hideDelay);
    }
    function showTogglePanel() {
        clearTimeout(togglePanelHideTimeout);
        if (togglePanelElement) {
            scheduleStyleUpdate(togglePanelElement, { transform: 'translateX(0)' });
        }
    }

    // --- [ ☆ Feature State Change Application ☆ ] ---
    let customInputListenerAttached = false;
    let historyListClickListenerAttached = false;
    let historyListDblClickListenerAttached = false;
    let selectPopupListenersAttached = false;
    let copyTagListenerAttached = false;
    let historyItemKeyListenerAttached = false;

    function applyFeatureStateChange(featureKey, isEnabled) {
        switch (featureKey) {
            case 'syncSearchBox':
                if (isEnabled) {
                    if (!topBarControls.container) createControlPanel();
                    if (topBarControls.container) scheduleStyleUpdate(topBarControls.container, { display: 'flex' });
                    if (!customInput && topBarControls.input) {
                        customInput = topBarControls.input;
                        checkMubuInterface();
                    }
                    if (topBarControls.input && !customInputListenerAttached) {
                        topBarControls.prevBtn?.addEventListener('click', () => handleHistoryNavigation(-1));
                        topBarControls.nextBtn?.addEventListener('click', () => handleHistoryNavigation(1));
                        topBarControls.clearBtn?.addEventListener('click', handleClear);
                        topBarControls.input?.addEventListener('input', handleCustomInputChange, { passive: true });
                        customInputListenerAttached = true;
                    }
                    const currentVal = lastSyncedValue ?? originalInput?.value ?? '';
                    setOriginalInputValue(currentVal);
                    if (customInput) customInput.value = currentVal;

                } else {
                    if (topBarControls.container) scheduleStyleUpdate(topBarControls.container, { display: 'none' });
                    if (customInputListenerAttached) {
                        topBarControls.prevBtn?.removeEventListener('click', () => handleHistoryNavigation(1));
                        topBarControls.nextBtn?.removeEventListener('click', () => handleHistoryNavigation(-1));
                        topBarControls.clearBtn?.removeEventListener('click', handleClear);
                        topBarControls.input?.removeEventListener('input', handleCustomInputChange);
                        if (customInputSearchTimeoutId) clearTimeout(customInputSearchTimeoutId);
                        customInputSearchTimeoutId = null;
                        customInputListenerAttached = false;
                    }
                    customInput = null;
                }
                setupInputListeners(originalInput);
                setupDomObserver();
                break;

            case 'historyPanel':
                if (isEnabled) {
                    if (!historyPanel) createHistoryPanel();
                    if (historyPanel) scheduleStyleUpdate(historyPanel, { display: 'flex' });
                    if (historyListElement) {
                        if (!historyListClickListenerAttached) {
                            historyListElement.addEventListener('click', handleHistoryListClick);
                            historyListClickListenerAttached = true;
                        }
                        if (!historyListDblClickListenerAttached) {
                            historyListElement.addEventListener('dblclick', handleHistoryListDblClick);
                            historyListDblClickListenerAttached = true;
                        }
                        if (!historyItemKeyListenerAttached) {
                            document.body.addEventListener('keydown', handleHistoryItemHighlightKey, true);
                            historyItemKeyListenerAttached = true;
                        }
                    }
                    historyManager.updatePanel();
                } else {
                    if (historyPanel) scheduleStyleUpdate(historyPanel, { display: 'none' });
                    if (historyListElement) {
                        if (historyListClickListenerAttached) {
                            historyListElement.removeEventListener('click', handleHistoryListClick);
                            historyListClickListenerAttached = false;
                        }
                        if (historyListDblClickListenerAttached) {
                            historyListElement.removeEventListener('dblclick', handleHistoryListDblClick);
                            historyListDblClickListenerAttached = false;
                        }
                        if (historyItemKeyListenerAttached) {
                            document.body.removeEventListener('keydown', handleHistoryItemHighlightKey, true);
                            historyItemKeyListenerAttached = false;
                        }
                    }
                    persistHighlightedTerm = null; persistHighlightedIndex = null;
                }
                setupInputListeners(originalInput);
                setupDomObserver();
                break;

            case 'pushContent':
                try {
                    const pcConfig = config.pushContent;
                    const contentElement = document.querySelector(pcConfig.contentSelector);
                    if (contentElement) {
                        if (isEnabled) {
                            contentElement.classList.add(pcConfig.pushClass);
                        } else {
                            contentElement.classList.remove(pcConfig.pushClass);
                        }
                    }
                } catch (e) { /* silenced */ }
                break;

            case 'selectSearchPopup':
            case 'transferPasteCopy':
            case 'transferPasteCut':
                const anyGroupButtonEnabled = isFeatureEnabled('selectSearchPopup') || isFeatureEnabled('transferPasteCopy') || isFeatureEnabled('transferPasteCut');
                const anyPasteEnabled = isFeatureEnabled('transferPasteCopy') || isFeatureEnabled('transferPasteCut');

                if (anyGroupButtonEnabled || anyPasteEnabled) {
                    if (isFeatureEnabled('selectSearchPopup') && !popupElement) createSelectPopup();
                    if (isFeatureEnabled('transferPasteCopy') && !tp_triggerButtonRef.element) {
                        tp_triggerButtonRef.element = tp_createButton(config.transferPaste.triggerButtonId, config.transferPaste.triggerButtonText, config.transferPaste.btnCopyClass, () => { });
                    }
                    if (isFeatureEnabled('transferPasteCut') && !tp_cutButtonRef.element) {
                        tp_cutButtonRef.element = tp_createButton(config.transferPaste.cutButtonId, config.transferPaste.cutButtonText, config.transferPaste.btnCutClass, () => { });
                    }
                    if (anyPasteEnabled && !tp_pasteButtonRef.element) {
                        tp_pasteButtonRef.element = tp_createButton(config.transferPaste.pasteButtonId, config.transferPaste.pasteButtonText, config.transferPaste.btnPasteClass, () => { });
                    }

                    if (!selectPopupListenersAttached) {
                        try {
                            document.addEventListener('mousedown', handleMouseDownPopup, true);
                            document.addEventListener('mouseup', handleMouseUpSelectionEnd, true);
                            document.addEventListener('mouseup', tp_handleMouseUp, true);
                            selectPopupListenersAttached = true;
                        } catch (e) { /* silenced */ }
                    }
                } else {
                    if (selectPopupListenersAttached) {
                        try {
                            document.removeEventListener('mousedown', handleMouseDownPopup, true);
                            document.removeEventListener('mouseup', handleMouseUpSelectionEnd, true);
                            document.removeEventListener('mouseup', tp_handleMouseUp, true);
                            selectPopupListenersAttached = false;
                        } catch (e) { /* silenced */ }
                    }
                    hideSelectionActionButtons();
                    tp_hidePasteButton();
                }

                if (anyPasteEnabled) {
                    tp_attachListeners();
                } else {
                    tp_detachListeners();
                }

                if (!isEnabled) {
                    hideSelectionActionButtons();
                    if (!anyPasteEnabled) {
                        tp_hidePasteButton();
                    }
                }
                break;

            case 'copyTagOnHover':
                if (isEnabled) {
                    ct_createElements();
                    if (!copyTagListenerAttached) {
                        const target = document.querySelector(config.selectors.copyTagParentContainer) || document.body;
                        if (target) {
                            try {
                                target.addEventListener('mouseover', ct_handleMouseOver, { passive: true });
                                ct_listenerTarget = target;
                                copyTagListenerAttached = true;
                            } catch (e) { ct_listenerTarget = null; }
                        }
                    }
                } else {
                    ct_hideCopyPopupImmediately(true);
                    ct_hideFeedbackIndicator();
                    if (copyTagListenerAttached && ct_listenerTarget) {
                        try { ct_listenerTarget.removeEventListener('mouseover', ct_handleMouseOver); }
                        catch (e) { /* silenced */ }
                        copyTagListenerAttached = false;
                        ct_listenerTarget = null;
                    } else {
                        if (copyTagListenerAttached) copyTagListenerAttached = false;
                        ct_listenerTarget = null;
                    }
                    ct_currentHoveredTag = null; ct_currentTagText = '';
                    clearTimeout(ct_showTimeout); ct_showTimeout = null;
                    clearTimeout(ct_hideTimeout); ct_hideTimeout = null;
                    clearTimeout(ct_feedbackTimeout); ct_feedbackTimeout = null;
                }
                break;

            // --- [ ☆ 新增：处理隐藏顶栏开关 ☆ ] ---
            case 'hideTopBar':
                try {
                    const htConfig = config.hideTopBar;
                    if (isEnabled) {
                        document.body.classList.add(htConfig.hideClass);
                    } else {
                        document.body.classList.remove(htConfig.hideClass);
                    }
                } catch (e) { /* silenced */ }
                break;
        }
    }

    // --- [ ☆ DOM Observer Setup ☆ ] ---
    function setupDomObserver() {
        const needsObserver = isHistoryTrackingNeeded();

        if (needsObserver && !domObserver) {
            const target = document.querySelector(config.selectors.domObserverTarget) || document.body;
            if (target) {
                domObserver = new MutationObserver((mutations) => {
                    if (!isHistoryTrackingNeeded()) { disconnectDomObserver(); return; }
                    if (isSimulatingClick) return;

                    let relevant = mutations.some(m => {
                        if (m.type === 'childList') return true;
                        if (m.type === 'attributes' && m.target === originalInput && m.attributeName === 'disabled') return true;
                        if (m.type === 'childList' && m.removedNodes.length > 0) {
                            for (const node of m.removedNodes) {
                                if (node === originalInput || (node instanceof Element && node.contains?.(originalInput))) return true;
                            }
                        }
                        return false;
                    });

                    if (relevant) {
                        findAndSetupDebounced();
                    }
                });

                domObserver.observe(target, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['disabled']
                });
            }
        } else if (!needsObserver && domObserver) {
            disconnectDomObserver();
        }
    }

    function disconnectDomObserver() {
        if (domObserver) {
            try { domObserver.disconnect(); } catch (e) { }
            domObserver = null;
        }
    }

    // --- [ ☆ Initialization ☆ ] ---
    function init() {
        try {
            if (!nativeInputValueSetter) console.warn("MubuPlus: Native input setter not found.");
            if (isFeatureEnabled('copyTagOnHover') && (!navigator.clipboard?.writeText)) console.warn("MubuPlus: Clipboard API unavailable for Copy Tag.");
            if ((isFeatureEnabled('transferPasteCopy') || isFeatureEnabled('transferPasteCut')) && (!document.execCommand)) console.warn("MubuPlus: document.execCommand unavailable for Transfer Paste.");

            // --- CSS Injection ---
            let combinedCSS = `
                /* Top Search Bar */
                #${config.sync.topBarId} { position:fixed; top:0px; left:50%; transform:translateX(-50%); z-index:10001; background:rgba(255,255,255,0.98); padding:5px; border-radius:6px; box-shadow:0 0px 0px rgba(0,0,0,0.15); display:flex; gap:6px; align-items:center; backdrop-filter:blur(5px); -webkit-backdrop-filter:blur(5px); }
                #${config.sync.topBarId} .custom-search-input { padding:8px 12px; border:1px solid #dcdfe6; border-radius:6px; width:300px; font-size:14px; transition:all .2s ease-in-out; background:#f8f9fa; color:#303133; box-sizing:border-box; }
                #${config.sync.topBarId} .custom-search-input::-webkit-search-cancel-button, #${config.sync.topBarId} .custom-search-input::-webkit-search-clear-button { display:none; -webkit-appearance:none; appearance:none; }
                #${config.sync.topBarId} .custom-search-input:focus { border-color:#5856d5; outline:0; background:#fff; box-shadow:0 0 0 1px #5856d5; }
                #${config.sync.topBarId} .custom-search-input:disabled { background:#eee; cursor:not-allowed; opacity:0.7; }
                #${config.sync.topBarId} .history-btn, #${config.sync.topBarId} .clear-btn { padding:6px 12px; background:#f0f2f5; border:1px solid #dcdfe6; border-radius:6px; cursor:pointer; transition:all .2s ease-in-out; font-weight:500; color:#606266; flex-shrink:0; user-select:none; line-height:1; }
                #${config.sync.topBarId} .clear-btn { font-weight:bold; padding:6px 10px; }
                #${config.sync.topBarId} .history-btn:hover, #${config.sync.topBarId} .clear-btn:hover { background:#e9e9eb; color:#5856d5; border-color:#c0c4cc; }
                #${config.sync.topBarId} .history-btn:active, #${config.sync.topBarId} .clear-btn:active { transform:scale(.95); background:#dcdfe6; }

                /* History Panel */
                #${config.sync.historyPanelId} { position:fixed; top:460px; left:0px; transform:translateY(-50%); z-index:10000; width:152px; max-height:436px; background:rgba(248,249,250,0.95); border:1px solid #e0e0e0; border-radius:6px; box-shadow:0 1px 8px rgba(0,0,0,0.1); padding:8px 0 4px 0; overflow:hidden; backdrop-filter:blur(3px); -webkit-backdrop-filter:blur(3px); display:flex; flex-direction:column; }
                #${config.sync.historyPanelId} .search-history-list { list-style:none; padding:0; margin:0 0 4px 0; flex-grow:1; overflow-y:auto; scrollbar-width:thin; scrollbar-color:#ccc #f0f0f0; }
                #${config.sync.historyPanelId} .search-history-list::-webkit-scrollbar { width:6px; }
                #${config.sync.historyPanelId} .search-history-list::-webkit-scrollbar-track { background:#f0f0f0; border-radius:3px; }
                #${config.sync.historyPanelId} .search-history-list::-webkit-scrollbar-thumb { background-color:#ccc; border-radius:3px; }

                /* History Item & Delete Button */
                #${config.sync.historyPanelId} .search-history-item { position: relative; padding: 6px 10px 6px 28px; font-size: 13px; color: #555; cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; border-bottom: 1px solid #eee; transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out; box-sizing: border-box; }
                #${config.sync.historyPanelId} .search-history-item-text { display: inline-block; max-width: 100%; overflow: hidden; text-overflow: ellipsis; vertical-align: middle; }
                #${config.sync.historyPanelId} .search-history-item:last-child { border-bottom: none; }
                #${config.sync.historyPanelId} .search-history-item:hover { background-color: #e9e9eb; color: #5856d5; }
                #${config.sync.historyPanelId} .search-history-item:active { background-color: #dcdfe6; }
                #${config.sync.historyPanelId} .search-history-item--active { background-color: ${config.sync.activeItemBgColor} !important; color: #000 !important; font-weight: 500; }
                #${config.sync.historyPanelId} .${config.sync.historyItemDeleteBtnClass} { position: absolute; left: 6px; top: 50%; transform: translateY(-50%); display: none; cursor: pointer; color: #aaa; font-size: 14px; line-height: 1; padding: 3px 5px; border-radius: 3px; background: rgba(0,0,0,0.02); z-index: 1; transition: color 0.15s ease, background-color 0.15s ease; }
                #${config.sync.historyPanelId} .search-history-item:hover .${config.sync.historyItemDeleteBtnClass} { display: inline-block; }
                #${config.sync.historyPanelId} .search-history-item .${config.sync.historyItemDeleteBtnClass}:hover { color: #f55; background: rgba(0,0,0,0.08); }
                #${config.sync.historyPanelId} .search-history-item--persist-highlight { background-color:${config.sync.persistHighlightBgColor} !important; color:#333 !important; font-weight: bold; }

                /* History "Selective Clear" Button */
                #${config.sync.historyPanelId} .history-clear-all-button { display: block; width: calc(100% - 16px); margin: 8px auto 4px auto; padding: 5px 10px; font-size: 12px; text-align: center; cursor: pointer; background-color: #f8f9fa; border: 1px solid #dcdfe6; color: #dc3545; border-radius: 4px; transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, opacity 0.2s ease; flex-shrink: 0; opacity: 1; }
                #${config.sync.historyPanelId} .history-clear-all-button:hover:not(:disabled) { background-color: #e9ecef; border-color: #c0c4cc; color: #a0202e; }
                #${config.sync.historyPanelId} .history-clear-all-button:disabled { color: #adb5bd; background-color: #f1f3f5; border-color: #e9ecef; cursor: not-allowed; opacity: 0.6; }

                /* History Multi-Select Highlight */
                #${config.sync.historyPanelId} .search-history-item--multi-selected { background-color: #e0f2e0 !important; color: #0b6e0b !important; font-weight: normal !important; border-left: 3px solid #4CAF50; padding-left: 25px; }
                #${config.sync.historyPanelId} .search-history-item--multi-selected:hover { background-color: #c8e8c8 !important; }
                #${config.sync.historyPanelId} .search-history-item--multi-selected.search-history-item--active { background-color: #c8e8c8 !important; color: #005000 !important; font-weight: 500 !important; }
                #${config.sync.historyPanelId} .search-history-item--multi-selected.search-history-item--persist-highlight { background-color: #c8e8c8 !important; color: #005000 !important; font-weight: bold !important; }
                #${config.sync.historyPanelId} .search-history-item--multi-selected .${config.sync.historyItemDeleteBtnClass} { left: 3px; }

                /* Select Search Popup Button */
                .mu-select-popup-btn { background-color:#5856d5; color:white; border:none; border-radius:5px; padding:4px 8px; font-size:14px; line-height:1; cursor:pointer; box-shadow:0 2px 6px rgba(0,0,0,0.3); white-space:nowrap; user-select:none; -webkit-user-select:none; transition: opacity 0.1s ease-in-out, visibility 0.1s ease-in-out, background-color 0.1s ease-in-out; }
                .mu-select-popup-btn:hover { background-color:#4a48b3; }

                /* Copy Tag Popup & Feedback */
                #${config.copyTag.popupId} { position:absolute; top:0; left:0; z-index:10010; background-color:#f0f2f5; color:#5856d5; border:1px solid #dcdfe6; border-radius:4px; padding:2px 5px; font-size:12px; line-height:1; cursor:pointer; box-shadow:0 1px 3px rgba(0,0,0,0.15); white-space:nowrap; user-select:none; -webkit-user-select:none; pointer-events:auto; transition: opacity 0.1s ease-in-out, visibility 0.1s ease-in-out; }
                #${config.copyTag.popupId}:hover { background-color:#e4e7ed; border-color:#c0c4cc; }
                #${config.copyTag.feedbackId} { position:absolute; top:0; left:0; z-index:10011; background-color:#5856d5; color:white; border:1px solid #5856d5; border-radius:4px; padding:2px 5px; font-size:12px; line-height:1; cursor:default; box-shadow:0 1px 3px rgba(0,0,0,0.15); white-space:nowrap; user-select:none; -webkit-user-select:none; pointer-events:none; transition: opacity 0.1s ease-in-out, visibility 0.1s ease-in-out; }

                /* Transfer Paste Buttons (Base & Specific) */
                .${config.transferPaste.cssPrefix}${config.transferPaste.btnBaseClass} { color:white; border:none; border-radius:5px; padding:4px 8px; font-size:14px; line-height:1; cursor:pointer; box-shadow:0 2px 6px rgba(0,0,0,0.3); white-space:nowrap; user-select:none; -webkit-user-select:none; transition: opacity 0.1s ease-in-out, visibility 0.1s ease-in-out, background-color 0.1s ease-in-out; }
                .${config.transferPaste.cssPrefix}${config.transferPaste.btnCopyClass} { background-color:#5856d5; }
                .${config.transferPaste.cssPrefix}${config.transferPaste.btnCopyClass}:hover { background-color:#4a48b3; }
                .${config.transferPaste.cssPrefix}${config.transferPaste.btnCutClass} { background-color:#d55856; }
                .${config.transferPaste.cssPrefix}${config.transferPaste.btnCutClass}:hover { background-color:#b34a48; }
                .${config.transferPaste.cssPrefix}${config.transferPaste.btnPasteClass} { background-color:#5856d5; }
                .${config.transferPaste.cssPrefix}${config.transferPaste.btnPasteClass}:hover { background-color:#4a48b3; }

                /* Feature Toggle Panel */
                #${config.togglePanel.triggerId} { position:fixed; bottom:0; right:0; width:${config.togglePanel.triggerWidth}px; height:${config.togglePanel.triggerHeight}px; background:rgba(0,0,0,0.01); cursor:pointer; z-index:19998; border-top-left-radius:5px; }
                #${config.togglePanel.panelId} { position:fixed; bottom:0; right:0; width:${config.togglePanel.panelWidth}px; max-height:80vh; overflow-y:auto; background:rgba(250,250,250,0.98); border:1px solid #ccc; border-top-left-radius:8px; box-shadow:-2px -2px 10px rgba(0,0,0,0.15); padding:10px; z-index:19999; transform:translateX(100%); transition:transform 0.3s ease-in-out; font-size:14px; color:#333; box-sizing:border-box; scrollbar-width:thin; scrollbar-color:#bbb #eee; }
                #${config.togglePanel.panelId}::-webkit-scrollbar { width:6px; }
                #${config.togglePanel.panelId}::-webkit-scrollbar-track { background:#eee; border-radius:3px; }
                #${config.togglePanel.panelId}::-webkit-scrollbar-thumb { background-color:#bbb; border-radius:3px; }
                #${config.togglePanel.triggerId}:hover + #${config.togglePanel.panelId}, #${config.togglePanel.panelId}:hover { transform:translateX(0); }
                #${config.togglePanel.panelId} .toggle-panel-title { font-weight:bold; margin-bottom:10px; padding-bottom:5px; border-bottom:1px solid #eee; text-align:center; }
                #${config.togglePanel.panelId} .toggle-control { display:flex; align-items:center; margin-bottom:8px; cursor:pointer; }
                #${config.togglePanel.panelId} .toggle-control input[type="checkbox"] { margin-right:8px; cursor:pointer; appearance:none; -webkit-appearance:none; width:36px; height:20px; background-color:#ccc; border-radius:10px; position:relative; transition:background-color 0.2s ease-in-out; flex-shrink:0; }
                #${config.togglePanel.panelId} .toggle-control input[type="checkbox"]::before { content:''; position:absolute; width:16px; height:16px; border-radius:50%; background-color:white; top:2px; left:2px; transition:left 0.2s ease-in-out; box-shadow:0 1px 2px rgba(0,0,0,0.2); }
                #${config.togglePanel.panelId} .toggle-control input[type="checkbox"]:checked { background-color:#5856d5; }
                #${config.togglePanel.panelId} .toggle-control input[type="checkbox"]:checked::before { left:18px; }
                #${config.togglePanel.panelId} .toggle-control label { flex-grow:1; user-select:none; cursor:pointer; }

                 /* Push Content */
                ${config.pushContent.contentSelector} { transition: margin-left ${config.pushContent.transitionDuration} ease-in-out !important; box-sizing: border-box; }
                ${config.pushContent.contentSelector}.${config.pushContent.pushClass} { margin-left: ${config.pushContent.pushMarginLeft}px !important; }

                /* --- [ ☆ 新增：隐藏顶栏 CSS ☆ ] --- */
                body.${config.hideTopBar.hideClass} ${config.hideTopBar.selector} {
                    display: none !important;
                }
            `;
            if (combinedCSS) { try { GM_addStyle(combinedCSS); } catch (e) { console.error("MubuPlus: Failed to inject CSS.", e); } }

            // Create UI Elements
            createControlPanel();
            createHistoryPanel();
            createTogglePanel();

            // Initialize subsystems
            tp_initialize();

            // Find initial input & setup listeners
            const initialInput = optimizedFindSearchBox();
            if (initialInput) {
                originalInput = initialInput;
                lastSyncedValue = initialInput.value;
                setupInputListeners(originalInput);
                if (lastSyncedValue && isHistoryTrackingNeeded()) {
                    updateCustomInputAndAddHistory(lastSyncedValue, 'init_load');
                } else if (isFeatureEnabled('historyPanel')) {
                    historyManager.updatePanel();
                }
            }

            // Setup DOM observer
            setupDomObserver();

            // Schedule the check for Mubu's internal search API
            setTimeout(checkMubuInterface, config.interfaceCheckDelay);

            // Apply initial feature states based on default settings
            let initialEnabledCount = 0;
            for (const key in runtimeFeatureState) {
                if (runtimeFeatureState[key]) {
                    try {
                        applyFeatureStateChange(key, true);
                        initialEnabledCount++;
                    } catch (applyError) {
                        console.error(`MubuPlus: Error applying initial state for feature "${key}":`, applyError);
                    }
                }
            }

            // Add unload listener for cleanup
            window.addEventListener('unload', cleanup);

        } catch (initError) {
            console.error("MubuPlus: Initialization failed.", initError);
        }
    }

    // --- [ ☆ Cleanup ☆ ] ---
    function cleanup() {
        window.removeEventListener('unload', cleanup);

        // Disconnect observers
        try { disconnectDomObserver(); } catch (e) { }
        try { observerInstance.disconnect(); } catch (e) { }
        elementObserverMap.clear();

        // Remove listeners
        try { teardownInputListeners(originalInput); } catch (e) { }
        if (customInputListenerAttached) {
            try { topBarControls.prevBtn?.removeEventListener('click', () => handleHistoryNavigation(1)); } catch (e) { }
            try { topBarControls.nextBtn?.removeEventListener('click', () => handleHistoryNavigation(-1)); } catch (e) { }
            try { topBarControls.clearBtn?.removeEventListener('click', handleClear); } catch (e) { }
            try { topBarControls.input?.removeEventListener('input', handleCustomInputChange); } catch (e) { }
            customInputListenerAttached = false;
        }
        if (historyListClickListenerAttached) {
            try { historyListElement?.removeEventListener('click', handleHistoryListClick); } catch (e) { }
            historyListClickListenerAttached = false;
        }
        if (historyListDblClickListenerAttached) {
            try { historyListElement?.removeEventListener('dblclick', handleHistoryListDblClick); } catch (e) { }
            historyListDblClickListenerAttached = false;
        }
        if (historyItemKeyListenerAttached) {
            try { document.body.removeEventListener('keydown', handleHistoryItemHighlightKey, true); } catch (e) { }
            historyItemKeyListenerAttached = false;
        }
        try {
            const clearAllBtn = document.getElementById('history-clear-all-btn');
            clearAllBtn?.removeEventListener('click', handleSelectiveHistoryClear);
        } catch (e) { /* silenced */ }
        if (selectPopupListenersAttached) {
            try { document.removeEventListener('mousedown', handleMouseDownPopup, true); } catch (e) { }
            try { document.removeEventListener('mouseup', handleMouseUpSelectionEnd, true); } catch (e) { }
            try { document.removeEventListener('mouseup', tp_handleMouseUp, true); } catch (e) { }
            selectPopupListenersAttached = false;
        }
        if (copyTagListenerAttached && ct_listenerTarget) {
            try { ct_listenerTarget.removeEventListener('mouseover', ct_handleMouseOver); } catch (e) { }
            copyTagListenerAttached = false; ct_listenerTarget = null;
        }
        try { tp_detachListeners(); } catch (e) { }
        try { toggleTriggerElement?.removeEventListener('mouseenter', showTogglePanel); } catch (e) { }
        try { toggleTriggerElement?.removeEventListener('mouseleave', scheduleHideTogglePanel); } catch (e) { }
        try { togglePanelElement?.removeEventListener('mouseenter', showTogglePanel); } catch (e) { }
        try { togglePanelElement?.removeEventListener('mouseleave', scheduleHideTogglePanel); } catch (e) { }

        // Clear timeouts
        clearTimeout(customInputSearchTimeoutId);
        clearTimeout(togglePanelHideTimeout);
        clearTimeout(ct_showTimeout);
        clearTimeout(ct_hideTimeout);
        clearTimeout(ct_feedbackTimeout);
        clearTimeout(interfaceCheckTimer);

        // Hide UI elements immediately & remove classes
        hideSelectionActionButtons();
        tp_hidePasteButton();
        ct_hideCopyPopupImmediately(true);
        ct_hideFeedbackIndicator();
        hideTogglePanel();
        try {
            const pcConfig = config.pushContent;
            const contentElement = document.querySelector(pcConfig.contentSelector);
            contentElement?.classList.remove(pcConfig.pushClass);
        } catch (e) { /* silenced */ }
        try { // --- [ ☆ 新增：移除隐藏顶栏类名 ☆ ] ---
            document.body.classList.remove(config.hideTopBar.hideClass);
        } catch (e) { /* silenced */ }

        // Schedule removal of dynamically added elements
        setTimeout(() => {
            try { unobserveElementResize(popupElement); popupElement?.remove(); } catch (e) { }
            try { unobserveElementResize(tp_triggerButtonRef.element); tp_triggerButtonRef.element?.remove(); } catch (e) { }
            try { unobserveElementResize(tp_cutButtonRef.element); tp_cutButtonRef.element?.remove(); } catch (e) { }
            try { unobserveElementResize(tp_pasteButtonRef.element); tp_pasteButtonRef.element?.remove(); } catch (e) { }
            try { unobserveElementResize(ct_copyPopupElement); ct_copyPopupElement?.remove(); } catch (e) { }
            try { unobserveElementResize(ct_feedbackElement); ct_feedbackElement?.remove(); } catch (e) { }
            try { unobserveElementResize(topBarControls.container); topBarControls.container?.remove(); } catch (e) { }
            try { unobserveElementResize(historyPanel); historyPanel?.remove(); } catch (e) { }
            try { toggleTriggerElement?.remove(); } catch (e) { }
            try { togglePanelElement?.remove(); } catch (e) { }
        }, 200);

        // Reset state variables
        isRafScheduled = false; styleUpdateQueue = [];
        originalInput = null; lastSyncedValue = null; isSyncing = false; customInput = null;
        originalInputHistoryHandler = null;
        topBarControls = { container: null, input: null, prevBtn: null, nextBtn: null, clearBtn: null };
        historyPanel = null; historyListElement = null; activeHistoryItemElement = null;
        isSimulatingClick = false; persistHighlightedTerm = null; persistHighlightedIndex = null;
        isInterfaceAvailable = false; interfaceCheckTimer = null; customInputSearchTimeoutId = null;
        isProgrammaticValueChange = false; popupElement = null; currentSelectedText = '';
        ct_copyPopupElement = null; ct_feedbackElement = null; ct_currentHoveredTag = null; ct_currentTagText = '';
        ct_showTimeout = null; ct_hideTimeout = null; ct_feedbackTimeout = null; ct_listenerTarget = null;
        tp_editorContainer = null; tp_triggerButtonRef.element = null; tp_cutButtonRef.element = null; tp_pasteButtonRef.element = null;
        tp_storedHTML = ''; tp_storedText = ''; tp_ctrlApressed = false; tp_listenersAttached = false;
        togglePanelElement = null; toggleTriggerElement = null; togglePanelHideTimeout = null;
    }

    // --- Initialization Trigger ---
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, config.initDelay);
    } else {
        window.addEventListener('DOMContentLoaded', () => setTimeout(init, config.initDelay), { once: true });
    }

})();