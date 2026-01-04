// ==UserScript==
// @name         查水电费自动选择
// @namespace    http://tampermonkey.net/
// @version      2024-07-10
// @description  ...
// @author       You
// @match        http://172.16.3.132:8686/login
// @icon         https://www.google.com/s2/favicons?sz=64&domain=3.132
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505129/%E6%9F%A5%E6%B0%B4%E7%94%B5%E8%B4%B9%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/505129/%E6%9F%A5%E6%B0%B4%E7%94%B5%E8%B4%B9%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 等待元素加载的函数
    function waitForElement(selector) {
        return new Promise(resolve => {
            const interval = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(interval);
                    resolve(element);
                }
            }, 100);
        });
    }

    // 模拟点击函数
    function simulateClick(element) {
        return new Promise(resolve => {
            const event = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
            });
            element.dispatchEvent(event);
            setTimeout(resolve, 100); // 等待下拉选项更新
        });
    }

    // 选择选项的函数
    async function selectOption(selectId, value) {
        const select = await waitForElement(selectId);
        const input = select.nextElementSibling.querySelector('.layui-select-title input');
        await simulateClick(input);
        const option = select.nextElementSibling.querySelector(`dd[lay-value="${value}"]`);
        await simulateClick(option);
    }

    // 主函数
    async function autoSelect() {
        await selectOption('#Select_Xiaoqu', '15');
        await selectOption('#Select_Building', '24');
        await selectOption('#Select_Floor', '2402');
        await selectOption('#Select_Room', '4654');
    }
    // 等待登录按钮并添加自动选择按钮
    (async function() {
        const loginButton = await waitForElement('button[lay-filter="login"]');
        const autoSelectButton = document.createElement('button');
        autoSelectButton.textContent = '自动选择';
        autoSelectButton.className = 'layui-btn';
        autoSelectButton.style.margin='10px 0 0 0';
        autoSelectButton.type='button';
        autoSelectButton.onclick = autoSelect;
        loginButton.parentNode.appendChild(autoSelectButton);
        document.querySelector(".loginForm").style.height="auto";
        document.querySelector(".loginForm").style.paddingBottom="10px";
        document.querySelector(".submitDiv").style.height="auto"
    })();
    // Your code here...
})();