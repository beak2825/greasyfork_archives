// ==UserScript==
// @name         河工程最新教学评估
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  用来自动进行教学评估，需要手动点击提交，如果弹出提醒，关闭即可，每次自动打完分之后，需要再次刷新页面，点击未评价的老师，就可以继续评价。
// @author       Couldlabs
// @match        https://jwglxxfwpt.hebeu.edu.cn/xspjgl/xspj_cxXspjIndex.html?doType=details&gnmkdm=N401605&layout=default
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520684/%E6%B2%B3%E5%B7%A5%E7%A8%8B%E6%9C%80%E6%96%B0%E6%95%99%E5%AD%A6%E8%AF%84%E4%BC%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/520684/%E6%B2%B3%E5%B7%A5%E7%A8%8B%E6%9C%80%E6%96%B0%E6%95%99%E5%AD%A6%E8%AF%84%E4%BC%B0.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 打分和评价的文本
    const score = 99; // 需要的分数
    const comment = "老师讲解清晰，课程内容丰富。"; // 评价内容

    setTimeout(() => {
        // 获取评分输入框
        const scoreInputs = document.querySelectorAll('.form-control.input-sm.input-pjf'); // 根据实际情况修改选择器
        const commentTextArea = document.querySelector('.form-control.input-zgpj'); // 根据实际情况修改选择器
        const submitButton = document.getElementById('btn_xspj_tj'); // 根据实际情况修改 ID

        if (scoreInputs.length) {
            scoreInputs.forEach(input => {
                input.value = ''; // 清空原有内容
                setTimeout(() => {
                    input.value = score; // 输入评分
                    input.dispatchEvent(new Event('input', { bubbles: true })); // 模拟输入事件
                }, Math.random() * 200 + 100);  // 随机延迟
            });
        } else {
            console.log('未找到评分输入框');
        }

        if (commentTextArea) {
            commentTextArea.value = ''; // 清空原有内容
            setTimeout(() => {
                commentTextArea.value = comment; // 输入评论
                commentTextArea.dispatchEvent(new Event('input', { bubbles: true })); // 模拟输入事件
            }, Math.random() * 200 + 100); // 随机延迟
        } else {
            console.log('未找到评论框');
        }

        if (submitButton) {
            setTimeout(() => {
                // 确保所有输入框值有效，延迟以模拟人类行为
                submitButton.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
                submitButton.focus(); // 聚焦提交按钮
                // 模拟鼠标点击
                const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true });
                const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true });
                const clickEvent = new MouseEvent('click', { bubbles: true });

                submitButton.dispatchEvent(mouseDownEvent);
                submitButton.dispatchEvent(mouseUpEvent);
                submitButton.dispatchEvent(clickEvent);
                console.log('已点击提交按钮');
            }, Math.random() * 2000 + 2000); // 在2-4秒内随机延迟
        } else {
            console.log('未找到提交按钮');
        }
    }, 5000); // 初始延迟，等待页面加载完成
})();