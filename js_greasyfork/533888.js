// ==UserScript==
// @name         青书学堂答案显示助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  青书学堂答案显示助手 只用于作业
// @license MIT
// @author       ruby
// @match        https://degree.qingshuxuetang.com/zzqd/Student/ExercisePaper*
// @grant        GM_xmlhttpRequest
// @connect      degree.qingshuxuetang.com
// @downloadURL https://update.greasyfork.org/scripts/533888/%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%E7%AD%94%E6%A1%88%E6%98%BE%E7%A4%BA%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/533888/%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%E7%AD%94%E6%A1%88%E6%98%BE%E7%A4%BA%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加显示答案按钮
    function addAnswerButton() {
        const button = document.createElement('button');
        button.textContent = '显示答案';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.style.padding = '10px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';

        button.addEventListener('click', showAnswers);
        document.body.appendChild(button);
    }

    // 获取URL参数
    function getUrlParams() {
        const url = new URL(window.location.href);
        return {
            courseId: url.searchParams.get('courseId'),
            quizId: url.searchParams.get('quizId'),
            teachPlanId: url.searchParams.get('teachPlanId'),
            periodId: url.searchParams.get('periodId')
        };
    }

    // 获取题目答案
    async function getAnswers() {
        const params = getUrlParams();
        const timestamp = Date.now();
        const url = `https://degree.qingshuxuetang.com/zzqd/Student/DetailData?quizId=${params.quizId}&_=${timestamp}&_t=${timestamp + 2000}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json, text/javascript, */*; q=0.01',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'include'
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('获取答案失败:', error);
            return null;
        }
    }

    // 显示答案
    async function showAnswers() {
        try {
            const answers = await getAnswers();
            console.log('获取到的答案数据:', answers);

            if (!answers || !answers.data || !answers.data.paperDetail || !answers.data.paperDetail.questions) {
                alert('获取答案失败，请检查网络或重试！');
                return;
            }

            // 移除已有的答案显示
            document.querySelectorAll('.answer-display').forEach(el => el.remove());

            // 为每个题目显示答案
            answers.data.paperDetail.questions.forEach((questionData) => {
                // 使用 questionId 查找对应的题目
                const question = document.querySelector(`[id="${questionData.questionId}"]`);
                if (question) {
                    const answerDisplay = document.createElement('div');
                    answerDisplay.className = 'answer-display';
                    answerDisplay.style.color = '#ff0000';
                    answerDisplay.style.fontWeight = 'bold';
                    answerDisplay.style.marginTop = '10px';
                    answerDisplay.style.marginBottom = '10px';
                    answerDisplay.style.fontSize = '16px';
                    answerDisplay.style.backgroundColor = '#f0f0f0';
                    answerDisplay.style.padding = '10px';
                    answerDisplay.style.borderLeft = '4px solid #ff0000';

                    // 显示题号和答案
                    answerDisplay.textContent = `【答案】${questionData.solution || '未找到答案'}`;

                    // 将答案插入到题目的最后
                    question.appendChild(answerDisplay);
                }
            });

            console.log('答案显示完成！');
        } catch (error) {
            console.error('显示答案出错:', error);
            alert('显示答案过程出错，请重试！');
        }
    }

    // 等待页面加载完成后初始化
    window.addEventListener('load', () => {
        addAnswerButton();
    });
})();
