// ==UserScript==
// @name         【O端】token自动获取
// @version      1.0.3
// @description  O端token自动获取
// @author       Zosah
// @author       You
// @match        *://super.xiaoe-tech.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_cookie
// @connect      super.xiaoe-tech.com
// @connect      qyapi.weixin.qq.com
// @license      MIT
// @namespace https://greasyfork.org/users/878840
// @downloadURL https://update.greasyfork.org/scripts/470309/%E3%80%90O%E7%AB%AF%E3%80%91token%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/470309/%E3%80%90O%E7%AB%AF%E3%80%91token%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

const SEND_MAP = {
    // getUserInfo接口的user_id是key，机器人链接是value加进来就好
    //'surezhang': 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=5ad01a5a-106d-41a3-8518-2033015c8d56',
    //'qy01064fb77cc2ddb19b595b05a6':  'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=99a2a455-0ec0-496a-956f-5c185bebb397'
}

function main() {
    getHttpOnlyCookie().then(function(res) {
        sendToClient(res)
    });
}

function getHttpOnlyCookie() {
    return new Promise(function(resolve, reject){
        GM_xmlhttpRequest({
            url:"https://super.xiaoe-tech.com/new/getUserInfo",
            method :"POST",
            onload: function(response) {
                const data = JSON.parse(response.response).data;
                console.log("baseData", data);
                let header = response.responseHeaders;
                const match = header.match(/laravel_session=([^;]+)/);
                if (match) {
                    const laravelSession = match[1];
                    console.log("=========已自动获取laravelSession==========")
                    console.log(laravelSession)
                    const result = {
                        laravelSession: laravelSession,
                        username: data.username,
                        userid: data.userid
                    }
                    resolve(result);
                } else {
                    console.log("=========未找到laravel_session的值==========");
                    reject();
                }
            }
        });
    })
}

function sendToClient(data) {
    const enableSend = checkEnableSend(data.userid);
    if (enableSend) {
        let params = {
            "msgtype": "markdown",
            "markdown": {
                "content": `
            > 用户名：<font color=\"comment\">${data.username}</font>
            > token：<font color=\"comment\">${data.laravelSession}</font>`
            }
        }
        GM_xmlhttpRequest({
            url:SEND_MAP[data.userid],
            method :"POST",
            data: JSON.stringify(params),
            onload:function(xhr){
                console.log("消息推送成功!");
            }
        });
    } else {
        console.log("非目标用户或者今天已推送")
    }

}

function checkEnableSend(userid) {
    if (!SEND_MAP[userid]) return false;
    // 1. 判断是否存在缓存
    const cacheKey = 'IS_SEND_TOKEN';
    const cachedData = localStorage.getItem(cacheKey);
    const isCached = cachedData !== null;
    // 2. 如果缓存不存在，则存储当前时间
    if (!isCached) {
        const now = new Date();
        const formattedDate = now.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        localStorage.setItem(cacheKey, formattedDate);
        return true;
    } else {
        // 3. 如果缓存存在，则判断缓存的时间是否为今天
        const cachedDate = new Date(cachedData);
        const now = new Date();
        const isToday = cachedDate.getFullYear() === now.getFullYear()
        && cachedDate.getMonth() === now.getMonth()
        && cachedDate.getDate() === now.getDate();

        // 4. 如果缓存不是今天，则存储新的时间
        if (!isToday) {
            const formattedDate = now.toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
            localStorage.setItem(cacheKey, formattedDate);
            return true;
        } else {
            return false;
        }
    }
}

(function () {
    'use strict';
    main()
})();