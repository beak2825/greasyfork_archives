// ==UserScript==
// @name         Indeedアカウント名 全文表示
// @namespace    http://tampermonkey.net/
// @version      2025.11.23
// @description  Indeedアカウント名を全文表示＆テキスト選択可能化＋求人の企業名も選択可能(検索でフォーカス)
// @author       Kazumoto OHASHI
// @match        https://employers.indeed.com/*
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/ja/scripts/539749/versions/new
// @downloadURL https://update.greasyfork.org/scripts/539749/Indeed%E3%82%A2%E3%82%AB%E3%82%A6%E3%83%B3%E3%83%88%E5%90%8D%20%E5%85%A8%E6%96%87%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/539749/Indeed%E3%82%A2%E3%82%AB%E3%82%A6%E3%83%B3%E3%83%88%E5%90%8D%20%E5%85%A8%E6%96%87%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function adjustAccountDisplay() {
        // ボタン部分の処理
        document.querySelectorAll('div.css-c6ughv button[aria-label]').forEach(button => {
            if (button.dataset.fullTextApplied) return;

            Object.assign(button.style, {
                overflow: 'visible',
                textOverflow: 'unset',
                whiteSpace: 'normal',
                maxWidth: 'none',
                flex: 'unset',
                userSelect: 'text'
            });

            button.querySelectorAll('*').forEach(el => {
                Object.assign(el.style, {
                    overflow: 'visible',
                    textOverflow: 'unset',
                    whiteSpace: 'normal',
                    maxWidth: 'none',
                    flex: 'unset',
                    userSelect: 'text'
                });
            });

            button.dataset.fullTextApplied = "true";
        });

        // .css-bo1iy7 の処理
        document.querySelectorAll('.css-bo1iy7').forEach(el => {
            if (el.dataset.bo1iy7Applied) return;

            Object.assign(el.style, {
                textOverflow: 'unset',
                overflow: 'scroll'
            });

            el.dataset.bo1iy7Applied = "true";
        });
    }

    // スクロールバー非表示用スタイル追加（Chrome/mac/Win対応）
    const style = document.createElement('style');
    style.textContent = `
.css-bo1iy7 {
    scrollbar-width: none;
    -ms-overflow-style: none;
}
.css-bo1iy7::-webkit-scrollbar {
    display: none;
}
`;
    document.head.appendChild(style);

    let debounceTimer = null;
    const observer = new MutationObserver(() => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(adjustAccountDisplay, 300);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    adjustAccountDisplay();
})();



