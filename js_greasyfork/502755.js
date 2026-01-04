// ==UserScript==
// @name         Text Book PDF Link Extractor for Smartedu
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Extract and display links from Smartedu's text books
// @author       Fieber Zhang
// @match        *://basic.smartedu.cn/tchMaterial/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502755/Text%20Book%20PDF%20Link%20Extractor%20for%20Smartedu.user.js
// @updateURL https://update.greasyfork.org/scripts/502755/Text%20Book%20PDF%20Link%20Extractor%20for%20Smartedu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建浮动窗口的样式
    const styles = `
        #iframe-url-extractor {
            position: fixed;
            top: 10px;
            right: 10px;
            width: 300px;
            max-height: 200px;
            overflow-y: auto;
            background: white;
            border: 1px solid #ccc;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            z-index: 9999;
            padding: 10px;
            border-radius: 5px;
        }
        #iframe-url-extractor h2 {
            margin: 0;
            font-size: 16px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 5px;
            margin-bottom: 10px;
        }
        #iframe-url-extractor a {
            display: block;
            margin-bottom: 5px;
            color: blue;
            text-decoration: none;
        }
        #iframe-url-extractor a:hover {
            text-decoration: underline;
        }
    `;

    // 向页面插入样式
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // 创建浮动窗口
    const container = document.createElement('div');
    container.id = 'iframe-url-extractor';
    container.innerHTML = '<h2>Iframe URL</h2><div id="url-list">Loading...</div>';
    document.body.appendChild(container);

    console.log('Script initialized');

    // 等待 10 秒后执行
    setTimeout(() => {
        const iframe = document.querySelector('iframe');
        if (iframe) {
            console.log('Iframe found');

            // 获取 iframe 的 URL
            var iframeURL = iframe.src;
            console.log('Iframe URL:', iframeURL);

            const regex = /file=([^&]+)/;
            const match = regex.exec(iframeURL);
            if (match && match[1]) {
                iframeURL = decodeURIComponent(match[1]);
            } else {
                console.log('No URL found.');
            }

            // 在浮动窗口中显示 URL
            const urlList = document.getElementById('url-list');
            urlList.innerHTML = '';

            if (iframeURL) {
                // 使用正则表达式替换 '-private'
                const modifiedURL = iframeURL.replace(/-private/, '');
                const linkElement = document.createElement('a');
                console.log(modifiedURL)
                linkElement.href = modifiedURL;
                linkElement.target = '_blank'; // 在新标签页中打开
                linkElement.textContent = modifiedURL;
                urlList.appendChild(linkElement);
            } else {
                urlList.textContent = 'No URL found.';
            }
        } else {
            console.error('Iframe not found');
        }
    }, 10000);

})();