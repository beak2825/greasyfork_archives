// ==UserScript==
// @name         内工大评教脚本2025（每个评教页面刷新一下）
// @namespace    http://tampermonkey.net/
// @version      2.3.1
// @description  自动填写评教内容(倒数第二题为“完全不符合”，其余为“完全符合”)（内蒙古工业大学专用）
// @author       YanShijie
// @match        https://imut.mycospxk.com/index.html*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521976/%E5%86%85%E5%B7%A5%E5%A4%A7%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC2025%EF%BC%88%E6%AF%8F%E4%B8%AA%E8%AF%84%E6%95%99%E9%A1%B5%E9%9D%A2%E5%88%B7%E6%96%B0%E4%B8%80%E4%B8%8B%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/521976/%E5%86%85%E5%B7%A5%E5%A4%A7%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC2025%EF%BC%88%E6%AF%8F%E4%B8%AA%E8%AF%84%E6%95%99%E9%A1%B5%E9%9D%A2%E5%88%B7%E6%96%B0%E4%B8%80%E4%B8%8B%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    function fillTextareaWithReactSync(textarea, value) {
        try {
            Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set.call(textarea, value);
            const changeEvent = new Event('input', { bubbles: true });
            textarea.dispatchEvent(changeEvent);
            console.log(`已填写内容并同步到 React：${value}`);
        } catch (error) {
            console.error(`填充文本框时出错: ${error}`);
        }
    }

    async function autoEvaluate() {
        console.log("开始自动评教...");
        await sleep(2000);

        const questions = document.querySelectorAll(".index__subjectItem--XWS1b");
        if (questions.length === 0) {
            console.log("未找到评教题目，请检查页面结构！");
            return;
        }

        // 提取所有包含单选框的题目
        const radioQuestions = [...questions].filter(q => q.querySelector(".ant-radio-group"));

        questions.forEach((question, index) => {
            console.log(`正在处理第 ${index + 1} 题...`);

            // 单选题处理逻辑
            const radioGroup = question.querySelector(".ant-radio-group");
            if (radioGroup) {
                const isSecondToLastRadio =
                    radioQuestions.indexOf(question) === radioQuestions.length - 2;

                const valueToSelect = isSecondToLastRadio ? "5" : "1";
                const option = radioGroup.querySelector(`input[value="${valueToSelect}"]`);
                if (option) {
                    option.click();
                    console.log(`第 ${index + 1} 题已选择 value="${valueToSelect}"`);
                } else {
                    console.log(`第 ${index + 1} 题未找到 value="${valueToSelect}"`);
                }
            }

            // 填写文本框
            const textarea = question.querySelector("textarea.ant-input");
            if (textarea) {
                const textContent = index === questions.length - 2
                    ? "课程内容丰富，教师授课认真负责，非常满意！"
                    : index === questions.length - 1
                    ? "暂无改进建议，课程内容和教学方法非常满意！"
                    : "";
                fillTextareaWithReactSync(textarea, textContent);
            }
        });

        console.log("评教内容填写完成，请手动检查并提交！");
        alert("评教内容已自动填写，请检查后手动提交！");
    }

    function waitForElement(selector, callback, interval = 300, timeout = 10000) {
        const startTime = Date.now();
        const checkInterval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(checkInterval);
                callback(element);
            }
            if (Date.now() - startTime > timeout) {
                clearInterval(checkInterval);
                console.error(`等待元素超时：${selector}`);
            }
        }, interval);
    }

    waitForElement(".index__subjectItem--XWS1b", () => {
        autoEvaluate();
    });
})();
