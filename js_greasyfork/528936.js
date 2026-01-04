// ==UserScript==
// @name         mobile game remover（Netflix）
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description:en  Remove Netflix mobile game ads
// @description:zh-TW 移除 Netflix 手機版遊戲廣告
// @description:zh-CN 移除 Netflix 手机版游戏广告
// @author       WoodPig
// @match        https://www.netflix.com/browse
// @icon         https://www.google.com/s2/favicons?sz=64&domain=netflix.com
// @grant        none
// @license MIT
// @description Remove Netflix mobile game ads
// @downloadURL https://update.greasyfork.org/scripts/528936/mobile%20game%20remover%EF%BC%88Netflix%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/528936/mobile%20game%20remover%EF%BC%88Netflix%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    // 監視 document.body 的變化
    const observer = new MutationObserver(() => {
        removeGameBillBoard();
    });

    // 開始監視 DOM 變化
    observer.observe(document.body, { childList: true, subtree: true });

    function removeGameBillBoard() {
        // 找到目標元素
        const gameBillboards = document.querySelectorAll("div.billboard-row-games");
        const mobileGameRows = document.querySelectorAll("div.mobile-games-row");
        const volatileBillboards = document.querySelectorAll("div.volatile-billboard-animations-container");

        // 隱藏或移除目標元素
        gameBillboards.forEach(billboard => {
            if (billboard.parentElement) {
                billboard.parentElement.style.display = "none"; // 隱藏父元素
            }
            billboard.style.display = "none"; // 隱藏自身
        });

        mobileGameRows.forEach(mobileRow => {
            mobileRow.remove(); // 完全移除
        });

        volatileBillboards.forEach(volatile => {
            volatile.remove(); // 完全移除
        });
    }

})();
