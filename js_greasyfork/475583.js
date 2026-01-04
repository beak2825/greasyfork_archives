// ==UserScript==
// @name         hw自动点击链接
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在指定页面定时点击指定的链接
// @author       chatgpt
// @match        https://www.vmall.com/product/*
// @require      http://code.jquery.com/jquery-2.2.4.min.js
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475583/hw%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/475583/hw%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 设置定时器
    let intervalId = null;

    function startInterval() {
        const datetime = new Date();
        const time = datetime.toLocaleTimeString();
        console.log("datetime:", datetime.toLocaleString(), "time:", time);

        if ((time >= "10:07:50" && time <= "10:10:00") || (time >= "18:07:50" && time <= "18:10:00")) {
            console.log("在抢购时间范围内");
            intervalId = setInterval(clickLink, 200);
        } else {
            console.log("不在抢购时间范围内，等待下一次抢购时间");
            let startTime;
            if (time < "10:07:50") {
                startTime = new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate(), 10, 7, 50);
            } else if (time >= "10:10:00" && time < "18:07:50") {
                startTime = new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate(), 18, 7, 50);
            } else {
                startTime = new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate() + 1, 10, 7, 50);
            }
            const timeDiff = startTime.getTime() - datetime.getTime();
            console.log("等待时间:", formatTime(timeDiff / 1000));
            setTimeout(startInterval, timeDiff);
            clearInterval(intervalId);
        }
    }

    function clickLink() {
        const buyBtn = document.querySelectorAll('#pro-operation span')[0];
        console.log("buyBtn:", buyBtn);
        if (buyBtn.onclick != null) {
            console.log("点击购买按钮");
            buyBtn.click();
            clearInterval(intervalId);
        }
    }

    function refreshSession() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', location.href, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    console.log('刷新 session 有效期成功');
                } else {
                    console.log('刷新 session 有效期失败');
                }
            }
        };
        xhr.send();
    }

    function formatTime(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return `${h}小时${m}分钟${s}秒`;
    }

    startInterval();
    // 刷新 session 有效期
    setInterval(refreshSession,1000*60*60);


})();
