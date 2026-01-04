// ==UserScript==
// @name        bilibili-显示黑名单uid
// @namespace   http://tampermonkey.net/
// @description bilibili动态与评论发布时间替换为精确时间，格式为“yyyy-MM-dd hh:mm:ss”。
// @version     1.0
// @author      Y_jun
// @license     GPL-3.0
// @icon        https://www.bilibili.com/favicon.ico
// @grant       none
// @match       *://account.bilibili.com/account/blacklist*
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/488108/bilibili-%E6%98%BE%E7%A4%BA%E9%BB%91%E5%90%8D%E5%8D%95uid.user.js
// @updateURL https://update.greasyfork.org/scripts/488108/bilibili-%E6%98%BE%E7%A4%BA%E9%BB%91%E5%90%8D%E5%8D%95uid.meta.js
// ==/UserScript==


const REPLY_API_PREFIX = 'https://api.bilibili.com/x/relation/blacks';


const console = Object.create(Object.getPrototypeOf(window.console), Object.getOwnPropertyDescriptors(window.console));

const addUid = function addUid(userId, userName, count = 1) {
    const blackList = document.querySelectorAll(`.black-name`);

    // 如果评论元素未找到，则在一定时间内重复尝试数次。
    if (blackList.length === 0) {
        if (count <= 10) {
            const args = Array.from(arguments).slice(0, arguments.length);
            args.push(count + 1);
            setTimeout(addUid, 50, ...args);
        }
        return;
    }

    for (let i = 0; i < blackList.length; i++) {
        const blackNameElem = blackList[i];
        if (blackNameElem.parentElement.querySelector('.black-uid')) continue;
        if (blackNameElem.innerText === userName) {
            let blackUidElem = document.createElement('span');
            blackUidElem.className = 'black-uid';
            blackUidElem.textContent = 'UID：' + userId;
            blackNameElem.parentElement.appendChild(blackUidElem);
        }
    }
};

const handleBlacks = function handleBlacks(blacks) {
    blacks.forEach((black) => {
        try {
            addUid(black.mid, black.uname);
        } catch (ex) {
            console.error(ex);
        }
    });
};

const handleResponse = async function handleResponse(url, response) {
    if (url.startsWith(REPLY_API_PREFIX)) {
        const body = response instanceof Response ? await response.clone().text() : response.toString();
        try {
            const json = JSON.parse(body);
            if (json.code === 0) {
                setTimeout(() => {
                    handleBlacks(Array.isArray(json.data.list) ? json.data.list : []);
                }, 50);
            }
        } catch (ex) {
            console.error(ex);
        }
    }
};

const $fetch = window.fetch;

window.fetch = async function fetchHacker() {
    const response = await $fetch(...arguments);
    if (response.status === 200 && response.headers.get('content-type')?.includes('application/json')) {
        await handleResponse(response.url, response);
    }
    return response;
};

/**
 * @this XMLHttpRequest
 */
const onReadyStateChange = function onReadyStateChange() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200 && this.getAllResponseHeaders().split("\n").find((v) => v.toLowerCase().includes('content-type: application/json'))) {
        handleResponse(this.responseURL, this.response);
    }
};

const jsonpHacker = new MutationObserver((mutationList) => {
    mutationList.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeName.toLowerCase() !== 'script' || node.src.trim() === '') {
                return;
            }
            const u = new URL(node.src);
            if (u.searchParams.has('callback')) {
                const callbackName = u.searchParams.get('callback');
                const callback = window[callbackName];
                window[callbackName] = function (data) {
                    handleResponse(u.href, JSON.stringify(data));
                    callback(data);
                };
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    jsonpHacker.observe(document.head, {
        childList: true,
    });
});

window.XMLHttpRequest = class XMLHttpRequestHacker extends window.XMLHttpRequest {
    constructor() {
        super();
        this.addEventListener('readystatechange', onReadyStateChange.bind(this));
    }
};
