// ==UserScript==
// @name         微店填充+自动弹窗问题
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Automatically fill name, ID number, and phone number fields in a form
// @author       72老师
// @match        https://weidian.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497100/%E5%BE%AE%E5%BA%97%E5%A1%AB%E5%85%85%2B%E8%87%AA%E5%8A%A8%E5%BC%B9%E7%AA%97%E9%97%AE%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/497100/%E5%BE%AE%E5%BA%97%E5%A1%AB%E5%85%85%2B%E8%87%AA%E5%8A%A8%E5%BC%B9%E7%AA%97%E9%97%AE%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 填写要自动填充的信息
    var formData = {
        name: "林宥嘉脚本测试",
        idNumber: "340322197310247629",
        phoneNumber: "13734259325"
    };

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 找到姓名输入框并填充姓名
        var nameInput = findAndFillInput('input[placeholder*="姓名"]', formData.name);

        // 找到身份证号输入框并填充身份证号
        var idNumberInput = findAndFillInput('input[placeholder*="身份证"]', formData.idNumber);

        // 找到手机号输入框并填充手机号
        var phoneInput = findAndFillInput('input[placeholder*="手机"]', formData.phoneNumber);

        // 查找包含文本“请选择”的元素并模拟点击
        clickSelectElement();
    });

    // 查找并填写输入框
    function findAndFillInput(selector, value) {
        var input = document.querySelector(selector);
        if (input) {
            simulateInput(input, value);
            return input;
        }
        return null;
    }

    // 模拟用户输入的函数
    function simulateInput(element, value) {
        element.focus(); // 焦点聚焦到输入框
        element.value = ""; // 清空输入框
        element.dispatchEvent(new Event('input', { bubbles: true })); // 触发 input 事件
        value.split('').forEach(function(character) { // 逐个字符输入
            element.value += character;
            element.dispatchEvent(new Event('input', { bubbles: true }));
        });
    }

    // 等待页面完全加载
    window.onload = function() {
        // 查找包含文本“请选择”的元素
        let selectElement = document.evaluate("//*[contains(text(),'请选择')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (selectElement) {
            // 模拟点击
            selectElement.click();
        }
    };
})();
