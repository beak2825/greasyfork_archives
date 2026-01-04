// ==UserScript==
// @name         FCFS ATC
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  FIFA WWC 2023 FCFS ATC
// @author       You
// @match        https://fcfs-aus.fwwc23.tickets.fifa.com/secured/selection/*
// @match        https://fcfs-aus.fwwc23.tickets.fifa.com/cart/reservation/*

// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472833/FCFS%20ATC.user.js
// @updateURL https://update.greasyfork.org/scripts/472833/FCFS%20ATC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var targetURL = 'https://fcfs-aus.fwwc23.tickets.fifa.com/cart/reservation/0';

    if (window.location.href.startsWith(targetURL)) {
        // 如果当前页面的URL以目标前缀开头，则弹出提醒窗口
        alert('购物车添加成功！');
    } else {
        try {
            var select = document.getElementById("eventFormData[0].quantity"); // 获取选择元素
            select.value = "2"; // 设置选择的值为2

            // 触发更改事件（这取决于网站的具体实现）
            var event = new Event('change', {'bubbles': true});
            select.dispatchEvent(event);

            // 2秒后执行添加到购物车按钮的点击操作
            setTimeout(function() {
                var addToCartButton = document.getElementById("book");
                if (addToCartButton) {
                    addToCartButton.click();
                } else {
                    throw new Error("无法找到添加到购物车按钮");
                }
            }, 1000);

        } catch (error) {
            // 如果发生错误，10秒后刷新页面
            console.error('出现错误，将在10秒后刷新页面。', error);
            setTimeout(function() {
                location.reload();
            }, 10000);
        }
    }
})();