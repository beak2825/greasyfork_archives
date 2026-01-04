// ==UserScript==
// @name         自动“取消”洛谷提交验证码
// @namespace    http://tampermonkey.net/
// @version      1.3
// @author       ChatGPT
// @description  none
// @license      MIT
// @match        *://*.luogu.com.cn/*
// @match        *://*.luogu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517277/%E8%87%AA%E5%8A%A8%E2%80%9C%E5%8F%96%E6%B6%88%E2%80%9D%E6%B4%9B%E8%B0%B7%E6%8F%90%E4%BA%A4%E9%AA%8C%E8%AF%81%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/517277/%E8%87%AA%E5%8A%A8%E2%80%9C%E5%8F%96%E6%B6%88%E2%80%9D%E6%B4%9B%E8%B0%B7%E6%8F%90%E4%BA%A4%E9%AA%8C%E8%AF%81%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MAX_RETRIES = 5;
    let retryCount = 0;

    // 检查当前页面是否为需要的提交页面
    function isSubmitPage() {
        return /https?:\/\/(?:.*\.)?luogu\.com(?:\.cn)?\/problem\/.*#submit/.test(window.location.href);
    }

    // 模拟用户点击事件
    function simulateClick(element) {
        const event = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        element.dispatchEvent(event);
    }

    // 等待指定的选择器元素出现
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                return resolve(element);
            }

            const observer = new MutationObserver((mutations, obs) => {
                const el = document.querySelector(selector);
                if (el) {
                    resolve(el);
                    obs.disconnect();
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error('等待超时: ' + selector));
            }, timeout);
        });
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 自动处理弹窗
    async function autoHandlePopups() {
        try {
            // 等待“请输入验证码”弹窗出现
            let captchaPopup = await waitForElement('.swal2-title', 10000);
            if (captchaPopup) {
                let tries = 0;
                while (!captchaPopup.innerHTML.trim().includes('请输入验证码')) {
                    captchaPopup = await waitForElement('.swal2-title', 10000);
                    ++tries;
                    if (tries > 50) {
                        console.error('弹窗无标题，无法判断');
                        return;
                    }
                    await sleep(100);
                }
            }
            if (captchaPopup && captchaPopup.innerHTML.includes('请输入验证码')) {
                console.log('检测到“请输入验证码”弹窗');

                // 点击“取消”按钮
                const cancelButton = document.querySelector('button.swal2-cancel.swal2-styled');
                if (cancelButton) {
                    simulateClick(cancelButton);
                    console.log('已点击“取消”按钮');
                } else {
                    console.log('未找到“取消”按钮');
                }

                // 等待“提交失败”弹窗出现
                let failPopup = await waitForElement('.swal2-title', 10000);
                if (failPopup) {
                    let tries = 0;
                    while (!failPopup.innerHTML.trim().includes('提交失败')) {
                        console.error(failPopup.innerHTML);
                        failPopup = await waitForElement('.swal2-title', 10000);
                        ++tries;
                        if (tries > 50) {
                            console.error('弹窗无标题，无法判断');
                            return;
                        }
                        await sleep(100);
                    }
                }
                if (failPopup && failPopup.textContent.includes('提交失败')) {
                    console.log('检测到“提交失败”弹窗');

                    // 点击“OK”按钮
                    const okButton = document.querySelector('button.swal2-confirm.swal2-styled');
                    if (okButton) {
                        simulateClick(okButton);
                        console.log('已点击“OK”按钮');
                    } else {
                        console.log('未找到“OK”按钮');
                    }

                    // 增加重试次数，防止无限循环
                    retryCount++;
                    if (retryCount < MAX_RETRIES) {
                        console.log(`重试次数: ${retryCount}，将在0.1秒后再次点击“提交评测”按钮`);
                        setTimeout(clickSubmitButton, 100);
                    } else {
                        console.log('已达到最大重试次数，停止脚本执行');
                        retryCount = 0;
                    }
                }
            } else {
                console.log('未检测到“请输入验证码”弹窗，操作完成');
                console.log(captchaPopup.innerHTML);
            }
        } catch (error) {
            console.error('处理过程中发生错误:', error);
        }
    }

    // 点击“提交评测”按钮
    function clickSubmitButton() {
        const submitButton = getSubmitButton();
        if (submitButton) {
            simulateClick(submitButton);
            console.log('已点击“提交评测”按钮');
        } else {
            console.log('未找到“提交评测”按钮');
        }
    }

    // 获取“提交评测”按钮
    function getSubmitButton() {
        const buttons = document.querySelectorAll('button.lfe-form-sz-middle');
        for (let btn of buttons) {
            if (btn.textContent.trim() === '提交评测') {
                return btn;
            }
        }
        return null;
    }

    // 拦截“提交评测”按钮的点击事件
    function interceptSubmitButton() {
        const submitButton = getSubmitButton();
        if (submitButton) {
            submitButton.addEventListener('click', function(event) {
                event.preventDefault(); // 阻止默认行为
                console.log('submitted');

                // 调用自动处理函数
                autoHandlePopups();
            }, true); // 使用捕获阶段，优先拦截
            console.log('已为“提交评测”按钮添加事件监听器');
        } else {
            console.log('未找到“提交评测”按钮，无法添加事件监听器');
        }
    }

    // 监听页面加载完成
    window.addEventListener('load', () => {
        setInterval(() => {
            if (isSubmitPage()) {
                console.log('当前页面为提交评测页面，脚本已启动');
                // 延迟一段时间，确保按钮已渲染
                setTimeout(interceptSubmitButton, 1000);
            } else {
                console.log('当前页面不符合条件，脚本未启动');
            }
        }, 1000);
    });

})();
