// ==UserScript==
// @name         农大职院一键评教
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  在评教页面自动选择“非常好”（100分）
// @author       idaidai
// @match        https://zyjwxt.imau.edu.cn/academic/eva/index/evaindexinfo.jsdo?*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497578/%E5%86%9C%E5%A4%A7%E8%81%8C%E9%99%A2%E4%B8%80%E9%94%AE%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/497578/%E5%86%9C%E5%A4%A7%E8%81%8C%E9%99%A2%E4%B8%80%E9%94%AE%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义一个函数，用于自动选择“非常好”（100分）
    function autoSelect() {
        console.log('开始自动选择');

        // 获取所有的表单
        var forms = document.querySelectorAll('form');

        // 检查是否找到表单
        if (forms.length === 0) {
            console.log('未找到表单');
            return;
        }

        // 遍历所有表单
        forms.forEach(function(form) {
            // 获取表单中的所有单选按钮
            var radios = form.querySelectorAll('input[type="radio"]');

            // 检查是否找到单选按钮
            if (radios.length === 0) {
                console.log('未找到单选按钮');
                return;
            }

            // 遍历所有单选按钮
            radios.forEach(function(radio) {
                // 如果单选按钮的值包含“100.0”，则选中它
                if (radio.value.startsWith('100.0')) {
                    radio.checked = true;
                    // 模拟点击事件以确保触发所有相关的事件处理程序
                    radio.click();
                    console.log('已选择 "非常好" (100分):', radio);
                }
            });

            // 在选择完成后，自动点击提交按钮
            setTimeout(function() {
                var submitButton = form.querySelector('input[type="button"][value="提 交"]');
                if (submitButton) {
                    submitButton.click();
                    console.log('已自动点击提交按钮');
                } else {
                    console.log('未找到提交按钮');
                }
            }, 100);
        });
    }

    // 等待特定的元素加载完毕后再执行自动选择的操作
    function waitForElement(selector, callback) {
        var interval = setInterval(function() {
            var element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                callback(element);
            }
        }, 100);
    }

    // 在评教页面等待表单加载完毕后执行自动选择
    waitForElement('form', function() {
        console.log('表单加载完毕');
        autoSelect();
    });
})();
