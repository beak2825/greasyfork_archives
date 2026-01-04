// ==UserScript==
// @name         Listen2ashui
// @namespace    http://tampermonkey.net/
// @version      2024-12-11
// @description  我们只是从AI吸取知识的朝圣者，别无他意。
// @author       AlexShui
// @match        https://ai.rcouyi.com/*
// @match        *ashui*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rcouyi.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520443/Listen2ashui.user.js
// @updateURL https://update.greasyfork.org/scripts/520443/Listen2ashui.meta.js
// ==/UserScript==

(function() {
    // 'use strict';
    css_chatbox = "div.overflow-hidden.text-sm.items-start";
    css_textbox = "div.mt-2.flex.flex-col";
    css_loadingButton = "button.__button-dark-f4psvt-dlsmd.n-button.n-button--default-type.n-button--small-type.n-button:not(.n-button--disabled)"//
    var previous_chatboxes = [];

    function get_previous_chatboxes() {
        previous_chatboxes = document.querySelectorAll(css_chatbox);
    }
    async function listenLongestChatboxText() {
        var chatboxTextArray = [];
        let current_chatbox;

        await  new Promise((resolve) => {
            const chatboxLoadingInterval = setInterval(() => {
                const chatboxes = document.querySelectorAll(css_chatbox);
                if (chatboxes.length !== 0) {
                    current_chatbox = chatboxes[chatboxes.length - 1];
                    if (!previous_chatboxes){
                        clearInterval(chatboxLoadingInterval);
                        resolve();}
                    else {
                        if (current_chatbox !== previous_chatboxes[previous_chatboxes.length - 1])
                            {clearInterval(chatboxLoadingInterval);
                            resolve();}
                        }

                }
            },100)
        })

        let elapsedTime = 0;
        const checkInterval = 100;
        const maxWaitTime = 180000;

        // 使用一个 Promise 来处理 setInterval 的结束
        await new Promise((resolve) => {
            const intervalId = setInterval(() => {
                const chatbox_text = current_chatbox.querySelector(css_textbox).textContent.trim();
                chatboxTextArray.push(chatbox_text);

                const loaded_element = document.querySelector(css_loadingButton);
                // console.log("加载按钮状态：", loaded_element);
                if (loaded_element) {
                    clearInterval(intervalId); // 停止定时器
                    resolve(); // 结束 Promise
                } else {
                    elapsedTime += checkInterval;
                    if (elapsedTime >= maxWaitTime) {
                        clearInterval(intervalId); // 停止定时器
                        // console.log("停止等待加载");
                        resolve(); // 结束 Promise
                    }
                }
            }, checkInterval);
        });

        // 计算最长的聊天文本
        const Longest_chatbox_text = chatboxTextArray.reduce((a, b) => a.length >= b.length ? a : b, "").replace("ErrorAI0001", "");
        console.log(`监听到的回复文本为：\n${Longest_chatbox_text}`);

        if (Longest_chatbox_text !== chatboxTextArray[chatboxTextArray.length - 1]) {
            navigator.clipboard.writeText(Longest_chatbox_text).then(() => {
                window.alert("监听到回复文本被撤回，已将最长回复文本复制到剪贴板");
            });
        }
    }
        function addEarButton() {
        const existingButton = document.querySelector('button.__button-dark-f4psvt-dlsmd');

        // 检查是否已经存在具有特定标识的新按钮
        const isButtonAdded = document.querySelector('.custom-ear-button');
        if (isButtonAdded){
            return isButtonAdded;
        }
        else if (!isButtonAdded) {
            // 创建一个新的按钮
            const newButton = document.createElement('button');

            // 获取旧元素的计算样式
            const computedStyle = window.getComputedStyle(existingButton);

            // 为新按钮设置与旧元素相同的样式
            for (let property of computedStyle) {
                newButton.style[property] = computedStyle.getPropertyValue(property);
            }

            // 添加新的唯一类名
            newButton.className = 'custom-ear-button';

            // 设置其他属性
            newButton.setAttribute('tabindex', '0');
            newButton.setAttribute('type', 'button');

            // 创建按钮内容
            const buttonContent = document.createElement('span');
            buttonContent.className = 'n-button__content';
            buttonContent.textContent = '👂'; // 使用耳朵图标
            newButton.appendChild(buttonContent);

            // 复制其他可能的子元素结构
            const baseWave = document.createElement('div');
            baseWave.setAttribute('aria-hidden', 'true');
            baseWave.className = 'n-base-wave';
            newButton.appendChild(baseWave);

            const border = document.createElement('div');
            border.setAttribute('aria-hidden', 'true');
            border.className = 'n-button__border';
            newButton.appendChild(border);

            const stateBorder = document.createElement('div');
            stateBorder.setAttribute('aria-hidden', 'true');
            stateBorder.className = 'n-button__state-border';
            newButton.appendChild(stateBorder);

            // 将新按钮插入到现有按钮的右侧
            existingButton.insertAdjacentElement('afterend', newButton);
            return newButton;
        }
        else {
            return "";
        }
    }

    function waitForElements() {
        const checkInterval = setInterval(() => {
            const existingButton = document.querySelector('button.__button-dark-f4psvt-dlsmd');
            // console.log("检测一次");
            if (existingButton) {
                // console.log("检测到目标按钮");
                clearInterval(checkInterval);
                newButton = addEarButton();
                newButton.addEventListener("click",function(event){
                    existingButton.click();
                    listenLongestChatboxText()});
                newButton.addEventListener("mouseover",function(event){
                    get_previous_chatboxes()
                })
            }
        }, 100); // 每100毫秒检查一次
    }

    function checkAndRun() {
        // const regex = /\/chat\/\d+/;
        // if (regex.test(window.location.pathname)) {
        waitForElements();
        // }
    }

    // 监听URL变化
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            checkAndRun();
        }
    }).observe(document, {subtree: true, childList: true});

    // 页面加载完成后运行
    document.addEventListener('DOMContentLoaded', () => {
        checkAndRun();
    });
})();
