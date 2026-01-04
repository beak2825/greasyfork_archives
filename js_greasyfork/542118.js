// ==UserScript==
// @name         APEX b站直播 清除马赛克
// @namespace    http://tampermonkey.net/
// @version      2025-07-09
// @description  清除b站 apex直播的遮挡马赛克
// @author       You
// @match        *://live.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/542118/APEX%20b%E7%AB%99%E7%9B%B4%E6%92%AD%20%E6%B8%85%E9%99%A4%E9%A9%AC%E8%B5%9B%E5%85%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/542118/APEX%20b%E7%AB%99%E7%9B%B4%E6%92%AD%20%E6%B8%85%E9%99%A4%E9%A9%AC%E8%B5%9B%E5%85%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let checkCount = 0;
    const maxChecks = 20;
    const intervalTime = 500;
    function init() {
        // 获取元素
        const intervalId = setInterval(function() {
            const element = document.getElementById('web-player-module-area-mask-panel');

            if (element) {
               // 修改样式会被检测到
               // element.style.display = 'none';
                element.remove();
                clearInterval(intervalId); // 找到元素后停止检查
                console.log('元素已隐藏');
            } else {
                checkCount++;
                if (checkCount >= maxChecks) {
                    clearInterval(intervalId); // 超过最大检查次数后停止
                    console.log('检查超时，未找到元素');
                }
            }
        }, intervalTime);
    }

    // 延迟初始化以确保页面加载完成
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();