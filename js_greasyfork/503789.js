// ==UserScript==
// @name         wcm发布文档页Input Value Saver
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Save and restore input values from localStorage
// @author       Your Name
// @match        http://10.5.41.14:8181/wcm/app/document/document_addedit.jsp?*
// @match        http://10.207.19.118:7001/wcm/app/document/document_addedit.jsp?*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503789/wcm%E5%8F%91%E5%B8%83%E6%96%87%E6%A1%A3%E9%A1%B5Input%20Value%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/503789/wcm%E5%8F%91%E5%B8%83%E6%96%87%E6%A1%A3%E9%A1%B5Input%20Value%20Saver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义输入框的ID
    const inputIds = ['ZHONGSHEN', 'FUSHEN', 'CHUSHEN'];



    // 检查三个输入框是否全部为空
    const allInputsEmpty = inputIds.every(id => {
        const inputElement = document.getElementById(id);
        return inputElement && inputElement.value.trim() === '';
    });

    if (allInputsEmpty) {
        console.log('所有输入框都为空，继续执行其他操作...');
        // 这里可以继续执行其他操作
        // 从localStorage读取并填充输入框
        inputIds.forEach(id => {
            const savedValue = localStorage.getItem(id);
            if (savedValue !== null) {
                document.getElementById(id).value = savedValue;
            }
        });
    }

    // 监听输入事件，将值存储到localStorage
    inputIds.forEach(id => {
        const inputElement = document.getElementById(id);
        if (inputElement) {
            inputElement.addEventListener('input', () => {
                localStorage.setItem(id, inputElement.value);
            });
        }
    });
})();
