// ==UserScript==
// @name         广州商学院学习通防网卡
// @namespace    http://tampermonkey.net/
// @version      1.3
// @author       LinXingJun
// @description  小小的hook
// @run-at       document-start
// @match        *://*.chaoxing.com/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      i.mooc.chaoxing.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534638/%E5%B9%BF%E5%B7%9E%E5%95%86%E5%AD%A6%E9%99%A2%E5%AD%A6%E4%B9%A0%E9%80%9A%E9%98%B2%E7%BD%91%E5%8D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/534638/%E5%B9%BF%E5%B7%9E%E5%95%86%E5%AD%A6%E9%99%A2%E5%AD%A6%E4%B9%A0%E9%80%9A%E9%98%B2%E7%BD%91%E5%8D%A1.meta.js
// ==/UserScript==

const videoSelector = 'video';
const retryOnErrorMap = new WeakMap();

// 创建错误处理函数
function createRetryOnvideoError(video) {
    return function () {
        console.log("重新加载视频...");
        this.load();
    };
}

// 为指定的 video 元素绑定错误监听器
function videobindErrorListener(video) {
    // 如果已有监听器，先移除
    const existingHandler = retryOnErrorMap.get(video);
    if (existingHandler) {
        video.removeEventListener('error', existingHandler, true);
    }

    // 创建新监听器
    const handler = createRetryOnvideoError.bind(video)();
    video.addEventListener('error', handler, true);

    // 保存引用
    retryOnErrorMap.set(video, handler);
}

// 初始化绑定所有现有的 <video> 元素
function videoinit() {
    unsafeWindow.document.querySelectorAll(videoSelector).forEach(videobindErrorListener);
}

// MutationObserver 回调：检测新增的 <video> 元素
function handlevideoDOMChanges(mutationsList) {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) { // 是元素节点
                    if (node.matches(videoSelector)) {
                        videobindErrorListener(node);
                    } else {
                        node.querySelectorAll(videoSelector).forEach(videobindErrorListener);
                    }
                }
            });
        }
    }
}

// 启动监听器
function startvideoObserving() {
    const observer = new MutationObserver(handlevideoDOMChanges);
    observer.observe(unsafeWindow.document.body || unsafeWindow.document.documentElement, {
        childList: true,
        subtree: true
    });
}

function retryframe(url) {
    console.log("开始请求:" + Date.now() + url);
    const hiddenIframe = unsafeWindow.document.createElement('iframe');
    hiddenIframe.style.display = 'none';
    hiddenIframe.src = url;
    unsafeWindow.document.body.appendChild(hiddenIframe);

    hiddenIframe.onload = function () {
        console.log('加载成功:' + Date.now() + url);
        // 设置 3 秒后移除 iframe
        setTimeout(() => {
            unsafeWindow.document.body.removeChild(hiddenIframe); // 从 DOM 中移除 iframe
            hiddenIframe.src = ''; // 可选：清空 src 释放资源
        }, 3000); // 3000 毫秒 = 3 秒
    };
}

(function () {
    'use strict';
    videoinit();
    // 保存原生的 setInterval
    const originalSetInterval = unsafeWindow.setInterval;

    // 重写 setInterval
    unsafeWindow.setInterval = function (callback, delay) {
        if (delay === 30000) {
            delay = 1;
            console.log("延迟修改成功");
        }
        // 学习通自带的登录状态保持,但是由于某缘故经常卡...
        return originalSetInterval.apply(this, arguments);
    };
    unsafeWindow.document.addEventListener("DOMContentLoaded", (event) => {
        if (unsafeWindow.top === unsafeWindow.self) {
            if (unsafeWindow.location.protocol === 'https:') {
                console.log("由于你家gcc的神奇运维,可能会遭遇到混合内容报错."+
                    "要是真的遭遇到了，就复制粘贴这个链接，然后建立新标签页:"
                    + unsafeWindow.location.href.replace("https","http"));
            }
            const url1 = "https://i.chaoxing.com";
            retryframe(url1)
            setInterval(retryframe(url1), 1000 * 60 * 60);//一个小时,防止被验证码大人制裁
        }
        setInterval(() => {
            unsafeWindow.location.reload(); // 刷新当前页面
            console.log("正在重新刷新中...");
        }, 3 * 60 * 60 * 1000); //三个小时,防上被反爬大人制裁
        startvideoObserving();
        const originalOpen = unsafeWindow.XMLHttpRequest.prototype.open;
        const originalSend = unsafeWindow.XMLHttpRequest.prototype.send;
        const originalSetRequestHeader = unsafeWindow.XMLHttpRequest.prototype.setRequestHeader;

        // 存储请求头和请求体
        const requestHeaders = new WeakMap();
        const requestBodyStore = new WeakMap();

        // 覆盖setRequestHeader以保存请求头
        unsafeWindow.XMLHttpRequest.prototype.setRequestHeader = function (header, value) {
            if (!requestHeaders.has(this)) {
                requestHeaders.set(this, new Map());
            }
            requestHeaders.get(this).set(header, value);
            return originalSetRequestHeader.apply(this, arguments);
        };
        // 覆盖open以保存请求参数
        unsafeWindow.XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
            this._method = method;
            this._url = url;
            this._async = async;
            this._user = user;
            this._password = password;
            return originalOpen.apply(this, arguments);
        };

        // 覆盖send以保存请求体并实现重试逻辑
        unsafeWindow.XMLHttpRequest.prototype.send = function (body) {
            // 保存请求体
            requestBodyStore.set(this, body);
            // 检查是否是目标URL和POST请求
            if (
                (this._method.toUpperCase() === 'POST' && this._url.includes("/mooc-ans/work")) ||
                (this._method.toUpperCase() === 'GET' && this._url.includes("/mooc-ans/question/quiz-validation"))
            ) {
                console.log("正在跟踪", this._url);
                const retry = () => {
                    const newXHR = new unsafeWindow.XMLHttpRequest();
                    newXHR.open(this._method, this._url, this._async, this._user, this._password);

                    // 恢复请求头
                    if (requestHeaders.has(this)) {
                        const headers = requestHeaders.get(this);
                        headers.forEach((value, key) => {
                            newXHR.setRequestHeader(key, value);
                        });
                    }

                    // 重新发送请求
                    newXHR.send(requestBodyStore.get(this));
                };

                // 监听错误和超时事件
                this.addEventListener('error', () => {
                    console.log('请求失败（网络错误），正在重试:', this._url);
                    retry();
                });

                this.addEventListener('timeout', () => {
                    console.log('请求超时，正在重试:', this._url);
                    retry();
                });
            }

            return originalSend.apply(this, arguments);
        };
    });

})();