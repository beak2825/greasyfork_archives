// ==UserScript==
// @name         Hide Reservable Pavilion Filter for EXPO 2025
// @version      1.1
// @author       Kdroidwin
// @description  予約可能なパビリオンに絞り込む
// @match        https://ticket.expo2025.or.jp/*
// @grant        GM_addStyle
// @license      MIT
// @namespace https://greasyfork.org/users/1344730
// @downloadURL https://update.greasyfork.org/scripts/536805/Hide%20Reservable%20Pavilion%20Filter%20for%20EXPO%202025.user.js
// @updateURL https://update.greasyfork.org/scripts/536805/Hide%20Reservable%20Pavilion%20Filter%20for%20EXPO%202025.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 対象要素をCSSで非表示にする
    GM_addStyle(`
      .style_search_item_note__vExQQ,
      .style_event_links__jS3Q_,
      .style_search_item_row__moqWC:has(img[src*="calendar_none.svg"]) {
        display: none !important;
      }
    `);

    // Firefoxでは :has() が使えないため、JavaScriptで対応する（オプション）
    const hideItems = () => {
        const items = document.querySelectorAll('.style_search_item_row__moqWC');
        items.forEach(item => {
            const img = item.querySelector('img[src*="calendar_none.svg"]');
            if (img) {
                item.style.display = 'none';
            }
        });
    };

    // DOM の変化にも対応するために監視
    const observer = new MutationObserver(() => hideItems());
    observer.observe(document.body, { childList: true, subtree: true });

    hideItems();
})();