// ==UserScript==
// @name         抖音直播间显示人数
// @namespace    http://your.namespace.com
// @version      0.7
// @description  显示抖音直播间人数 @陈泽开播了吗
// @author       Your Name
// @match        https://*.douyin.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502480/%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E9%97%B4%E6%98%BE%E7%A4%BA%E4%BA%BA%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/502480/%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E9%97%B4%E6%98%BE%E7%A4%BA%E4%BA%BA%E6%95%B0.meta.js
// ==/UserScript==

(function() {
    "use strict";

    let wasLiveBefore = false; // 上一次状态
    let isFirstCheck = true;   // 是否首次检测
    let latestRequest = null;
    let intervalId = null;

    function simulateBKeyPress() {
        const event = new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            key: 'b',
            code: 'KeyB',
            keyCode: 66
        });
        document.dispatchEvent(event);
        console.log("[动作] 模拟按下 B 键");
    }

    function handleLiveData(data) {
        const roomData = data?.data?.data?.[0];
        if (!roomData) {
            console.warn("[数据] 未获取到房间数据", data);
            return;
        }

        const isLiveNow = roomData.status == 2;
        console.log("[数据] 当前直播状态:", isLiveNow ? "进行中" : "未开播");

        if (!isFirstCheck) {
            // 只在未开播 -> 开播时触发
            if (!wasLiveBefore && isLiveNow) {
                console.log("[动作] 检测到状态变化: 未开播 → 开播");
                setTimeout(() => {
                    console.log("[动作] 模拟按B键");
                    simulateBKeyPress();
                }, 5000);
                setTimeout(() => {
                    console.log("[动作] 刷新页面");
                    window.location.reload();
                }, 10000);
            }
        } else {
            console.log("[初始化] 第一次检测，不触发刷新逻辑");
            isFirstCheck = false;
        }

        // 更新状态
        wasLiveBefore = isLiveNow;

        // 更新观众人数
        const display_value = roomData.room_view_stats.display_value;
        console.log("[数据] 当前观众人数:", display_value);
        updateAudienceCount(display_value, roomData);
    }

    function updateAudienceCount(display_value, data) {
        function setCount(el) {
            el.textContent = display_value;
            el.style.cursor = 'pointer';
            el.onclick = () => copyStreamURL(data);
        }

        const elements = document.querySelectorAll('[data-e2e="live-room-audience"]');
        elements.forEach(setCount);
    }

    function copyStreamURL(data) {
        const streamUrl = data?.stream_url?.flv_pull_url?.FULL_HD1
                       || data?.stream_url?.rtmp_pull_url
                       || data?.stream_url?.hls_pull_url
                       || JSON.stringify(data?.stream_url);
        if (!streamUrl) return;
        navigator.clipboard.writeText(streamUrl).then(() => {
            alert("推流地址已复制:\n" + streamUrl);
        });
    }

    // 拦截 XHR
    (function() {
        const origOpen = XMLHttpRequest.prototype.open;
        const origSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function(method, url, ...rest) {
            this._url = url;
            this._method = method;
            return origOpen.call(this, method, url, ...rest);
        };

        XMLHttpRequest.prototype.send = function(body) {
            if (this._url && this._url.includes("/webcast/room/web/enter")) {
                console.log("[XHR] 拦截到请求:", this._url);

                latestRequest = {
                    url: this._url,
                    method: this._method || "GET",
                    body: body,
                };

                // 第一次重发
                fetch(latestRequest.url, {
                    method: latestRequest.method,
                    body: latestRequest.body
                })
                .then(res => res.json())
                .then(data => handleLiveData(data));

                // 启动循环
                if (!intervalId) {
                    intervalId = setInterval(() => {
                        if (!latestRequest) return;
                        fetch(latestRequest.url, {
                            method: latestRequest.method,
                            body: latestRequest.body
                        })
                        .then(res => res.json())
                        .then(data => handleLiveData(data));
                    }, 5000);
                }
            }
            return origSend.call(this, body);
        };
    })();
})();
