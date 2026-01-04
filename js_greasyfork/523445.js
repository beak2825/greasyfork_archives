// ==UserScript==
// @name         AI对话提问问题目录列表导航生成器（ChatGPT 和 Perplexity.ai）- 优化版本
// @name:zh-CN          AI对话提问问题目录列表导航生成器（ChatGPT 和 Perplexity.ai）- 优化版本
// @name:zh-TW          提問目錄生成器（ChatGPT & Perplexity.ai）
// @name:en             Question Directory Generator (ChatGPT & Perplexity.ai)
// @version             1.0.5
// @author              9dian9
// @namespace           https://github.com/KelvienLee/question-directory-script
// @description         为 ChatGPT 和 Perplexity.ai 提供提问目录导航功能，支持点击跳转至问题开头。
// @description:zh-CN   提供 ChatGPT 和 Perplexity.ai 提问目录功能，点击目录可跳转到问题开头。
// @description:zh-TW   提供 ChatGPT 和 Perplexity.ai 提問目錄功能，點選目錄可跳轉至問題開頭。
// @description:en      Adds a question directory for ChatGPT and Perplexity.ai, enabling smooth scroll to question start.
// @match               https://chatgpt.com/*
// @match               https://www.perplexity.ai/*
// @grant               none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523445/AI%E5%AF%B9%E8%AF%9D%E6%8F%90%E9%97%AE%E9%97%AE%E9%A2%98%E7%9B%AE%E5%BD%95%E5%88%97%E8%A1%A8%E5%AF%BC%E8%88%AA%E7%94%9F%E6%88%90%E5%99%A8%EF%BC%88ChatGPT%20%E5%92%8C%20Perplexityai%EF%BC%89-%20%E4%BC%98%E5%8C%96%E7%89%88%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/523445/AI%E5%AF%B9%E8%AF%9D%E6%8F%90%E9%97%AE%E9%97%AE%E9%A2%98%E7%9B%AE%E5%BD%95%E5%88%97%E8%A1%A8%E5%AF%BC%E8%88%AA%E7%94%9F%E6%88%90%E5%99%A8%EF%BC%88ChatGPT%20%E5%92%8C%20Perplexityai%EF%BC%89-%20%E4%BC%98%E5%8C%96%E7%89%88%E6%9C%AC.meta.js
// ==/UserScript==





(function () {
    'use strict';

    // 这里可自由调整，设置滚动到问题时保留多少顶部空间
    // 如果有固定导航栏，可适度增大这个值
    const SCROLL_MARGIN = 100;

    let observer;
    let lastUrl = window.location.href;

    /**
     * 初始化
     */
    function init() {
        const siteType = detectSite();
        if (!siteType) {
            console.warn('不支持的网站');
            return;
        }

        const chatContainer = siteType === 'chatgpt'
            ? document.querySelector('div.my-auto.text-base')
            : document.querySelector('main'); // Perplexity 的主内容区

        if (!chatContainer) {
            console.warn('未找到聊天容器，稍后重试');
            return;
        }

        if (document.getElementById('question-directory-container')) return;

        // 创建提问目录容器
        const container = document.createElement('div');
        container.id = 'question-directory-container';
        container.style.cssText = `
            position: fixed;
            top: 150px;
            right: 10px;
            z-index: 9999;
            font-family: "Arial", sans-serif;
        `;
        document.body.appendChild(container);

        // 创建展开/收起按钮
        const toggleButton = document.createElement('button');
        toggleButton.id = 'toggle-question-directory';
        toggleButton.textContent = ' ▼';
        toggleButton.style.cssText = `
            position: absolute;
            right: 0;
            padding: 10px 15px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
            transition: background-color 0.3s ease, box-shadow 0.3s ease;
        `;
        toggleButton.addEventListener('mouseover', () => {
            toggleButton.style.backgroundColor = '#45A049';
            toggleButton.style.boxShadow = '0px 6px 12px rgba(0, 0, 0, 0.2)';
        });
        toggleButton.addEventListener('mouseout', () => {
            toggleButton.style.backgroundColor = '#4CAF50';
            toggleButton.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.1)';
        });
        container.appendChild(toggleButton);

        // 创建目录面板
        const directory = document.createElement('div');
        directory.id = 'question-directory';
        directory.style.cssText = `
            display: none; /* 默认收起 */
            margin-top: 10px;
            width: 300px;
            max-height: 70vh;
            overflow-y: auto;
            background-color: #fff;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
        `;
        directory.innerHTML = '<strong style="font-size: 18px; margin-bottom: 10px;"></strong><ul id="questions-list" style="list-style-type: none; padding: 0; margin: 0;"></ul>';
        container.appendChild(directory);

        // 展开/收起事件
        toggleButton.addEventListener('click', () => {
            const isHidden = directory.style.display === 'none';
            directory.style.display = isHidden ? 'block' : 'none';
            toggleButton.textContent = ` ${isHidden ? '▲' : '▼'}`;
        });

        // 监听 DOM 变动，自动更新问题列表
        observer = new MutationObserver(updateQuestions);
        observer.observe(chatContainer, { childList: true, subtree: true });

        // 初始化先更新一次
        updateQuestions();

        // 监听 URL 变化，一旦切换话题/链接，也重置
        const urlObserver = new MutationObserver(() => {
            if (window.location.href !== lastUrl) {
                lastUrl = window.location.href;
                setTimeout(updateQuestions, 1000);
            }
        });
        urlObserver.observe(document.body, { childList: true, subtree: true });
    }

    /**
     * 判断当前站点
     */
    function detectSite() {
        if (window.location.hostname.includes('chatgpt.com')) return 'chatgpt';
        if (window.location.hostname.includes('perplexity.ai')) return 'perplexity';
        return null;
    }

    /**
     * 截断文本
     */
    function truncateText(text, length = 20) {
        if (text.length > length) {
            return text.substring(0, length) + '...';
        }
        return text;
    }

    /**
     * 更新问题列表
     */
    function updateQuestions() {
        const siteType = detectSite();
        const questionSelector = siteType === 'chatgpt'
            ? 'div[data-message-author-role="user"] .whitespace-pre-wrap'
            : '[class*="group/query"].relative.whitespace-pre-line.break-words';

        const userMessages = document.querySelectorAll(questionSelector);
        const listElement = document.querySelector('#questions-list');

        if (!userMessages.length || !listElement) return;

        listElement.innerHTML = '';

        // 为了让 scrollIntoView 更精确，给每个元素设置 scrollMarginTop
        // 让他们在滚动的时候，会多空出一段顶部距离
        userMessages.forEach(msg => {
            msg.style.scrollMarginTop = `${SCROLL_MARGIN}px`;
        });

        Array.from(userMessages).forEach((msg, i) => {
            const questionText = msg.innerText.trim();
            if (questionText) {
                const truncatedText = truncateText(questionText, 40);
                const questionId = `question-${i + 1}`;
                msg.id = questionId; // 标记下，备用

                const listItem = document.createElement('li');
                listItem.style.cssText = `
                    margin-bottom: 8px;
                    padding: 6px 10px;
                    border-radius: 6px;
                    transition: background-color 0.3s ease;
                    cursor: pointer;
                `;
                listItem.innerHTML = `<span style="text-decoration: none; color: #333; font-size: 14px; font-weight: bold;">${i + 1}. ${truncatedText}</span>`;

                // 跳转到问题元素
                listItem.addEventListener('click', (event) => {
                    event.preventDefault();
                    msg.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                    });
                });

                // 简单 hover 效果
                listItem.addEventListener('mouseover', () => {
                    listItem.style.backgroundColor = '#f0f0f0';
                });
                listItem.addEventListener('mouseout', () => {
                    listItem.style.backgroundColor = 'transparent';
                });

                listElement.appendChild(listItem);
            }
        });
    }

    // DOMContentLoaded 后再初始化
    window.addEventListener('DOMContentLoaded', () => {
        console.log('DOM 已加载，初始化提问目录');
        setTimeout(init, 200);
    });

    // 在 document 级别点击时刷新下列表，以防出现漏掉
    document.addEventListener('click', updateQuestions);

    // 如果目录莫名消失，就重新 init
    setInterval(() => {
        if (!document.getElementById('question-directory-container')) {
            console.warn('提问目录丢失，重新初始化');
            init();
        }
    }, 3000);
})();