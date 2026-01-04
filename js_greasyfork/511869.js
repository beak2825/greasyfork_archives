// ==UserScript==
// @name         Cyberbiz 後台商品規格收合/展開 (穩定版)
// @namespace    https://iflyer.tw
// @version      2025-9-19
// @description  自動收合多餘的商品規格，點擊按鈕展開/收合，避免表格過長
// @author       飛鵝數位
// @match        https://*.cyberbiz.co/admin/products
// @exclude      https://*.cyberbiz.co/admin/products/*
// @grant        none
// @run-at       document-end
// @license      CC-BY-NC-SA-4.0
// @downloadURL https://update.greasyfork.org/scripts/511869/Cyberbiz%20%E5%BE%8C%E5%8F%B0%E5%95%86%E5%93%81%E8%A6%8F%E6%A0%BC%E6%94%B6%E5%90%88%E5%B1%95%E9%96%8B%20%28%E7%A9%A9%E5%AE%9A%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/511869/Cyberbiz%20%E5%BE%8C%E5%8F%B0%E5%95%86%E5%93%81%E8%A6%8F%E6%A0%BC%E6%94%B6%E5%90%88%E5%B1%95%E9%96%8B%20%28%E7%A9%A9%E5%AE%9A%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const tdSelectors = [
        'td.product_variants',
        'td.product_price',
        'td.product_compare_at_price',
        'td.product_variants_inventory_quantity',
        'td.product_variants_sold'
    ];

    function processTd(td) {
        if (td.dataset.processed === "true") return;

        // 只處理 <div class="productVariant">
        const rows = td.querySelectorAll('div.productVariant');
        if (rows.length > 3) {
            const hiddenRows = Array.from(rows).slice(3);
            hiddenRows.forEach(div => div.style.display = 'none');

            // 建立展開/收合按鈕
            const btn = document.createElement('button');
            btn.textContent = `顯示更多 (${hiddenRows.length})`;
            btn.style.marginTop = '5px';
            btn.style.cursor = 'pointer';
            btn.style.background = '#f9f9f9';
            btn.style.border = '1px solid #ccc';
            btn.style.padding = '2px 6px';
            btn.style.fontSize = '12px';

            btn.addEventListener('click', () => {
                const isHidden = hiddenRows[0].style.display === 'none';
                hiddenRows.forEach(div => div.style.display = isHidden ? '' : 'none');
                btn.textContent = isHidden ? '收合' : `顯示更多 (${hiddenRows.length})`;
            });

            td.appendChild(btn);
            console.log(`[收合腳本] ${td.className} 已隱藏 ${hiddenRows.length} 個`);
        }

        td.dataset.processed = "true";
    }

    function limitDivs() {
        tdSelectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(processTd);
        });
    }

    // 初始執行
    limitDivs();

    // 監聽 SPA 動態載入
    let timer;
    const observer = new MutationObserver(() => {
        clearTimeout(timer);
        timer = setTimeout(limitDivs, 300);
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();
