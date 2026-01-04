// ==UserScript==
// @name         湛江寸金中医药学院隔壁的科技学院的教师评价半自动化脚本
// @namespace    http://tampermonkey.net/
// @version      2024-07-01
// @description  fuck zyh
// @author       by-猪粤花
// @match        https://newjwxt.zjkju.edu.cn/xspjgl/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zjkju.edu.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499374/%E6%B9%9B%E6%B1%9F%E5%AF%B8%E9%87%91%E4%B8%AD%E5%8C%BB%E8%8D%AF%E5%AD%A6%E9%99%A2%E9%9A%94%E5%A3%81%E7%9A%84%E7%A7%91%E6%8A%80%E5%AD%A6%E9%99%A2%E7%9A%84%E6%95%99%E5%B8%88%E8%AF%84%E4%BB%B7%E5%8D%8A%E8%87%AA%E5%8A%A8%E5%8C%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/499374/%E6%B9%9B%E6%B1%9F%E5%AF%B8%E9%87%91%E4%B8%AD%E5%8C%BB%E8%8D%AF%E5%AD%A6%E9%99%A2%E9%9A%94%E5%A3%81%E7%9A%84%E7%A7%91%E6%8A%80%E5%AD%A6%E9%99%A2%E7%9A%84%E6%95%99%E5%B8%88%E8%AF%84%E4%BB%B7%E5%8D%8A%E8%87%AA%E5%8A%A8%E5%8C%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
alert("begin");
(function() {
    'use strict';

    // 函数：填写表单
    function fillForm() {
        // 检查是否所有的“优秀”选项都已勾选
        const radios = document.querySelectorAll('input[type="radio"][data-dyf="95"]');
        let allChecked = true;
        radios.forEach(function(radio) {
            if (!radio.checked) {
                radio.checked = true;
                allChecked = false; // 如果有未勾选的，设置为false
            }
        });

        // 如果有未勾选的，填写文本框
        if (!allChecked) {
            document.querySelectorAll('textarea').forEach(function(textarea) {
                textarea.value = "好";
            });
        }
    }

    // 当页面加载完成后，立即填写表单
    window.onload = function() {
        fillForm();
    };

    // 设置一个定时器，周期性地检查表单是否需要再次填写
    setInterval(function() {
        fillForm();
    }, 1500); // 每5秒检查一次
})();
