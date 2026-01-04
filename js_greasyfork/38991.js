// ==UserScript==
// @name         抢券
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Shinelin
// @match        https://pb.jd.com/activity/2018/bk/html/index.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38991/%E6%8A%A2%E5%88%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/38991/%E6%8A%A2%E5%88%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var IntervalID = 0;
    var ExecTask = function(hh, mm, ss, callback) {
        var now = new Date();
        var diff = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds() - hh * 3600 - mm * 60 - ss;
        if (diff >= 0 && diff < 5) {
            if(IntervalID != 0) {
                clearInterval(IntervalID);
            }
            if(callback != null) {
                callback();
            }
        }
    };

    // 定时器
    var RefreshTime = function() {
       ExecTask(21, 59, 59, function() {
             getTicket();
       });
    };
    IntervalID = setInterval(RefreshTime, 100);

    // var entranceId = "iCRUDvbPjRdrZHI";
    var getTicket = function() {
        //window.location.href = "https://pb.jd.com/activity/2018/bk/html/index.html?entranceId=" + entranceId;
        window.location.reload();
        setTimeout(function(){
           getTicket();
        }, 800);
    };

})();