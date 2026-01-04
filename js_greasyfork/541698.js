// ==UserScript==
// @name         移除知乎登录弹窗
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  自动点击知乎网页上的关闭按钮并移除登录提示框
// @author       0liuuil0
// @match        https://www.zhihu.com/*
// @match        https://zhuanlan.zhihu.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541698/%E7%A7%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/541698/%E7%A7%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义一个函数来查找并点击第一个关闭按钮
    function clickFirstCloseButton(callback) {
        const closeButton = document.querySelector('button[aria-label="关闭"]');
        if (closeButton) {
            closeButton.click();
            console.log("第一个关闭按钮已点击");
            callback(); // 调用回调函数继续处理滚动和移除登录提示框
        } else {
            console.log("未找到第一个关闭按钮，继续查找...");
            setTimeout(() => clickFirstCloseButton(callback), 1000); // 每隔1秒重试
        }
    }

    // 定义一个函数来滚动页面
    function scrollPage(callback) {
        window.scrollTo(0, document.body.scrollHeight);
        console.log("页面已滚动到底部");
        callback(); // 调用回调函数继续处理移除登录提示框
    }

    // 定义一个函数来查找并移除登录提示框
    function removeLoginPrompt() {
        const loginPrompt = document.querySelector('div.css-woosw9');
        if (loginPrompt) {
            loginPrompt.remove();
            console.log("登录提示框已移除");
        } else {
            console.log("未找到登录提示框，继续查找...");
            setTimeout(removeLoginPrompt, 10); // 每隔XXX秒重试
        }
    }


    // 定义一个函数来执行所有操作
    function performAllActions() {
        clickFirstCloseButton(() => {
            scrollPage(removeLoginPrompt);
        });
    }

    // 监听DOM变化，以便在页面加载后或动态内容加载后执行操作
    const observer = new MutationObserver(performAllActions);
    observer.observe(document.body, { childList: true, subtree: true });

    // 初始检查一次
    performAllActions();

    // 确保在初始加载时也进行一次检查
    window.addEventListener('load', () => {
        performAllActions();
    });
})();



