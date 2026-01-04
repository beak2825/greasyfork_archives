// ==UserScript==
// @name         db_question
// @namespace    https://greasyfork.org/users/1384897
// @version      1.4
// @description  在豆瓣小组页面提取已结束问答数据，自动填写并提交未结束的问答
// @author       ✌
// @match        https://www.douban.com/group/topic/*/*
// @grant        GM_xmlhttpRequest
// @connect      m.douban.com
// @downloadURL https://update.greasyfork.org/scripts/521074/db_question.user.js
// @updateURL https://update.greasyfork.org/scripts/521074/db_question.meta.js
// ==/UserScript==


(function () {
    'use strict';

    let runCount = 0;
    let resultContainer;

    function decodeUnicode(str) {
        return str.replace(/\\u[0-9a-fA-F]{4}/g, match => {
            return String.fromCharCode(parseInt(match.replace('\\u', ''), 16));
        });
    }

    async function main() {
        const questionElements = document.querySelectorAll('[data-entity-type="question"]');
        const questionIds = Array.from(questionElements).map(el => el.getAttribute('data-id'));

        if (questionIds.length === 0) {
            console.log('未找到 data-entity-type="question" 的元素');
            return;
        }

        console.log('找到的问题 ID:', questionIds);

        if (!resultContainer) {
            resultContainer = document.createElement('div');
            setupResultContainer(resultContainer);
            document.body.appendChild(resultContainer);
        } else {
            resultContainer.innerHTML = '';
        }

        for (const dataId of questionIds) {
            await fetchQuestion(dataId, resultContainer);
        }

        handleSubmission();
    }

    function setupResultContainer(container) {
        container.style = `
            position: fixed;
            top: 50px;
            right: 10px;
            width: 300px;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px;
            border-radius: 10px;
            max-height: 80%;
            overflow-y: auto;
            z-index: 9999;
        `;
    }

    async function fetchQuestion(dataId, container) {
        return new Promise((resolve, reject) => {
            const ckValue = document.querySelector('input[name="ck"]').value;
            const apiUrl = `https://m.douban.com/rexxar/api/v2/ceorl/poll/question/${dataId}?ck=${ckValue}`;

            GM_xmlhttpRequest({
                method: 'GET',
                url: apiUrl,
                onload: function (response) {
                    try {
                        const jsonData = JSON.parse(response.responseText);
                        displayResult(jsonData, container);
                        resolve();
                    } catch (error) {
                        console.error(`解析数据时出错 (ID: ${dataId}):`, error);
                        reject(error);
                    }
                },
                onerror: function (error) {
                    console.error(`请求 API 失败 (ID: ${dataId}):`, error);
                    reject(error);
                }
            });
        });
    }

    function displayResult(jsonData, container) {
        const correctAnswer = jsonData.correct_answer;
        const title = jsonData.title;

        const decodeAnswer = decodeUnicode(correctAnswer);
        const decodeTitle = decodeUnicode(title);

        const resultDiv = document.createElement('div');
        resultDiv.style = `
            margin-bottom: 15px;
            padding: 10px;
            background-color: #333;
            borderRadius: 8px;
        `;

        const titleEl = document.createElement('h4');
        titleEl.textContent = `标题: ${decodeTitle}`;
        titleEl.style.color = '#ffdd57';

        const answerEl = document.createElement('p');
        answerEl.textContent = `正确答案: ${decodeAnswer}`;
        answerEl.style.color = '#fff';

        resultDiv.appendChild(titleEl);
        resultDiv.appendChild(answerEl);
        container.appendChild(resultDiv);
    }

    function handleSubmission() {
        setTimeout(async () => {
            const inputElements = document.querySelectorAll('.question-input');
            if (inputElements.length === 0) {
                console.log('没有找到未完成的问题。');
                return;
            }

            inputElements.forEach(input => input.value = '敞亮99');

            let allSubmitted = true;
            const submitButtons = document.querySelectorAll('.question-btn');
            submitButtons.forEach((button, index) => {
                button.click();
                console.log('提交了第 ' + (index + 1) + ' 个答案');
            });

            if (allSubmitted && runCount < 1) {
                console.log('所有问题已提交，即将再次调用 main 函数。');
                setTimeout(main, 500);
                runCount++;
            }
        }, 1000);
    }

    main();
})();