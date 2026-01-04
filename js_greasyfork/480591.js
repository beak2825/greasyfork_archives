// ==UserScript==
// @name         航天云课堂自动学习
// @namespace    charles
// @version      1.1
// @description  在页面中找到所有内容为"未完成"的元素，并按顺序每30分钟点击其最近的祖先<li>元素（带悬浮窗启停按钮）
// @author       wuchao
// @match        https://train.casicloud.com/*  // 替换为目标网站的URL
// @connect    train.casicloud.com
// @include    *://*.casicloud.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480591/%E8%88%AA%E5%A4%A9%E4%BA%91%E8%AF%BE%E5%A0%82%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/480591/%E8%88%AA%E5%A4%A9%E4%BA%91%E8%AF%BE%E5%A0%82%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义点击间隔时间（25分钟）
    const clickInterval = 25 * 60 * 1000;

    // 获取所有class为"ms-train-state"且内容为"未完成"的元素
    let unfinishedElements = Array.from(document.querySelectorAll('.ms-train-state'))
    .filter(element => element.textContent.includes('未完成'));

     
        // 定义当前点击索引
        let currentIndex = 0;

    // 点击函数
    function clickElement() {
        if(currentIndex==0){
        unfinishedElements = Array.from(document.querySelectorAll('.ms-train-state'))
    .filter(element => element.textContent.includes('未完成'));
        }
        // 检查当前索引是否超出元素数量
        if (currentIndex >= unfinishedElements.length) {
            // 所有元素都已点击完成，停止定时器
            clearInterval(timer);
            console.log('所有元素点击完成');
            return;
        }

        // 获取当前待点击的元素的兄弟节点中class为"title-row pointer"的子节点
        const siblingNode = unfinishedElements[currentIndex].previousElementSibling.querySelector('.title-row.pointer');

        siblingNode.click();

        // 输出点击信息
        console.log(`点击的元素：${siblingNode.textContent}，当前点击第${currentIndex}个，剩余${unfinishedElements.length-currentIndex}个`);

        // 增加索引，准备点击下一个元素
        currentIndex++;
    }

    // 切换开关状态
    function toggleSwitch() {
        // 获取开关状态
        let switchStatus = GM_getValue('switchStatus', false);
        let floatBtn=document.getElementById('as-floating-button');
        const newSwitchStatus = !switchStatus;
        GM_setValue('switchStatus', newSwitchStatus);
        console.log(`脚本已${newSwitchStatus ? '启动' : '停止'}`);
        if (newSwitchStatus) {
            // 如果开关状态为启动，则立即执行点击函数
            clickElement();
            // 设置定时器，每30分钟执行一次点击函数
            timer = setInterval(clickElement, clickInterval);
        } else {
            // 如果开关状态为停止，则清除定时器
            clearInterval(timer);
        }
        floatBtn.textContent=newSwitchStatus ? '停止脚本' : '启动脚本';
    }

    // 创建悬浮窗容器
    const container = document.createElement('div');
    container.className = 'floating-container';

    // 创建启停按钮
    let switchStatus = GM_getValue('switchStatus', false);
    const switchButton = document.createElement('button');
    switchButton.textContent = switchStatus ? '停止脚本' : '启动脚本';
    switchButton.className = 'floating-button';
    switchButton.id = 'as-floating-button';
    switchButton.addEventListener('click', toggleSwitch);
    container.appendChild(switchButton);

    // 添加悬浮窗容器到页面
    document.body.appendChild(container);

    // 添加自定义CSS样式
    GM_addStyle(`
        .floating-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
        }
        .floating-button {
            padding: 10px;
            font-size: 16px;
            background-color: #fff;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
    `);

    let timer;

    if (switchStatus) {
        // 如果开关状态为启动，则立即执行点击函数
        clickElement();
        // 设置定时器，每30分钟执行一次点击函数
        timer = setInterval(clickElement, clickInterval);
    }
})();