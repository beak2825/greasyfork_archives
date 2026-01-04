// ==UserScript==
// @name         北京泊菲莱公司自动上下班打卡
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  根据时间执行不同的操作
// @author       Kaid Qiao
// @match        http://8.140.126.224/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480346/%E5%8C%97%E4%BA%AC%E6%B3%8A%E8%8F%B2%E8%8E%B1%E5%85%AC%E5%8F%B8%E8%87%AA%E5%8A%A8%E4%B8%8A%E4%B8%8B%E7%8F%AD%E6%89%93%E5%8D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/480346/%E5%8C%97%E4%BA%AC%E6%B3%8A%E8%8F%B2%E8%8E%B1%E5%85%AC%E5%8F%B8%E8%87%AA%E5%8A%A8%E4%B8%8A%E4%B8%8B%E7%8F%AD%E6%89%93%E5%8D%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('脚本加载完成'); // 输出开始运行信息

    // 等待5秒后再执行脚本
    setTimeout(function() {
        // 获取当前时间
        const currentTime = new Date();
        const currentHour = currentTime.getHours();
        const currentMinute = currentTime.getMinutes();

        console.log('当前时间：', currentHour, ':', currentMinute); // 输出当前时间

        // 判断是否在8:50到9:00之间
        if ((currentHour === 8 && currentMinute >= 50) || (currentHour === 9 && currentMinute <= 15)) {
            console.log('在8:50到9:00之间'); // 输出判断结果

            const punchInButton = document.getElementById('punch-in');
            if (punchInButton) {
                punchInButton.click();
                console.log('点击出庭'); // 输出判断结果
                setTimeout(() => {
                    const buttons = document.querySelectorAll('.ui-button.ui-corner-all.ui-widget');
                    if (buttons.length >= 2) {
                        buttons[1].click(); // 获取第二个匹配的元素并点击
                    }
                }, 1000);
            }
        }
        // 判断是否在18:00到19:00之间
        else if ((currentHour === 18 && currentMinute >= 1) || (currentHour === 19 && currentMinute <= 0)) {
            console.log('在18:00到19:00之间'); // 输出判断结果

            const punchOutButton = document.getElementById('punch-out');
            if (punchOutButton) {
                punchOutButton.click();
                setTimeout(() => {
                    const buttons = document.querySelectorAll('.ui-button.ui-corner-all.ui-widget');
                    if (buttons.length >= 2) {
                        buttons[1].click(); // 获取第二个匹配的元素并点击
                    }
                }, 1000);
            }
        }
        // 在其他时间段不进行任何操作
    }, 5000); // 延迟时间
})();
