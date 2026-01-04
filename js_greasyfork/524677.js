// ==UserScript==
// @name         D2L Quiz Scraper
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  抓取 D2L Quiz 中的[单选][判断]题目与选项，并在获取答案后自动填写
// @author       GrumpyCat
// @match        https://avenue.cllmcmaster.ca/d2l/lms/quizzing/user/attempt/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/524677/D2L%20Quiz%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/524677/D2L%20Quiz%20Scraper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.addEventListener('load', () => {
        const quizData = parseQuizData();
        if (quizData.length === 0) {
            console.log('未找到任何题目');
            return;
        }
        console.log('抓取到的 quizData: ', quizData);
        const requestData = {
            questions_data: quizData
        };
        postQuizData(requestData)
            .then((res) => {
                console.log('后端返回的数据:', res);
                autoSelectAnswers(res, quizData);
                autoSaving();
            })
            .catch((error) => {
                console.error('请求出错:', error);
            });
    });

    function autoSaving() {
        const savingButtonArray = document.querySelectorAll('div.dhdg_2 d2l-button-icon');
        savingButtonArray.forEach(btn => {
            btn.click();
        });
    }

    function parseQuizData() {
        const questionDivs = document.querySelectorAll('div.dco');
        const quizData = [];
        let id = 1;
        questionDivs.forEach((questionDiv) => {
            const questionContainer = questionDiv.nextElementSibling;
            if (!questionContainer) return;
            const questionTextBlock = questionContainer.querySelector('d2l-html-block[html]');
            const questionText = questionTextBlock
                ? decodeHtml(questionTextBlock.getAttribute('html'))
                : '';
            const answerRows = questionContainer.querySelectorAll('fieldset table tbody tr');
            const answers = [];
            let index = 1;
            answerRows.forEach((row) => {
                const answerBlock = row.querySelector('div.d2l-htmlblock-untrusted d2l-html-block');
                let answerText = answerBlock
                    ? decodeHtml(answerBlock.getAttribute('html'))
                    : '';
                //匹配判断题
                if (!answerText) {
                    const answerBoolean = row.querySelector('label[for]');
                    console.log("answerBoolean",answerBoolean)
                    if (answerBoolean) {
                        const labelText = answerBoolean.textContent.trim();
                        console.log("labelText",labelText);
                        answerText = labelText;
                    }
                }
                const radioInput = row.querySelector('input[type="radio"]');
                const inputId = radioInput ? radioInput.id : null;
                answers.push({
                    index: index++,
                    text: answerText,
                    inputId: inputId
                });
            });
            if (questionText) {
                quizData.push({
                    id: id++,
                    questionText,
                    answers
                });
            }
        });
        return quizData;
    }

    // function autoSelectAnswers(serverAnswers, quizData) {
    //     const letterToIndex = (letter) => letter.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0) + 1;

    //     serverAnswers.forEach(({ id, answer }) => {
    //         const questionObj = quizData.find(q => q.id === id);
    //         if (!questionObj) {
    //             console.warn(`找不到题号id=${id}对应的题目`);
    //             return;
    //         }
    //         const ansIndex = letterToIndex(answer);  // "A" -> 1
    //         const targetAns = questionObj.answers.find(a => a.index === ansIndex);
    //         if (!targetAns) {
    //             console.warn(`题${id}中找不到对应选项:${answer}`);
    //             return;
    //         }
    //         const inputEl = document.getElementById(targetAns.inputId);
    //         if (inputEl) {
    //             inputEl.click();
    //         } else {
    //             console.warn(`找不到对应radio: #${targetAns.inputId}，无法自动点选`);
    //         }
    //     });
    // }
    function autoSelectAnswers(serverAnswers, quizData) {
        const letterToIndex = (letter) => letter.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0) + 1;
    
        serverAnswers.forEach(({ id, answer }) => {
            const questionObj = quizData.find(q => q.id === id);
            if (!questionObj) {
                console.warn(`找不到题号id=${id}对应的题目`);
                return;
            }
            const ansIndex = letterToIndex(answer); // "A" -> 1
            const targetAns = questionObj.answers.find(a => a.index === ansIndex);
            if (!targetAns) {
                console.warn(`题${id}中找不到对应选项:${answer}`);
                return;
            }
            if (typeof SetRadioButtonAsSelected === 'function') {
                SetRadioButtonAsSelected(targetAns.inputId);
            } else {
                console.warn(`全局环境下找不到 SetRadioButtonAsSelected 函数，无法自动选择`);
            }
        });
    }
    
    function postQuizData(quizData) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://techflowlab.xyz/api/answer-questions/',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(quizData),
                onload: function (response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        console.log('上传成功, 后端响应:', data);
                        resolve(data);
                    } catch (err) {
                        console.error('JSON 解析错误:', err);
                        reject(err);
                    }
                },
                onerror: function (error) {
                    console.error('上传出错:', error);
                    reject(error);
                },
                ontimeout: function () {
                    console.error('请求超时');
                    reject(new Error('请求超时'));
                },
                onabort: function () {
                    console.error('请求被中断');
                    reject(new Error('请求被中断'));
                }
            });
        });
    }
    function decodeHtml(html) {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    }
})();
