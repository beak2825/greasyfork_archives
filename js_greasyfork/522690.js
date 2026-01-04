// ==UserScript==
// @name         解锁PTA成绩查看限制
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  这个用户脚本旨在帮助用户直接查看PTA（拼题A、Pintia）平台上的隐藏考试成绩。当用户访问考试概览页面时，成绩会悬浮显示在页面的右上角，10秒后自动消失
// @author       MadelineCarter
// @match        https://pintia.cn/problem-sets/*/exam/overview
// @grant        none
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/522690/%E8%A7%A3%E9%94%81PTA%E6%88%90%E7%BB%A9%E6%9F%A5%E7%9C%8B%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/522690/%E8%A7%A3%E9%94%81PTA%E6%88%90%E7%BB%A9%E6%9F%A5%E7%9C%8B%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('PTA成绩悬浮显示脚本已加载');

    window.addEventListener('load', () => {
        console.log('页面加载完成，脚本开始执行');

        // 拦截 XMLHttpRequest 响应，检查目标 API 并提取成绩
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            this._interceptedUrl = url;
            return originalOpen.apply(this, arguments);
        };

        const originalSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function(body) {
            this.addEventListener('load', function() {
                if (this._interceptedUrl.includes('/exams')) {
                    try {
                        const data = JSON.parse(this.responseText);
                        if (data && data.exam && data.exam.score !== undefined) {
                            displayScore(data.exam.score);
                        }
                    } catch (e) {
                        console.error('解析响应失败:', e);
                    }
                }
            });
            return originalSend.apply(this, arguments);
        };

        // 在页面上显示成绩的函数
        function displayScore(score) {
            console.log('显示成绩:', score);

            let scoreElement = document.getElementById('pta-score-display');
            if (!scoreElement) {
                scoreElement = document.createElement('div');
                scoreElement.id = 'pta-score-display';
                scoreElement.style.position = 'fixed';
                scoreElement.style.top = '10px';
                scoreElement.style.right = '10px';
                scoreElement.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                scoreElement.style.color = 'white';
                scoreElement.style.padding = '10px';
                scoreElement.style.borderRadius = '5px';
                scoreElement.style.zIndex = '9999';
                scoreElement.style.fontSize = '14px';
                scoreElement.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
                scoreElement.style.transition = 'opacity 0.5s ease-in-out';
                document.body.appendChild(scoreElement);
            }

            scoreElement.textContent = `成绩: ${score}`;
            scoreElement.style.opacity = '1';

            // 设置几秒后自动消失
            setTimeout(() => {
                scoreElement.style.opacity = '0';
                setTimeout(() => {
                    scoreElement.remove();
                }, 500); // 等待动画结束后移除元素
            }, 10000); // 10秒后开始隐藏
        }
    });
})();

/*
    This script is not licensed for use, modification, or distribution.
    All rights are reserved by the author.
*/