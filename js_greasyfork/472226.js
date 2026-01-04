// ==UserScript==
// @name         表单缓存和自动填写脚本
// @namespace    autoform.scrpt.lukezh.cn
// @version      0.1
// @description  保存并自动填写表单内容
// @author       lukezh
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/472226/%E8%A1%A8%E5%8D%95%E7%BC%93%E5%AD%98%E5%92%8C%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/472226/%E8%A1%A8%E5%8D%95%E7%BC%93%E5%AD%98%E5%92%8C%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 从缓存中获取之前保存的表单数据
    var cachedData = GM_getValue('form_data', {});

    // 保存表单数据到缓存
    function saveFormData() {
        var formData = {};
        var inputElements = document.querySelectorAll('input, textarea');
        inputElements.forEach(function(element) {
            if (element.name && element.type !== 'submit') {
                formData[element.name] = element.value;
            }
        });
        GM_setValue('form_data', formData);
    }

    // 填充表单数据
    function fillForm() {
        var inputElements = document.querySelectorAll('input, textarea');
        inputElements.forEach(function(element) {
            if (element.name && element.type !== 'submit' && cachedData[element.name]) {
                element.value = cachedData[element.name];
            }
        });
    }

    // 在页面加载完毕后自动填写表单
    window.addEventListener('load', function() {
        fillForm();
    });

     在表单提交时保存数据
    var formElement = document.querySelector('form');
    if (formElement) {
        formElement.addEventListener('submit', function() {
            saveFormData();
        });
    }
})();