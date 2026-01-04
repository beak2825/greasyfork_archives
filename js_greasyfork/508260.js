// ==UserScript==
// @name         linux.do自动点赞❤️
// @namespace    http://tampermonkey.net/
// @version      1.00
// @description  自动点击帖子的❤️
// @author       Baichang
// @license      AGPL-3.0-or-later
// @match        https://linux.do/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508260/linuxdo%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%E2%9D%A4%EF%B8%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/508260/linuxdo%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%E2%9D%A4%EF%B8%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isRunning = false; 

    // 获取目标元素，确保目标元素存在
    var targetElement = document.querySelector('.d-header .icons');
    if (!targetElement) return;

    // 创建新的链接元素
    var newLink = document.createElement('a');
    newLink.alt = '开始/停止自动点赞';
    newLink.href = '#'; // 设置为 # 以避免页面跳转
    newLink.style.cursor = 'pointer'; // 设置鼠标指针为手形
    newLink.style.position = 'fixed'; // 悬浮在窗口上
    newLink.style.top = '15%'; 
    newLink.style.right = '20px'; 
    newLink.style.zIndex = '1000'; 
    newLink.style.background = 'rgba(255, 255, 255, 0.9)'; 
    newLink.style.padding = '10px'; 
    newLink.style.borderRadius = '5px'; 
    newLink.style.transition = 'transform 0.2s'; 

    // 创建新的图标元素
    var newIcon = document.createElement('span');
    newIcon.classList.add('icon', 'rank-icon');
    newIcon.style.fontSize = '25px'; // 设置图标大小
    newIcon.innerHTML = '❤️'; 
    newLink.appendChild(newIcon);
    document.body.appendChild(newLink);
    newLink.onclick = (event) => {
        event.preventDefault(); 
        isRunning = !isRunning; 
        
        // 更新图标
        newIcon.innerHTML = isRunning ? '⏸️❤️' : '❤️'; 

        
        if (isRunning) {
            clickWithDelay();
        }
    };

    async function clickWithDelay() {
        while (isRunning) {
            const buttons = document.querySelectorAll('.discourse-reactions-reaction-button');

            if (buttons.length === 0) { 
                console.log("没有找到❤️按钮");
                break; // 没有按钮可点击，退出循环
            }

            let canClick = false; // 标记是否可以点击

            for (const bt of buttons) {
                if (!bt.classList.contains('already_clicked') && bt.innerHTML.includes("d-icon-far-heart")) {
                    bt.classList.add('already_clicked'); // 标记为已点击
                    canClick = true;

                    bt.click(); // 点击按钮
                    console.log("已点击❤️按钮");

                    const randomDelay = Math.random() * (5000 - 1500) + 1500; 
                    await new Promise(resolve => setTimeout(resolve, randomDelay)); // 随机延时
                    break; // 每次只点击一个按钮
                }
            }

            // 如果所有按钮都已点击，尝试滚动 
            if (!canClick) {
                console.log("所有按钮都已点击，滚动一下");
                await scroll();
            }

            // 向下滚动，以寻找新的按钮
            await scroll();
        }
    }

    async function scroll() {
        for (let i = 0; i < 10; i++) {
            window.scrollBy(0, 22); // 向下滚动
            await new Promise(resolve => setTimeout(resolve, 30)); // 适当延时
        }
    }

    const style = document.createElement('style');
    style.innerHTML = `
        @media (max-width: 600px) {
            a {
                padding: 8px; 
            }
            .rank-icon {
                font-size: 20px; 
            }
        }
    `;
    document.head.appendChild(style);
})();