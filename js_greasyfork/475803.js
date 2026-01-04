// ==UserScript==
// @name         正在学考试,延长考试离开时间
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  延长考试离开时间
// @author       You
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @match        https://www.learnin.com.cn/*
// @icon         https://img-blog.csdnimg.cn/20181221195058594.gif
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475803/%E6%AD%A3%E5%9C%A8%E5%AD%A6%E8%80%83%E8%AF%95%2C%E5%BB%B6%E9%95%BF%E8%80%83%E8%AF%95%E7%A6%BB%E5%BC%80%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/475803/%E6%AD%A3%E5%9C%A8%E5%AD%A6%E8%80%83%E8%AF%95%2C%E5%BB%B6%E9%95%BF%E8%80%83%E8%AF%95%E7%A6%BB%E5%BC%80%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.setInterval(function() {
        sessionStorage.setItem('maxLeaveNum',5002);
        sessionStorage.setItem('timeoutNum',1805);
        sessionStorage.setItem('examIsCheck',false);
        sessionStorage.setItem('examTurnOver',false);
        sessionStorage.setItem('examIsMonitor',false);

        localStorage.setItem('maxLeaveNum',5002);
        localStorage.setItem('timeoutNum',1805);
        localStorage.setItem('examIsCheck',false);
        localStorage.setItem('examTurnOver',false);
        localStorage.setItem('examIsMonitor',false);
    }, 1000);

})();