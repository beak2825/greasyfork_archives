// ==UserScript==
// @name         微博粉丝变化监测
// @namespace    Spuddy
// @version      1.2.3
// @description  监测微博粉丝变化并发送通知
// @author       Spuddy
// @match        https://weibo.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528163/%E5%BE%AE%E5%8D%9A%E7%B2%89%E4%B8%9D%E5%8F%98%E5%8C%96%E7%9B%91%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/528163/%E5%BE%AE%E5%8D%9A%E7%B2%89%E4%B8%9D%E5%8F%98%E5%8C%96%E7%9B%91%E6%B5%8B.meta.js
// ==/UserScript==

'use strict';

if (document.querySelector('.loginBtn')) {
    console.log('User is not logged in');
    return;
}

// 配置参数
const config = {
    uid: unsafeWindow.$CONFIG.uid
};

// 获取当前用户的 UID
const uid = config.uid;
console.log(`Current UID: ${uid}`);

// 初始化
let isRunning = false;
let userMap = new Map(JSON.parse(GM_getValue(`userMap_${uid}`, '[]')));
console.log('Loaded userMap from storage:', userMap);

// 获取当前时间戳
const currentTime = Date.now();
const lastRunTime = GM_getValue(`lastRunTime_${uid}`, 0);
const twentyFourHours = 24 * 60 * 60 * 1000;
console.log(`Current time: ${currentTime}, Last run time: ${lastRunTime}`);

// 判断是否超过24小时
if (currentTime - lastRunTime > twentyFourHours) {
    console.log('More than 24 hours since last run, starting main loop');
    mainLoop();
} else {
    console.log('Less than 24 hours since last run, skipping main loop');
}

// 注册菜单命令
GM_registerMenuCommand('立即执行检测', () => {
    if (isRunning) {
        alert('检测正在进行中，请稍后再试。');
        return;
    }
    mainLoop();
});

async function mainLoop() {
    if (isRunning) {
        console.log('检测正在进行中，跳过此次调用');
        return;
    }
    isRunning = true;
    // 更新缓存的时间戳
    GM_setValue(`lastRunTime_${uid}`, Date.now());
    try {
        let currentPage = 1;
        let hasNextPage = true;
        const newUserMap = new Map();
        console.log('Starting main loop');

        while (hasNextPage) {
            console.log(`Fetching page ${currentPage}`);
            const response = await fetchFansPage(currentPage);
            hasNextPage = processResponse(response, newUserMap);
            currentPage++;
        }

        const differences = compareUsers(userMap, newUserMap);
        if (differences.length > 0) {
            console.log('Differences found:', differences);
            sendNotification(differences);
            userMap = newUserMap;
            GM_setValue(`userMap_${uid}`, JSON.stringify([...userMap]));
            console.log('Updated userMap in storage');
        } else {
            console.log('No differences found');
            GM_notification({
                title: '微博粉丝变化监测',
                text: '已执行检测，没有检测到变化',
                timeout: 5000
            });
        }
    } catch (error) {
        handleError(error);
    } finally {
        isRunning = false;
    }
}

async function fetchFansPage(page) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://weibo.com/ajax/friendships/friends?uid=${config.uid}&relate=fans&type=fans&page=${page}`,
            onload: (response) => {
                if (response.status === 200) {
                    console.log(`Page ${page} fetched successfully`);
                    resolve(JSON.parse(response.responseText));
                } else {
                    console.error(`Failed to fetch page ${page}: ${response.status}`);
                    reject(new Error(`请求失败: ${response.status}`));
                }
            },
            onerror: (error) => {
                console.error(`Error fetching page ${page}:`, error);
                reject(error);
            }
        });
    });
}

function processResponse(response, userMap) {
    const users = response.users || [];
    console.log(`Processing response, found ${users.length} users`);
    users.forEach(user => {
        userMap.set(user.id, user.name);
    });
    return response.next_cursor != 0 && users.length > 0;
}

function compareUsers(oldMap, newMap) {
    const changes = [];
    // 检测新增
    for (const id of newMap.keys()) {
        if (!oldMap.has(id)) {
            const name = newMap.get(id);
            changes.push(`➕ 新增: ${name} (${id})`);
        }
    }
    // 检测移除
    for (const id of oldMap.keys()) {
        if (!newMap.has(id)) {
            const name = oldMap.get(id);
            changes.push(`➖ 移除: ${name} (${id})`);
        }
    }
    // 检测改名
    for (const id of oldMap.keys()) {
        if (newMap.has(id) && oldMap.get(id) !== newMap.get(id)) {
            const oldName = oldMap.get(id);
            const newName = newMap.get(id);
            changes.push(`🔄 改名: ${oldName} → ${newName} (${id})`);
        }
    }
    
    console.log('Comparison complete, changes:', changes);
    return changes;
}

function sendNotification(messages) {
    const content = messages.join('<br>');
    console.log('Sending notification:', content);
    // 创建一个弹窗元素
    const notificationDiv = document.createElement('div');
    notificationDiv.style.position = 'fixed';
    notificationDiv.style.top = '20px';
    notificationDiv.style.right = '20px';
    notificationDiv.style.backgroundColor = 'white';
    notificationDiv.style.border = '1px solid black';
    notificationDiv.style.padding = '10px';
    notificationDiv.style.zIndex = '10000';
    notificationDiv.style.minWidth = '300px';
    notificationDiv.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    notificationDiv.style.whiteSpace = 'nowrap';
    notificationDiv.style.maxHeight = '80vh';
    notificationDiv.style.overflowY = 'auto';
    notificationDiv.innerHTML = `<strong>粉丝变化通知：</strong><br>${content}<br>`;

    // 添加关闭按钮
    const closeButton = document.createElement('button');
    closeButton.textContent = '关闭';
    closeButton.style.marginTop = '10px';
    closeButton.onclick = () => {
        document.body.removeChild(notificationDiv);
    };
    notificationDiv.appendChild(closeButton);

    // 将弹窗添加到文档中
    document.body.appendChild(notificationDiv);

    alert(`粉丝变化通知（完整见网页右上角）：\n\n${messages.join('\n')}`);
}

function handleError(error) {
    console.error('发生错误:', error);
    GM_notification({
        title: '微博粉丝变化监测',
        text: '发生错误：' + error.message.substring(0, 100),
        timeout: 5000
    });
}

// 修改初始化提示
if (!GM_getValue('init', false)) {
    console.log('First time initialization');
    GM_notification({
        title: '微博粉丝变化监测',
        text: '监测服务已启动',
        timeout: 5000
    });
    GM_setValue('init', true);
}