// ==UserScript==
// @name         Haust-Wlan
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Haust-Wlan-Auto
// @author       You
// @match        http://10.10.10.111/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460920/Haust-Wlan.user.js
// @updateURL https://update.greasyfork.org/scripts/460920/Haust-Wlan.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload=function() {
        var all = document.getElementsByClassName("edit_lobo_cell");
        var login = all[0], id = all[1], password = all[2], type = all[3];
        id.value = '201404060000'; // 学号
        password.value = '000000'; // 密码
        type.selectedIndex = 2; // 移动:2; 联通:3; 电信:4
        login.click();
    }
})();