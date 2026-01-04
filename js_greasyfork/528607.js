// ==UserScript==
// @name         屏蔽 Bilibili 评论区 (延迟注入版本)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  屏蔽 Bilibili 视频页和稍后观看页的评论区 (延迟注入版本)
// @author       PieJEed
// @match        *://www.bilibili.com/video/*
// @match        *://www.bilibili.com/list/watchlater*
// @compatible         chrome
// @compatible         firefox
// @compatible         edge
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528607/%E5%B1%8F%E8%94%BD%20Bilibili%20%E8%AF%84%E8%AE%BA%E5%8C%BA%20%28%E5%BB%B6%E8%BF%9F%E6%B3%A8%E5%85%A5%E7%89%88%E6%9C%AC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/528607/%E5%B1%8F%E8%94%BD%20Bilibili%20%E8%AF%84%E8%AE%BA%E5%8C%BA%20%28%E5%BB%B6%E8%BF%9F%E6%B3%A8%E5%85%A5%E7%89%88%E6%9C%AC%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('脚本开始运行 - 屏蔽评论区 (延迟注入版本)');

    // 延迟时间（毫秒），可根据需要调整（例如：1000ms = 1秒）
    const delayTime = 1500;

    // 延迟执行移除操作
    setTimeout(() => {
        console.log(`延迟 ${delayTime}ms 后执行评论区移除...`);
        const targetSelector = '#commentapp';
        const targetElement = document.querySelector(targetSelector);

        if (targetElement) {
            targetElement.remove();
            console.log('评论区已成功屏蔽 (延迟注入)！');
        } else {
            console.warn('延迟注入后也无法找到评论区容器。');
        }
        console.log('脚本运行结束 - 屏蔽评论区 (延迟注入版本)');
    }, delayTime); // delayTime 毫秒后执行匿名函数

})();
