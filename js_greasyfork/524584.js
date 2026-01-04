// ==UserScript==
// @name         Duolingo Cookie
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  抓取 Duolingo 网站的 cookie  skill_tree_id 和 user_id 字段数据。
// @author       Crazyuncle
// @match        https://www.duolingo.com/*
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524584/Duolingo%20Cookie.user.js
// @updateURL https://update.greasyfork.org/scripts/524584/Duolingo%20Cookie.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let skillTreeId = null;
    let userId = null;
    const cookies = document.cookie;

    // 监听 XMLHttpRequest 请求
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        // 监听到指定的 POST 请求
        if (url.includes('https://excess.duolingo.com/batch') && method === 'POST') {
            const originalSend = this.send;
            this.send = function(body) {
                try {
                    // 打印请求的 body 以进行调试
                    console.log('捕获到的请求 body:', body);

                    // 假设 body 是 JSON 字符串，尝试解析
                    const payload = JSON.parse(body);

                    // 打印完整的 Payload 进行调试
                    console.log('捕获到的请求 Payload:', payload);

                    // 从 Payload 中提取 skill_tree_id 和 user_id
                    if (payload[0] && payload[0].attributes) {
                        skillTreeId = payload[0].attributes.skill_tree_id;
                        userId = payload[0].attributes.user_id;
                        console.log('Skill Tree ID 从请求 Payload 中获取:', skillTreeId);
                        console.log('User ID 从请求 Payload 中获取:', userId);
                    }
                } catch (e) {
                    console.error('解析 POST 请求 body 失败:', e);
                }

                // 继续执行原本的 send 方法
                originalSend.apply(this, arguments);
            };
        }

        // 调用原始的 open 方法
        originalOpen.apply(this, arguments);
    };

    // 输出抓取的数据到控制台
    console.log('Cookies:', cookies);
    console.log('Skill Tree ID:', skillTreeId);
    console.log('User ID:', userId);

    // 创建一个复制按钮并插入到页面
    const button = document.createElement('button');
    button.innerText = '复制';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.padding = '10px 20px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.zIndex = '1000';

    // 按钮点击事件：复制 cookie、skill_tree_id 和 user_id 到剪贴板
    button.addEventListener('click', () => {
        const copyText = `Cookies: ${cookies}\nSkill Tree ID: ${skillTreeId || '未找到 skill_tree_id'}\nUser ID: ${userId || '未找到 user_id'}`;
        GM_setClipboard(copyText);
        alert('Cookie、Skill Tree ID 和 User ID 已复制到剪贴板');
    });

    // 将按钮添加到页面
    document.body.appendChild(button);
})();
