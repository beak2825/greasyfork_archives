// ==UserScript==
// @name         hostloc.com关键字监控
// @namespace    https://hostloc.com/
// @version      0.1
// @description  检查Hostloc页面关键字，发送到TG
// @author       Damon
// @match        *://hostloc.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485152/hostloccom%E5%85%B3%E9%94%AE%E5%AD%97%E7%9B%91%E6%8E%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/485152/hostloccom%E5%85%B3%E9%94%AE%E5%AD%97%E7%9B%91%E6%8E%A7.meta.js
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

    // Initialize an array to store the unique thread IDs
    const uniqueThreadIds = [];

    // Function to extract thread ID from URL
    const extractThreadId = (url) => {
        const match = url.match(/thread-(\d+)-/);
        if (match && match[1]) {
            return match[1];
        }
        return null;
    };

    // Function to check if a thread ID already exists in the array
    const isThreadIdExists = (threadId) => {
        return uniqueThreadIds.includes(threadId);
    };

    // Loop to fetch pages
    for (let page = 1; page <= 5; page++) {
        console.log(`Fetching page ${page}`);

        try {
            const response = await fetchWithTimeout(`https://hostloc.com/forum.php?mod=forumdisplay&fid=45&page=${page}&t=5365579`, 10000); // 10 seconds timeout
            const html = await response.text();

            if (!response.ok) {
                throw new Error(`Fetch request failed with status: ${response.status}`);
            }

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const tbodies = doc.querySelectorAll('tbody');
            tbodies.forEach(tbody => {
                const links = tbody.querySelectorAll('th.common a.s.xst');
                links.forEach(link => {

                    if (link.textContent.includes("无忧")) {
                        const threadUrl = link.href;
                        const threadId = extractThreadId(threadUrl);
                        if (threadId) {
                            // Check if threadId exists in localStorage
                            if (!localStorage.getItem(threadId)) {
                                // If not, store it and send a message
                                uniqueThreadIds.push(threadId);

                                // Store threadId in localStorage
                                localStorage.setItem(threadId, true);

                                const msg = `-------------------------\n检测到【无忧】关键词\n-------------------------\n标题: ${link.textContent}\n链接: ${threadUrl}\n-------------------------`;
                                sendTelegramMessage(msg);

                                console.log('New link found and saved:', threadUrl);
                                console.log(link.textContent);
                            } else {
                                console.log('Existing link:', threadUrl);
                            }
                        }
                    }
                });
            });
        } catch (error) {
            console.error(error);
            location.reload();
        }

        if (page < 5) {
            await sleep(6000);
        }
        if (page == 5) {
            await sleep(81000);
            page = 0;
        }
    }
})();