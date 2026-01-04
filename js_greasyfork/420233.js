// ==UserScript==
// @name         显示被隐藏的 12306 订票帮手
// @namespace    ShowMe12306TicketHelper
// @version      1.3
// @description  显示被隐藏的12306订票帮手
// @author       maidmeow4
// @license GPL-3.0-or-later
// @match        *://kyfw.12306.cn/otn/leftTicket/*
// @downloadURL https://update.greasyfork.org/scripts/420233/%E6%98%BE%E7%A4%BA%E8%A2%AB%E9%9A%90%E8%97%8F%E7%9A%84%2012306%20%E8%AE%A2%E7%A5%A8%E5%B8%AE%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/420233/%E6%98%BE%E7%A4%BA%E8%A2%AB%E9%9A%90%E8%97%8F%E7%9A%84%2012306%20%E8%AE%A2%E7%A5%A8%E5%B8%AE%E6%89%8B.meta.js
// ==/UserScript==

var drawer = document.getElementById("sear-sel-bd");
var drawerHeight = 40;
drawer.style.height = drawerHeight + 'px';
console.log('Helper: Enlarged drawer to ' + drawerHeight + 'px!');

let collection = document.getElementsByClassName("section clearfix");
for (let i = 0; i < collection.length; i++) {
    collection[i].style.display = "";
}
