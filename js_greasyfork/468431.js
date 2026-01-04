// ==UserScript==
// @name         自动关闭B站登录对话框
// @namespace    https://github.com/Misaka-Mikoto-Tech
// @version      0.3
// @description  B站在未登录状态下视频播放一分钟或者页面可见状态发生改变，就会弹出登录框，此脚本帮忙自动点击这个登录框的关闭按钮
// @author       Misaka-Mikoto-Tech
// @match        *://*.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468431/%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%ADB%E7%AB%99%E7%99%BB%E5%BD%95%E5%AF%B9%E8%AF%9D%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/468431/%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%ADB%E7%AB%99%E7%99%BB%E5%BD%95%E5%AF%B9%E8%AF%9D%E6%A1%86.meta.js
// ==/UserScript==

function clickCloseBtn(class_selector)
{
    document.querySelector(class_selector)?.click();
}

function removeElement(class_selector)
{
    let ele = document.querySelector(class_selector);
    ele?.parentNode.removeChild(ele);
}

(function() {
    'use strict';

    window._clearLoginDialog = setInterval(function(){
    if(!!window.player) window.player.pause = function(){};
    if(!!window.UserStatus) window.UserStatus.userInfo.isLogin = true;

    // 登录对话框的关闭按钮
    clickCloseBtn(".bili-mini-close-icon");
    // 主页右下角的登录div的关闭按钮
    clickCloseBtn(".login-tip .close");
    // 直播页面的登录面板
    clickCloseBtn(".close-btn.icon-font.icon-group-dynamic");
    // 播放面板左下角的试看栏
    clickCloseBtn(".bpx-player-toast-cancel");
    removeElement(".login-limit-mask");
    // TODO hide "login-panel-popover"
}, 100);
})();