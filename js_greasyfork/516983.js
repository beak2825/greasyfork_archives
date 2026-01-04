// ==UserScript==
// @name         ChatGPT 划词回答
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  划词后调用 ChatGPT 回答选中文字内容 需要在代码中填写自己的apikey（代码第14行），也可以选择自己要使用的模型（代码第89行）。
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/516983/ChatGPT%20%E5%88%92%E8%AF%8D%E5%9B%9E%E7%AD%94.user.js
// @updateURL https://update.greasyfork.org/scripts/516983/ChatGPT%20%E5%88%92%E8%AF%8D%E5%9B%9E%E7%AD%94.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const openaiApiKey = '';  // 替换为你的 API 密钥

    // 创建一个显示回答的元素
    let answerBox = document.createElement('div');
    answerBox.id = 'chatgpt-answer-box';
    answerBox.style.position = 'fixed';
    answerBox.style.top = '10px';
    answerBox.style.right = '10px';
    answerBox.style.padding = '10px';
    answerBox.style.backgroundColor = '#fff';
    answerBox.style.border = '1px solid #ccc';
    answerBox.style.cursor = 'move'; // 添加移动光标提示
    answerBox.style.display = 'none';
    document.body.appendChild(answerBox);

    // 创建显示回答的文本区域
    let answerText = document.createElement('div');
    answerText.id = 'chatgpt-answer-text';
    answerText.style.marginBottom = '10px';
    answerBox.appendChild(answerText);

    // 创建复制和隐藏按钮
    let buttonContainer = document.createElement('div');
    buttonContainer.style.textAlign = 'right';  // 按钮位于右侧

    let copyButton = document.createElement('button');
    copyButton.textContent = '复制';
    copyButton.style.marginRight = '10px';

    let hideButton = document.createElement('button');
    hideButton.textContent = '隐藏';

    // 把按钮添加到按钮容器中，然后将容器添加到回答框中
    buttonContainer.appendChild(copyButton);
    buttonContainer.appendChild(hideButton);
    answerBox.appendChild(buttonContainer);

    // 添加样式
    GM_addStyle(`
        #chatgpt-answer-box {
            max-width: 300px;
            max-height: 400px;
            overflow-y: auto;
            font-size: 14px;
            z-index: 10000;
        }
        #chatgpt-answer-box button {
            margin-top: 10px;
            padding: 5px 10px;
            font-size: 14px;
            cursor: pointer;
        }
    `);

    // 监听划词事件
    document.addEventListener('mouseup', function() {
        let selectedText = window.getSelection().toString().trim();
        if (selectedText) {
            fetchChatGPTAnswer(selectedText);
        }
    });

    // 调用 ChatGPT API 获取回答
    function fetchChatGPTAnswer(text) {
        answerBox.style.display = 'block';
        answerText.textContent = '正在获取回答，请稍候...';

        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://api.openai.com/v1/chat/completions',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openaiApiKey}`
            },
            data: JSON.stringify({
                model: 'gpt-3.5-turbo',  // 或者 'gpt-4o' 等等
                messages: [
                    {
                        role: 'user',
                        content: text
                    }
                ],
                max_tokens: 1000
            }),
            onload: function(response) {
                try {
                    let data = JSON.parse(response.responseText);
                    console.log('Parsed Response:', data);
                    if (data.choices && data.choices.length > 0) {
                        answerText.textContent = data.choices[0].message.content.trim();
                    } else {
                        answerText.textContent = '未能获取有效回答，请检查请求内容。';
                    }
                } catch (e) {
                    answerText.textContent = '解析回答失败，请检查响应格式。';
                }
            }
        });
    }

    // 复制按钮事件
    copyButton.addEventListener('click', function() {
        let content = answerText.textContent;
        navigator.clipboard.writeText(content).then(function() {
            alert('内容已复制到剪贴板！');
        }, function() {
            alert('复制失败，请手动复制内容。');
        });
    });

    // 隐藏按钮事件
    hideButton.addEventListener('click', function() {
        answerBox.style.display = 'none';
    });

    // 添加拖动功能
    let isDragging = false;
    let offsetX, offsetY;

    answerBox.addEventListener('mousedown', function(e) {
        isDragging = true;
        offsetX = e.clientX - answerBox.offsetLeft;
        offsetY = e.clientY - answerBox.offsetTop;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
        if (isDragging) {
            answerBox.style.left = (e.clientX - offsetX) + 'px';
            answerBox.style.top = (e.clientY - offsetY) + 'px';
        }
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

})();
