// ==UserScript==
// @name         TJCU体育理论考试自动答题脚本（动态输入Token）
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  动态输入Token以加载题库并自动答题
// @description  This script is written exclusively for dyl
// @author       zmq
// @license      All Rights Reserved
// @match        http://peexam.tjcu.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519220/TJCU%E4%BD%93%E8%82%B2%E7%90%86%E8%AE%BA%E8%80%83%E8%AF%95%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC%EF%BC%88%E5%8A%A8%E6%80%81%E8%BE%93%E5%85%A5Token%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/519220/TJCU%E4%BD%93%E8%82%B2%E7%90%86%E8%AE%BA%E8%80%83%E8%AF%95%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC%EF%BC%88%E5%8A%A8%E6%80%81%E8%BE%93%E5%85%A5Token%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("脚本已加载");

    // 初始化变量
    let apiToken = null; // Token 存储变量
    const unmatchedQuestions = [];
    let answerDatabase = {};

    // 标准化文本（去掉多余空格、标点符号差异）
    function normalizeText(text) {
        return text
            .replace(/\s+/g, ' ') // 替换多余空格
            .replace(/[^\w\u4e00-\u9fa5\s]/g, '') // 去掉标点符号
            .trim(); // 去掉前后空格
    }

    // 加载题库
    function loadQuestionBank(callback) {
        // 检查是否已经输入 Token
        if (!apiToken) {
            alert("未输入有效的 Token，脚本无法运行！");
            return;
        }

        const apiEndpoint = `http://zmqzmq.cn/question_bank/fetchAnswer.php?token=${encodeURIComponent(apiToken)}`;

        fetch(apiEndpoint)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error(`题库加载失败：${data.message}`);
                    alert(`题库加载失败：${data.message}`);
                    return;
                }

                console.log("题库加载成功", data);

                // 转换题库格式
                data.forEach(item => {
                    answerDatabase[item.Qstr.trim()] = {
                        Qans: item.Qans.trim(),
                        Qopt: JSON.parse(item.Qopt.replace(/'/g, '"')) // 转换单引号 JSON 格式
                    };
                });
                callback();
            })
            .catch(error => {
                console.error("题库加载失败", error);
                alert("题库加载失败，请检查网络或 Token 是否正确！");
            });
    }

    // 自动答题函数（保持原有逻辑）
    function autoAnswer() {
        const questions = document.querySelectorAll('.paperexamcontent');
        console.log(`找到 ${questions.length} 道题目`);

        questions.forEach((question, index) => {
            const questionTextElement = question.querySelector('.text-warning');
            if (!questionTextElement) return;
            const questionText = normalizeText(questionTextElement.innerText);
            console.log(`第 ${index + 1} 题：${questionText}`);

            const normalizedAnswerKeys = Object.keys(answerDatabase).map(normalizeText);
            const answerIndex = normalizedAnswerKeys.indexOf(questionText);

            if (answerIndex === -1) {
                console.warn(`题目未找到答案：${questionText}`);
                unmatchedQuestions.push(questionText);
                return;
            }

            const answerData = answerDatabase[Object.keys(answerDatabase)[answerIndex]];
            console.log(`正确答案：${answerData.Qans}`);

            const isMultipleChoice = question.querySelectorAll('input[type="checkbox"]').length > 0;

            if (isMultipleChoice) {
                const correctAnswers = answerData.Qans.split('');
                const options = question.querySelectorAll('label.checkbox.inline');
                options.forEach((option) => {
                    const input = option.querySelector('input');
                    const optionText = option.innerText.trim();
                    const optionKey = optionText[0];
                    if (correctAnswers.includes(optionKey)) {
                        console.log(`选择多选答案：${optionText}`);
                        if (!input.checked) {
                            input.click();
                        }
                    }
                });
            } else {
                const options = question.querySelectorAll('label.radio.inline');
                options.forEach((option) => {
                    const input = option.querySelector('input');
                    const optionText = option.innerText.trim();
                    if (optionText.startsWith(answerData.Qans)) {
                        console.log(`选择单选答案：${optionText}`);
                        input.click();
                    }
                });
            }
        });

        if (unmatchedQuestions.length > 0) {
            console.warn("未匹配的题目：", unmatchedQuestions);
        }
    }

    // 主逻辑：提示用户输入 Token 并运行脚本
    function main() {
        // 检查是否已有缓存的 Token
        apiToken = localStorage.getItem('apiToken') || null;

        if (!apiToken) {
            // 提示用户输入 Token
            apiToken = prompt("请输入您的 Token：");
            if (!apiToken) {
                alert("未输入有效的 Token，脚本无法运行！");
                return;
            }
            // 缓存 Token 到本地
            localStorage.setItem('apiToken', apiToken);
        }

        // 加载题库并自动答题
        loadQuestionBank(() => {
            setTimeout(() => {
                autoAnswer();
            }, 2000);
        });
    }

    // 执行主逻辑
    main();
})();
