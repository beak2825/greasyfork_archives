// ==UserScript==
// @name         Temu卖家中心样式优化
// @namespace    https://greasyfork.org/zh-CN/scripts/528600
// @version      0.11
// @license      MIT
// @description  1. 移除"发货单列表"每次打开都提示"请勾选发货单后点击发货，否则仓库无法收货"的烦人弹窗。 2. 如果用浏览器记住账号密码，进入登录页面的时候会自动勾选同意条款，但是不会自动登录（浏览器安全机制决定的），但是点击空白位置即可自动登录。3. 增加了全局快捷键，按下Esc键即可关闭弹窗。
// @author       zhenhappy<q505507538@gmail.com>
// @include      https://agentseller.temu.com/*
// @include      https://seller.kuajingmaihuo.com/*
// @icon         https://bstatic.cdnfe.com/static/files/sc/favicon.ico
// @require      https://unpkg.com/jquery/dist/jquery.slim.min.js
// @grant        none
// @inject-into  page
// @sandbox      false
// @run          document-end
// @downloadURL https://update.greasyfork.org/scripts/528600/Temu%E5%8D%96%E5%AE%B6%E4%B8%AD%E5%BF%83%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/528600/Temu%E5%8D%96%E5%AE%B6%E4%B8%AD%E5%BF%83%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

$(document).ready(function() {
    'use strict';

    // 任务映射表
    const taskMap = [
        {
            name: '隐藏发货单列表弹窗',
            match: /^\/main\/order-manager\/shipping-list/,
            task: async function() {
                try {
                    const tooltip = await waitForElement('.PT_tooltip_5-117-0', 2000);
                    tooltip.css({
                        'display': 'none',
                        'visibility': 'hidden',
                        'opacity': '0',
                        'pointer-events': 'none'
                    });
                    console.log('成功隐藏弹窗元素');
                } catch (e) {
                    console.error(e)
                    console.log('未找到弹窗元素');
                }
            }
        },
        {
            name: '自动登录（手动设置账号密码并点击登录按钮）',
            match: /^\/login$/,
            task: async function() {
                try {
                    const agreeCheckbox = await waitForElement('.CBX_squareInputWrapper_5-116-1');
                    agreeCheckbox.click();
                    console.log('已勾选同意条款，准备延时点击登录按钮');
                } catch (e) {
                    console.error(e)
                    console.log('未找到同意条款复选框，自动登录流程未执行');
                    return;
                }
                try {
                    const usernameId = await waitForElement('#usernameId');
                    console.log('监听usernameId变化，只要鼠标点击任意位置即可触发change事件');
                    $(usernameId).on('change', async function() {
                        console.log('检测到输入或更改事件，继续流程');
                        await delay(100);
                        if ($(this).val()) {
                            try {
                                const loginBtn = await waitForElement('.BTN_primary_5-116-1');
                                loginBtn.click();
                                console.log('已点击登录按钮');
                            } catch (e) {
                                console.error(e);
                                console.log('未找到登录按钮');
                                return;
                            }
                        } else {
                            console.log('用户名为空，流程未继续');
                        }
                    });
                } catch (e) {
                    console.error(e);
                    console.log('监听usernameId变化失败');
                }
            }
        },
        {
            name: 'Esc关闭弹窗',
            match: '__ESC_KEY__',
            task: async function() {
                try {
                    const closeBtn = await waitForElement('[data-testid="beast-core-modal-icon-close"], [data-testid="beast-core-icon-close"]', 500);
                    const lastCloseBtn = closeBtn[closeBtn.length - 1];
                    if (typeof lastCloseBtn.click === 'function') {
                        lastCloseBtn.click();
                    } else {
                        lastCloseBtn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
                    }
                    console.log('[Temu脚本] 按下Esc，已关闭弹窗');
                } catch (e) {
                    console.log('[Temu脚本] 按下Esc，未找到可关闭的弹窗按钮');
                }
            }
        },
        {
            name: '自动点击销售管理页面机会商品的我知道了的按钮',
            match: /^\/main\/sale-manage\/main$/,
            task: async function() {
                try {
                    const btn = await waitForElement('[data-tracking-id="4A5uYH-CuXtR4k69"]', 1000);
                    if (btn.length > 0) {
                        if (typeof btn[0].click === 'function') {
                            btn[0].click();
                        } else {
                            btn[0].dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
                        }
                        console.log('[Temu脚本] 已自动点击销售管理页面机会商品弹窗的“我知道了”的按钮');
                    } else {
                        console.log('[Temu脚本] 未找到销售管理页面机会商品弹窗的“我知道了”的按钮');
                    }
                } catch (e) {
                    console.log('[Temu脚本] 未找到销售管理页面机会商品弹窗的“我知道了”的按钮');
                }
            }
        }
        // 以后可继续添加其他页面任务
    ];

    // 页面加载时立即执行
    runTaskForCurrentPath();
    listenUrlChange();
    setupGlobalKeyListener();

    // 任务调度函数
    async function runTaskForCurrentPath() {
        const path = location.pathname;
        for (const {name, match, task} of taskMap) {
            if (typeof match === 'string' ? path === match : match.test(path)) {
                console.log(`[Temu脚本] 执行任务：${name}`);
                try {
                    await task();
                    console.log(`[Temu脚本] 任务"${name}"执行完毕`);
                } catch (e) {
                    console.error(`[Temu脚本] 任务"${name}"执行出错：`, e);
                }
                break;
            }
        }
    }

    // 监听路由变化
    function listenUrlChange() {
        let lastPath = window.location.pathname;
        const observer = new MutationObserver(() => {
            if (window.location.pathname !== lastPath) {
                lastPath = window.location.pathname;
                runTaskForCurrentPath();
            }
        });
        observer.observe(document.body, {childList: true, subtree: true});
    }

    // 延时函数
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 等待元素出现的函数
    function waitForElement(selector, timeout = 500) {
        const { promise, resolve, reject } = Promise.withResolvers();
        const el = $(selector);
        if (el.length !== 0) {
            resolve(el);
            return promise;
        }
        const start = Date.now();
        const timer = setInterval(() => {
            const el = $(selector);
            if (el.length > 0) {
                clearInterval(timer);
                resolve(el);
            } else if (Date.now() - start > timeout) {
                clearInterval(timer);
                reject(new Error(`元素未在规定时间(${timeout})内出现: ${selector}`));
            }
        }, 10);
        return promise;
    }

    // 封装全局键盘监听事件
    function setupGlobalKeyListener() {
        $(document).on('keydown', function(e) {
            if (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) {
                // 查找任务映射表中名为 'Esc关闭弹窗' 的任务并执行
                const escTask = taskMap.find(t => t.name === 'Esc关闭弹窗');
                if (escTask && typeof escTask.task === 'function') {
                    escTask.task();
                }
            }
        });
    }
});