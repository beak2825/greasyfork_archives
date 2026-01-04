// ==UserScript==
// @name         Alpha備貨查詢
// @namespace    http://tampermonkey.net/
// @version      1.6.2
// @description  六角國際公司內部網站Alpha使用的腳本
// @match        http://192.168.11.24/lkfr19.php
// @match        http://192.168.11.25/lkfr19.php
// @match        http://192.168.11.26/lkfr19.php
// @match        http://192.168.11.27/lkfr19.php
// @match        http://192.168.11.85/lkfr19.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486361/Alpha%E5%82%99%E8%B2%A8%E6%9F%A5%E8%A9%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/486361/Alpha%E5%82%99%E8%B2%A8%E6%9F%A5%E8%A9%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 創建浮動窗口
    const floatingWindow = document.createElement('div');
    floatingWindow.style.position = 'fixed';
    floatingWindow.style.top = '10px';
    floatingWindow.style.left = '10px';
    floatingWindow.style.zIndex = '9999'; //讓UI呈現在最上面
    floatingWindow.style.backgroundColor = '#ffffff';
    floatingWindow.style.border = '1px solid #ddd';
    floatingWindow.style.padding = '10px';
    floatingWindow.style.borderRadius = '5px';
    floatingWindow.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    floatingWindow.style.display = 'flex';
    floatingWindow.style.alignItems = 'flex-start';
    floatingWindow.style.flexDirection = 'column';
    floatingWindow.style.gap = '8px'; // 設置按鈕之間的間距
    document.body.appendChild(floatingWindow);

    // 按鈕列表
    const buttons = [
        { text: '明細D+2', desiredOptions: ['All'] },
        { text: '麵包D+2', desiredOptions: ['PB004', 'PB013', 'PB014', 'PB015', 'PB016', 'PB017', 'PB018', 'PB020', 'PB025', 'PB026', 'PB027', 'PB028', 'PB030', 'PC011'] },
        { text: '西點D+2', desiredOptions: ['PB030', 'PC001', 'PC003', 'PC002', 'PC004', 'PC005', 'PC006', 'PC007', 'PC008', 'PC009', 'PC010', 'PC011'] },
        { text: '西點D+3', desiredOptions: ['PB030', 'PC001', 'PC003', 'PC002', 'PC004', 'PC005', 'PC006', 'PC007', 'PC008', 'PC009', 'PC010', 'PC011'] },
        { text: '春上D+8', desiredOptions: ['PB012'] , requiresFriday: true } // 新增 requiresFriday 屬性
    ];

    // 檢查今天是否為星期五
    const today = new Date();
    const isFriday = today.getDay() === 5;

    // 將按鈕添加到浮動窗口中
    buttons.forEach(button => {
        const buttonElement = document.createElement('button');
        buttonElement.textContent = button.text;

        // 按鈕樣式設置
        buttonElement.style.padding = '10px 20px';
        buttonElement.style.border = '1px solid #007bff';
        buttonElement.style.borderRadius = '5px';
        buttonElement.style.backgroundColor = '#f0f8ff';
        buttonElement.style.color = '#007bff';
        buttonElement.style.fontSize = '14px';
        buttonElement.style.cursor = 'pointer';
        buttonElement.style.transition = 'background-color 0.3s, color 0.3s';

        // 設置「春上D+8」按鈕僅在星期五可用
        if (button.requiresFriday && !isFriday) {
            buttonElement.disabled = true;
            buttonElement.style.opacity = '0.3'; // 增加透明度顯示禁用狀態
            buttonElement.title = '此按鈕僅在星期五可用'; // 顯示提示
        }

        // 滑鼠懸停效果
        buttonElement.addEventListener('mouseover', () => {
            if (!buttonElement.disabled) {
                buttonElement.style.backgroundColor = '#007bff';
                buttonElement.style.color = '#ffffff';
            }
        });

        buttonElement.addEventListener('mouseout', () => {
            if (!buttonElement.disabled) {
                buttonElement.style.backgroundColor = '#f0f8ff';
                buttonElement.style.color = '#007bff';
            }
        });

        // 按鈕點擊事件
        // 將按鈕點擊事件的部分更新為：
        buttonElement.addEventListener('click', () => {
            if (buttonElement.disabled) return; // 若按鈕被禁用則不執行後續操作
            selectOptions(button.desiredOptions);

            // 每次點擊重新定義新的 today，避免累加
            const today = new Date();
            let targetDate = new Date(today);

            if (button.text === '西點D+3') {
                targetDate.setDate(today.getDate() + 3);
                document.getElementById('edTA203A').value = targetDate.toISOString().slice(0, 10).replace(/-/g, '');
                document.getElementById('edTA203B').value = '';
            } else if (button.text === '春上D+8') {
                // 計算起始日期
                targetDate.setDate(today.getDate() + 2); // 2024-12-01
                document.getElementById('edTA203A').value = targetDate.toISOString().slice(0, 10).replace(/-/g, '');
                // 計算結束日期，基於 targetDate 增加 6 天
                const endDate = new Date(targetDate);
                endDate.setDate(targetDate.getDate() + 6); // 2024-12-07
                document.getElementById('edTA203B').value = endDate.toISOString().slice(0, 10).replace(/-/g, '');
            } else {
                targetDate.setDate(today.getDate() + 2);
                document.getElementById('edTA203A').value = targetDate.toISOString().slice(0, 10).replace(/-/g, '');
                document.getElementById('edTA203B').value = '';
            }

            if (button.text === '明細D+2') {
                document.getElementById('RadioGroupBatch1_0').checked = true;
            } else {
                document.getElementById('RadioGroupBatch1_2').checked = true;
            }

            setTimeout(() => {
                const bbthcomplete = document.querySelector('#bbthcomplete div:nth-child(2)');
                bbthcomplete.click();
            }, 400);
        });


        floatingWindow.appendChild(buttonElement);
    });

    // 選擇選項的函數
    function selectOptions(desiredOptions) {
        const selectElement = document.getElementById('ListBoxMA002');

        if (desiredOptions[0] === 'All') {
            for (let i = 0; i < selectElement.length; i++) {
                selectElement.options[i].selected = true;
            }
            return;
        }

        for (let i = 0; i < selectElement.length; i++) {
            selectElement.options[i].selected = false;
        }

        for (let i = 0; i < selectElement.length; i++) {
            const optionElement = selectElement.options[i];
            if (desiredOptions.includes(optionElement.value)) {
                optionElement.selected = true;
            }
        }
    }
})();
