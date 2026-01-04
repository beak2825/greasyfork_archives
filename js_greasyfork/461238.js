// ==UserScript==
// @name         Twitch聊天室自動展開
// @version      1.5
// @description  自動展開聊天室
// @author      BaconEgg
// @match        https://www.twitch.tv/*
// @grant        none
// @namespace https://greasyfork.org/users/735944
// @downloadURL https://update.greasyfork.org/scripts/461238/Twitch%E8%81%8A%E5%A4%A9%E5%AE%A4%E8%87%AA%E5%8B%95%E5%B1%95%E9%96%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/461238/Twitch%E8%81%8A%E5%A4%A9%E5%AE%A4%E8%87%AA%E5%8B%95%E5%B1%95%E9%96%8B.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // 取得聊天室狀態 按鈕標籤
    const isChatCollapsed = () => {
        const label = state.button?.getAttribute('aria-label');
        return label && label.indexOf('展開') >= 0;
    };

    // 常數定義
    const BUTTON_SELECTOR = '[data-a-target="right-column__toggle-collapse-btn"]';
    const CHAT_CONTAINER_SELECTOR = '[data-a-target="right-column"]';
    const THROTTLE_DELAY = 500;

    // 狀態管理
    const state = {
        button: null,
        chatContainer: null,
        observer: null,
        pendingRAF: null
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

    // 主要功能：只要聊天室是摺疊就展開
    const updateChatVisibility = () => {
        try {
            const btn = getButton();
            if (!btn) return;
            if (isChatCollapsed()) {
                if (state.pendingRAF) cancelAnimationFrame(state.pendingRAF);
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
    const throttledUpdateChatVisibility = throttle(updateChatVisibility, THROTTLE_DELAY);

    // 觀察器：監控聊天室按鈕狀態
    const startObserver = () => {
        if (state.observer) return;
        const chat = getChatContainer();
        const target = chat || document.body;
        state.observer = new MutationObserver(() => {
            state.button = null;
            throttledUpdateChatVisibility();
        });
        state.observer.observe(target, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['aria-label']
        });
    };

    // 初始化
    const init = () => {
        setTimeout(() => {
            const btn = getButton();
            if (btn) {
                throttledUpdateChatVisibility();
                startObserver();
            } else {
                // 如果按鈕不存在，設置一次性 MutationObserver 等待按鈕出現
                const tempObserver = new MutationObserver((mutations, observer) => {
                    if (getButton()) {
                        observer.disconnect();
                        init();
                    }
                });
                tempObserver.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
        }, 500);
    };

    window.addEventListener('load', () => {
        init();
    }, { passive: true });
})();