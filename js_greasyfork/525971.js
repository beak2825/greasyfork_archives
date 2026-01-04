// ==UserScript==
// @name         讯飞大学考试答案提取工具
// @namespace    https://ifly.21tb.com
// @version      1.0.2
// @description  第一次答题后自动提取讯飞大学在线考试的题目和正确答案，并在控制台输出
// @author       NetHerder
// @icon         https://i.imgur.com/JNMjehC.jpeg
// @license      MIT
// @match        https://ifly.21tb.com/els/html/studyCourse/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525971/%E8%AE%AF%E9%A3%9E%E5%A4%A7%E5%AD%A6%E8%80%83%E8%AF%95%E7%AD%94%E6%A1%88%E6%8F%90%E5%8F%96%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/525971/%E8%AE%AF%E9%A3%9E%E5%A4%A7%E5%AD%A6%E8%80%83%E8%AF%95%E7%AD%94%E6%A1%88%E6%8F%90%E5%8F%96%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const results = [];

    /** 获取题目编号 */
    function getQuestionNumber(questionElement) {
        const numberElement = questionElement.querySelector("h5.cs-test-question span");
        if (numberElement) {
            return numberElement.innerText.trim();
        }
        return "未知"; // 如果找不到编号，返回"未知"
    }

    /** 提取正确选项 */
    function extractCorrectOptions(questionElement) {
        const scriptTags = questionElement.querySelectorAll("script");
        const correctAnswers = [];
        scriptTags.forEach(script => {
            const match = /setRightAnswer\('.*?', '(answer_item_.*?)'\)/.exec(script.textContent);
            if (match) {
                const correctOptionElement = document.getElementById(match[1]);
                if (correctOptionElement) {
                    correctAnswers.push(correctOptionElement.innerText.trim());
                }
            }
        });
        return correctAnswers;
    }

    /** 处理并收集所有问题 */
    function processQuestions() {
        const questions = document.querySelectorAll(".cs-test-item");
        questions.forEach((question) => {
            const questionNumber = getQuestionNumber(question);
            const correctOptions = extractCorrectOptions(question);

            if (correctOptions.length > 0) {
                results.push(`${questionNumber}. ${correctOptions.join(", ")}`);
            } else {
                results.push(`${questionNumber}. 未找到正确答案`);
            }
        });
    }

    /** 执行主逻辑 */
    function main() {
        processQuestions();
        console.log("正确答案如下：");
        results.forEach(result => console.log(result));
    }

    main();
})();
