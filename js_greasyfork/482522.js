// ==UserScript==
// @name         正方教务系统一键填写脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  一键填写脚本，用于学生快捷填写对教师的评价
// @author       lwjlwjlwjlwj
// @match        http://*/xs_main.aspx?*
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/482522/%E6%AD%A3%E6%96%B9%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E4%B8%80%E9%94%AE%E5%A1%AB%E5%86%99%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/482522/%E6%AD%A3%E6%96%B9%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E4%B8%80%E9%94%AE%E5%A1%AB%E5%86%99%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮
    var addButton = document.createElement('button');
    addButton.innerHTML = '一键填写';
    addButton.style.position = 'fixed';
    addButton.style.top = '10px';
    addButton.style.left = '10px';
    addButton.style.zIndex = '9999';
    document.body.appendChild(addButton);

    // 按钮点击事件
    addButton.addEventListener('click', function() {
        // 填写逻辑
        var selectElements = document.querySelectorAll('select');
        selectElements.forEach(function(selectElement, index) {
            var optionElements = selectElement.querySelectorAll('option');
            optionElements.forEach(function(optionElement) {
                if (index === selectElements.length - 1) {
                    if (optionElement.value === '良好') {
                        optionElement.selected = true;
                    }
                } else {
                    if (optionElement.value === '优秀') {
                        optionElement.selected = true;
                    }
                }
            });
        });

        // 查找提交按钮并点击
        var saveButton = document.querySelector('[value="保存"]');
        if (saveButton) {
            saveButton.click();
        }

        // 显示提示
        var messageDiv = document.createElement('div');
        messageDiv.innerHTML = '表单已自动填写并提交';
        messageDiv.style.position = 'fixed';
        messageDiv.style.bottom = '10px';
        messageDiv.style.left = '10px';
        messageDiv.style.padding = '10px';
        messageDiv.style.background = '#4CAF50';
        messageDiv.style.color = 'white';
        messageDiv.style.zIndex = '9999';
        document.body.appendChild(messageDiv);

        // 2秒后移除提示
        setTimeout(function() {
            document.body.removeChild(messageDiv);
        }, 2000);
    });

    // 等待 iframe 加载完成
    var iframeElement = document.getElementById('iframeautoheight');
    if (iframeElement) {
        iframeElement.onload = function() {
            // 获取 iframe 内部的文档
            var iframeDocument = iframeElement.contentDocument || iframeElement.contentWindow.document;

            // 在 iframe 内部查找所有 select 元素
            var selectElementsInIframe = iframeDocument.querySelectorAll('select');

            // 处理 select 元素
            selectElementsInIframe.forEach(function(selectElement) {
                // 这里执行你的逻辑，可以与外部的逻辑合并或分开
                console.log(selectElement);
            });
        };
    }
})();
