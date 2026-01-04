// ==UserScript==
// @name         b站增加1.1倍速
// @namespace    https://github.com/Penguin-Killer
// @version      0.3.0
// @description  将0.75倍速修改为1.1倍速
// @author       Penguin-Killer
// @match        *://*.bilibili.com/video/*
// @match        *://*.bilibili.com/list/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/494155/b%E7%AB%99%E5%A2%9E%E5%8A%A011%E5%80%8D%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/494155/b%E7%AB%99%E5%A2%9E%E5%8A%A011%E5%80%8D%E9%80%9F.meta.js
// ==/UserScript==

/*
***********************************************************
如果不想自动使用1.1倍速，可以将第30行 “element.click();” 注释掉
***********************************************************
*/

(function() {
    'use strict';

function checkAndModifyElement() {
    var element = document.querySelector('.bpx-player-ctrl-playbackrate-menu-item[data-value="0.75"]');
    if (element) {
        element.textContent = '1.1x';
        element.setAttribute('data-value', '1.1');
        console.log('1.1倍速修改成功！');
        // 触发点击事件
        element.click();
        return true; // 找到并修改元素，返回 true 以退出循环
    } else {
        console.log('未找到要修改的元素。');
        return false; // 未找到元素，返回 false 继续循环
    }
}

function startChecking() {
    let attempts = 0;
    const maxAttempts = 10;
    let intervalId = setInterval(function() {
        attempts++;
        if (checkAndModifyElement() || attempts >= maxAttempts) {
            clearInterval(intervalId); // 找到并修改元素或达到最大尝试次数后清除定时器
            if (attempts >= maxAttempts) {
                console.log('达到最大尝试次数，停止检测。');
            }
        }
    }, 5000); // 每隔5秒检测一次
}

startChecking();

})();
