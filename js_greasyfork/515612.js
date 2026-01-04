// ==UserScript==
// @name         自动签到
// @namespace    https://api.ephone.ai/panel
// @version      0.4.1
// @description  签到
// @author       nameless
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        window.close
// @grant        window.focus
// @run-at       document-end
// @match        *://*/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515612/%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/515612/%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const targetUrls = ["https://api.ephone.ai/panel"];
    const today = new Date().toDateString();
    let retryCount = 0;
    let redirectCount = 0;
    const maxRetries = 3;
    let currentPanelIndex = GM_getValue('currentPanelIndex', 0);
    let isExecuted = GM_getValue('isExecuted', false);

    // 获取当前签到页面的 URL
    function getCurrentTargetUrl() {
        return targetUrls[currentPanelIndex];
    }

    // 显示签到成功提示
    async function showSuccessAlert() {
        const currentUrl = getCurrentTargetUrl();
        // 先保存新的索引值
        const newIndex = currentPanelIndex + 1;
        await GM_setValue('currentPanelIndex', newIndex);
        // alert(`签到成功！\n网站: ${currentUrl}\n执行状态: 成功`);
    }

    // 自动点击签到按钮的函数
    async function autoClickSignInButton() {
        const signInButton = document.querySelector('.semi-tag.semi-tag-default.semi-tag-square.semi-tag-light.semi-tag-blue-light');

        if (signInButton) {
            signInButton.click();
            console.log(`已自动点击 ${getCurrentTargetUrl()} 的"去签到"按钮`);
            // 等待签到成功提示完成
            await delay(1000);
            await showSuccessAlert();

            // 修改这里：检查是否还有下一个网站
            if (currentPanelIndex < targetUrls.length) {
                setTimeout(() => {
                    proceedToNextPanel();
                }, 2000);
            }
        } else {
            retryCount++;
            if (retryCount <= maxRetries) {
                console.log(`未找到 ${getCurrentTargetUrl()} 的"去签到"按钮，重试 ${retryCount}/${maxRetries}`);
                setTimeout(autoClickSignInButton, 1000);
            } else {
                console.log(`${getCurrentTargetUrl()} 重试次数已达到上限，认为已签到`);
                // 等待签到成功提示完成
                await delay(1000);
                await showSuccessAlert();

                // 修改这里：检查是否还有下一个网站
                if (currentPanelIndex < targetUrls.length) {
                    setTimeout(() => {
                        proceedToNextPanel();
                    }, 2000);
                }
            }
        }
    }

    // 跳转到目标页面并执行任务
    function performTask() {
        const targetUrl = getCurrentTargetUrl();

        // 如果当前页面是目标页面
        if (window.location.href.includes(targetUrl)) {
            console.log(`已在目标页面 ${targetUrl}，等待加载完成后进行签到...`);
            setTimeout(autoClickSignInButton, 2000);  // Call sign-in function after load
        } else {
            // 如果不在目标页面，则跳转
            redirectCount++;
            console.log(`未在目标页面，跳转到 ${targetUrl}`);
            window.location.href = targetUrl;
        }
    }

    // 处理跳转到下一个站点
    function proceedToNextPanel() {
        retryCount = 0; // 重试计数器
        redirectCount = 0; // 重置跳转计数器
        console.log(`跳转到下一个目标页面: ${getCurrentTargetUrl()}`);
        window.location.href = getCurrentTargetUrl();
    }

    // 添加一个延迟函数
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 主执行逻辑
    async function initializeScript() {
        console.log('当前URL:', window.location.href);
        console.log('当前面板索引:', currentPanelIndex);

        // 获取日期
        const lastRunDate = GM_getValue('lastRunDate', null);
        console.log('isExecuted状态:', isExecuted);

        // 如果是新的一天则重置执行状态
        if (lastRunDate !== today) {
            await delay(10000);
            console.log('新的一天，重置状态');
            GM_setValue('isExecuted', false);
            GM_setValue('currentPanelIndex', 0);
            GM_setValue('lastRunDate', today);
            isExecuted = false;
            currentPanelIndex = 0;
        }

        // 检查计数器redirectCount是否超过三次, 如果超过三次就停止执行
        if (redirectCount > 3) {
            console.log('检测到重定向次数超过三次，停止执行');
            return;
        }

        // 执行主逻辑签到, 根据计数器currentPanelIndex来判断是否执行
        if (currentPanelIndex < targetUrls.length && !isExecuted) {
            performTask();
        } else {
            isExecuted = true;
            GM_setValue('isExecuted', true);
            alert('所有网站签到完成！');
        }
    }

    // 启动逻辑
    const storedExecuted = GM_getValue('isExecuted', false);
    const storedDate = GM_getValue('lastRunDate', null);

    // 只有在今天没有执行过的情况下才运行脚本
    if (!storedExecuted || storedDate !== today) {
        console.log('脚本开始执行');
        initializeScript();
    } else {
        console.log('今天已经执行过脚本');
    }

})();