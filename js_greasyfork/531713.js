// ==UserScript==
// @name         幕布MubuPlus v3.9
// @namespace    http://tampermonkey.net/
// @version      3.9 // Merged SyncSearch/HistoryPanel v3.74.10 (PersistHighlight+CSSHideLast) + Other features v3.8 + Advanced History Click Logic
// @author       Yeeel (Enhanced by Assistant based on request)
// @match        *://mubu.com/*
// @match        *://*.mubu.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// @icon         https://mubu.com/favicon.ico
// @license      MIT
// @description (同步搜索框+搜索历史面板+选中快速筛选+悬停复制标签+保留软换行和颜色中转粘贴-复制剪切) v3.6.0
// @downloadURL https://update.greasyfork.org/scripts/531713/%E5%B9%95%E5%B8%83MubuPlus%20v39.user.js
// @updateURL https://update.greasyfork.org/scripts/531713/%E5%B9%95%E5%B8%83MubuPlus%20v39.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log('[Mubu Combined Helper v3.8e Advanced History Click] 脚本加载'); // Updated log message

    // --- [ ☆ 功能开关 (默认值) ☆ ] ---
    const FEATURES = {
        syncSearchBox: { enabled: true, label: '同步搜索框' }, // From 副脚本
        historyPanel: { enabled: true, label: '搜索历史面板' }, // From 副脚本
        pushContent: { enabled: true, label: '推开左侧文本' }, // From 主脚本
        selectSearchPopup: { enabled: true, label: '选中快速筛选' }, // From 主脚本
        copyTagOnHover: { enabled: false, label: '悬停复制标签' }, // From 主脚本
        transferPasteCopy: { enabled: false, label: '中转粘贴-复制' }, // From 主脚本
        transferPasteCut: { enabled: false, label: '中转粘贴-剪切' }, // From 主脚本
    };

    // --- [ ☆ 运行时功能状态 ☆ ] ---
    let runtimeFeatureState = {};
    for (const key in FEATURES) {
        runtimeFeatureState[key] = FEATURES[key].enabled;
    }
    const isFeatureEnabled = (key) => !!runtimeFeatureState[key];

    // --- [ ☆ 配置项 ☆ ] ---
    const config = {
        cacheTTL: 3000,
        initDelay: 2000,
        selectors: {
            // From 副脚本 (modified/merged)
            originalInput: 'input[placeholder="搜索关键词"]:not([disabled])',
            domObserverTarget: 'div.search-wrap',
            tagElement: 'span.tag', // Used by both history panel tag click & copy tag
            tagClickArea: 'div.outliner-page', // Used by history panel tag click
            // From 主脚本 (retained)
            copyTagParentContainer: 'div.outliner-page',
        },
        sync: { // From 副脚本
            historySize: 30,
            mutationDebounce: 5,
            throttleTime: 30, // Main script uses 30, keep it
            activeItemBgColor: '#e9e8f9', // Temporary navigation highlight
            persistHighlightBgColor: '#ffe8cc', // Persistent highlight color (light orange)
            topBarId: 'custom-search-sync-container-v35', // Keep v35 prefix for consistency across features
            historyPanelId: 'search-history-panel-v35',
            historyListId: 'search-history-list-v35',
            simulatedClickRecoveryDelay: 1
        },
        select: { // From 主脚本
            popupId: 'mubu-select-search-popup-v35',
            popupText: '🔍',
            popupAboveGap: 5,
            fallbackWidth: 35,
            fallbackHeight: 22,
            popupAppearDelay: 50,
        },
        copyTag: { // From 主脚本
            popupId: 'mubu-copy-tag-popup-hover-v35',
            feedbackId: 'mubu-copy-tag-feedback-v35',
            copyIcon: '📋',
            copiedText: '✅ 已复制',
            popupMarginBottom: 0,
            hoverDelay: 10,
            hideDelay: 50,
            copiedMessageDuration: 500,
            tagSelector: 'span.tag', // Shared selector
            popupFallbackWidth: 25,
            popupFallbackHeight: 18,
            feedbackFallbackWidth: 60,
            feedbackFallbackHeight: 18,
        },
        transferPaste: { // From 主脚本
            editorContainerSelector: '#js-outliner',
            triggerButtonId: 'mu-transfer-copy-button-v35',
            cutButtonId: 'mu-transfer-cut-button-v35',
            pasteButtonId: 'mu-transfer-paste-button-v35',
            triggerButtonText: '📄',
            cutButtonText: '✂️',
            pasteButtonText: '📝',
            buttonHorizontalGap: 2,
            cssPrefix: 'mu-transfer-paste-v35-',
            btnBaseClass: 'btn-base',
            btnCopyClass: 'btn-copy',
            btnCutClass: 'btn-cut',
            btnPasteClass: 'btn-paste',
            buttonBaseStyleInline: {
                position: 'absolute', zIndex: '29998', top: '0', left: '0',
                opacity: '0', display: 'none', visibility: 'hidden',
            },
            initWaitMaxRetries: 15,
            initWaitRetryInterval: 700,
            buttonFallbackWidth: 35,
            buttonFallbackHeight: 22,
            buttonsAppearDelay: 50,
        },
        togglePanel: { // From 主脚本
            panelId: 'mubu-helper-toggle-panel-v35',
            triggerId: 'mubu-helper-toggle-trigger-v35',
            panelWidth: 160,
            triggerWidth: 20,
            triggerHeight: 230,
            hideDelay: 100,
        },
        pushContent: { // From 主脚本
            pushMarginLeft: 75,
            contentSelector: '#js-outliner',
            pushClass: 'mu-content-pushed-v37',
            transitionDuration: '0.1s'
        }
        // --- [ ☆ 配置项结束 ☆ ] ---
    };
    const BUTTON_GAP = config.transferPaste.buttonHorizontalGap;


    // --- [ ☆ rAF 样式批量处理 ☆ ] --- (Shared utility)
    let styleUpdateQueue = [];
    let isRafScheduled = false;
    function processStyleUpdates() { const tasksToProcess = [...styleUpdateQueue]; styleUpdateQueue = []; tasksToProcess.forEach(task => { if (task.element && task.element.isConnected) { try { Object.assign(task.element.style, task.styles); } catch (e) { console.warn('[Mubu Helper] Style apply err:', e, task.element); } } }); isRafScheduled = false; }
    function scheduleStyleUpdate(element, styles) { if (!element) return; styleUpdateQueue.push({ element, styles }); if (!isRafScheduled) { isRafScheduled = true; requestAnimationFrame(processStyleUpdates); } }

    // --- [ ☆ ResizeObserver 尺寸缓存 ☆ ] --- (Shared utility)
    const elementDimensionsCache = new WeakMap(); const elementObserverMap = new Map(); const resizeObserverCallback = (entries) => { for (let entry of entries) { let width = 0, height = 0; if (entry.borderBoxSize?.length > 0) { width = entry.borderBoxSize[0].inlineSize; height = entry.borderBoxSize[0].blockSize; } else if (entry.contentRect) { width = entry.contentRect.width; height = entry.contentRect.height; } if (width > 0 && height > 0) { elementDimensionsCache.set(entry.target, { width, height }); } else if (entry.target.offsetWidth > 0 && entry.target.offsetHeight > 0) { width = entry.target.offsetWidth; height = entry.target.offsetHeight; elementDimensionsCache.set(entry.target, { width, height }); } } }; const observerInstance = new ResizeObserver(resizeObserverCallback); function observeElementResize(element) { if (!element || elementObserverMap.has(element)) return; try { observerInstance.observe(element); elementObserverMap.set(element, observerInstance); } catch (e) { console.error('[Mubu Helper] RO observe err:', e, element); } } function unobserveElementResize(element) { if (!element || !elementObserverMap.has(element)) return; try { observerInstance.unobserve(element); elementObserverMap.delete(element); } catch (e) { console.error('[Mubu Helper] RO unobserve err:', e, element); } }

    // --- [ ☆ 内部状态与工具函数 ☆ ] ---
    // Search/History State (From 副脚本, merged)
    let originalInput = null, lastSyncedValue = null, isSyncing = false, domObserver = null, customInput = null;
    let originalInputSyncHandler = null, originalInputHistoryHandler = null;
    let topBarControls = { container: null, input: null, prevBtn: null, nextBtn: null, clearBtn: null };
    let historyPanel = null, historyListElement = null, activeHistoryItemElement = null;
    let isSimulatingClick = false; // From 副脚本 (for tag clicks)
    let persistHighlightedTerm = null; // From 副脚本
    let persistHighlightedIndex = null; // From 副脚本

    // Other Feature State (From 主脚本, retained)
    let popupElement = null; // Select Search
    let currentSelectedText = ''; // Select Search
    let ct_copyPopupElement = null, ct_feedbackElement = null, ct_currentHoveredTag = null, ct_currentTagText = ''; // Copy Tag
    let ct_showTimeout = null, ct_hideTimeout = null, ct_feedbackTimeout = null, ct_listenerTarget = null; // Copy Tag
    let tp_editorContainer = null, tp_storedHTML = '', tp_storedText = '', tp_ctrlApressed = false, tp_listenersAttached = false; // Transfer Paste
    let togglePanelElement = null, toggleTriggerElement = null, togglePanelHideTimeout = null; // Toggle Panel
    const tp_triggerButtonRef = { element: null }; const tp_cutButtonRef = { element: null }; const tp_pasteButtonRef = { element: null }; // Transfer Paste Buttons

    // Shared Utilities
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
    const inputEvent = new Event('input', { bubbles: true, cancelable: true });
    const debounce = (fn, delay) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn.apply(this, a), delay); }; };
    const throttle = (fn, delay) => { let l = 0, t; return (...a) => { const n = performance.now(); clearTimeout(t); if (n - l >= delay) { requestAnimationFrame(() => fn.apply(this, a)); l = n; } else { t = setTimeout(() => { requestAnimationFrame(() => fn.apply(this, a)); l = performance.now(); }, delay - (n - l)); } }; };
    const optimizedFindSearchBox = (() => { let c = null, l = 0; return () => { const n = performance.now(); if (c && c.isConnected && (n - l < config.cacheTTL)) { return c; } c = null; try { c = document.querySelector(config.selectors.originalInput); } catch (e) { c = null; } l = n; return c; } })();
    const docBody = document.body;

    // *** ADDED: Helper functions from 副脚本 for advanced history click ***
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    const simulateEscKeyPress = () => {
        try {
            const escEvent = new KeyboardEvent('keydown', {
                key: 'Escape', code: 'Escape', keyCode: 27, which: 27, bubbles: true, cancelable: true
            });
            document.body.dispatchEvent(escEvent);
            // console.log("[Simulate ESC] Dispatched ESC event."); // Optional log
        } catch (e) {
            console.error("[Simulate ESC] Error dispatching ESC event:", e);
        }
    };
    // *** END ADDED HELPERS ***

    // Event Listeners (Define shared listeners here)
    const historyNavPrevListener = () => handleHistoryNavigation(-1); // From 副脚本
    const historyNavNextListener = () => handleHistoryNavigation(1); // From 副脚本
    const clearBtnListener = () => handleClear(); // From 副脚本
    const customInputListener = () => handleCustomInputChange(); // From 副脚本
    const mouseDownPopupListener = (e) => handleMouseDownPopup(e); // From 主脚本
    const mouseUpPopupListener = (e) => handleMouseUpSelectionEnd(e); // From 主脚本

    // Helper Function (Determine if history needs tracking based on Sync or History Panel features)
    const isHistoryTrackingNeeded = () => isFeatureEnabled('syncSearchBox') || isFeatureEnabled('historyPanel'); // From 副脚本

    // 历史记录管理器模块 (From 副脚本 - v3.74.10 logic - Unchanged from original 主脚本 merge)
    const historyManager = (() => {
        const history = new Array(config.sync.historySize); let writeIndex = 0, count = 0, navIndex = -1;

        // *** MODIFIED: add function - Simplified, removed proactive clear/jump logic ***
        const add = (value) => {
            if (!isHistoryTrackingNeeded()) return false;
            const term = String(value).trim();
            if (!term) return false;

            // Standard history adding logic
            const lastAddedIdx = (writeIndex - 1 + config.sync.historySize) % config.sync.historySize;
            if (count > 0 && history[lastAddedIdx] === term) {
                navIndex = -1; // Reset nav index even if not adding, as input changed
                return false;
            }

            // --- Adjust existing persistHighlightedIndex if history is full ---
            if (count === config.sync.historySize && persistHighlightedIndex !== null) {
                if (persistHighlightedIndex === 0) {
                    // console.log(`[HistoryManager.add] 高亮项 (旧索引 0) 已被覆盖。清除状态。`); // Keep console log minimal
                    persistHighlightedTerm = null;
                    persistHighlightedIndex = null;
                } else {
                    persistHighlightedIndex--;
                    // console.log(`[HistoryManager.add] 旧条目被移除，调整持久高亮索引为: ${persistHighlightedIndex}`); // Keep console log minimal
                }
            }

            history[writeIndex] = term;
            writeIndex = (writeIndex + 1) % config.sync.historySize;
            count = Math.min(count + 1, config.sync.historySize);
            navIndex = -1; // Reset nav index after adding new item
            return true;
        };

        const get = (logicalIndex) => { if (!isHistoryTrackingNeeded() || logicalIndex < 0 || logicalIndex >= count) return null; const physicalIndex = (writeIndex - count + logicalIndex + config.sync.historySize) % config.sync.historySize; return history[physicalIndex]; };
        const size = () => isHistoryTrackingNeeded() ? count : 0;
        const getCurrentIndex = () => navIndex;
        const setCurrentIndex = (index) => { if (isHistoryTrackingNeeded()) navIndex = index; };
        const resetIndexToCurrent = () => { if (isHistoryTrackingNeeded()) navIndex = -1; };

        // *** MODIFIED: updatePanel (Apply Index+Term highlight, NO stale check needed) ***
        const updatePanel = () => {
            if (!isFeatureEnabled('historyPanel') || !historyPanel || !historyListElement) return;
            const scrollTop = historyListElement.scrollTop;
            historyListElement.innerHTML = '';
            const numItems = historyManager.size();
            if (numItems === 0) return;

            const currentNavIndex = historyManager.getCurrentIndex();
            let newlyActiveElement = null;
            let matchFoundForLastSyncedValue = false; // Track if current input value is highlighted
            const fragment = document.createDocumentFragment();

            for (let i = 0; i < numItems; i++) {
                const logicalIndex = numItems - 1 - i; // Render from newest (top) to oldest (bottom)
                const term = historyManager.get(logicalIndex);
                if (term !== null && term !== undefined) { // Check term exists
                    const li = document.createElement('li');
                    li.className = 'search-history-item';
                    li.textContent = term;
                    li.title = term;
                    li.dataset.term = term;
                    li.dataset.historyIndex = String(logicalIndex); // Ensure it's a string

                    // 应用临时高亮 (Navigation/Click or first match for current input)
                    if (logicalIndex === currentNavIndex) { // Priority 1: Explicitly selected by nav/click
                        li.classList.add('search-history-item--active');
                        newlyActiveElement = li; // Store the element that got active class via nav/click
                        matchFoundForLastSyncedValue = true; // Explicit selection counts as a match
                    } else if (currentNavIndex === -1 && !matchFoundForLastSyncedValue && term && lastSyncedValue && term === lastSyncedValue) {
                        // Priority 2: If nothing explicitly selected, highlight the first (newest) item matching the current input
                        li.classList.add('search-history-item--active');
                        // newlyActiveElement remains null here, as it wasn't explicitly selected
                        matchFoundForLastSyncedValue = true; // Mark that we found a match
                    }

                    // 应用持久高亮 (基于 Index + Term)
                    if (persistHighlightedIndex !== null && logicalIndex === persistHighlightedIndex && term === persistHighlightedTerm) {
                        li.classList.add('search-history-item--persist-highlight');
                    }

                    fragment.appendChild(li);
                }
            }
            historyListElement.appendChild(fragment);
            try { historyListElement.scrollTop = scrollTop; } catch (e) {/* ignore */ }
            activeHistoryItemElement = newlyActiveElement; // Update the reference to the explicitly selected item
        };
        return { add, get, size, getCurrentIndex, setCurrentIndex, resetIndexToCurrent, updatePanel };
    })();


    // --- [ ☆ Tag Click Simulation Logic ☆ ] ---
    // *** MODIFIED: Added skipVisibilityCheck parameter and logic from 副脚本 ***
    const findAndClickTag = (tagName, skipVisibilityCheck = false) => {
        if (!tagName || !tagName.startsWith('#')) {
            console.warn('[findAndClickTag] Invalid tagName provided:', tagName); // Keep warning
            return false;
        }
        const searchArea = document.querySelector(config.selectors.tagClickArea);
        if (!searchArea) {
            console.warn('[findAndClickTag] Tag click area not found:', config.selectors.tagClickArea); // Keep warning
            return false;
        }
        const tags = searchArea.querySelectorAll(config.selectors.tagElement);
        if (!tags || tags.length === 0) {
            // console.log('[findAndClickTag] No tag elements found in the click area.'); // Normal, can remove log
            return false;
        }
        let foundElement = null;
        const trimmedTagName = tagName.trim();
        for (const tagElement of tags) {
            if (tagElement.textContent.trim() === trimmedTagName) {
                // --- Visibility Check Logic (Copied from 副脚本) ---
                let isVisible = false;
                if (!skipVisibilityCheck) {
                    try {
                        // Basic check first (often sufficient and cheaper)
                        const basicVisible = tagElement.offsetParent !== null || tagElement.offsetWidth > 0 || tagElement.offsetHeight > 0;
                        // More robust check using getBoundingClientRect only if basic fails
                        const rect = tagElement.getBoundingClientRect();
                        const enhancedVisible = rect && rect.width > 0 && rect.height > 0;
                        isVisible = basicVisible || enhancedVisible;
                        // Debug log (can be removed)
                        // if (!isVisible) console.log(`[Tag Check] Tag "${trimmedTagName}" found but not visible. Basic: ${basicVisible}, Enhanced: ${enhancedVisible}, Rect:`, rect);
                    } catch (visError) {
                        console.error(`[findAndClickTag] Error during visibility check for "${trimmedTagName}":`, visError); // Keep error
                        isVisible = false; // Assume not visible on error
                    }
                } else {
                    isVisible = true; // Skip check if requested
                }
                // --- End Visibility Check ---

                if (isVisible) {
                    foundElement = tagElement;
                    break; // Found a suitable visible tag
                }
            }
        }
        if (foundElement) {
            isSimulatingClick = true; // Set flag before click
            try {
                foundElement.click();
                // console.log('[Mubu Helper] Simulated click on tag:', trimmedTagName); // Less verbose log
            } catch (e) {
                console.error('[Mubu Helper] Tag click simulation error:', e); // Keep error
                // Reset flag even on error, after a short delay
                setTimeout(() => { isSimulatingClick = false; }, config.sync.simulatedClickRecoveryDelay);
                return false; // Indicate failure
            } finally {
                // Reset flag after a short delay to allow potential event handlers to run
                setTimeout(() => { isSimulatingClick = false; }, config.sync.simulatedClickRecoveryDelay);
            }
            return true; // Indicate success
        } else {
            // console.log('[Mubu Helper] Visible tag not found for click simulation:', trimmedTagName); // Normal, can remove log
            return false; // Indicate tag not found or not visible
        }
    };


    // --- [ ☆ 同步与历史记录核心逻辑 ☆ ] --- (Unchanged from original 主脚本 merge)
    const runSynced = (action) => {
        if (!isFeatureEnabled('syncSearchBox') || isSyncing) return; // Only run if feature enabled and not already syncing
        isSyncing = true;
        try { action(); }
        finally { queueMicrotask(() => { isSyncing = false; }); } // Reset flag after action completes
    };

    // Updates custom input (if exists), adds to history, resets nav index if needed, updates panel
    const updateCustomInputAndAddHistory = (newValue, source = 'unknown') => {
        // Update custom input value if sync is enabled and value differs
        if (isFeatureEnabled('syncSearchBox') && customInput && customInput.value !== newValue) {
            customInput.value = newValue;
        }

        const oldValue = lastSyncedValue;
        const valueChanged = newValue !== oldValue;
        lastSyncedValue = newValue; // Always update the last known value

        let historyChanged = false;
        if (isHistoryTrackingNeeded()) {
            historyChanged = historyManager.add(newValue); // Calls the modified add
        }

        // Reset navigation index if the value changed *and* the change wasn't from navigation itself
        if (valueChanged && source !== 'navigation' && isHistoryTrackingNeeded() && isFeatureEnabled('historyPanel')) {
            // console.log(`[Mubu Helper] Value changed (source: ${source}), resetting nav index.`); // Keep console log minimal
            historyManager.resetIndexToCurrent();
        }

        // Update the history panel if the history actually changed OR the displayed value changed
        if (isFeatureEnabled('historyPanel') && (historyChanged || valueChanged)) {
            // console.log(`[Mubu Helper] Updating history panel. HistoryChanged: ${historyChanged}, ValueChanged: ${valueChanged}`); // Keep console log minimal
            historyManager.updatePanel();
        }
    };

    // Debounced function to find the original input and set it up or handle external changes
    const findAndSetupDebounced = debounce(() => {
        if (!isFeatureEnabled('syncSearchBox') && !isFeatureEnabled('historyPanel')) return; // Only run if relevant features are on

        const foundInput = optimizedFindSearchBox();

        if (foundInput) {
            const currentValue = foundInput.value;
            if (foundInput !== originalInput) {
                // Input element changed (e.g., page navigation, modal closed/opened)
                console.log('[Mubu Helper] Original search input instance changed.'); // Keep log
                teardownInputListeners(originalInput); // Clean up old listeners
                originalInput = foundInput; // Store new input
                setupInputListeners(originalInput); // Add listeners to new input
                updateCustomInputAndAddHistory(currentValue, 'observer_init'); // Sync initial value
                if (isFeatureEnabled('syncSearchBox') && customInput) { // Ensure custom input matches if sync on
                    customInput.value = lastSyncedValue ?? '';
                }
            } else if (currentValue !== lastSyncedValue && !isSyncing && !isSimulatingClick) {
                // Same input element, but value changed externally (e.g., browser autofill, another script)
                console.log(`[Mubu Helper] External change detected in original input. Value: "${currentValue}"`); // Keep log
                updateCustomInputAndAddHistory(currentValue, 'observer_external');
            }
            // else: Input found, but value hasn't changed or we are syncing/simulating - do nothing
        } else if (!foundInput && originalInput) {
            // Input element disappeared
            console.log('[Mubu Helper] Original search input disappeared.'); // Keep log
            teardownInputListeners(originalInput);
            originalInput = null;
            lastSyncedValue = null; // Clear last value as input is gone
            if (isFeatureEnabled('syncSearchBox')) {
                isSyncing = false; // Ensure sync flag is reset if input vanishes
            }
            // Optionally clear custom input? Maybe not, user might want to keep it.
            // if (isFeatureEnabled('syncSearchBox') && customInput) customInput.value = '';
            if (isFeatureEnabled('historyPanel')) historyManager.updatePanel(); // Update panel to remove active highlight if any
        }
        // else: Input not found, and wasn't found before - do nothing
    }, config.sync.mutationDebounce);


    // --- [ ☆ 中转粘贴 (Transfer Paste) 相关 ☆ ] --- (Unchanged from original 主脚本)
    const tp_hidePasteButton = () => { if (tp_pasteButtonRef.element) { scheduleStyleUpdate(tp_pasteButtonRef.element, { opacity: '0', visibility: 'hidden' }); setTimeout(() => { if (tp_pasteButtonRef.element?.style.opacity === '0') scheduleStyleUpdate(tp_pasteButtonRef.element, { display: 'none' }); }, 150); } }
    function getCursorRect(selection) { if (!selection || !selection.focusNode || selection.rangeCount === 0) { return null; } const range = document.createRange(); try { range.setStart(selection.focusNode, selection.focusOffset); range.setEnd(selection.focusNode, selection.focusOffset); const rect = range.getBoundingClientRect(); if (rect.width === 0 && rect.height === 0 && selection.toString().trim().length > 0) { const mainRange = selection.getRangeAt(0); const rects = mainRange.getClientRects(); return rects.length > 0 ? rects[rects.length - 1] : mainRange.getBoundingClientRect(); } return rect; } catch (e) { try { return selection.getRangeAt(0).getBoundingClientRect(); } catch { return null; } } }
    function tp_captureSelectionAndStore() { const selection = window.getSelection(); if (!selection || selection.isCollapsed || selection.rangeCount === 0) return false; try { const range = selection.getRangeAt(0); const tempDiv = document.createElement('div'); tempDiv.appendChild(range.cloneContents()); tp_storedHTML = tempDiv.innerHTML; tp_storedText = selection.toString(); console.log("[Mubu TP] Stored HTML:", tp_storedHTML.substring(0, 100) + "..."); return true; } catch (e) { console.error('[Mubu Helper TP] Capture err:', e); tp_storedHTML = ''; tp_storedText = ''; return false; } }
    function tp_isElementEditable(element) { if (!element) return false; if (element instanceof Element && element.closest) { if (element.closest('[contenteditable="true"], .mm-editor')) { return true; } } if (element instanceof HTMLElement && ['INPUT', 'TEXTAREA'].includes(element.tagName)) { return !element.readOnly && !element.disabled; } return false; }
    function tp_createButton(id, text, buttonClass, clickHandler) { const tpConfig = config.transferPaste; let existing = document.getElementById(id); if (existing) { existing.textContent = text; existing.removeEventListener('click', existing.__clickHandler__); existing.removeEventListener('mousedown', existing.__mousedownHandler__); } else { existing = document.createElement('button'); existing.id = id; existing.textContent = text; Object.assign(existing.style, tpConfig.buttonBaseStyleInline); document.body.appendChild(existing); } existing.className = ''; existing.classList.add(tpConfig.cssPrefix + tpConfig.btnBaseClass, tpConfig.cssPrefix + buttonClass); const mousedownHandler = (e) => e.stopPropagation(); const clickHandlerWrapper = (e) => { e.stopPropagation(); clickHandler(existing); }; existing.addEventListener('mousedown', mousedownHandler); existing.addEventListener('click', clickHandlerWrapper); existing.__clickHandler__ = clickHandlerWrapper; existing.__mousedownHandler__ = mousedownHandler; observeElementResize(existing); return existing; }
    function tp_showPasteButton(event) { const tpConfig = config.transferPaste; hideSelectionActionButtons(); tp_hidePasteButton(); if (!tp_storedHTML && !tp_storedText) return; const targetElement = event.target instanceof Node ? event.target : document.elementFromPoint(event.clientX, event.clientY); if (!tp_isElementEditable(targetElement)) { return; } const positionRect = { top: event.clientY, left: event.clientX, bottom: event.clientY, right: event.clientX, width: 0, height: 0 }; const positionButtonStandalone = (buttonElement, targetRect) => { try { if (!targetRect || !buttonElement || !buttonElement.isConnected) return false; const dims = elementDimensionsCache.get(buttonElement); const btnW = dims?.width || tpConfig.buttonFallbackWidth; const btnH = dims?.height || tpConfig.buttonFallbackHeight; const vpW = window.innerWidth; const scrollY = window.pageYOffset; const scrollX = window.pageXOffset; let top = scrollY + targetRect.top + 10; let left = scrollX + targetRect.left - btnW / 2; top = Math.max(scrollY + 5, top); left = Math.max(scrollX + 5, Math.min(left, scrollX + vpW - btnW - 5)); scheduleStyleUpdate(buttonElement, { transform: `translate(${left.toFixed(1)}px, ${top.toFixed(1)}px)`, display: 'inline-block', opacity: '1', visibility: 'visible' }); return true; } catch (e) { console.error('[Mubu Helper TP] Pos paste btn err:', e, buttonElement); if (buttonElement) scheduleStyleUpdate(buttonElement, { display: 'none', opacity: '0', visibility: 'hidden' }); return false; } }; tp_pasteButtonRef.element = tp_createButton(tpConfig.pasteButtonId, tpConfig.pasteButtonText, tpConfig.btnPasteClass, (button) => { const currentSel = window.getSelection(); const range = currentSel?.rangeCount > 0 ? currentSel.getRangeAt(0) : null; let pasteTarget = null; if (range) { pasteTarget = range.startContainer.nodeType === Node.ELEMENT_NODE ? range.startContainer : range.startContainer.parentElement; if (!tp_isElementEditable(pasteTarget)) { pasteTarget = document.elementFromPoint(event.clientX, event.clientY); } } else { pasteTarget = document.elementFromPoint(event.clientX, event.clientY); } if (!tp_isElementEditable(pasteTarget)) { alert('无法粘贴：位置不可编辑。'); tp_hidePasteButton(); return; } try { let success = false; if (tp_storedHTML && document.queryCommandSupported('insertHTML')) { try { if (range) { currentSel.removeAllRanges(); currentSel.addRange(range); } else { if (pasteTarget instanceof HTMLElement) pasteTarget.focus(); } console.log("[Mubu TP] Attempting insertHTML..."); if (document.execCommand('insertHTML', false, tp_storedHTML)) { success = true; console.log("[Mubu TP] insertHTML successful."); } else { console.warn('[Mubu TP] insertHTML failed.'); } } catch (e) { console.error('[Mubu TP] insertHTML err:', e); } } if (!success && tp_storedText && document.queryCommandSupported('insertText')) { try { if (range) { currentSel.removeAllRanges(); currentSel.addRange(range); } else { if (pasteTarget instanceof HTMLElement) pasteTarget.focus(); } console.log("[Mubu TP] Attempting insertText..."); if (document.execCommand('insertText', false, tp_storedText)) { success = true; console.log("[Mubu TP] insertText successful."); } else { console.warn('[Mubu TP] insertText failed.'); } } catch (e) { console.error('[Mubu TP] insertText err:', e); } } if (!success) { console.error('[Mubu TP] Paste failed using execCommand.'); alert('粘贴失败。请尝试手动 Ctrl+V。'); } else { console.log("[Mubu TP] Paste successful, clearing stored content."); tp_storedHTML = ''; tp_storedText = ''; } } catch (e) { console.error('[Mubu TP] Paste process err:', e); alert(`粘贴时出错: ${e.message}`); } finally { tp_hidePasteButton(); } }); if (!positionButtonStandalone(tp_pasteButtonRef.element, positionRect)) { tp_hidePasteButton(); } }

    // --- [ ☆ 复制标签 (Copy Tag) 相关 ☆ ] --- (Unchanged from original 主脚本)
    function calculateTransformForPopup(element, targetRect, marginBottom = 0) { if (!element || !targetRect || !element.isConnected) return null; const ctConfig = config.copyTag; const dims = elementDimensionsCache.get(element); let W, H; if (element === ct_copyPopupElement) { W = dims?.width || ctConfig.popupFallbackWidth; H = dims?.height || ctConfig.popupFallbackHeight; } else if (element === ct_feedbackElement) { W = dims?.width || ctConfig.feedbackFallbackWidth; H = dims?.height || ctConfig.feedbackFallbackHeight; } else { W = dims?.width || 30; H = dims?.height || 20; } const x = window.pageXOffset; const y = window.pageYOffset; const targetCenterX = targetRect.left + targetRect.width / 2; const top = y + targetRect.top - H - marginBottom; const left = x + targetCenterX - W / 2; return `translate(${left.toFixed(1)}px, ${top.toFixed(1)}px)`; }
    function ct_showCopyPopup(tagElement) { if (!isFeatureEnabled('copyTagOnHover')) return; ct_createElements(); if (!ct_copyPopupElement) return; if (!tagElement || !ct_copyPopupElement.isConnected) return; const tagText = tagElement.textContent?.trim(); if (!tagText) return; ct_currentTagText = tagText; const targetRect = tagElement.getBoundingClientRect(); const transform = calculateTransformForPopup(ct_copyPopupElement, targetRect, config.copyTag.popupMarginBottom); if (transform) { scheduleStyleUpdate(ct_copyPopupElement, { transform: transform, display: 'block', opacity: '1', visibility: 'visible' }); } else { console.warn("[CT] show copy popup: no transform"); scheduleStyleUpdate(ct_copyPopupElement, { transform: 'translate(0px, -20px)', display: 'block', opacity: '1', visibility: 'visible' }); } }
    function ct_hideCopyPopupImmediately(clearState = true) { clearTimeout(ct_showTimeout); ct_showTimeout = null; clearTimeout(ct_hideTimeout); ct_hideTimeout = null; if (ct_copyPopupElement?.isConnected) { scheduleStyleUpdate(ct_copyPopupElement, { opacity: '0', visibility: 'hidden' }); setTimeout(() => { if (ct_copyPopupElement?.style.opacity === '0') scheduleStyleUpdate(ct_copyPopupElement, { display: 'none' }); }, 150); } if (clearState) { ct_currentHoveredTag = null; ct_currentTagText = ''; } }
    function ct_scheduleHidePopup() { clearTimeout(ct_showTimeout); ct_showTimeout = null; clearTimeout(ct_hideTimeout); ct_hideTimeout = setTimeout(() => { const tagHover = ct_currentHoveredTag?.matches(':hover'); const popupHover = ct_copyPopupElement?.matches(':hover'); if (!tagHover && !popupHover) { ct_hideCopyPopupImmediately(true); } ct_hideTimeout = null; }, config.copyTag.hideDelay); }
    function ct_showFeedbackIndicator(tagElement) { if (!isFeatureEnabled('copyTagOnHover')) return; ct_createElements(); if (!ct_feedbackElement) { console.error("[CT] Feedback element not available."); return; } if (!tagElement || !ct_feedbackElement.isConnected) return; const duration = config.copyTag.copiedMessageDuration; clearTimeout(ct_feedbackTimeout); const targetRect = tagElement.getBoundingClientRect(); const transform = calculateTransformForPopup(ct_feedbackElement, targetRect, config.copyTag.popupMarginBottom); if (transform) { scheduleStyleUpdate(ct_feedbackElement, { transform: transform, display: 'block', opacity: '1', visibility: 'visible' }); } else { console.warn("[CT] feedback: no transform"); scheduleStyleUpdate(ct_feedbackElement, { transform: 'translate(0px, -20px)', display: 'block', opacity: '1', visibility: 'visible' }); } ct_feedbackTimeout = setTimeout(ct_hideFeedbackIndicator, duration); }
    function ct_hideFeedbackIndicator() { if (!ct_feedbackElement?.isConnected) return; scheduleStyleUpdate(ct_feedbackElement, { opacity: '0', visibility: 'hidden' }); setTimeout(() => { if (ct_feedbackElement?.style.opacity === '0') scheduleStyleUpdate(ct_feedbackElement, { display: 'none' }); }, 150); ct_feedbackTimeout = null; }


    // --- [ ☆ UI 创建函数 ☆ ] --- (Unchanged from original 主脚本)
    // Copy Tag Elements (From 主脚本 - Retained)
    function ct_createElements() { if (!isFeatureEnabled('copyTagOnHover')) return; const ctConf = config.copyTag; const baseStylePopup = { position: 'absolute', top: '0', left: '0', zIndex: '10010', display: 'none', opacity: '0', visibility: 'hidden' }; const baseStyleFeedback = { position: 'absolute', top: '0', left: '0', zIndex: '10011', display: 'none', opacity: '0', visibility: 'hidden', pointerEvents: 'none' }; let existingPopup = document.getElementById(ctConf.popupId); if (!ct_copyPopupElement && existingPopup) { ct_copyPopupElement = existingPopup; if (!elementObserverMap.has(ct_copyPopupElement)) observeElementResize(ct_copyPopupElement); } else if (!ct_copyPopupElement && !existingPopup) { const copyPopup = document.createElement('button'); copyPopup.id = ctConf.popupId; copyPopup.textContent = ctConf.copyIcon; Object.assign(copyPopup.style, baseStylePopup); copyPopup.addEventListener('click', ct_handleCopyButtonClick); copyPopup.addEventListener('mouseenter', () => { clearTimeout(ct_hideTimeout); ct_hideTimeout = null; }); copyPopup.addEventListener('mouseleave', ct_scheduleHidePopup); copyPopup.addEventListener('mousedown', (e) => { e.preventDefault(); e.stopPropagation(); }); document.body.appendChild(copyPopup); ct_copyPopupElement = copyPopup; observeElementResize(ct_copyPopupElement); } let existingFeedback = document.getElementById(ctConf.feedbackId); if (!ct_feedbackElement && existingFeedback) { ct_feedbackElement = existingFeedback; if (!elementObserverMap.has(ct_feedbackElement)) observeElementResize(ct_feedbackElement); } else if (!ct_feedbackElement && !existingFeedback) { const feedback = document.createElement('div'); feedback.id = ctConf.feedbackId; feedback.textContent = ctConf.copiedText; Object.assign(feedback.style, baseStyleFeedback); document.body.appendChild(feedback); ct_feedbackElement = feedback; observeElementResize(ct_feedbackElement); } }
    // Control Panel (Top Search Bar - From 副脚本 - Retained)
    function createControlPanel() { if (document.getElementById(config.sync.topBarId)) return topBarControls; try { const c = document.createElement('div'); c.id = config.sync.topBarId; c.style.display = 'none'; const l = document.createElement('button'); l.className = 'clear-btn'; l.textContent = '✕'; l.title = '清空'; const p = document.createElement('button'); p.className = 'history-btn'; p.textContent = '←'; p.title = '上条'; const n = document.createElement('button'); n.className = 'history-btn'; n.textContent = '→'; n.title = '下条'; const i = document.createElement('input'); i.className = 'custom-search-input'; i.type = 'search'; i.placeholder = '筛选'; i.setAttribute('autocomplete', 'off'); c.append(l, p, n, i); document.body.appendChild(c); topBarControls = { container: c, input: i, prevBtn: p, nextBtn: n, clearBtn: l }; observeElementResize(c); return topBarControls; } catch (e) { console.error('[Mubu] Create top bar err:', e); topBarControls = { container: null, input: null, prevBtn: null, nextBtn: null, clearBtn: null }; return topBarControls; } } // Added default return
    // History Panel (Left Sidebar - From 副脚本 - Retained)
    function createHistoryPanel() { if (document.getElementById(config.sync.historyPanelId)) return historyPanel; try { const p = document.createElement('div'); p.id = config.sync.historyPanelId; p.style.display = 'none'; const l = document.createElement('ul'); l.className = 'search-history-list'; l.id = config.sync.historyListId; p.appendChild(l); document.body.appendChild(p); historyPanel = p; historyListElement = l; observeElementResize(p); return p; } catch (e) { console.error('[Mubu] Create hist panel err:', e); historyPanel = null; historyListElement = null; return null; } }
    // Select Popup (Filter Button - From 主脚本 - Retained)
    function createSelectPopup() { if (!isFeatureEnabled('selectSearchPopup')) return; const popupId = config.select.popupId; let existing = document.getElementById(popupId); if (existing) { popupElement = existing; if (!elementObserverMap.has(popupElement)) observeElementResize(popupElement); Object.assign(popupElement.style, { display: 'none', opacity: '0', visibility: 'hidden' }); if (!existing.__clickAttached__) { existing.addEventListener('mousedown', handlePopupClick); existing.addEventListener('click', (e) => e.stopPropagation()); existing.__clickAttached__ = true; } return; } try { const btn = document.createElement('button'); btn.id = popupId; btn.textContent = config.select.popupText; Object.assign(btn.style, { position: 'absolute', top: '0', left: '0', zIndex: '10010', display: 'none', opacity: '0', visibility: 'hidden', }); btn.classList.add('mu-select-popup-btn'); btn.addEventListener('mousedown', handlePopupClick); btn.addEventListener('click', (e) => e.stopPropagation()); btn.__clickAttached__ = true; document.body.appendChild(btn); popupElement = btn; observeElementResize(popupElement); } catch (e) { console.error('[Mubu SS] Create popup err:', e); popupElement = null; } }

    // --- [ ☆ 事件处理函数 ☆ ] ---

    // Sync Search / History Handlers (Unchanged from original 主脚本 merge)
    function syncFromOriginal(sourceInput) {
        if (!isFeatureEnabled('syncSearchBox') || !sourceInput || isSyncing || isSimulatingClick) return; // Check flags
        const val = sourceInput.value;
        if (val === lastSyncedValue) return;
        runSynced(() => { updateCustomInputAndAddHistory(val, 'sync_from_original'); });
    }

    function syncToOriginal(options = { updateHistory: true }) {
        if (!isFeatureEnabled('syncSearchBox') || !originalInput || !customInput || !nativeInputValueSetter) return;
        const val = customInput.value;
        runSynced(() => {
            if (originalInput.value !== val) {
                nativeInputValueSetter.call(originalInput, val);
                originalInput.dispatchEvent(inputEvent);
            }
            // Update history/panel based on option
            if (options.updateHistory) {
                updateCustomInputAndAddHistory(val, 'sync_to_original'); // This updates history AND panel
            } else {
                // Only update internal state and panel visual, not history list
                lastSyncedValue = val;
                historyManager.resetIndexToCurrent(); // Reset nav index when clearing without adding history
                if (isFeatureEnabled('historyPanel')) historyManager.updatePanel();
            }
        });
    }

    // Listener for original input when sync is ON
    function handleOriginalInputForSync(event) {
        if (!event.isTrusted || !isFeatureEnabled('syncSearchBox') || isSyncing || isSimulatingClick) return; // Check flags
        syncFromOriginal(event.target);
    }

    // Listener for original input when sync is OFF but history panel is ON
    function handleOriginalInputForHistory(event) {
        if (!event.isTrusted || isFeatureEnabled('syncSearchBox') || !isFeatureEnabled('historyPanel') || !isHistoryTrackingNeeded() || isSyncing || isSimulatingClick) return; // Check flags
        const val = event.target.value;
        if (val === lastSyncedValue) return;
        updateCustomInputAndAddHistory(val, 'input_external'); // Add to history, update panel
    }

    // Listener for the custom search input
    function handleCustomInputChange() {
        if (!isFeatureEnabled('syncSearchBox') || isSyncing || isSimulatingClick) return; // Check flags
        syncToOriginal(); // Sync to original, which also calls updateCustomInputAndAddHistory
    }

    // *** REPLACED: handleHistoryListClick with the advanced async logic from 副脚本 ***
    async function handleHistoryListClick(event) {
        // console.log("[HistoryClick] Async handler triggered."); // Debug log
        if (!isFeatureEnabled('historyPanel')) { return; }
        const item = event.target.closest('.search-history-item');
        if (!item) { return; }

        let term, idxStr, idx;
        try {
            term = item.dataset.term;
            idxStr = item.dataset.historyIndex;
            if (term === undefined || idxStr === undefined) {
                 console.warn("[HistoryClick] Clicked item missing term or index data."); // Keep warning
                 return;
            }
            idx = parseInt(idxStr, 10);
            if (isNaN(idx)) {
                 console.warn("[HistoryClick] Invalid history index:", idxStr); // Keep warning
                 return;
            }
        } catch (e) { console.error('[Mubu Helper] Error getting term/index from dataset:', e); return; } // Keep error

        // --- Update UI State (Immediate) ---
        // Handles the temporary '--active' highlight and internal state
        try {
            // Remove active class from previously active element (if different)
            if (activeHistoryItemElement && activeHistoryItemElement !== item && activeHistoryItemElement.isConnected) {
                activeHistoryItemElement.classList.remove('search-history-item--active');
            }
            // Add active class to the clicked item (if not already active)
            if (!item.classList.contains('search-history-item--active')) {
                item.classList.add('search-history-item--active');
            }
            activeHistoryItemElement = item; // Update the reference

            // Update history manager state
            if (isHistoryTrackingNeeded()) {
                historyManager.setCurrentIndex(idx);
                lastSyncedValue = term; // Important: Update lastSyncedValue immediately
                historyManager.updatePanel(); // Refresh panel to reflect potential state changes (like nav index)
                // console.log(`[HistoryClick] State updated: Index=${idx}, Value="${term}"`); // Debug log
            }
        } catch (e) { console.warn("[HistoryClick] Error updating UI state:", e); /* Ignore state update errors, proceed with action */ } // Keep warning

        // --- Action Functions (Scoped to this handler) ---
        const performTagClick = (attempt, skipVisibilityCheck = false) => {
             if (term && term.startsWith('#')) {
                 // console.log(`[HistoryClick Attempt ${attempt}] Trying tag click for "${term}" (skipVisibility: ${skipVisibilityCheck})...`); // Debug log
                 const success = findAndClickTag(term, skipVisibilityCheck); // Use the modified findAndClickTag
                 if (success) {
                    // Ensure custom input matches, even if original doesn't update automatically
                    if (isFeatureEnabled('syncSearchBox') && customInput && customInput.value !== term) {
                        customInput.value = term;
                    }
                    // Focus the input for better UX after tag click
                    const inputForFocus = optimizedFindSearchBox();
                    if(inputForFocus) try { inputForFocus.focus(); } catch(e){ console.warn(`[HistoryClick Attempt ${attempt}] Error focusing after tag click:`, e); } // Keep warn
                    lastSyncedValue = term; // Re-affirm last synced value
                    historyManager.updatePanel(); // Update panel again after successful action
                    // console.log(`[HistoryClick Attempt ${attempt}] Tag click SUCCESS.`); // Debug log
                    return true; // Indicate success
                } else {
                    // console.log(`[HistoryClick Attempt ${attempt}] Tag click FAILED.`); // Debug log
                }
            }
            // console.log(`[HistoryClick Attempt ${attempt}] Not a tag or click failed.`); // Debug log
            return false; // Not a tag or click failed
        };

        const performDefaultSearch = (inputElement) => {
            // console.log(`[DefaultSearch] Attempting default search for "${term}"...`); // Debug log
            if (isSimulatingClick) { // Re-check flag just before action
                console.warn("[DefaultSearch] Skipping default search: Simulation flag is still active."); // Keep warning
                return false;
            }
            let success = false;
            if (inputElement && nativeInputValueSetter && term !== undefined) {
                if (inputElement.value !== term) {
                    // console.log(`[DefaultSearch] Input value differs, setting value.`); // Debug log
                    isSyncing = true; // Set flag for direct input manipulation
                    try {
                        nativeInputValueSetter.call(inputElement, term);
                        inputElement.dispatchEvent(inputEvent);
                        if (isFeatureEnabled('syncSearchBox') && customInput && customInput.value !== term) {
                            customInput.value = term; // Sync custom input too
                        }
                        success = true;
                         console.log(`[DefaultSearch] Input value set successfully.`); // Keep log
                    } catch (error) {
                        console.error('[Mubu Helper] Error during default search value setting:', error); // Keep error
                    } finally {
                        queueMicrotask(() => { isSyncing = false; }); // Reset flag after microtask
                    }
                } else {
                    // console.log(`[DefaultSearch] Input value already matches.`); // Debug log
                    success = true; // Value already correct, consider it successful
                }
                 // Focus the input after setting value or if value matched
                 try {
                     if (document.activeElement !== inputElement) {
                         inputElement.focus();
                         // console.log(`[DefaultSearch] Input focused.`); // Debug log
                     }
                 } catch(fe) {
                      console.warn("[DefaultSearch] Error focusing input:", fe); // Keep warn
                 }
            } else {
                 console.warn("[DefaultSearch] Cannot perform default search: Input/Setter/Term missing.", { hasInput: !!inputElement, hasSetter: !!nativeInputValueSetter, term: term }); // Keep important warning
            }
            lastSyncedValue = term; // Ensure state matches
            historyManager.updatePanel(); // Update panel after action
            // console.log(`[DefaultSearch] Action completed. Success: ${success}`); // Debug log
            return success;
        };

        // --- STEP 1: Immediate Tag Click Attempt (Standard Visibility Check) ---
        if (performTagClick(1, false)) {
            console.log("[HistoryClick Flow] Step 1: Initial tag click successful."); // Keep log
            return; // Action completed
        }
        console.log("[HistoryClick Flow] Step 1: Initial tag click failed or not a tag."); // Keep log

        // --- STEP 2: First Tag Click Failed - Simulate ESC, Wait 1ms, Try Tag Click Again ---
        console.log("[HistoryClick Flow] Step 2: Simulating ESC and retrying tag click..."); // Keep log
        simulateEscKeyPress();
        await delay(1); // Minimal delay
        if (performTagClick(2, false)) {
            console.log("[HistoryClick Flow] Step 2: Tag click successful after ESC."); // Keep log
            return; // Action completed
        }
        console.log("[HistoryClick Flow] Step 2: Tag click failed after ESC."); // Keep log

        // --- STEP 3: Second Tag Click Failed - Perform Default Search ---
        console.log("[HistoryClick Flow] Step 3: Falling back to default search action."); // Keep log
        const targetInputForDefaultSearch = optimizedFindSearchBox();
        let defaultSearchWasPerformed = false;
        if (targetInputForDefaultSearch) {
             defaultSearchWasPerformed = performDefaultSearch(targetInputForDefaultSearch);
             if (!defaultSearchWasPerformed) {
                 console.warn("[HistoryClick Flow] Step 3: Default search action failed or was skipped."); // Keep warning
                 // Potentially stop here if default search is critical and failed? Or continue to final focus?
                 // Let's continue to the delayed check/focus for robustness.
             } else {
                 console.log("[HistoryClick Flow] Step 3: Default search action performed."); // Keep log
             }
        } else {
             console.warn("[HistoryClick Flow] Step 3: Cannot perform default search: Original input not found."); // Keep warning
             return; // Can't proceed without input
        }

        // --- STEP 4 & 5: Schedule Delayed (420ms) Tag Re-Check (Attempt 3 - Skip Visibility) and Final Focus ---
        // This runs regardless of defaultSearchWasPerformed success, but only tries tag click if it's a tag term.
        const isTagTerm = term && term.startsWith('#');
        if (isTagTerm) {
            console.log("[HistoryClick Flow] Step 4: Scheduling delayed tag check (skip visibility)."); // Keep log
        } else {
            console.log("[HistoryClick Flow] Step 4: Scheduling delayed final focus (not a tag term)."); // Keep log
        }

        await delay(430); // Wait for potential UI updates after default search

        let delayedTagClickSuccess = false;
        if (isTagTerm) {
            delayedTagClickSuccess = performTagClick(3, true); // Attempt 3: Skip visibility check
            if (delayedTagClickSuccess) {
                 console.log("[HistoryClick Flow] Step 4: Delayed tag click successful."); // Keep log
            } else {
                 console.log("[HistoryClick Flow] Step 4: Delayed tag click failed."); // Keep log
            }
        }

        // --- Step 5: Final Focus (if delayed tag click didn't happen or failed) ---
        if (!delayedTagClickSuccess) {
            console.log("[HistoryClick Flow] Step 5: Attempting final focus on original input."); // Keep log
            const finalTargetInput = optimizedFindSearchBox();
            if (finalTargetInput) {
                try {
                    // Only focus if it's not already the active element
                    if (document.activeElement !== finalTargetInput) {
                        finalTargetInput.focus();
                        console.log("[HistoryClick Flow] Step 5: Final focus successful."); // Keep log
                    } else {
                        console.log("[HistoryClick Flow] Step 5: Input already focused."); // Keep log
                    }
                } catch (fe) {
                    console.warn("[HistoryClick Flow] Step 5: Error during final focus:", fe); // Keep warning
                }
            } else {
                 console.warn("[HistoryClick Flow] Step 5: Could not find original input for final focus."); // Keep warning
            }
        }
        console.log("[HistoryClick Flow] Click handling complete."); // Keep log
    }

    // *** NEW Helper Function: Toggle Persistent Highlight Logic *** (Unchanged from original 主脚本 merge)
    function togglePersistentHighlight(itemElement, term, logicalIndex) {
        if (!itemElement || term === undefined || isNaN(logicalIndex)) {
            console.warn("[ToggleHighlight] Invalid arguments provided.");
            return false; // Indicate failure or invalid input
        }
        // console.log(`[ToggleHighlight] Attempting toggle for Term: "${term}", Index: ${logicalIndex}`, itemElement); // Less verbose

        // Find any *currently* highlighted item (if one exists)
        const previouslyHighlightedElement = historyListElement?.querySelector('.search-history-item--persist-highlight');

        // Check if the target item is the *exact* one currently persisted (by index AND term)
        if (persistHighlightedIndex === logicalIndex && persistHighlightedTerm === term) {
            // It IS the currently persistent one. Toggle it OFF.
            // console.log(`[ToggleHighlight] Item is the currently persistent one. Removing class...`); // Less verbose
            itemElement.classList.remove('search-history-item--persist-highlight');
            persistHighlightedTerm = null;
            persistHighlightedIndex = null;
            // console.log(`[ToggleHighlight] Removed persistent highlight. State cleared.`); // Less verbose
        } else {
            // It's a different item, or no item was persistent before. Toggle it ON.
            // console.log(`[ToggleHighlight] Item is new or different instance. Setting persistent highlight...`); // Less verbose
            // 1. Remove highlight from any *other* item that might have had it
            if (previouslyHighlightedElement && previouslyHighlightedElement !== itemElement && previouslyHighlightedElement.isConnected) {
                try { previouslyHighlightedElement.classList.remove('search-history-item--persist-highlight'); } catch(e){}
                // console.log(`[ToggleHighlight] Removed persistent highlight from previous item:`, previouslyHighlightedElement); // Less verbose
            }
            // 2. Add highlight to the target item
            itemElement.classList.add('search-history-item--persist-highlight');
            // 3. Update state to remember which item is now persistent
            persistHighlightedTerm = term;
            persistHighlightedIndex = logicalIndex; // Store the specific index of the clicked item
            // console.log(`[ToggleHighlight] Added persistent highlight for term "${term}" at index ${logicalIndex}. State updated.`); // Less verbose
        }
        // console.log(`[ToggleHighlight] Target item classList after operation:`, itemElement.classList); // Debug log
        return true; // Indicate success
    }

    // *** handleHistoryListDblClick (Uses new helper for persistent highlight) *** (Unchanged from original 主脚本 merge)
    function handleHistoryListDblClick(event) {
        // console.log("[HistDblClick] Event triggered."); // Debug log
        if (!isFeatureEnabled('historyPanel') || !historyListElement) { return; }
        const item = event.target.closest('.search-history-item');
        if (!item) { return; }
        const term = item.dataset.term;
        const idxStr = item.dataset.historyIndex;
        if (term === undefined || idxStr === undefined) { return; }
        const idx = parseInt(idxStr, 10);
        if (isNaN(idx)) { return; }

        // console.log(`[HistDblClick] Double-clicked on item: Term: "${term}", Index: ${idx}`); // Debug log

        // Call the shared toggle logic
        togglePersistentHighlight(item, term, idx);

        // No updatePanel call needed, direct DOM manipulation is sufficient.
    }

    // *** handleHistoryNavigation (Calls updatePanel, includes scrollIntoView) *** (Unchanged from original 主脚本 merge)
    function handleHistoryNavigation(direction) {
        throttle((dir) => {
            if ((!isFeatureEnabled('syncSearchBox') && !isFeatureEnabled('historyPanel')) || !isHistoryTrackingNeeded()) {
                // console.log("[Nav] Aborted: Feature disabled or no history tracking needed."); // Less verbose
                return;
            }
            const size = historyManager.size();
            if (size === 0) {
                // console.log("[Nav] Aborted: History empty."); // Less verbose
                return;
            }

            let currentActualIndex = historyManager.getCurrentIndex(); // Current selected index (-1 if none)
            let referenceIndex = currentActualIndex; // Index to navigate FROM

            // If nothing is selected (-1), try to find the current input value in history to use as a starting point
            if (referenceIndex === -1 && lastSyncedValue) {
                let matchedIndex = -1;
                // Search from newest to oldest for the current value
                for (let i = 0; i < size; i++) {
                    const logicalIndex = size - 1 - i; // Newest first
                    const term = historyManager.get(logicalIndex);
                    if (term === lastSyncedValue) {
                        matchedIndex = logicalIndex;
                        break; // Found the newest match
                    }
                }
                if (matchedIndex !== -1) {
                    referenceIndex = matchedIndex; // Start navigation from this matched index
                    // console.log(`[Nav] Starting navigation from matched index ${referenceIndex} for value "${lastSyncedValue}"`); // Less verbose
                } else {
                    // console.log(`[Nav] Current value "${lastSyncedValue}" not found in history, starting from boundary.`); // Less verbose
                }
            } else {
                // console.log(`[Nav] Starting navigation from current index ${referenceIndex}.`); // Less verbose
            }


            // Calculate the next potential index based on direction
            let nextIdx;
            if (referenceIndex === -1) {
                // If no starting point (either nothing selected or current value not in history)
                nextIdx = (dir === -1) ? size - 1 : -1; // Prev -> Go to newest item (size-1); Next -> Stay at -1 (or could go to oldest: 0)
                // console.log(`[Nav] No reference index. Dir ${dir} -> next potential index: ${nextIdx}`); // Less verbose
            } else {
                // Navigate relative to the reference index
                nextIdx = referenceIndex + dir;
                // console.log(`[Nav] Has reference index ${referenceIndex}. Dir ${dir} -> next potential index: ${nextIdx}`); // Less verbose
            }

            // Clamp the index within valid bounds: -1 (no selection) to size-1 (oldest item)
            nextIdx = Math.max(-1, Math.min(nextIdx, size - 1));
            // console.log(`[Nav] Clamped next index: ${nextIdx}`); // Less verbose

            // If the calculated index is the same as the current index (and it wasn't -1), do nothing
            if (nextIdx === currentActualIndex && currentActualIndex !== -1) {
                // console.log(`[Nav] No change in index (${nextIdx}). Aborting.`); // Less verbose
                return;
            }

            // Update the history manager's current index
            historyManager.setCurrentIndex(nextIdx);
            const valueBeforeNav = lastSyncedValue; // Remember value before nav might change it

            // Determine the value to put in the search box
            // If nextIdx is -1, revert to the value *before* navigation started (or empty string)
            // Otherwise, get the value from the history at the new index
            const navigatedValue = (nextIdx === -1) ? (valueBeforeNav ?? '') : (historyManager.get(nextIdx) ?? '');
            // console.log(`[Nav] Navigated index: ${nextIdx}. Value to set: "${navigatedValue}"`); // Less verbose


            // --- Perform Actions (Input Update, Tag Click) ---
            let clickHandledByTag = false;
            if (navigatedValue.startsWith('#')) {
                // console.log("[Nav] Attempting tag click simulation for:", navigatedValue); // Less verbose
                // Use the modified findAndClickTag (without skipVisibilityCheck for navigation)
                clickHandledByTag = findAndClickTag(navigatedValue, false);
            }

            runSynced(() => { // Use runSynced if modifying originalInput potentially
                const targetInput = optimizedFindSearchBox();

                if (clickHandledByTag) {
                    // console.log("[Nav] Tag click successful. Updating lastSyncedValue."); // Less verbose
                    // Tag was clicked successfully. Update internal state.
                    lastSyncedValue = navigatedValue; // Update state to navigated value
                    // Ensure custom input reflects the tag, even if original input doesn't update immediately
                    if (isFeatureEnabled('syncSearchBox') && customInput && customInput.value !== navigatedValue) {
                        customInput.value = navigatedValue;
                        // console.log("[Nav] Custom input updated to tag value."); // Less verbose
                    }
                    // Focus original input for better UX
                    if (targetInput) { try { targetInput.focus(); } catch (e) { } }

                } else {
                    // console.log("[Nav] Not a tag or tag click failed. Updating inputs directly."); // Less verbose
                    // Not a tag, or tag click failed. Update inputs directly.
                    // Update custom input first (if sync enabled)
                    if (isFeatureEnabled('syncSearchBox') && customInput && customInput.value !== navigatedValue) {
                        customInput.value = navigatedValue;
                        // console.log("[Nav] Custom input updated directly."); // Less verbose
                    }
                    // Update original input
                    if (targetInput && nativeInputValueSetter) {
                        if (targetInput.value !== navigatedValue) {
                            nativeInputValueSetter.call(targetInput, navigatedValue);
                            targetInput.dispatchEvent(inputEvent);
                            // console.log("[Nav] Original input updated via native setter."); // Less verbose
                        }
                        // Focus original input
                        try { targetInput.focus(); } catch (e) { }
                    } else if (!targetInput) {
                        console.warn("[Nav] Native input not found for fallback sync."); // Keep warn
                    }
                    // Update internal state *after* updating inputs
                    lastSyncedValue = navigatedValue;
                }

                // Finally, update the history panel display (highlighting)
                if (isFeatureEnabled('historyPanel')) {
                    // console.log("[Nav] Updating history panel."); // Less verbose
                    historyManager.updatePanel();
                    // *** Scroll into view logic (Retained from original 主脚本) ***
                    const activeItem = historyListElement?.querySelector('.search-history-item--active');
                    if (activeItem) {
                        try {
                            activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        } catch (scrollError) {
                            console.warn("[Mubu Helper Nav] Smooth scroll failed, trying basic scroll:", scrollError); // Keep warn
                            try { activeItem.scrollIntoView({ block: 'nearest' }); } catch (e) { }
                        }
                    }
                    // *** End Scroll into view logic ***
                }
            }); // End runSynced

        }, config.sync.throttleTime)(direction); // Apply throttle
    }


    // *** NEW: Handle Ctrl+A for History Item Highlight Toggle *** (Unchanged from original 主脚本 merge)
    function handleHistoryItemHighlightKey(event) {
        // Check if Ctrl+A (or Cmd+A on Mac) is pressed
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'a') {
            // Check if history panel is enabled and the list element exists
            if (!isFeatureEnabled('historyPanel') || !historyListElement) {
                return;
            }

            // Find if the mouse is currently hovering over a history item
            const hoveredItem = historyListElement.querySelector('.search-history-item:hover');

            if (hoveredItem) {
                // console.log('[HistKeyHighlight] Ctrl+A pressed while hovering history item:', hoveredItem); // Debug log
                // Prevent the default Ctrl+A behavior (e.g., select all text)
                event.preventDefault();
                event.stopPropagation();

                // Get item data
                const term = hoveredItem.dataset.term;
                const idxStr = hoveredItem.dataset.historyIndex;
                if (term === undefined || idxStr === undefined) {
                    console.warn('[HistKeyHighlight] Hovered item missing data attributes.'); // Keep warn
                    return;
                }
                const idx = parseInt(idxStr, 10);
                if (isNaN(idx)) {
                    console.warn('[HistKeyHighlight] Invalid index on hovered item.'); // Keep warn
                    return;
                }

                // Call the shared toggle logic
                togglePersistentHighlight(hoveredItem, term, idx);
            }
            // If not hovering over a history item, do nothing and allow default Ctrl+A behavior
        }
    }

    // *** handleClear (Calls updatePanel) *** (Unchanged from original 主脚本 merge)
    function handleClear() {
        if (!isFeatureEnabled('syncSearchBox')) return; // Only works if sync box is enabled
        if (!customInput) return;

        const targetInput = optimizedFindSearchBox(); // Find the input to potentially clear

        // Case 1: Custom input is already empty. Try to clear the original input if it's not empty.
        if (customInput.value === '') {
            if (targetInput && targetInput.value !== '') {
                // console.log("[Clear] Custom empty, clearing original input."); // Less verbose
                runSynced(() => {
                    if (nativeInputValueSetter) {
                        nativeInputValueSetter.call(targetInput, ''); // Clear original input
                        targetInput.dispatchEvent(inputEvent); // Trigger its events
                    }
                    lastSyncedValue = ''; // Update internal state
                    historyManager.resetIndexToCurrent(); // Reset nav index
                    persistHighlightedTerm = null; // Clear persistent highlight on clear
                    persistHighlightedIndex = null;
                    if (isFeatureEnabled('historyPanel')) historyManager.updatePanel(); // Update panel display
                });
            } else {
                // console.log("[Clear] Both inputs already empty."); // Less verbose
            }
            return; // Done
        };

        // Case 2: Custom input is not empty. Clear it and sync to original.
        // console.log("[Clear] Clearing custom input and syncing."); // Less verbose
        customInput.value = '';
        // Sync to original, but DO NOT add the empty string to history
        syncToOriginal({ updateHistory: false });

        // Clear persistent highlight state when clearing the input
        persistHighlightedTerm = null;
        persistHighlightedIndex = null;

        // Update panel (syncToOriginal with updateHistory:false already calls updatePanel if needed)
        if(isFeatureEnabled('historyPanel')) historyManager.updatePanel();
    }

    // Input Listener Setup/Teardown (Unchanged from original 主脚本 merge)
    function setupInputListeners(targetInput) {
        if (!targetInput) { return; }
        teardownInputListeners(targetInput); // Remove any existing listeners first

        // Decide which listener to add based on enabled features
        if (isFeatureEnabled('syncSearchBox') && customInput) {
            // If sync is enabled, use the sync handler (which also handles history implicitly via runSynced/update...)
            originalInputSyncHandler = handleOriginalInputForSync;
            targetInput.addEventListener('input', originalInputSyncHandler, { passive: true });
            // console.log("[Listeners] Attached SYNC listener to original input."); // Less verbose
        } else if (isFeatureEnabled('historyPanel') && isHistoryTrackingNeeded()) {
            // If sync is OFF, but history panel is ON, use the history-only handler
            originalInputHistoryHandler = handleOriginalInputForHistory;
            targetInput.addEventListener('input', originalInputHistoryHandler, { passive: true });
            // console.log("[Listeners] Attached HISTORY listener to original input."); // Less verbose
        } else {
            // console.log("[Listeners] No listeners attached to original input (Sync and HistoryPanel are off or no custom input)."); // Less verbose
        }
    }
    function teardownInputListeners(targetInput) {
        if (!targetInput) return;
        if (originalInputSyncHandler) {
            try { targetInput.removeEventListener('input', originalInputSyncHandler); } catch (e) { }
            // console.log("[Listeners] Removed SYNC listener."); // Less verbose
        }
        if (originalInputHistoryHandler) {
            try { targetInput.removeEventListener('input', originalInputHistoryHandler); } catch (e) { }
            // console.log("[Listeners] Removed HISTORY listener."); // Less verbose
        }
        originalInputSyncHandler = null;
        originalInputHistoryHandler = null;
    }


    // Select Search Popup Handlers (Unchanged from original 主脚本)
    function handlePopupClick(event) {
        if (!isFeatureEnabled('selectSearchPopup')) return;
        event.preventDefault(); // Prevent potential text deselection
        event.stopPropagation();
        const term = currentSelectedText; // Get text stored on mouseup
        if (!term) {
            hideSelectionActionButtons();
            return;
        }
        console.log("[SelectPopup] Filter button clicked for term:", term); // Keep log
        const targetInput = optimizedFindSearchBox();
        if (targetInput && nativeInputValueSetter) {
            try {
                nativeInputValueSetter.call(targetInput, term); // Set value
                targetInput.dispatchEvent(inputEvent); // Trigger input event
                targetInput.focus(); // Focus the input
                // Update history/sync state IF those features are enabled
                if (isHistoryTrackingNeeded() || isFeatureEnabled('syncSearchBox')) {
                    updateCustomInputAndAddHistory(term, 'select_popup');
                }
            } catch (error) {
                console.error("[Mubu SS] Trigger err:", error); // Keep error
                alert(`触发筛选时出错: ${error.message}`);
            }
        } else {
            console.warn("[Mubu SS] Input not found."); // Keep warn
            alert("未找到搜索框!");
        }
        hideSelectionActionButtons(); // Hide buttons after action
    }

    // General Mouse/Selection Handlers (Unchanged from original 主脚本)
    function handleMouseDownPopup(event) {
        const target = event.target;
        if (target instanceof Node) {
            // Check if click is on any known action button or toggle panel
            const isClickOnActionButton = popupElement?.contains(target) ||
                tp_triggerButtonRef.element?.contains(target) ||
                tp_cutButtonRef.element?.contains(target);
            const isClickOnToggle = togglePanelElement?.contains(target) ||
                toggleTriggerElement?.contains(target);
            const isClickOnPasteButton = tp_pasteButtonRef.element?.contains(target);
            const isClickOnCopyTag = ct_copyPopupElement?.contains(target); // Added Check

            // Hide selection buttons if click is outside them (and not on toggle/paste/copytag)
            if (!isClickOnActionButton && !isClickOnToggle && !isClickOnPasteButton && !isClickOnCopyTag) {
                // console.log("[MouseDown] Hiding selection buttons."); // Less verbose
                hideSelectionActionButtons();
            }
            // Hide paste button if click is outside it (and not on toggle)
            if (!isClickOnPasteButton && !isClickOnToggle) {
                // console.log("[MouseDown] Hiding paste button."); // Less verbose
                tp_hidePasteButton();
            }
            // Hide copy tag popup if click is outside it
            if (!isClickOnCopyTag && ct_copyPopupElement?.style.visibility !== 'hidden') {
                // console.log("[MouseDown] Hiding copy tag popup."); // Less verbose
                ct_hideCopyPopupImmediately(true);
            }
        } else {
            // console.log("[MouseDown] Click target not a node, hiding all popups."); // Less verbose
            hideSelectionActionButtons();
            tp_hidePasteButton();
            ct_hideCopyPopupImmediately(true);
        }
    }

    function handleMouseUpSelectionEnd(event) {
        const target = event.target;
        // Don't trigger if mouseup is on our own buttons/panels
        if (target instanceof Node) {
            const isClickOnActionButton = popupElement?.contains(target) ||
                tp_triggerButtonRef.element?.contains(target) ||
                tp_cutButtonRef.element?.contains(target);
            const isClickOnToggle = togglePanelElement?.contains(target) ||
                toggleTriggerElement?.contains(target);
            const isClickOnPasteButton = tp_pasteButtonRef.element?.contains(target);
            const isClickOnCopyTag = ct_copyPopupElement?.contains(target); // Added Check

            if (isClickOnActionButton || isClickOnToggle || isClickOnPasteButton || isClickOnCopyTag) {
                // console.log("[MouseUp] Mouse up on action button/panel, returning."); // Less verbose
                return;
            }
        }
        // Use timeout + rAF to ensure selection is finalized
        setTimeout(() => {
            requestAnimationFrame(() => {
                const selection = window.getSelection();
                if (selection && !selection.isCollapsed && selection.toString().trim().length > 0) {
                    const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
                    if (range) {
                        // Check if selection is within an editable area
                        const containerNode = range.commonAncestorContainer;
                        const isInEditable = containerNode && (
                            (containerNode.nodeType === Node.ELEMENT_NODE && tp_isElementEditable(containerNode)) ||
                            (containerNode.nodeType === Node.TEXT_NODE && containerNode.parentElement && tp_isElementEditable(containerNode.parentElement))
                        );

                        if (isInEditable) {
                            // console.log('[MouseUp] Showing buttons after mouseup (normal selection)'); // Less verbose
                            showSelectionActionButtons(selection, false); // Show buttons for normal selection
                        } else {
                            // console.log('[MouseUp] Selection not in editable area, hiding buttons.'); // Less verbose
                            hideSelectionActionButtons();
                        }
                    } else {
                        // console.log('[MouseUp] No range found, hiding buttons.'); // Less verbose
                        hideSelectionActionButtons();
                    }
                } else {
                    // console.log('[MouseUp] Selection collapsed or empty, hiding buttons.'); // Less verbose
                    hideSelectionActionButtons(); // Hide if selection is collapsed or empty
                }
            });
        }, config.select.popupAppearDelay); // Small delay before checking selection
    }

    function hideSelectionActionButtons() {
        // Hide Select Search Popup
        if (popupElement?.isConnected && popupElement.style.visibility !== 'hidden') {
            scheduleStyleUpdate(popupElement, { opacity: '0', visibility: 'hidden' });
            setTimeout(() => { if (popupElement?.style.opacity === '0') scheduleStyleUpdate(popupElement, { display: 'none' }); }, 150);
        }
        // Hide Transfer Paste Copy Button
        if (tp_triggerButtonRef.element?.isConnected && tp_triggerButtonRef.element.style.visibility !== 'hidden') {
            scheduleStyleUpdate(tp_triggerButtonRef.element, { opacity: '0', visibility: 'hidden' });
            setTimeout(() => { if (tp_triggerButtonRef.element?.style.opacity === '0') scheduleStyleUpdate(tp_triggerButtonRef.element, { display: 'none' }); }, 150);
        }
        // Hide Transfer Paste Cut Button
        if (tp_cutButtonRef.element?.isConnected && tp_cutButtonRef.element.style.visibility !== 'hidden') {
            scheduleStyleUpdate(tp_cutButtonRef.element, { opacity: '0', visibility: 'hidden' });
            setTimeout(() => { if (tp_cutButtonRef.element?.style.opacity === '0') scheduleStyleUpdate(tp_cutButtonRef.element, { display: 'none' }); }, 150);
        }
        currentSelectedText = ''; // Clear selected text state
    }

    function showSelectionActionButtons(selection, isCtrlA = false) {
        hideSelectionActionButtons(); // Hide previous buttons first
        tp_hidePasteButton(); // Ensure paste button is hidden

        if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;
        const selectionText = selection.toString().trim();
        if (selectionText.length === 0) return;

        // Double check editable context - redundant but safe
        const containerNode = selection.getRangeAt(0).commonAncestorContainer;
        const isInEditable = containerNode && (
            (containerNode.nodeType === Node.ELEMENT_NODE && tp_isElementEditable(containerNode)) ||
            (containerNode.nodeType === Node.TEXT_NODE && containerNode.parentElement && tp_isElementEditable(containerNode.parentElement))
        );
        if (!isInEditable) {
            // console.log("[ShowButtons] Context not editable, aborting."); // Less verbose
            return;
        }


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
                        if (!popupElement) return; // Skip if creation failed
                        buttonInfo = { type: 'filter', element: popupElement, fallbackW: config.select.fallbackWidth, fallbackH: config.select.fallbackHeight };
                        currentSelectedText = selectionText; // Store text for the filter button
                    } else if (type === 'copy') {
                        tp_triggerButtonRef.element = tp_createButton(
                            config.transferPaste.triggerButtonId,
                            config.transferPaste.triggerButtonText,
                            config.transferPaste.btnCopyClass,
                            (button) => {
                                // Click handler for Copy button
                                if (!tp_captureSelectionAndStore()) { alert('捕获选区失败！'); }
                                hideSelectionActionButtons(); // Hide after action
                            }
                        );
                        if (!tp_triggerButtonRef.element) return; // Skip if creation failed
                        buttonInfo = { type: 'copy', element: tp_triggerButtonRef.element, fallbackW: config.transferPaste.buttonFallbackWidth, fallbackH: config.transferPaste.buttonFallbackHeight };
                    } else if (type === 'cut') {
                        tp_cutButtonRef.element = tp_createButton(
                            config.transferPaste.cutButtonId,
                            config.transferPaste.cutButtonText,
                            config.transferPaste.btnCutClass,
                            (button) => {
                                // Click handler for Cut button
                                const latestSel = window.getSelection();
                                if (latestSel && !latestSel.isCollapsed) {
                                    if (tp_captureSelectionAndStore()) {
                                        try {
                                            // Try native delete first
                                            if (!document.execCommand('delete', false, null)) {
                                                console.warn("[Mubu TP] execCommand('delete') failed, fallback."); // Keep warn
                                                latestSel.getRangeAt(0).deleteContents(); // Fallback
                                            }
                                        } catch (e) {
                                            console.error('[Mubu TP] Delete err, fallback:', e); // Keep error
                                            try { latestSel.getRangeAt(0).deleteContents(); } // Fallback
                                            catch (e2) { console.error('[Mubu TP] Fallback err:', e2); alert('剪切删除失败.'); } // Keep error
                                        }
                                    } else { alert('捕获失败，无法剪切！'); }
                                } else { alert('选区失效，无法剪切！'); }
                                hideSelectionActionButtons(); // Hide after action
                            }
                        );
                        if (!tp_cutButtonRef.element) return; // Skip if creation failed
                        buttonInfo = { type: 'cut', element: tp_cutButtonRef.element, fallbackW: config.transferPaste.buttonFallbackWidth, fallbackH: config.transferPaste.buttonFallbackHeight };
                    }
                } catch (creationError) {
                    console.error(`[Mubu Helper] Error creating/getting button type ${type}:`, creationError); // Keep error
                    return; // Skip this button if error
                }
            }

            // If button should appear and was created/found successfully
            if (buttonInfo && buttonInfo.element && buttonInfo.element.isConnected) {
                observeElementResize(buttonInfo.element); // Ensure dimensions are tracked
                const dims = elementDimensionsCache.get(buttonInfo.element);
                buttonInfo.width = dims?.width || buttonInfo.fallbackW;
                buttonInfo.height = dims?.height || buttonInfo.fallbackH;

                // Check if dimensions are valid, attempt fallback if needed
                if (buttonInfo.width <= 0 || buttonInfo.height <= 0) {
                    const ow = buttonInfo.element.offsetWidth;
                    const oh = buttonInfo.element.offsetHeight;
                    if (ow > 0 && oh > 0) {
                        buttonInfo.width = ow;
                        buttonInfo.height = oh;
                        elementDimensionsCache.set(buttonInfo.element, { width: ow, height: oh });
                        // console.log(`[ShowButtons] Used offset W/H for ${buttonInfo.type}: ${ow}x${oh}`); // Less verbose
                    } else {
                        console.warn(`[Mubu Helper] Invalid or zero dimensions for button type: ${buttonInfo.type}`, buttonInfo.element); // Keep warn
                        // Don't add if dimensions are still bad
                        return;
                    }
                }
                // Add valid button data to list
                maxHeight = Math.max(maxHeight, buttonInfo.height);
                visibleButtonsData.push(buttonInfo);
            }
        }); // End forEach button type

        if (visibleButtonsData.length === 0) {
            // console.log("[ShowButtons] No buttons to show."); // Less verbose
            return; // No buttons enabled or created successfully
        }

        const targetRect = getCursorRect(selection); // Get rect of the selection end
        if (!targetRect || (targetRect.width === 0 && targetRect.height === 0 && selectionText.length === 0)) {
            console.warn("[ShowButtons] Invalid target rect, hiding."); // Keep warn
            hideSelectionActionButtons();
            return;
        }

        // Calculate position for the group of buttons
        const totalWidth = visibleButtonsData.reduce((sum, btn) => sum + btn.width, 0) + Math.max(0, visibleButtonsData.length - 1) * BUTTON_GAP;
        const scrollY = window.pageYOffset;
        const scrollX = window.pageXOffset;
        const vpW = window.innerWidth;

        // Position above the selection end cursor/highlight
        const groupTop = Math.max(scrollY + 5, scrollY + targetRect.top - maxHeight - config.select.popupAboveGap);
        const selectionCenterX = targetRect.left + targetRect.width / 2;
        let groupLeftStart = scrollX + selectionCenterX - totalWidth / 2;

        // Adjust horizontal position to stay within viewport
        groupLeftStart = Math.max(scrollX + 5, groupLeftStart); // Min left padding
        if (groupLeftStart + totalWidth > scrollX + vpW - 5) { // Max right padding
            groupLeftStart = scrollX + vpW - totalWidth - 5;
            groupLeftStart = Math.max(scrollX + 5, groupLeftStart); // Re-check min after adjustment
        }

        // Position each button within the group
        let currentLeftOffset = 0;
        visibleButtonsData.forEach((buttonInfo, index) => {
            const currentButtonLeft = groupLeftStart + currentLeftOffset;

            // Ensure element is in DOM (might be removed if previously hidden completely)
            if (!buttonInfo.element.isConnected) {
                try {
                    docBody.appendChild(buttonInfo.element);
                    observeElementResize(buttonInfo.element); // Re-observe if re-added
                } catch (e) { console.error("Error re-appending button:", e); return; } // Keep error
            }

            scheduleStyleUpdate(buttonInfo.element, {
                transform: `translate(${currentButtonLeft.toFixed(1)}px, ${groupTop.toFixed(1)}px)`,
                display: 'inline-block', // Use inline-block for layout
                opacity: '1',
                visibility: 'visible'
            });
            // console.log(`[ShowButtons] Positioning ${buttonInfo.type} at ${currentButtonLeft.toFixed(1)}, ${groupTop.toFixed(1)}`); // Less verbose

            currentLeftOffset += buttonInfo.width + (index < visibleButtonsData.length - 1 ? BUTTON_GAP : 0);
        });
        // console.log("[ShowButtons] Buttons positioned."); // Less verbose
    }


    // Copy Tag Handlers (Unchanged from original 主脚本)
    async function ct_handleCopyButtonClick(event) { if (!isFeatureEnabled('copyTagOnHover')) return; event.stopPropagation(); event.preventDefault(); if (!ct_currentTagText || !ct_copyPopupElement || !ct_currentHoveredTag) return; const text = " " + ct_currentTagText; try { await navigator.clipboard.writeText(text); ct_showFeedbackIndicator(ct_currentHoveredTag); ct_hideCopyPopupImmediately(false); } catch (err) { console.error("[CT] Clipboard err:", err); alert(`复制失败: ${err.message}`); } }
    function ct_handleMouseOver(event) { if (!isFeatureEnabled('copyTagOnHover')) return; if (!(event.target instanceof Element)) { return; } const relevant = event.target.closest(`${config.copyTag.tagSelector}, #${config.copyTag.popupId}`); if (!relevant) { if (ct_currentHoveredTag) { ct_scheduleHidePopup(); } return; } ct_createElements(); if (!ct_copyPopupElement) { console.warn("[CT] Copy popup element missing."); return; } const tagEl = relevant.matches(config.copyTag.tagSelector) ? relevant : null; const isOverPopup = relevant === ct_copyPopupElement; if (tagEl) { if (tagEl === ct_currentHoveredTag) { clearTimeout(ct_hideTimeout); ct_hideTimeout = null; if (ct_copyPopupElement.style.visibility === 'hidden' || ct_copyPopupElement.style.opacity === '0') { ct_showCopyPopup(tagEl); } } else { clearTimeout(ct_showTimeout); clearTimeout(ct_hideTimeout); ct_hideTimeout = null; if (ct_currentHoveredTag && ct_copyPopupElement.style.visibility !== 'hidden' && ct_copyPopupElement.style.opacity !== '0') { ct_hideCopyPopupImmediately(false); } ct_currentHoveredTag = tagEl; ct_showTimeout = setTimeout(() => { if (ct_currentHoveredTag === tagEl && tagEl.matches(':hover')) { ct_showCopyPopup(tagEl); } ct_showTimeout = null; }, config.copyTag.hoverDelay); } } else if (isOverPopup) { clearTimeout(ct_hideTimeout); ct_hideTimeout = null; clearTimeout(ct_showTimeout); ct_showTimeout = null; if (ct_copyPopupElement.style.visibility === 'hidden' || ct_copyPopupElement.style.opacity === '0') { scheduleStyleUpdate(ct_copyPopupElement, { opacity: '1', visibility: 'visible', display: 'block' }); } } }

    // Transfer Paste / Keyboard Handlers (Unchanged from original 主脚本)
    function tp_handleMouseUp(event) { // Renamed to avoid conflict, purely for paste button logic
        const target = event.target;
        // Ignore if mouse up is on our own action buttons/panels
        if (target instanceof Node) {
            const isClickOnActionButton = popupElement?.contains(target) ||
                tp_triggerButtonRef.element?.contains(target) ||
                tp_cutButtonRef.element?.contains(target);
            const isClickOnToggle = togglePanelElement?.contains(target) ||
                toggleTriggerElement?.contains(target);
            const isClickOnCopyTag = ct_copyPopupElement?.contains(target);

            if (isClickOnActionButton || isClickOnToggle || isClickOnCopyTag) return;
            // Allow paste button to appear even if mouseup is on paste button itself (shouldn't happen often)
            // const isClickOnPasteButton = tp_pasteButtonRef.element?.contains(target);
            // if (isClickOnPasteButton) return;
        }

        // Check shortly after mouseup
        setTimeout(() => {
            requestAnimationFrame(() => {
                const latestSel = window.getSelection();
                if (!latestSel) return;

                const hasStoredContent = !!(tp_storedHTML || tp_storedText);
                const targetEl = event.target instanceof Node ? event.target : null;
                const targetEditable = tp_isElementEditable(targetEl);

                // Show paste button ONLY if:
                // 1. Selection is collapsed (cursor placed)
                // 2. There IS stored content (HTML or text)
                // 3. The target element is editable
                if (latestSel.isCollapsed && hasStoredContent && targetEditable) {
                    // Additional check: Ensure mouse wasn't released over selection buttons
                    if (!popupElement || !popupElement.contains(event.target)) {
                        // console.log('[Mubu Helper TP] Showing paste button.'); // Less verbose
                        hideSelectionActionButtons(); // Hide selection buttons before showing paste
                        tp_showPasteButton(event); // Show the paste button
                    }
                } else {
                    // Hide paste button if conditions aren't met (e.g., selection exists, no stored content, not editable)
                    // console.log('[Mubu Helper TP] Hiding paste button (conditions not met).'); // Less verbose
                    tp_hidePasteButton();
                }
            });
        }, config.transferPaste.buttonsAppearDelay); // Delay slightly
    }
    function tp_handleKeyDown(event) {
        if (togglePanelElement?.contains(document.activeElement)) return; // Ignore if focus is in toggle panel
        const anyActionEnabled = isFeatureEnabled('transferPasteCopy') || isFeatureEnabled('transferPasteCut') || isFeatureEnabled('selectSearchPopup');
        // If no selection actions are enabled AND paste button isn't visible, don't need key checks
        if (!anyActionEnabled && (!tp_pasteButtonRef.element || tp_pasteButtonRef.element.style.visibility === 'hidden')) return;

        // Detect Ctrl+A
        if ((event.ctrlKey || event.metaKey) && (event.key === 'a' || event.key === 'A')) {
            tp_ctrlApressed = true;
            // console.log("[KeyDown] Ctrl+A detected."); // Less verbose
            hideSelectionActionButtons(); // Hide buttons immediately on Ctrl+A down
            tp_hidePasteButton(); // Hide paste button immediately
        } else {
            // Reset Ctrl+A flag if other keys are pressed (excluding modifiers)
            if (tp_ctrlApressed && !(event.key === 'Control' || event.key === 'Meta' || event.key === 'Shift' || event.key === 'Alt')) {
                // console.log("[KeyDown] Other key pressed, resetting Ctrl+A flag."); // Less verbose
                tp_ctrlApressed = false;
            }

            // Hide Paste Button on navigation/deletion if it's visible
            if (tp_pasteButtonRef.element?.style.visibility !== 'hidden' && !tp_pasteButtonRef.element.contains(event.target)) {
                if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown', 'Backspace', 'Delete', 'Enter'].includes(event.key)) {
                    // console.log("[KeyDown] Navigation/Deletion key pressed, hiding paste button."); // Less verbose
                    tp_hidePasteButton();
                }
            }

            // Hide Selection Buttons on Backspace/Delete if they are visible and target isn't them
            const actionButtonsVisible = (popupElement?.style.visibility !== 'hidden') ||
                (tp_triggerButtonRef.element?.style.visibility !== 'hidden') ||
                (tp_cutButtonRef.element?.style.visibility !== 'hidden');
            const targetOnActionButtons = popupElement?.contains(event.target) ||
                tp_triggerButtonRef.element?.contains(event.target) ||
                tp_cutButtonRef.element?.contains(event.target);
            if (actionButtonsVisible && !targetOnActionButtons) {
                if (['Backspace', 'Delete'].includes(event.key)) {
                    // console.log("[KeyDown] Backspace/Delete pressed, scheduling button hide check."); // Less verbose
                    // Check shortly after if selection is gone
                    setTimeout(() => {
                        const selection = window.getSelection();
                        if (!selection || selection.isCollapsed) {
                            // console.log("[KeyDown Check] Selection collapsed after delete, hiding buttons."); // Less verbose
                            hideSelectionActionButtons();
                        }
                    }, 0);
                }
            }
        }
    }
    function tp_handleKeyUp(event) {
        if (togglePanelElement?.contains(document.activeElement)) return; // Ignore if focus is in toggle panel
        const anyActionEnabled = isFeatureEnabled('transferPasteCopy') || isFeatureEnabled('transferPasteCut');
        if (!anyActionEnabled) return; // Only care if copy/cut are possible

        // Check if Ctrl+A was just released
        if (tp_ctrlApressed && (event.key === 'Control' || event.key === 'Meta' || event.key === 'a' || event.key === 'A')) {
            // console.log(`[KeyUp] Potential Ctrl+A release (key: ${event.key})`); // Less verbose
            // Use timeout to check state *after* keyup finishes processing
            setTimeout(() => {
                const modPressed = event.ctrlKey || event.metaKey; // Check if modifier is *still* pressed

                // Trigger if:
                // 1. The released key was Ctrl/Meta, OR
                // 2. The released key was 'a'/'A' AND the modifier is *no longer* pressed
                if ((event.key === 'Control' || event.key === 'Meta') || ((event.key === 'a' || event.key === 'A') && !modPressed)) {
                    if (tp_ctrlApressed) { // Ensure flag was actually set
                        // console.log("[KeyUp Ctrl+A Check] Flag was set, checking selection..."); // Less verbose
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
                                    // Use rAF to ensure layout is stable before positioning
                                    requestAnimationFrame(() => {
                                        console.log('[Mubu Helper] Showing btns after Ctrl+A keyup'); // Keep log
                                        showSelectionActionButtons(currentSelection, true); // Show Copy/Cut only
                                    });
                                } else { hideSelectionActionButtons(); } // Not editable
                            } else { hideSelectionActionButtons(); } // No range
                        } else { hideSelectionActionButtons(); } // Selection collapsed or empty

                        tp_ctrlApressed = false; // Reset flag after handling
                        // console.log("[KeyUp Ctrl+A Check] Handled, flag reset."); // Less verbose
                    } else {
                        // console.log("[KeyUp Ctrl+A Check] Flag was already false."); // Less verbose
                    }
                } else {
                    // console.log("[KeyUp Ctrl+A Check] Conditions not met (modifier still held?)."); // Less verbose
                }
            }, 0); // Timeout 0 to queue after current event loop task
        }
    }
    function tp_initialize() {
        // console.log('[Mubu TP] Initializing...'); // Less verbose
        const tpConfig = config.transferPaste;
        const MAX_RETRIES = tpConfig.initWaitMaxRetries;
        const RETRY_INTERVAL = tpConfig.initWaitRetryInterval;
        let retries = 0;

        const intervalId = setInterval(() => {
            if (tp_editorContainer) { // Already found
                clearInterval(intervalId);
                return;
            }
            const container = document.querySelector(tpConfig.editorContainerSelector);
            if (container) {
                clearInterval(intervalId);
                tp_editorContainer = container;
                // console.log('[Mubu TP] Editor container found:', tp_editorContainer); // Less verbose
                // Attach listeners *only if* relevant features are enabled initially
                if (isFeatureEnabled('transferPasteCopy') || isFeatureEnabled('transferPasteCut')) {
                    tp_attachListeners();
                } else {
                    // console.log('[Mubu TP] Editor found, but paste features initially disabled. Listeners not attached yet.'); // Less verbose
                }
            } else {
                retries++;
                if (retries >= MAX_RETRIES) {
                    clearInterval(intervalId);
                    console.error(`[Mubu TP] Init failed: Container "${tpConfig.editorContainerSelector}" not found after ${MAX_RETRIES} retries.`); // Keep error
                }
            }
        }, RETRY_INTERVAL);
    }
    function tp_attachListeners() {
        if (!tp_editorContainer) {
            console.warn('[Mubu TP] Attach skipped: Container not available.'); // Keep warn
            return;
        }
        if (tp_listenersAttached) {
            // console.log('[Mubu TP] Listeners already attached.'); // Less verbose
            return; // Already attached
        }
        // console.log('[Mubu TP] Attaching key listeners to:', tp_editorContainer); // Less verbose
        try {
            // Use capture phase for keydown/keyup to potentially intercept before default handlers
            tp_editorContainer.addEventListener('keydown', tp_handleKeyDown, true);
            tp_editorContainer.addEventListener('keyup', tp_handleKeyUp, true);
            tp_listenersAttached = true;
            // console.log('[Mubu TP] Key listeners attached.'); // Less verbose
        } catch (e) {
            console.error('[Mubu TP] Error attaching key listeners:', e); // Keep error
            tp_listenersAttached = false; // Ensure flag is false on error
        }
    }
    function tp_detachListeners() {
        if (!tp_editorContainer || !tp_listenersAttached) return;
        // console.log('[Mubu TP] Detaching key listeners from:', tp_editorContainer); // Less verbose
        try {
            tp_editorContainer.removeEventListener('keydown', tp_handleKeyDown, true);
            tp_editorContainer.removeEventListener('keyup', tp_handleKeyUp, true);
            tp_listenersAttached = false; // Set flag only on successful removal attempt
            // console.log('[Mubu TP] Key listeners detached.'); // Less verbose
        } catch (e) {
            console.warn('[Mubu TP] Detach listeners err:', e); // Keep warn
            // Keep flag true if removal fails? Or set false anyway? Setting false seems safer.
            tp_listenersAttached = false;
        }
    }

    // Toggle Panel Handlers (Unchanged from original 主脚本)
    function hideTogglePanel() { if (togglePanelElement) { scheduleStyleUpdate(togglePanelElement, { transform: `translateX(100%)` }); } }
    function scheduleHideTogglePanel() { clearTimeout(togglePanelHideTimeout); togglePanelHideTimeout = setTimeout(() => { const triggerHover = toggleTriggerElement?.matches(':hover'); const panelHover = togglePanelElement?.matches(':hover'); if (!triggerHover && !panelHover) { hideTogglePanel(); } }, config.togglePanel.hideDelay); }
    function showTogglePanel() { clearTimeout(togglePanelHideTimeout); if (togglePanelElement) { scheduleStyleUpdate(togglePanelElement, { transform: 'translateX(0)' }); } }
    function createTogglePanel() { const panelId = config.togglePanel.panelId; const triggerId = config.togglePanel.triggerId; if (document.getElementById(panelId)) return; try { toggleTriggerElement = document.createElement('div'); toggleTriggerElement.id = triggerId; toggleTriggerElement.addEventListener('mouseenter', showTogglePanel); toggleTriggerElement.addEventListener('mouseleave', scheduleHideTogglePanel); document.body.appendChild(toggleTriggerElement); togglePanelElement = document.createElement('div'); togglePanelElement.id = panelId; togglePanelElement.innerHTML = '<div class="toggle-panel-title">功能开关</div>'; togglePanelElement.addEventListener('mouseenter', showTogglePanel); togglePanelElement.addEventListener('mouseleave', scheduleHideTogglePanel); for (const key in FEATURES) { if (FEATURES.hasOwnProperty(key)) { const feature = FEATURES[key]; const isEnabled = runtimeFeatureState[key]; const div = document.createElement('div'); div.className = 'toggle-control'; const label = document.createElement('label'); label.htmlFor = `toggle-${key}`; label.textContent = feature.label; const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.id = `toggle-${key}`; checkbox.checked = isEnabled; checkbox.dataset.featureKey = key; checkbox.addEventListener('change', (event) => { const changedKey = event.target.dataset.featureKey; const newState = event.target.checked; runtimeFeatureState[changedKey] = newState; console.log(`[Mubu Toggle] ${FEATURES[changedKey].label} ${newState ? '启用' : '禁用'}`); applyFeatureStateChange(changedKey, newState); }); div.appendChild(checkbox); div.appendChild(label); togglePanelElement.appendChild(div); } } document.body.appendChild(togglePanelElement); } catch (e) { console.error('[Mubu] Create toggle panel err:', e); togglePanelElement = null; toggleTriggerElement = null; } }

    // --- [ ☆ Feature State Change Application ☆ ] --- (Unchanged from original 主脚本 merge)
    let customInputListenerAttached = false; // Tracks top bar input listeners
    let historyListClickListenerAttached = false; // Tracks history list 'click' listener
    let historyListDblClickListenerAttached = false; // Tracks history list 'dblclick' listener
    let selectPopupListenersAttached = false; // Tracks global mousedown/mouseup for selection buttons
    let copyTagListenerAttached = false; // Tracks mouseover for copy tag
    let historyItemKeyListenerAttached = false; // Tracks Ctrl+A listener for history items

    function applyFeatureStateChange(featureKey, isEnabled) {
        console.log(`[ApplyState] Applying state for ${featureKey}: ${isEnabled}`); // Keep log
        switch (featureKey) {
            case 'syncSearchBox': // Logic from 副脚本
                if (isEnabled) {
                    // Enabling Sync Search Box
                    if (!topBarControls.container) createControlPanel(); // Ensure UI exists
                    if (topBarControls.container) scheduleStyleUpdate(topBarControls.container, { display: 'flex' }); // Show UI
                    if (!customInput && topBarControls.input) customInput = topBarControls.input; // Assign input ref

                    // Attach listeners for top bar buttons and input if not already attached
                    if (topBarControls.input && !customInputListenerAttached) {
                        topBarControls.prevBtn?.addEventListener('click', historyNavPrevListener);
                        topBarControls.nextBtn?.addEventListener('click', historyNavNextListener);
                        topBarControls.clearBtn?.addEventListener('click', clearBtnListener);
                        topBarControls.input?.addEventListener('input', customInputListener, { passive: true });
                        customInputListenerAttached = true;
                        // console.log("[ApplyState Sync] Top bar listeners attached."); // Less verbose
                    }
                    // Ensure the correct listener (sync) is attached to the original input
                    setupInputListeners(originalInput);
                    // Trigger a check for the input element in case it wasn't found initially
                    findAndSetupDebounced();
                    // Sync current state on enable
                    if (originalInput) {
                        updateCustomInputAndAddHistory(originalInput.value, 'feature_enable');
                    } else if (customInput && lastSyncedValue !== null) {
                        customInput.value = lastSyncedValue; // Restore last known value if original input gone
                    }

                } else {
                    // Disabling Sync Search Box
                    if (topBarControls.container) scheduleStyleUpdate(topBarControls.container, { display: 'none' }); // Hide UI

                    // Remove top bar listeners if attached
                    if (customInputListenerAttached) {
                        topBarControls.prevBtn?.removeEventListener('click', historyNavPrevListener);
                        topBarControls.nextBtn?.removeEventListener('click', historyNavNextListener);
                        topBarControls.clearBtn?.removeEventListener('click', clearBtnListener);
                        topBarControls.input?.removeEventListener('input', customInputListener);
                        customInputListenerAttached = false;
                        // console.log("[ApplyState Sync] Top bar listeners removed."); // Less verbose
                    }
                    customInput = null; // Clear input ref
                    // Re-setup input listeners (might switch to history-only listener if historyPanel is still on)
                    setupInputListeners(originalInput);
                }
                break;

            case 'historyPanel': // Logic from 副脚本
                if (isEnabled) {
                    // Enabling History Panel
                    if (!historyPanel) createHistoryPanel(); // Ensure UI exists
                    if (historyPanel) scheduleStyleUpdate(historyPanel, { display: 'flex' }); // Show UI

                    // Attach listeners for history list click/dblclick if not already attached
                    if (historyListElement) {
                        if (!historyListClickListenerAttached) {
                            historyListElement.addEventListener('click', handleHistoryListClick); // Uses the new async handler
                            historyListClickListenerAttached = true;
                            // console.log("[ApplyState History] List click listener attached."); // Less verbose
                        }
                        if (!historyListDblClickListenerAttached) {
                            historyListElement.addEventListener('dblclick', handleHistoryListDblClick);
                            historyListDblClickListenerAttached = true;
                            // console.log("[ApplyState History] List dblclick listener attached."); // Less verbose
                        }
                        // Attach listener for Ctrl+A highlight toggle if not already attached
                        if (!historyItemKeyListenerAttached) {
                            document.body.addEventListener('keydown', handleHistoryItemHighlightKey, true); // Use capture phase maybe? Or bubble? Bubble seems fine here.
                            historyItemKeyListenerAttached = true;
                            // console.log("[ApplyState History] Ctrl+A key listener attached."); // Less verbose
                        }
                    }
                    // Update panel content on enable
                    historyManager.updatePanel();
                    // Ensure correct listener is attached to original input (might switch from none to history-only)
                    setupInputListeners(originalInput);

                } else {
                    // Disabling History Panel
                    if (historyPanel) scheduleStyleUpdate(historyPanel, { display: 'none' }); // Hide UI

                    // Remove history list listeners if attached
                    if (historyListElement) {
                        if (historyListClickListenerAttached) {
                            historyListElement.removeEventListener('click', handleHistoryListClick);
                            historyListClickListenerAttached = false;
                            // console.log("[ApplyState History] List click listener removed."); // Less verbose
                        }
                        if (historyListDblClickListenerAttached) {
                            historyListElement.removeEventListener('dblclick', handleHistoryListDblClick);
                            historyListDblClickListenerAttached = false;
                            // console.log("[ApplyState History] List dblclick listener removed."); // Less verbose
                        }
                        // Remove Ctrl+A listener if attached
                        if (historyItemKeyListenerAttached) {
                            document.body.removeEventListener('keydown', handleHistoryItemHighlightKey, true);
                            historyItemKeyListenerAttached = false;
                            // console.log("[ApplyState History] Ctrl+A key listener removed."); // Less verbose
                        }
                    }
                    // Clear persistent highlight state when disabling the panel
                    persistHighlightedTerm = null;
                    persistHighlightedIndex = null;
                    // Re-setup input listeners (might switch from history-only to sync or none)
                    setupInputListeners(originalInput);
                }
                break;

            // --- Features below are from 主脚本 (Retained - Unchanged) ---
            case 'pushContent': // From 主脚本
                try {
                    const pcConfig = config.pushContent;
                    const contentElement = document.querySelector(pcConfig.contentSelector);
                    if (contentElement) {
                        if (isEnabled) {
                            contentElement.classList.add(pcConfig.pushClass);
                            // console.log(`[Mubu Push] Added class '${pcConfig.pushClass}' to ${pcConfig.contentSelector}`); // Less verbose
                        } else {
                            contentElement.classList.remove(pcConfig.pushClass);
                            // console.log(`[Mubu Push] Removed class '${pcConfig.pushClass}' from ${pcConfig.contentSelector}`); // Less verbose
                        }
                    } else {
                        console.warn(`[Mubu Push] Target element "${pcConfig.contentSelector}" not found.`); // Keep warn
                    }
                } catch (e) {
                    console.error('[Mubu Push] Error applying state change:', e); // Keep error
                }
                break;

            case 'selectSearchPopup':
            case 'transferPasteCopy':
            case 'transferPasteCut': // Combined logic for selection-based buttons
                const anyGroupButtonEnabled = isFeatureEnabled('selectSearchPopup') || isFeatureEnabled('transferPasteCopy') || isFeatureEnabled('transferPasteCut');
                const anyPasteEnabled = isFeatureEnabled('transferPasteCopy') || isFeatureEnabled('transferPasteCut');

                // Manage global selection listeners (mousedown, mouseup for selection, mouseup for paste)
                if (anyGroupButtonEnabled || anyPasteEnabled) { // Attach if any selection or paste feature is on
                    if (isFeatureEnabled('selectSearchPopup') && !popupElement) {
                        createSelectPopup(); // Create filter button if needed
                    }
                    // Ensure Transfer Paste buttons are created if needed (will be hidden if feature off)
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
                            // Attach listeners for showing selection buttons
                            document.addEventListener('mousedown', handleMouseDownPopup, true); // Hides buttons on click elsewhere
                            document.addEventListener('mouseup', handleMouseUpSelectionEnd, true); // Shows buttons on selection end

                            // Attach listener for showing paste button (only on mouseup, when selection is collapsed)
                            document.addEventListener('mouseup', tp_handleMouseUp, true);

                            selectPopupListenersAttached = true;
                            // console.log('[ApplyState Select/TP] Global selection/paste listeners attached.'); // Less verbose
                        } catch (e) {
                            console.error('[ApplyState Select/TP] Attach global listeners err:', e); // Keep error
                        }
                    }
                } else { // No selection or paste features enabled
                    if (selectPopupListenersAttached) {
                        try {
                            document.removeEventListener('mousedown', handleMouseDownPopup, true);
                            document.removeEventListener('mouseup', handleMouseUpSelectionEnd, true);
                            document.removeEventListener('mouseup', tp_handleMouseUp, true);
                            selectPopupListenersAttached = false;
                            // console.log('[ApplyState Select/TP] Global selection/paste listeners detached.'); // Less verbose
                        } catch (e) {
                            console.error('[ApplyState Select/TP] Detach global listeners err:', e); // Keep error
                        }
                    }
                    hideSelectionActionButtons(); // Hide filter/copy/cut buttons
                    tp_hidePasteButton(); // Hide paste button
                }

                // Attach/detach editor-specific key listeners based ONLY on paste features
                if (anyPasteEnabled) {
                    tp_attachListeners(); // Attaches keydown/keyup if not already attached
                } else {
                    tp_detachListeners(); // Detaches keydown/keyup if attached
                }

                // Hide specific buttons if their feature was the one just disabled
                // (showSelectionActionButtons handles showing based on current enabled state)
                if (!isEnabled) {
                    // console.log(`[ApplyState Select/TP] Hiding buttons potentially related to disabled feature: ${featureKey}`); // Less verbose
                    hideSelectionActionButtons(); // Re-hide all selection buttons to be safe
                    if (!anyPasteEnabled) { // If no paste features left, hide paste button too
                        tp_hidePasteButton();
                    }
                }
                break;

            case 'copyTagOnHover': // From 主脚本
                if (isEnabled) {
                    ct_createElements(); // Ensure elements exist
                    if (!copyTagListenerAttached) {
                        const target = document.querySelector(config.selectors.copyTagParentContainer) || document.body;
                        if (target) {
                            try {
                                target.addEventListener('mouseover', ct_handleMouseOver, { passive: true });
                                ct_listenerTarget = target;
                                copyTagListenerAttached = true;
                                // console.log('[ApplyState CT] Mouseover listener attached.'); // Less verbose
                            } catch (e) {
                                console.error('[ApplyState CT] Attach err:', e); // Keep error
                                ct_listenerTarget = null;
                            }
                        } else {
                            console.warn(`[ApplyState CT] Target "${config.selectors.copyTagParentContainer}" not found for listener.`); // Keep warn
                        }
                    }
                } else {
                    ct_hideCopyPopupImmediately(true); // Hide any visible popup
                    ct_hideFeedbackIndicator(); // Hide any feedback
                    if (copyTagListenerAttached && ct_listenerTarget) {
                        try {
                            ct_listenerTarget.removeEventListener('mouseover', ct_handleMouseOver);
                            copyTagListenerAttached = false;
                            ct_listenerTarget = null;
                            // console.log('[ApplyState CT] Mouseover listener detached.'); // Less verbose
                        } catch (e) {
                            console.error('[ApplyState CT] Detach err:', e); // Keep error
                        }
                    } else {
                        if (copyTagListenerAttached) copyTagListenerAttached = false; // Ensure flag is reset
                        ct_listenerTarget = null;
                    }
                    // Clear state variables on disable
                    ct_currentHoveredTag = null;
                    ct_currentTagText = '';
                    clearTimeout(ct_showTimeout); ct_showTimeout = null;
                    clearTimeout(ct_hideTimeout); ct_hideTimeout = null;
                    clearTimeout(ct_feedbackTimeout); ct_feedbackTimeout = null;
                }
                break;
        }
    }


    // --- [ ☆ Initialization ☆ ] ---
    function init() {
        console.log(`[Mubu Combined Helper v${GM_info.script.version}] 开始初始化...`); // Keep log
        try {
            let featuresEnabledCount = 0;

            // Check prerequisites
            if ((isFeatureEnabled('syncSearchBox') || isFeatureEnabled('selectSearchPopup') || isFeatureEnabled('historyPanel')) && !nativeInputValueSetter) {
                console.error("[Mubu Init] Native input value setter not found, critical for search features!"); // Keep error
            }
            if (isFeatureEnabled('copyTagOnHover') && (!navigator.clipboard?.writeText)) {
                console.warn("[Mubu Init] Clipboard API (writeText) not available, 'Copy Tag' feature may fail."); // Keep warn
            }
            if ((isFeatureEnabled('transferPasteCopy') || isFeatureEnabled('transferPasteCut')) && (!document.execCommand)) {
                console.warn("[Mubu Init] document.execCommand not available, 'Transfer Paste' features may fail."); // Keep warn
            }

            // --- [ ☆ CSS 注入 ☆ ] --- (Unchanged from original 主脚本 merge)
            let combinedCSS = "";
            // Sync Search Box & History Panel CSS (From 副脚本 v3.74.10)
            combinedCSS += `#${config.sync.topBarId}{position:fixed;top:1px;left:50%;transform:translateX(-50%);z-index:10001;background:rgba(255,255,255,0.98);padding:6px;border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,0.15);display:flex;gap:8px;align-items:center;backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px)} #${config.sync.topBarId} .custom-search-input{padding:8px 12px;border:1px solid #dcdfe6;border-radius:20px;width:300px;font-size:14px;transition:all .2s ease-in-out;background:#f8f9fa;color:#303133;box-sizing:border-box}#${config.sync.topBarId} .custom-search-input::-webkit-search-cancel-button,#${config.sync.topBarId} .custom-search-input::-webkit-search-clear-button{display:none;-webkit-appearance:none;appearance:none}#${config.sync.topBarId} .custom-search-input:focus{border-color:#5856d5;outline:0;background:#fff;box-shadow:0 0 0 1px #5856d5}#${config.sync.topBarId} .history-btn,#${config.sync.topBarId} .clear-btn{padding:6px 12px;background:#f0f2f5;border:1px solid #dcdfe6;border-radius:20px;cursor:pointer;transition:all .2s ease-in-out;font-weight:500;color:#606266;flex-shrink:0;user-select:none;line-height:1}#${config.sync.topBarId} .clear-btn{font-weight:bold;padding:6px 10px}#${config.sync.topBarId} .history-btn:hover,#${config.sync.topBarId} .clear-btn:hover{background:#e9e9eb;color:#5856d5;border-color:#c0c4cc}#${config.sync.topBarId} .history-btn:active,#${config.sync.topBarId} .clear-btn:active{transform:scale(.95);background:#dcdfe6}`;
            combinedCSS += ` #${config.sync.historyPanelId}{position:fixed;top:460px;left:0px;transform:translateY(-50%);z-index:10000;width:152px;max-height:436px;background:rgba(248,249,250,0.95);border:1px solid #e0e0e0;border-radius:6px;box-shadow:0 1px 8px rgba(0,0,0,0.1);padding:8px 0;overflow:hidden;backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);display:flex;flex-direction:column}#${config.sync.historyPanelId} .search-history-list{list-style:none;padding:0;margin:0;overflow-y:auto;flex-grow:1;scrollbar-width:thin;scrollbar-color:#ccc #f0f0f0}#${config.sync.historyPanelId} .search-history-list::-webkit-scrollbar{width:6px}#${config.sync.historyPanelId} .search-history-list::-webkit-scrollbar-track{background:#f0f0f0;border-radius:3px}#${config.sync.historyPanelId} .search-history-list::-webkit-scrollbar-thumb{background-color:#ccc;border-radius:3px}#${config.sync.historyPanelId} .search-history-item{padding:6px 12px;font-size:13px;color:#555;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;border-bottom:1px solid #eee;transition:background-color 0.01s ease-in-out,color 0.01s ease-in-out}#${config.sync.historyPanelId} .search-history-item:last-child{border-bottom:none}#${config.sync.historyPanelId} .search-history-item:hover{background-color:#e9e9eb;color:#5856d5}#${config.sync.historyPanelId} .search-history-item:active{background-color:#dcdfe6}#${config.sync.historyPanelId} .search-history-item--active{background-color:${config.sync.activeItemBgColor} !important;color:#000 !important;font-weight:500;}`;
            combinedCSS += ` #${config.sync.historyPanelId} .search-history-item--persist-highlight{background-color:${config.sync.persistHighlightBgColor} !important; color:#333 !important; font-weight: bold;}`;
            combinedCSS += ` #${config.sync.historyListId} .search-history-item:last-child.search-history-item--persist-highlight { background-color: transparent !important; font-weight: normal !important; color: inherit !important; }`; // Hide highlight on last item
            // Select Search Popup CSS (From 主脚本)
            combinedCSS += ` .mu-select-popup-btn { background-color:#5856d5;color:white;border:none;border-radius:5px;padding:4px 8px;font-size:14px;line-height:1;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,0.3);white-space:nowrap;user-select:none;-webkit-user-select:none; transition: opacity 0.1s ease-in-out, visibility 0.1s ease-in-out, background-color 0.1s ease-in-out; } .mu-select-popup-btn:hover { background-color:#4a48b3; }`;
            // Copy Tag CSS (From 主脚本)
            combinedCSS += ` #${config.copyTag.popupId}{position:absolute;top:0;left:0;z-index:10010;background-color:#f0f2f5;color:#5856d5;border:1px solid #dcdfe6;border-radius:4px;padding:2px 5px;font-size:12px;line-height:1;cursor:pointer;box-shadow:0 1px 3px rgba(0,0,0,0.15);white-space:nowrap;user-select:none;-webkit-user-select:none;pointer-events:auto; transition: opacity 0.1s ease-in-out, visibility 0.1s ease-in-out;}#${config.copyTag.popupId}:hover{background-color:#e4e7ed;border-color:#c0c4cc}#${config.copyTag.feedbackId}{position:absolute;top:0;left:0;z-index:10011;background-color:#5856d5;color:white;border:1px solid #5856d5;border-radius:4px;padding:2px 5px;font-size:12px;line-height:1;cursor:default;box-shadow:0 1px 3px rgba(0,0,0,0.15);white-space:nowrap;user-select:none;-webkit-user-select:none;pointer-events:none; transition: opacity 0.1s ease-in-out, visibility 0.1s ease-in-out;}`;
            // Transfer Paste Buttons CSS (From 主脚本)
            const tpCss = config.transferPaste; const tpPref = tpCss.cssPrefix;
            combinedCSS += ` .${tpPref}${tpCss.btnBaseClass} { color:white;border:none;border-radius:5px;padding:4px 8px;font-size:14px;line-height:1;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,0.3);white-space:nowrap;user-select:none;-webkit-user-select:none; transition: opacity 0.1s ease-in-out, visibility 0.1s ease-in-out, background-color 0.1s ease-in-out; }`;
            combinedCSS += ` .${tpPref}${tpCss.btnCopyClass} { background-color:#5856d5; } .${tpPref}${tpCss.btnCopyClass}:hover { background-color:#4a48b3; }`;
            combinedCSS += ` .${tpPref}${tpCss.btnCutClass} { background-color:#d55856; } .${tpPref}${tpCss.btnCutClass}:hover { background-color:#b34a48; }`;
            combinedCSS += ` .${tpPref}${tpCss.btnPasteClass} { background-color:#5856d5; } .${tpPref}${tpCss.btnPasteClass}:hover { background-color:#4a48b3; }`;
            // Toggle Panel CSS (From 主脚本)
            const panelConf = config.togglePanel;
            combinedCSS += ` #${panelConf.triggerId}{position:fixed;bottom:0;right:0;width:${panelConf.triggerWidth}px;height:${panelConf.triggerHeight}px;background:rgba(0,0,0,0.01);cursor:pointer;z-index:19998;border-top-left-radius:5px;} #${panelConf.panelId}{position:fixed;bottom:0;right:0;width:${panelConf.panelWidth}px;max-height:80vh;overflow-y:auto;background:rgba(250,250,250,0.98);border:1px solid #ccc;border-top-left-radius:8px;box-shadow:-2px -2px 10px rgba(0,0,0,0.15);padding:10px;z-index:19999;transform:translateX(100%);transition:transform 0.3s ease-in-out;font-size:14px;color:#333;box-sizing:border-box;scrollbar-width:thin;scrollbar-color:#bbb #eee;} #${panelConf.panelId}::-webkit-scrollbar{width:6px;} #${panelConf.panelId}::-webkit-scrollbar-track{background:#eee;border-radius:3px;} #${panelConf.panelId}::-webkit-scrollbar-thumb{background-color:#bbb;border-radius:3px;} #${panelConf.triggerId}:hover + #${panelConf.panelId}, #${panelConf.panelId}:hover{transform:translateX(0);} #${panelConf.panelId} .toggle-panel-title{font-weight:bold;margin-bottom:10px;padding-bottom:5px;border-bottom:1px solid #eee;text-align:center;} #${panelConf.panelId} .toggle-control{display:flex;align-items:center;margin-bottom:8px;cursor:pointer;} #${panelConf.panelId} .toggle-control input[type="checkbox"]{margin-right:8px;cursor:pointer;appearance:none;-webkit-appearance:none;width:36px;height:20px;background-color:#ccc;border-radius:10px;position:relative;transition:background-color 0.2s ease-in-out;flex-shrink:0;} #${panelConf.panelId} .toggle-control input[type="checkbox"]::before{content:'';position:absolute;width:16px;height:16px;border-radius:50%;background-color:white;top:2px;left:2px;transition:left 0.2s ease-in-out;box-shadow:0 1px 2px rgba(0,0,0,0.2);} #${panelConf.panelId} .toggle-control input[type="checkbox"]:checked{background-color:#5856d5;} #${panelConf.panelId} .toggle-control input[type="checkbox"]:checked::before{left:18px;} #${panelConf.panelId} .toggle-control label{flex-grow:1;user-select:none;cursor:pointer;}`;
            // Push Content CSS (From 主脚本)
            const pcConf = config.pushContent;
            combinedCSS += `
                ${pcConf.contentSelector} {
                    transition: margin-left ${pcConf.transitionDuration} ease-in-out !important;
                    box-sizing: border-box; /* Good practice */
                }
                ${pcConf.contentSelector}.${pcConf.pushClass} {
                    margin-left: ${pcConf.pushMarginLeft}px !important;
                }
            `;
            // Apply all CSS
            if (combinedCSS) {
                try { GM_addStyle(combinedCSS); } catch (e) { console.warn('[Mubu Init] Inject CSS err:', e); } // Keep warn
            }

            // Create UI elements needed at start (others created on demand)
            createControlPanel(); // Create top bar (initially hidden if feature off)
            createHistoryPanel(); // Create history panel (initially hidden if feature off)
            createTogglePanel(); // Create toggle panel and trigger

            // Initialize subsystems
            tp_initialize(); // Initialize transfer paste (finds editor, attaches listeners later if needed)

            // Setup initial input state and listeners for Sync/History if needed
            const needsInputLogic = isFeatureEnabled('syncSearchBox') || isFeatureEnabled('historyPanel');
            if (needsInputLogic) {
                const initialInput = optimizedFindSearchBox();
                if (initialInput) {
                    originalInput = initialInput;
                    // Setup listeners based on *currently* enabled features (sync takes precedence)
                    setupInputListeners(originalInput);
                    // Perform initial sync/history update
                    updateCustomInputAndAddHistory(initialInput.value, 'init');
                    // console.log(`[Mubu Init] Initial input found. Value: "${initialInput.value}". State updated.`); // Less verbose
                } else {
                    console.warn("[Mubu Init] Initial search input not found on load."); // Keep warn
                }
            }

            // Setup DOM observer for search input changes if Sync or History is needed
            const needsObserver = isFeatureEnabled('syncSearchBox') || isFeatureEnabled('historyPanel');
            if (needsObserver) {
                const target = document.querySelector(config.selectors.domObserverTarget) || document.body;
                if (target) {
                    domObserver = new MutationObserver((mutations) => {
                        // Check if observer should still be active
                        if (!isFeatureEnabled('syncSearchBox') && !isFeatureEnabled('historyPanel')) {
                            if (domObserver) {
                                domObserver.disconnect();
                                domObserver = null;
                                console.log('[Mubu Observer] Disconnected as features are off.'); // Keep log
                            }
                            return;
                        }
                        // Ignore mutations during simulated tag clicks
                        if (isSimulatingClick) {
                            // console.log("[Mubu Observer] Ignoring mutation during simulated click."); // Less verbose
                            return;
                        }

                        let relevant = mutations.some(m => {
                            // Check if nodes were added/removed in the target or subtree
                            if (m.type === 'childList') return true;
                            // Check if the specific input element became disabled/enabled
                            if (m.type === 'attributes' && m.target === originalInput && m.attributeName === 'disabled') return true;
                            // Check if the input element or its container was removed
                            if (m.type === 'childList' && m.removedNodes.length > 0) {
                                for (const node of m.removedNodes) {
                                    if (node === originalInput || (node instanceof Element && node.contains?.(originalInput))) {
                                        return true;
                                    }
                                }
                            }
                            return false;
                        });
                        if (relevant) {
                            // console.log("[Mubu Observer] Relevant mutation detected, running findAndSetupDebounced..."); // Less verbose
                            findAndSetupDebounced(); // Debounced check and setup/update
                        }
                    });
                    domObserver.observe(target, { childList: true, subtree: true, attributes: true, attributeFilter: ['disabled'] });
                    // console.log('[Mubu Init] DOM Observer attached.'); // Less verbose
                } else {
                    console.error(`[Mubu Init] Observer target "${config.selectors.domObserverTarget}" not found! Search input might not be detected dynamically.`); // Keep error
                }
            }

            // Apply initial state for all features based on FEATURES defaults / runtime state
            // console.log('[Mubu Init] Applying initial feature states...'); // Less verbose
            let initialEnabledCount = 0;
            for (const key in runtimeFeatureState) {
                if (runtimeFeatureState[key]) { // If the feature is enabled by default or runtime state
                    // console.log(`[Mubu Init] Initializing enabled feature: ${key}`); // Less verbose
                    try {
                        applyFeatureStateChange(key, true); // Apply the 'enabled' state
                        initialEnabledCount++;
                    } catch (applyError) {
                        console.error(`[Mubu Init] Error applying initial state for ${key}:`, applyError); // Keep error
                    }
                }
            }
            featuresEnabledCount = initialEnabledCount;
            // console.log('[Mubu Init] Initial feature states applied.'); // Less verbose


            // Add unload listener for cleanup
            window.addEventListener('unload', cleanup);
            console.log(`[Mubu Combined Helper v${GM_info.script.version}] Init complete (${featuresEnabledCount} features initially active, panel loaded)`); // Keep log


        } catch (initError) {
            console.error(`[Mubu Combined Helper v${GM_info.script.version}] FATAL INIT ERROR:`, initError); // Keep error
        }
    }

    // --- [ ☆ Cleanup ☆ ] --- (Unchanged from original 主脚本 merge)
    function cleanup() {
        console.log(`[Mubu Combined Helper v${GM_info.script.version}] Cleaning up...`); // Keep log
        window.removeEventListener('unload', cleanup);

        try {
            // Disconnect observers
            domObserver?.disconnect();
            observerInstance.disconnect();
            elementObserverMap.clear();
            domObserver = null;

            // Remove listeners attached to Mubu elements or document
            teardownInputListeners(originalInput); // Removes input listeners (sync or history)
            if (customInputListenerAttached) { // Remove custom top bar listeners
                try {
                    topBarControls.prevBtn?.removeEventListener('click', historyNavPrevListener);
                    topBarControls.nextBtn?.removeEventListener('click', historyNavNextListener);
                    topBarControls.clearBtn?.removeEventListener('click', clearBtnListener);
                    topBarControls.input?.removeEventListener('input', customInputListener);
                } catch (e) { }
                customInputListenerAttached = false;
            }
            if (historyListClickListenerAttached) { // Remove history list click listener
                try { historyListElement?.removeEventListener('click', handleHistoryListClick); } catch (e) { }
                historyListClickListenerAttached = false;
            }
            if (historyListDblClickListenerAttached) { // Remove history list dblclick listener
                try { historyListElement?.removeEventListener('dblclick', handleHistoryListDblClick); } catch (e) { }
                historyListDblClickListenerAttached = false;
            }
            if (historyItemKeyListenerAttached) { // Remove Ctrl+A history highlight listener
                try { document.body.removeEventListener('keydown', handleHistoryItemHighlightKey, true); } catch (e) { }
                historyItemKeyListenerAttached = false;
            }
            if (selectPopupListenersAttached) { // Remove global selection/paste listeners
                try {
                    document.removeEventListener('mousedown', handleMouseDownPopup, true);
                    document.removeEventListener('mouseup', handleMouseUpSelectionEnd, true);
                    document.removeEventListener('mouseup', tp_handleMouseUp, true);
                } catch (e) { }
                selectPopupListenersAttached = false;
            }
            if (copyTagListenerAttached && ct_listenerTarget) { // Remove copy tag listener
                try { ct_listenerTarget.removeEventListener('mouseover', ct_handleMouseOver); } catch (e) { }
                copyTagListenerAttached = false;
                ct_listenerTarget = null;
            }
            tp_detachListeners(); // Detach editor key listeners (if attached)

            // Clear timeouts
            clearTimeout(togglePanelHideTimeout);
            clearTimeout(ct_showTimeout);
            clearTimeout(ct_hideTimeout);
            clearTimeout(ct_feedbackTimeout);

            // Remove toggle panel listeners (attached to our own elements)
            toggleTriggerElement?.removeEventListener('mouseenter', showTogglePanel);
            toggleTriggerElement?.removeEventListener('mouseleave', scheduleHideTogglePanel);
            togglePanelElement?.removeEventListener('mouseenter', showTogglePanel);
            togglePanelElement?.removeEventListener('mouseleave', scheduleHideTogglePanel);

            // Hide dynamic UI elements visually first
            hideSelectionActionButtons();
            tp_hidePasteButton();
            ct_hideCopyPopupImmediately(true);
            ct_hideFeedbackIndicator();
            hideTogglePanel();

            // Remove Push Content class
            try {
                const pcConfig = config.pushContent;
                const contentElement = document.querySelector(pcConfig.contentSelector);
                contentElement?.classList.remove(pcConfig.pushClass); // Ensure class is removed
            } catch (e) {
                console.warn('[Mubu Push] Error during cleanup:', e); // Keep warn
            }

            // Remove dynamically added UI elements from DOM
            // Use try-catch for each removal
            setTimeout(() => {
                try { unobserveElementResize(popupElement); popupElement?.remove(); } catch (e) { }
                try { unobserveElementResize(tp_triggerButtonRef.element); tp_triggerButtonRef.element?.remove(); } catch (e) { }
                try { unobserveElementResize(tp_cutButtonRef.element); tp_cutButtonRef.element?.remove(); } catch (e) { }
                try { unobserveElementResize(tp_pasteButtonRef.element); tp_pasteButtonRef.element?.remove(); } catch (e) { }
                try { unobserveElementResize(ct_copyPopupElement); ct_copyPopupElement?.remove(); } catch (e) { }
                try { unobserveElementResize(ct_feedbackElement); ct_feedbackElement?.remove(); } catch (e) { }
                try { unobserveElementResize(topBarControls.container); topBarControls.container?.remove(); } catch (e) { }
                try { unobserveElementResize(historyPanel); historyPanel?.remove(); } catch (e) { }
                try { toggleTriggerElement?.remove(); } catch (e) { } // No resize observer
                try { togglePanelElement?.remove(); } catch (e) { } // No resize observer
            }, 200); // Delay removal slightly


            // Reset state variables
            isRafScheduled = false; styleUpdateQueue = [];
            // Sync/History State
            originalInput = null; lastSyncedValue = null; isSyncing = false; customInput = null;
            originalInputSyncHandler = null; originalInputHistoryHandler = null;
            topBarControls = { container: null, input: null, prevBtn: null, nextBtn: null, clearBtn: null }; // Reset object
            historyPanel = null; historyListElement = null; activeHistoryItemElement = null;
            isSimulatingClick = false; persistHighlightedTerm = null; persistHighlightedIndex = null;
            // Other Features State
            popupElement = null; currentSelectedText = '';
            ct_copyPopupElement = null; ct_feedbackElement = null; ct_currentHoveredTag = null; ct_currentTagText = '';
            ct_showTimeout = null; ct_hideTimeout = null; ct_feedbackTimeout = null; ct_listenerTarget = null;
            tp_editorContainer = null; tp_triggerButtonRef.element = null; tp_cutButtonRef.element = null; tp_pasteButtonRef.element = null;
            tp_storedHTML = ''; tp_storedText = ''; tp_ctrlApressed = false; tp_listenersAttached = false; // Ensure TP listener flag reset
            togglePanelElement = null; toggleTriggerElement = null; togglePanelHideTimeout = null; historyItemKeyListenerAttached = false; // Reset flag

        } catch (cleanupError) {
            console.warn('[Mubu Cleanup] Error during cleanup:', cleanupError); // Keep warn
        }
        console.log(`[Mubu Combined Helper v${GM_info.script.version}] Cleanup complete.`); // Keep log
    }

    // --- Initialization Trigger ---
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, config.initDelay);
    } else {
        window.addEventListener('DOMContentLoaded', () => setTimeout(init, config.initDelay), { once: true });
    }

})();