// ==UserScript==
// @author            zijdn
// @name bilibili自动宽屏+隐藏弹幕
// @description bilibili自动宽屏+隐藏弹幕，自用
// @match https://www.bilibili.com/video/*
// @version 0.1
// @connect-src       www.bilibili.com            
// @namespace https://greasyfork.org/users/234351
// @downloadURL https://update.greasyfork.org/scripts/375832/bilibili%E8%87%AA%E5%8A%A8%E5%AE%BD%E5%B1%8F%2B%E9%9A%90%E8%97%8F%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/375832/bilibili%E8%87%AA%E5%8A%A8%E5%AE%BD%E5%B1%8F%2B%E9%9A%90%E8%97%8F%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==


setTimeout(function () {
    $('.bilibili-player-video-btn-widescreen').click();
    document.getElementsByClassName("bui-checkbox")[0].click();
}, 800);
