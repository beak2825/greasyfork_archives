// ==UserScript==
// @name         AI 历史记录一键清空 - Multi-AI History Cleaner
// @name:en      AI History Cleaner One-Click
// @namespace    https://www.52pojie.cn/home.php?mod=space&uid=1034393
// @version      1.4.1
// @description  一键清空 DeepSeek、秘塔、Kimi、通义千问、智谱清言、Gemini 的历史记录。隐私保护，多端支持。
// @description:en Clear history of DeepSeek, Metaso, Kimi, Tongyi, ChatGLM, and Gemini with one click.
// @author       aura_service
// @match        *://metaso.cn/*
// @match        *://kimi.moonshot.cn/*
// @match        *://chat.deepseek.com/*
// @match        *://tongyi.aliyun.com/*
// @match        *://chatglm.cn/*
// @match        *://gemini.google.com/*
// @icon         data:image/x-icon;base64,AAABAAEAEBAAAAAAIABSAgAAFgAAAIlQTkcNChoKAAAADUlIRFIAAAAQAAAAEAgGAAAAH/P/YQAAAARnQU1BAACxjwv8YQUAAAABc1JHQgCuzhzpAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAHQSURBVDiNbZOxjhMxEIb/dSKkRNrdrHgKxNFRUR2IAoF4CzokpCsQormcqO4NKK+ipKChoLqraKiAKgUNQqGKZ0wUhRDPT5HY7G5w492Z8cz4m98gSe89zYxmxvRPkiLCtJLNzLLde0+ICEWEZsZtjNmZ9hhjJ2Hfj1TZizCEcFChfSDFdjrIVyAZLeZA7z1Hr77x2vn3TpK2nySHIoK6rhFU4ZzD3aev8eXnGr8/nGI9/AMSqKoKZ4+vgHKF6ZsHCCGgrmuoKpAyighVlcPjF/yxWmegufXtltOHlznWzKiqLEhSVVFVFcwMy+USZVkixojZbIbxeIy6rtE0DUIIAHYdqSomk8m/DlSVH+894uXxfZLkfD7P0BaLBUWEvy6uc3VRUVQzRIf9Ionbpyewm7egqmiaBmYGABiNxiCJQbFBLBxAAq2DWUixpQPvPWOMO31st5n8gQ7aIlFVLs+PqO9edmCZGW+chf/qwDm3u4VzDoPBANisUXx+CwC4c/UcR++fgCS+TkugKEASxX53zmFYliU6U3j2CVVVIYQAhw0ii+7cgfx9MIW+lFWVol0p9zkhBSZYCajuR9VmIaJsCy9DTIZ+B/2q+eHtwXvv+RdfWwuKabeMYgAAAABJRU5ErkJggg==
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530420/AI%20%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95%E4%B8%80%E9%94%AE%E6%B8%85%E7%A9%BA%20-%20Multi-AI%20History%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/530420/AI%20%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95%E4%B8%80%E9%94%AE%E6%B8%85%E7%A9%BA%20-%20Multi-AI%20History%20Cleaner.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 创建按钮并添加到页面
    const button = document.createElement('button');
    button.innerText = '清空历史记录';
    button.style.position = 'fixed';
    button.style.bottom = '100px';
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
                fetch(`https://kimi.moonshot.cn/api/chat/${id}`, {
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

  // ========== 5.ChatGLM 清空逻辑 ==========
    async function clearChatGLMHistory() {
        try {
            const tokenMatch = document.cookie.match(/chatglm_token=([^;]+)/);
            const token = tokenMatch ? tokenMatch[1] : null;
            if (!token) return alert("无法获取 chatglm_token，请先登录 ChatGLM");

            const auth = "Bearer " + token;
            const cookie = document.cookie;

            // 获取历史记录
            const res = await fetch("https://chatglm.cn/chatglm/backend-api/assistant/recently_conversation", {
                method: "POST",
                headers: {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
                    "app-name": "chatglm",
                    "authorization": auth,
                    "content-type": "application/json;charset=UTF-8",
                    "cookie": cookie
                },
                body: JSON.stringify({ num: 100 }),
            });

            const data = await res.json();
            if (data.status !== 0) throw new Error("获取会话失败");

            const list = data.result || [];
            if (!list.length) return alert("ChatGLM 无历史记录可清空");

            for (const item of list) {
                await fetch("https://chatglm.cn/chatglm/backend-api/assistant/conversation/delete", {
                    method: "POST",
                    headers: {
                        "accept": "application/json, text/plain, */*",
                        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
                        "app-name": "chatglm",
                        "authorization": auth,
                        "content-type": "application/json;charset=UTF-8",
                        "cookie": cookie
                    },
                    body: JSON.stringify({
                        assistant_id: item.assistant_id,
                        conversation_id: item.conversation_id
                    })
                });
                console.log("Deleted ChatGLM conversation:", item.title);
            }

            alert("ChatGLM 历史记录已清空！");
            location.reload();
        } catch (err) {
            console.error("ChatGLM 清空失败:", err);
            alert("ChatGLM 清空失败！");
        }
    }

    // ========== 6. 处理 gemini 清空逻辑 ==========
    async function clearGeminiHistory() {
        if (!confirm('确定要清理当前可见记录吗？')) return;

        const wait = (ms) => new Promise(r => setTimeout(r, ms));
        
        // 1. 采用递归/循环获取第一条，始终删第一条是最快的
        const getFirstBtn = () => document.querySelector('button[aria-haspopup="menu"]');
        
        let count = 0;
        while (true) {
            let btn = getFirstBtn();
            if (!btn) break; // 没按钮了就退出

            try {
                btn.click(); // 弹出菜单
                
                // 2. 极速等待菜单挂载 (使用间隔极短的轮询比死等 500ms 快得多)
                let deleteOption = null;
                for (let retry = 0; retry < 10; retry++) {
                    deleteOption = Array.from(document.querySelectorAll('div[role="menuitem"], span'))
                        .find(el => el.textContent.trim() === '删除' || el.textContent.trim() === 'Delete');
                    if (deleteOption) break;
                    await wait(20); 
                }

                if (deleteOption) {
                    deleteOption.click();

                    // 3. 极速锁定并点击确认按钮
                    for (let retry = 0; retry < 10; retry++) {
                        const confirmBtn = document.querySelector('[data-test-id="confirm-button"]');
                        if (confirmBtn) {
                            confirmBtn.click();
                            count++;
                            console.log(`已清理 ${count} 条`);
                            break;
                        }
                        await wait(20);
                    }
                }

                // 4. 给 DOM 极短的刷新缓冲时间 (防止点击过快导致 UI 假死)
                await wait(100); 

            } catch (err) {
                console.error('跳过异常条目');
                await wait(200);
            }
        }
        alert(`清理完成，共删除 ${count} 条记录！`);
    }

    // ========== 7. 触发点击事件，根据不同网址执行不同操作 ==========
    button.addEventListener('click', () => {
        if (hostname === 'metaso.cn') {
            clearMetasoHistory();
        } else if (hostname === 'chat.deepseek.com') {
            clearDeepSeekHistory();
        } else if (hostname === 'kimi.moonshot.cn') {
            clearKimiHistory();
        } else if (hostname === 'tongyi.aliyun.com') {
            clearQIANWENHistory();
        } else if (hostname === 'chatglm.cn') {
            clearChatGLMHistory();
        } else if (hostname === 'gemini.google.com') { // <-- 新增
            clearGeminiHistory();
        } else {
            alert('当前页面不支持清空操作！');
        }
    });
})();