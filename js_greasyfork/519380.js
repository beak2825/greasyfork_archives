// ==UserScript==
// @name         超星学习通-自动点击讨论并自动回复脚本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动点击讨论部分，自动填入其他人回复内容并提交回复内容，提交后自动关闭页面
// @author       河北糖纸大鹏
// @match        *://*.chaoxing.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519380/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A-%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E8%AE%A8%E8%AE%BA%E5%B9%B6%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/519380/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A-%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E8%AE%A8%E8%AE%BA%E5%B9%B6%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义一个函数，用来查找讨论部分并点击
    function clickDiscussion() {
        const topicMainDiv = document.getElementById('topicMainDiv');
        if (topicMainDiv) {
            // 阻止默认跳转行为
            topicMainDiv.addEventListener('click', function(event) {
                event.preventDefault();
                console.log('阻止了页面跳转');
            }, { once: true });  // 使用 { once: true } 确保事件只触发一次

            // 模拟点击，确保触发事件，但不会跳转
            const event = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
            });

            topicMainDiv.dispatchEvent(event);  // 模拟点击
            console.log('已自动点击讨论部分');
        }
    }

    // 等待页面加载完成
    window.onload = function() {
        // 自动点击讨论部分（延迟1秒）
        setTimeout(clickDiscussion, 1000);

        // 查找所有 replyContent 元素
        const replyContents = document.querySelectorAll('.replyContent');
        if (replyContents.length === 0) {
            console.log('未找到 replyContent');
            return;
        }

        // 随机选择一个 replyContent 的内容
        const randomReply = replyContents[Math.floor(Math.random() * replyContents.length)].innerText;

        // 找到目标文本框
        const textarea = document.querySelector('.textareawrap textarea');
        if (textarea) {
            // 将随机回复内容填入文本框
            textarea.value = randomReply;

            // 手动触发输入事件，确保页面响应
            const inputEvent = new Event('input', { bubbles: true });
            textarea.dispatchEvent(inputEvent);

            console.log('已自动填入内容：', randomReply);

            // 检查文本框是否为空
            if (textarea.value.trim() === '') {
                console.log('文本框为空，已中断执行');
                return; // 中断执行
            }

            // 查找并点击提交按钮
            const submitButton = document.querySelector('.jb_btn.addReply');
            if (submitButton) {
                setTimeout(() => {
                    submitButton.click();
                    console.log('已自动提交评论');
                    // 提交后等待0.5秒钟再自动关闭页面
                    setTimeout(() => {
                        window.close();  // 关闭当前页面
                        console.log('已自动关闭页面');
                    }, 500);  // 延迟0.5秒关闭页面
                }, 3000); // 延迟3秒，确保填入完成后再提交
            } else {
                console.log('未找到提交按钮');
            }
        } else {
            console.log('未找到文本框');
        }
    };
})();
