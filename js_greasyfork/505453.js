// ==UserScript==
// @name         答题页改答
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  在答题页面处理返回后的操作
// @match        https://www.cmechina.net/cme/exam.jsp*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505453/%E7%AD%94%E9%A2%98%E9%A1%B5%E6%94%B9%E7%AD%94.user.js
// @updateURL https://update.greasyfork.org/scripts/505453/%E7%AD%94%E9%A2%98%E9%A1%B5%E6%94%B9%E7%AD%94.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // 更新错误答案的函数
    function updateWrongAnswers() {
        const wrongAnswersJSON = localStorage.getItem('wrongAnswers');
        if (!wrongAnswersJSON) {
            console.log('没有找到需要修正的答案');
            return;
        }
 
        console.log('找到需要修正的答案：', wrongAnswersJSON);
 
        const wrongAnswers = JSON.parse(wrongAnswersJSON);
        const questions = document.querySelectorAll('.exam_list li');
 
        wrongAnswers.forEach(number => {
            const question = questions[parseInt(number) - 1];
            if (question) {
                const options = question.querySelectorAll('input[type="radio"]');
                const currentChecked = Array.from(options).find(opt => opt.checked);
                if (currentChecked) {
                    currentChecked.checked = false;
                }
                const randomOption = options[Math.floor(Math.random() * options.length)];
                randomOption.checked = true;
                console.log(`已更新第 ${number} 题的答案`);
            } else {
                console.log(`未找到第 ${number} 题`);
            }
        });
 
        // 清除 localStorage 中的数据
        localStorage.removeItem('wrongAnswers');
        console.log('已清除存储的错误答案信息');
    }
 
    // 提交答案的函数
    function submitAnswers() {
        const submitButton = document.querySelector('a#tjkj.cur');
        if (submitButton) {
            submitButton.click();
            console.log('答案已提交');
        } else {
            console.error('未找到提交按钮');
        }
    }
 
    // 更新答案并提交的函数
    function updateAndSubmit() {
        updateWrongAnswers();
        submitAnswers();
    }
 
    // 添加手动更新按钮
    const updateButton = document.createElement('button');
    updateButton.textContent = '手动更新错误答案';
    updateButton.style.position = 'fixed';
    updateButton.style.top = '150px';
    updateButton.style.right = '10px';
    updateButton.style.zIndex = '9999';
    updateButton.addEventListener('click', updateAndSubmit);
    document.body.appendChild(updateButton);
})();