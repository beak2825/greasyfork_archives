// ==UserScript==
// @name         跳过草榴viidii等待时间
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Bypass viidii wait time
// @author       You
// @match        *://www.viidii.info/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26885/%E8%B7%B3%E8%BF%87%E8%8D%89%E6%A6%B4viidii%E7%AD%89%E5%BE%85%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/26885/%E8%B7%B3%E8%BF%87%E8%8D%89%E6%A6%B4viidii%E7%AD%89%E5%BE%85%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

var timer = setInterval(waitfunction, 0);