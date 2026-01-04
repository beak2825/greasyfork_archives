// ==UserScript==
// @name         入荷データ参照画面 合計金額計算スクリプト
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  合計金額を計算し、表示するスクリプト
// @match        https://inventory1.smaregi.jp/control/ic_storages/inspect/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511130/%E5%85%A5%E8%8D%B7%E3%83%87%E3%83%BC%E3%82%BF%E5%8F%82%E7%85%A7%E7%94%BB%E9%9D%A2%20%E5%90%88%E8%A8%88%E9%87%91%E9%A1%8D%E8%A8%88%E7%AE%97%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/511130/%E5%85%A5%E8%8D%B7%E3%83%87%E3%83%BC%E3%82%BF%E5%8F%82%E7%85%A7%E7%94%BB%E9%9D%A2%20%E5%90%88%E8%A8%88%E9%87%91%E9%A1%8D%E8%A8%88%E7%AE%97%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 合計金額を表示する要素を作成
    const totalDiv = `
        <div class="form-group">
            <div class="fg-label">
                <span class="label-num">12</span>
                <label for="IcShippingStaffName">合計金額</label>
            </div>
            <div class="fg-value">
                <div class="form-control-static" id="totalAmount">0 円（税抜）</div>
            </div>
        </div>
    `;

    // div.form-horizontal に追加
    const formHorizontalDiv = document.querySelector('div.form-horizontal');
    formHorizontalDiv.insertAdjacentHTML('beforeend', totalDiv);

    // 数値をカンマ区切りにする関数
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // 合計金額を計算する関数
    function calculateTotal() {
        const orderTotal = [];
        const rows = document.querySelectorAll('#bindingTarget > tr');

        rows.forEach(row => {
            const costPrice = parseFloat(row.querySelector('td.num.cost-price > span').textContent) || 0;
            const quantity = parseFloat(row.querySelector('td.quantity.inspection-true > span').textContent) || 0;
            const total = costPrice * quantity;
            orderTotal.push(total);
        });

        const sum = orderTotal.reduce((acc, curr) => acc + curr, 0);
        document.getElementById('totalAmount').textContent = `${formatNumber(sum)} 円（税抜）`;
    }

    // DOMが完全に読み込まれた後に計算を実行
    window.addEventListener('load', calculateTotal);
})();
