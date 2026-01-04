// ==UserScript==
// @name         AtCoder Standings AC Time Formatter
// @namespace    bo9chan
// @version      1.0.1
// @description  AtCoderのコンテスト順位表に表示されるAC時間を "Dd H:MM:SS" にフォーマットする
// @author       bo9chan
// @supportURL   https://github.com/bo9chan/atcoder-standings-ac-time-formatter
// @match        https://atcoder.jp/contests/*/standings*
// @exclude      https://atcoder.jp/contests/*/standings/json
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523392/AtCoder%20Standings%20AC%20Time%20Formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/523392/AtCoder%20Standings%20AC%20Time%20Formatter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * @param {string} timeStr 時間を"MM:SS"の形式で指定した文字列
     * @returns {string} 時間を "Dd H:MM:SS", "H:MM:SS" または "M:SS" の形式で指定した文字列
     */
    function convertToDHMS(timeStr) {
        const [totalMinutes, seconds] = timeStr.split(':').map(Number);
        const secondsStr = String(seconds).padStart(2, '0');
        const minutes = totalMinutes % 60;
        const minutesStr = String(minutes).padStart(2, '0');
        const hours = Math.floor(totalMinutes / 60) % 24;
        const days = Math.floor(totalMinutes / (24 * 60));
        if (days > 0) {
            return `${days}d ${hours}:${minutesStr}:${secondsStr}`;
        } else if (hours > 0) {
            return `${hours}:${minutesStr}:${secondsStr}`;
        } else {
            return `${minutes}:${secondsStr}`;
        }
    }

    let targetNode = null;

    const handleMutation = () => {
        const selector1 = 'tr > td.standings-result > p:last-child';
        const selector2 = 'tr.standings-fa > td > p:last-child';
        // AC時間の要素を取得
        for (const selector of [selector1, selector2]) {
            const timeElements = targetNode.querySelectorAll(selector);
            if (timeElements.length > 0) {
                // AC時間のフォーマットを変換
                timeElements.forEach(el => {
                    const originalTime = el.textContent.trim();
                    if (originalTime.split(':').length == 2) {
                        const convertedTime = convertToDHMS(originalTime);
                        el.textContent = convertedTime;
                    }
                });
            }
        }
    };

    const parentHandleMutation = () => {
        targetNode = document.getElementById('standings-tbody');
        if (targetNode) {
            parentObserver.disconnect();
            const config = { childList: true, subtree: true };
            const observer = new MutationObserver((mutations, obs) => {
                // 再帰トリガーを止める
                obs.disconnect();
                // フォーマット処理を実行
                handleMutation();
                // 監視を再開
                obs.observe(targetNode, config);
            });
            handleMutation();
            observer.observe(targetNode, config);
        }
    }

    const parentTargetNode = document.getElementById('vue-standings');
    const parentConfig = { childList: true, subtree: true };
    const parentObserver = new MutationObserver(parentHandleMutation);
    parentObserver.observe(parentTargetNode, parentConfig);
})();
