// ==UserScript==
// @name         ChatGPT问题翻译助手（基于百度翻译API）
// @namespace    http://tampermonkey.net/
// @version      2024-02-12
// @description  在向ChatGPT提交问题前自动翻译问题内容
// @author       Marverlises
// @match        https://chat.openai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487133/ChatGPT%E9%97%AE%E9%A2%98%E7%BF%BB%E8%AF%91%E5%8A%A9%E6%89%8B%EF%BC%88%E5%9F%BA%E4%BA%8E%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91API%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/487133/ChatGPT%E9%97%AE%E9%A2%98%E7%BF%BB%E8%AF%91%E5%8A%A9%E6%89%8B%EF%BC%88%E5%9F%BA%E4%BA%8E%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91API%EF%BC%89.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 创建并添加一个新按钮到页面
    const translateButton = document.createElement('button');
    translateButton.innerText = 'Translate';
    translateButton.style = 'position: fixed; bottom: 35px; right: 20px; z-index: 1000; padding: 10px 12px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;';

    document.body.appendChild(translateButton);

    // 绑定点击事件到新按钮
    translateButton.addEventListener('click', function() {
        const queryText = document.getElementById('prompt-textarea').value; // 获取问题框内容
        // 下面的内容需要改成自己的百度翻译API哦！
        const appId = ''; // 你的App ID
        const appKey = ''; // 你的App Key
        const salt = (new Date).getTime();
        const sign = CryptoJS.MD5(appId + queryText + salt + appKey).toString(); // 生成签名

        // 构建翻译API请求URL
        const url = `http://api.fanyi.baidu.com/api/trans/vip/translate?q=${encodeURIComponent(queryText)}&from=zh&to=en&appid=${appId}&salt=${salt}&sign=${sign}`;

        // 发起翻译请求
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                const res = JSON.parse(response.responseText);
                if (res && res.trans_result) {
                    // 翻译成功，获取翻译后的文本
                    const translatedText = res.trans_result[0].dst;
                    // 将翻译后的文本设置回文本框
                    document.getElementById('prompt-textarea').value = translatedText;
                    // 触发原生发送按钮的点击事件，提交翻译后的问题
                    document.querySelector('button[data-testid="send-button"]').click();
                } else {
                    // 翻译失败处理
                    alert('翻译失败，请重试！');
                }
            }
        });
    });
})();
