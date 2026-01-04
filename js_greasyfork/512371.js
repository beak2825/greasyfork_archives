// ==UserScript==
// @name         GPT-4镜像站试用30分钟授权码生成与复制
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  在页面中生成授权码并计算截止日期和时间，具有现代化美观的悬浮窗口
// @match        https://chat1688.xyz/list
// @match        https://nextai.chat/list
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/512371/GPT-4%E9%95%9C%E5%83%8F%E7%AB%99%E8%AF%95%E7%94%A830%E5%88%86%E9%92%9F%E6%8E%88%E6%9D%83%E7%A0%81%E7%94%9F%E6%88%90%E4%B8%8E%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/512371/GPT-4%E9%95%9C%E5%83%8F%E7%AB%99%E8%AF%95%E7%94%A830%E5%88%86%E9%92%9F%E6%8E%88%E6%9D%83%E7%A0%81%E7%94%9F%E6%88%90%E4%B8%8E%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 到期时长
    let expirationMinutes = 30;
    let authCode = '';
    let generatedTime = null;

    // 创建一个可拖动的浮动窗口
    let floatingDiv = document.createElement('div');
    floatingDiv.style.position = 'fixed';
    floatingDiv.style.top = '20px';
    floatingDiv.style.right = '20px';
    floatingDiv.style.width = '300px';
    floatingDiv.style.backgroundColor = '#f1f1f1';
    floatingDiv.style.border = '1px solid #ccc';
    floatingDiv.style.borderRadius = '8px';
    floatingDiv.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    floatingDiv.style.padding = '15px';
    floatingDiv.style.zIndex = '10000';
    floatingDiv.style.cursor = 'move';
    floatingDiv.style.fontFamily = 'Arial, sans-serif';
    floatingDiv.id = 'floatingDiv';

    // 标题
    let title = document.createElement('h4');
    title.textContent = 'GPT-4镜像站30分钟授权码生成器';
    title.style.margin = '0';
    title.style.paddingBottom = '10px';
    title.style.fontSize = '16px';
    title.style.color = '#333';
    title.style.borderBottom = '1px solid #ddd';
    floatingDiv.appendChild(title);

    // 授权码显示框
    let codeDisplay = document.createElement('p');
    codeDisplay.style.margin = '10px 0';
    codeDisplay.style.fontSize = '14px';
    codeDisplay.style.color = '#666';
    codeDisplay.textContent = '点击“生成授权码”按钮获取授权码';
    floatingDiv.appendChild(codeDisplay);

    // 生成授权码按钮
    let generateButton = document.createElement('button');
    generateButton.textContent = '生成授权码';
    generateButton.style.backgroundColor = '#4CAF50';
    generateButton.style.color = 'white';
    generateButton.style.border = 'none';
    generateButton.style.borderRadius = '4px';
    generateButton.style.padding = '10px';
    generateButton.style.marginTop = '10px';
    generateButton.style.cursor = 'pointer';
    floatingDiv.appendChild(generateButton);

    // 一键复制按钮
    let copyButton = document.createElement('button');
    copyButton.textContent = '一键复制';
    copyButton.style.backgroundColor = '#008CBA';
    copyButton.style.color = 'white';
    copyButton.style.border = 'none';
    copyButton.style.borderRadius = '4px';
    copyButton.style.padding = '10px';
    copyButton.style.marginTop = '10px';
    copyButton.style.marginLeft = '10px';
    copyButton.style.cursor = 'pointer';
    floatingDiv.appendChild(copyButton);

    document.body.appendChild(floatingDiv);

    // 生成授权码
    generateButton.addEventListener('click', () => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://oai.nextai.chat/make_ls.php',
            onload: function(response) {
                if (response.status === 200) {
                    // 提取网页内容
                    let content = response.responseText;

                    // 移除不需要的部分
                    content = content.replace(/<br>使用期限为30分钟/g, '');

                    // 提取并显示授权码
                    let match = content.match(/您的临时激活码为：\s*(\S+)/);
                    if (match && match[1]) {
                        authCode = match[1];
                        generatedTime = new Date();
                        codeDisplay.innerHTML = `临时授权码为：${authCode}<br>使用时长为${expirationMinutes}分钟。`;
                    } else {
                        codeDisplay.textContent = '未能获取到授权码，请检查网页内容格式。';
                    }
                } else {
                    console.error('请求失败:', response.statusText);
                    codeDisplay.textContent = '获取授权码时出错，请稍后再试。';
                }
            },
            onerror: function(error) {
                console.error('请求错误:', error);
                codeDisplay.textContent = '获取授权码时出错，请稍后再试。';
            }
        });
    });

    // 一键复制功能
    copyButton.addEventListener('click', () => {
        if (!authCode || !generatedTime) {
            alert('请先生成授权码');
            return;
        }

        let expirationTime = new Date(generatedTime.getTime() + expirationMinutes * 60000);
        let year = expirationTime.getFullYear();
        let month = (expirationTime.getMonth() + 1).toString().padStart(2, '0');
        let day = expirationTime.getDate().toString().padStart(2, '0');
        let hours = expirationTime.getHours().toString().padStart(2, '0');
        let minutes = expirationTime.getMinutes().toString().padStart(2, '0');

        let finalText = `您好，您的专属免费GPT-4试用网址（选择Plus入口）：https://nextai.chat/list \n临时授权码为：${authCode}\n使用时长为${expirationMinutes}分钟，截止时间为${year}-${month}-${day} ${hours}:${minutes} \n\nGPT4镜像站使用教程（必看）：https://www.yuque.com/dangnianmingyue-uxk4v/dtzyzt/egfwla4szps3n3y0?singleDoc#`;
        GM_setClipboard(finalText);
        alert('内容已复制到剪贴板！');
    });

    // 悬浮窗口可拖动功能
    floatingDiv.addEventListener('mousedown', function(e) {
        e.preventDefault();
        let offsetX = e.clientX - floatingDiv.getBoundingClientRect().left;
        let offsetY = e.clientY - floatingDiv.getBoundingClientRect().top;

        function move(e) {
            floatingDiv.style.left = `${e.clientX - offsetX}px`;
            floatingDiv.style.top = `${e.clientY - offsetY}px`;
            floatingDiv.style.right = 'auto'; // 防止窗口在拖动时消失
        }

        function up() {
            document.removeEventListener('mousemove', move);
            document.removeEventListener('mouseup', up);
        }

        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', up);
    });

})();