// ==UserScript==
// @name         国家智慧教育公共服务平台 学习视频自动联播
// @namespace    https://viayoo.com/
// @version      1.2
// @description  学习视频自动联播
// @author       丸子
// @run-at       document-end
// @match        *://*.smartedu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525304/%E5%9B%BD%E5%AE%B6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%85%AC%E5%85%B1%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0%20%E5%AD%A6%E4%B9%A0%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E8%81%94%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/525304/%E5%9B%BD%E5%AE%B6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%85%AC%E5%85%B1%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0%20%E5%AD%A6%E4%B9%A0%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E8%81%94%E6%92%AD.meta.js
// ==/UserScript==

function checkPopupAndClick() {
    setInterval(() => {
        let popupButton = document.querySelector(".layui-layer-btn0"); // 选择弹窗确认按钮

        if (popupButton) {
            popupButton.click(); // 自动点击确认按钮
            console.log("检测到弹窗，已点击确认按钮");
        }
    }, 30000); // 每秒检测一次
}

// 启动弹窗检测
checkPopupAndClick();
