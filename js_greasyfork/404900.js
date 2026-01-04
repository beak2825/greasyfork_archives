// ==UserScript==
// @name         吾爱破解 自动签到
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动签到
// @author       zz
// @match        https://www.52pojie.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404900/%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%20%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/404900/%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%20%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var nowDate = new Date();
    var pojie52AutologinFlag = JSON.parse(localStorage.getItem('pojie52AutologinFlag')) || {};
    var sessionDay = pojie52AutologinFlag.sessionDay;
    var sessionMonth = pojie52AutologinFlag.sessionMonth;
    console.log(pojie52AutologinFlag)

    if (nowDate.getDay() != sessionDay || nowDate.getMonth() != sessionMonth) {
        var sessionObj = new Object();
        sessionObj.sessionDay = new Date().getDay();
        sessionObj.sessionMonth = new Date().getMonth();
        console.log(JSON.stringify(sessionObj))
        localStorage.setItem('pojie52AutologinFlag', JSON.stringify(sessionObj));
        window.open('/home.php?mod=task&do=apply&id=2');
    }
})();