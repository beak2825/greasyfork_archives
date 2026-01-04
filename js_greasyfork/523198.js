// ==UserScript==

// @name         Auto SMS Registration for Alook Browser

// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  自动填写并发送短信验证码的脚本，适用于 Alook 安卓浏览器。
// @author       Jimmy Cheng
// @match        *://*/register*
// @match        *://*/register/SMSRegister*
// @grant        GM_log
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/523198/Auto%20SMS%20Registration%20for%20Alook%20Browser.user.js
// @updateURL https://update.greasyfork.org/scripts/523198/Auto%20SMS%20Registration%20for%20Alook%20Browser.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const phoneNumbers = [
        "01139429794", "01139418570", "01139429827", "01139416185", "01139431526",
        "01139418528", "01139431557", "01139418531", "01139431527", "01139418779"
        // 继续添加你的电话号码列表...
    ];

    let currentIndex = parseInt(localStorage.getItem('currentIndex')) || 0;
    let isRunning = true; // 控制脚本是否运行

    // 创建停止按钮
    function createStopButton() {
        const button = document.createElement('button');
        button.innerText = '停止发送';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '1000';
        button.style.padding = '10px';
        button.style.backgroundColor = '#ff4d4d';
        button.style.color = 'white';
        button.style.borderRadius = '5px';
        button.onclick = () => {
            isRunning = false;
            alert("发送已停止。");
        };
        document.body.appendChild(button);
    }

    // 检查元素是否加载完成
    function waitForElement(selector, callback, interval = 500, timeout = 10000) {
        const startTime = Date.now();
        const timer = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(timer);
                callback(element);
            } else if (Date.now() - startTime > timeout) {
                clearInterval(timer);
                console.error(`等待元素 ${selector} 超时`);
            }
        }, interval);
    }

    // 更新剩余号码显示
    function updateRemainingCount() {
        const remainingCount = phoneNumbers.length - currentIndex;
        const display = document.getElementById('remainingCount');
        if (display) {
            display.innerText = `剩余号码: ${remainingCount}`;
        } else {
            const countDisplay = document.createElement('div');
            countDisplay.id = 'remainingCount';
            countDisplay.style.position = 'fixed';
            countDisplay.style.top = '50px';
            countDisplay.style.right = '10px';
            countDisplay.style.zIndex = '1000';
            countDisplay.style.backgroundColor = 'white';
            countDisplay.style.padding = '10px';
            countDisplay.style.border = '1px solid black';
            countDisplay.innerText = `剩余号码: ${remainingCount}`;
            document.body.appendChild(countDisplay);
        }
    }

    // 处理下一个手机号码
    function processNextNumber() {
        if (!isRunning) {
            return; // 如果停止运行，直接返回
        }

        if (currentIndex >= phoneNumbers.length) {
            alert("所有手机号码已发送完毕。");
            return;
        }

        console.log(`准备发送第 ${currentIndex + 1} 个号码: ${phoneNumbers[currentIndex]}`);
        updateRemainingCount(); // 更新剩余号码

        // 等待输入框加载
        waitForElement('input[name="mobile"]', (inputField) => {
            inputField.value = phoneNumbers[currentIndex];
            console.log(`输入手机号码: ${phoneNumbers[currentIndex]}`);

            waitForElement('.btn.warning.get-code', (sendButton) => {
                // 点击发送按钮
                sendButton.click();
                console.log("点击发送按钮。");

                // 等待确认按钮
                setTimeout(() => {
                    const yesButton = document.querySelector('.swal2-confirm');
                    if (yesButton) {
                        yesButton.click();
                        console.log("点击确认按钮。");

                        // 检查滑动验证码
                        setTimeout(() => {
                            const captchaElement = document.getElementById('aliyunCaptcha-window-popup');
                            if (captchaElement && captchaElement.style.display === 'block') {
                                console.log("检测到滑动验证码，刷新页面并重新开始。");
                                location.reload();
                                return;
                            }

                            // 如果没有验证码，等待一段时间后处理下一个号码
                            setTimeout(() => {
                                currentIndex++;
                                localStorage.setItem('currentIndex', currentIndex);
                                processNextNumber(); // 继续处理下一个号码
                            }, 3000);
                        }, 1000);
                    } else {
                        console.error('未找到确认按钮，请检查页面结构。');
                    }
                }, 1000);
            });
        });
    }

    // 启动脚本
    window.onload = function () {
        createStopButton(); // 创建停止按钮
        setTimeout(processNextNumber, 1000); // 页面加载后延迟1秒开始处理
    };
})();
