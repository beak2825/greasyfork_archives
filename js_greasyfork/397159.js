// ==UserScript==
// @name         《小花仙》页游：右键可以放大缩小
// @name:en      Allow Web Game Flower Fairy (by Taomee) to Zoom In RMB Menu
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  依旧要通过右键菜单设置的麦克风下拉框右击来显示放大缩小的选项。 
// @description:en You still need to RMB-Settings-Microphone Tab-Open the dropdown-RMB the dropdown, in order to display the zoom options!
// @author       别问我是谁请叫我雷锋
// @license      BSD-3-Clause
// @match        http://hua.61.com/play.shtml
// @match        http://hua.61.com
// @match        http://hua.61.com/huaplay.html
// @contributionURL       http://
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397159/%E3%80%8A%E5%B0%8F%E8%8A%B1%E4%BB%99%E3%80%8B%E9%A1%B5%E6%B8%B8%EF%BC%9A%E5%8F%B3%E9%94%AE%E5%8F%AF%E4%BB%A5%E6%94%BE%E5%A4%A7%E7%BC%A9%E5%B0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/397159/%E3%80%8A%E5%B0%8F%E8%8A%B1%E4%BB%99%E3%80%8B%E9%A1%B5%E6%B8%B8%EF%BC%9A%E5%8F%B3%E9%94%AE%E5%8F%AF%E4%BB%A5%E6%94%BE%E5%A4%A7%E7%BC%A9%E5%B0%8F.meta.js
// ==/UserScript==


'use strict';
window.onload = function () {
    if (location.href == "http://hua.61.com/" && new Date().getHour() < 6) {
        document.querySelector(".flash_content").innerHTML = '<embed width="100%" height="100%" name="plugin" id="plugin" src="http://hua.61.com/Close.swf?' + new Date().getTime() + '" type="application/x-shockwave-flash">';
    } else {
        document.querySelector(".flash_content").innerHTML = '<embed width="100%" height="100%" name="plugin" id="plugin" src="http://hua.61.com/Client.swf?' + new Date().getTime() + '" type="application/x-shockwave-flash">';
    }
    return;
    // Your code here...
};