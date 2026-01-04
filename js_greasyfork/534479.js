// ==UserScript==
// @name         受発注可不可チェック
// @namespace    http://tampermonkey.net/
// @version      1.00
// @description  自己チェック用のチェックボックスをメインページ在庫表上部に配置し、受発注可不可設定画面にリマインダーとして表示
// @license      MIT
// @match        *://plus-nao.com/forests/*/mainedit/*
// @match        *://plus-nao.com/forests/*/registered_mainedit/*
// @match        *://plus-nao.com/forests/*/sku_check/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534479/%E5%8F%97%E7%99%BA%E6%B3%A8%E5%8F%AF%E4%B8%8D%E5%8F%AF%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/534479/%E5%8F%97%E7%99%BA%E6%B3%A8%E5%8F%AF%E4%B8%8D%E5%8F%AF%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = window.location.href;
    const codeMatch = url.match(/\/([^\/]+)$/);
    const code = codeMatch ? codeMatch[1] : null;
    if (!code) return;

    const stockStatusKey = 'outOfStockStatus_' + code;

    if (url.includes('/mainedit/') || url.includes('/registered_mainedit/')) {
        const targetTable = document.getElementById('stockSettingTable');
        if (!targetTable) return;

        const container = document.createElement('div');
        container.style.marginBottom = '10px';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.gap = '10px';

        const checkbox1 = document.createElement('input');
        checkbox1.type = 'checkbox';
        checkbox1.id = 'outOfStock';
        checkbox1.style.transform = 'scale(1.1)';
        checkbox1.style.margin = '0';

        const label1 = document.createElement('label');
        label1.htmlFor = 'outOfStock';
        label1.textContent = '欠品あり';
        label1.style.fontSize = '1.1em';

        const checkbox2 = document.createElement('input');
        checkbox2.type = 'checkbox';
        checkbox2.id = 'inStock';
        checkbox2.style.transform = 'scale(1.1)';
        checkbox2.style.margin = '0';

        const label2 = document.createElement('label');
        label2.htmlFor = 'inStock';
        label2.textContent = '欠品なし';
        label2.style.fontSize = '1.1em';

        container.appendChild(checkbox1);
        container.appendChild(label1);
        container.appendChild(checkbox2);
        container.appendChild(label2);

        targetTable.parentNode.insertBefore(container, targetTable);

        const savedStatus = sessionStorage.getItem(stockStatusKey);
        if (savedStatus === 'true') checkbox1.checked = true;
        if (savedStatus === 'false') checkbox2.checked = true;

        checkbox1.addEventListener('change', () => {
            if (checkbox1.checked) {
                checkbox2.checked = false;
                sessionStorage.setItem(stockStatusKey, 'true');
            } else if (!checkbox2.checked) {
                sessionStorage.removeItem(stockStatusKey);
            }
        });

        checkbox2.addEventListener('change', () => {
            if (checkbox2.checked) {
                checkbox1.checked = false;
                sessionStorage.setItem(stockStatusKey, 'false');
            } else if (!checkbox1.checked) {
                sessionStorage.removeItem(stockStatusKey);
            }
        });
    }

    if (url.includes('/sku_check/')) {
        const saved = sessionStorage.getItem(stockStatusKey);
        const formDot = document.querySelector('.formdot');
        if (!formDot) return;

        const display = document.createElement('div');
        display.textContent = `[${code}] 欠品状態: ` + (
            saved === 'true' ? 'あり' :
            saved === 'false' ? 'なし' :
            '未選択'
        );
        display.style.marginBottom = '10px';
        display.style.fontWeight = 'bold';
        display.style.textAlign = 'right';
        display.style.color =
            saved === 'true' ? 'red' :
            saved === 'false' ? 'green' :
            'gray';

        formDot.parentNode.insertBefore(display, formDot);

        window.addEventListener('beforeunload', () => {
            sessionStorage.removeItem(stockStatusKey);
        });
    }
})();