// ==UserScript==
// @name         覗きアリア削除
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  指定された浮動ボタン要素を検出し削除します。
// @author       まぃ姫 (MaiHime)
// @match        https://h5.g123.jp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520847/%E8%A6%97%E3%81%8D%E3%82%A2%E3%83%AA%E3%82%A2%E5%89%8A%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/520847/%E8%A6%97%E3%81%8D%E3%82%A2%E3%83%AA%E3%82%A2%E5%89%8A%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeFloatingButton() {
        const target = document.querySelector('div[data-testid="floating-button"]');
        if (target) {
            const img = target.querySelector('img[alt="Floating Button"], img[src*="aria-top-idel"]');
            if (img) {
                target.remove();
                console.log("Floating button を削除しました。");
            }
        }
    }

    // 初回試行
    removeFloatingButton();

    // DOMの変化を監視して、再出現した場合も削除
    const observer = new MutationObserver(() => {
        removeFloatingButton();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
