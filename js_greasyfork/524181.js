// ==UserScript==
// @name         Atcoder Translation! with DeepSeek Translation
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  使用 DeepSeek 翻译增强 Atcoder 体验
// @author       LLDQ
// @match        https://atcoder.jp/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524181/Atcoder%20Translation%21%20with%20DeepSeek%20Translation.user.js
// @updateURL https://update.greasyfork.org/scripts/524181/Atcoder%20Translation%21%20with%20DeepSeek%20Translation.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const DEEPSEEK_API_KEY = "Your API Key"; // 替换为你的 DeepSeek API Key
    const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/completions"; // DeepSeek API 地址

    // 翻译函数
    async function translateText(text) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: DEEPSEEK_API_URL,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
                },
                data: JSON.stringify({
                    model: "deepseek-chat", // 模型名称
                    prompt: `请将以下内容翻译为中文：\n${text}`, // 翻译指令
                    max_tokens: 100000, // 最大 token 数
                    temperature: 1.3, // 温度参数
                    stream: true // 是否流式返回
                }),
                onload: function (response) {
                    if (response.status === 200) {
                        const data = JSON.parse(response.responseText);
                        resolve(data.choices[0].text.trim()); // 返回翻译结果
                    } else {
                        reject(`API 请求失败：${response.statusText}`);
                    }
                },
                onerror: function (error) {
                    reject(`API 请求错误：${error}`);
                }
            });
        });
    }

    // 在 Atcoder 页面中添加翻译按钮
    function addTranslateButton() {
        const problemStatement = document.querySelector(".lang-ja"); // 获取题目描述
        if (!problemStatement) return;

        const button = document.createElement("button");
        button.textContent = "翻译题目";
        button.style.margin = "10px";
        button.style.padding = "5px 10px";
        button.style.backgroundColor = "#4CAF50";
        button.style.color = "white";
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.style.cursor = "pointer";

        button.addEventListener("click", async () => {
            const textToTranslate = problemStatement.innerText; // 获取需要翻译的文本
            try {
                const translatedText = await translateText(textToTranslate); // 调用翻译函数
                problemStatement.innerText = translatedText; // 显示翻译结果
            } catch (error) {
                GM_notification({
                    title: "翻译失败",
                    text: error,
                    timeout: 5000
                });
            }
        });

        problemStatement.parentNode.insertBefore(button, problemStatement); // 插入按钮
    }

    // 页面加载完成后添加翻译按钮
    window.addEventListener("load", addTranslateButton);
})();