// ==UserScript==
// @name         B站♥标题党
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  自动检测并标记Bilibili上的标题党
// @author       Zawinzala
// @match        https://www.bilibili.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532701/B%E7%AB%99%E2%99%A5%E6%A0%87%E9%A2%98%E5%85%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/532701/B%E7%AB%99%E2%99%A5%E6%A0%87%E9%A2%98%E5%85%9A.meta.js
// ==/UserScript==

// 请前往 https://aihubmix.com?aff=Nb62 获取API密钥，并替换到这里↓
const API_KEY = 'YOUR_API_KEY_HERE';

(function() {
    'use strict';

    // 检查API密钥是否已设置
    if (API_KEY === 'YOUR_API_KEY_HERE' || !API_KEY) {
        alert('未检测到API密钥！请访问 https://aihubmix.com?aff=Nb62 获取密钥，然后将其放入脚本的 API_KEY 变量中。');
        return; // 停止脚本执行
    }

    // 标题队列和并发请求计数器
    const titleQueue = [];
    let ongoingRequests = 0;
    const MAX_CONCURRENT = 5;

    // 检测标题是否为标题党并修改DOM
    async function checkTitle(titleElement) {
        const title = titleElement.getAttribute('title');
        if (!title) return;

        try {
            const response = await fetch('https://aihubmix.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'gemini-2.0-flash-lite',
                    messages: [
                        {
                            role: 'user',
                            content: `Evaluate this title for clickbait traits, including exaggeration, sensationalism, misleading content. Score from 0 (none) to 5 (extreme). Return only a number.\n\n${title}`
                        }
                    ]
                })
            });
            const data = await response.json();
            const aiResponse = data.choices[0].message.content;
            const match = aiResponse.match(/\d/);
            if (match) {
                const score = parseInt(match[0], 10);
                if (score >= 4) {
                    const a = titleElement.querySelector('a');
                    const prefix = document.createElement('span');
                    prefix.textContent = '【标题党】';
                    prefix.style.color = 'red';
                    a.insertBefore(prefix, a.firstChild);
                }
            }
        } catch (error) {
            console.error('标题检测失败:', error);
        } finally {
            titleElement.dataset.processed = 'true'; // 标记为已处理
        }
    }

    // 处理队列中的下一个标题
    function processNext() {
        if (ongoingRequests >= MAX_CONCURRENT || titleQueue.length === 0) return;
        const titleElement = titleQueue.shift();
        if (titleElement.dataset.processed) return processNext(); // 跳过已处理标题
        ongoingRequests++;
        checkTitle(titleElement).finally(() => {
            ongoingRequests--;
            processNext(); // 完成后继续处理队列
        });
    }

    // 处理页面上已存在的标题
    const existingTitles = document.querySelectorAll('h3.bili-video-card__info--tit');
    existingTitles.forEach(titleElement => {
        if (!titleElement.dataset.processed) {
            titleQueue.push(titleElement);
        }
    });

    // 启动初始处理（最多5个并发）
    for (let i = 0; i < MAX_CONCURRENT; i++) {
        processNext();
    }

    // 监控动态加载的标题
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(addedNode => {
                    if (addedNode.nodeType === Node.ELEMENT_NODE) {
                        const newTitles = addedNode.querySelectorAll('h3.bili-video-card__info--tit');
                        newTitles.forEach(titleElement => {
                            if (!titleElement.dataset.processed) {
                                titleQueue.push(titleElement);
                                processNext();
                            }
                        });
                    }
                });
            }
        });
    });

    // 观察整个页面的DOM变化
    observer.observe(document.body, { childList: true, subtree: true });
})();