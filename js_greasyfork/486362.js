// ==UserScript==
// @name         Alpha出貨單複製日期查詢-自動修改日期
// @namespace    https://tampermonkey.net/
// @version      1.5.0
// @description  六角國際公司內部網站Alpha使用的腳本，自動修改指定欄位為今天+2天的日期（YYYYMMDD）格式，並可開關控制與條件篩選
// @author       WeiChia
// @match        http://192.168.11.24/lkfi57.php
// @match        http://192.168.11.25/lkfi57.php
// @match        http://192.168.11.26/lkfi57.php
// @match        http://192.168.11.27/lkfi57.php
// @match        http://192.168.11.85/lkfi57.php
// @match        http://192.168.11.24/lkfr41.php
// @match        http://192.168.11.25/lkfr41.php
// @match        http://192.168.11.26/lkfr41.php
// @match        http://192.168.11.27/lkfr41.php
// @match        http://192.168.11.85/lkfr41.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486362/Alpha%E5%87%BA%E8%B2%A8%E5%96%AE%E8%A4%87%E8%A3%BD%E6%97%A5%E6%9C%9F%E6%9F%A5%E8%A9%A2-%E8%87%AA%E5%8B%95%E4%BF%AE%E6%94%B9%E6%97%A5%E6%9C%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/486362/Alpha%E5%87%BA%E8%B2%A8%E5%96%AE%E8%A4%87%E8%A3%BD%E6%97%A5%E6%9C%9F%E6%9F%A5%E8%A9%A2-%E8%87%AA%E5%8B%95%E4%BF%AE%E6%94%B9%E6%97%A5%E6%9C%9F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // CSS 樣式（滑動開關）
    const style = document.createElement('style');
    style.textContent = `
    .switch {
        position: relative;
        display: inline-block;
        width: 46px;
        height: 24px;
    }
    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }
    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .4s;
        border-radius: 24px;
    }
    .slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
    }
    input:checked + .slider {
        background-color: #4CAF50;
    }
    input:checked + .slider:before {
        transform: translateX(22px);
    }
    `;
    document.head.appendChild(style);

    // 建立浮動視窗
    const floatingWindow = document.createElement('div');
    floatingWindow.style.position = 'fixed';
    floatingWindow.style.top = '10px';
    floatingWindow.style.left = '10px';
    floatingWindow.style.zIndex = '9999';
    floatingWindow.style.backgroundColor = '#ffffff';
    floatingWindow.style.border = '1px solid #ddd';
    floatingWindow.style.padding = '10px';
    floatingWindow.style.borderRadius = '5px';
    floatingWindow.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    floatingWindow.style.display = 'flex';
    floatingWindow.style.flexDirection = 'column';
    floatingWindow.style.gap = '8px';
    document.body.appendChild(floatingWindow);

    // 滑動開關元件
    const switchContainer = document.createElement('label');
    switchContainer.className = 'switch';
    const enableCheckbox = document.createElement('input');
    enableCheckbox.type = 'checkbox';
    enableCheckbox.checked = true;
    const slider = document.createElement('span');
    slider.className = 'slider';
    switchContainer.appendChild(enableCheckbox);
    switchContainer.appendChild(slider);

    // 標題 + 開關（並排）
    const headerRow = document.createElement('div');
    headerRow.style.display = 'flex';
    headerRow.style.alignItems = 'center';
    headerRow.style.gap = '10px';
    headerRow.appendChild(switchContainer);

    const title = document.createElement('div');
    title.textContent = '自動修改';
    title.style.fontWeight = 'bold';
    headerRow.appendChild(title);
    floatingWindow.appendChild(headerRow);

    // 修改日期文字
    const dateLabel = document.createElement('div');
    dateLabel.textContent = '修改日期：';
    floatingWindow.appendChild(dateLabel);

    // 日期選擇器
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    const initDate = new Date();
    initDate.setDate(initDate.getDate() + 2);
    dateInput.value = initDate.toISOString().split('T')[0];
    floatingWindow.appendChild(dateInput);

    // 條件下拉選單
    const selectLabel = document.createElement('label');
    selectLabel.textContent = '條件選擇：';
    const selectInput = document.createElement('select');
    const options = [
        { value: '1', text: '=' },
        { value: '2', text: '>=' },
        { value: '7', text: 'like' }
    ];
    options.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.text;
        selectInput.appendChild(option);
    });
    selectInput.value = '7';
    floatingWindow.appendChild(selectLabel);
    floatingWindow.appendChild(selectInput);

    // 控制欄位顯示/隱藏
    function toggleFields(enabled) {
        dateLabel.style.display = enabled ? 'block' : 'none';
        dateInput.style.display = enabled ? 'block' : 'none';
        selectLabel.style.display = enabled ? 'block' : 'none';
        selectInput.style.display = enabled ? 'block' : 'none';
        dateInput.disabled = !enabled;
        selectInput.disabled = !enabled;
    }

    // 初始狀態
    toggleFields(enableCheckbox.checked);

    // 開關變動時
    enableCheckbox.addEventListener('change', () => {
        toggleFields(enableCheckbox.checked);
    });

    // 日期更新
    function updateTargetDate() {
        const input = document.querySelector('#edWinOpen1_1');
        if (!input || !enableCheckbox.checked) return;

        const selectedDate = new Date(dateInput.value);
        const formattedDate = selectedDate.getFullYear() +
            ("0" + (selectedDate.getMonth() + 1)).slice(-2) +
            ("0" + selectedDate.getDate()).slice(-2);

        input.removeAttribute('readonly');
        input.disabled = false;
        input.value = formattedDate;
    }

    // 即時監聽
    dateInput.addEventListener('input', updateTargetDate);
    selectInput.addEventListener('change', () => {
        const select = document.querySelector('#CombWinOpen1_2');
        if (select) {
            select.value = selectInput.value;
        }
    });

    // 每 200ms 自動更新
    setInterval(() => {
        if (!enableCheckbox.checked) return;
        updateTargetDate();

        const select = document.querySelector('#CombWinOpen1_2');
        if (select) {
            select.value = selectInput.value;
        }
    }, 200);
})();
