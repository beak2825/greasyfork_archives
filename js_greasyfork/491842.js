// ==UserScript==
// @name         NGA 文章範本儲存器 (本地)
// @namespace    https://www.youtube.com/c/ScottDoha
// @version      1.0
// @description  儲存文章範本到本地存儲並檢索
// @author       Scott
// @match        https://bbs.nga.cn/*
// @match        https://nga.178.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/491842/NGA%20%E6%96%87%E7%AB%A0%E7%AF%84%E6%9C%AC%E5%84%B2%E5%AD%98%E5%99%A8%20%28%E6%9C%AC%E5%9C%B0%29.user.js
// @updateURL https://update.greasyfork.org/scripts/491842/NGA%20%E6%96%87%E7%AB%A0%E7%AF%84%E6%9C%AC%E5%84%B2%E5%AD%98%E5%99%A8%20%28%E6%9C%AC%E5%9C%B0%29.meta.js
// ==/UserScript==
 
 
(function() {
    'use strict';
 
    // 初始範本
    var defaultTemplates = {
        "範本 1": "這是範本1的內容。",
        "範本 2": "這是範本2的內容。",
        "範本 3": "這是範本3的內容。",
        "範本 4": "這是範本4的內容。",
        "範本 5": "這是範本5的內容。"
    };
 
    // 加載已保存的範本或者使用初始範本
    var savedTemplates = GM_getValue('savedTemplates', defaultTemplates);
 
    // 創建範本下拉選單
    var selectTemplate = document.createElement('select');
    selectTemplate.id = 'templateSelect';
    selectTemplate.style.marginRight = '10px';
    selectTemplate.style.display = 'inline-block';
    selectTemplate.style.width = '100px'; // 自訂寬度為100px
 
    // 添加範本選項
    for (var templateName in savedTemplates) {
        var option = document.createElement('option');
        option.value = templateName;
        option.textContent = templateName;
        selectTemplate.appendChild(option);
    }
 
    // 範本下拉選單改變事件
    selectTemplate.addEventListener('change', function() {
        var selectedTemplateName = selectTemplate.value;
        var textarea = document.querySelector('textarea[name="post_content"]');
        textarea.value = savedTemplates[selectedTemplateName];
    });
 
    // 創建輸入框和保存按鈕的容器
    var inputContainer = document.createElement('div');
    inputContainer.style.marginTop = '0px'; // 更改上邊距為0px
    inputContainer.style.float = 'right'; // 將容器向右浮動
 
    // 添加作者信息
    var authorInfo = document.createElement('div');
    authorInfo.textContent = 'by Scottdoha';
    authorInfo.style.display = 'inline-block'; // 設置為 inline-block，使其和下拉選單處於同一行
    authorInfo.style.marginRight = '10px'; // 添加右邊距
 
    // 創建輸入框
    var inputTemplateName = document.createElement('input');
    inputTemplateName.type = 'text';
    inputTemplateName.placeholder = '範本名稱';
    inputTemplateName.style.marginRight = '5px'; // 輸入框右側間距
 
    // 創建保存按鈕
    var saveButton = document.createElement('button');
    saveButton.textContent = '保存範本';
    saveButton.style.marginRight = '5px'; // 按鈕右側間距
    saveButton.addEventListener('click', function() {
        var templateName = inputTemplateName.value.trim();
        if (templateName === '') {
            alert('請輸入範本名稱！');
            return;
        }
        var textarea = document.querySelector('textarea[name="post_content"]');
        savedTemplates[templateName] = textarea.value;
        GM_setValue('savedTemplates', savedTemplates);
        // 更新下拉選單中的選項
        selectTemplate.innerHTML = '';
        for (var templateName in savedTemplates) {
            var option = document.createElement('option');
            option.value = templateName;
            option.textContent = templateName;
            selectTemplate.appendChild(option);
        }
        alert('範本已保存！');
    });
 
    // 創建刪除按鈕
    var deleteButton = document.createElement('button');
    deleteButton.textContent = '刪除範本';
    deleteButton.addEventListener('click', function() {
        var selectedTemplateName = selectTemplate.value;
        if (confirm('確定要刪除選中的範本嗎？')) {
            delete savedTemplates[selectedTemplateName];
            GM_setValue('savedTemplates', savedTemplates);
            // 更新下拉選單中的選項
            selectTemplate.innerHTML = '';
            for (var templateName in savedTemplates) {
                var option = document.createElement('option');
                option.value = templateName;
                option.textContent = templateName;
                selectTemplate.appendChild(option);
            }
            alert('範本已刪除！');
        }
    });
 
    // 將範本下拉選單添加到輸入框和保存/刪除按鈕容器之前
    inputContainer.appendChild(authorInfo);
    inputContainer.appendChild(selectTemplate);
 
    // 將輸入框和保存按鈕添加到容器中
    inputContainer.appendChild(inputTemplateName);
    inputContainer.appendChild(saveButton);
    inputContainer.appendChild(deleteButton);
 
    // 添加輸入框和保存/刪除按鈕容器到 textarea 下方
    document.querySelector('input[type="file"]').insertAdjacentElement('beforebegin', inputContainer);
})();