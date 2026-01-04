"use strict";
///<reference types="tampermonkey"/>
// ==UserScript==
// @name         一键清空通义千问对话
// @namespace    https://iuroc.com
// @version      1.0.0
// @description  打开通义千问，左下角出现按钮，点击即可清空对话列表。
// @author       iuroc
// @match        https://tongyi.aliyun.com/qianwen
// @grant        GM_xmlhttpRequest
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliyun.com
// @downloadURL https://update.greasyfork.org/scripts/479381/%E4%B8%80%E9%94%AE%E6%B8%85%E7%A9%BA%E9%80%9A%E4%B9%89%E5%8D%83%E9%97%AE%E5%AF%B9%E8%AF%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/479381/%E4%B8%80%E9%94%AE%E6%B8%85%E7%A9%BA%E9%80%9A%E4%B9%89%E5%8D%83%E9%97%AE%E5%AF%B9%E8%AF%9D.meta.js
// ==/UserScript==
const cookie = (() => {
    const v = document.cookie.match(/login_tongyi_ticket=[^;]+/);
    return v ? v[0] : undefined;
})();
const headers = {
    'X-Platform': 'pc_tongyi',
    'Referer': 'https://tongyi.aliyun.com/',
    'Content-Type': 'application/json'
};
const getSessionIdList = async () => {
    return new Promise(resolve => {
        GM_xmlhttpRequest({
            url: 'https://qianwen.aliyun.com/querySessionList',
            method: 'POST',
            cookie,
            headers,
            onload(response) {
                const list = JSON.parse(response.responseText).data;
                const sessionId = list.map(item => item.sessionId);
                console.log(sessionId);
                resolve(sessionId);
            }
        });
    });
};
const deleteBySessionId = async (sessionId, threadCount) => {
    return new Promise(resolve => {
        GM_xmlhttpRequest({
            url: 'https://qianwen.aliyun.com/deleteSession',
            method: 'POST',
            cookie,
            headers,
            data: JSON.stringify({ sessionId }),
            onload() {
                threadCount.count++;
                resolve(null);
            }
        });
    });
};
const getCookie = () => {
    const v = document.cookie.match(/login_tongyi_ticket=[^;]+/);
    return v ? v[0] : undefined;
};
(async () => {
    'use strict';
    const tool = document.createElement('div');
    const button = document.createElement('button');
    tool.style.position = 'fixed';
    tool.style.bottom = '30px';
    tool.style.left = '30px';
    tool.style.margin = '20px';
    button.onclick = async () => {
        if (confirm('确认要删除全部对话？')) {
            const sessionIdList = await getSessionIdList();
            let threadCount = { count: 0 };
            sessionIdList.forEach(async (sessionId) => {
                deleteBySessionId(sessionId, threadCount);
            });
            const timer = setInterval(() => {
                if (threadCount.count == sessionIdList.length) {
                    clearInterval(timer);
                    location.reload();
                }
            }, 100);
        }
    };
    button.innerHTML = '删除全部对话';
    tool.appendChild(button);
    document.body.appendChild(tool);
})();
