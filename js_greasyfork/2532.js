// ==UserScript==
// @name  饭否-免刷新显示无限多新消息
// @author HackMyBrain
// @version 1.0.1
// @description 免刷新饭否首页, 去掉显示多于19条新消息需要刷新的限制
// @create 2013-07-21
// @include http://fanfou.com/home
// @namespace https://greasyfork.org/users/2844
// @downloadURL https://update.greasyfork.org/scripts/2532/%E9%A5%AD%E5%90%A6-%E5%85%8D%E5%88%B7%E6%96%B0%E6%98%BE%E7%A4%BA%E6%97%A0%E9%99%90%E5%A4%9A%E6%96%B0%E6%B6%88%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/2532/%E9%A5%AD%E5%90%A6-%E5%85%8D%E5%88%B7%E6%96%B0%E6%98%BE%E7%A4%BA%E6%97%A0%E9%99%90%E5%A4%9A%E6%96%B0%E6%B6%88%E6%81%AF.meta.js
// ==/UserScript==


(function (){
    var original_title = document.title;
    var count = document.getElementById("timeline-count");
    var noti = document.getElementById("timeline-notification");
    var buffereds = document.getElementsByClassName("buffered");

    function updateTime(){
        var time = new Date().getTime();
        var gap_s, gap_m, gap_h;
        var datestring;
        var stime_list = document.querySelectorAll("[stime]");
        for(var i = 0, l = stime_list.length; i < l; i++){
            if (stime_list[i].innerHTML != stime_list[i].title){
                datestring = stime_list[i].getAttribute("stime");
                gap_s = (time - Date.parse(datestring)) / 1000;
                if (gap_s < 60){
                    stime_list[i].innerHTML = gap_s.toFixed() + " 秒前";
                } else if (60 <= gap_s && gap_s < 3600){
                    gap_m = gap_s / 60;
                    stime_list[i].innerHTML = gap_m.toFixed() + " 分钟前";
                } else if (3600 <= gap_s && gap_s < 86400){
                    gap_h = gap_s / 3600;
                    stime_list[i].innerHTML = "约 " + gap_h.toFixed() + " 小时前";
                } else {
                    stime_list[i].innerHTML = stime_list[i].title;
                }
            }
            else return;
        }
    }

    function showBuffered(e){
        updateTime();
        while(buffereds.length > 0){
            buffereds[0].removeAttribute("class");
        }
        e.stopPropagation();
        e.preventDefault();
        noti.style.display = "none";
        document.title = original_title;
        count.innerHTML = 0;
    }

    noti.addEventListener('click', showBuffered, true);
})()