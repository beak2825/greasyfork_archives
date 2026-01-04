// ==UserScript==
// @name         弹幕助手v2
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  获取微信直播和抖音直播页面中的弹幕数据并发送到WebSocket服务器
// @match        https://channels.weixin.qq.com/platform/live/liveBuild
// @match        https://live.douyin.com/*
// @icon         https://cdn.52ym.vip/temp/a0whr-l6z8y-001.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464652/%E5%BC%B9%E5%B9%95%E5%8A%A9%E6%89%8Bv2.user.js
// @updateURL https://update.greasyfork.org/scripts/464652/%E5%BC%B9%E5%B9%95%E5%8A%A9%E6%89%8Bv2.meta.js
// ==/UserScript==

const HOST = 'ws://127.0.0.1:5798/ws'; // WebSocket服务器地址
const TIME = 3000; // 检查弹幕的时间间隔

const platformMap = new Map([
    ['weixin', handleWeChatBarrage],
    ['douyin', handleDouyinBarrage]
]);

let barrageIds = []; // 存储已处理的弹幕ID

const WS = new WebSocket(HOST); // 创建WebSocket对象
WS.onopen = function () {
    console.log('连接成功');
};
WS.onclose = function () {
    console.log('断开连接');
};

function handleRequest(username, content, id) {
    // 构造弹幕数据对象
    let data = {
        nickname: username,
        content: content
    };

    console.log(data);
    // 发送弹幕数据到WebSocket服务器
    WS.send(JSON.stringify(data));

    // 将已处理的弹幕ID添加到列表中
    barrageIds.push(id);
    if (barrageIds.length > 300) {
        barrageIds.splice(0, 100);
    }
}

function handleWeChatBarrage() {
    let barrageContainer = document.querySelector('#container-wrap > div.container-center > div > div > div > div.live-realtime-interactive-part > div:nth-child(3) > div.live-card-container-body > div > div.live-message-scroller-container > div > div.vue-recycle-scroller__item-wrapper');
    if (!barrageContainer) {
        return; // Exit if the barrage container element is not found
    }
    let barrageElements = barrageContainer.querySelectorAll('div.live-message-item-container');
    for (let i = 0; i < barrageElements.length; i++) {
        let barrageElement = barrageElements[i];
        let usernameElement = barrageElement.querySelector('span.message-username-desc');
        let contentElement = barrageElement.querySelector('span.message-content');

        // 检查弹幕元素是否存在
        if (!usernameElement || !contentElement) {
            continue; // Skip if either username or content element is not found
        }

        let username = usernameElement.textContent.trim();
        let content = contentElement.textContent.trim();

        let id = username + content;
        // 检查是否已处理过该弹幕
        if (barrageIds.includes(id)) {
            continue;
        }
        handleRequest(username, content, id);
    }
}


function handleDouyinBarrage() {
    let webcastChatroom = document.getElementsByClassName('webcast-chatroom___items')[0];
    // 获取所有弹幕元素
    let barrageElements = webcastChatroom.getElementsByClassName('webcast-chatroom___item');
    // 遍历弹幕元素
    for (let barrageElementsIndex = barrageElements.length - 1; barrageElementsIndex >= 0; barrageElementsIndex--) {
        let barrageElement = barrageElements[barrageElementsIndex];
        // 忽略空白弹幕
        if (barrageElement.innerHTML === '') {
            continue;
        }
        // 忽略透明背景的弹幕
        if (barrageElement.getAttribute('style') === 'background-color: transparent;') {
            continue;
        }

        // 获取弹幕原始内容
        let original = barrageElement.innerHTML;
        let originalText = original.replace(/">(\S*)<\/span><\/div><\/span>/g, '');
        originalText = originalText.replace(/<[^>]+>/g, '');
        originalText = originalText.trimStart().trimEnd();
        // 忽略欢迎消息
        if (originalText.indexOf('欢迎来到直播间') !== -1) {
            continue;
        }
        // 忽略礼物消息
        if (originalText.indexOf('&nbsp;×&nbsp;') !== -1) {
            continue;
        }

        // 获取弹幕ID
        let id = barrageElement.getAttribute('data-id');
        // 检查是否已处理过该弹幕
        if (barrageIds.includes(id)) {
            continue;
        }

        // 解析弹幕内容和发送者昵称
        originalText = originalText.split('：');
        let nickname = originalText[0];
        nickname = nickname.trimStart().trimEnd();
        originalText.shift();
        let content = originalText.join('');
        // 忽略空白内容的弹幕
        if (content === '') {
            continue;
        }
        handleRequest(nickname, content, id);
    }
}


(function () {
    const currUrl = window.location.href
    platformMap.forEach((value, key) => {
        if (currUrl.indexOf(key) !== -1) {
            setInterval(value, TIME);
        }
    })
})();