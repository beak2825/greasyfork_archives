// ==UserScript==
// @name         自动签到
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  站点自动签到
// @author       7ommy
// @match        *://*.invites.fun/*
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=invites.fun
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485041/%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/485041/%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var button = document.querySelector("#content > div > div.container > div.sideNavContainer > nav > ul > li.item-forum-checkin.App-primaryControl > button");
    if (button && !button.disabled) {
        button.click();
//         // 创建悬浮框元素
//         var popup = document.createElement('div');
//         popup.id = "popup";
//         popup.style.fontSize = "20pt";
//         popup.style.position = "fixed";
//         popup.style.top = "50%";
//         popup.style.left = "50%";
//         popup.style.transform = "translate(-50%, -50%)";
//         popup.style.backgroundColor = "#7FB8F0";
//         popup.style.color = "#333";
//         popup.style.padding = "15px";
//         popup.style.borderRadius = "10px";
//         popup.style.display = "none";
//         document.body.appendChild(popup);

//         // 弹出悬浮框提示信息
//         popup.innerText = "签到成功";
//         popup.style.display = "block";

//         // 1秒后隐藏悬浮框
//         setTimeout(function() {
//             popup.style.display = "none";
//         }, 1000);
        console.log("签到成功");
    } else {
        console.log("今天已签到");
    }
})();