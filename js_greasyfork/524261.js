// ==UserScript==
// @name         妖火站内信提醒
// @namespace    https://www.yaohuo.me/bbs/userinfo.aspx?touserid=20740
// @version      1.0.7
// @description  自动获取新私信，并在页面内通过Toast弹窗提示用户
// @author       SiXi
// @match        *://www.yaohuo.me/*
// @match        *://yaohuo.me/*
// @icon         https://yaohuo.me/css/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524261/%E5%A6%96%E7%81%AB%E7%AB%99%E5%86%85%E4%BF%A1%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/524261/%E5%A6%96%E7%81%AB%E7%AB%99%E5%86%85%E4%BF%A1%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置项
    const CHECK_INTERVAL = 15000;  // 30秒检查一次
    const MESSAGE_URL = 'https://www.yaohuo.me/bbs/messagelist.aspx';

    // 本地存储的键
    const MESSAGES_STORAGE_KEY = 'yaohuoMessages';

    // 创建Toast提醒
    function showToast(messages) {
        // 先移除旧的toast
        const oldToasts = document.querySelectorAll('.toast');
        oldToasts.forEach(toast => toast.remove());

        // 创建新的toast容器
        const toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);

        // 按顺序添加每条消息的toast
        messages.forEach((msg, index) => {
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.innerHTML = `
                新私信：${msg.from} <small>${msg.date}</small><br>
                内　容：<a href="https://www.yaohuo.me${msg.url}" target="_blank">${msg.text}</a>
            `;
            toastContainer.appendChild(toast);

            // 设置toast动画
            setTimeout(() => {
                toast.classList.add('show');
            }, 100);

            // 自动关闭Toast
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    toast.remove();
                }, 300);  // 延时删除Toast元素
            }, 8000);
        });
    }

    // 添加CSS样式
    function addToastStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            .toast-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                display: flex;
                flex-direction: column-reverse; /* 从下往上排列 */
                gap: 10px; /* 每条toast之间的间距 */
            }

            .toast {
                background-color: #333;
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                opacity: 0;
                transition: opacity 0.3s, transform 0.3s;
                transform: translateY(10px);
            }

            .toast.show {
                opacity: 1;
                transform: translateY(0);
            }

            .toast a {
                color: #4CAF50;
                text-decoration: underline;
            }
        `;
        document.head.appendChild(style);
    }

    // 本地存储获取和设置
    function saveMessages(messages) {
        GM_setValue(MESSAGES_STORAGE_KEY, messages);
    }

    function getMessages() {
        return GM_getValue(MESSAGES_STORAGE_KEY, []);
    }

    // 获取站内信
    function fetchMessages() {
        console.log('正在请求站内信...');
        GM_xmlhttpRequest({
            method: 'GET',
            url: MESSAGE_URL,
            onload: function(response) {
                console.log('站内信请求成功');
                const data = response.responseText;
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, 'text/html');
                const messageElements = doc.querySelectorAll('.listmms.line1, .listmms.line2');
                const newMessages = [];

                messageElements.forEach(element => {
                    // 检查是否有新站内信标志
                    const newIcon = element.querySelector('img[src="/NetImages/new.gif"]');
                    if (newIcon) {
                        // 提取信息
                        const linkElement = element.querySelector('a');
                        const fromElement = element.querySelector('span.laizi');
                        const dateElement = element.textContent.match(/\d{4}\/\d{1,2}\/\d{1,2} \d{1,2}:\d{2}/);

                        if (linkElement && fromElement && dateElement) {
                            const url = linkElement.getAttribute('href');
                            const text = linkElement.textContent.trim();
                            const from = fromElement.nextSibling.textContent.trim();
                            const date = dateElement[0];

                            newMessages.push({ url, text, from, date });
                        }
                    }
                });

                // 比较新站内信与本地存储的站内信
                const oldMessages = getMessages();
                const uniqueNewMessages = newMessages.filter(msg => !oldMessages.some(old => old.url === msg.url));

                if (uniqueNewMessages.length > 0) {
                    console.log('发现新站内信:', uniqueNewMessages);
                    // 保存新数据
                    saveMessages([...oldMessages, ...uniqueNewMessages]);

                    // 显示所有新消息的toast
                    showToast(uniqueNewMessages);
                } else {
                    console.log('没有新站内信');
                }
            },
            onerror: function(err) {
                console.error('获取站内信失败:', err);
                showToast([{ from: '系统', date: '', url: '', text: '获取站内信失败' }]);
            }
        });
    }

    // 设置定时器
    setInterval(() => {
        fetchMessages();
    }, CHECK_INTERVAL);

    // 首次加载时立即获取一次
    addToastStyles();
    fetchMessages();
})();