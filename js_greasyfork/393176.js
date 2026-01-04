// ==UserScript==
// @name         CalmAtCoder
// @name:ja      AtCoderタイマー削除
// @namespace    http://twitter.com/ageprocpp
// @version      0.1
// @description  Delete the timer on AtCoder in order to keep calm during the contests.
// @description:ja  AtCoderのタイマーをコンテスト中のみ消去し、最後の1秒まで集中を促します。
// @author       kaage
// @match        https://atcoder.jp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393176/CalmAtCoder.user.js
// @updateURL https://update.greasyfork.org/scripts/393176/CalmAtCoder.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var timer=document.getElementById("fixed-server-timer");
    var time=document.getElementsByClassName("fixtime-full");
    var startTime=time[0].innerHTML;
    var endTime=time[1].innerHTML;

    var year=new Date().getFullYear();
    var month=new Date().getMonth();
    var date=new Date().getDate();
    var hour=new Date().getHours();
    var minutes=new Date().getMinutes();
    var seconds=new Date().getSeconds();
    month++;
    var startYear=parseInt(startTime.substr(0,4));
    var endYear=parseInt(endTime.substr(0,4));
    var startMonth=parseInt(startTime.substr(5,2));
    var endMonth=parseInt(endTime.substr(5,2));
    var startDate=parseInt(startTime.substr(8,2));
    var endDate=parseInt(endTime.substr(8,2));
    var startHour=parseInt(startTime.substr(14,2));
    var endHour=parseInt(endTime.substr(14,2));
    var startMinute=parseInt(startTime.substr(17,2));
    var endMinute=parseInt(endTime.substr(17,2));
    var startSecond=0;
    var endSecond=0;
    var startTime_value=startSecond+startMinute*60+startHour*60*60+startDate*60*60*24+startMonth*60*60*24*40+startYear*60*60*24*40*12;
    var endTime_value=endSecond+endMinute*60+endHour*60*60+endDate*60*60*24+endMonth*60*60*24*40+endYear*60*60*24*40*12;
    var nowTime_value=seconds+minutes*60+hour*60*60+date*60*60*24+month*60*60*24*40+year*60*60*24*40*12;
    if(startTime_value<=nowTime_value&&nowTime_value<endTime_value){
        timer.parentNode.removeChild(timer);
    }
})();