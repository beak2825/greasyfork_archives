// ==UserScript==
// @name         题目分析助手
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  在每道题目下方生成一个按钮，点击后进行题目分析
// @author       SZP
// @match        https://www.fenbi.com/spa/tiku/exam/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      openai.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496797/%E9%A2%98%E7%9B%AE%E5%88%86%E6%9E%90%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/496797/%E9%A2%98%E7%9B%AE%E5%88%86%E6%9E%90%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义API的URL和Key
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    const apiKey = 'sk-'; // 请替换为你的API Key

    // 添加按钮到每道题目下方
    function addButton() {
    const questions = document.querySelectorAll('.question'); // 选择题目的容器
    console.log(`Found ${questions.length} questions.`);
    questions.forEach(question => {
        // 检查按钮是否已经存在，以避免重复添加
        if (!question.querySelector('.analyze-button')) {
            const button = document.createElement('button');
            button.innerText = '分析题目';
            button.className = 'analyze-button'; // 添加一个类名以便后续查找
            button.style.marginTop = '5px';
            button.style.marginLeft = '20px';
            button.style.padding = '5px 20px';
            button.style.backgroundColor = '#007BFF';
            button.style.color = '#FFFFFF';
            button.style.border = 'none';
            button.style.borderRadius = '5px';
            button.style.cursor = 'pointer';
            button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.15)';
            button.style.transition = 'background-color 0.3s, box-shadow 0.3s';

            // 鼠标悬停效果
            button.addEventListener('mouseover', () => {
                button.style.backgroundColor = '#0056b3';
                button.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
            });

            // 鼠标移出效果
            button.addEventListener('mouseout', () => {
                button.style.backgroundColor = '#007BFF';
                button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.15)';
            });

            button.addEventListener('click', () => analyzeQuestion(question));
            question.appendChild(button);
            console.log('Button added to question.');
        }
    });
}

    // 分析题目
    async function analyzeQuestion(question) {
        const questionText = question.innerText;
        console.log(`Analyzing question: ${questionText}`);

        const analysisContainer = document.createElement('div');
        analysisContainer.innerText = '';
        analysisContainer.style.marginTop = '10px';
        analysisContainer.style.marginLeft = '20px';
        analysisContainer.style.marginRight = '20px';
        analysisContainer.style.border = '1px solid #f0f0f0'; // 边框颜色改为浅白色
        analysisContainer.style.borderRadius = '10px'; // 添加圆角边框
        analysisContainer.style.padding = '10px';
        question.appendChild(analysisContainer);

        // 使用Fetch API来实现流式输出
        const response = await unsafeWindow.fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'user',
                        content: `以下是《公共基础知识》科目里的，请自行分析题目和选项，只给出题目考点、选项分析、通俗的解释的相关结果，通俗解释部分要综合题目、选项、解析、实际，在返回结果的时候不要使用markdown格式，使用分级对齐的方式！
                        ，在给出通俗解释的时候一定要综合生活、本题、选项、解析，最后分条详细详细详细总结一下当前题目的知识点、考点、易错点，你经常会出错，所以请你务必检查好自己的结果，
                        ${questionText}`
                    }
                ],
                temperature: 0.5,
                stream: true
            })
        });

        if (!response.body) {
            console.error('No response body');
            return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let done = false;
        let buffer = '';

        while (!done) {
            const { value, done: readerDone } = await reader.read();
            done = readerDone;
            buffer += decoder.decode(value, { stream: true });

            // 处理每个数据块
            let lines = buffer.split('\n');
            buffer = lines.pop(); // 保留最后一个不完整的行

            for (let line of lines) {
                if (line.trim().startsWith('data:')) {
                    let jsonStr = line.trim().substring(5).trim();
                    if (jsonStr !== '[DONE]') {
                        try {
                            let json = JSON.parse(jsonStr);
                            if (json.choices && json.choices.length > 0) {
                                let content = json.choices[0].delta.content || '';
                                analysisContainer.innerText += content;
                            }
                        } catch (e) {
                            console.error('Error parsing JSON:', e);
                        }
                    }
                }
            }
        }
    }

    // 等待页面加载完成
    window.addEventListener('load', addButton);
    // 监听DOM变化，确保在动态加载题目时也能添加按钮
    const observer = new MutationObserver(addButton);
    observer.observe(document.body, { childList: true, subtree: true });
})();