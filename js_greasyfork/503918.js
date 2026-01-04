
 // ==UserScript==
-// @name        Bili兑换码抢购
+// @name        bili-redeem-code
 // @namespace   Violentmonkey Scripts
 // @license Mit
 // @match       https://www.bilibili.com/blackboard/activity-award-exchange.html?task_id=*
 // @grant       GM_addStyle
-// @version     1.7.1
 // @author      vurses
// @icon         https://i0.hdslb.com/bfs/activity-plat/static/b9vgSxGaAg.png
// @description    功能介绍： 1、支持B站所有激励计划，是否成功取决于b站接口是否更新，与游戏版本无关； 2、打开对应一个兑换码页面自动运行，F12控制台查看运行信息；
// @description    This script was deleted from Greasy Fork, and due to its negative effects, it has been automatically removed from your browser.
// @downloadURL https://update.greasyfork.org/scripts/503918/Bili%E5%85%91%E6%8D%A2%E7%A0%81%E6%8A%A2%E8%B4%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/503918/Bili%E5%85%91%E6%8D%A2%E7%A0%81%E6%8A%A2%E8%B4%AD.meta.js
 // ==/UserScript==



//输出响应信息
async function readReadableStream(readableStream) {
    const reader = readableStream.getReader(); // 获取读取器
    const decoder = new TextDecoder();
    let chunks = '';
    let info;
    try {
        let result;
        while ((result = await reader.read())) { // 循环直到流结束
            // 'result.value' 是从 ReadableStream 中读取的 Uint8Array 字节数据
            if (result.done) {
                const decodedText = JSON.parse(chunks);
                // 返回receiveId还是响应message
                if (decodedText.message === '0') {
                    info = {
                        code: 0,
                        rid: decodedText.data.task_info.receive_id,
                        tid: decodedText.data.task_info.id,
                        aid: decodedText.data.task_info.act_id
                    }
                } else if (decodedText.code === 202100) {
                    // 弹验证码则走一次网页自身逻辑
                    info = decodedText.message
                    console.log(decodedText.code + '：' + info)
                    document.querySelector('#app > div > div.home-wrap.select-disable > section.tool-wrap > div').click()
                } else {
                    info = decodedText.message
                    console.log(decodedText.code + '：' + info)
                }
                break
            }
            chunks = chunks + decoder.decode((result.value));
        }
    } catch (error) {
        console.error("Error reading the stream:", error);
    } finally {
        // 关闭读取器释放资源（虽然在现代浏览器中通常是自动完成的）
        reader.releaseLock();
    }
    return info
}
// 发送请求
async function fetchWrapper(url, options = {}) {
    // 合并用户自定义headers与默认headers
    const { method = 'GET', headers = {}, body = null, credentials = 'include' } = options
    const defaultHeaders = {
        'Accept': 'application/json, text/plain, */*',
    };
    const mergedHeaders = {...defaultHeaders, ...headers };
    // 对于 GET 请求，确保不携带 body
    const requestInit = {
        method,
        headers: mergedHeaders,
        credentials,
    };
    // 根据method决定是否需要序列化body，如果为post且传了值且type为url
    if (method.toUpperCase() !== 'GET' && body !== null) {
        // 将JSON对象转化为URLSearchParams实例
        const formData = new URLSearchParams();
        for (const [key, value] of Object.entries(body)) {
            formData.append(key, value);
        }
        requestInit.body = formData
    } else {
        let params = new URLSearchParams({...body });
        // 将参数添加到URL
        url = `${url}?${params.toString()}`;
    }

    // 发起fetch请求
    return await fetch(url, {
            method,
            ...requestInit
        })
        .then((response) => {
            // 处理响应体
            return readReadableStream(response.body)
        }).then(result => {
            return result
        })
        .catch((error) => {
            throw new Error('An error occurred during the fetch operation!', error);
        });
}

// 截取cookie
function getCookie(name) {
    // 获取所有cookie并以"; "分割
    const cookies = document.cookie.split('; ');
    for (let i = 0; i < cookies.length; i++) {
        // 分割键值对
        const cookie = cookies[i].split('=');
        // 删除cookie名两边的空白字符
        const cookieName = cookie[0].trim();
        // 如果找到了所需的cookie键
        if (cookieName === name) {
            // 返回对应的cookie值（去掉值两边的空白字符）
            return decodeURIComponent(cookie[1].trim());
        }
    }
    // 如果找不到指定的cookie，返回null或空字符串
    return null;
}
// 拿到csrf和id
function getCsrfAndId() {
    const id = new URLSearchParams(window.location.search).get('task_id')
    const csrf = getCookie('bili_jct')
    return { id, csrf }
}
// 拿到receiveId和task_id和act_id
async function getReceiveID() {
    let receive_id;
    let task_id;
    let act_id;
    await fetchWrapper('https://api.bilibili.com/x/activity/mission/single_task', {
        method: 'GET',
        body: getCsrfAndId()
    }).then((info) => {
        receive_id = info.rid
        task_id = info.tid
        act_id = info.aid
    })
    return { receive_id, task_id, act_id }
}


/******** Boundary *******/


const { csrf } = getCsrfAndId();
let receive_id;
let task_id;
let act_id;
// commonJs无法使用顶层await
// const { receive_id, task_id } = await getReceiveID()
// 避免请求频繁，加个定时器
// (async() => {
//     const info = await getReceiveID()
//     receive_id = info.receive_id
//     task_id = info.task_id
// })();
// 拿到receive_id、task_id再请求接口、receive_id是完成任务的凭证,task_id用于区分活动
// 开始执行并重复无限次数

setTimeout(function() {
        document.querySelector('#app > div > div.home-wrap.select-disable > section.tool-wrap > div').click();
        (async() => {
            const info = await getReceiveID()
            receive_id = info.receive_id
            task_id = info.task_id
            act_id = info.act_id
        })();
        setInterval(() => {
            fetchWrapper('https://api.bilibili.com/x/activity/mission/task/reward/receive', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: {
                    csrf,
                    act_id,
                    task_id,
                    "group_id": 0,
                    receive_id,
                    "receive_from": "missionPage",
                    "act_name": "崩坏",
                    "task_name": "星穹铁道",
                    "reward_name": "激励计划",
                    "gaia_vtoken": ""
                }
            });
        }, Time); //请求频率
         // 如果用户没抢码资格,则持续更新资格直到获取到资格
        // 请求频率过高时避免undefined
        let setReceiveTimer = setInterval(() => {
            fetchWrapper('https://api.bilibili.com/x/activity/mission/single_task', {
                method: 'GET',
                body: getCsrfAndId()
            }).then((info) => {
                (info.code === 0 && (receive_id = info.rid)) || (receive_id !== 0 && clearInterval(setReceiveTimer));
            })
        }, 2000)
    }, 1000) // 该定时器防止频繁请求导致获取信息失败