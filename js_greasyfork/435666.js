// ==UserScript==
// @name         显示 12306 车票 搜索/筛选 区域
// @namespace    ShowMe12306TicketHelper-11273
// @version      1.1
// @description  显示被隐藏的12306订票帮手【基于https://greasyfork.org/zh-CN/scripts/420233-显示被隐藏的-12306-订票帮手】改
// @author       11273
// @match        *://kyfw.12306.cn/otn/leftTicket/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435666/%E6%98%BE%E7%A4%BA%2012306%20%E8%BD%A6%E7%A5%A8%20%E6%90%9C%E7%B4%A2%E7%AD%9B%E9%80%89%20%E5%8C%BA%E5%9F%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/435666/%E6%98%BE%E7%A4%BA%2012306%20%E8%BD%A6%E7%A5%A8%20%E6%90%9C%E7%B4%A2%E7%AD%9B%E9%80%89%20%E5%8C%BA%E5%9F%9F.meta.js
// ==/UserScript==

var drawer = document.getElementById ("sear-sel-bd");
var drawerHeight = 204;
drawer.style.height = drawerHeight + 'px';
var section = document.getElementById ("sear-sel-bd").getElementsByClassName("section ");
for(var i=0;i<section.length;i++){
   section[i].style.display = ''
}