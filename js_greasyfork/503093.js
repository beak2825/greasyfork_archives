// ==UserScript==
// @name         在线题库查询
// @namespace    http://tampermonkey.net/
// @version      2024-08-09
// @description  上传 JSON 文件并搜索题目
// @author       akixu
// @match        *://*/*
// @license      ..
// @downloadURL https://update.greasyfork.org/scripts/503093/%E5%9C%A8%E7%BA%BF%E9%A2%98%E5%BA%93%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/503093/%E5%9C%A8%E7%BA%BF%E9%A2%98%E5%BA%93%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建界面元素
    const container = document.createElement('div');
    container.style.margin = '20px';

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    container.appendChild(fileInput);

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = '搜索题目';
    container.appendChild(searchInput);

    const questionsDiv = document.createElement('div');
    container.appendChild(questionsDiv);

    document.body.prepend(container); // 将元素添加到页面顶部

    let allQuestions = [];

    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const lines = e.target.result.split('\n').filter(line => line.trim() !== '');
                    allQuestions = lines.map(line => {
                        try {
                            return JSON.parse(line.trim());
                        } catch (jsonError) {
                            console.error('JSON解析错误:', jsonError);
                            return null;
                        }
                    }).filter(item => item !== null);
                    displayQuestions(allQuestions, searchInput.value); // 初始显示全部问题
                } catch (error) {
                    console.error('无效的文件:', error);
                }
            };
            reader.readAsText(file, 'UTF-8'); // 确保使用 UTF-8 编码读取文件
        }
    });

    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        if (query === '') {
            // 搜索框为空时不显示任何问题
            questionsDiv.innerHTML = '';
        } else {
            const filteredQuestions = allQuestions.filter(item =>
                item.question.toLowerCase().includes(query)
            );
            displayQuestions(filteredQuestions, query);
        }
    });

    function displayQuestions(data, query) {
        questionsDiv.innerHTML = ''; // 清空之前的内容

        if (data.length === 0) {
            // 如果没有匹配结果，显示没有结果提示
            const noResultsMessage = document.createElement('div');
            noResultsMessage.innerText = '没有找到匹配的问题。';
            questionsDiv.appendChild(noResultsMessage);
        } else {
            // 显示匹配的问题
            data.forEach(item => {
                const questionDiv = document.createElement('div');
                questionDiv.style.marginBottom = '15px'; // 增加间距
                let optionsHTML = '';
                if (item.a) optionsHTML += `<div>A: ${item.a}</div>`;
                if (item.b) optionsHTML += `<div>B: ${item.b}</div>`;
                if (item.c) optionsHTML += `<div>C: ${item.c}</div>`;
                if (item.d) optionsHTML += `<div>D: ${item.d}</div>`;
                if (item.e) optionsHTML += `<div>E: ${item.e}</div>`;
                if (item.f) optionsHTML += `<div>F: ${item.f}</div>`;

                questionDiv.innerHTML = `
                    <strong>题目: ${item.question}</strong><br>
                    ${optionsHTML}
                    <div><strong>答案:</strong> ${item.answer}</div>
                `;
                questionsDiv.appendChild(questionDiv);
            });
        }
    }
})();
