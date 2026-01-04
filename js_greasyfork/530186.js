// ==UserScript==
// @name         timer
// @namespace    http://sugarblack.top
// @version      1.3.1
// @description  for q11e
// @author       zemelee
// @match        http://sugarblack.top/*
// @downloadURL https://update.greasyfork.org/scripts/530186/timer.user.js
// @updateURL https://update.greasyfork.org/scripts/530186/timer.meta.js
// ==/UserScript==

// 看！这！里！
//1. 转到 TamperMonkey 插件，创建新脚本，删除新脚本里的所有内容
//2. 然后请将所有文本(包括上面的部分)复制到脚本中并保存。刷新 http://sugarblack.top 就可以生效
//3. 如果未生效请打开浏览器的开发者模式 
// . Edge浏览器可以在 edge://extensions 打开， Chrome浏览器可以在 chrome://extensions 打开

// . 设置参数后点击 开始任务(不是提交按钮，是开始任务按钮)，网页就会自己刷问卷，同时不影响你用电脑做其他任务，只要不影响刷问卷网页即可
// . 单次开始任务前，网页会自动等待 (最小间隔~最大间隔) 之间的随机秒数，然后自动提交预设的份数
// . 循环次数 = 总提交份数
//   ================ 举个🌰 ================
// . 设 最小间隔=10，最大间隔=30，循环次数=3，点击开始任务；网页会立即自动提交1份，10~30s后，网页会再自动提交1份；
// . 再等10~30s后，网页会再自动提交1份。3次循环结束，总共提交3份，累计耗时 10*3~30*3 秒，也就是30~90s
//  =========================================
// 若需要终止循环，刷新或关闭网页即可~~~



async function oneTime(count) {
    let homeBtn = document.querySelector("#home-btn");
    homeBtn.click()
    await new Promise((resolve) => { setTimeout(resolve, 1000); });
    let inputEl = document.querySelector("#submit-number")
    inputEl.value = count
    const inputEvent = new Event('input', { bubbles: true });
    inputEl.dispatchEvent(inputEvent);
    await new Promise((resolve) => { setTimeout(resolve, 500); });
    let submitBtn = document.querySelector("#submit-btn");
    submitBtn.click()
    await new Promise((resolve) => { setTimeout(resolve, 1000); });
    // const buttons = document.querySelectorAll('button');
    // const confirmBtn = Array.from(buttons).filter(button => button.innerText.trim() === '确认');
    // confirmBtn[0].click()
    let confirmBtn = document.querySelectorAll(".el-message-box>.el-message-box__btns>button")
    confirmBtn[0].click()
}

function showMessage(text, delay) {
    let messageBox = document.createElement('div');
    messageBox.textContent = text;
    messageBox.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 9999;
    `;
    document.body.appendChild(messageBox);
    setTimeout(() => {
        document.body.removeChild(messageBox);
        messageBox = null;
    }, delay); // 4 seconds
}

function validate(inputs) {
    let minInterval = inputs[0]
    let maxInterval = inputs[1]
    let inputFor = inputs[2]

    if (!minInterval.value || !maxInterval.value || !inputFor.value) {
        showMessage("最大值和最小值需要被完整填写!", 3500)
        return false
    }
    if (Number(minInterval.value) >= Number(maxInterval.value)) {
        showMessage("最小间隔必须小于最大间隔时长!", 3500)
        return false
    }
    if (Number(minInterval.value) < 10) {
        showMessage("最小间隔必须大于10s!", 3500)
        return false
    } 

    if (Number(inputFor.value) > 200 || Number(inputFor.value) < 2) {
        showMessage("循环次数介于[2, 200]之间!", 3500)
        return false
    }
    return true
}

// 添加倒计时显示组件
function createCountdownDisplay() {
    const countdownContainer = document.createElement('div');
    countdownContainer.id = 'countdown-container';
    countdownContainer.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px 15px;
        border-radius: 5px;
        z-index: 10000;
        font-family: Arial, sans-serif;
        font-size: 14px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        display: none;
    `;
    
    const countdownText = document.createElement('div');
    countdownText.id = 'countdown-text';
    countdownText.textContent = '倒计时: --s';
    
    const cycleInfo = document.createElement('div');
    cycleInfo.id = 'cycle-info';
    cycleInfo.textContent = '当前循环: --/--';
    countdownContainer.appendChild(countdownText);
    countdownContainer.appendChild(cycleInfo);
    document.body.appendChild(countdownContainer);
    return countdownContainer;
}

// 更新倒计时显示
function updateCountdownDisplay(remainingTime, currentCycle, totalCycles) {
    const countdownText = document.getElementById('countdown-text');
    const cycleInfo = document.getElementById('cycle-info');
    if (countdownText && cycleInfo) {
        countdownText.textContent = `倒计时: ${remainingTime}s`;
        cycleInfo.textContent = `当前循环: ${currentCycle-1}/${totalCycles}`;
    }
}

// 隐藏倒计时显示
function hideCountdownDisplay() {
    const countdownContainer = document.getElementById('countdown-container');
    if (countdownContainer) {
        countdownContainer.style.display = 'none';
    }
}

// 显示倒计时显示
function showCountdownDisplay() {
    const countdownContainer = document.getElementById('countdown-container');
    if (countdownContainer) {
        countdownContainer.style.display = 'block';
    }
}

async function executeRepeatedly(minDelay, maxDelay, forTime) {
    let count = 0;
    let countdownInterval = null;
    // 创建倒计时显示组件
    createCountdownDisplay();
    async function execute() {
        if (count < forTime) {
            const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
            showMessage(`Current cycle: ${count + 1}, Delay: ${delay}s`, 5000);
            // 显示倒计时组件
            showCountdownDisplay();
            // 开始倒计时
            let remainingTime = delay;
            updateCountdownDisplay(remainingTime, count + 1, forTime);
            countdownInterval = setInterval(() => {
                remainingTime--;
                updateCountdownDisplay(remainingTime, count + 1, forTime);
                
                if (remainingTime <= 0) {
                    clearInterval(countdownInterval);
                }
            }, 1000);
            await oneTime(1); // 恒定为1
            count++;
            setTimeout(() => {
                clearInterval(countdownInterval);
                if (count < forTime) {
                    execute();
                } else {
                    // 循环结束，隐藏倒计时组件
                    hideCountdownDisplay();
                }
            }, delay * 1000);
        }
    }

    await execute();
    let homeBtn = document.querySelector("#home-btn");
    homeBtn.click()
}


(async function () {
    'use strict';
    
    let minInterval = localStorage.getItem("minInterval") || 10;
    let maxInterval = localStorage.getItem("maxInterval") || 30;
    let forTime = localStorage.getItem("forTime") || 5;
    await new Promise((resolve) => { setTimeout(resolve, 1000); });
    
    const container = document.querySelector("#app > div > div > div > div > div.main-content");
    const targetDiv = document.querySelector("#app > div > div > div > div > div.main-content > div.url-section");
    
    if (!container || !targetDiv) {
        return;
    }
    
    // 创建包装容器
    let controlContainer = document.createElement("div");
    controlContainer.className = "timer-controls";
    controlContainer.style.cssText = `
        padding: 5px 0 0 5px;
        background: #f5f5f5;
        border-radius: 8px;
    `;

    const label2 = document.createElement('label');
    const label3 = document.createElement('label');
    const label4 = document.createElement('label');

    label2.textContent = "最小间隔(s)";
    label3.textContent = "最大间隔(s)";
    label4.textContent = "循环次数";

    let inputMinInterval = document.createElement("input")
    let inputMaxInterval = document.createElement("input")
    let inputFor = document.createElement("input")

    inputMinInterval.placeholder = "最小间隔(s)";
    inputMaxInterval.placeholder = "最大间隔(s)";
    inputFor.placeholder = "循环次数";

    if (minInterval && maxInterval && forTime) {
        inputMinInterval.value = minInterval;
        inputMaxInterval.value = maxInterval;
        inputFor.value = forTime;
    }

    let inputs = [inputMinInterval, inputMaxInterval, inputFor];
    let labels = [label2, label3, label4];

    // 创建输入组容器
    inputs.forEach((item, index) => {
        let inputGroup = document.createElement('div');
        inputGroup.style.cssText = `
            display: inline-block;
            margin-right: 20px;
            margin-bottom: 10px;
        `;
        
        item.style.cssText = `
            width: 60px;
            padding: 5px;
            margin-left: 6px;
            border: 1px solid #ddd;
            border-radius: 4px;
        `;
        item.type = "number";
        
        inputGroup.appendChild(labels[index]);
        inputGroup.appendChild(item);
        controlContainer.appendChild(inputGroup);
    })

    let startBtn = document.createElement("button")
    startBtn.textContent = "开始任务"
    startBtn.style.cssText = `
        background: #409eff;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        margin-left: 10px;
    `;
    startBtn.addEventListener("click", function () {
        if (!validate(inputs)) return

        const newMinInterval = inputMinInterval.value;
        const newMaxInterval = inputMaxInterval.value;
        const newForTime = inputFor.value;

        localStorage.setItem("minInterval", newMinInterval)
        localStorage.setItem("maxInterval", newMaxInterval)
        localStorage.setItem("forTime", newForTime)

        executeRepeatedly(+newMinInterval, +newMaxInterval, +newForTime)
    })    
    controlContainer.appendChild(startBtn);
    // 在指定位置插入新元素
    container.insertBefore(controlContainer, targetDiv);
 
})();