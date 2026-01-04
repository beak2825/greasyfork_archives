// ==UserScript==
// @name         TikTok Live Blocking & Filtering
// @name:zh-TW   TikTok 直播封鎖過濾
// @name:zh-CN   TikTok 直播封锁过滤
// @namespace    https://www.tampermonkey.net/
// @version      3.6
// @description  Supports live room blocking, recommendation feed filtering, floating block button on homepage, and block list management features.
// @description:zh-TW 支援直播間封鎖、推薦區過濾、主頁懸浮封鎖按鈕、封鎖清單管理功能
// @description:zh-CN 支援直播间封锁、推荐区过滤、主页悬浮封锁按钮、封锁清单管理功能
// @author       Hzbrrbmin + ChatGPT
// @match        https://www.tiktok.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545431/TikTok%20Live%20Blocking%20%20Filtering.user.js
// @updateURL https://update.greasyfork.org/scripts/545431/TikTok%20Live%20Blocking%20%20Filtering.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ======= ✅ Toast 提示功能 =======
    // 顯示短暫訊息提示（浮動小視窗）
    function toast(msg) {
        const div = document.createElement('div');
        div.textContent = msg;
        div.style.cssText = `
            position: fixed;        /* 固定位置 */
            bottom: 20px;           /* 距離下方 20px */
            left: 50%;              /* 水平置中 */
            transform: translateX(-50%);
            background: rgba(0,0,0,0.75);
            color: white;
            padding: 10px 14px;
            border-radius: 6px;
            z-index: 10000;         /* 確保在最上層 */
            font-size: 14px;
            user-select: none;      /* 禁止文字選取 */
            pointer-events: none;   /* 不阻擋滑鼠事件 */
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
        `;
        document.body.appendChild(div);
        requestAnimationFrame(() => div.style.opacity = '1'); // 漸顯
        setTimeout(() => {
            div.style.opacity = '0'; // 漸隱
            div.addEventListener('transitionend', () => div.remove());
        }, 2500); // 2.5 秒後消失
    }

    // ======= 🟢 開關按鈕功能（ ON/OFF ） =======
    const SCRIPT_ENABLED_KEY = 'script_enabled'; // 儲存開關狀態的 Key
    let scriptEnabled = GM_getValue(SCRIPT_ENABLED_KEY, true); // 預設啟用

    // 插入頁面上開關按鈕
    function insertToggleButton() {
        const targetAnchor = document.querySelector('a.tiktok-104tlrh.link-a11y-focus');
        if (!targetAnchor) return; // 找不到目標位置就跳過
        if (document.getElementById('tiktok-script-toggle-btn')) return; // 已存在按鈕就跳過

        const btn = document.createElement('button');
        btn.id = 'tiktok-script-toggle-btn';
        btn.textContent = scriptEnabled ? 'ON' : 'OFF';
        btn.style.cssText = `
            margin-left: 8px;
            padding: 4px 10px;
            font-size: 16px;
            border-radius: 5px;
            border: none;
            cursor: pointer;
            background-color: ${scriptEnabled ? '#52c41a' : '#ff4d4f'};
            color: white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.15);
            user-select: none;
            transition: background-color 0.3s ease;
        `;
        // 點擊切換開關狀態
        btn.addEventListener('click', () => {
            scriptEnabled = !scriptEnabled;
            GM_setValue(SCRIPT_ENABLED_KEY, scriptEnabled);
            location.reload(); // 重新載入頁面
        });

        targetAnchor.parentElement.style.position = 'relative';
        targetAnchor.insertAdjacentElement('afterend', btn); // 按鈕放在目標後方
    }

    // 嘗試插入開關按鈕，如果還沒出現則重試
    function tryInsertToggleButton() {
        insertToggleButton();
        if (!document.getElementById('tiktok-script-toggle-btn')) {
            setTimeout(tryInsertToggleButton, 1000); // 每秒重試一次
        }
    }

    tryInsertToggleButton();

    if (!scriptEnabled) {
        console.log('⚠️ TikTok 直播封鎖過濾腳本已被用戶關閉，停止執行');
        return; // 如果關閉則停止後續執行
    }

    // ======= 🔒 封鎖邏輯處理與封鎖名單 =======
    const BLOCK_BTN_CLASS = 'tiktok-block-btn'; // 封鎖按鈕 class
    let blockedList = GM_getValue('blocked_list', []); // 封鎖名單

    function getBlockedList() {
        return blockedList; // 取得封鎖名單
    }

    function setBlockedList(list) {
        blockedList = list; // 更新封鎖名單
        GM_setValue('blocked_list', list);
    }

    // 從 URL Path 取得直播主 ID
    function getStreamerIDFromPath(path) {
        const match = path.match(/^\/@([^/]+)\/live/);
        return match ? match[1] : null;
    }

    // 取得當前直播主 ID
    function getStreamerID() {
        return getStreamerIDFromPath(window.location.pathname);
    }

    // 將當前直播主加入封鎖名單
    function addBlock() {
        const streamerID = getStreamerID();
        if (!streamerID) return toast('❌ 無法取得直播主ID');
        if (blockedList.includes(streamerID)) return toast(`⚠️ 直播主 ${streamerID} 已在封鎖名單中`);

        blockedList.unshift(streamerID);
        setBlockedList(blockedList);
        toast(`✅ 已將直播主 ${streamerID} 加入封鎖名單`);
    }

    // ======= 📌 懸浮式封鎖按鈕（直播畫面右上角，增加空隙） =======
    let floatingBtn = null;

    function removeFloatingBlockButton() {
    if (floatingBtn && floatingBtn.isConnected) {
        floatingBtn.remove();
    }
    floatingBtn = null;
    }

    function insertFloatingBlockButton() {
    const isLive = /^\/@[^/]+\/live/.test(location.pathname);

    if (!isLive) {
        removeFloatingBlockButton();
        return;
    }

    // 找直播畫面參照物
    const liveEl = document.querySelector('.css-112zjc7');
    if (!liveEl) {
        removeFloatingBlockButton();
        return;
    }

    if (floatingBtn) return;

    const btn = document.createElement('button');
    btn.className = (typeof BLOCK_BTN_CLASS === 'string' ? BLOCK_BTN_CLASS : 'tiktok-block-btn');
    btn.textContent = '🚫 封鎖直播主';
    btn.style.cssText = `
        position: absolute;
        top: 20px;                   /* 距離上方 20px */
        right: 20px;                 /* 距離右方 20px */
        background-color: #ff4d4f;
        color: white;
        border: none;
        padding: 6px 10px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        z-index: 9999;
    `;
    btn.addEventListener('click', addBlock);

    // 確保父元素是定位元素
    liveEl.style.position = 'relative';
    liveEl.appendChild(btn);

    floatingBtn = btn;
    }

    if (!window.__tt_live_btn_watch__) {
    window.__tt_live_btn_watch__ = setInterval(() => {
        insertFloatingBlockButton();
    }, 500);
    }

    insertFloatingBlockButton();

    // ======= 👀 判斷是否已封鎖 =======
    function isStreamerBlocked(streamerID) {
        return blockedList.includes(streamerID); // 是否在封鎖名單中
    }

    // ======= 🧹 隱藏推薦直播卡片（側欄與主頁） =======
    function hideBlockedRecommendations() {
        if (blockedList.length === 0) return;

    // 側欄直播卡片 (使用 data-e2e)
    const sideItems = document.querySelectorAll('div[data-e2e="live-side-nav-item"]');
    sideItems.forEach(item => {
        const anchor = item.querySelector('a[href*="/@"]');
        if (!anchor) return;

        const href = decodeURIComponent(anchor.getAttribute('href') || '');
        const streamerID = getStreamerIDFromPath(href);

        if (streamerID && isStreamerBlocked(streamerID)) {
            item.remove(); // 移除整個卡片
        }
    });

        // 主頁直播卡片
        const mainArea = document.querySelector('div.tiktok-i9gxme.eayczbk1');
        if (!mainArea) return;
        const mainAnchors = mainArea.querySelectorAll('a[href*="/@"][href*="/live"]');

        mainAnchors.forEach(anchor => {
            const href = decodeURIComponent(anchor.getAttribute('href') || '');
            const streamerID = getStreamerIDFromPath(href);
            if (streamerID && isStreamerBlocked(streamerID)) {
                const card = anchor.closest('div.tiktok-17fk2p9.esdn37i0');
                if (card) card.remove();
            }
        });
    }

    // ======= 🧱 主頁推薦區封鎖按鈕注入 =======
    function injectBlockButtonsToMainCards() {
        if (blockedList.length === 0) return;

        const mainArea = document.querySelector('div.tiktok-i9gxme');
        if (!mainArea) return;

        const cards = mainArea.querySelectorAll('div.tiktok-17fk2p9.esdn37i0');

        cards.forEach(card => {
            if (card.querySelector(`button.${BLOCK_BTN_CLASS}`)) return; // 已存在按鈕就跳過

            const anchor = card.querySelector('a[href*="/@"][href*="/live"]');
            if (!anchor) return;

            const href = decodeURIComponent(anchor.getAttribute('href') || '');
            const streamerID = getStreamerIDFromPath(href);
            if (!streamerID) return;

            if (isStreamerBlocked(streamerID)) {
                card.remove();
                return;
            }

            // 建立封鎖按鈕
            const btn = document.createElement('button');
            btn.textContent = '🚫 封鎖';
            btn.className = BLOCK_BTN_CLASS;
            btn.style.cssText = `
                position: absolute;      /* 絕對定位在卡片內 */
                top: 8px;
                right: 8px;
                z-index: 9999;
                background-color: #ff4d4f;
                color: white;
                border: none;
                padding: 4px 8px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 12px;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
            `;
            btn.onclick = () => {
                if (!blockedList.includes(streamerID)) {
                    blockedList.unshift(streamerID);
                    setBlockedList(blockedList);
                    toast(`✅ 已封鎖直播主 @${streamerID}`);
                }
                card.remove();
            };

            card.style.position = 'relative';
            card.appendChild(btn);
        });
    }

    // ======= 🧾 封鎖清單管理與清空 =======
    function showBlockedListAndEdit() {
        const PAGE_SIZE = 500;
        let currentPage = 0;

        function renderPage() {
            const list = getBlockedList();
            const totalPages = Math.ceil(list.length / PAGE_SIZE);

            if (list.length === 0) return toast('封鎖清單目前為空');

            const start = currentPage * PAGE_SIZE;
            const end = Math.min(start + PAGE_SIZE, list.length);
            const listStr = list.slice(start, end).map((id, i) => `${start + i + 1}. ${id}`).join('\n');

            const input = prompt(
                `📄 封鎖清單（第 ${currentPage + 1} 頁 / 共 ${totalPages} 頁）\n\n${listStr}\n\n` +
                `輸入欲剃除的「編號」（可用空格或逗號分隔）\n` +
                `輸入 > / < 可翻頁（下一頁 / 上一頁）：`
            );

            if (input === null) return;

            const trimmed = input.trim();
            if (trimmed === '>') {
                if (currentPage + 1 < totalPages) currentPage++;
                return renderPage();
            } else if (trimmed === '<') {
                if (currentPage > 0) currentPage--;
                return renderPage();
            }

            let indexes = trimmed.split(/[\s,]+/).map(s => parseInt(s.trim()))
                .filter(n => !isNaN(n) && n >= 1 && n <= list.length);

            if (indexes.length === 0) {
                toast('⚠️ 無有效編號，未變更');
                return;
            }

            indexes = [...new Set(indexes)].sort((a, b) => b - a); // 倒序刪除

            const newList = [...list];
            for (const idx of indexes) {
                newList.splice(idx - 1, 1);
            }

            setBlockedList(newList);
            toast(`✅ 已剃除 ${indexes.length} 位直播主`);
        }

        renderPage();
    }

    function clearBlockedList() {
        setBlockedList([]);
        toast('✅ 封鎖清單已清空');
    }

    // Tampermonkey 選單註冊
    GM_registerMenuCommand('編輯封鎖清單', showBlockedListAndEdit);
    GM_registerMenuCommand('清除所有封鎖用戶', clearBlockedList);

    // ======= 🔁 自動重試載入錯誤頁面 =======
    function autoRetryIfCrashed() {
        const errorContainer = document.querySelector('div.tiktok-17btlil');
        const errorIcon = errorContainer?.querySelector('svg');
        const retryButton = errorContainer?.querySelector('button.tiktok-1xrybjt.ebef5j00');
        if (errorContainer && errorIcon && retryButton) {
            console.log('⚠️ 偵測到頁面掛掉，嘗試點擊「重試」按鈕...');
            retryButton.click();
        }
    }

    // ======= 🧠 MutationObserver 觀察頁面變化 =======
    const observer = new MutationObserver(() => {
        insertFloatingBlockButton();     // 插入直播頁懸浮封鎖按鈕
        injectBlockButtonsToMainCards(); // 插入主頁封鎖按鈕
        hideBlockedRecommendations();    // 隱藏被封鎖卡片
        autoRetryIfCrashed();            // 自動重試掛掉頁面
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 監控瀏覽器歷史切換，切換頁面時重新插入浮動按鈕
    let lastPath = location.pathname;
    setInterval(() => {
        if (location.pathname !== lastPath) {
            lastPath = location.pathname;
            insertFloatingBlockButton();
        }
    }, 500);

})();
