// ==UserScript==
// @name         Twitch聊天室自動展開v2
// @version      2.2
// @description  非全螢幕時自動展開聊天室
// @author      BaconEgg
// @match        https://www.twitch.tv/*
// @grant        none
// @namespace https://greasyfork.org/users/735944
// @downloadURL https://update.greasyfork.org/scripts/473671/Twitch%E8%81%8A%E5%A4%A9%E5%AE%A4%E8%87%AA%E5%8B%95%E5%B1%95%E9%96%8Bv2.user.js
// @updateURL https://update.greasyfork.org/scripts/473671/Twitch%E8%81%8A%E5%A4%A9%E5%AE%A4%E8%87%AA%E5%8B%95%E5%B1%95%E9%96%8Bv2.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // 獲取聊天室狀態 按鈕標籤
    const getChatState = () => {
        const label = state.button?.getAttribute('aria-label');
        if (!label) return 'unknown';
        if (label.indexOf('展開') >= 0) return 'collapsed';
        if (label.indexOf('摺疊') >= 0) return 'expanded';
        return 'unknown';
    };

    // 常數定義
    const BUTTON_SELECTOR = '[data-a-target="right-column__toggle-collapse-btn"]';
    const CHAT_CONTAINER_SELECTOR = '[data-a-target="right-column"]';
    const THEATER_MODE_SELECTOR = '.channel-page__video-player--theatre-mode';
    const THROTTLE_DELAY = 500; // 增加到 500ms 進一步降低 CPU 使用率

    // 狀態管理
    const state = {
        button: null,
        chatContainer: null,
        lastCombo: '',
        observer: null,
        isTheaterMode: false, // 快取劇院模式狀態
        pendingRAF: null // 追蹤 requestAnimationFrame
    };

    // 節流工具：確保函數不會高頻呼叫
    const throttle = (fn, delay) => {
        let lastCall = 0;
        let scheduled = null;
        return (...args) => {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                fn(...args);
            } else if (!scheduled) {
                scheduled = setTimeout(() => {
                    lastCall = Date.now();
                    scheduled = null;
                    fn(...args);
                }, delay - (now - lastCall));
            }
        };
    };

    // 快取按鈕元素
    const getButton = () => {
        if (state.button?.isConnected) return state.button;
        const chat = getChatContainer();
        if (chat) {
            state.button = chat.querySelector(BUTTON_SELECTOR);
            if (state.button?.isConnected) return state.button;
        }
        state.button = document.querySelector(BUTTON_SELECTOR);
        return state.button;
    };

    // 快取聊天室區塊
    const getChatContainer = () => {
        if (state.chatContainer?.isConnected) return state.chatContainer;
        state.chatContainer = document.querySelector(CHAT_CONTAINER_SELECTOR);
        return state.chatContainer;
    };

    // 檢查是否為劇院模式，並快取結果
    const checkTheaterMode = () => {
        state.isTheaterMode = !!document.querySelector(THEATER_MODE_SELECTOR);
        return state.isTheaterMode;
    };

    // 主要功能：只在狀態改變時才操作 DOM
    const updateChatVisibility = (trigger = '') => {
        try {
            const btn = getButton();
            if (!btn) return;

            const chatState = getChatState();
            const isFS = document.fullscreenElement !== null;
            const theater = state.isTheaterMode; // 使用快取的劇院模式狀態

            const combo = `${isFS}-${theater}-${chatState}`;
            if (combo === state.lastCombo) return;
            state.lastCombo = combo;

            // 取消任何已排程但尚未執行的 RAF
            if (state.pendingRAF) {
                cancelAnimationFrame(state.pendingRAF);
                state.pendingRAF = null;
            }

            if ((!isFS && chatState === 'collapsed') || (isFS && chatState === 'expanded')) {
                state.pendingRAF = requestAnimationFrame(() => {
                    btn.click();
                    state.pendingRAF = null;
                });
            }
        } catch (err) {
            console.error('[Twitch] Error updating chat visibility:', err);
        }
    };

    // 節流版本
    const throttledUpdateChatVisibility = throttle(updateChatVisibility, THROTTLE_DELAY);

    // 觀察器：只在必要時才更新，並用節流避免高頻率
    const startObserver = () => {
        if (state.observer) return;

        // 先檢查劇院模式狀態
        checkTheaterMode();

        const chat = getChatContainer();
        const target = chat || document.body;

        state.observer = new MutationObserver((mutations) => {
            if (!state.button?.isConnected) state.button = null;
            let needsUpdate = false;
            let theaterModeChanged = false;

            for (const mutation of mutations) {
                // 檢查按鈕狀態變化
                if (mutation.type === 'attributes' &&
                    mutation.attributeName === 'aria-label' &&
                    mutation.target.matches &&
                    mutation.target.matches(BUTTON_SELECTOR)) {
                    needsUpdate = true;
                    break;
                }

                // 檢查劇院模式變化
                if (mutation.type === 'attributes' &&
                    mutation.attributeName === 'class' &&
                    mutation.target.classList &&
                    mutation.target.classList.contains('channel-page__video-player')) {
                    theaterModeChanged = true;
                    needsUpdate = true;
                    break;
                }

                // 檢查按鈕是否新增
                if (mutation.type === 'childList' && !state.button) {
                    const addedNodes = Array.from(mutation.addedNodes);
                    if (addedNodes.some(node =>
                        node.nodeType === 1 &&
                        (node.matches?.(BUTTON_SELECTOR) || node.querySelector?.(BUTTON_SELECTOR)))) {
                        needsUpdate = true;
                        break;
                    }
                }
            }

            // 只在需要時更新劇院模式狀態
            if (theaterModeChanged) {
                checkTheaterMode();
            }

            if (needsUpdate) {
                throttledUpdateChatVisibility('Mutation');
            }
        });

        // 優化 MutationObserver 配置
        state.observer.observe(target, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['aria-label', 'class'],
            attributeOldValue: false
        });
    };

    // 初始化優化：只在按鈕存在時才啟動 observer
    const init = () => {
        // 延遲初始化，確保頁面完全載入
        setTimeout(() => {
            const btn = getButton();
            if (btn) {
                checkTheaterMode(); // 初始化時檢查劇院模式
                throttledUpdateChatVisibility('Init');
                startObserver();
            } else {
                // 如果按鈕不存在，設置一個一次性 MutationObserver 來等待按鈕出現
                const tempObserver = new MutationObserver((mutations, observer) => {
                    if (getButton()) {
                        observer.disconnect();
                        init(); // 按鈕出現後再次嘗試初始化
                    }
                });
                tempObserver.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: false
                });
            }
        }, 500); // 延遲 500ms 確保頁面元素已載入
    };

    // 事件監聽
    window.addEventListener('load', () => {
        init();

        // 全螢幕變化事件
        document.addEventListener('fullscreenchange', () => {
            throttledUpdateChatVisibility('Fullscreen');
        }, { passive: true });

        // 頁面可見性變化事件
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                // 頁面變為可見時，重新檢查劇院模式
                checkTheaterMode();
                throttledUpdateChatVisibility('Visibility');
            }
        }, { passive: true });
    }, { passive: true });
})();