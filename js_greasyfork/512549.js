// ==UserScript==
// @name         巴哈姆特 文章範本儲存器 (本地)
// @name:zh-TW   巴哈姆特 文章範本儲存器 (本地)
// @name:zh-CN   巴哈姆特 文章模版存储器 (本地)
// @name:ja      バハムート 文章テンプレートストレージ（ローカル）
// @name:en      Bahamut Article Template Repository (Local)

// @version      1.3
// @author       Scott

// @description         儲存文章範本到本地儲存並供檢索
// @description:zh-TW   儲存文章範本到本地儲存並供檢索
// @description:zh-CN   存储文章模版到本地存储并供检索
// @description:ja      記事のテンプレートをローカルに保存して検索に使用します
// @description:en      Save article template to local storage for retrieval.

// @namespace    https://www.youtube.com/c/ScottDoha

// @match        *://forum.gamer.com.tw/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/512549/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%20%E6%96%87%E7%AB%A0%E7%AF%84%E6%9C%AC%E5%84%B2%E5%AD%98%E5%99%A8%20%28%E6%9C%AC%E5%9C%B0%29.user.js
// @updateURL https://update.greasyfork.org/scripts/512549/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%20%E6%96%87%E7%AB%A0%E7%AF%84%E6%9C%AC%E5%84%B2%E5%AD%98%E5%99%A8%20%28%E6%9C%AC%E5%9C%B0%29.meta.js
// ==/UserScript==


(function() {
    'use strict';
 
    // 檢測用戶操作系統語言
    var userLang = navigator.language || navigator.userLanguage;
 
    // 根據用戶語言初始化不同的默認模板
    window.defaultTemplates = {};
    
    if (userLang.startsWith('zh-CN')) { // 簡體中文
        window.defaultTemplates = {
            "模版 1": "这是模版1的内容。",
            "模版 2": "这是模版2的内容。",
            "模版 3": "这是模版3的内容。",
            "模版 4": "这是模版4的内容。",
            "模版 5": "这是模版5的内容。"
        };
    } else if (userLang.startsWith('zh')) { // 繁體中文
        window.defaultTemplates = {
            "範本 1": "這是範本1的內容。",
            "範本 2": "這是範本2的內容。",
            "範本 3": "這是範本3的內容。",
            "範本 4": "這是範本4的內容。",
            "範本 5": "這是範本5的內容。"
        };
    } else if (userLang.startsWith('en')) { // 英文
        window.defaultTemplates = {
            "Template 1": "This is the content of Template 1.",
            "Template 2": "This is the content of Template 2.",
            "Template 3": "This is the content of Template 3.",
            "Template 4": "This is the content of Template 4.",
            "Template 5": "This is the content of Template 5."
        };
    } else if (userLang.startsWith('ja')) { // 日文
        window.defaultTemplates = {
            "テンプレート 1": "これはテンプレート1の内容です。",
            "テンプレート 2": "これはテンプレート2の内容です。",
            "テンプレート 3": "これはテンプレート3の内容です。",
            "テンプレート 4": "これはテンプレート4の内容です。",
            "テンプレート 5": "これはテンプレート5の内容です。"
        };
    } else { // 默認使用英文
        window.defaultTemplates = {
            "Template 1": "This is the content of Template 1.",
            "Template 2": "This is the content of Template 2.",
            "Template 3": "This is the content of Template 3.",
            "Template 4": "This is the content of Template 4.",
            "Template 5": "This is the content of Template 5."
        };
    }
 
    // 加載已保存的範本或使用初始範本
    var savedTemplates = GM_getValue('savedTemplates', window.defaultTemplates);
 
    // 創建樣式表
    var style = document.createElement('style');
    style.textContent = `
        /* 使用嵌套選擇器提升優先級 */
        .c-post__header h3 .input-template {
            position: absolute !important;
            font-weight: bold !important; /* 確保字體加粗 */
            right: 205px !important;
            width: 80px !important;
            top: 20px !important;
            background-color: #272728 !important;
            color: white !important;
            border: none !important;
            z-index: 2 !important;
            display: inline-block !important;
        }
    `;
    document.head.appendChild(style);
 
    // 找到要插入 <br> 的元素
    var targetElement = document.querySelector('div.c-post__body');
    
    // 檢查目標元素是否存在
    if (targetElement) {
        // 創建兩個 <br> 標籤並插入到目標元素上方
        for (var i = 0; i < 2; i++) {
            var br = document.createElement('br');
            targetElement.insertAdjacentElement('beforebegin', br);
        }
    }
 
    // 創建作者信息
    var authorInfo = document.createElement('div');
    authorInfo.textContent = 'by Scottdoha';
    authorInfo.style.cssText = 'display: inline-block; margin-right: 20px; width: 200px; text-align: right;';
    
    // 創建下拉選擇框
    var selectTemplate = document.createElement('select');
    selectTemplate.className = 'dropdown-group dropdown-group-primary';
    selectTemplate.style.cssText = `
        margin-right: 10px;
        display: inline-block;
        width: 110px;
        right: 5px;
        color: transparent !important;
    `;
 
    // 添加範本選項
    for (var templateName in savedTemplates) {
        var option = document.createElement('option');
        option.value = templateName;
        option.textContent = templateName;
        selectTemplate.appendChild(option);
    }
 
    // 範本下拉選單改變事件處理
    selectTemplate.addEventListener('change', function() {
        var selectedTemplateName = selectTemplate.value;
        var iframe = document.querySelector('iframe#editor');
        if (iframe) {
            var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            var bodyElement = iframeDocument.querySelector('body.editstyle > div');
            if (bodyElement) {
                bodyElement.innerHTML = savedTemplates[selectedTemplateName];
                // 同時更新輸入框
                inputTemplateName.value = selectedTemplateName; // 更新輸入框為當前選中的範本名稱
            } else {
                alert('未找到具體的編輯器區域元素');
            }
        } else {
            alert('未找到 iframe 元素');
        }
    });
 
    // 初始化元素樣式
    var inputTemplateName = document.createElement('input');
    inputTemplateName.type = 'text';
    inputTemplateName.placeholder = '範本名稱';
    inputTemplateName.className = 'input-template';
    
    // 設置行內樣式以覆蓋頁面樣式
    inputTemplateName.style.cssText = `
        position: absolute !important;
        font-weight: bold !important; /* 確保字體加粗 */
        right: 205px !important;
        width: 80px !important;
        top: 20px !important;
        background-color: transparent !important;
        color: red !important;
        border: none !important;
        z-index: 2 !important;
        display: inline-block !important;
    `;
 
    // 創建“保存範本”按鈕
    var saveButton = document.createElement('button');
    saveButton.textContent = '保存範本';
    saveButton.style.marginRight = '5px';
    saveButton.addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        
        var templateName = inputTemplateName.value.trim() || selectTemplate.value;
        if (templateName === '') {
            alert('請輸入範本名稱！');
            return;
        }
 
        var iframe = document.querySelector('iframe#editor');
        if (iframe) {
            var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            var bodyElement = iframeDocument.querySelector('body.editstyle > div');
            if (bodyElement) {
                savedTemplates[templateName] = bodyElement.innerHTML;
                GM_setValue('savedTemplates', savedTemplates);
 
                selectTemplate.innerHTML = '';
                for (var name in savedTemplates) {
                    var option = document.createElement('option');
                    option.value = name;
                    option.textContent = name;
                    selectTemplate.appendChild(option);
                }
                alert('範本已保存！');
            } else {
                alert('未找到具體的編輯器區域元素');
            }
        } else {
            alert('未找到 iframe 元素');
        }
    });
 
    // 創建“刪除範本”按鈕
    var deleteButton = document.createElement('button');
    deleteButton.textContent = '刪除範本';
    deleteButton.addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        var selectedTemplateName = selectTemplate.value;
        if (confirm('確定要刪除選中的範本嗎？')) {
            delete savedTemplates[selectedTemplateName];
            GM_setValue('savedTemplates', savedTemplates);
 
            selectTemplate.innerHTML = '';
            for (var name in savedTemplates) {
                var option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                selectTemplate.appendChild(option);
            }
            alert('範本已刪除！');
        }
    });
 
    // 創建輸入框和按鈕容器
    var inputContainer = document.createElement('div');
    inputContainer.style.marginTop = '0px';
    inputContainer.style.float = 'right';
 
    // 添加元素到容器中
    inputContainer.appendChild(authorInfo);  // 添加作者信息
    inputContainer.appendChild(selectTemplate);
    inputContainer.appendChild(inputTemplateName);
    inputContainer.appendChild(saveButton);
    inputContainer.appendChild(deleteButton);
 
    // 將容器添加到頁面中
    document.querySelector('.c-post__header h3').insertAdjacentElement('afterend', inputContainer);
})();