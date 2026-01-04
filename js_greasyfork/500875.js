// ==UserScript==
// @name         ChatGPT自动点击继续生成
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  安全的自动点击ChatGPT网站上的“继续生成”按钮，防止多次点击造成浪费性访问次数，附带自动点击计数次数显示
// @author       狐狸的狐狸画
// @match        https://chatgpt.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500875/ChatGPT%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%BB%A7%E7%BB%AD%E7%94%9F%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/500875/ChatGPT%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%BB%A7%E7%BB%AD%E7%94%9F%E6%88%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let observer;
    let isClicked = false; // 标志变量
    let clickCount = 0; // 点击计数器
    const cooldownTime = 10000; // 冷却时间30秒
    let cooldownInterval; // 冷却倒计时计时器

    // 创建一个文本元素用于显示点击次数
    const clickCountText = document.createElement('div');
    clickCountText.innerText = '点击次数: 0';
    clickCountText.style.position = 'fixed';
    clickCountText.style.bottom = '10px';
    clickCountText.style.right = '10px';
    clickCountText.style.zIndex = 1000;
    clickCountText.style.backgroundColor = 'rgb(255, 255, 255)'; // 背景颜色为白色
    clickCountText.style.color = 'rgb(0, 0, 0)'; // 初始文本颜色为黑色
    clickCountText.style.padding = '5px';
    clickCountText.style.borderRadius = '5px'; // 圆角设置
    document.body.appendChild(clickCountText);

    // 创建一个MutationObserver实例
    observer = new MutationObserver((mutations) => {
        if (isClicked) return; // 如果已经点击了按钮，则不进行后续操作

        mutations.forEach((mutation) => {
            if (isClicked) return; // 如果已经点击了按钮，则不进行后续操作

            // 获取所有的button标签
            const buttons = document.getElementsByTagName('button');

            // 遍历所有的button标签
            for (let i = 0; i < buttons.length; i++) {
                const button = buttons[i];
                // 检查button标签内是否包含<div>并且<div>内容包含“继续生成”
                const divs = button.getElementsByTagName('div');
                for (let j = 0; j < divs.length; j++) {
                    if (divs[j].innerText.includes('继续生成')) {
                        // 如果找到，打印日志并更新点击计数器
                        console.log('已点击“继续生成”按钮');
                        button.click(); // 实际点击按钮
                        clickCount++;
                        clickCountText.innerText = '点击次数: ' + clickCount;

                        // 设置标志变量为true
                        isClicked = true;

                        // 停止观察MutationObserver
                        observer.disconnect();

                        // 启动冷却倒计时
                        let remainingTime = cooldownTime / 1000;
                        clickCountText.style.color = 'rgb(125, 125, 125)'; // 冷却中文本颜色为灰色
                        cooldownInterval = setInterval(() => {
                            remainingTime--;
                            if (remainingTime <= 0) {
                                clearInterval(cooldownInterval);
                                clickCountText.style.color = 'rgb(0, 0, 0)'; // 冷却结束文本颜色为黑色
                                isClicked = false;
                                observePageChanges();
                            }
                        }, 1000);

                        return; // 结束函数，避免多次点击同一个按钮
                    }
                }
                if (isClicked) break; // 如果已经点击了按钮，退出循环
            }
        });
    });

    // 开始观察页面变化
    function observePageChanges() {
        // 配置MutationObserver观察选项
        const config = { childList: true, subtree: true };

        // 选择需要观察的目标节点
        const targetNode = document.body;

        // 启动MutationObserver
        observer.observe(targetNode, config);
    }

    // 初始化时开始观察页面变化
    observePageChanges();

})();
