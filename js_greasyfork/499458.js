// ==UserScript==
// @name         2024远程研修自动答题
// @namespace    http://tampermonkey.net/
// @version      3.6
// @author       vettel
// @description  山东省教师教育网
// @match        *://www.qlteacher.com/
// @match        *://yxjc.qlteacher.com/project/yey2024/*
// @match        *://yxjc.qlteacher.com/project/xx2024/*
// @match        *://yxjc.qlteacher.com/project/cz2024/*
// @match        *://yxjc.qlteacher.com/project/gz2024/*
// @match        *://player.qlteacher.com/*
// @match        *://player.qlteacher.com/learning/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qlteacher.com
// @license      vettel
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499458/2024%E8%BF%9C%E7%A8%8B%E7%A0%94%E4%BF%AE%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/499458/2024%E8%BF%9C%E7%A8%8B%E7%A0%94%E4%BF%AE%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 辅助函数，检查元素文本内容是否包含测试关键字
    function containsTestKeyword(text) {
        return ['测试', '考试', '测试题'].some(keyword => text.includes(keyword));
    }

    // 辅助函数，检查是否存在包含测试关键字的弹窗
    function checkForTestPopup() {
        // 检查页面上是否有弹窗元素，这里以常见的弹窗类名 'modal' 为例
        var popupElements = document.querySelectorAll('.modal .ant-modal-body *');
        for (let element of popupElements) {
            if (containsTestKeyword(element.textContent)) {
                return true; // 找到包含测试关键字的弹窗
            }
        }
        return false; // 没有找到包含测试关键字的弹窗
    }

    function autoAnswer() {
        var urlPattern = /^https:\/\/player.qlteacher.com\/learning\/[^=]*/;
        if (document.URL.match(urlPattern) === document.URL) {
            // 检测是否有题目弹窗
            if (checkForTestPopup()) {
                // 题目弹窗存在，执行自动答题逻辑
                // 以下逻辑根据实际题目类型和页面结构进行调整

                // 示例：如果是单选题
                var singleChoiceOptions = document.querySelectorAll('.ant-radio-input');
                if (singleChoiceOptions.length > 0) {
                    singleChoiceOptions[Math.floor(Math.random() * singleChoiceOptions.length)].click();
                }

                // 示例：如果是多选题
                var multiChoiceOptions = document.querySelectorAll('.ant-checkbox');
                if (multiChoiceOptions.length > 0) {
                    multiChoiceOptions.forEach((option, index) => {
                        if (Math.random() < 0.5) { // 随机选择或不选择
                            option.click();
                        }
                    });
                }

                // 提交答案
                var submitButton = document.querySelector('button:contains("提交")');
                if (submitButton) {
                    submitButton.click();
                }

                // 检查是否完成答题并关闭窗口
                var completed = document.querySelector('.ant-modal-body .count-down') && document.querySelector('.ant-modal-body .count-down').innerText === "已完成";
                if (completed) {
                    window.close();
                }
            } else {
                console.log('没有检测到题目弹窗，不执行自动答题。');
            }
        }
    }

    // 定期执行自动答题功能
    setInterval(autoAnswer, 1000);
})();