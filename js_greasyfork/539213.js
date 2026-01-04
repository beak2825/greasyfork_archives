// ==UserScript==
// @name         京东抢券自动点击（带刷新重试）
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  到点点击按钮，未找到时自动刷新重试
// @author       Jeanslike
// @match        *://*.jd.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      私人脚本
// @downloadURL https://update.greasyfork.org/scripts/539213/%E4%BA%AC%E4%B8%9C%E6%8A%A2%E5%88%B8%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%EF%BC%88%E5%B8%A6%E5%88%B7%E6%96%B0%E9%87%8D%E8%AF%95%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/539213/%E4%BA%AC%E4%B8%9C%E6%8A%A2%E5%88%B8%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%EF%BC%88%E5%B8%A6%E5%88%B7%E6%96%B0%E9%87%8D%E8%AF%95%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const State = {
        targetTime: null,
        buttonSelector: null,
        isRunning: false,
    };

    const Controller = {
        init() {
            this.createControlPanel();
            this.bindEvents();
            this.checkAutoClickAfterReload();
        },

        createControlPanel() {
            const panel = document.createElement('div');
            panel.style = 'position:fixed;top:10px;right:10px;background:#fff;border:1px solid #ccc;padding:10px;z-index:9999;font-size:14px;';
            panel.innerHTML = `
                <div>
                    执行时间（HH:MM:SS）：<input id="targetTime" type="text" value="${GM_getValue('targetTime', '')}" />
                </div>
                <div>
                    按钮选择器：<input id="buttonSelector" type="text" value="${GM_getValue('buttonSelector', '')}" />
                </div>
                <div>
                    页面缓冲延迟(ms)：<input id="reloadDelay" type="number" value="${GM_getValue('reloadDelay', 10)}" />
                </div>
                <div>
                    最大刷新次数：<input id="maxRetryCount" type="number" value="${GM_getValue('maxRetryCount', 4)}" />
                </div>
                <div>
                    <button id="startClick">开始自动点击</button>
                </div>
                <div id="statusText" style="margin-top:5px;color:green;"></div>
            `;
            document.body.appendChild(panel);
        },

        bindEvents() {
            document.getElementById('startClick').addEventListener('click', () => {
                State.targetTime = document.getElementById('targetTime').value;
                State.buttonSelector = document.getElementById('buttonSelector').value;
                const delay = parseInt(document.getElementById('reloadDelay').value);
                const maxRetry = parseInt(document.getElementById('maxRetryCount').value);

                GM_setValue('targetTime', State.targetTime);
                GM_setValue('buttonSelector', State.buttonSelector);
                GM_setValue('reloadDelay', delay);
                GM_setValue('maxRetryCount', maxRetry);

                State.isRunning = true;
                this.waitUntilTime(State.targetTime);
                document.getElementById('statusText').textContent = '已启动，等待执行时间...';
            });
        },

        waitUntilTime(targetTimeStr) {
            const now = new Date();
            const [h, m, s] = targetTimeStr.split(':').map(Number);
            const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, s);

            const waitMs = target.getTime() - now.getTime();
            if (waitMs <= 0) {
                this.performClick();
            } else {
                setTimeout(() => this.performClick(), waitMs);
            }
        },

        performClick() {
            localStorage.setItem('refreshRetryCount', '0');
            localStorage.setItem('autoClickAfterReload', '1');
            location.reload(); // 到时间后触发页面刷新
        },

        async checkAutoClickAfterReload() {
            if (localStorage.getItem('autoClickAfterReload') === '1') {
                localStorage.removeItem('autoClickAfterReload');

                const retryCount = parseInt(localStorage.getItem('refreshRetryCount') || '0');
                const maxRetry = GM_getValue('maxRetryCount', 4);
                const delay = GM_getValue('reloadDelay', 10);

                setTimeout(async () => {
                    const success = await this.tryClickButton();
                    if (!success && retryCount < maxRetry) {
                        console.log(`未找到按钮，第 ${retryCount + 1} 次刷新`);
                        localStorage.setItem('refreshRetryCount', (retryCount + 1).toString());
                        localStorage.setItem('autoClickAfterReload', '1');
                        location.reload();
                    } else {
                        localStorage.removeItem('refreshRetryCount');
                        if (!success) {
                            document.getElementById('statusText').textContent = '点击失败，已达到最大刷新次数';
                        }
                    }
                }, delay);
            }
        },

        async tryClickButton() {
            const selector = GM_getValue('buttonSelector', '');
            const element = await this.waitForElement(selector, 1000);
            if (element) {
                element.click();
                document.getElementById('statusText').textContent = '🎯 成功点击按钮';
                return true;
            }
            return false;
        },

        waitForElement(selector, timeout = 1000) {
            return new Promise(resolve => {
                const start = Date.now();
                const timer = setInterval(() => {
                    const el = document.querySelector(selector);
                    if (el) {
                        clearInterval(timer);
                        resolve(el);
                    } else if (Date.now() - start > timeout) {
                        clearInterval(timer);
                        resolve(null);
                    }
                }, 50);
            });
        }
    };

    Controller.init();
})();
