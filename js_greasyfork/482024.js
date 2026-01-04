// ==UserScript==
// @name         cspsjtest验证码自动填充
// @namespace    https://greasyfork.org/zh-CN/users/1232729
// @version      1.0
// @description  让cspsjtest登录无需验证码
// @author       include_c
// @match        *://cspsjtest.noi.cn/*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/482024/cspsjtest%E9%AA%8C%E8%AF%81%E7%A0%81%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/482024/cspsjtest%E9%AA%8C%E8%AF%81%E7%A0%81%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取目标字符串并填充到输入框
    function fillStringToInput() {
        var targetElement = document.getElementById('hiddenCheckCode'); // 替换为目标元素的ID
        var inputElement = document.getElementById('checkCode'); // 替换为目标输入框的ID

        if (targetElement && inputElement) {
            var value = targetElement.value;
            inputElement.value = value;
            console.log('已填充到输入框：' + value);
        }
    }

    // 在页面加载完成后执行
    window.addEventListener('load', function() {
        fillStringToInput();
    });
})();
