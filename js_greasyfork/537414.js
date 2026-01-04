// ==UserScript==
// @name         哔哩发评反诈-改
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  评论发送后自动检测状态，避免被发送成功的谎言所欺骗！
// @author       freedom-introvert & ChatGPT & DeepSeek
// @match        https://*.bilibili.com/*
// @run-at       document-idle
// @grant        GM.xmlHttpRequest
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/537414/%E5%93%94%E5%93%A9%E5%8F%91%E8%AF%84%E5%8F%8D%E8%AF%88-%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/537414/%E5%93%94%E5%93%A9%E5%8F%91%E8%AF%84%E5%8F%8D%E8%AF%88-%E6%94%B9.meta.js
// ==/UserScript==

const waitTime = 5000;//评论发送后的等待时间，单位毫秒，可修改此项，不建议低于5秒

const sortByTime = 0;
const SORT_MODE_TIME = 2;

const originalFetch = unsafeWindow.fetch;//注意是unsafeWindow，不是window，使用 GM.xmlHttpRequest 换掉window里的fecth将不起作用

// Replace the fetch function with a custom one
unsafeWindow.fetch = async function (...args) {
    // Call the original fetch function and wait for the response
    var response = await originalFetch.apply(this, args);

    // Clone the response to read its content without altering the original response
    var clonedResponse = response.clone();

    // Read the response content as text
    clonedResponse.text().then(content => {
        // Log the URL of the fetch request to the console
        var url = args[0];
        //console.log('Fetch request URL:', url);
        // Log the response content to the console
        //console.log('Fetch response content:', content);
        if (url.startsWith("//api.bilibili.com/x/v2/reply/add")) {
            handleAddCommentResponse(url, JSON.parse(content));
        }
    });

    // Return the original response so that the fetch call continues to work as normal
    return response;
};

//动态shadowBan检测
window.onload = function () {
    const currentURL = window.location.href;
    const hostname = window.location.hostname;
    let id = null;

    if (hostname === 't.bilibili.com') {
        // 提取 t.bilibili.com URL 中的数字部分
        const urlPath = window.location.pathname;
        id = urlPath.split('/')[1];
    } else if (hostname === 'www.bilibili.com') {
        // 提取 www.bilibili.com/opus URL 中的数字部分
        const urlPath = window.location.pathname;
        const pathParts = urlPath.split('/');
        if (pathParts[1] === 'opus') {
            id = pathParts[2];
        }
    }

    if (id) {
        console.log('Dynamic ID:', id);
        handleCheckDynamic(id);
    }

}

console.log(window.fetch)
console.log("反诈脚本已加载")

//
var dialogHTML = `
        <style>
        #notification-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            max-width: 350px;
        }

        .notification {
            display: none;
            position: relative;
            padding: 15px;
            margin-bottom: 10px;
            background-color: #fff;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            border-radius: 4px;
            animation: slideIn 0.3s ease-out;
            border-left: 4px solid #FB7299;
        }

        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        .notification-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 8px;
            color: #212121;
        }

        .notification-message {
            font-size: 14px;
            color: #616161;
            margin-bottom: 10px;
            white-space: pre-line;
        }

        .notification-progress {
            width: 100%;
            height: 4px;
            background-color: #e0e0e0;
            border-radius: 2px;
            margin: 10px 0;
            overflow: hidden;
        }

        .notification-progress-bar {
            height: 100%;
            background-color: #FB7299;
            width: 0;
            transition: width 0.1s linear;
        }

        .notification-progress-indeterminate {
            position: relative;
            overflow: hidden;
            background-color: #FB7299;
        }

        .notification-progress-indeterminate::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: inherit;
            animation: indeterminate 2s linear infinite;
        }

        @keyframes indeterminate {
            0% {
                transform: translateX(-100%);
            }
            100% {
                transform: translateX(100%);
            }
        }

        .notification-close {
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            font-size: 16px;
            color: #9e9e9e;
            cursor: pointer;
            padding: 0;
        }

        .notification-close:hover {
            color: #616161;
        }

        .shadowban-scanner-message {
            --message-background-color: rgb(255, 0, 0, 0.2);
            color: var(--md-sys-color-on-primary);
            padding: 1em;
            border-radius: 0.5em;
            background: var(--message-background-color);
            margin: 1em 0px 0px;
        }

        </style>
        <div id="notification-container"></div>
        `
document.body.insertAdjacentHTML('beforeend', dialogHTML);

const Notification = {
    show: function (title, message, options = {}) {
        const container = document.getElementById('notification-container');
        const notification = document.createElement('div');
        notification.className = 'notification';

        const closeButton = document.createElement('button');
        closeButton.className = 'notification-close';
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', () => {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => {
                notification.remove();
            }, 300);
        });

        const titleElement = document.createElement('div');
        titleElement.className = 'notification-title';
        titleElement.textContent = title;

        const messageElement = document.createElement('div');
        messageElement.className = 'notification-message';
        messageElement.textContent = message;

        const progressContainer = document.createElement('div');
        progressContainer.className = 'notification-progress';
        const progressBar = document.createElement('div');
        progressBar.className = 'notification-progress-bar';
        progressContainer.appendChild(progressBar);

        notification.appendChild(closeButton);
        notification.appendChild(titleElement);
        notification.appendChild(messageElement);

        if (options.progress !== undefined || options.indeterminate) {
            notification.appendChild(progressContainer);
        }

        if (options.indeterminate) {
            progressBar.className = 'notification-progress-indeterminate';
        } else if (options.progress !== undefined) {
            progressBar.style.width = `${options.progress}%`;
        }

        container.appendChild(notification);
        setTimeout(() => {
            notification.style.display = 'block';
        }, 10);

        return {
            update: function(newTitle, newMessage, newOptions) {
                if (newTitle) titleElement.textContent = newTitle;
                if (newMessage) messageElement.textContent = newMessage;

                if (newOptions) {
                    if (newOptions.progress !== undefined) {
                        progressBar.style.width = `${newOptions.progress}%`;
                        progressBar.className = 'notification-progress-bar';
                    }
                    if (newOptions.indeterminate) {
                        progressBar.className = 'notification-progress-indeterminate';
                    }
                }
            },
            close: function() {
                closeButton.click();
            }
        };
    }
};

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

async function handleAddCommentResponse(url, responseJson) {
    console.log(url);
    console.log(responseJson);
    console.log(responseJson.code);
    if (responseJson.code == 0) {
        var data = responseJson.data;
        var reply = data.reply;

        var oid = reply.oid;
        var type = reply.type;
        var rpid = reply.rpid;
        var root = reply.root;

        console.log(`${data.success_toast}，准备检查评论`);
        let notification = Notification.show("检查评论状态", "等待检查中...", {progress: 0});
        await sleepAndShowInNotification(waitTime, notification);
        notification.update("检查中...", "正在检查评论状态", {indeterminate: true});

        //如果root==0，这是在评论区的根评论，否则是一个对某评论的回复评论
        if (root == 0) {
            notification.update("检查中...", "查找无账号评论区时间排序第一页");
            var resp = await getMainCommentList(oid, type,0,SORT_MODE_TIME,false);
            if(resp.code != 0){
                showErrorResult("获取评论主列表时发生错误，响应数据：" + resp, notification);
                return;
            }
            console.log(resp);
            var replies = resp.data.replies;
            var found = findReplies(replies, rpid);
            if (found) {
                showOkResult(reply, notification);
            } else {
                //有账号获取评论回复页
                notification.update("检查中...", "有账号获取此评论的回复列表");
                resp = await fetchBilibiliCommentReplies(oid, type, rpid, 0, sortByTime, true);
                //"已经被删除了"状态码
                if (resp.code == 12022) {
                    //自己都显示被删除了那就真删除了（ps，按照流程图还要多个cookie检查，但是浏览器环境没这问题）
                    showQuickDeleteResult(reply, notification)
                } else if (resp.code == 0) {
                    //继续无账号获取来检查，看看是否是可疑的？
                    notification.update("检查中...", "无账号获取此评论的回复列表");
                    resp = await fetchBilibiliCommentReplies(oid, type, rpid, 0, sortByTime, false);
                    if (resp.code == 12022) {
                        showShadowBanResult(reply, notification);
                    } else if (resp.code == 0) {
                        showSusResult(reply, notification);
                    } else {
                        console.log(resp);
                        showErrorResult("获取评论回复列表时发生错误，响应数据：" + resp, notification);
                    }
                } else {
                    console.log(resp);
                    showErrorResult("有账号获取评论回复列表时发生错误，响应数据：" + resp, notification);
                }
            }
        } else {
            notification.update("检查中...", "无账号查找评论回复页……");

            for (i = 0; true; i++) {
                notification.update("检查中...", `无账号查找评论回复第${i}页……`);
                var resp = await fetchBilibiliCommentReplies(oid, type, root, i, sortByTime, false);
                var replies = resp.data.replies;
                console.log(resp);
                if (replies === null || replies.length === 0) {
                    console.log("已翻遍无账号下的评论回复页");
                    break;
                }

                if (findReplies(replies, rpid)) {
                    showOkResult(reply, notification);
                    return;
                }
            }

            for (i = 0; true; i++) {
                notification.update("检查中...", `有账号查找评论回复第${i}页……`);
                var resp = await fetchBilibiliCommentReplies(oid, type, root, i, sortByTime, true);
                var replies = resp.data.replies;
                console.log(resp);
                if (replies === null || replies.length === 0) {
                    console.log("已翻遍有账号下的评论回复页");
                    break;
                }

                if (findReplies(replies, rpid)) {
                    showShadowBanResult(reply, notification);
                    return;
                }
            }

            //若两个条件都没找到评论则是秒删
            showQuickDeleteResult(reply, notification);
        }
    }
}

async function handleCheckDynamic(id) {
    var resp = await fetchDynamic(id, false);
    console.log(resp);
    if (resp.code == -352) {
        addDynamicShadowBannedHint("检测到此动态被shadowBan，仅自己可见！（也可能是误判了，你可以在无痕模式去验证一下）");
    } else if (resp.code == 4101131) {
        console.log("检测到动态被shadowBan！");
        addDynamicShadowBannedHint("检测到此动态被shadowBan，仅自己可见！（可能你转发到动态的评论被ShadowBan）");
    } else if (resp.code == 500) {
        console.log("检测到动态被shadowBan！");
        addDynamicShadowBannedHint("检测到此动态被shadowBan，仅自己可见!（可能你转发到动态的评论疑似审核中）");
    } else if (resp.code == 0) {
        console.log("检查到此动态正常，没被shadowBan");
    } else {
        console.log("动态检查出错：未知的响应码", resp);
    }
}

function findReplies(replies, rpid) {
    for (var i in replies) {
        var reply = replies[i];
        console.log(reply);
        if (reply.rpid == rpid) {
            return reply;
        }
    }
    return null;
}

function findReplyInReplies(replies, rpid) {
    for (var i in replies) {
        var reply = replies[i];
        console.log(reply);
        var subReplies = reply.replies;
        console.log(subReplies)
        for (var j in subReplies) {
            var subReply = subReplies[j];
            console.log(subReply);
            if (subReply.rpid == rpid) {
                return subReply;
            }
        }
    }
    return null;
}

async function sleepAndShowInNotification(sleepTime, notification) {
    let sleepCount = sleepTime / 100;
    for (var i = 0; i <= sleepCount; i++) {
        await sleep(100);
        notification.update("等待检查中", `等待 ${i * 100}/${sleepTime}ms 后检查评论`, {progress: 100 / sleepCount * i});
    }
    notification.update("等待检查中", `等待 ${sleepTime}/${sleepTime}ms 后检查评论`, {progress: 100});
}

/**
 *
 * @param {*} oid
 * @param {*} type
 * @param {*} next
 * @param {*} mode 评论排序模式 2为按时间
 * @param {*} isLogin 是否携带cookie
 * @param {*} seek_rpid 定位rpid
 * @returns
 */

async function getMainCommentList(oid, type, next, mode,isLogin,seek_rpid) {
    let url = `https://api.bilibili.com/x/v2/reply/main?oid=${oid}&type=${type}&next=${next}&mode=${mode}` + (seek_rpid ? `&seek_rpid=${seek_rpid}` : "")
    const req = {
        url,
        anonymous: !isLogin
    }

    req.headers={ "cookie": getBuvid3Cookie() };
    let response = (await GM.xmlHttpRequest(req).catch(e => console.error(e))).response;
    let resp = JSON.parse(response);
    console.log("获取主评论列表，携带cookie："+isLogin,url,resp)
    return resp;
}

/**
 * 获取某评论的回复列表
 * @param {*} oid
 * @param {*} type
 * @param {*} root
 * @param {*} pn
 * @param {*} sort
 * @param {*} hasCookie
 * @returns
 */
async function fetchBilibiliCommentReplies(oid, type, root, pn, sort, hasCookie) {
    const url = new URL('https://api.bilibili.com/x/v2/reply/reply');
    const params = { oid, type, root, pn, sort };
    url.search = new URLSearchParams(params).toString();

    try {
        const response = await originalFetch(url, hasCookie ? { credentials: 'include' } : { credentials: 'omit' });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json(); // Return JSON object
    } catch (error) {
        throw error; // Rethrow the error
    }
}

async function fetchDynamic(id, hasCookie) {
    const url = new URL('https://api.bilibili.com/x/polymer/web-dynamic/v1/detail');
    const params = { id };
    url.search = new URLSearchParams(params).toString();

    try {
        const response = await originalFetch(url, hasCookie ? { credentials: 'include' } : { credentials: 'omit' });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json(); // Return JSON object
    } catch (error) {
        throw error; // Rethrow the error
    }
}


function showOkResult(reply, notification) {
    notification.update("检查完成", "恭喜，无账号状态下找到了你的评论，你的评论正常！\n\n你的评论：" + reply.content.message, {progress: 100});
    setTimeout(() => notification.close(), 5000);
}

function showShadowBanResult(reply, notification) {
    notification.update("检查完成", "你被骗了，此评论被shadow ban（仅自己可见）！\n\n你的评论：" + reply.content.message, {progress: 100});
    setTimeout(() => notification.close(), 5000);
}

function showQuickDeleteResult(reply, notification) {
    notification.update("检查完成", "你评论没了，此评论已被系统秒删！刷新评论区也许就不见了，复制留个档吧。\n\n你的评论：" + reply.content.message, {progress: 100});
    setTimeout(() => notification.close(), 5000);
}

function showSusResult(reply, notification) {
    notification.update("检查完成", `
                你评论状态有点可疑，虽然无账号翻找评论区获取不到你的评论，但是无账号可通过
                https://api.bilibili.com/x/v2/reply/reply?oid=${reply.oid}&pn=1&ps=20&root=${reply.rpid}&type=${reply.type}&sort=0
                获取你的评论，疑似评论区被戒严或者这是你的视频。

                你的评论：${reply.content.message}
            `, {progress: 100});
    setTimeout(() => notification.close(), 5000);
}

function showErrorResult(message, notification) {
    notification.update("发生错误", message, {progress: 0});
    setTimeout(() => notification.close(), 5000);
}

//样式抄自X（Twitter）的shadowBan检查器，插件可在Chrome商店搜索
function addDynamicShadowBannedHint(message) {
    const biliDynContent = document.querySelector('.bili-dyn-content');

    if (biliDynContent) {
        const shadowbanMessage = document.createElement('div');
        shadowbanMessage.className = 'shadowban-scanner-message';
        shadowbanMessage.style.setProperty('--md-sys-color-on-primary', 'rgb(15, 20, 25)');

        const messageSpan = document.createElement('span');
        messageSpan.textContent = message;

        shadowbanMessage.appendChild(messageSpan);
        biliDynContent.appendChild(shadowbanMessage);
    }
}

function getBuvid3Cookie() {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.startsWith('buvid3=')) {
            return cookie;
        }
    }
    return null;
}