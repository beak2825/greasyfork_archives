// ==UserScript==
// @name         HostLoc签到按钮
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a sign-in button to the webpage
// @author       xftaw
// @match        https://hostloc.com/*
// @match        https://*.hostloc.com/*
// @grant        GM_xmlhttpRequest
// @icon https://hostloc.com/uc_server/avatar.php?uid=47519&size=small&ts=1
// @license CC BY 2.0
// @downloadURL https://update.greasyfork.org/scripts/479576/HostLoc%E7%AD%BE%E5%88%B0%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/479576/HostLoc%E7%AD%BE%E5%88%B0%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建签到按钮
    var signInButton = document.createElement('button');
    signInButton.textContent = '簽到';
    signInButton.style.position = 'fixed'; // 或 'relative'，根据需要调整
    signInButton.style.top = '10px';
    signInButton.style.left = '10px';

    // 添加点击事件
    signInButton.addEventListener('click', function() {
        signIn(20);
    });

    // 将按钮添加到页面
    document.body.appendChild(signInButton);

    // 在开始时访问一次 https://hostloc.com/space-uid-47519.html
    signIn(1, 47519);

    // 签到函数
    function signIn(times, specificUid) {
        // 构造访问的 URL
        var url = 'https://hostloc.com/space-uid-' + (specificUid || getRandomUid()) + '.html';

        // 使用 GM_xmlhttpRequest 访问 URL
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                // 在控制台输出请求结果
                console.log('Response:', response.responseText);

                // 剩余次数减一
                times--;

                // 检查是否还需要继续签到
                if (times > 0) {
                    // 延时5秒后再次执行签到
                    setTimeout(function() {
                        signIn(times);
                    }, 5000);
                }
            },
            onerror: function(error) {
                // 在控制台输出错误信息
                console.error('Error:', error);

                // 如果发生错误也减少次数并检查是否需要继续签到
                times--;

                if (times > 0) {
                    setTimeout(function() {
                        signIn(times);
                    }, 1000);
                }
            }
        });
    }

    // 生成一个 1 到 29999 之间的随机数
    function getRandomUid() {
        return Math.floor(Math.random() * 29999) + 1;
    }

})();
