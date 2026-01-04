// ==UserScript==
// @name         DeepSeek 自动重试 & 点击次数上限
// @namespace    http://tampermonkey.net/
// @version      1.8.3
// @description  当页面中出现“服务器繁忙，请稍后再试”的提示时，自动点击 id 为“重新生成”的元素进行重试。页面右下角显示一个大盒子，包含自动重试开关及点击次数上限设置（含当前计数显示），点击次数达到上限时自动关闭重试。适用于 deepseek 页面。
// @author       Loki2077
// @match        https://chat.deepseek.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526537/DeepSeek%20%E8%87%AA%E5%8A%A8%E9%87%8D%E8%AF%95%20%20%E7%82%B9%E5%87%BB%E6%AC%A1%E6%95%B0%E4%B8%8A%E9%99%90.user.js
// @updateURL https://update.greasyfork.org/scripts/526537/DeepSeek%20%E8%87%AA%E5%8A%A8%E9%87%8D%E8%AF%95%20%20%E7%82%B9%E5%87%BB%E6%AC%A1%E6%95%B0%E4%B8%8A%E9%99%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 自动重试是否启用，默认开启
    let autoRetryEnabled = true;
    // 记录当前自动点击重试的次数
    let retryClickCount = 0;
    // 定义间隔时间变量（单位：秒）
    let jgtime = 10;
    // 定义倒计时变量
    let countdown = jgtime;
    // 提升为全局变量
    const container = document.createElement('div');

    // 定义多个错误提示关键词
    const errorPhrases = [
        "服务器繁忙，请稍后再试",
        "服务器繁忙",
        "The server is busy. Please try again later."
    ];

    // 创建 UI 大盒子，包含开关按钮和点击次数上限设置
    function createUIBox() {
        // const container = document.createElement('div');
        container.id = 'auto-retry-box';
        container.style.position = 'fixed';
        container.style.bottom = '10px';
        container.style.right = '10px';
        container.style.zIndex = 9999;
        container.style.background = 'rgba(120, 241, 104, 0.79)';
        container.style.color = '#fff';
        container.style.padding = '10px';
        container.style.borderRadius = '5px';
        container.style.fontSize = '14px';

        // 开关按钮
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'auto-retry-toggle';
        toggleBtn.style.width = '100%';
        toggleBtn.style.padding = '8px';
        toggleBtn.style.backgroundColor = '#007BFF';
        toggleBtn.style.color = '#FFFFFF';
        toggleBtn.style.border = 'none';
        toggleBtn.style.borderRadius = '5px';
        toggleBtn.style.cursor = 'pointer';
        toggleBtn.textContent = autoRetryEnabled ? '关闭自动重试' : '开启自动重试';

        toggleBtn.addEventListener('click', () => {
            autoRetryEnabled = !autoRetryEnabled;
            toggleBtn.textContent = autoRetryEnabled ? '关闭自动重试' : '开启自动重试';
            countdown = autoRetryEnabled ? jgtime : '关闭';
            console.log(`自动重试功能已${autoRetryEnabled ? '开启' : '关闭'}`);
            // 每次点击更新容器背景颜色
            container.style.backgroundColor = autoRetryEnabled ? 'rgba(120, 241, 104, 0.79)' : 'rgba(0, 0, 0, 0.3)';
        });

        container.appendChild(toggleBtn);

        // 点击次数上限和当前计数显示
        const limitBox = document.createElement('div');
        limitBox.style.marginTop = '10px';

        const limitLabel = document.createElement('label');
        limitLabel.htmlFor = 'max-click-input';
        limitLabel.textContent = '点击次数上限: ';

        const maxClickInput = document.createElement('input');
        maxClickInput.id = 'max-click-input';
        maxClickInput.type = 'number';
        maxClickInput.value = '5';
        maxClickInput.min = '0';
        maxClickInput.style.width = '50px';
        maxClickInput.style.marginRight = '10px';

        // 当前点击次数显示
        const countDisplay = document.createElement('span');
        countDisplay.id = 'click-count';
        countDisplay.textContent = retryClickCount;

        // 组合 limitBox
        limitBox.appendChild(limitLabel);
        limitBox.appendChild(maxClickInput);
        limitBox.appendChild(document.createTextNode(' 当前点击次数: '));
        limitBox.appendChild(countDisplay);

        container.appendChild(limitBox);

        // 间隔时间设置
        const intervalBox = document.createElement('div');
        intervalBox.style.marginTop = '10px';

        const intervalLabel = document.createElement('label');
        intervalLabel.htmlFor = 'interval-input';
        intervalLabel.textContent = '间隔时间 (秒): ';

        const intervalInput = document.createElement('input');
        intervalInput.id = 'interval-input';
        intervalInput.type = 'number';
        intervalInput.value = jgtime;
        intervalInput.min = '1';
        intervalInput.style.width = '80px';
        intervalInput.style.marginRight = '10px';

        intervalInput.addEventListener('change', () => {
            jgtime = Number(intervalInput.value) || jgtime;
            countdown = jgtime;
            clearInterval(checkInterval);
            checkInterval = setInterval(checkAndRetry, jgtime * 1000);
            console.log(`间隔时间已修改为 ${jgtime} 秒`);
        });

        const countdownDisplay = document.createElement('span');
        countdownDisplay.id = 'countdown-display';
        countdownDisplay.textContent = `倒计时: ${countdown} 秒`;

        intervalBox.appendChild(intervalLabel);
        intervalBox.appendChild(intervalInput);
        intervalBox.appendChild(countdownDisplay);

        container.appendChild(intervalBox);

        document.body.appendChild(container);
    }

    // 新增弹窗提示函数
    function showPopup(message) {
        // 若容器不存在，则创建一个固定在屏幕右上角的容器，子项将从下往上排列
        let container = document.getElementById('popup-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'popup-container';
            container.style.position = 'fixed';
            container.style.top = '20px';
            container.style.right = '20px';
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.alignItems = 'flex-end';
            container.style.gap = '5px';
            container.style.zIndex = 10000;
            document.body.appendChild(container);
        }
        
        // 创建提示弹窗
        const popup = document.createElement('div');
        popup.textContent = message;
        popup.style.backgroundColor = '#d0f0c040'; // 淡绿色背景
        popup.style.color = '#000';
        popup.style.padding = '10px 20px';
        popup.style.borderRadius = '5px';
        popup.style.fontSize = '14px';
        popup.style.opacity = 0;
        popup.style.transform = 'translateY(20px)';
        popup.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
        
        container.appendChild(popup);
        
        // 增加延迟，让每个弹窗之间有间隔，延迟时间根据当前容器中的弹窗数量计算（每个延迟200ms）
        const delay = container.children.length * 500;
        
        // 触发动画：自下而上渐显（延迟启动）
        setTimeout(() => {
           popup.style.opacity = 1;
           popup.style.transform = 'translateY(0)';
        }, delay);
        
        // 2秒后开始淡出并向上移动，然后移除该提示（考虑延迟后再计时）
        setTimeout(() => {
           popup.style.opacity = 0;
           popup.style.transform = 'translateY(-20px)';
           // 动画结束后移除元素
           setTimeout(() => {
               popup.remove();
           }, 1000);
        }, 5000 + delay*3);
    }

    // 给msg参数，调用showPopup函数，和console.log函数
    function showMsg(msg){
        console.log(msg);
        showPopup(msg);
    }

    // 检查页面是否出现错误提示，并执行自动重试操作（带点击次数上限判断）
    function checkAndRetry() {
        if (!autoRetryEnabled) return;

        const maxClickInput = document.getElementById('max-click-input');
        const maxClickCount = Number(maxClickInput.value) || 0;
        if (retryClickCount >= maxClickCount && maxClickCount > 0) {
            showMsg("点击次数上限，自动重试关闭。");
            autoRetryEnabled = false;
            // 更新容器背景颜色
            container.style.backgroundColor = autoRetryEnabled ? 'rgba(120, 241, 104, 0.79)' : 'rgba(0, 0, 0, 0.3)';
            document.getElementById('auto-retry-toggle').textContent = '开启自动重试';
            return;
        }

        

        // 查找 class 包含 "d7dc56a8" 的 div
        const targetDivs = document.querySelectorAll('div[class*="d7dc56a8"]');
        for (let i = 0; i < targetDivs.length; i++) {
            // 检查 div 内容是否包含错误提示关键词
            const textContent = targetDivs[i].textContent;
            // 如果找到错误提示，就模拟点击“重新生成”按钮
            if (errorPhrases.some(phrase => textContent.includes(phrase))) {
                // 找到错误提示，弹窗提示
                showMsg("检测到错误提示");
                // 提取textContext中的错误提示;
                showMsg(errorPhrases.find(phrase => textContent.includes(phrase)));
                // 当前错误提示是什么
                showMsg("开始寻找重新生成按钮");
                const retryElement = targetDivs[i].querySelector('#重新生成');
                if (retryElement) {
                    showMsg("找到重新生成按钮");
                    showMsg("模拟点击 重新生成 按钮");
                    if (typeof retryElement.click === "function") {
                        retryElement.click();
                        // 模拟点击成功后，重置倒计时
                        countdown = jgtime;
                        showMsg("模拟点击 成功");
                    } else {
                        const event = new MouseEvent("click", {
                            view: window,
                            bubbles: true,
                            cancelable: true
                        });
                        retryElement.dispatchEvent(event);
                    }
                    retryClickCount++;
                    document.getElementById('click-count').textContent = retryClickCount;
                } else {
                    showMsg("检测到错误提示，但未找到 '重新生成' 按钮。")
                }
                break;
            }
        }


        // 更新容器背景颜色
        container.style.backgroundColor = autoRetryEnabled ? 'rgba(120, 241, 104, 0.79)' : 'rgba(0, 0, 0, 0.3)';
    }

    // 初始化 UI
    createUIBox();

    // 每隔 jgtime 秒检测页面内容
    let checkInterval = setInterval(checkAndRetry, jgtime * 1000);

    // 更新倒计时显示
    setInterval(() => {
        // 如果启用了自动重试功能，并且倒计时减到 0，就重置倒计时
        if (countdown === 0 && autoRetryEnabled) {
            countdown = jgtime;
        }
        // 如果倒计时大于 0 并且自动重试功能开启，则继续倒计时
        if (countdown > 0 && autoRetryEnabled) {
            countdown--;
        } else {
            countdown = "关闭";
        }
        // 更新倒计时显示
        if (countdown === "关闭") {
            document.getElementById('countdown-display').textContent = ` ${countdown} `;
        }else{
            document.getElementById('countdown-display').textContent = `倒计时: ${countdown} 秒`;
        }
    }, 1000);

    // 如有需要，可以使用 MutationObserver 监听 DOM 变化（可选）
    /*
    const observer = new MutationObserver(checkAndRetry);
    observer.observe(document.body, { childList: true, subtree: true });
    */
})();
