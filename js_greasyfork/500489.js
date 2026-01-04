// ==UserScript==  
// @name         实验室安全考试自动搜索 
// @namespace    http://tampermonkey.net/  
// @version      1.00  
// @description  自动回答实验室安全考试答案  
// @author       Panjy  
// @match        https://sysaq.ldu.edu.cn/*  
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ldu.edu.cn  
// @license MIT
// @grant        none  
// @downloadURL https://update.greasyfork.org/scripts/500489/%E5%AE%9E%E9%AA%8C%E5%AE%A4%E5%AE%89%E5%85%A8%E8%80%83%E8%AF%95%E8%87%AA%E5%8A%A8%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/500489/%E5%AE%9E%E9%AA%8C%E5%AE%A4%E5%AE%89%E5%85%A8%E8%80%83%E8%AF%95%E8%87%AA%E5%8A%A8%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==    


(function() {
    'use strict';
const token = '50ec864a334a4d35a32d7f76f7ad3356'; // 假设你已经有了有效的token

async function queryApi(questionTitle) {
    try {
        const response = await fetch(`https://tk.enncy.cn/query?title=${encodeURIComponent(questionTitle)}&token=${token}`);
        const data = await response.json();
        if (data.code === 1) {
            return data.data;
        } else {
            throw new Error('未找到答案');
        }
    } catch (error) {
        console.error('查询失败:', error);
        return { question: '未找到答案！', answer: '很抱歉, 题目搜索不到。', times: 0 };
    }
}

async function processQuestions() {
    const questions = document.querySelectorAll('.shiti');

    for (let index = 0; index < questions.length; index++) {
        const question = questions[index];
        let questionTitle = '';

        // 假设每个<h3>标签包含了问题
        const questionHeader = question.querySelector('h3');
        if (questionHeader) {
            questionTitle = questionHeader.textContent.trim();
        }

        if (questionTitle) {
            try {
                const response = await queryApi(questionTitle);

                // 根据问题的类型（判断题或选择题）来更新页面
                if (question.querySelector('input[type="radio"]')) {
                    // 处理选择题（这里只是一个简单的示例，具体逻辑需要根据实际情况编写）
                    const answerElement = document.createElement('p');
                    answerElement.textContent = `选择题答案: ${response.answer}`;
                    question.appendChild(answerElement);

                    // 更新选择题的答案部分，具体实现根据HTML结构决定
                } else if (question.querySelector('input[type="radio"][name="ti_3"]')) {
                    // 处理判断题
                    const answerElement = document.createElement('p');
                    if (response.answer.includes('正确')) {
                        answerElement.textContent = '判断题答案: 正确';
                    } else {
                        answerElement.textContent = '判断题答案: 错误';
                    }
                    question.appendChild(answerElement);
                }

                // 可以在这里添加更多的逻辑来显示答案或更新页面
            } catch (error) {
                console.error('处理问题时出错:', error);
            }
        }
    }
}

// 调用函数处理所有问题
processQuestions();

    // Your code here...
})();