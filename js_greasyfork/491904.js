// ==UserScript==
// @name         巴哈 文章範本儲存器 (本地)
// @namespace    https://www.youtube.com/c/ScottDoha
// @version      7.8
// @description  儲存文章範本到本地存儲並檢索
// @author       Scott
// @match        *://forum.gamer.com.tw/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_xmlhttpRequest

// @require      https://update.greasyfork.org/scripts/513138/1472653/LanguageTemplateManager.js

// @downloadURL https://update.greasyfork.org/scripts/491904/%E5%B7%B4%E5%93%88%20%E6%96%87%E7%AB%A0%E7%AF%84%E6%9C%AC%E5%84%B2%E5%AD%98%E5%99%A8%20%28%E6%9C%AC%E5%9C%B0%29.user.js
// @updateURL https://update.greasyfork.org/scripts/491904/%E5%B7%B4%E5%93%88%20%E6%96%87%E7%AB%A0%E7%AF%84%E6%9C%AC%E5%84%B2%E5%AD%98%E5%99%A8%20%28%E6%9C%AC%E5%9C%B0%29.meta.js
// ==/UserScript==



(function() {
    'use strict';

    // 檢測用戶操作系統語言，並加載對應的語言範本
    var userLang = navigator.language || navigator.userLanguage;

    // 使用外部語言範本函數庫
    var templates = window.languageTemplates(userLang);

    // 從本地存儲加載已保存的範本，若無則使用默認範本
    var savedTemplates = GM_getValue('savedTemplates', templates.templates);

    // 創建樣式表來定義範本相關的樣式
    var styleElement;

    function applyLanguageStyles(styles) {
        if (styleElement) {
            styleElement.remove();
        }
        styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }

    applyLanguageStyles(templates.styles.inputStyle);

    // 找到目標元素並插入兩個 <br> 分行標籤
    var targetElement = document.querySelector('div.c-post__body');
    if (targetElement) {
        for (var i = 0; i < 2; i++) {
            var br = document.createElement('br');
            targetElement.insertAdjacentElement('beforebegin', br);
        }
    }

    // 創建作者信息標籤
    var authorInfo = document.createElement('div');
    authorInfo.textContent = 'by Scottdoha';
    authorInfo.style.cssText = 'display: inline-block; margin-right: 20px; width: 200px; text-align: right;';

    // 創建範本選擇下拉框
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

    // 下拉框變更事件處理
    selectTemplate.addEventListener('change', function() {
        var selectedTemplateName = selectTemplate.value;
        var textarea = document.querySelector('textarea#source.form-control.main-editor.main-editor__source');
        if (textarea) {
            textarea.value = savedTemplates[selectedTemplateName];
            inputTemplateName.value = selectedTemplateName; // 更新輸入框
        } else {
            alert(templates.alerts.editorNotFound);
        }
    });

    // 創建輸入框供用戶輸入範本名稱
    var inputTemplateName = document.createElement('input');
    inputTemplateName.type = 'text';
    inputTemplateName.placeholder = templates.alerts.enterTemplateName;
    inputTemplateName.className = 'input-template';
    inputTemplateName.style.cssText = templates.styles.inputStyle;

    // 創建“保存範本”按鈕
    var saveButton = document.createElement('button');
    saveButton.textContent = templates.buttons.save;
    saveButton.style.marginRight = '5px';
    saveButton.addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();

        var templateName = inputTemplateName.value.trim() || selectTemplate.value;
        if (templateName === '') {
            alert(templates.alerts.enterTemplateName);
            return;
        }

        var textarea = document.querySelector('textarea#source.form-control.main-editor.main-editor__source');
        if (textarea) {
            savedTemplates[templateName] = textarea.value;
            GM_setValue('savedTemplates', savedTemplates);

            selectTemplate.innerHTML = '';
            for (var name in savedTemplates) {
                var option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                selectTemplate.appendChild(option);
            }
            alert(templates.alerts.saveSuccess);
        } else {
            alert(templates.alerts.editorNotFound);
        }
    });

    // 創建“刪除範本”按鈕
    var deleteButton = document.createElement('button');
    deleteButton.textContent = templates.buttons.delete;
    deleteButton.addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        var selectedTemplateName = selectTemplate.value;
        if (confirm(templates.alerts.deleteConfirm)) {
            delete savedTemplates[selectedTemplateName];
            GM_setValue('savedTemplates', savedTemplates);

            selectTemplate.innerHTML = '';
            for (var name in savedTemplates) {
                var option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                selectTemplate.appendChild(option);
            }
            alert(templates.alerts.deleteSuccess);
        }
    });

    // 創建輸入框和按鈕容器
    var inputContainer = document.createElement('div');
    inputContainer.style.marginTop = '0px';
    inputContainer.style.float = 'right';

    // 添加元素到容器
    inputContainer.appendChild(authorInfo);
    inputContainer.appendChild(selectTemplate);
    inputContainer.appendChild(inputTemplateName);
    inputContainer.appendChild(saveButton);
    inputContainer.appendChild(deleteButton);

    // 將容器添加到頁面中
    document.querySelector('.c-post__header h3').insertAdjacentElement('afterend', inputContainer);

    // 清除緩存的菜單命令
    GM_registerMenuCommand(templates.menuCommands.clearCache, function() {
        if (confirm(templates.alerts.clearCacheConfirmation)) {
            var userInput = prompt(templates.alerts.clearCachePrompt);
            if (userInput && userInput.toLowerCase() === 'delete') {
                GM_setValue('savedTemplates', {});
                alert(templates.alerts.clearCacheSuccess);
            } else {
                alert(templates.alerts.clearCacheCancel);
            }
        }
    });
})();