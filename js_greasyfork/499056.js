// ==UserScript==
// @name         CCMTV Answer
// @namespace    http://tampermonkey.net/
// @version      2024-06-26
// @description  CCMTV Exam Assistant
// @author       青年桥东
// @match        https://yun.ccmtv.cn/exam_bank/start.html*
// @icon         https://yun.ccmtv.cn/favicon.ico
// @require      https://update.greasyfork.org/scripts/499051/1401401/questionBankData.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499056/CCMTV%20Answer.user.js
// @updateURL https://update.greasyfork.org/scripts/499056/CCMTV%20Answer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 确保外部脚本（questionBankData.js）已加载并且变量可用
    setTimeout(() => {
        const questionCount = questionBankData.questions.length;
        console.log("已加载题目数:", questionCount);
    }, 1000); // 延迟以确保外部脚本已加载

    // 获取当前题目号的方法
    function getCurrentQuestionNumber() {
        const currentQuestionNumber = document.querySelector('body > div.yy_content > div.san_left > div.san2 > h3 > b.current');
        if (currentQuestionNumber) {
            return currentQuestionNumber.textContent.trim();
        } else {
            console.error('无法找到当前题目号');
            return null;
        }
    }

    // 获取当前题目文本的方法（去掉题号前面的数字部分）
    function getCurrentQuestionText(currentQuestionNumber) {
        const selector = `#exam_form > div.exam > div:nth-child(${currentQuestionNumber}) > div.exam_box > h3`;
        const currentQuestionTextElement = document.querySelector(selector);
        if (currentQuestionTextElement) {
            // 去掉题号前面的数字部分
            const questionText = currentQuestionTextElement.textContent.trim();
            const startIndex = questionText.indexOf('.') + 1;
            return questionText.substring(startIndex).trim();
        } else {
            console.error(`无法找到题目文本，题号：${currentQuestionNumber}`);
            return null;
        }
    }

    // 自动回答题目的方法
    function answerQuestion() {
        const currentQuestionNumber = getCurrentQuestionNumber();
        if (!currentQuestionNumber) {
            console.error('无法获取当前题目号');
            return;
        }

        const currentQuestionText = getCurrentQuestionText(currentQuestionNumber);
        if (!currentQuestionText) {
            console.error('无法获取当前题目文本');
            return;
        }

        console.log(`当前题目号：${currentQuestionNumber}`);
        console.log(`当前题目文本：${currentQuestionText}`);

        // 在题库数据中查找匹配的题目
        const matchedQuestion = questionBankData.questions.find(q => q.question === currentQuestionText);

        if (matchedQuestion) {
            // 找到题目后，获取正确答案
            const correctAnswer = matchedQuestion.correct_answer;
            console.log(`正确答案：${correctAnswer}`);

            // 找到对应的选项元素，并选择正确答案
            for (let i = 1; i <= 5; i++) { // 假设有5个选项
                const optionSelector = `#exam_form > div.exam > div:nth-child(${currentQuestionNumber}) > div.exam_box > div > div > span:nth-child(${i}) > label > input[type=radio]`;
                const optionInput = document.querySelector(optionSelector);

                // 获取选项的值（答案）
                const optionValue = optionInput.value.trim();
                console.log(`选项 ${i} 的值：${optionValue}`);

                if (optionValue === correctAnswer) {
                    optionInput.click(); // 选择答案
                    console.log(`选择了答案 ${correctAnswer}`);
                    break;
                }
            }

            // 在resultdiv中显示查找到的题目、选项和答案
            var resultDiv = document.getElementById("resultDiv");
            // 找到的题目的选项数量
            var optionsCount = matchedQuestion.options.length;
            // 添加题目文本
            var questionText = "查找结果：\n题目：" + currentQuestionText + "\n";
            // 添加选项文本
            var lerrers = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
            var optionsText = "选项：\n";
            for (let i = 0; i < optionsCount; i++) {
                optionsText += `${lerrers[i]}、${matchedQuestion.options[i]}\n`;
            }
            // 添加答案文本
            var answerText = "答案：" + correctAnswer + "\n";
            // 清空resultDiv
            resultDiv.innerHTML = "";
            // 添加文本节点
            var questionTextNode = document.createTextNode(questionText);
            var optionsTextNode = document.createTextNode(optionsText);
            var answerTextNode = document.createTextNode(answerText);
            resultDiv.appendChild(questionTextNode);
            resultDiv.appendChild(optionsTextNode);
            resultDiv.appendChild(answerTextNode);
        } else {
            console.error('题库中未找到匹配的题目');
            // 在resultdiv中显示未找到题目的提示
            var resultDiv = document.getElementById("resultDiv");
            resultDiv.innerHTML = "";
            var resultText = "查找结果：\n未找到匹配的题目";
            resultDiv.innerHTML = resultText;
        }
    }

    // 添加按钮并绑定点击事件
    function addAnswerButton() {
        var buttonCssText = "margin-right: 5px;margin-bottom: 5px;margin-top: 10px;appearance: none;background-color: #015bb7;border: 1px solid rgba(1, 54, 109, .15);border-radius: 6px;box-shadow: rgba(27, 31, 35, .1) 0 1px 0;box-sizing: border-box;color: #fff;cursor: pointer;display: inline-block;font-family: -apple-system,system-ui,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\";font-size: 14px;font-weight: 600;line-height: 20px;padding: 6px 16px;position: relative;text-align: center;text-decoration: none;user-select: none;-webkit-user-select: none;touch-action: manipulation;vertical-align: middle;white-space: nowrap";
        var resultDivCssText = "width: 100%; padding: 10px; border: 1px solid #015bb7; border-radius: 6px; background-color: #f0f8ff; color: black; font-size: 13px; line-height: 20px; text-align: left; white-space: pre-wrap; margin-top: 5px";
        var examregion = document.querySelector('body > div.yy_content > div.work_right');
        // 添加按钮
        const button = document.createElement('button');
        button.textContent = '查找答案';
        button.style.cssText = buttonCssText;
        examregion.appendChild(button);
        button.addEventListener('click', answerQuestion);
        // 添加文本节点
        var resultDiv = document.createElement("div");
        resultDiv.id = "resultDiv";
        examregion.appendChild(resultDiv);
        resultDiv.style.cssText = resultDivCssText;
        // 在resultDiv元素中添加文本
        var resultHeader = "查找结果：\n";
        var resultHeaderText = document.createTextNode(resultHeader);
        resultDiv.appendChild(resultHeaderText);
    }

    // 执行添加按钮函数
    addAnswerButton();

})();