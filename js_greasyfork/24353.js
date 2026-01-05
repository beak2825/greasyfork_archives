// ==UserScript==
// @name         2016江西教师挂机
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  2016年江西省中小学幼儿园教师信息技术应用能力提升工程项目挂机脚本
// @author       guanhuang
// @match        http://jxsxxyey2016.e.px.teacher.com.cn/home/student/*
// @downloadURL https://update.greasyfork.org/scripts/24353/2016%E6%B1%9F%E8%A5%BF%E6%95%99%E5%B8%88%E6%8C%82%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/24353/2016%E6%B1%9F%E8%A5%BF%E6%95%99%E5%B8%88%E6%8C%82%E6%9C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    unsafeWindow.window.alert = function() {return ;};
    var OldNTime, endflag = false;
    setInterval(function(){
        if (!endflag && Math.floor(TimeNum/60) >= 10) {
            OldNTime = $("#cumulativeTime").val();
            validateType=false;
            $("#comfirmButtonTo").click();
            isEnd(Math.floor(TimeNum/60));
        } else if (endflag) {
            SendMsg("课程结束!", "课程结束了,请尽快更换课程~~~", false);
        }
    }, Math.random()*10000+60000);

    function isEnd(TMum) {
        setTimeout(function() {
            var NowNTime = $("#cumulativeTime").val();
            if (NowNTime == OldNTime) {
                SendMsg("课程累计学习" + NowNTime + "分钟!", "课程结束了,请更换课程~~~", false);
                endflag = true;
            } else {
                SendMsg("课程累计学习" + NowNTime + "分钟!", "更新了"+ TMum + "分钟~~~~~", true);
            }
        }, 10000);
    }

    function SendMsg(title, msg, adis) {
        if (window.Notification){
            if (Notification.permission === 'granted') {
                var notification = new Notification(title,{body:msg,icon:"http://rsp.teacher.com.cn/avatar/125/10498180/130.jpg"});
                if (adis) {
                    setTimeout(function() {notification.close();}, 5000);
                }
            } else {
                Notification.requestPermission(function(result) {
                    if (result === 'denied' || result === 'default') {
                        alert('通知权限被无情的拒绝了！');
                    } else {
                        var notification = new Notification(title,{body:msg,icon:"http://rsp.teacher.com.cn/avatar/125/10498180/130.jpg"});
                    }
                });
            }
        }
    }

})();