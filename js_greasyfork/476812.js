// ==UserScript==
// @name         永硕E盘增强脚本
// @version      4.3
// @description  为所有用户的永硕E盘页面增强一点点……
// @author       VB6-MrYu & Cmd1152
// @license      Apache-2.0
// @match        http://*.ysepan.com/*
// @icon         http://ys168.com/favicon.ico
// @namespace    https://greasyfork.org/zh-CN/scripts/476812-%E6%B0%B8%E7%A1%95e%E7%9B%98%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC
// @supportURL   https://greasyfork.org/zh-CN/scripts/476812-%E6%B0%B8%E7%A1%95e%E7%9B%98%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC/feedback
// @downloadURL https://update.greasyfork.org/scripts/476812/%E6%B0%B8%E7%A1%95E%E7%9B%98%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/476812/%E6%B0%B8%E7%A1%95E%E7%9B%98%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

let a = document.createElement("style");
a.innerHTML = `#kjbt,#sylj{text-align: center;}#idzdy1,#buexit{display:none;}#buyh span{visibility:hidden;}`;
document.head.appendChild(a);