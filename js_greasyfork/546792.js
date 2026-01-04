// ==UserScript==
// @name         聚工题库收集助手
// @namespace    vx:shuake345
// @version      1.0
// @description  自动收集题目和答案，建立题库|vx:shuake345
// @author       vx:shuake345
// @match        https://oe.jugong365.com/mock/special_project_details.html*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/546792/%E8%81%9A%E5%B7%A5%E9%A2%98%E5%BA%93%E6%94%B6%E9%9B%86%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/546792/%E8%81%9A%E5%B7%A5%E9%A2%98%E5%BA%93%E6%94%B6%E9%9B%86%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储题库的键名
    const QUESTION_STORAGE_KEY = 'collected_questions';

    // 获取已存储的题库
    function getStoredQuestions() {
        const stored = GM_getValue(QUESTION_STORAGE_KEY, '{}');
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('解析存储的题目失败:', e);
            return {};
        }
    }

    // 存储题库
    function storeQuestions(questions) {
        GM_setValue(QUESTION_STORAGE_KEY, JSON.stringify(questions));
    }

    // 添加新题目到题库
    function addQuestionToStorage(question, answer) {
        const questions = getStoredQuestions();
        // 使用题目内容作为键，避免重复
        questions[question] = answer;
        storeQuestions(questions);
        return questions;
    }

    // 从反馈文本中提取正确答案
    function extractAnswerFromFeedback(feedbackText) {
        if (feedbackText.includes('本题回答正确')) {
            // 查找A、B、C、D、E等答案标识
            const match = feedbackText.match(/[A-E]/);
            return match ? match[0] : 'A';
        } else if (feedbackText.includes('本题回答错误')) {
            // 提取正确答案
            const match = feedbackText.match(/正确的答案是[：:]\s*([A-E])/);
            return match ? match[1] : null;
        }
        return null;
    }

    // 创建UI显示已收集的题目
    function createQuestionPanel() {
        const panel = document.createElement('div');
        panel.id = 'question-collector-panel';
        panel.style.position = 'fixed';
        panel.style.top = '20px';
        panel.style.right = '20px';
        panel.style.width = '300px';
        panel.style.maxHeight = '400px';
        panel.style.overflowY = 'auto';
        panel.style.backgroundColor = '#f5f5f5';
        panel.style.border = '1px solid #ccc';
        panel.style.borderRadius = '5px';
        panel.style.padding = '10px';
        panel.style.zIndex = '9999';
        panel.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        panel.style.fontSize = '14px';

        const title = document.createElement('h3');
        title.textContent = '已收集题目';
        title.style.marginTop = '0';
        title.style.marginBottom = '10px';
        title.style.borderBottom = '1px solid #ddd';
        title.style.paddingBottom = '5px';

        const clearBtn = document.createElement('button');
        clearBtn.textContent = '清空题库';
        clearBtn.style.marginLeft = '10px';
        clearBtn.style.fontSize = '12px';
        clearBtn.onclick = function() {
            if (confirm('确定要清空所有收集的题目吗？')) {
                storeQuestions({});
                updateQuestionPanel();
            }
        };

        title.appendChild(clearBtn);
        panel.appendChild(title);

        const content = document.createElement('div');
        content.id = 'question-collector-content';
        panel.appendChild(content);

        document.body.appendChild(panel);
        return panel;
    }

    // 更新题目面板内容
    function updateQuestionPanel() {
        const content = document.getElementById('question-collector-content');
        if (!content) return;

        const questions = getStoredQuestions();
        const questionKeys = Object.keys(questions);

        if (questionKeys.length === 0) {
            content.innerHTML = '<p>尚未收集到任何题目</p>';
            return;
        }

        let html = `<p>已收集 <strong>${questionKeys.length}</strong> 道题目</p>`;
        html += '<div style="max-height: 300px; overflow-y: auto;">';

        questionKeys.forEach((question, index) => {
            // 缩短长题目显示
            const shortQuestion = question.length > 50 ?
                question.substring(0, 50) + '...' : question;
            html += `
                <div style="margin-bottom: 10px; padding: 5px; background: white; border-radius: 3px;">
                    <div><strong>${index + 1}. [${questions[question]}]</strong> ${shortQuestion}</div>
                </div>
            `;
        });

        html += '</div>';
        content.innerHTML = html;
    }

    // 主函数：初始化并开始监控
    function init() {
        let lastQuestion = '';

        // 创建UI面板
        createQuestionPanel();
        updateQuestionPanel();

        // 定时检查题目
        setInterval(() => {
            const questionElement = document.querySelector("div.h5.font-weight-normal.bg-white.p.m-t-xs.well");
            const feedbackElement = document.querySelector("div.p-l-lg.p-r-lg");

            if (questionElement && feedbackElement) {
                const currentQuestion = questionElement.innerText.trim();
                const feedbackText = feedbackElement.innerText;

                // 如果题目发生变化
                if (currentQuestion && currentQuestion !== lastQuestion) {
                    const answer = extractAnswerFromFeedback(feedbackText);

                    if (answer) {
                        // 添加到存储
                        addQuestionToStorage(currentQuestion, answer);
                        // 更新UI
                        updateQuestionPanel();
                        console.log(`收集题目: ${currentQuestion.substring(0, 30)}... 答案: ${answer}`);
                    }

                    lastQuestion = currentQuestion;
                }
            }
        }, 2000); // 每2秒检查一次
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();