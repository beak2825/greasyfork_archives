// ==UserScript==
// [url=home.php?mod=space&uid=170990]@name[/url]         一键清空AI历史记录（秘塔搜/DeepSeek/KIMI/QIANWEN）
// [url=home.php?mod=space&uid=1248337]@version[/url]      1.0
// @description  清空秘塔搜、DeepSeek 、KIMI、通义千问 的历史记录，带按钮触发
// @name yagizaMJ
// [url=home.php?mod=space&uid=686208]@AuThor[/url]       aura_service
// [url=home.php?mod=space&uid=195849]@match[/url]        http*://metaso.cn/*
// @match        http*://kimi.moonshot.cn/*
// @match        http*://chat.deepseek.com/*
// @match        http*://tongyi.aliyun.com/*
// [url=home.php?mod=space&uid=609072]@grant[/url]        GM_xmlhttpRequest
// @license      MIT
// @version 0.0.1.20250510084501
// @namespace https://greasyfork.org/users/276180
// @downloadURL https://update.greasyfork.org/scripts/535536/yagizaMJ.user.js
// @updateURL https://update.greasyfork.org/scripts/535536/yagizaMJ.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    // 创建按钮并添加到页面
    const button = document.createElement('button');
    button.innerText = '清空历史记录';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '1000';
    button.style.padding = '10px 20px';
    button.style.backgroundColor = '#ff4d4d';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    document.body.appendChild(button);
 
    // 判断当前网址
    const hostname = window.location.hostname;
 
    // ========== 1. 处理 metaso.cn 清空逻辑 ==========
    async function clearMetasoHistory() {
        // 获取所有按钮元素
        const buttons = document.querySelectorAll('button');
 
        // 遍历所有按钮，匹配指定类名的按钮
        buttons.forEach((button) => {
            if (
                button.classList.contains('MuiButtonBase-root') &&
                button.classList.contains('MuiIconButton-root') &&
                button.classList.contains('MuiIconButton-sizeMedium') &&
                button.classList.contains('Search_delete-btn__XlhFS') &&
                button.classList.contains('css-txgqa2')
            ) {
                // 点击删除按钮
                button.click();
 
                // 延迟0.1秒，查找并点击“确定”按钮
                setTimeout(() => {
                    const new_buttons = document.querySelectorAll('button');
                    const confirmButton = Array.from(new_buttons).find((btn) => btn.textContent.trim() === '确定');
 
                    if (confirmButton) {
                        confirmButton.click();
                    }
                }, 100);
            }
        });
        const refresh = confirm('meta so历史记录已清空！是否刷新页面？');
        if (refresh) {
            location.reload();
        }
    }
 
    // ========== 2. 处理 chat.deepseek.com 清空逻辑 ==========
    async function clearDeepSeekHistory() {
        try {
            // 获取用户 token
            const userToken = JSON.parse(localStorage.getItem('userToken')).value;
            console.log('Authorization Token:', userToken);
 
            // 获取历史记录
            const sessions = await fetchHistory(userToken);
            for (const session of sessions) {
                await deleteHistory(session.id, userToken);
                console.log(`Deleted session: ${session.id}`);
            }
            console.log('All history cleared');
            const refresh = confirm('DeepSeek 历史记录已清空！是否刷新页面？');
            if (refresh) {
                location.reload();
            }
        } catch (error) {
            console.error(error);
            alert('清空 DeepSeek 历史记录时出错！');
        }
    }
 
    // 获取 DeepSeek 历史记录
    function fetchHistory(userToken) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://chat.deepseek.com/api/v0/chat_session/fetch_page?count=100',
                headers: {
                    accept: '*/*',
                    authorization: `Bearer ${userToken}`,
                    'content-type': 'application/json',
                },
                onload: function (response) {
                    if (response.status === 200) {
                        const data = JSON.parse(response.responseText);
                        resolve(data.data.biz_data.chat_sessions);
                    } else {
                        reject('Failed to fetch history');
                    }
                },
                onerror: function () {
                    reject('Network error');
                },
            });
        });
    }
 
    // 删除 DeepSeek 历史记录
    function deleteHistory(sessionId, userToken) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://chat.deepseek.com/api/v0/chat_session/delete',
                headers: {
                    accept: '*/*',
                    authorization: `Bearer ${userToken}`,
                    'content-type': 'application/json',
                },
                data: JSON.stringify({ chat_session_id: sessionId }),
                onload: function (response) {
                    if (response.status === 200) {
                        resolve();
                    } else {
                        reject('Failed to delete session');
                    }
                },
                onerror: function () {
                    reject('Network error');
                },
            });
        });
    }
 
    // ========== 3. 处理 kimi.moonshot.cn 清空逻辑 ==========
    async function clearKimiHistory() {
        // 从 localStorage 获取 access_token
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            alert('Access token not found in localStorage');
            return;
        }
 
        // 拼接 Bearer
        const authorization = `Bearer ${accessToken}`;
 
        // 获取聊天列表
        fetch("https://kimi.moonshot.cn/api/chat/list", {
            headers: {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
                "authorization": authorization,
                "content-type": "application/json",
                "priority": "u=1, i",
                "r-timezone": "Asia/Shanghai",
                "sec-ch-ua": "\"Chromium\";v=\"134\", \"Not:A-Brand\";v=\"24\", \"Google Chrome\";v=\"134\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-language": "zh-CN",
                "Referer": "https://kimi.moonshot.cn/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            body: JSON.stringify({ kimiplus_id: "", offset: 0, q: "", size: 999 }),
            method: "POST"
        })
        .then(response => response.json())
        .then(data => {
            const items = data.items;
            if (!items || items.length === 0) {
                alert('No items found');
                return;
            }
 
            // 批量调用删除接口
            items.forEach(item => {
                const { id, name } = item;
                fetch(`[url]https://kimi.moonshot.cn/api/chat/[/url]${id}`, {
                    headers: {
                        "accept": "application/json, text/plain, */*",
                        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
                        "authorization": authorization,
                        "priority": "u=1, i",
                        "r-timezone": "Asia/Shanghai",
                        "sec-ch-ua": "\"Chromium\";v=\"134\", \"Not:A-Brand\";v=\"24\", \"Google Chrome\";v=\"134\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"Windows\"",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin",
                        "x-language": "zh-CN",
                        "Referer": "https://kimi.moonshot.cn/",
                        "Referrer-Policy": "strict-origin-when-cross-origin"
                    },
                    body: null,
                    method: "DELETE"
                })
                .then(deleteResponse => deleteResponse.json())
                .then(deleteResult => {
                    console.log(`Deleted: ${name}, Result:`, deleteResult);
                })
                .catch(error => {
                    console.error(`Error deleting ${name}:`, error);
                });
            });
            alert('kimi 历史记录已清空！');
        })
        .catch(error => {
            console.error('Error fetching chat list:', error);
            alert('清空 kimi 历史记录时出错！');
        });
    }
 
    // ========== 4. 处理 tongyi.aliyun.com 清空逻辑 ==========
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
    async function clearQIANWENHistory (){
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
    }
 
 
    // ========== 5. 触发点击事件，根据不同网址执行不同操作 ==========
    button.addEventListener('click', () => {
        if (hostname === 'metaso.cn') {
            clearMetasoHistory();
        } else if (hostname === 'chat.deepseek.com') {
            clearDeepSeekHistory();
        } else if (hostname === 'kimi.moonshot.cn') {
            clearKimiHistory();
        } else if (hostname === 'tongyi.aliyun.com') {
            clearQIANWENHistory();
        } else {
            alert('当前页面不支持清空操作！');
        }
    });
})();