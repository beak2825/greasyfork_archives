// ==UserScript==
// @name         YouTube 超級留言金額統計
// @namespace    http://tampermonkey.net/
// @version      4.4
// @description  按鈕位置優化的多國貨幣統計工具
// @match        *://www.youtube.com/live_chat*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531561/YouTube%20%E8%B6%85%E7%B4%9A%E7%95%99%E8%A8%80%E9%87%91%E9%A1%8D%E7%B5%B1%E8%A8%88.user.js
// @updateURL https://update.greasyfork.org/scripts/531561/YouTube%20%E8%B6%85%E7%B4%9A%E7%95%99%E8%A8%80%E9%87%91%E9%A1%8D%E7%B5%B1%E8%A8%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 擴展貨幣匯率設定
    const CURRENCY_RATES = {
        '$': 1,       // 新台幣
        'US$': 33,    // 美元
        'SGD': 24.7,  // 新加坡幣
        'HK$': 4.25,  // 港幣
        '¥': 0.22,    // 日圓
        '£': 42,      // 英鎊
        '€': 35,      // 歐元
        'AU$': 20     // 澳幣
    };

    // 貨幣符號正則表達式模式
    const CURRENCY_PATTERN = '(SGD|US\\$|HK\\$|AU\\$|\\$|¥|£|€)';

    // 狀態管理
    const state = {
        totalAmount: GM_getValue('totalAmount', 0),
        totalCount: GM_getValue('totalCount', 0),
        isActive: GM_getValue('isActive', true),
        processedIds: new Set(JSON.parse(GM_getValue('processedIds', '[]')))
    };

    // 創建UI
    function createUI() {
        const style = document.createElement('style');
        style.textContent = `
            #sc-stats-window {
                position: fixed;
                top: 30px;
                left: 0px;
                background: transparent;
                border-radius: 5px;
                padding: 8px;
                font-family: Arial, sans-serif;
                font-size: 14px;
                min-width: 150px;
                z-index: 9999;
                border: none;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            #sc-stats-content {
                color: white;
                text-shadow:
                    -1px -1px 0 #000,
                    1px -1px 0 #000,
                    -1px 1px 0 #000,
                    1px 1px 0 #000;
                font-weight: bold;
                white-space: nowrap;
            }
            .sc-stats-btn {
                cursor: pointer;
                font-size: 14px;
                opacity: 0.8;
                color: white;
                text-shadow:
                    -1px -1px 0 #000,
                    1px -1px 0 #000,
                    -1px 1px 0 #000,
                    1px 1px 0 #000;
                font-weight: bold;
                white-space: nowrap;
            }
            .sc-stats-btn:hover {
                opacity: 1;
            }
            #sc-stats-toggle {
                position: fixed;
                top: 30px;
                left: 0px;
                width: 24px;
                height: 24px;
                background: transparent;
                border-radius: 3px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 9998;
                font-size: 14px;
                color: white;
                text-shadow:
                    -1px -1px 0 #000,
                    1px -1px 0 #000,
                    -1px 1px 0 #000,
                    1px 1px 0 #000;
                font-weight: bold;
                border: none;
            }
        `;
        document.head.appendChild(style);

        // 主視窗
        const window = document.createElement('div');
        window.id = 'sc-stats-window';
        window.style.display = state.isActive ? 'flex' : 'none';

        const content = document.createElement('div');
        content.id = 'sc-stats-content';
        content.textContent = `${state.totalAmount.toFixed(2)} (${state.totalCount})`;

        const resetBtn = document.createElement('span');
        resetBtn.className = 'sc-stats-btn';
        resetBtn.textContent = '重置';
        resetBtn.id = 'sc-reset-btn';

        const dollarBtn = document.createElement('span');
        dollarBtn.className = 'sc-stats-btn';
        dollarBtn.textContent = '$';
        dollarBtn.id = 'sc-dollar-btn';

        window.appendChild(dollarBtn);
        window.appendChild(content);
        window.appendChild(resetBtn);
        document.body.appendChild(window);

        // 切換按鈕
        const toggle = document.createElement('div');
        toggle.id = 'sc-stats-toggle';
        toggle.style.display = state.isActive ? 'none' : 'flex';
        toggle.textContent = '$';
        document.body.appendChild(toggle);

        // 事件監聽
        resetBtn.addEventListener('click', resetStats);
        dollarBtn.addEventListener('click', closeStats);
        toggle.addEventListener('click', openStats);
    }

    // 強化版金額解析器
    function parseAmount(text) {
        const cleanText = text.replace(/,/g, '').replace(/\s+/g, '');

        const prefixPattern = new RegExp(`^${CURRENCY_PATTERN}(\\d+\\.?\\d*)`);
        const suffixPattern = new RegExp(`(\\d+\\.?\\d*)${CURRENCY_PATTERN}$`);

        let match = cleanText.match(prefixPattern) || cleanText.match(suffixPattern);
        if (!match) return null;

        let currency, amount;
        if (match[1] && CURRENCY_RATES.hasOwnProperty(match[1])) {
            currency = match[1];
            amount = parseFloat(match[2]);
        } else if (match[2] && CURRENCY_RATES.hasOwnProperty(match[2])) {
            currency = match[2];
            amount = parseFloat(match[1]);
        } else {
            return null;
        }

        return {
            amount: amount,
            currency: currency,
            converted: amount * CURRENCY_RATES[currency]
        };
    }

    function processSuperChats() {
        if (!state.isActive) return;

        const paidMessages = document.querySelectorAll(`
            yt-live-chat-paid-message-renderer #purchase-amount,
            yt-live-chat-paid-sticker-renderer #purchase-amount-chip
        `);

        let hasUpdate = false;

        paidMessages.forEach(el => {
            const parent = el.closest('yt-live-chat-paid-message-renderer, yt-live-chat-paid-sticker-renderer');
            if (!parent || state.processedIds.has(parent.id)) return;

            const parsed = parseAmount(el.textContent);
            if (!parsed) return;

            state.processedIds.add(parent.id);
            state.totalAmount += parsed.converted;
            state.totalCount += 1;
            hasUpdate = true;
        });

        if (hasUpdate) {
            updateUI();
            saveStats();
        }

        if (state.processedIds.size > 1000) {
            const arr = Array.from(state.processedIds);
            state.processedIds = new Set(arr.slice(-500));
        }
    }

    function updateUI() {
        const content = document.getElementById('sc-stats-content');
        if (content) {
            content.textContent = `${state.totalAmount.toFixed(2)} (${state.totalCount})`;
        }
    }

    function resetStats() {
        state.totalAmount = 0;
        state.totalCount = 0;
        state.processedIds.clear();
        updateUI();
        saveStats();
    }

    function closeStats() {
        state.isActive = false;
        document.getElementById('sc-stats-window').style.display = 'none';
        document.getElementById('sc-stats-toggle').style.display = 'flex';
        saveStats();
    }

    function openStats() {
        state.isActive = true;
        document.getElementById('sc-stats-window').style.display = 'flex';
        document.getElementById('sc-stats-toggle').style.display = 'none';
        GM_setValue('isActive', true);
    }

    function saveStats() {
        GM_setValue('totalAmount', state.totalAmount);
        GM_setValue('totalCount', state.totalCount);
        GM_setValue('isActive', state.isActive);
        GM_setValue('processedIds', JSON.stringify(Array.from(state.processedIds)));
    }

    function init() {
        createUI();

        const fastObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1 && (
                        node.matches('yt-live-chat-paid-message-renderer') ||
                        node.matches('yt-live-chat-paid-sticker-renderer')
                    )) {
                        processSuperChats();
                        break;
                    }
                }
            }
        });

        const fullObserver = new MutationObserver(() => {
            processSuperChats();
        });

        const chatContainer = document.querySelector('#chat');
        if (chatContainer) {
            fastObserver.observe(chatContainer, {
                childList: true,
                subtree: true
            });

            fullObserver.observe(chatContainer, {
                childList: true,
                subtree: true
            });
        }

        setInterval(processSuperChats, 250);
    }

    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();