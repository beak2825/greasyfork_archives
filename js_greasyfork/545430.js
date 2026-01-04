// ==UserScript==
// @name         Twitch Auto Click Channel Points Chest and Statistics
// @name:zh-TW   Twitch 自動點擊忠誠點數寶箱和統計
// @name:zh-CN   Twitch 自动点击忠诚点数宝箱和统计
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  Automatically click the Twitch channel points chest, monitor all point increases, and reset the accumulated total when switching channels.
// @description:zh-TW 自動點擊 Twitch 忠誠點數寶箱，並監控所有點數增加，切換直播間累積歸零
// @description:zh-CN 自动点击 Twitch 忠诚点数宝箱，并监控所有点数增加，切换直播间累积归零
// @author       Hzbrrbmin + ChatGPT
// @match        https://www.twitch.tv/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545430/Twitch%20Auto%20Click%20Channel%20Points%20Chest%20and%20Statistics.user.js
// @updateURL https://update.greasyfork.org/scripts/545430/Twitch%20Auto%20Click%20Channel%20Points%20Chest%20and%20Statistics.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let totalPoints = 0; // 累積點數
    let lastUrl = location.href; // 記錄目前網址（用於偵測切台）
    const recentPopups = new Map(); // 替代原本的 Set（改用 Map 記錄每種分數的時間）
    let observer = null; // MutationObserver 實例

    // 🔧 建立統計面板元件
    function createPanel() {
        const panel = document.createElement('span');
        panel.id = 'my-loyalty-points-panel';
        panel.style.cssText = `
            background: #18181b;
            color: #FFD600;
            padding: 2px 6px;
            margin-left: 6px;
            border-radius: 6px;
            font-size: 14px;
            vertical-align: middle;
            display: inline-block;
            z-index: 9999;
        `;
        panel.innerText = `${totalPoints}`; //點數顯示
        return panel;
    }

    // 🔍 尋找點數主按鈕（寶箱旁）
    function findMainBtn() {
        return (
            document.querySelector('button[aria-label*="點數"]') ||
            document.querySelector('button[aria-label*="Points"]') ||
            document.querySelector('button[aria-label*="忠誠"]') ||
            document.querySelector('button[aria-label*="Channel"]')
        );
    }

    // 📌 將統計面板插入畫面
    function insertPanel() {
        const oldPanel = document.getElementById('my-loyalty-points-panel');
        if (oldPanel) oldPanel.remove();

        const mainBtn = findMainBtn();
        if (mainBtn && !mainBtn.querySelector('#my-loyalty-points-panel')) {
            const panel = createPanel();
            mainBtn.appendChild(panel);
            return true;
        }
        return false;
    }

    // ✏️ 更新面板上的數字
    function updatePanel() {
        let panel = document.getElementById('my-loyalty-points-panel');
        if (!panel) {
            insertPanel();
            panel = document.getElementById('my-loyalty-points-panel');
        }
        if (panel) panel.innerText = `${totalPoints}`; //點數顯示
    }

    // 📥 處理每一個提示彈窗（+10 +50 這種）
    function handlePopupNode(node) {
    if (
        node.classList &&
        node.classList.contains('Layout-sc-1xcs6mc-0')  // 只判斷這個基礎 class
    ) {
        const text = node.textContent.trim();
        const match = text.match(/^\+(\d+)\s*點?$/);
        if (match) {
            const now = Date.now();
            const last = recentPopups.get(text);
            if (last && now - last < 2000) return; // 2 秒內出現相同訊息 → 忽略
            recentPopups.set(text, now); // 更新此類訊息的最後時間

            const add = parseInt(match[1], 10);
            if (!isNaN(add)) {
                totalPoints += add;
                updatePanel();
            }
        }
    }
}
    // 🧿 初始化 MutationObserver，觀察彈窗出現
    function initObserver() {
    if (observer) observer.disconnect();

    observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (!(node instanceof HTMLElement)) continue;

                // 放寬條件，只要包含 Layout-sc-1xcs6mc-0 就監測
                if (node.classList && node.classList.contains('Layout-sc-1xcs6mc-0')) {
                    handlePopupNode(node);
                }

                node.querySelectorAll &&
                    node.querySelectorAll('.Layout-sc-1xcs6mc-0').forEach(handlePopupNode);
            }
        }
    });

    // 使用動畫幀延遲，確保 document.body 可用
    const startObserving = () => {
        if (!document.body) {
            requestAnimationFrame(startObserving);
            return;
        }
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    };
    startObserving();
}

    // 📛 判斷是否在 modal 對話框中（避免誤觸）
    function isInDialog(node) {
        while (node) {
            if (
                (node.getAttribute && node.getAttribute('role') === 'dialog') ||
                (node.classList && node.classList.contains('tw-modal'))
            ) {
                return true;
            }
            node = node.parentElement;
        }
        return false;
    }

    // 🟡 自動點擊寶箱（有獎勵可領時）
    function checkAndClickChest() {
        const iconDivs = document.querySelectorAll('.claimable-bonus__icon');
        for (const iconDiv of iconDivs) {
            const btn = iconDiv.closest('button');
            if (
                btn &&
                !btn.disabled &&
                btn.offsetParent !== null &&
                !isInDialog(btn)
            ) {
                btn.click(); // 點擊領取
                return;
            }
        }
    }

    // 🔁 切換頻道時，重置統計資料與監聽器
    function watchUrlChange() {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            totalPoints = 0;
            updatePanel();
            recentPopups.clear();
            initObserver(); // 重新啟用監聽器（確保新頁面也能抓到）
        }
    }

    // ✅ 等待 DOM 完整載入後再執行初始化
    function waitForDOMReady(callback) {
        const check = () => {
            if (document.readyState === 'complete') {
                callback();
            } else {
                requestAnimationFrame(check);
            }
        };
        check();
    }

    // 🧩 主邏輯啟動點
    function main() {
        waitForDOMReady(() => {
            insertPanel();
            updatePanel();
            initObserver();

            // 每 3 秒檢查一次：更新面板、點寶箱、檢查換台
            setInterval(() => {
                updatePanel();
                checkAndClickChest();
                watchUrlChange();
            }, 3000);
        });
    }

    main(); // ✅ 執行腳本
})();
