// ==UserScript==
// @name         抖音限制播放
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  抖音防沉迷，提醒观看时长，专注学习。
// @author       靖哥哥
// @match        *://www.douyin.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501901/%E6%8A%96%E9%9F%B3%E9%99%90%E5%88%B6%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/501901/%E6%8A%96%E9%9F%B3%E9%99%90%E5%88%B6%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建样式
    function addStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            #reminderPopup {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                padding: 20px;
                background-color: rgba(255, 255, 255, 0.95);
                border: 2px solid #000;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                z-index: 10000;
                text-align: center;
                font-family: Arial, sans-serif;
                width: 400px;
                height: 250px;
            }
            #reminderPopup p {
                font-size: 18px;
                margin-bottom: 20px;
            }
            #reminderPopup button {
                padding: 10px 20px;
                margin: 5px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
            }
            #closeBtn {
                background-color: #ff4d4d;
                color: white;
            }
            #watch10MinBtn {
                background-color: #ffcc00;
                color: black;
            }
            #restTodayBtn {
                background-color: #4caf50;
                color: white;
            }
            #countdownPopup {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                padding: 20px;
                background-color: rgba(255, 255, 255, 0.95);
                border: 2px solid #000;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                z-index: 10001;
                text-align: center;
                font-family: Arial, sans-serif;
                width: 300px;
                height: 150px;
            }
            #countdownPopup p {
                font-size: 18px;
                margin-bottom: 20px;
            }
            #countdownTimer {
                font-size: 32px;
                font-weight: bold;
                color: red;
            }
        `;
        document.head.appendChild(style);
    }

    // 隐藏并静音视频
    function pauseVideos() {
        console.log('Pausing videos...');
        const videos = document.querySelectorAll('video');
        if (videos.length === 0) {
            console.log('No video elements found.');
            return;
        }
        videos.forEach(video => {
            video.style.display = 'none'; // 隐藏视频
            video.muted = true; // 静音
            video.pause(); // 暂停播放
            console.log('Paused video:', video);
        });
    }

    // 恢复视频
    function restoreVideos() {
        console.log('Restoring videos...');
        const videos = document.querySelectorAll('video');
        if (videos.length === 0) {
            console.log('No video elements found to restore.');
            return;
        }
        videos.forEach(video => {
            video.style.display = ''; // 恢复显示
            video.muted = false; // 取消静音
            video.play().then(() => {
                console.log('Video resumed:', video);
            }).catch(err => {
                console.log('Error resuming video:', err);
            });
        });
    }

    // 创建倒计时弹窗
    function createCountdownPopup() {
        let countdownPopup = document.createElement('div');
        countdownPopup.id = 'countdownPopup';
        countdownPopup.innerHTML = `
            <p>十分钟已到，即将关闭网页</p>
            <p id="countdownTimer">10</p>
        `;
        document.body.appendChild(countdownPopup);

        // 倒计时10秒
        let countdown = 10;
        const timerElement = document.getElementById('countdownTimer');
        const countdownInterval = setInterval(() => {
            countdown--;
            timerElement.textContent = countdown;
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                window.close(); // 关闭网页
            }
        }, 1000);
    }

    // 创建弹窗
    function createPopup() {
        let popup = document.createElement('div');
        popup.id = 'reminderPopup';
        popup.innerHTML = `
            <p>不要打开抖音去学习</p>
            <p id="countdown">5</p>
            <button id="closeBtn">关闭</button>
            <button id="watch10MinBtn">十分钟</button>
            <button id="restTodayBtn">假期</button>
        `;
        document.body.appendChild(popup);

        // 5秒倒计时
        let countdown = 5;
        const countdownElement = document.getElementById('countdown');
        const countdownInterval = setInterval(() => {
            countdown--;
            countdownElement.textContent = countdown;
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                document.getElementById('closeBtn').click(); // 自动点击关闭按钮
            }
        }, 1000);

        // 关闭按钮
        document.getElementById('closeBtn').onclick = function() {
            window.close();
        };

        // 十分钟按钮
        document.getElementById('watch10MinBtn').onclick = function() {
            document.body.removeChild(popup);
            restoreVideos();

            // 设置10分钟后创建一个10秒倒计时的弹窗
            setTimeout(createCountdownPopup, 10 * 60 * 1000 - 10 * 1000);//在此可以更改时长，前面是观看时长，后面是倒计时。
        };

        // 休息按钮
        document.getElementById('restTodayBtn').onclick = function() {
            document.body.removeChild(popup);
            restoreVideos();
        };
    }

    // 确保 DOM 完全加载后添加样式并显示弹窗
    window.addEventListener('load', () => {
        addStyles();
        createPopup();
    });

    // 尝试再次隐藏视频
    setTimeout(pauseVideos, 1000);

})();
