// ==UserScript==
// @name         自动答题助手
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  在答题页面添加自动答题功能
// @match        https://www.cmechina.net/cme/exam.jsp*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505137/%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/505137/%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加自动答题按钮
    function addAutoAnswerButton() {
        const autoAnswerButton = document.createElement('button');
        autoAnswerButton.textContent = '自动答题';
        autoAnswerButton.style.position = 'fixed';
        autoAnswerButton.style.top = '100px';
        autoAnswerButton.style.right = '10px';
        autoAnswerButton.style.zIndex = '9999';
        document.body.appendChild(autoAnswerButton);

        autoAnswerButton.addEventListener('click', autoAnswer);
    }

    // 自动答题主函数
    function autoAnswer() {
        randomlySelectAnswers();
        submitAnswers();
    }

    // 随机选择答案
    function randomlySelectAnswers() {
        const questions = document.querySelectorAll('.exam_list li');
        questions.forEach(question => {
            const options = question.querySelectorAll('input[type="radio"]');
            if (options.length > 0) {
                const randomIndex = Math.floor(Math.random() * options.length);
                options[randomIndex].checked = true;
            }
        });
    }

    // 提交答案
    function submitAnswers() {
        const submitButton = document.querySelector('a#tjkj.cur');
        if (submitButton) {
            submitButton.click();
        } else {
            console.error('未找到提交按钮');
        }
    }

    // 检查是否所有题目都没有回答
    function allQuestionsUnanswered() {
        const radios = document.querySelectorAll('input[type="radio"]');
        return Array.from(radios).every(radio => !radio.checked);
    }

    // 页面加载完成后执行
    window.addEventListener('load', () => {
        addAutoAnswerButton();
        if (allQuestionsUnanswered()) {
            autoAnswer(); // 自动运行答题功能
        } else {
            const updateButton = document.querySelector('button[style*="position: fixed; top: 150px; right: 10px; z-index: 9999;"]');
            if (updateButton) {
                updateButton.click();
            } else {
                console.error('未找到手动更新错误答案按钮');
            }
        }
    });
})();
