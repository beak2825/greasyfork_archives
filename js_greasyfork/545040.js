// ==UserScript==
// @name         TVer - 長いタイトルをホバーでフル表示
// @name:en      TVer - Show full title on hover
// @namespace    https://tver.jp/
// @version      1.0
// @description  TVerの番組名やエピソードタイトルが省略されて表示されるとき、マウスオーバーで全文を表示します。
// @description:en  Show the full text of truncated TVer titles when hovering the mouse.
// @author       あなたの名前
// @match        https://tver.jp/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545040/TVer%20-%20%E9%95%B7%E3%81%84%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB%E3%82%92%E3%83%9B%E3%83%90%E3%83%BC%E3%81%A7%E3%83%95%E3%83%AB%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/545040/TVer%20-%20%E9%95%B7%E3%81%84%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB%E3%82%92%E3%83%9B%E3%83%90%E3%83%BC%E3%81%A7%E3%83%95%E3%83%AB%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 動的に追加される要素にも対応
    const observer = new MutationObserver(() => {
        document.querySelectorAll('div, span, a').forEach(el => {
            const style = window.getComputedStyle(el);
            if (style.textOverflow === 'ellipsis' && style.overflow === 'hidden') {
                if (!el.title && el.textContent.trim()) {
                    el.title = el.textContent.trim();
                }
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
