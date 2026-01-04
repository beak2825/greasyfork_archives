// ==UserScript==
// @name         ChatGPT Conversation Data Fetcher
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Fetch and log conversation data from ChatGPT using an access token
// @author       glwhappen
// @match        https://chat.openai.com/*
// @grant        GM_xmlhttpRequest
// @homepage     https://www.glwsq.cn/post/ChatGPT-Conversation-Exporter
// @supportURL   https://github.com/glwhappen/chatgpt-conversation-exporter/issues
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481328/ChatGPT%20Conversation%20Data%20Fetcher.user.js
// @updateURL https://update.greasyfork.org/scripts/481328/ChatGPT%20Conversation%20Data%20Fetcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建复制按钮并添加到页面
    window.addEventListener('load', function() {
        const copyButton = document.createElement('button');
        copyButton.textContent = '复制对话';
        copyButton.style.position = 'fixed';
        copyButton.style.top = '10px';
        copyButton.style.right = '110px'; // 向左偏移100px
        copyButton.style.zIndex = 1000;
        copyButton.style.padding = '5px 10px';
        copyButton.style.border = 'none';
        copyButton.style.borderRadius = '5px';
        copyButton.style.backgroundColor = '#4CAF50';
        copyButton.style.color = 'white';
        copyButton.style.cursor = 'pointer';

        document.body.appendChild(copyButton);

        // 点击按钮时执行操作
        copyButton.addEventListener('click', function() {
            this.textContent = '复制中...';
            fetchAccessTokenAndConversation(() => {
                this.textContent = '复制对话';
                showCopySuccessMessage();
            });
        });
    });

    // 显示复制成功消息
    function showCopySuccessMessage() {
        const message = document.createElement('div');
        message.textContent = '对话内容已复制到剪贴板';
        message.style.position = 'fixed';
        message.style.top = '50px';
        message.style.right = '110px';
        message.style.backgroundColor = '#4CAF50';
        message.style.color = 'white';
        message.style.padding = '5px 10px';
        message.style.borderRadius = '5px';
        message.style.zIndex = 1001;

        document.body.appendChild(message);

        // 3秒后移除消息
        setTimeout(() => {
            document.body.removeChild(message);
        }, 1000);
    }

    // 获取访问令牌并获取对话内容
    function fetchAccessTokenAndConversation(callback) {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://chat.openai.com/api/auth/session",
            onload: function(response) {
                try {
                    const responseData = JSON.parse(response.responseText);
                    const accessToken = responseData.accessToken;
                    if (accessToken) {
                        fetchConversationData(accessToken, callback);
                    }
                } catch (e) {
                    console.error("解析响应时出错: ", e);
                }
            },
            onerror: function(error) {
                console.error("请求错误: ", error);
            }
        });
    }

        // 获取对话内容
    function fetchConversationData(accessToken, callback) {
        const conversationId = window.location.pathname.split('/')[2];
        if (conversationId) {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://chat.openai.com/backend-api/conversation/${conversationId}`,
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                },
                onload: function(response) {
                    try {
                        const jsonData = JSON.parse(response.responseText);
                        const markdown = convertToMarkdown(jsonData);
                        navigator.clipboard.writeText(markdown).then(function() {
                            console.log('对话内容已复制到剪贴板');
                            if (callback) callback();
                        }, function(err) {
                            console.error('无法复制文本: ', err);
                        });
                    } catch (e) {
                        console.error("解析响应数据出错: ", e);
                    }
                },
                onerror: function(error) {
                    console.error("获取对话内容时发生错误: ", error);
                }
            });
        }
    }
    function convertToMarkdown(conversationData) {
        let markdown = "### 对话内容\n\n";

        // 循环遍历每个消息
        for (const key in conversationData.mapping) {
            if (conversationData.mapping.hasOwnProperty(key)) {
                const node = conversationData.mapping[key];
                const message = node.message;

                if (message) {
                    const sender = message.author.role === 'user' ? '用户' : '机器人';
                    const contentParts = message.content.parts.join("\n");
                    const content = contentParts.trim() === '' ? '[无内容]' : contentParts;

                    markdown += `#### ${sender}:\n${content}\n\n`;
                }
            }
        }

        return markdown;
    }


})();
