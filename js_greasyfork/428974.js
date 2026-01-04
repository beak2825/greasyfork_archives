// ==UserScript==
// @name         哔哩哔哩播放自动宽屏+直播签到
// @namespace    http://www.wehaox.com/
// @version      0.2
// @description  哔哩哔哩播放自动宽屏加直播签到，简短代码实现
// @author       You
// @match        https://www.bilibili.com/video/*
// @match        https://live.bilibili.com/*
// @grant        none
// @connect		 bilibili.com
// @require    http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/428974/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%92%AD%E6%94%BE%E8%87%AA%E5%8A%A8%E5%AE%BD%E5%B1%8F%2B%E7%9B%B4%E6%92%AD%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/428974/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%92%AD%E6%94%BE%E8%87%AA%E5%8A%A8%E5%AE%BD%E5%B1%8F%2B%E7%9B%B4%E6%92%AD%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==
$(function (){
     setTimeout(function() {
          $(".bilibili-player-iconfont-widescreen-off").click();
          $(".checkin-btn").click();
       }, 3000);
})