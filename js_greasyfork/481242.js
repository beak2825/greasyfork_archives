// ==UserScript==
// @name         B站视频结束自动关闭标签页
// @version      0.2
// @description  Automatically close the current tab when a Bilibili video ends.
// @author       Ts8zs chat with bing
// @liscense GPL
// @match        https://www.bilibili.com/video/*
// @grant        none
// @namespace https://greasyfork.org/users/207890
// @downloadURL https://update.greasyfork.org/scripts/481242/B%E7%AB%99%E8%A7%86%E9%A2%91%E7%BB%93%E6%9D%9F%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E6%A0%87%E7%AD%BE%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/481242/B%E7%AB%99%E8%A7%86%E9%A2%91%E7%BB%93%E6%9D%9F%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E6%A0%87%E7%AD%BE%E9%A1%B5.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var video = document.querySelector('video');
    video.addEventListener('ended', function() {
        if(!document.querySelector(".next-button .switch-button.on")){
                  window.close();
        }
    });
})();