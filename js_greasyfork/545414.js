// ==UserScript==
// @name             WarEra: 戰爭勝利時間預估工具
// @name:en          WarEra: Battle Victory ETA
// @namespace        -
// @version          1.2.1-2025Aug12
// @description      自動計算目前戰爭雙方打下江山 (terrain) 數量並預計最快獲勝時間。（沒有發送任何 API 請求）
// @description:en   Automatically calculates the current terrain acquisition progress for both sides in the war and provides the estimated victory time. (No API requests are sent)
// @author           LianSheng
// @match            https://app.warera.io/*
// @grant            none
// @run-at           document-idle
// @license          MIT
// @downloadURL https://update.greasyfork.org/scripts/545414/WarEra%3A%20%E6%88%B0%E7%88%AD%E5%8B%9D%E5%88%A9%E6%99%82%E9%96%93%E9%A0%90%E4%BC%B0%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/545414/WarEra%3A%20%E6%88%B0%E7%88%AD%E5%8B%9D%E5%88%A9%E6%99%82%E9%96%93%E9%A0%90%E4%BC%B0%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const IDs = {
        container: "BattleLastTimeContainer",
        battle: "BattleLastTime",
        def: "DefendSide",
        atk: "AttackSide"
    };

    let updateIntervalId = null;

    // 攔截 History API，監聽路由切換
    function hookHistoryMethod(method) {
        const original = history[method];
        return function(...args) {
            const result = original.apply(this, args);
            window.dispatchEvent(new Event('locationchange'));
            return result;
        }
    }
    history.pushState = hookHistoryMethod('pushState');
    history.replaceState = hookHistoryMethod('replaceState');
    window.addEventListener('popstate', () => window.dispatchEvent(new Event('locationchange')));

    window.addEventListener('locationchange', () => {
        console.debug('[BattleLastTime] Location changed detected');
        scheduleUpdate();
    });

    // 用 MutationObserver 監控 #__next 裡 DOM 變化
    const nextRoot = document.querySelector('#__next');
    if (!nextRoot) {
        console.warn('[BattleLastTime] #__next element not found');
        return;
    }

    const observer = new MutationObserver(() => {
        scheduleUpdate();
    });
    observer.observe(nextRoot, { childList: true, subtree: true });

    // 用 requestIdleCallback + debounce 避免頻繁重複更新
    let scheduled = false;
    function scheduleUpdate() {
        if (scheduled) return;
        scheduled = true;
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                scheduled = false;
                updateBattleLastTime();
            }, {timeout: 200});
        } else {
            // fallback
            setTimeout(() => {
                scheduled = false;
                updateBattleLastTime();
            }, 200);
        }
    }

    // 主要更新函式
    function updateBattleLastTime() {
        if (location.href === "https://app.warera.io/battles") {
            removeBattleLastTime();
            return;
        }

        const target = document.querySelectorAll("#main-window div[style^='width'][style*='background-image']");

        if (target.length !== 2) {
            removeBattleLastTime();
            return;
        }

        const pps = [...target].map(e => {
            if (e.style.width === "1px") return 0;
            return Math.floor(parseFloat(e.style.width) * 2 * 3);
        });

        const parent = target[0]?.parentElement?.parentElement;
        if (!parent) {
            console.warn('[BattleLastTime] Parent element not found');
            removeBattleLastTime();
            return;
        }

        let container = document.getElementById(IDs.container);
        if (!container) {
            container = document.createElement('div');
            container.id = IDs.container;
            // 插入容器到 parent 最前面，避免被 React 重置
            parent.insertAdjacentElement('afterbegin', container);
        }

        // 只插入一次 BattleLastTime 結構
        if (!document.getElementById(IDs.battle)) {
            container.innerHTML = `
                <div id="${IDs.battle}" style="position: relative; width: 100%">
                    <div id="${IDs.def}" style="display: inline-block; padding: 0.5rem;">00:00:00</div>
                    <div id="${IDs.atk}" style="display: inline-block; padding: 0.5rem; position: absolute; right: 0;">00:00:00</div>
                </div>
            `;
        }

        const def = document.getElementById(IDs.def);
        const atk = document.getElementById(IDs.atk);
        if (!def || !atk) {
            console.warn('[BattleLastTime] DefendSide or AttackSide element missing');
            return;
        }

        // 清理舊計時器
        if (updateIntervalId) {
            clearInterval(updateIntervalId);
            updateIntervalId = null;
        }

        // 重新開始計時器更新時間
        updateIntervalId = setInterval(() => {
            const defTime = timeToReach300(pps[1], pps[0]) * 60;
            const atkTime = timeToReach300(pps[0], pps[1]) * 60;

            def.textContent = `${timeFormatter(defTime)} (~${300 - pps[0]})`;
            atk.textContent = `${timeFormatter(atkTime)} (~${300 - pps[1]})`;
        }, 100);
    }

    function removeBattleLastTime() {
        console.debug('[BattleLastTime] Removing battle time display');
        if (updateIntervalId) {
            clearInterval(updateIntervalId);
            updateIntervalId = null;
        }
        const container = document.getElementById(IDs.container);
        if (container) {
            container.remove();
        }
    }

    function timeToReach300(anotherSide, T) {
        let minutes = 0;
        let sideA = T;           // 我方
        let sideB = anotherSide; // 對方

        while (sideA < 300 && sideB < 300) {
            const total = Math.max(0, sideA) + Math.max(0, sideB);
            const zoneIndex = Math.floor(total / 100);
            const currentDelta = zoneIndex + 1;

            sideA += currentDelta;                     // 我方得地
            sideB = Math.max(0, sideB - currentDelta); // 對方失地但不低於 0
            minutes += 2;
        }

        return minutes;
    }

    function timeFormatter(sec) {
        const ss = String(sec % 60).padStart(2, "0");
        const mm = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
        const h = Math.floor(sec / 3600);
        return `${h}:${mm}:${ss}`;
    }

    // 頁面剛載入時初始化
    scheduleUpdate();
})();
