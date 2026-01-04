// ==UserScript==
// @name         入荷登録画面 合計金額表示スクリプト
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Calculate total cost in Smaregi Inventory and display it in a new row at the end of the table.
// @author       You
// @match        https://inventory1.smaregi.jp/control/ic_storages/add
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511129/%E5%85%A5%E8%8D%B7%E7%99%BB%E9%8C%B2%E7%94%BB%E9%9D%A2%20%E5%90%88%E8%A8%88%E9%87%91%E9%A1%8D%E8%A1%A8%E7%A4%BA%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/511129/%E5%85%A5%E8%8D%B7%E7%99%BB%E9%8C%B2%E7%94%BB%E9%9D%A2%20%E5%90%88%E8%A8%88%E9%87%91%E9%A1%8D%E8%A1%A8%E7%A4%BA%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // テーブルのID
    const tableId = '#storageProductTable';

    // 各行のセレクタ
    const rowSelector = '#bindingTarget > tr';

    // 原価のinput要素のセレクタ
    const costInputSelector = '.product-cost.f.f-price';

    // 検品数のinput要素のセレクタ
    const quantityInputSelector = '.f.f-quantity.inspection-true';

    // 合計金額を表示する要素を作成
    function createTotalDisplay() {
        const totalDiv = `
            <div class="form-group">
                <div class="fg-label">
                    <span class="label-num">8</span>
                    <label for="IcShippingStaffName">合計金額</label>
                </div>
                <div class="fg-value">
                    <div class="form-control-static" id="totalAmount">0 円（税抜）</div>
                </div>
            </div>
        `;
        const formHorizontalDiv = document.querySelector('div.form-horizontal');
        formHorizontalDiv.insertAdjacentHTML('beforeend', totalDiv);
    }

    // 計算結果を表示するための新しい行を作成
    function createTotalRow(total) {
        const formattedTotal = total.toLocaleString(); // カンマを追加
        const newRow = document.createElement('tr');
        newRow.innerHTML = `<td colspan="5" style="text-align:right;">原価合計</td><td colspan="2" style="text-align:right;">￥ ${formattedTotal} (税抜)</td>`;
        return newRow;
    }

    // 合計金額を表示する
    function displayTotalAmount(total) {
        const formattedTotal = total.toLocaleString(); // カンマを追加
        const totalAmountDiv = document.getElementById('totalAmount');
        totalAmountDiv.textContent = `${formattedTotal} 円（税抜）`;
    }

    // 計算を実行して合計を表示
    function calculateTotal() {
        const rows = document.querySelectorAll(rowSelector);
        let total = 0;

        rows.forEach(row => {
            const costInput = row.querySelector(costInputSelector);
            const quantityInput = row.querySelector(quantityInputSelector);

            if (costInput && quantityInput) {
                const cost = parseFloat(costInput.value) || 0;
                const quantity = parseFloat(quantityInput.value) || 0;
                total += cost * quantity;
            }
        });

        // 既存の合計行があれば削除
        const existingTotalRow = document.querySelector('#totalRow');
        if (existingTotalRow) {
            existingTotalRow.remove();
        }

        // テーブルボディが存在する場合のみ、合計行を追加
        const tableBody = document.querySelector(`${tableId} tbody`);
        if (tableBody) {
            const totalRow = createTotalRow(total);
            totalRow.id = 'totalRow';
            tableBody.appendChild(totalRow);
        }

        // 合計金額を表示
        displayTotalAmount(total);
    }

    // debounce関数
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // 初期化
    createTotalDisplay(); // 合計金額表示用の要素を作成
    calculateTotal(); // ページ読み込み時に計算を実行

    // 原価や検品数が変更されたときに再計算
    document.addEventListener('input', debounce(calculateTotal, 300));

})();
