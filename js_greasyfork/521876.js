// ==UserScript==
// @name Jimmy pc261690603
// @namespace http://tampermonkey.net/
// @version 1.5
// @description 按顺序发送手机号码，并处理验证码和动态加载问题
// @author Your Name
// @match *://*/register
// @match *://*/register/SMSRegister
// @grant GM_log
// @grant GM_xmlhttpRequest
// ==/UserScript==

(function () {
    'use strict';

   // 手机号码库
   const phoneNumbers = [
       "0187625738", "0187624851", "0187624857", "0187625064", "0187624715",
       "0187624697", "0187624014", "0187623986", "0187623974", "0187625242",
       "0187625260", "0187625265", "0187625285", "0187625179", "0187625150",
       "0187625202", "0187625211", "0187625226", "0187624253", "0187623652",
       "0187624605", "0187624629", "0187624650", "0187623929", "0187624865",
       "0187625014", "0187625034", "0187623713", "0187623709", "0187624791",
       "0187624796", "0187631187", "0187633654", "0187625945", "0187625915",
       "0187625910", "0187625894", "0187625850", "0187625826", "0187625796",
       "0187622568", "0187626564", "0187626547", "0187626169", "0187626649",
       "0187626613", "0187622610", "0187622583", "0187626572", "0187625987"
   ];

    // 从 localStorage 获取当前索引
    let currentIndex = parseInt(localStorage.getItem('currentIndex')) || 0;

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

    // 处理下一个手机号码
    function processNextNumber() {
        if (currentIndex >= phoneNumbers.length) {
            console.log("所有手机号码已发送完毕。");
            return;
        }

        console.log(`准备发送第 ${currentIndex + 1} 个号码: ${phoneNumbers[currentIndex]}`);

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
                                location.reload();
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
        setTimeout(processNextNumber, 1000); // 页面加载后延迟1秒开始处理
    };
})();
