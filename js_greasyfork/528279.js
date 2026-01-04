// ==UserScript==
// @name         Alist MPV Play Button
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在 Alist 页面上添加 MPV 播放按钮
// @author       You
// @match        http://192.168.3.35:5244/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528279/Alist%20MPV%20Play%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/528279/Alist%20MPV%20Play%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 计时器时间（单位：毫秒）
    const checkInterval = 1000; // 每秒检查一次
    const timeout = 10000; // 最多检查 10 秒

    // 当前已检查时间
    let checkedTime = 0;

    // 创建一个定时器，每秒检查一次
    const intervalId = setInterval(function() {
        // 获取包含 PotPlayer 链接的 a 元素
        let potplayerLink = document.querySelector('a[href^="potplayer://"]');

        // 如果找到了 PotPlayer 链接
        if (potplayerLink) {
            // 停止定时器
            clearInterval(intervalId);

            // 获取视频 URL，从 href 中提取实际的链接
            let videoUrl = potplayerLink.href.replace('potplayer://', '');

            // 创建 MPV 播放按钮
            let mpvButton = document.createElement('button');
            mpvButton.textContent = '使用 MPV 播放';
            mpvButton.style.position = 'fixed';
            mpvButton.style.bottom = '20px';
            mpvButton.style.right = '20px';
            mpvButton.style.padding = '10px';
            mpvButton.style.fontSize = '16px';
            mpvButton.style.zIndex = '9999';
            mpvButton.style.backgroundColor = '#0b79ff';
            mpvButton.style.color = '#fff';
            mpvButton.style.border = 'none';
            mpvButton.style.borderRadius = '5px';
            mpvButton.style.cursor = 'pointer';

            // 添加按钮到页面
            document.body.appendChild(mpvButton);

            // 按钮点击事件：使用 mpv 播放视频
            mpvButton.addEventListener('click', function() {
                // 构造 mpv URL
                let mpvUrl = `mpv://${videoUrl}`;

                // 打印调试信息
                console.log(`MPV 播放 URL: ${mpvUrl}`);

                // 使用 window.location.href 触发 MPV 播放
                window.location.href = mpvUrl;
            });

            console.log('MPV 播放按钮已添加');
        }

        // 如果超过最大等待时间，停止检查
        if (checkedTime >= timeout) {
            clearInterval(intervalId);
            console.log('未找到 PotPlayer 链接，超时结束检查');
        }

        // 更新已检查时间
        checkedTime += checkInterval;

    }, checkInterval);
})();
