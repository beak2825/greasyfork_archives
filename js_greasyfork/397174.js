// ==UserScript==
// @name         Tongji Courses Clock
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  同济大学courses网上教学平台课程表时间提醒
// @author       AYA
// @match        *://courses.tongji.edu.cn/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/397174/Tongji%20Courses%20Clock.user.js
// @updateURL https://update.greasyfork.org/scripts/397174/Tongji%20Courses%20Clock.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var get_token = setInterval(get_courses,5000);

    var courses = [];
    console.log(courses);

    function get_courses(){
        var user_token = JSON.parse(JSON.parse(decodeURIComponent(document.cookie.split(";")[1].split("=")[1]))).token;
        var user_id = JSON.parse(JSON.parse(decodeURIComponent(document.cookie.split(";")[1].split("=")[1]))).user_id;
        if(user_token === null || user_id === null){
            console.log("error");
        }else{
            clearInterval(get_token);

   
            var my_data = new FormData();
            var today = new Date();
            var one_week_after = new Date(today.getTime() + 86400000 * 7);
            my_data.append("start", today.toLocaleDateString().split('/').join('-'));
            my_data.append("end", one_week_after.toLocaleDateString().split('/').join('-'));
            my_data.append("user_token", user_token);


            GM_xmlhttpRequest({
                method: "POST",
                url: "https://courses.tongji.edu.cn/api/v1/user/calendar/my",
                data: my_data,
                onload: function(response) {
                    courses = (JSON.parse(response.responseText).data);
                    console.log(courses);
                    var notification = setInterval(check, 60000);
                }
            });
        }
    }

    

    function check(){
        var d = new Date();
        courses.forEach(function(item){
            if(new Date(item.start).getTime() - new Date().getTime() <= 300000 && new Date(item.start).getTime() - new Date().getTime() > 240000){
                if(window.Notification && Notification.permission !== "denied") {
                    Notification.requestPermission(function(status) {
                        var n = new Notification('您有一门课程将在5分钟后开始', { body: item.title });
                        return;
                    });
                }
            }
        })
        console.log("检查完毕，没有即将开始的课程");
    }

})();