// ==UserScript==
// @name         nodeseek关键词监控
// @version      0.1
// @description  nodeseek关键词监控着
// @author       Damon
// @namespace   *://*.nodeseek.com/*
// @match       *://*.nodeseek.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485154/nodeseek%E5%85%B3%E9%94%AE%E8%AF%8D%E7%9B%91%E6%8E%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/485154/nodeseek%E5%85%B3%E9%94%AE%E8%AF%8D%E7%9B%91%E6%8E%A7.meta.js
// ==/UserScript==



(async function() {
    'use strict';

    const telegramToken = '';
     
    const chatId = '';
    

    const sendTelegramMessage = async (text) => {
        const apiUrl = `https://api.telegram.org/bot${telegramToken}/sendMessage`;
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: text
            }),
        });
        return response.json();
    };


    const feishuApi = "";

    const sendFeishuMessage = async (text) => {
         fetch(feishuApi, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                msg_type: "text",
                content: {
                  text: con,
                },
              }),
          });
    };


    const fetchWithTimeout = async (url, timeout) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    };






    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    var k = 1;

    // 遍历每页
    for (let page = 1; page <= 1; page++) {
        k++;
        console.log(`Fetching page ${page}`);

        try {

        // 发送 Fetch 请求
        const response = await fetchWithTimeout('https://www.nodeseek.com/', 10000); // 10秒超时
        const html = await response.text();

        if (!response.ok) {
            throw new Error(`Fetch request failed with status: ${response.status}`);
        }

        // 解析 HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // 处理每个 tbody
        const tbodies = doc.querySelectorAll('.post-title');
        tbodies.forEach(tbody => {
            const links = tbody.querySelectorAll('a');
            links.forEach(link => {
                if (link.textContent.includes("无忧")) {
                    if (!localStorage.getItem(link.href)) {
                        localStorage.setItem(link.href, true);

                        var msg = `-------------------------\n检测到【无忧】关键词\n-------------------------\n标题: ${link.textContent}\n链接: ${link.href}\n-------------------------`;
                        // 发送到 Telegram
                        sendTelegramMessage(msg);

                      console.log('New link found and saved:', link.href);
                      console.log(link.textContent);
                    } else {
                      console.log('Existing link:', link.href);
                    }
                }
            });
        });

        } catch (error) {
            // 处理超时或其他错误
            console.error(error);
            // 刷新当前页面
            location.reload();
        }

        // 每页请求后休眠15秒
        // if (page < 2) {
        //     await sleep(6000);
        // }
        // 每页请求后休眠15秒
        // if (page == 2) {
            await sleep(81000);
            page = 0;
        // }

        if (k == 10) {
          location.reload();
        }
    }
})();