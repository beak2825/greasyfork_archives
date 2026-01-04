// ==UserScript==
// @name         国家高等教育智慧教育平台（人工智能综合能力提升培训）
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  人工智能综合能力提升培训 第四部分测验答题
// @author       wanzi
// @match        https://ct.hep.com.cn/*
// @grant        none
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @downloadURL https://update.greasyfork.org/scripts/541039/%E5%9B%BD%E5%AE%B6%E9%AB%98%E7%AD%89%E6%95%99%E8%82%B2%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%EF%BC%88%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD%E7%BB%BC%E5%90%88%E8%83%BD%E5%8A%9B%E6%8F%90%E5%8D%87%E5%9F%B9%E8%AE%AD%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/541039/%E5%9B%BD%E5%AE%B6%E9%AB%98%E7%AD%89%E6%95%99%E8%82%B2%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%EF%BC%88%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD%E7%BB%BC%E5%90%88%E8%83%BD%E5%8A%9B%E6%8F%90%E5%8D%87%E5%9F%B9%E8%AE%AD%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let questionData = [];

    async function selectAnswer(question, matchedQuestion) {
        if (!matchedQuestion.answer) return;

        switch (matchedQuestion.type) {
            case '填空题':
                const inputs = question.querySelectorAll('.tiOption.editor [contenteditable="true"]');
                const answers = matchedQuestion.answer.split(',');
                await Promise.all(Array.from(inputs).map(async (input, i) => {
                    if (input && answers[i]) {
                        input.focus();
                        input.innerHTML = answers[i];
                        input.textContent = answers[i];
                        ['input', 'change', 'blur', 'keyup'].forEach(event => {
                            input.dispatchEvent(new Event(event, { bubbles: true }));
                            input.parentElement?.dispatchEvent(new Event(event, { bubbles: true }));
                        });
                    }
                }));
                break;

            case '多选题':
                const multiAnswers = matchedQuestion.answer.split(',');
                const multiBoxes = question.querySelectorAll('.el-checkbox');
                for (const letter of multiAnswers) {
                    const index = letter.charCodeAt(0) - 65;
                    multiBoxes[index]?.querySelector('input[type="checkbox"]')?.click();
                    await new Promise(r => setTimeout(r, 100));
                }
                break;

            case '单选题':
            case '判断题':
                const index = matchedQuestion.answer.charCodeAt(0) - 65;
                question.querySelectorAll('.el-radio')[index]?.click();
                break;
        }
    }

    async function processQuestions() {
        const questionTypes = document.querySelectorAll('.questionStyle');
        for (const type of questionTypes) {
            type.click();
            await new Promise(r => setTimeout(r, 1000));

            const questions = document.querySelectorAll('[id^="jump"]');
            await Promise.all(Array.from(questions).map(async question => {
                const num = question.querySelector('.tiNumber')?.textContent.replace('.', '');
                if (num && questionData[parseInt(num) - 1]) {
                    question.scrollIntoView();
                    await selectAnswer(question, questionData[parseInt(num) - 1]);
                }
            }));
            await new Promise(r => setTimeout(r, 500));
        }
    }

    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
        const xhr = new originalXHR();
        xhr.addEventListener('readystatechange', function() {
            if (xhr.readyState === 4 && xhr.status === 200 && xhr.responseURL.includes('/public/getExamData')) {
                const response = JSON.parse(xhr.responseText);
                if (response.data) {
                    const key = CryptoJS.enc.Utf8.parse('yyhzxxjsyxgshy66');
                    const decrypted = CryptoJS.AES.decrypt(response.data, key, {
                        mode: CryptoJS.mode.ECB,
                        padding: CryptoJS.pad.Pkcs7
                    });
                    const examData = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));

                    examData.bigQuestionList.forEach(bigQuestion => {
                        bigQuestion.smallQuestions.forEach(question => {
                            let answer;
                            if (question.questionTypeName === '填空题') {
                                answer = question.options
                                    .map(opt => opt.optionTextValue)
                                    .filter(Boolean)
                                    .join(',');
                            } else {
                                const offset = question.questionTypeName === '判断题' ? 65 : 64;
                                answer = question.options
                                    .filter(opt => opt.isAnswer === true)
                                    .map(opt => String.fromCharCode(offset + opt.optionIndex))
                                    .sort()
                                    .join(',');
                            }
                            questionData.push({type: question.questionTypeName, answer});
                        });
                    });
                }
            }
        });
        return xhr;
    };

    const style = document.createElement('style');
    style.textContent = `
        .hep-btn {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            padding: 10px 20px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        .hep-btn:hover {
            background: #45a049;
        }
    `;
    document.head.appendChild(style);

    const btn = document.createElement('button');
    btn.textContent = '开始答题';
    btn.className = 'hep-btn';
    btn.onclick = processQuestions;
    document.body.appendChild(btn);
})();