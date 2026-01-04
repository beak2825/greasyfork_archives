// ==UserScript==
// @name         战旗自动签到任务等
// @namespace    黄毛
// @version      3.1
// @description  打开战旗TV页面自动签到，自动完成任务、老虎机，关闭广告。
// @author       黄毛
// @match        *://www.zhanqi.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421450/%E6%88%98%E6%97%97%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E4%BB%BB%E5%8A%A1%E7%AD%89.user.js
// @updateURL https://update.greasyfork.org/scripts/421450/%E6%88%98%E6%97%97%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E4%BB%BB%E5%8A%A1%E7%AD%89.meta.js
// ==/UserScript==

(function() {
    // 'use strict';
    var rex = /\"RoomId\":(\d+),/;
    var myDate = new Date();
    var ifSignToday = myDate.getMonth()*30 + myDate.getDate();
    var lottery = 0;
    setTimeout(function () { $("a.close").not("[class*='js']")[0].click(); }, 20000); // 20 秒后关闭评论区广告。
    if(getCookie("ifSignToday")!=ifSignToday) { // 执行每日签到行为。
        $.ajax({
            url: "https://www.zhanqi.tv/api/actives/chance/send.share",
            type: "post",
            data: { },
            contentType: "application/x-www-form-urlencoded; charset=utf-8"
        });
        $.getJSON('https://www.zhanqi.tv/api/user/follow.listsbypage?page=1&nums=10', function(json){
            for(var i=0;i<json.data.list.length;i++){
                $.ajax({
                    url: "https://www.zhanqi.tv/api/actives/signin/fans.sign",
                    type: "post",
                    data: { roomId: json.data.list[i].roomId },
                    contentType: "application/x-www-form-urlencoded; charset=utf-8"
                });
            }
        });
        console.info("Sign in Complete.");
        document.cookie = "ifSignToday="+ifSignToday;
    }
    function getCookie(name){ // 每日签到的本地记录。
        var strCookie=document.cookie;
        var arrCookie=strCookie.split("; ");
        for(var i=0;i<arrCookie.length;i++){
            var arr=arrCookie[i].split("=");
            if(arr[0]==name)return arr[1];
        }
        return "";
    }
    var timer_int=self.setInterval(function() { // 每 30 秒检查一遍任务清单，提交已经完成的任务。
        $.getJSON('https://www.zhanqi.tv/api/user/task.get', function(json){
            if(json.data.length!=0) {
                for(var i=0;i<json.data.length;i++) {
                    var tmp = json.data[i].progress.current - json.data[i].progress.total;
                    console.info(json.data[i].name+":\t"+tmp);
                    if(tmp >=0) {
                        $.ajax({
                            url: "https://www.zhanqi.tv/api/user/task.complete",
                            type: "post",
                            data: { taskId: json.data[i].id },
                            contentType: "application/x-www-form-urlencoded; charset=utf-8"
                        });
                    }
                }
            }
            else {
                console.info("tasks Complete,Stop looping.");
                self.clearInterval(timer_int);
            }
        });
    },30000);
    setTimeout(function () { // 延时执行检查。
        console.info("开始循环检测老虎机；");
        var timer_lot=self.setInterval(function() { // 每 30 秒检查一遍老虎机，自动摇奖。
        lottery = $("div#js-slot-free-times")[0].innerHTML;
        console.info("老虎机:\t"+lottery);
        if(lottery > 0) {
            $("a#js-slot-lottery").click();
        } else {
            console.info("lottery Complete,Stop looping.");
            self.clearInterval(timer_lot);
        }
    },30000);
    }, 5000);
})();