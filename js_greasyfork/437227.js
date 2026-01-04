// ==UserScript==
// @name         显示12306到达车站
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       You
// @match        https://kyfw.12306.cn/otn/leftTicket/*
// @grant        none
// @description 显示12306网站的到达车站
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437227/%E6%98%BE%E7%A4%BA12306%E5%88%B0%E8%BE%BE%E8%BD%A6%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/437227/%E6%98%BE%E7%A4%BA12306%E5%88%B0%E8%BE%BE%E8%BD%A6%E7%AB%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.getElementById("sear-sel-bd").style.height="36px";
    var arrival = document.getElementsByClassName("section clearfix")[2]
    arrival.setAttribute("style", "display: true")
})();