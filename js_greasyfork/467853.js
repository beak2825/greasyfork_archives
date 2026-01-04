// ==UserScript==
// @name         微信读书阅读时长挂机
// @namespace    https://imkero.net/
// @version      1.0
// @description  进入读书页面后通过鼠标右键菜单开启/停止挂机。挂机操作：（1）自动向下滚动；（2）滚动到底时自动翻下一页/下一章。
// @author       电脑星人
// @license      MIT
// @match        https://weread.qq.com/web/reader/*
// @icon         https://rescdn.qqmail.com/node/wr/wrpage/style/images/independent/appleTouchIcon/apple-touch-icon-144x144.png
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/467853/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E9%98%85%E8%AF%BB%E6%97%B6%E9%95%BF%E6%8C%82%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/467853/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E9%98%85%E8%AF%BB%E6%97%B6%E9%95%BF%E6%8C%82%E6%9C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 一次向下滚动的距离
    const SCROLL_Y_DELTA = 100;
    // 翻下一页/下一章后的等待时长
    const NEXT_CHAPTER_DELAY = 10000;
    // 滚动操作最小间隔
    const SCROLL_INTERVAL_MIN = 1000;
    // 滚动操作最大间隔
    const SCROLL_INTERVAL_MAX = 6000;

    const delay = (ms) => new Promise((resolve) => {
        setTimeout(resolve, ms);
    });

    // 判断是否滚动到底
    const isPageScrolledToBottom = () => {
        const documentHeight = Math.max(
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight,
            document.documentElement.clientHeight
        );

        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        const scrollDistanceToBottom = documentHeight - (scrollPosition + window.innerHeight);
        const threshold = 50;

        return scrollDistanceToBottom <= threshold;
    };

    // 切换章节（模拟键盘右方向键）
    const nextPage = () => {
        const event = new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            key: 'ArrowRight',
            code: 'ArrowRight',
            keyCode: 39,
            charCode: 0
        });

        document.dispatchEvent(event);
    };

    const main = async (task) => {
        while (task.running) {
            if (task.endTime && Date.now() >= task.endTime) {
                task.running = false;
                break;
            }

            window.scrollBy(0, SCROLL_Y_DELTA);

            if (isPageScrolledToBottom()) {
                nextPage();
                await delay(NEXT_CHAPTER_DELAY);
            } else {
                await delay(SCROLL_INTERVAL_MIN + Math.floor((SCROLL_INTERVAL_MAX - SCROLL_INTERVAL_MIN) * Math.random()));
            }
        }
    };

    const start = (options) => {
        const task = {
            ...options,
            running: true,
            stop() {
                this.running = false;
            },
        };

        main(task);

        return task;
    };

    let runningTask = null;

    // 添加右键菜单项
    GM_registerMenuCommand("开始挂机", () => {
        if (runningTask) {
            runningTask.stop();
        }

        runningTask = start();
    });

    GM_registerMenuCommand("停止挂机", () => {
        if (runningTask) {
            runningTask.stop();
        }
    });

    GM_registerMenuCommand("开始挂机（1小时）", () => {
        if (runningTask) {
            runningTask.stop();
        }

        runningTask = start({
            endTime: Date.now() + 1 * 60 * 60 * 1000,
        });
    });

    GM_registerMenuCommand("开始挂机（指定时长）", () => {
        const minuteStr = prompt("输入挂机时长（分钟）", "60");
        if (typeof minuteStr === 'string') {
            if (!/\d+/.test(minuteStr)) {
                alert('挂机时长输入有误，请输入数字表示的分钟数（如：60）');
                return;
            }
            const minutes = parseInt(minuteStr);
            if (runningTask) {
                runningTask.stop();
            }

            runningTask = start({
                endTime: Date.now() + minutes * 60 * 1000,
            });
        }
    });

    // 解除右键菜单限制
    document.documentElement.addEventListener('contextmenu', (e) => {
       e.stopPropagation();
    });

    // 页面固定为可见状态
    Object.defineProperty(document, 'visibilityState', {value: 'visible', writable: true});
    Object.defineProperty(document, 'hidden', {value: false, writable: true});
})();