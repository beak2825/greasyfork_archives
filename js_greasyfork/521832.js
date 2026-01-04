// ==UserScript==
// @name         抖音视频播放量刷取-按键模式定制
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  抖音视频播放量刷取，支持按键模式自定义，并显示执行次数-有封号风险，请谨慎使用，该脚本只用于学习用途，请勿用于违法行为。
// @author       Sweek
// @license      GPLv3
// @match        *://www.douyin.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521832/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E9%87%8F%E5%88%B7%E5%8F%96-%E6%8C%89%E9%94%AE%E6%A8%A1%E5%BC%8F%E5%AE%9A%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/521832/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E9%87%8F%E5%88%B7%E5%8F%96-%E6%8C%89%E9%94%AE%E6%A8%A1%E5%BC%8F%E5%AE%9A%E5%88%B6.meta.js
// ==/UserScript==

// 模拟按下键盘的函数
function pressKey(keyCode) {
    const event = new KeyboardEvent('keydown', { keyCode });
    document.dispatchEvent(event);
}

// 定义“上”和“下”键的 keyCode
const KEY_UP = 38;    // 上箭头键的 keyCode
const KEY_DOWN = 40;  // 下箭头键的 keyCode

// 生成一个 1 到 5 秒之间的随机间隔（单位：毫秒）
function getRandomInterval() {
    return Math.floor(Math.random() * 4000) + 1000; // 返回一个 1000 到 5000 毫秒之间的随机数
}

// 按键交替执行的函数，按模式执行（例如：4次下键、4次上键等）
function pressKeysByPattern(pattern, timesPerAction, repeatCount, updateProgress) {
    return new Promise((resolve) => {
        let count = 0;
        let patternIndex = 0;
        let repeatIndex = 0;  // 控制模式循环次数
        
        // 循环执行按键操作
        function pressNextKey() {
            if (repeatIndex < repeatCount) {  // 如果还需要重复
                if (count < pattern.length * timesPerAction) {
                    // 根据模式按键
                    const currentKey = pattern[patternIndex];
                    const keyToPress = (currentKey === 'down') ? KEY_DOWN : KEY_UP;
                    pressKey(keyToPress);
                    
                    count++;
                    
                    // 每按一次键后等待随机间隔时间，然后继续执行
                    const interval = getRandomInterval();
                    
                    // 每按完一轮后检查是否切换到下一个模式
                    if (count % timesPerAction === 0) {
                        patternIndex++;
                        if (patternIndex >= pattern.length) {
                            patternIndex = 0; // 重置模式索引，循环执行
                        }
                    }
                    
                    setTimeout(pressNextKey, interval);
                } else {
                    // 完成一次模式后，重置计数器，准备开始下一轮
                    count = 0;
                    repeatIndex++;  // 增加重复次数
                    updateProgress(repeatIndex, repeatCount);  // 更新显示的循环进度
                    setTimeout(pressNextKey, getRandomInterval());  // 等待一段时间后开始下一轮
                }
            } else {
                resolve(); // 完成所有任务
            }
        }
        
        pressNextKey(); // 开始按键操作
    });
}

// 在页面右上角添加一个显示进度的框
function createProgressBox() {
    const box = document.createElement('div');
    box.style.position = 'fixed';
    box.style.top = '10px';
    box.style.right = '10px';
    box.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    box.style.color = '#fff';
    box.style.padding = '10px';
    box.style.borderRadius = '5px';
    box.style.fontSize = '16px';
    box.style.zIndex = '9999';
    
    const title = document.createElement('div');
    title.textContent = '执行进度：';
    box.appendChild(title);
    
    const countDisplay = document.createElement('div');
    countDisplay.id = 'executionCount';
    countDisplay.textContent = '已执行: 0 / 0';  // 默认初始值为 0 / 0
    box.appendChild(countDisplay);
    
    document.body.appendChild(box);
}

// 更新显示的执行进度
function updateProgressDisplay(repeatIndex, repeatCount) {
    const countDisplay = document.getElementById('executionCount');
    if (countDisplay) {
        countDisplay.textContent = `已执行: ${repeatIndex} / ${repeatCount}`;
    }
}

// 执行脚本，传入需要的按键模式和每个动作的次数
(async function () {
    const repeatCount = 10;  // 设置总的循环次数
    createProgressBox();  // 创建进度显示框
    
    // 在开始之前，初始化进度框的显示
    updateProgressDisplay(0, repeatCount);  // 初始化为 0 / repeatCount
    
    const pattern = ['down', 'up'];  // 按下‘下’键4次，再按上‘上’键4次
    const timesPerAction = 4;        // 每个动作的次数：4次下键或上键

    // 执行多次按键循环
    await pressKeysByPattern(pattern, timesPerAction, repeatCount, updateProgressDisplay);
})();
