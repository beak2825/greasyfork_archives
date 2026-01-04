// ==UserScript==
// @name         leetcode自动计时
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  try to take over the world!
// @author       You
// @match        *://leetcode.cn/problems/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504797/leetcode%E8%87%AA%E5%8A%A8%E8%AE%A1%E6%97%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/504797/leetcode%E8%87%AA%E5%8A%A8%E8%AE%A1%E6%97%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    console.log("Waiting for .fa-arrows-rotate or .fa-alarm-clock to appear...");
    restartTimer();

    function clickElementWithRetry(selector) {
        const element = document.querySelector(selector);
        if (element){
            console.log(`点击 ${selector}`);
            element.parentNode.click();
            return new Promise( (resolve, reject) => {
                resolve();
            });
        }
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log(`开始执行：选择器为 ${selector}`);
                let retryCount = 0;
                let intervalId = setInterval(function() {
                    retryCount++;

                    // 在这里执行需要重试的操作
                    const element = document.querySelector(selector);
                    console.log(`重试第 ${retryCount} 次，选择器为 ${selector}`);

                    // 如果查询到非空元素或者重试次数达到50次，则停止重试
                    if (element || retryCount >= 50) {
                        clearInterval(intervalId);
                        if (element) {
                            console.log(`点击 ${selector}，退出循环`);
                            element.parentNode.click();
                        } else {
                            console.log("重试结束，未找到元素或达到最大重试次数。");
                        }
                    }
                }, 200);

                resolve();
            }, 2000);
        });

    }

    function restartTimer(){
        clickElementWithRetry('.fa-alarm-clock');
        clickElementWithRetry('.fa-arrows-rotate').then(() => {
            clickElementWithRetry('.fa-circle-play');
        });
    }

    // "Ctrl + ;" 重新计时
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === ';') {
            restartTimer();

            const messageElement = document.createElement('div');
            messageElement.textContent = '重新计时！';
            messageElement.style.position = 'fixed';
            messageElement.style.top = '50%';
            messageElement.style.left = '50%';
            messageElement.style.transform = 'translate(-50%, -50%)';
            messageElement.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            messageElement.style.color = 'white';
            messageElement.style.padding = '10px';
            messageElement.style.borderRadius = '5px';
            messageElement.style.transition = 'opacity 0.5s';

            // 插入到页面中
            document.body.appendChild(messageElement);

            // 逐渐淡化并在 200ms 后消失
            setTimeout(() => {
                messageElement.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(messageElement);
                }, 500); // 500ms 后移除元素
            }, 200); // 200ms 后开始淡化

        }
    });

})();