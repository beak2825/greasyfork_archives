// ==UserScript==
// @name         missav 是否收藏预览（并发优化版）
// @namespace    https://github.com/zerobiubiu
// @version      1.2
// @description  更快地检查 missav 是否收藏（并发执行、自动等待）
// @author       zerobiubiu
// @match        https://missav.ws/cn/series/*
// @match        https://missav.ws/*/cn/series/*
// @match        https://missav.ws/*/cn/actresses/*
// @grant        none
// @license      MIT
// @icon         https://missav.ws/img/favicon.png
// @downloadURL https://update.greasyfork.org/scripts/546634/missav%20%E6%98%AF%E5%90%A6%E6%94%B6%E8%97%8F%E9%A2%84%E8%A7%88%EF%BC%88%E5%B9%B6%E5%8F%91%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/546634/missav%20%E6%98%AF%E5%90%A6%E6%94%B6%E8%97%8F%E9%A2%84%E8%A7%88%EF%BC%88%E5%B9%B6%E5%8F%91%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.addEventListener('load', async function () {
        const parentElements = document.querySelectorAll('.my-2.text-sm.text-nord4.truncate');
        const maxConcurrency = 12; // 每次最多并发处理 4 个 iframe
        const tasks = [];

        // 工具函数：等待某个元素出现在 iframe 中
        function waitForElementInIframe(iframe, selector, timeout = 8000) {
            return new Promise((resolve, reject) => {
                const start = Date.now();
                const check = () => {
                    try {
                        const doc = iframe.contentDocument || iframe.contentWindow.document;
                        const el = doc.querySelector(selector);
                        if (el) return resolve(el);
                        if (Date.now() - start > timeout) return reject(new Error('等待超时'));
                        setTimeout(check, 200);
                    } catch (e) {
                        reject(e);
                    }
                };
                check();
            });
        }

        function waitForStyleInIframe(iframe, selector, styleName, expectedValue, timeout = 8000) {
            return new Promise((resolve, reject) => {
                const start = Date.now();

                const check = () => {
                    try {
                        const doc = iframe.contentDocument || iframe.contentWindow.document;
                        const el = doc.querySelector(selector);
                        if (!el) return setTimeout(check, 200); // 等元素出来

                        const currentValue = getComputedStyle(el)[styleName];
                        if (currentValue === expectedValue) {
                            return resolve(el);
                        }

                        if (Date.now() - start > timeout) {
                            return reject(new Error(`等待样式超时，${styleName} ≠ ${expectedValue}`));
                        }

                        setTimeout(check, 200);
                    } catch (e) {
                        reject(e);
                    }
                };

                check();
            });
        }


        // 单个任务：加载并判断是否收藏
        const createTask = (element) => async () => {
            const firstLink = element.querySelector('a');
            if (!firstLink) return;

            const hiddenIframe = document.createElement('iframe');
            hiddenIframe.style.display = 'none';
            hiddenIframe.src = firstLink.href;
            document.body.appendChild(hiddenIframe);

            const success = await new Promise(resolve => {
                hiddenIframe.onload = () => resolve(true);
                hiddenIframe.onerror = () => resolve(false);
            });

            try {
                if (success) {
                    const saved_svg = await waitForStyleInIframe(hiddenIframe,
                        "body > div:nth-child(3) > div.sm\\:container.mx-auto.px-4.content-without-search.pb-12 > div > div.flex-1.order-first > div.mt-4 > div > button:nth-child(1) > svg:nth-child(1)",
                        "display",
                        "block"
                    );

                    const display = window.getComputedStyle(saved_svg).display;
                    if (display === 'block') {
                        firstLink.innerHTML = "💗💗💗" + firstLink.innerHTML;
                    }
                }
            } catch (e) {
                console.warn('处理失败:', firstLink.href, e.message);
            }

            hiddenIframe.remove(); // 清理 iframe
        };

        // 创建所有任务
        for (const element of parentElements) {
            tasks.push(createTask(element));
        }

        // 并发执行：限制每次最多并发 N 个
        const runConcurrent = async (taskList, max) => {
            const results = [];
            let index = 0;

            const runner = async () => {
                while (index < taskList.length) {
                    const currentIndex = index++;
                    try {
                        await taskList[currentIndex]();
                    } catch (e) {
                        console.warn('任务异常:', e);
                    }
                }
            };

            const workers = Array.from({ length: max }, () => runner());
            await Promise.allSettled(workers);
        };

        // 执行并发任务
        await runConcurrent(tasks, maxConcurrency);

        console.log('所有影片检查完毕 ✅');
    });
})();