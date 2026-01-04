// ==UserScript==
// @name         Remove MPI Online Services Timeout
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove the timeout for MPI online services
// @author       NimaQu
// @license      MIT
// @match        *://onlineservices.mpi.mb.ca/*
// @icon         https://onlineservices.mpi.mb.ca/drivertesting/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472609/Remove%20MPI%20Online%20Services%20Timeout.user.js
// @updateURL https://update.greasyfork.org/scripts/472609/Remove%20MPI%20Online%20Services%20Timeout.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function checkAndModifyTimer() {
        console.log("checking")
        if (typeof timerSeconds !== 'undefined') {
            // 修改timerSeconds为 6 小时（真正的 timeout 时间）
            timerSeconds = 21000;
            console.log("timer has been modified.");
            // 停止轮询
            clearInterval(pollingInterval);
        }
    }

    // 每隔100毫秒检查一次 timerSeconds 的存在
    var pollingInterval = setInterval(checkAndModifyTimer, 100);
})();