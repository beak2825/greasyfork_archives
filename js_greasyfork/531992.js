// ==UserScript==
// @name         AI自動答題腳本（包括提取題目）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自動提取題目並用 AI 進行回答，支持選擇題、填空題等多種類型的問題
// @author       你
// @match        https://www.junyiacademy.org/*  // 替換為實際的網站URL
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/531992/AI%E8%87%AA%E5%8B%95%E7%AD%94%E9%A1%8C%E8%85%B3%E6%9C%AC%EF%BC%88%E5%8C%85%E6%8B%AC%E6%8F%90%E5%8F%96%E9%A1%8C%E7%9B%AE%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/531992/AI%E8%87%AA%E5%8B%95%E7%AD%94%E9%A1%8C%E8%85%B3%E6%9C%AC%EF%BC%88%E5%8C%85%E6%8B%AC%E6%8F%90%E5%8F%96%E9%A1%8C%E7%9B%AE%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 這裡是你從 OpenAI 獲得的 API 密鑰
    const OPENAI_API_KEY = 'YOUR_API_KEY_HERE';

    // 使用 GM_xmlhttpRequest 發送問題到 OpenAI API
    function getAnswerFromAI(question, callback) {
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://api.openai.com/v1/chat/completions",  // 使用新的 OpenAI API URL
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            data: JSON.stringify({
                model: "gpt-3.5-turbo",  // 或 "gpt-4"
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: question }
                ],
                max_tokens: 100,
                temperature: 0.7
            }),
            onload: function(response) {
                const data = JSON.parse(response.responseText);
                if (data.choices && data.choices.length > 0) {
                    callback(data.choices[0].message.content.trim());  // 使用 message.content
                } else {
                    console.error("未能獲取有效答案");
                    callback(null);
                }
            },
            onerror: function(error) {
                console.error("API 請求錯誤:", error);
                callback(null);
            }
        });
    }

    // 處理選擇題：根據 AI 答案選擇正確選項
    function handleMultipleChoice(questionElement) {
        const questionText = questionElement.querySelector('.question-text').innerText;
        console.log("選擇題問題: ", questionText);

        getAnswerFromAI(questionText, function(aiAnswer) {
            if (!aiAnswer) return;

            console.log("AI 答案 (選擇題): ", aiAnswer);

            // 假設選項用 radio 按鈕實現，並且選項的文本包含答案
            const options = questionElement.querySelectorAll('input[type="radio"]');
            options.forEach((option) => {
                const label = option.nextElementSibling;
                if (label && label.innerText.includes(aiAnswer)) {
                    option.checked = true;
                    console.log("選擇了選項: ", label.innerText);
                }
            });
        });
    }

    // 處理填空題：根據 AI 答案填寫文本框
    function handleFillInTheBlanks(questionElement) {
        const questionText = questionElement.querySelector('.question-text').innerText;
        console.log("填空題問題: ", questionText);

        getAnswerFromAI(questionText, function(aiAnswer) {
            if (!aiAnswer) return;

            console.log("AI 答案 (填空題): ", aiAnswer);

            // 假設填空題用 text 欄位實現
            const answerField = questionElement.querySelector('input[type="text"]');
            if (answerField) {
                answerField.value = aiAnswer;
                console.log("填入答案: ", aiAnswer);
            }
        });
    }

    // 根據問題類型處理
    function processQuestion(questionElement) {
        const questionType = getQuestionType(questionElement); // 判斷題型
        switch (questionType) {
            case 'multiple_choice':
                handleMultipleChoice(questionElement);
                break;
            case 'fill_in_the_blank':
                handleFillInTheBlanks(questionElement);
                break;
            default:
                console.log("無法處理的題型");
        }
    }

    // 根據問題的結構判斷題型
    function getQuestionType(questionElement) {
        if (questionElement.querySelector('input[type="radio"]')) {
            return 'multiple_choice';  // 選擇題
        } else if (questionElement.querySelector('input[type="text"]')) {
            return 'fill_in_the_blank';  // 填空題
        }
        return 'unknown';
    }

    // 提取所有問題的題目
    function extractQuestions() {
        const questions = document.querySelectorAll('.question');  // 根據網頁結構選擇問題區域

        if (!questions || questions.length === 0) {
            console.error("未找到問題");
            return;
        }

        questions.forEach((question) => {
            const questionText = question.querySelector('.question-text');  // 提取問題文本
            if (questionText) {
                console.log('問題: ', questionText.innerText);  
                processQuestion(question);  // 根據題型處理問題
            }
        });
    }

    // 延遲等待提交按鈕出現，然後自動點擊
    function clickSubmitButton() {
        const submitButton = document.querySelector('.submit-btn');  // 假設提交按鈕的類名是 .submit-btn

        if (submitButton) {
            submitButton.click();  // 提交答案
            console.log("提交答案成功！");
        } else {
            console.log("未找到提交按鈕！");
        }
    }

    // 等待頁面完全加載後再執行
    window.addEventListener('load', function() {
        setTimeout(() => {
            extractQuestions();  // 提取並處理所有問題
            setTimeout(clickSubmitButton, 2000);  // 等待2秒後點擊提交按鈕
        }, 2000); // 等待2秒，給頁面加載時間
    });
})();
