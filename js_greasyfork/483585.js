// ==UserScript==
// @name         聯盟戰地快速選擇角色名稱查詢
// @namespace    http://tampermonkey.net/
// @version      2024-01-01
// @description  在角色名稱輸入框或下拉選單中進行查詢
// @author       You
// @match        https://tw-event.beanfun.com/MapleStory/UnionWebRank/*
// @icon         https://tw.beanfun.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483585/%E8%81%AF%E7%9B%9F%E6%88%B0%E5%9C%B0%E5%BF%AB%E9%80%9F%E9%81%B8%E6%93%87%E8%A7%92%E8%89%B2%E5%90%8D%E7%A8%B1%E6%9F%A5%E8%A9%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/483585/%E8%81%AF%E7%9B%9F%E6%88%B0%E5%9C%B0%E5%BF%AB%E9%80%9F%E9%81%B8%E6%93%87%E8%A7%92%E8%89%B2%E5%90%8D%E7%A8%B1%E6%9F%A5%E8%A9%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建 select 元素
    const selectElement = document.createElement('select');
    selectElement.setAttribute('id', 'charDropdown');

    // 添加选项
    const options = ['快速選擇', '天上的小傑', '哞唲c']; // 替換為你需要的選項
    options.forEach(optionText => {
        const option = document.createElement('option');
        option.textContent = optionText;
        selectElement.appendChild(option);
    });

    // 获取角色下拉所在的父容器
    const searchRow = document.querySelector('.row.search');
    if (searchRow) {
        const characterDropdownCol = document.createElement('div');
        characterDropdownCol.classList.add('col');
        characterDropdownCol.appendChild(selectElement);

        // 将 select 元素插入到角色下拉的位置
        searchRow.insertBefore(characterDropdownCol, searchRow.children[2]); // 这里的索引2是指原先角色输入框的位置
    }

    const charNameInput = document.querySelector('input[placeholder="請輸入角色名稱"]');
    const charDropdown = document.getElementById('charDropdown');
    const searchButton = document.querySelector('.row.search button');

    if (charNameInput && searchButton) {
        searchButton.addEventListener('click', function(event) {
            let selectedValue;
            if (charDropdown) {
                selectedValue = charDropdown.value;
                console.log('選擇的角色名稱：', selectedValue);
            } else {
                selectedValue = charNameInput.value;
                console.log('輸入的角色名稱：', selectedValue);
            }

            // 调用查询功能并传递选中的值或输入的值
            dispatchFindCharacter(selectedValue);
        });
    }

    // 添加事件监听器以将下拉选单的值填入输入框
    if (charDropdown && charNameInput) {
        charDropdown.addEventListener('change', function(event) {
            const selectedValue = event.target.value;

            // 創建一個新的 InputEvent 來填入輸入框
            const inputEvent = new InputEvent('input', {
                bubbles: true,
                cancelable: true,
                data: selectedValue,
                inputType: 'insertText'
            });

            // 將值填入輸入框並觸發 InputEvent
            charNameInput.value = selectedValue;
            charNameInput.dispatchEvent(inputEvent);
        });
    }

})();




