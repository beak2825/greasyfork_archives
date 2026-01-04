// ==UserScript==
// @name         Fuck AliYun IDaSS
// @namespace    https://greasyfork.org/
// @version      2.0
// @description  跳过IDaSS手动认证
// @author       Dawnnnnnn
// @match        *://aliyun-jp-sso.fintopia.tech/*
// @match        *://aliyun-sso.fintopia.tech/*
// @match        *://aliyun-indo-sso.fintopia.tech/*
// @match        *://aliyun-phi-sso.fintopia.tech/*
// @match        *://aliyun-snx-sso.fintopia.tech/*
// @match        *://aliyun-sjrt-sso.fintopia.tech/*
// @match        *://aliyun-digitforset-sso.fintopia.tech/*
// @match        *://login.work.weixin.qq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547337/Fuck%20AliYun%20IDaSS.user.js
// @updateURL https://update.greasyfork.org/scripts/547337/Fuck%20AliYun%20IDaSS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待元素出现的函数
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`等待元素超时: ${selector}`));
            }, timeout);
        });
    }

    // 点击元素的函数
    function clickElement(element, buttonName = '按钮') {
        if (element) {
            element.click();

            const event = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
            });
            element.dispatchEvent(event);

            console.log(`已点击${buttonName}`);
            return true;
        }
        return false;
    }

    // 检测页面类型
    function isFirstPage() {
        return document.querySelector('.three-login-content') !== null;
    }

    function isWeixinPage() {
        return window.location.href.includes('login.work.weixin.qq.com') &&
               document.title === '企业微信';
    }

    // 点击第一个按钮（企业微信登录按钮）
    async function clickFirstButton() {
        try {
            console.log('寻找企业微信登录按钮...');

            if (!isFirstPage()) {
                console.log('不在第一个页面，跳过');
                return;
            }

            const selector = '#app > div > div > div.login-content-wrap.false > div > div > div > div > div:nth-child(2) > div:nth-child(2) > div > div > div > div > span';
            const button = await waitForElement(selector, 10000);

            if (button.textContent.trim() === '企业微信') {
                console.log('找到企业微信按钮，点击中...');
                setTimeout(() => {
                    clickElement(button, '企业微信按钮');
                }, 100);
            }

        } catch (error) {
            console.log('未找到企业微信按钮:', error.message);
        }
    }

    // 点击第二个按钮（继续在浏览器中登录访问）
    async function clickContinueButton() {
        try {
            console.log('在企业微信页面寻找继续登录按钮...');

            if (!isWeixinPage()) {
                console.log('不在企业微信页面，跳过');
                return;
            }

            // 查找所有可能的按钮和链接
            const allElements = [
                ...document.querySelectorAll('a'),
                ...document.querySelectorAll('button'),
                ...document.querySelectorAll('[role="button"]')
            ];

            console.log(`找到${allElements.length}个可能的元素`);

            // 查找包含"继续在浏览器中登录访问"的元素
            for (const element of allElements) {
                if (element.offsetParent !== null) { // 确保元素可见
                    const text = element.textContent.trim();
                    if (text.includes('继续在浏览器中登录访问')) {
                        console.log(`找到目标元素: "${text}"，立即点击`);
                        setTimeout(() => {
                            clickElement(element, '继续在浏览器中登录按钮');
                        }, 100);
                        return;
                    }
                }
            }

            console.log('未找到"继续在浏览器中登录访问"按钮');

        } catch (error) {
            console.log('查找继续登录按钮时出错:', error.message);
        }
    }

    // 页面监控和处理
    function observePageChanges() {
        let hasClickedFirst = false;
        let hasClickedSecond = false;

        const observer = new MutationObserver(() => {
            // 处理第一个页面
            if (isFirstPage() && !hasClickedFirst) {
                console.log('检测到第一个页面');
                hasClickedFirst = true;
                setTimeout(clickFirstButton, 100);
            }
            // 处理企业微信页面
            else if (isWeixinPage() && !hasClickedSecond) {
                console.log('检测到企业微信页面');
                hasClickedSecond = true;
                setTimeout(clickContinueButton, 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 立即检查当前页面状态
        if (isFirstPage() && !hasClickedFirst) {
            console.log('页面加载时检测到第一个页面');
            hasClickedFirst = true;
            setTimeout(clickFirstButton, 100);
        } else if (isWeixinPage() && !hasClickedSecond) {
            console.log('页面加载时检测到企业微信页面');
            hasClickedSecond = true;
            setTimeout(clickContinueButton, 100);
        }
    }

    // 启动脚本
    function startAutoLogin() {
        console.log('企业微信自动登录脚本已启动');
        observePageChanges();
    }

    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startAutoLogin);
    } else {
        setTimeout(startAutoLogin, 1000);
    }

})();
