// ==UserScript==
// @name         自动填充表单
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Automatically fill name, ID number, and phone number fields in a form
// @author       72老师
// @match        https://weidian.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497203/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E8%A1%A8%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/497203/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E8%A1%A8%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 填写要自动填充的信息
    var formData = {
        姓名: "林宥嘉脚本测试",
        身份证: "320481199611111111",
        手机: "13911111111"
    };

    // 监控页面元素变化
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                fillForm();
            }
        });
    });

    // 启动监控
    observer.observe(document.body, { childList: true, subtree: true });

    // 填充表单
    function fillForm() {
        // 找到姓名输入框并填充姓名
        var nameInput = findAndFillInput('input[placeholder*="姓名"]', formData.姓名);
        
        // 找到身份证输入框并填充身份证
        var idInput = findAndFillInput('input[placeholder*="身份证"]', formData.身份证);
        
        // 找到手机输入框并填充手机
        var phoneInput = findAndFillInput('input[placeholder*="手机"]', formData.手机);
    }

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
})();
