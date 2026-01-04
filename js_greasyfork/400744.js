// ==UserScript==
// @name         替换暂停时间
// @namespace    http://nsfocus.yunxuetang.cn/
// @version      0.1
// @description  替换暂停时间.
// @author       car10s
// @match        https://nsfocus.yunxuetang.cn/kng/course/package/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400744/%E6%9B%BF%E6%8D%A2%E6%9A%82%E5%81%9C%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/400744/%E6%9B%BF%E6%8D%A2%E6%9A%82%E5%81%9C%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.body.innerHTML = document.body.innerHTML.replace("phaseTrackIntervalTime=600", "phaseTrackIntervalTime=600000");
    window.phaseTrackIntervalTime = 600000;
    if (window.phaseTrackIntervalTime == 600000){
        console.log("替换成功");
    }
})();