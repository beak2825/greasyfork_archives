// ==UserScript==
// @name         geekhub自动签到
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  https://geekhub.com/自动签到
// @author       zz
// @match        *.geekhub.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404514/geekhub%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/404514/geekhub%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var nowDate = new Date();
    var geekhubAutologinFlag = JSON.parse(localStorage.getItem('geekhubAutologinFlag')) || {};
    var sessionDay = geekhubAutologinFlag.sessionDay;
    var sessionMonth = geekhubAutologinFlag.sessionMonth;
    console.log(geekhubAutologinFlag)

    if (nowDate.getDay() != sessionDay || nowDate.getMonth() != sessionMonth) {
        ajaxLogin();
    }

})();

function ajaxLogin() {
    $.ajax({
        url: '/checkins/start',
        type: 'post',
        dataType: 'json',
        data: {

        },
        beforeSend: function () {
            console.log("自动签到中，请稍后...");
        },
        complete: function (data) {
            console.log("签到完成");
            var sessionObj = new Object();
            sessionObj.sessionDay = new Date().getDay();
            sessionObj.sessionMonth = new Date().getMonth();
            console.log(JSON.stringify(sessionObj))
            localStorage.setItem('geekhubAutologinFlag', JSON.stringify(sessionObj));
        }
    });
}