// ==UserScript==
// @name         Kimi快捷键助手
// @namespace    https://kimi.moonshot.cn/
// @version      1.0.4
// @description  Kimi快捷键助手,提供快捷键操作
// @author       Chsengni
// @match        http*://kimi.moonshot.cn
// @match        http*://kimi.moonshot.cn/*
// @match        http*://kimi.moonshot.cn/chat/*
// @icon         https://statics.moonshot.cn/kimi-chat/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506343/Kimi%E5%BF%AB%E6%8D%B7%E9%94%AE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/506343/Kimi%E5%BF%AB%E6%8D%B7%E9%94%AE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function() {
    'use strict';

    let intervalId;  // 定义全局变量用于存储定时器ID

    // 点击历史记录列表
    const triggerHistoryList = () => {
        const targetElement = document.querySelector("#root > div > div.mainContent___vvQdb > div:nth-child(1) > div > div.layoutNavMove___j5ets > div > div:nth-child(4) > div > span");
        targetElement.click();
    };

    const triggerCreate = () => {
        const targetElement = document.querySelector("#root > div > div.mainContent___vvQdb > div:nth-child(1) > div > div.layoutNavMove___j5ets > div > div:nth-child(3) > div > span");
        targetElement.click();
    };

    const waitForDialogAndClickButton = () => new Promise((resolve, reject) => {
        const observer = new MutationObserver(() => {
            const dialogButtons = document.querySelectorAll("div.MuiDialogActions-root.MuiDialogActions-spacing.css-9snv5b button");
            if (dialogButtons.length >= 2) {
                dialogButtons[1].click();
                observer.disconnect();
                resolve();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    });

    const triggerDelHistory = () => {
        for (const targetElement of document.querySelectorAll(".actionBtn___OpJST.delBtn___fCUyT")) {
            targetElement.click();
            waitForDialogAndClickButton();
        }
    }

    const startPeriodicCheck = () => {
        intervalId = setInterval(() => {  
            if (document.querySelectorAll(".actionBtn___OpJST.delBtn___fCUyT").length > 0) {
                triggerDelHistory();
            }else{
               stopPeriodicCheck();
            }
        }, 1000); // 每1秒重新执行一次删除操作
    }

    const stopPeriodicCheck = () => {
        clearInterval(intervalId); // 终止定时器
    }

    // 监听快捷键
    document.addEventListener('keydown', event => {
        if (event.ctrlKey && event.key === 'f') {
            event.preventDefault();
            triggerHistoryList();
        } else if (event.ctrlKey && event.key === 'c') {
            event.preventDefault();
            triggerCreate();
        } else if (event.ctrlKey && event.key === 'd') {
            event.preventDefault();
            startPeriodicCheck();
            triggerDelHistory();
        } 
    });

})();
