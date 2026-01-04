// ==UserScript==
// @name         粉笔网计时器暂停脚本
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  通过劫持Date.now()和计时器实现暂停/继续倒计时。同时拦截学习时间上报和题目提交请求，修改上报的数据（如startTime, time）。
// @author       BlingCc & Gemini
// @match        https://*.fenbi.com/*
// @license      MIT
// @grant        none
// @run-at       document-start
// @icon         https://www.fenbi.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/545537/%E7%B2%89%E7%AC%94%E7%BD%91%E8%AE%A1%E6%97%B6%E5%99%A8%E6%9A%82%E5%81%9C%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/545537/%E7%B2%89%E7%AC%94%E7%BD%91%E8%AE%A1%E6%97%B6%E5%99%A8%E6%9A%82%E5%81%9C%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('粉笔网计时器增强脚本 v2.3 已加载。');

    // ------------------ 核心功能：劫持并修改网络请求 ------------------

    const originalFetch = window.fetch;
    const originalXhrSend = XMLHttpRequest.prototype.send;
    const originalXhrOpen = XMLHttpRequest.prototype.open;

    /**
     * 根据请求的URL，修改请求体内容
     * @param {string} bodyString - 原始请求体字符串
     * @param {string} url - 请求的URL
     * @returns {string|null} - 返回修改后的请求体字符串，如果无需修改或失败则返回null
     */
    function modifyRequestBody(bodyString, url) {
        try {
            const data = JSON.parse(bodyString);
            let modified = false;

            // 规则1: 学习时间上报 (studyTime)
            if (url.includes('/activity/report/studyTime')) {
                console.log('粉笔脚本：拦截到【学习时间上报】请求', JSON.parse(JSON.stringify(data)));
                if (Array.isArray(data)) {
                    data.forEach(item => {
                        if (item && typeof item.startTime === 'number') {
                            const originalStartTime = item.startTime;
                            const baseTime = originalStartTime - (originalStartTime % 1000000);
                            const lastSixDigits = originalStartTime % 1000000;
                            const newLastSixDigits = Math.round(lastSixDigits * 0.8);
                            item.startTime = baseTime + newLastSixDigits;
                            modified = true;
                            console.log(`粉笔脚本：startTime已修改。原始值: ${originalStartTime}, 新值: ${item.startTime}`);
                        }
                    });
                }
            }
            // 规则2: 题目提交 (async/exercises)
            else if (url.includes('/api/xingce/async/exercises')) {
                console.log('粉笔脚本：拦截到【题目提交】请求', JSON.parse(JSON.stringify(data)));
                 if (Array.isArray(data)) {
                    data.forEach(item => {
                        // 检查item是否存在，并且有time属性
                        if (item && typeof item.time !== 'undefined') {
                             const originalTime = item.time;
                             // --- 这里是修改的部分 ---
                             // 将 time 修改为 35 到 47 之间的一个随机整数
                             item.time = Math.floor(Math.random() * (47 - 35 + 1)) + 35;
                             // --- 修改结束 ---
                             modified = true;
                             console.log(`粉笔脚本：time已修改。原始值: ${originalTime}, 新值: ${item.time}`);
                        }
                    });
                 }
            }

            // 如果数据被修改过，则返回新的字符串，否则返回原样
            return modified ? JSON.stringify(data) : bodyString;

        } catch (e) {
            console.error('粉笔脚本：解析或修改请求体失败，将按原样发送。', e);
            return null; // 返回null表示失败，将使用原始body
        }
    }


    // 1. 劫持 window.fetch
    window.fetch = function(input, init) {
        const url = (typeof input === 'string') ? input : input.url;
        const method = (init && init.method) ? init.method.toUpperCase() : (input && input.method) ? input.method.toUpperCase() : 'GET';

        if (method === 'POST' && (url.includes('/activity/report/studyTime') || url.includes('/api/xingce/async/exercises'))) {
            return new Promise(resolve => {
                if (!init.body) {
                    resolve(originalFetch(input, init));
                    return;
                }
                // 读取请求体，它可能是一个Blob, a Stream, etc.
                (new Response(init.body)).text().then(bodyText => {
                    const newBody = modifyRequestBody(bodyText, url);
                    const finalBody = newBody !== null ? newBody : bodyText;
                    console.log('粉笔脚本：发送修改后的请求体:', finalBody);
                    resolve(originalFetch(input, newInit));
                });
            });
        }

        return originalFetch(input, init);
    };


    // 2. 劫持 XMLHttpRequest
    XMLHttpRequest.prototype.open = function(method, url) {
        this._hooked_method = method;
        this._hooked_url = url;
        return originalXhrOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function(body) {
        const url = this._hooked_url;
        const method = this._hooked_method;

        if (method && method.toUpperCase() === 'POST' && url && (url.includes('/activity/report/studyTime') || url.includes('/api/xingce/async/exercises'))) {
            const newBody = modifyRequestBody(body, url);
            const finalBody = newBody !== null ? newBody : body;
            console.log('粉笔脚本 (XHR)：发送修改后的请求体:', finalBody);
            return originalXhrSend.call(this, finalBody);
        }

        return originalXhrSend.apply(this, arguments);
    };


    // ------------------ 核心逻辑：劫持时间和计时器函数 (原脚本功能) ------------------
    // (这部分代码保持不变)
    let isPaused = false;
    let timeOffset = 0;
    let pauseStartTime = 0;
    const originalDateNow = Date.now;
    const OriginalDate = Date;
    const originalSetInterval = window.setInterval;
    const originalRequestAnimationFrame = window.requestAnimationFrame;
    Date.now = function() {
        if (isPaused) {
            return pauseStartTime;
        }
        return originalDateNow() - timeOffset;
    };
    window.Date = class extends OriginalDate {
        constructor(...args) {
            if (args.length === 0) {
                super(Date.now());
            } else {
                super(...args);
            }
        }
    };
    Object.assign(window.Date, OriginalDate);
    window.Date.now = Date.now;
    window.setInterval = function(callback, delay, ...args) {
        const newCallback = () => {
            if (!isPaused) {
                callback(...args);
            }
        };
        return originalSetInterval(newCallback, delay);
    };
    window.requestAnimationFrame = function(callback) {
        const newCallback = (timestamp) => {
            if (!isPaused) {
                callback(timestamp);
            } else {
                originalRequestAnimationFrame(newCallback);
            }
        };
        return originalRequestAnimationFrame(newCallback);
    };

    // ------------------ UI部分：创建控制按钮 ------------------
    // (这部分代码保持不变)
    function createToggleButton() {
        const button = document.createElement('button');
        button.id = 'timer-pause-toggle-button';
        button.textContent = '⏸️ 暂停计时';
        Object.assign(button.style, {
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            zIndex: '99999',
            padding: '10px 15px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        });
        button.addEventListener('click', () => {
            isPaused = !isPaused;
            if (isPaused) {
                pauseStartTime = originalDateNow();
                button.textContent = '▶️ 继续计时';
                button.style.backgroundColor = '#28a745';
                console.log(`计时器已暂停于: ${new OriginalDate(pauseStartTime).toLocaleString()}`);
            } else {
                const pauseDuration = originalDateNow() - pauseStartTime;
                timeOffset += pauseDuration;
                button.textContent = '⏸️ 暂停计时';
                button.style.backgroundColor = '#007bff';
                console.log(`计时器已恢复，本次暂停 ${pauseDuration / 1000} 秒。总暂停时长: ${timeOffset / 1000} 秒。`);
            }
        });
        document.body.appendChild(button);
    }
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', createToggleButton);
    } else {
        createToggleButton();
    }

})();