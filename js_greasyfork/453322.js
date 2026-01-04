// ==UserScript==
// @name         B站直播间自动清除老旧弹幕
// @namespace    http://shenhaisu.cc/
// @version      1.1
// @description  自动删除遗留弹幕元素,可以减少DOM元素数量,提高部分性能
// @author       ShenHaiSu
// @match        https://live.bilibili.com/*
// @grant        unsafeWindow
// @run-at       document-end
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/453322/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E8%87%AA%E5%8A%A8%E6%B8%85%E9%99%A4%E8%80%81%E6%97%A7%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/453322/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E8%87%AA%E5%8A%A8%E6%B8%85%E9%99%A4%E8%80%81%E6%97%A7%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==


(async function () {
    // 配置编辑处
    let pluginConfig = {
        // 元素留存量 默认30
        keepCount:30,
        // 检测延迟 默认2000
        checkDelay:2000
    };
    let targetNode = document.querySelector("#chat-items");
    setInterval(() => {
        while (targetNode.childElementCount >= pluginConfig.keepCount){
            targetNode.children[0].remove();
        }
    }, pluginConfig.checkDelay);
})()