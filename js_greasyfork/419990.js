// ==UserScript==
// @name         获取本周周报时间
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  try to take over the world!
// @author       You
// @match        *://i.zuoyebang.cc/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419990/%E8%8E%B7%E5%8F%96%E6%9C%AC%E5%91%A8%E5%91%A8%E6%8A%A5%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/419990/%E8%8E%B7%E5%8F%96%E6%9C%AC%E5%91%A8%E5%91%A8%E6%8A%A5%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function week(callback) {
        // 按周日为一周的最后一天计算
        var date = new Date();
        // 今天是这周的第几天
        var today = date.getDay();
        //上周日距离今天的天数（负数表示）
        var stepSunDay = -today + 1;
        // 如果今天是周日
        if (today == 0) {
            stepSunDay = -7;
        };
        // 周一距离今天的天数（负数表示）
        var stepMonday = 7 - today;
        var time = date.getTime();
        var monday = new Date(time + stepSunDay * 24 * 3600 * 1000);
        var sunday = new Date(time + stepMonday * 24 * 3600 * 1000);
        // 本周一的日期 （起始日期）
        var startDate = transferDate(monday); // 日期变换 2018-11-10
        // 本周日的日期 （结束日期）
        var endDate = transferDate(sunday); // 日期变换  2018-11-10
        return callback(startDate, endDate) && callback;
    };

    function transferDate(date) {
        // 年
        var year = date.getFullYear();
        // 月
        var month = date.getMonth() + 1;
        // 日
        var day = date.getDate();

        if (month >= 1 && month <= 9) {

            month = "0" + month;
        }
        if (day >= 0 && day <= 9) {

            day = "0" + day;
        }

        var dateString = year + '.' + month + '.' + day;

        return dateString;
    };

    week((s, e) => {
        let val = s + "-" + e + " 周报"
        let inputEle = document.createElement('input')
        document.body.appendChild(inputEle)
        inputEle.setAttribute('value', val)
        inputEle.setAttribute('readonly', 'readonly')
        inputEle.select()
        console.log(document.execCommand('copy'))
        document.body.removeChild(inputEle);
        if (window.location.href.indexOf('weeklynew/create') != -1) {
            alert(val)
        }
    });

})();