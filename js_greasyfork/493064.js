// ==UserScript==
// @name         网站自动刷新
// @namespace    https://github.com/webguosai
// @version      0.9
// @icon         https://avatars.githubusercontent.com/u/2083784?v=4
// @description  当前网页如果未打开，则一直监听，直到网站能够直接打开，即不再刷新
// @author       Guo Sai
// @match        http://127.0.0.1:9501/*
// @run-at       document-start
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/493064/%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/493064/%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let maxAttempts = 300000; // 最大重试次数
    let currentAttempt = 0; // 当前重试次数

    function refreshIfUnreachable() {
        // console.log('开始执行.');
        currentAttempt++;

        fetch(window.location.href, { method: 'HEAD' })
            .then(response => {
                if (!response.ok) {
                    // console.log(`网站打不开 (${currentAttempt}/${maxAttempts}), refreshing...`);
                    location.reload(true);
                } else {
                    // console.log('停止定时器.');
                    clearInterval(intervalId); // 停止定时器
                }
            })
            .catch(error => {
                // console.error('An error occurred while checking website accessibility:', error);

                if (currentAttempt >= maxAttempts) {
                    // console.log('达到最大重试次数，停止刷新.');
                    clearInterval(intervalId); // 停止定时器
                }
            });
    }

    // 初始化执行，每隔一定时间检查网站的可访问性
    let intervalId = setInterval(refreshIfUnreachable, 300); // 每隔 x 毫秒执行一次检查
})();
