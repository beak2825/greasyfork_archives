// ==UserScript==
// @name         自动获取起点经验
// @namespace    http://tampermonkey.net/
// @version      2.1.1
// @description  自动获取起点经验脚本
// @author       nuxue
// @match        https://my.qidian.com/level
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510033/%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%8F%96%E8%B5%B7%E7%82%B9%E7%BB%8F%E9%AA%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/510033/%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%8F%96%E8%B5%B7%E7%82%B9%E7%BB%8F%E9%AA%8C.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 获得指定的标签,经验值list
    const list = document.querySelector('#elTaskWrap');
    // 获得指定的子标签的数量
    const count = list.children.length;
    // 遍历子标签
    for (let i = 1; i <= count; i++) {
        // 获得指定的任务子标签
        const item = list.querySelector('li:nth-child(' + i + ')');

        // 获得不同状态
        const waitGet = item.querySelector('a');
        const doneTask = item.querySelector('span.award-task-status');

        // 输出不同状态
        console.log(i + "  waitGet:" + waitGet + "  doneTask:" + doneTask)

        // 判断 waitGet不为 null
        if (waitGet === null) {
            // 领取的状态
            if (doneTask !== null) {
                if (doneTask.textContent === '已领取') {
                    // 跳过
                    continue;
                }
            }
        } else {
            // 等待状态
            if (waitGet.textContent === '领取') {
                //触发领取
                setTimeout(function () {
                    item.querySelector('a').click();
                    }, 2000);
            } else {
                // 等待
                countdown(item);
            }
        }
    }

    //创建一个定时函数.先延时,再刷新页面
    function countdown(item) {
        // 获得指定的子任务子标签的时间
        let minis = item.querySelector('a');
        if (minis === null) {
            minis = item.querySelector('span.award-task-strong');
        }
        // 转化为数字,并加1
        var time = parseInt(minis.textContent) + 1;
        // 提示倒计时执行提示
        const subtitleElement = document.querySelector('.exp-subtitle h3');
        subtitleElement.textContent = "在线经验值奖励,倒计时时间:" + time + "分钟";

        // 倒计时 time 分钟,刷新页面
        setTimeout(function () {
            location.reload();
        }, time * 60 * 1000);
    }
})();