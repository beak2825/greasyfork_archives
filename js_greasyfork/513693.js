// ==UserScript==
// @name         智慧树自动提问脚本 互动分
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  智慧树自动获取问题并提问
// @author       SS7D
// @match        https://qah5.zhihuishu.com/qa.html
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/513693/%E6%99%BA%E6%85%A7%E6%A0%91%E8%87%AA%E5%8A%A8%E6%8F%90%E9%97%AE%E8%84%9A%E6%9C%AC%20%E4%BA%92%E5%8A%A8%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/513693/%E6%99%BA%E6%85%A7%E6%A0%91%E8%87%AA%E5%8A%A8%E6%8F%90%E9%97%AE%E8%84%9A%E6%9C%AC%20%E4%BA%92%E5%8A%A8%E5%88%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 定义获取问题和提问的函数
        const askQuestion = () => {
            // 获取问题元素
            const questionElements = document.querySelectorAll('.question-content');
            if (questionElements.length === 0) {
                console.log("未找到问题元素");
                return;
            }

            // 随机选择一个问题
            const randomIndex = Math.floor(Math.random() * questionElements.length);
            const selectedQuestion = questionElements[randomIndex].innerText.trim()+"是吗?";
            console.log("随机选择的问题:", selectedQuestion);

            // 点击提问按钮
            const askButton = document.querySelector('.ask-btn');
            if (askButton) {
                askButton.click();
                console.log("点击了提问按钮");

                // 等待输入框出现
                setTimeout(() => {
                    const inputBox = document.querySelector('.comment-input .el-textarea__inner');
                    if (inputBox) {
                        inputBox.value = selectedQuestion; // 填写问题
                        console.log("填写了问题:", selectedQuestion);

                        // 手动触发 input 事件以更新字数统计
                        const inputEvent = new Event('input', { bubbles: true });
                        inputBox.dispatchEvent(inputEvent);

                        // 增加半秒延时后点击发布按钮
                        setTimeout(() => {
                            const publishButton = document.querySelector('.up-btn');
                            if (publishButton) {
                                publishButton.click();
                                console.log("点击了发布按钮");
                            } else {
                                console.log("未找到发布按钮");
                            }
                        }, 500); // 半秒延时
                    } else {
                        console.log("未找到输入框");
                    }
                }, 1000); // 根据需要调整等待时间
            } else {
                console.log("未找到提问按钮");
            }
        };

        // 定时获取问题并提问
        setInterval(askQuestion, 3000); // 每5秒自动提问一次
    });
})();
