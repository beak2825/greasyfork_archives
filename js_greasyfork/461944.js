// ==UserScript==
// @name         CHD Quiz Answer
// @namespace    https://dvel.me/posts/chd-quiz-answer
// @version      1.1.0
// @description  从 ChatGPT API 获取 CHD 每日签到问题的答案
// @author       Dvel
// @match        https://chdbits.co/bakatest.php
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/461944/CHD%20Quiz%20Answer.user.js
// @updateURL https://update.greasyfork.org/scripts/461944/CHD%20Quiz%20Answer.meta.js
// ==/UserScript==

function showSettingsDialog() {
  const apiKey = GM_getValue('apiKey', ''); // 获取已存储的API密钥，如果没有，则使用空字符串作为默认值
  const newApiKey = prompt('请输入您的API密钥：', apiKey);

  if (newApiKey !== null) { // 如果用户没有取消对话框
    GM_setValue('apiKey', newApiKey); // 存储新的API密钥
    alert('API密钥已保存。');
  }
}

(function () {
    'use strict';

    if (!GM_getValue('apiKey')) {
      showSettingsDialog();
    }

    const apiKey = GM_getValue('apiKey');
    const apiEndpoint = 'https://api.openai.com/v1/chat/completions';

    function fetchAnswer(prompt) {
        const data = {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0
        };

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: apiEndpoint,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                data: JSON.stringify(data),
                onload: function (response) {
                    const result = JSON.parse(response.responseText);
                    if (result.choices && result.choices.length > 0) {
                        resolve(result.choices[0].message.content.trim());
                    } else {
                        reject('No answer found.');
                    }
                },
                onerror: function (error) {
                    reject(error);
                }
            });
        });
    }

    const questionElement = document.querySelector('#outer > form > table > tbody > tr:nth-child(1) > td');
    const question = questionElement.textContent.trim();

    // 获取选项元素
    const optionsElement = document.querySelector('#outer > form > table > tbody > tr:nth-child(2) > td');
    const radios = Array.from(optionsElement.querySelectorAll('input[type="radio"]')).map((input, index) => ({ text: input.nextSibling.textContent.trim(), index }));
    const checkboxes = Array.from(optionsElement.querySelectorAll('input[type="checkbox"]')).map((input, index) => ({ text: input.nextSibling.textContent.trim(), index }));

    // 确定问题类型
    const isMultipleChoice = checkboxes.length > 0;

    // 根据问题类型生成提示
    const indexedOptions = radios.map((option, index) => `${index + 1}. ${option.text}`).join(', ');
    const indexedCheckboxes = checkboxes.map((option, index) => `C${index + 1}. ${option.text}`).join(', ');
    const optionsText = isMultipleChoice ? indexedCheckboxes : indexedOptions;
    const prompt = `问题是: "${question}". 选项是: ${optionsText}. 正确回答是:`;

    const loadingIndicator = document.createElement('div');
    loadingIndicator.innerHTML = '正在获取答案...';
    loadingIndicator.style.color = '#8b0000';
    questionElement.appendChild(loadingIndicator);

    fetchAnswer(prompt).then(answer => {
        const outputElement = document.createElement('div');
        outputElement.innerHTML = `ChatGPT: ${answer}`;
        outputElement.style.color = '#8b0000';
        loadingIndicator.remove();
        questionElement.appendChild(outputElement);

        if (isMultipleChoice) {
            // 处理多选题答案
            const checkboxAnswerIndices = answer.match(/C\d+/g);
            if (checkboxAnswerIndices) {
                checkboxAnswerIndices.forEach(idx => {
                    const index = parseInt(idx.replace('C', '')) - 1;
                    optionsElement.querySelectorAll('input[type="checkbox"]')[index].checked = true;
                });
            } else {
                console.warn('Checkbox answer indices not found in response.');
            }
        } else {
            // 处理单选题答案
            const answerIndex = parseInt(answer.match(/^\d/)?.[0]);
            if (answerIndex) {
                optionsElement.querySelectorAll('input[type="radio"]')[answerIndex - 1].checked = true;
            } else {
                console.warn('Answer index not found in response.');
            }
        }
    });
})();
