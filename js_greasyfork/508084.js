// ==UserScript==
// @name:zh-TW 求生意志vk直播收箱
// @name:zh-CN 求生意志vk直播收箱
// @name:ja    生き残る意志 vk生放送ボックス
// @name         求生意志vk直播收箱
// @namespace    http://tampermonkey.net/
// @version      2024-09-24
// @description  vk直播实现自动点点击箱子
// @description:en vk直播实现自动点点击箱子
// @description:ja vk直播实现自动点点击箱子
// @description:zh-tw vk直播实现自动点点击箱子
// @author       体制内的关门弟子
// @match        https://live.vkplay.ru/*
// @icon         https://images.live.vkplay.ru/badge/7447a8b2-78ef-41a1-b0ce-d4ef23ca0f39/icon/size/small?change_time=1670416365
// @grant        namespace
// @license      kabushiji
// @downloadURL https://update.greasyfork.org/scripts/508084/%E6%B1%82%E7%94%9F%E6%84%8F%E5%BF%97vk%E7%9B%B4%E6%92%AD%E6%94%B6%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/508084/%E6%B1%82%E7%94%9F%E6%84%8F%E5%BF%97vk%E7%9B%B4%E6%92%AD%E6%94%B6%E7%AE%B1.meta.js
// ==/UserScript==
// 定义点击函数
var clickButton = function () {
    // 每次点击前都重新获取按钮元素
    var button = document.querySelector(".CircularProgressBar_root_NKocs.CircularProgressBar_withPointer_jlEcK");
    var hezhi = document.querySelector(".DropBox_root_chtbE");

    // 判断按钮是否存在
    if (button) {
        console.log("进度条存在");
    } else if (hezhi) {
        hezhi.click();
        console.log("盒子按钮已点击");
        button.click();
    } else {
        console.log("元素不存在");
    }
};

// 设置定时器，每隔5秒执行一次
setInterval(clickButton, 5000);

// 信息弹窗
alert('求生意志和平交流群群主就是个小心眼，随便发一句话就直接禁言');