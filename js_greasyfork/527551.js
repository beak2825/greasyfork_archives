// ==UserScript==
// @name         自动点击手机登录、输入手机号并获取验证码改
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  自动点击手机登录按钮、输入手机号并点击获取验证码
// @author       YourName
// @match        https://sm.hpv.pub:99/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hpv.pub
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527551/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E6%89%8B%E6%9C%BA%E7%99%BB%E5%BD%95%E3%80%81%E8%BE%93%E5%85%A5%E6%89%8B%E6%9C%BA%E5%8F%B7%E5%B9%B6%E8%8E%B7%E5%8F%96%E9%AA%8C%E8%AF%81%E7%A0%81%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/527551/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E6%89%8B%E6%9C%BA%E7%99%BB%E5%BD%95%E3%80%81%E8%BE%93%E5%85%A5%E6%89%8B%E6%9C%BA%E5%8F%B7%E5%B9%B6%E8%8E%B7%E5%8F%96%E9%AA%8C%E8%AF%81%E7%A0%81%E6%94%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const config = {
        // 最多尝试次数
        maxRetry: 50,
        // 尝试间隔（毫秒）
        retryInterval: 500,
        // 手机号
        phoneNumber: '18577025857'
    };

    // 任务完成标志
    let isTaskCompleted = false;

    /**
     * 调试函数：高亮元素
     * @param {HTMLElement} element - 需要高亮的元素
     */
    function highlightElement(element) {
        if (element) {
            element.style.border = '2px solid red';
            element.style.backgroundColor = 'yellow';
            console.log('高亮元素：', element);
        }
    }

    /**
     * 通用函数：根据文本内容查找按钮
     * @param {string} text - 按钮内的文本内容
     * @returns {HTMLElement|null} - 找到的按钮元素，如果未找到则返回 null
     */
    function findButtonByText(text) {
        const buttons = Array.from(document.querySelectorAll('button.el-button'));
        const btn = buttons.find(btn => {
            const span = btn.querySelector('span');
            return span && span.textContent?.trim() === text;
        });

        if (btn) {
            console.log(`找到 ${text} 按钮：`, btn);
            highlightElement(btn); // 调试用，高亮按钮
            return btn;
        }

        console.warn(`未找到 ${text} 按钮`);
        return null;
    }

    /**
     * 查找手机号输入框
     * @returns {HTMLElement|null} - 找到的手机号输入框元素，如果未找到则返回 null
     */
    function findPhoneInput() {
        const input = document.querySelector('input.el-input__inner[type="text"][placeholder="手机号码"]');
        if (input) {
            console.log('找到手机号输入框：', input);
            highlightElement(input); // 调试用，高亮输入框
            return input;
        }

        console.warn('未找到手机号输入框');
        return null;
    }

    /**
     * 输入手机号到输入框
     */
    function inputPhoneNumber() {
        const input = findPhoneInput();
        if (input) {
            try {
                console.log('正在输入手机号：', config.phoneNumber);
                input.value = config.phoneNumber;

                // 触发输入事件（确保页面检测到输入）
                const event = new Event('input', { bubbles: true });
                input.dispatchEvent(event);

                console.log('手机号输入完成');
            } catch (error) {
                console.error('输入手机号时发生错误：', error);
            }
        }
    }

    /**
     * 点击指定按钮
     * @param {HTMLElement} button - 要点击的按钮元素
     * @param {string} buttonText - 按钮的文本描述，用于日志输出
     */
    function clickButton(button, buttonText) {
        if (button) {
            try {
                console.log(`正在点击 ${buttonText} 按钮...`);
                button.click();
                console.log(`点击 ${buttonText} 完成`);
            } catch (error) {
                console.error(`点击 ${buttonText} 按钮时发生错误：`, error);
            }
        }
    }

    /**
     * 点击手机登陆按钮并进行后续操作
     * @param {number} retryCount - 当前重试次数，默认为 0
     */
    function clickLoginButton(retryCount = 0) {
        if (isTaskCompleted) {
            console.log('任务已完成，停止重试');
            return;
        }

        const loginButton = findButtonByText('短信登录');

        if (loginButton) {
            clickButton(loginButton, '短信登录');

            // 跳转后等待页面加载，然后输入手机号并点击获取验证码
            setTimeout(() => {
                inputPhoneNumber();
                setTimeout(() => {
                    const verifyCodeButton = findButtonByText('获取验证码');
                    clickButton(verifyCodeButton, '获取验证码');

                    // 标记任务完成
                    isTaskCompleted = true;
                }, 1000); // 延迟 1 秒点击获取验证码
            }, 2000); // 延迟 2 秒，确保页面跳转完成
        } else if (retryCount < config.maxRetry) {
            console.log(`未找到按钮或按钮不可点击，正在重试 (${retryCount + 1}/${config.maxRetry})...`);
            setTimeout(() => clickLoginButton(retryCount + 1), config.retryInterval);
        } else {
            console.warn('经过多次尝试仍未找到手机登陆按钮或按钮不可点击');
        }
    }

    /**
     * 监听页面变化，页面变化时重新检查按钮
     */
    function observePageChanges() {
        const observer = new MutationObserver(() => {
            if (!isTaskCompleted) {
                console.log('页面发生变化，重新检查按钮...');
                clickLoginButton();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * 启动脚本，开始检测按钮并监听页面变化
     */
    function startScript() {
        console.log('脚本启动，开始检测按钮...');
        clickLoginButton();
        observePageChanges(); // 监听动态内容变化
    }

    // 延迟启动脚本（确保页面完全加载）
    setTimeout(startScript, 5000); // 延迟 5 秒启动
})();