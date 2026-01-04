// ==UserScript==
// @name         采蘑菇自动回复
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically reply with random Chinese characters on Caimogu post page
// @author       Grok
// @match        https://www.caimogu.cc/post/1805178.html
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534874/%E9%87%87%E8%98%91%E8%8F%87%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/534874/%E9%87%87%E8%98%91%E8%8F%87%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查是否在目标页面
    if (window.location.href !== 'https://www.caimogu.cc/post/1805178.html') return;

    // 获取上次执行时间
    const lastRun = localStorage.getItem('caimoguLastRun');
    const now = Date.now();
    const Hours = 0.5 * 60 * 60 * 1000; // 2小时的毫秒数

    // 如果距离上次执行不到2小时，退出
    if (lastRun && (now - lastRun < Hours)) return;

    // 随机汉字生成函数
    function getRandomChinese(length) {
        let result = '';
        for (let i = 0; i < length; i++) {
            // 生成随机汉字（常用汉字Unicode范围：4E00-9FFF）
            result += String.fromCharCode(Math.floor(Math.random() * (0x9FFF - 0x4E00 + 1)) + 0x4E00);
        }
        return result;
    }

    // 执行回复流程
    async function performReply() {
        for (let i = 0; i < 3; i++) {
            try {
                // 第一步：点击回复按钮
                const replyButton = document.querySelector('.item:nth-child(7) .action:nth-child(3) .reply');
                if (!replyButton) throw new Error('Reply button not found');
                replyButton.click();

                // 等待输入框出现
                await new Promise(resolve => setTimeout(resolve, 500));

                // 第二步：点击输入框
                const input = document.querySelector('.info > .input');
                if (!input) throw new Error('Input field not found');
                input.click();

                // 输入随机5个汉字
                input.value = getRandomChinese(5);

                // 第三步：点击提交按钮
                const submitButton = document.querySelector('button.btn-reply');
                if (!submitButton) throw new Error('Submit button not found');
                submitButton.click();

                // 延迟1秒
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error('Error during reply process:', error);
                return;
            }
        }

        // 记录本次执行时间
        localStorage.setItem('caimoguLastRun', now);
    }

    // 页面加载完成后执行
    window.addEventListener('load', () => {
        setTimeout(performReply, 1000); // 延迟1秒确保页面元素加载
    });
})();