// ==UserScript==
// @name        斗鱼钓鱼自动操作脚本
// @namespace   your_namespace_here
// @match       https://www.douyu.com/pages/fish-act/mine*
// @grant       none
// @version     1.1
// @description 自动检测斗鱼钓鱼活动按钮并进行相应点击操作，实现自动抛竿、收杆，在活动时间段（中午12:00到凌晨00:30每个准点开启半小时）内执行抛竿
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522372/%E6%96%97%E9%B1%BC%E9%92%93%E9%B1%BC%E8%87%AA%E5%8A%A8%E6%93%8D%E4%BD%9C%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/522372/%E6%96%97%E9%B1%BC%E9%92%93%E9%B1%BC%E8%87%AA%E5%8A%A8%E6%93%8D%E4%BD%9C%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
let fishingHistory = ''; // 将用于保存钓鱼历史记录的变量放在自执行函数外面，处于全局作用域
let startTime = new Date(); // 记录脚本开始运行的时间


function recordFishInfo() {
    const resultModal = document.querySelector('.CommonModal-modal.is-center.ManualFishResultModal');
    if (resultModal) {
        const fishName = resultModal.querySelector('.fish-name')?.textContent.trim() || '未知鱼';
        const fishScore = resultModal.querySelector('.fish-score')?.textContent.trim() || '0';
        const fishAwardName = resultModal.querySelector('.name.text-over')?.textContent.trim() || '无';
        const fishAwardNum = resultModal.querySelector('.num')?.textContent.trim() || '0';
        let awardsText = '';
        awardsText += `${fishAwardName} × ${fishAwardNum}`;
        /*
        const awardElements = resultModal.querySelectorAll('.awards.award');
        let awardsText = '';
        console.log(awardElements.length);
        if (awardElements.length === 0) {
            awardsText = '无奖励名称';
        } else {
        awardElements.forEach((award, index) => {
            const awardName = award.querySelector('.name.text-over')?.textContent.trim() || '无奖励名称';
            console.log(awardName);
            const awardNum = award.querySelector('.num')?.textContent.trim() || '0';
            console.log(awardNum);
            awardsText += `${awardName} × ${awardNum}`;
            if (index < awardElements.length - 1) {
                awardsText += ', ';
            }
            console.log(awardsText);
        });
        };
        */

        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hour = now.getHours().toString().padStart(2, '0');
        const minute = now.getMinutes().toString().padStart(2, '0');
        const second = now.getSeconds().toString().padStart(2, '0');
        const formattedTime = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

        const record = `${formattedTime} : ${fishName} ${fishScore}斤 且 奖励为：${awardsText}\n`;
        fishingHistory += record;
        console.log(record);

    }
}

function printFishingHistory() {
    const now = new Date();
    const startYear = startTime.getFullYear();
    const startMonth = (startTime.getMonth() + 1).toString().padStart(2, '0');
    const startDay = startTime.getDate().toString().padStart(2, '0');
    const startHour = startTime.getHours().toString().padStart(2, '0');
    const startMinute = startTime.getMinutes().toString().padStart(2, '0');
    const startSecond = startTime.getSeconds().toString().padStart(2, '0');
    const startFormattedTime = `${startYear}-${startMonth}-${startDay} ${startHour}:${startMinute}:${startSecond}`;
    const nowYear = now.getFullYear();
    const nowMonth = (now.getMonth() + 1).toString().padStart(2, '0');
    const nowDay = now.getDate().toString().padStart(2, '0');
    const nowHour = now.getHours().toString().padStart(2, '0');
    const nowMinute = now.getMinutes().toString().padStart(2, '0');
    const nowSecond = now.getSeconds().toString().padStart(2, '0');
    const nowFormattedTime = `${nowYear}-${nowMonth}-${nowDay} ${nowHour}:${nowMinute}:${nowSecond}`;

    // 统计钓鱼的条数、总重量以及整理奖励信息 ,多个奖励信息暂未支持
    const records = fishingHistory.split('\n').filter(Boolean);
    let fishCount = 0;
    let totalWeight = 0;
    let allAwards = [];
    records.forEach(record => {
    //console.log(record);
    const parts = record.split(' : ')[1].split(' 且 ');
    const weightStr = parts[0].split('斤')[0];
    //console.log('当前鱼的重量字符串：', weightStr);
    // 使用正则表达式提取数字部分，假设重量字符串里只有一处数字内容符合格式要求（比如 2、2.5 等）
    const weightMatch = weightStr.match(/\d+(?:\.\d+)?/);
    const weight = weightMatch? parseFloat(weightMatch[0]) : 0;
    //console.log('当前鱼的重量数值：', weight);
    totalWeight += weight;
    fishCount++;

    const awards = parts[1].split('：')[1].split(', ').map(award => award.trim());
    allAwards.push(...awards);
});
    const uniqueAwards = [...new Set(allAwards)];

    console.log(`从 ${startFormattedTime} 到 ${nowFormattedTime}`);
    console.log(`钓了 ${fishCount} 条鱼，${totalWeight} 斤，获得如下奖励:`);
    //uniqueAwards.forEach(award => console.log(award)); //输出所有奖励
    console.log(fishingHistory);
}

(function() {
    'use strict';
//    let fishingHistory = ''; // 用于保存钓鱼历史记录的变量，初始化为空字符串
    const interval = 3000;

    function isActivityTime() {
        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();

        // 判断是否在活动时间范围内（中午12:00到凌晨00:30每个准点开启半小时）
        return (hour >= 12 && hour < 24 && minute < 30) || (hour === 0 && minute < 30);
    }

    function simulateClick(element) {
        const clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        element.dispatchEvent(clickEvent);
    }

    function checkAndAct() {
        console.log(`每隔 ${interval/1000} 秒执行检测功能`);
        // 尝试查找并关闭提示弹窗
        const resultModal = document.querySelector('.CommonModal-modal.is-center.ManualFishResultModal');
        if (resultModal) {
            const closeBtn = resultModal.querySelector('div.btn');
            if (closeBtn) {
                simulateClick(closeBtn);
                recordFishInfo();
            }
        }

        const starterDiv = document.querySelector('.Starter');
        if (starterDiv) {
            const majorBtn = starterDiv.querySelector('.majorBtn');
            if (majorBtn) {
                const status = majorBtn.querySelector('.status');
                if (majorBtn.classList.contains('active')) {
                    const openFishingButton = majorBtn.querySelector('div.info > div.tips > p.tips.minor'); //普通钓鱼
                    const autoFishingButton = majorBtn.querySelector('div.info > div.tips.major'); //每小时自动钓鱼的形象
                    const now = new Date();
                    const year = now.getFullYear();
                    const month = (now.getMonth() + 1).toString().padStart(2, '0');
                    const day = now.getDate().toString().padStart(2, '0');
                    const hour = now.getHours().toString().padStart(2, '0');
                    const minute = now.getMinutes().toString().padStart(2, '0');
                    const second = now.getSeconds().toString().padStart(2, '0');
                    const formattedTime = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
                    if (autoFishingButton && autoFishingButton.textContent.trim() === '开始钓鱼'){
                        if (isActivityTime()) {
                            console.log(`在大赛时间段内，目前时间为：${formattedTime}`);
                            console.log('点击抛竿 (自动钓鱼)');
                            printFishingHistory();
                            simulateClick(autoFishingButton);
                        }
                    }
                    if (openFishingButton && openFishingButton.textContent.trim() === '开启钓鱼') {
                        if (isActivityTime()) {
                            console.log(`在大赛时间段内，目前时间为：${formattedTime}`);
                            console.log('点击抛竿 (普通钓鱼)');
                            printFishingHistory();
                            simulateClick(openFishingButton);
                        }else{
                            //console.log(`不在大赛时间段内，目前时间为：${formattedTime}`);
                        }
                    }
                } else if (majorBtn.classList.contains('finish')) {
                    const finishButton = majorBtn.querySelector('div.info > div.tips > p.tips.major');
                    if (finishButton && finishButton.textContent.trim() === '收竿') {
                        console.log('点击收竿');
                        simulateClick(finishButton);
                    }
                }
            }
        }
    }

    // 使用setInterval设置每隔3000毫秒（即3秒，你可以根据实际需求调整时间间隔）执行一次checkAndAct函数
    setInterval(checkAndAct, interval);

})();