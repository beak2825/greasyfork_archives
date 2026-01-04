// ==UserScript==
// @name         雨课堂随堂练习通知助手
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  检测 *.yuketang.cn/* 页面中是否存在 class="time-box"，且只提醒未完成的 timing，slide__wrap 中的 img src 只提醒一次
// @author       Chengyu Fang
// @match        *.yuketang.cn/*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/511822/%E9%9B%A8%E8%AF%BE%E5%A0%82%E9%9A%8F%E5%A0%82%E7%BB%83%E4%B9%A0%E9%80%9A%E7%9F%A5%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/511822/%E9%9B%A8%E8%AF%BE%E5%A0%82%E9%9A%8F%E5%A0%82%E7%BB%83%E4%B9%A0%E9%80%9A%E7%9F%A5%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let notifiedImages = []; // 用于存储已经提醒过的 img src

    // 检测页面中是否存在 class="time-box" 的元素
    function checkForTimeBox() {
        const timeBoxElement = document.querySelector('.time-box');
        if (timeBoxElement && window.getComputedStyle(timeBoxElement).display !== 'none') { // 检查 time-box 是否可见
            const timingElement = timeBoxElement.querySelector('.timing');
            if (timingElement && timingElement.textContent.trim() !== '已完成') { // 检查 timing 是否未完成
                checkForSlideWrapImages(); // 检查 slide__wrap 中的图片
            }
        }
    }

    // 检查 class="slide__wrap box-center" 中的 img 元素，并且只提醒一次
    function checkForSlideWrapImages() {
        const slideWraps = document.querySelectorAll('.slide__wrap.box-center');
        slideWraps.forEach(slideWrap => {
            const img = slideWrap.querySelector('img');
            if (img && img.src && !notifiedImages.includes(img.src)) {
                notifiedImages.push(img.src); // 记录已经提醒的图片 src
                sendNotification(img.src); // 发送通知
            }
        });
    }

    // 发送通知
    function sendNotification(imageSrc) {
        if (Notification.permission === "granted") {
            new Notification("RainClassroom Exercises Notifier", {
                body: `有新的课堂练习未完成，请返回雨课堂完成习题。`,
            });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification("RainClassroom Exercises Notifier", {
                        body: `有新的课堂练习未完成，请返回雨课堂完成习题。`,
                    });
                }
            });
        }
    }

    // 请求浏览器通知权限
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission();
    }

    // 定时轮询，页面即使不在前台也能运行
    setInterval(checkForTimeBox, 2000); // 每 2 秒检测一次

})();