// ==UserScript==
// @name         Xior_Booking_Automation_BREDA_UPDATED_10.3_07182024
// @namespace    http://tampermonkey.net/
// @version      10.4
// @description  Check RAT_apartment_Breda booking on Xior
// @match        https://www.xior-booking.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495670/Xior_Booking_Automation_BREDA_UPDATED_103_07182024.user.js
// @updateURL https://update.greasyfork.org/scripts/495670/Xior_Booking_Automation_BREDA_UPDATED_103_07182024.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 每隔两秒自动刷新页面
    function refreshUntilCondition(condition, callback) {
        const interval = setInterval(() => {
            if (condition()) {
                clearInterval(interval);
                callback();
            } else {
                location.reload();
            }
        }, 2000); // 每隔两秒自动刷新
    }

    // 设置检索条件的功能
    function containsSubtitleElement() {
        return Array.from(document.querySelectorAll('h6.card-subtitle')).some(subtitle => {
            return subtitle.textContent.trim().toUpperCase().startsWith("RAT") || subtitle.textContent.trim().toUpperCase().startsWith("RAT");
        }) ; //设置检索关键词
    }

    // 等待页面加载完毕
    function waitForPageLoad(callback) {
        const observer = new MutationObserver((mutations, observer) => {
            if (document.readyState === 'complete') {
                observer.disconnect();
                callback();
            }
        });
        observer.observe(document, { childList: true, subtree: true });
    }

    // 弹出浏览器提示信息
    function sendNotification(message) {
        // 检查浏览器是否支持通知
        if (!("Notification" in window)) {
            console.log("This browser does not support desktop notification");
        }

        // 检查是否允许通知
        else if (Notification.permission === "granted") {
            // 允许的话发送通知
            new Notification(message);
        }

        // 不允许的话询问用户
        else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(function (permission) {
                // 用户允许的话发送通知
                if (permission === "granted") {
                    new Notification(message);
                }
            });
        }
    }

    // 主要功能
    function automateBooking() {
        // Step 1: 每隔一段时间刷新网页
        refreshUntilCondition(() => true, () => {
            // Step 2: 选择对应城市
            document.querySelector("#city > option:nth-child(3)").selected = true;
            const event = new Event('change', { bubbles: true });
            document.querySelector("#city").dispatchEvent(event);
            // Step 3: 等页面加载完
            waitForPageLoad(() => {
                // Step 4: 检索满足条件的项目
                refreshUntilCondition(containsSubtitleElement, () => {
                    // Step 5 弹出通知框
                    sendNotification("找到房子了啊啊啊啊啊啊啊啊啊啊啊啊啊快来啊啊啊啊啊啊啊");
                });
            });
        });
    }

    // 开始脚本
    automateBooking();

})();