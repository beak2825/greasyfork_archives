// ==UserScript==
// @name         雷电刷新
// @namespace    qxj
// @version      2024-07-34
// @description  截屏

// @license MIT
// @author       brady
// @match        http://10.194.17.234/
// @icon      	  https://images.cnblogs.com/cnblogs_com/brady-wang/2377300/o_240205044944_WechatIMG230.jpg
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @downloadURL https://update.greasyfork.org/scripts/502248/%E9%9B%B7%E7%94%B5%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/502248/%E9%9B%B7%E7%94%B5%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

// 每隔几分钟下载一次
var time_every = 1

function getCurrentFormattedDate() {
    const now = new Date();
    const year = now.getFullYear(); // 获取完整的年份(4位,1970-????)
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份是从0开始的，所以要+1
    const day = String(now.getDate()).padStart(2, '0'); // 获取日
    const hours = String(now.getHours()).padStart(2, '0'); // 获取小时
    const minutes = String(now.getMinutes()).padStart(2, '0'); // 获取分钟

    // 使用模板字符串来格式化日期和时间
    return `${year}年${month}月${day}日 ${hours}时${minutes}分`;
}
// 获取当前时间
function getCurrentTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份是从0开始的
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// 获取当前时间前一小时的时间
function getTimeFifteenMinutesAgo() {
    const now = new Date();
    now.setMinutes(now.getMinutes() - 5);
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份是从0开始的
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// 设置input的值
function setInputValues() {
    const input1 = document.querySelector("#app > div.bottom > div > div.menu-product > div.radar-light.tip-panel > div > div:nth-child(1) > div > input");
    const input2 = document.querySelector("#app > div.bottom > div > div.menu-product > div.radar-light.tip-panel > div > div:nth-child(2) > div > input");

    if (input1 && input2) {
        input1.value = getTimeFifteenMinutesAgo();
        input2.value = getCurrentTime();
        document.querySelector("#app > div.bottom > div > div.menu-product > div.radar-light.tip-panel > div > div:nth-child(1) > div > input").dispatchEvent(new Event('input'));
        document.querySelector("#app > div.bottom > div > div.menu-product > div.radar-light.tip-panel > div > div:nth-child(2) > div > input").dispatchEvent(new Event('input'));
    }
}

function rader()
{
        // 调用函数
    setInputValues();
    console.log("每分钟刷新雷电");
    var leidian =document.querySelector("#app > div.bottom > div > div.menu-product > div.radar-light.tip-panel > div > div:nth-child(3)");
    leidian.click();
}

(function() {
    'use strict';

    setInterval(rader, time_every*60 * 1000);
})();