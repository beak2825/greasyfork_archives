// ==UserScript==

// @name         REWARDS GET

// @namespace    http://tampermonkey.net/

// @version      0.1.3

// @description  微软积分页自动点击
// @author       Dongge

// @match        https://rewards.bing.com/*

// @license MIT

// @icon         https://az15297.vo.msecnd.net/images/rewards.png

// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/507888/REWARDS%20GET.user.js
// @updateURL https://update.greasyfork.org/scripts/507888/REWARDS%20GET.meta.js
// ==/UserScript==



(function() {

    'use strict';

      clickcards();//进去就得执行一回

    // Your code here...
    // 调用函数以设置定时任务
    schedule12TenTask();


})();

function schedule12TenTask() {
    const now = new Date();
    const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 10, 0);

    // 如果当前时间已经超过今天的中午十二点十分，则设置到明天的中午十二点十分
    if (now >= targetTime) {
        targetTime.setDate(targetTime.getDate() + 1);
    }

    // 计算当前时间到目标时间的毫秒数
    const delay = targetTime - now;

    // 使用setTimeout设置定时器
    setTimeout(function() {
        console.log('现在是中午十二点十分，执行任务！');
        // 在这里放置你想要执行的代码
        clickcards();
    }, delay);
}

function clickcards(){
    const elements = document.querySelectorAll('.ds-card-sec.ng-scope');

    let currentIndex = 0; // 初始化索引



    // 检查是否找到了元素

    if (elements.length > 0) {

        // 设置第一次点击的延迟

        setTimeout(() => {

            const clickElements = () => {

                if (currentIndex < elements.length) {

                    elements[currentIndex].click();

                    console.log(`元素 ${currentIndex + 1} 被自动点击`);

                    currentIndex++; // 更新索引

                } else {

                    currentIndex = 0; // 如果所有元素都被点击过，重置索引

                }

                // 设置下一次点击的延迟

                if (currentIndex < elements.length) {

                    setTimeout(clickElements, 10000); // 10000毫秒 = 10秒

                }

            };

            clickElements(); // 开始点击元素

        }, 10000); // 10000毫秒 = 10秒

    } else {

        console.log('没有找到匹配的元素');

    }
}

