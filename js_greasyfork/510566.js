// ==UserScript==
// @name         B站右侧多集PV窗口正常化大小(处理Windows用户窗口问题)
// @namespace    http://exdragon.top/tampermokey/b1/
// @version      1.0.1
// @description  B站右侧多集PV窗口正常化大小(处理Windows用户窗口问题) issue: https://t.bilibili.com/982101249313734681#reply243186688721
// @author       exdragon
// @match        https://www.bilibili.com/video/**
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510566/B%E7%AB%99%E5%8F%B3%E4%BE%A7%E5%A4%9A%E9%9B%86PV%E7%AA%97%E5%8F%A3%E6%AD%A3%E5%B8%B8%E5%8C%96%E5%A4%A7%E5%B0%8F%28%E5%A4%84%E7%90%86Windows%E7%94%A8%E6%88%B7%E7%AA%97%E5%8F%A3%E9%97%AE%E9%A2%98%29.user.js
// @updateURL https://update.greasyfork.org/scripts/510566/B%E7%AB%99%E5%8F%B3%E4%BE%A7%E5%A4%9A%E9%9B%86PV%E7%AA%97%E5%8F%A3%E6%AD%A3%E5%B8%B8%E5%8C%96%E5%A4%A7%E5%B0%8F%28%E5%A4%84%E7%90%86Windows%E7%94%A8%E6%88%B7%E7%AA%97%E5%8F%A3%E9%97%AE%E9%A2%98%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 创建一个函数，该函数返回一个Promise，该Promise将在DOM元素存在时解决或超时后拒绝
    function waitForElement(selector, timeout = 20000) {
        return new Promise((resolve, reject) => {
            let timer = setTimeout(() => {
                reject(new Error(`Timed out after ${timeout} ms`));
            }, timeout);

            function check() {
                const element = document.querySelector(selector);
                if (element) {
                    clearTimeout(timer);
                    resolve(element);
                } else {
                    setTimeout(check, 1000);
                }
            }

            check();
        });
    }

    Promise.all([
        waitForElement("#playerWrap"),
        waitForElement(".base-video-sections-v1 .video-sections-content-list")
    ]).then(elements => {
        const [leftVideContainer, rightVideLabelList] = elements;

        const resizeObserver = new ResizeObserver(entries => {
            rightVideLabelList.style.maxHeight = (entries[0].contentRect.height- 70) + 'px';
        });

        resizeObserver.observe(leftVideContainer);

        // 初始化高度
        rightVideLabelList.style.height = 'auto'
        rightVideLabelList.style.maxHeight = (leftVideContainer.clientHeight- 70) + 'px';

        // 设置一个定时器来定期重置高度，以防某些情况下高度计算不准确
        const intervalId = setInterval(() => {
            rightVideLabelList.style.height = 'auto'
            rightVideLabelList.style.maxHeight = (leftVideContainer.clientHeight - 70) + 'px';
        }, 3000);
        console.log("asuhdiausghdiuasghdoiu ===============");

        // 20秒后清除定时器
        setTimeout(() => {
            clearInterval(intervalId);
        }, 20000);
    }).catch(error => {
        console.error('waitForElement timed out:', error);
    });
})();