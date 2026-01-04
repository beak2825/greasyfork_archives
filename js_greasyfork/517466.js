// ==UserScript==
// @name         厦门律协课程自动点击确认
// @namespace    http://tampermonkey.net/
// @version      2024-10-21
// @description  视频自动点击确认
// @author       CK
// @match        https://msrcld.xm.fj.12348.gov.cn/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=12348.gov.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517466/%E5%8E%A6%E9%97%A8%E5%BE%8B%E5%8D%8F%E8%AF%BE%E7%A8%8B%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%A1%AE%E8%AE%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/517466/%E5%8E%A6%E9%97%A8%E5%BE%8B%E5%8D%8F%E8%AF%BE%E7%A8%8B%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%A1%AE%E8%AE%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //const targetElement = document.querySelector("#app > div > div.trainDetail-content > div.warps.radiusbox > div > h2:nth-child(1)");
    // 创建一个函数来模拟点击操作
    function clickElement() {
        console.log("定时器触发");
        // 获取所有按钮元素
        const buttons = document.querySelectorAll('button');
        // 遍历按钮元素
        for (let i = 0; i < buttons.length; i++) {
            // 检查按钮的文本内容是否包含字符串"确定"
            if (buttons[i].textContent.includes('确定')) {
                // 触发按钮的点击事件
                console.log('找到确认按钮了');
                buttons[i].click();
                break; // 如果已经找到并点击了符合条件的按钮，就跳出循环
            }
        }
    }
    // 设置定时器，每隔3000毫秒（3秒）执行一次clickElement函数
    const intervalId = setInterval(clickElement, 100);
    // Your code here...
})();