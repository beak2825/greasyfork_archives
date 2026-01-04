// ==UserScript==
// @name         Auto Download ChatGPT's voice
// @namespace    https://github.com/DrNaki
// @version      1.2.2
// @description  TTS (Text-to-Speech) via ChatGPT. Automatically downloads the audio file when ChatGPT's read aloud button is clicked. 通过ChatGPT实现文本转语音(当播放chatgpt的朗读时，自动将声音文件下载下来)
// @author       Naki
// @copyright    2024, Naki (https://github.com/DrNaki)
// @license      MIT
// @homepageURL  https://github.com/DrNaki/AutoDownloadChatGPTVoice
// @supportURL   https://github.com/DrNaki/AutoDownloadChatGPTVoice/issues
// @match        *://chatgpt.com/*
// @icon         https://github.com/DrNaki/AutoDownloadChatGPTVoice/blob/main/img/favicon-32x32.630a2b99.png
// @compatible   chrome
// @compatible   firefox
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/495120/Auto%20Download%20ChatGPT%27s%20voice.user.js
// @updateURL https://update.greasyfork.org/scripts/495120/Auto%20Download%20ChatGPT%27s%20voice.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 保存原始fetch函数
    const originalFetch = window.fetch;

    // 重写fetch函数
    window.fetch = function(...args) {
        // 检查URL中是否包含"backend-api/synthesize"
        const url = args[0];
        if (typeof url === 'string' && url.includes('backend-api/synthesize')) {
            console.log('Intercepted fetch:', url);

            // 从URL中提取message_id参数
            const urlParams = new URL(url).searchParams;
            const messageId = urlParams.get('message_id');

            // 如果message_id存在，提取其第一个'-'前的内容
            let fileName = 'response.aac'; // 默认文件名
            if (messageId) {
                const prefix = messageId.split('-')[0];
                fileName = `${prefix}.aac`;
            }

            return originalFetch(...args)
                .then(response => {
                    // 克隆响应，因为响应只能被读取一次
                    const responseClone = response.clone();

                    // 将响应转换为Blob对象并下载
                    responseClone.blob().then(blob => {
                        const objectURL = URL.createObjectURL(blob);
                        console.log('Object URL:', objectURL);

                        const a = document.createElement('a');
                        a.href = objectURL;
                        a.download = fileName; // 使用提取的文件名
                        document.body.appendChild(a);
                        a.click(); // 模拟点击以下载文件
                        document.body.removeChild(a); // 移除链接元素
                    });

                    // 返回原始响应以确保正常运行
                    return response;
                })
                .catch(error => {
                    console.error('Error fetching the response:', error);
                    throw error;
                });
        }

        // 如果URL不包含关键词，则正常执行fetch
        return originalFetch(...args);
    };

})();
