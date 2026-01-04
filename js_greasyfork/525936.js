// ==UserScript==
// @name         教师研修网smartedu.cn自动点击确定
// @namespace    http://tampermonkey.net/
// @version      2025-02-05.02
// @description  2025暑期教师研修自动答题点击确定（下一个），自动设置2倍速
// @author       Hiro_Wang
// @match        *.smartedu.cn/p/course/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=smartedu.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525936/%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E7%BD%91smarteducn%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%A1%AE%E5%AE%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/525936/%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E7%BD%91smarteducn%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%A1%AE%E5%AE%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 定时检查并点击 "确定" 按钮
    setInterval(function() {
        if ($('.layui-layer-btn0').length > 0) {
            $('.layui-layer-btn0').click();
            console.log('发现并点击确定按钮');
        }
    }, 3000);
    // 定时检查播放速率，并调整为 2x
    setInterval(function() {
        // 获取 xg-playbackrate 元素
        const playbackRateElement = document.querySelector('xg-playbackrate');
        if (playbackRateElement) {
            // 获取 <p> 标签的内容
            const playbackRateText = playbackRateElement.querySelector('p.name')?.innerText;
            // 如果 <p> 标签内容是 "1x"，则点击第一个 <li> 标签 (2x)
            if (playbackRateText === '1x') {
                const firstLi = playbackRateElement.querySelector('ul li');
                if (firstLi) {
                    firstLi.click();
                    console.log('检测到播放速率为 1x，已切换为 2x');
                }
            }
        }
    }, 10000); // 每10秒检查一次
})();