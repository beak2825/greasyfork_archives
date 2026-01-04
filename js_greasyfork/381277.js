// ==UserScript==
// @name         autoCheckIn&Out
// @namespace    http://tampermonkey.net/
// @version      0.8.4
// @icon         https://myoa.sjfood.us/favicon.ico
// @description  Auto check in and check out!
// @author       JunerLee
// @match        *://myoa.sjfood.us/Schedule/MySchedule
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381277/autoCheckInOut.user.js
// @updateURL https://update.greasyfork.org/scripts/381277/autoCheckInOut.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hour = 60*60*1000;

    const minute = 60*1000;

    const second = 1000;

    var frequency = Math.floor(Math.random()*5+1);

    window.setInterval(autoCheck,frequency*minute);

    function autoCheck() {
        if(isMealTime(8,15,45)||isMealTime(11,15,75)) {
            var now = new Date().getTime();
            if(isMealTime(8,15,45)){console.log(timestampToString(now) +' It\'s Breakfast time');}//could delete
            if(isMealTime(11,15,75)){console.log(timestampToString(now) +' It\'s Lunch time');}//could delete
            var btnCheckIn = $("#btnCheckIn");
            var btnCheckOut = $("#btnCheckOut");

            if(!isCheckOut()&&!isCheckIn()) { //未签出签入
                btnCheckOut.click();
                var now = new Date().getTime();
                setTimeout(function () {
                    if($('#popupWindow p').text().indexOf('过期') < 0) { //成功签出才进行状态设置,如果出现超时则重新登陆
                        localStorage.setItem('checkStatus', 1); //checkStatus为1表示已签出
                        if(isMealTime(8,15,45)) {
                            localStorage.setItem('breakfastCheckOutTime',now);
                            recordCheckInAndOutHistory('out','breakfast');
                        } else {
                            localStorage.setItem('lunchCheckOutTime',now);
                            recordCheckInAndOutHistory('out','lunch');
                        }
                        $('input.confirm_no').click();
                        console.log(timestampToString(new Date().getTime())+' Check out');//could delete
                    } else {
                        recordExpiredTimes();
                        $('input.confirm_no').click();
                        logout();
                    }
                }, 2000);

                if(isMealTime(8,15,45) && typeof hadCheckInBreakfast==="undefined") {
                    console.log(timestampToString(new Date().getTime())+' Waiting to check in breakfast');//could delete
                    var randomBreakfastTime = (18+Math.floor(Math.random()*6+1))*minute + Math.floor((Math.random()*59+1)*second);
                    localStorage.setItem('randomBreakfastTime',randomBreakfastTime);
                    setTimeout(function () {
                        btnCheckIn.click();
                        afterCheckInToDo('breakfast');
                    }, randomBreakfastTime); //19mins--24mins
                    let hadCheckInBreakfast = true;
                } else if (isMealTime(11,15,75) && typeof hadCheckInLunch==="undefined") {
                    console.log(timestampToString(new Date().getTime())+' Waiting to check in lunch');//could delete
                    var randomLunchTime = (45+Math.floor(Math.random()*9+1))*minute + Math.floor((Math.random()*59+1))*second;
                    localStorage.setItem('randomLunchTime',randomLunchTime);
                    setTimeout(function () {
                        btnCheckIn.click();
                        afterCheckInToDo('lunch');
                    }, randomLunchTime); //46mins--55mins
                    let hadCheckInLunch = true;
                }
                
            } else if(isCheckOut() && !isCheckIn() && localStorage.getItem('hasBeenReloadWhenCheckIn') == 1) { //签入时遇到遇到登陆过期问题
                btnCheckIn.click();
                localStorage.setItem('checkStatus', 0);
                localStorage.setItem('hasBeenReloadWhenCheckIn', 0); 
                setTimeout(function () {
                    $('input.confirm_no').click();
                    console.log(timestampToString(new Date().getTime())+' Close the check in alert');//could delete
                }, 2000);
            } else if(isCheckOut() && !isCheckIn() && ((getEndOfMealTime()+3*minute)<=(new Date().getTime()))) {
                btnCheckIn.click();
                afterCheckInToDo(isMealTime(8,15,45)?'breakfast':'lunch');
            }
        } else {
            if(isNeedToReentry()) {
                logout();
            } else if (isNeedToRefresh()) {
                refresh();
            }
            console.log(timestampToString(new Date().getTime())+' I\'m waiting for breakfast or lunch time.');
        }
    }

    function isCheckIn() {
        return $("#btnCheckIn").prop("disabled");
    }

    function isCheckOut() {
        return $("#btnCheckOut").prop("disabled");
    }

    function isMealTime(startHour,startMinute,duringMinute) {
        var now = Date.parse(new Date());
        var beginOfToday = Date.parse(new Date(new Date(new Date().toLocaleDateString()).getTime()));
        var beginOfMealTime = beginOfToday + startHour*hour + startMinute*minute;
        var endOfMealTime = beginOfMealTime + duringMinute*minute;
        return (beginOfMealTime<now && now<endOfMealTime && !isSunday());
    }

    //是否周末
    function isSunday() {
        var today = new Date();
        return (today.getDay() === 0);
    }

    //判断是否需要注销重新登陆
    function isNeedToReentry() {
        if($('#popupWindow p').text().indexOf('过期') >= 0) {
            return true;
        }
        $('div.layui-layer-dialog').children().each(function() {
            if($(this).text().indexOf('过期') >= 0) {
                return true;
            }
        });
        return false;
    }

    //是否需要刷新页面
    function isNeedToRefresh() {

        var now = Date.parse(new Date());
        var startOfToday = Date.parse(new Date(new Date(new Date().toLocaleDateString()).getTime()));
        
        //07:45-07:52
        var start1 = startOfToday + 7*hour + 45*minute;
        var end1 = start1 + 7*minute;
        var isNeed1 = (start1<now && now<end1);
    
        //10:50-10:57
        var start2 = startOfToday + 10*hour + 50*minute;
        var end2 = start2 + 7*minute;
        var isNeed2 = (start2<now && now<end2);
    
        //07:00-07:07
        var start3 = startOfToday + 7*hour;
        var end3 = start3 + 7*minute;
        var isNeed3 = (start3<now && now<end3);
    
        return (isNeed1||isNeed2||isNeed3);
    
    }

    //刷新
    function refresh() {
        location.reload();
    }

    //注销
    function logout() {
        $('.navbar-right a')[2].click(); //注销
    }

    //记录打卡时间
    function recordCheckInAndOutHistory(checkType,mealType) {
        var dateTime = timestampToString(new Date().getTime()-4000);
        if(!localStorage.getItem('checkInAndOutHistory')) {
            localStorage.setItem('checkInAndOutHistory','[]');
        }
        var checkInAndOutHistory = JSON.parse(localStorage.getItem('checkInAndOutHistory'));
        if(checkType == 'out') {
            if(mealType == 'breakfast'){
                var check = {"breakfastOut":dateTime,"breakfastIn":""};
            } else {
                var check = {"lunchOut":dateTime,"lunchIn":""};
            }
            checkInAndOutHistory.push(check);
        } else {
            if(isMealTime(8,15,45)){
                checkInAndOutHistory[(checkInAndOutHistory.length-1)]['breakfastIn'] = dateTime;
            } else {
                checkInAndOutHistory[(checkInAndOutHistory.length-1)]['lunchIn'] = dateTime;
            }
        }
        localStorage.setItem('checkInAndOutHistory',JSON.stringify(checkInAndOutHistory));
    }

    function recordExpiredTimes() {
        if(!localStorage.getItem('expiredTimes')) {
            localStorage.setItem('expiredTimes', 1);
        } else {
            localStorage.setItem('expiredTimes', parseInt(localStorage.getItem('expiredTimes'))+1);
        }
    }

    //时间戳(毫秒)转字符串日期时间
    function timestampToString(inputTime) {
        var date = new Date(inputTime);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
    }

    function afterCheckInToDo(mealType) {
        setTimeout(function () {
            if($('#popupWindow p').text().indexOf('过期') < 0) { //成功签入才进行状态设置,如果出现超时则重新登陆
                console.log(timestampToString(new Date().getTime())+' Check in '+ mealType);//could delete
                localStorage.setItem('checkStatus', 0); //checkStatus为0表示已签入
                localStorage.setItem('hasBeenReloadWhenCheckIn', 0); //hasBeenReloadWhenCheckIn为0表示在签入时没有遇到登陆过期的问题
                $('input.confirm_no').click();
                console.log(timestampToString(new Date().getTime())+' Close the check in '+ mealType +' alert');//could delete
                recordCheckInAndOutHistory('in',mealType);
            } else {
                recordExpiredTimes();
                localStorage.setItem('hasBeenReloadWhenCheckIn', 1); //hasBeenReloadWhenCheckIn为1表示在签入时遇到登陆过期重新登陆过
                $('input.confirm_no').click();
                logout();
            }
        }, 2000);
    }

    function getEndOfMealTime() {
        if (isMealTime(8,15,45)) {
            return parseInt(localStorage.getItem('breakfastCheckOutTime')) + parseInt(localStorage.getItem('randomBreakfastTime'));
        } else {
            return parseInt(localStorage.getItem('lunchCheckOutTime')) + parseInt(localStorage.getItem('randomLunchTime')); 
        }
    }

})();