// ==UserScript==
// @name         高亮显示 Access Token
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  高亮显示页面上的 Access Token 同时复制到剪切板
// @author       o19c1r.141
// @match        https://chat.openai.com/api/auth/session
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487551/%E9%AB%98%E4%BA%AE%E6%98%BE%E7%A4%BA%20Access%20Token.user.js
// @updateURL https://update.greasyfork.org/scripts/487551/%E9%AB%98%E4%BA%AE%E6%98%BE%E7%A4%BA%20Access%20Token.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // 获取页面上的 JSON 数据
    const jsonData = document.body.textContent;

    // 使用正则表达式匹配 access token 部分
    const matchResult = jsonData.match (/"accessToken":\s*"([^"]+)"/);

    // 提取匹配到的 access token
    if (matchResult && matchResult [1]) {
        const accessToken = matchResult [1];

        // 创建一个样式标签，将高亮样式应用到 access token 上
        const styleTag = document.createElement ('style');
        styleTag.textContent = `
            .highlighted-token {
                background-color: red !important;
                color: white !important;
                padding: 2px 5px;
                border-radius: 3px;
                display: inline !important; /* 确保只在 access token 处显示，而不是整个块级元素 */
            }
            .toast {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate (-50%, -50%);
                background-color: red;
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                z-index: 9999;
            }
        `;

        // 将样式标签添加到页面头部
        document.head.appendChild (styleTag);

        // 使用 access token 作为文本内容，找到页面上所有匹配的元素，并添加高亮样式
        document.body.innerHTML = document.body.innerHTML.replace (new RegExp (accessToken, 'g'), `<span class="highlighted-token">${accessToken}</span>`);

        // 创建一个隐藏的 textarea 元素，用于复制内容到剪贴板
        const textarea = document.createElement ('textarea');
        textarea.value = accessToken;
        document.body.appendChild (textarea);

        // 使用 Clipboard API 执行复制操作
        textarea.select ();
        navigator.clipboard.writeText (textarea.value).then (() => {
            console.log ('Access Token 已高亮显示，并已复制到剪贴板。');
            // 创建并显示 Toast
            const toast = document.createElement ('div');
            toast.classList.add ('toast');
            toast.textContent = ' 内容已复制至剪切板 ';
            document.body.appendChild (toast);
            // 1 秒后移除 Toast
            setTimeout (() => {
                document.body.removeChild (toast);
            }, 1000);
            // 复制完成后移除 textarea
            document.body.removeChild (textarea);
        }).catch (err => {
            console.error (' 复制到剪贴板时出错：', err);
            // 复制出错时仍需移除 textarea
            document.body.removeChild (textarea);
        });
    } else {
        console.log (' 未能提取到 Access Token。');
    }
})();
