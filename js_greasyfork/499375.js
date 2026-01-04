// ==UserScript==
// @name         阿里云社区签到
// @namespace    http://tampermonkey.net/
// @version      2026.01.04
// @description  一键批量打开指定网页
// @author       mattpower
// @match        https://developer.aliyun.com/?*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499375/%E9%98%BF%E9%87%8C%E4%BA%91%E7%A4%BE%E5%8C%BA%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/499375/%E9%98%BF%E9%87%8C%E4%BA%91%E7%A4%BE%E5%8C%BA%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==
// 04.01积分过期, 有额外提醒

(function() {
    'use strict';

    // 定义要打开的网页列表
    var websites = [
        "https://developer.aliyun.com/ecs",
        "https://developer.aliyun.com/cloudnative",
        "https://developer.aliyun.com/database",
        "https://developer.aliyun.com/storage",
        "https://developer.aliyun.com/bigdata",
        "https://developer.aliyun.com/modelstudio"
        // 在这里添加更多的网页链接
    ];

        // 定义打开网页的间隔时间
    var openInterval = 5000; // 3秒
    var closeDelay = 3000; // 5秒

    // 创建一个按钮元素
    var openButton = document.createElement("button");
    openButton.innerHTML = "批量签到";
    openButton.style.position = "fixed";
    openButton.style.bottom = "20px";
    openButton.style.right = "50px";
    openButton.style.zIndex = "9999";

    var openButton2 = document.createElement("button");
    openButton2.innerHTML = "阿里云培训中心";
    openButton2.style.position = "fixed";
    openButton2.style.bottom = "20px";
    openButton2.style.right = "150px"; // 调整右侧距离以放置在打开指定网页按钮的左侧
    openButton2.style.zIndex = "9999";

    // 将按钮添加到页面上
    document.body.appendChild(openButton);
    document.body.appendChild(openButton2);

    // 为按钮添加点击事件
    openButton.addEventListener("click", function() {
        // 以特定间隔打开所有网页
        openWebsitesWithInterval(websites, openInterval);
    });
    openButton2.addEventListener("click", function() {
        // 打开阿里云培训中心
        window.open('https://edu.aliyun.com/', "_blank");
    });

    // 以特定间隔打开网页的函数
    function openWebsitesWithInterval(websites, interval) {
        var currentIndex = 0;
        var openTimer = setInterval(function() {
            if (currentIndex < websites.length) {
                var currentWindow = window.open(websites[currentIndex], "_blank");
                // 捕获当前的 currentIndex 值
                (function(checkIndex) {
                    currentWindow.addEventListener('load', function() {
                        setTimeout(function() {
                            checkAndClose(currentWindow, checkIndex, websites.length);
                        }, 3000);
                    });
                })(currentIndex);
            } else {
                clearInterval(openTimer);
            }
            currentIndex++;}, interval);
    }

    // 检查并关闭当前网页的函数
    function checkAndClose(currentWindow, index, length) {
        var checkInterval = setInterval(function() {
            var element1 = currentWindow.document.querySelector('.unlogin.user-sign-day-box.active');
            var element2 = currentWindow.document.querySelector('.user-sign-day-box.signin');
            var element3 = currentWindow.document.querySelector('.user-sign-day-box.active');
            if (element1) {
                element1.click();
            } else if (element2 || element3) { // 如果已经尝试过至少一次，且未找到元素，则关闭窗口
                clearInterval(checkInterval);
                currentWindow.close();
                if(index === length - 1){
                    window.open('https://developer.aliyun.com', "_blank");
                    window.open('https://developer.aliyun.com/score?', "_blank");
                }
            }
        }, 3000); // 每隔3秒检查一次
    }
})();