// ==UserScript==
// @name         eClass 名單下載器
// @namespace    https://yuntech.edu.tw/
// @version      1.1
// @author       Chat-GPT
// @description  插入按鈕下載學生名單為 CSV，風格與原頁一致，位置在權限按鈕之後
// @match        https://eclass.yuntech.edu.tw/*
// @icon         https://eclass.yuntech.edu.tw/static/assets/images/favicon-b420ac72.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532568/eClass%20%E5%90%8D%E5%96%AE%E4%B8%8B%E8%BC%89%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/532568/eClass%20%E5%90%8D%E5%96%AE%E4%B8%8B%E8%BC%89%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 等待 DOM 完整載入
    window.addEventListener('load', () => {
        // 1. 建立新按鈕
        const newButton = document.createElement('div');
        newButton.className = 'download-button button'; // 跟其他按鈕一樣扁平風格
        newButton.style.cursor = 'pointer';
        newButton.style.fontSize = '13px'; // 控制字體大小
        newButton.style.padding = '15px 15px'; // 控制內距（垂直6px、水平12px）
        newButton.style.height = '27px'; // 控制高度，與其他按鈕一致
        newButton.style.lineHeight = '24px'; // 垂直置中文字
        newButton.style.display = 'inline-flex'; // 保持與 icon 水平
        newButton.style.alignItems = 'center'; // icon 與文字垂直置中
        newButton.style.gap = '6px'; // icon 和文字間距
        newButton.innerHTML = `
            <i class="font font-download"></i>
            <span>下載當前顯示名單</span>
        `;

        // 2. 設定點擊事件 → 下載名單
        newButton.addEventListener('click', () => {
            const container = document.querySelector('.left-container');
            if (!container) {
                alert('⚠️ 找不到 .left-container 區塊，請確認是否在學生名單頁面');
                return;
            }

            const rows = container.querySelectorAll('.row.ng-scope');
            let csv = '姓名,學號\n';

            rows.forEach(row => {
                const name = row.querySelector('.name-cell')?.innerText.trim() || '';
                const id = row.querySelector('.user-no.margin-top-4')?.innerText.trim() || '';
                if (name && id) {
                    csv += `${name},${id}\n`;
                }
            });

            if (csv === '姓名|學號\n') {
                alert('⚠️ 沒有找到任何學生資料');
                return;
            }
            const BOM = '\uFEFF'; // 加入 BOM
            const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'student_list.csv';
            a.click();
            URL.revokeObjectURL(url);
        });

        // 3. 插入到「設定課程角色權限」按鈕之後
        const permissionBtn = document.querySelector('.permission-button.button');
        if (permissionBtn && permissionBtn.parentNode) {
            permissionBtn.parentNode.insertBefore(newButton, permissionBtn.nextSibling);
        }

    });
})();
