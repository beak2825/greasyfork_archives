// ==UserScript==
// @name         goChinese
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Turn your page Chinese!
// @author       goChineseTeam
// @match        https://macao4.i-learner.com.hk/new_interface2019/schedule.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393180/goChinese.user.js
// @updateURL https://update.greasyfork.org/scripts/393180/goChinese.meta.js
// ==/UserScript==

(function() {
    'use strict';
            document.getElementById("bugbug_iframe").src = "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/a3d9ec53-e18f-4dc6-b26f-8e27f9dc28ff/daakmq1-27e990cc-6946-493c-b2dc-896ddd0479a5.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2EzZDllYzUzLWUxOGYtNGRjNi1iMjZmLThlMjdmOWRjMjhmZlwvZGFha21xMS0yN2U5OTBjYy02OTQ2LTQ5M2MtYjJkYy04OTZkZGQwNDc5YTUuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.DI1lJVgPTyW91nIYgey-L-tygXoSbIGIiaNIR-6pCSE";

    function chinese()
    {
        if(document.getElementsByClassName("btn other_platform_btn ui-btn ui-shadow ui-corner-all")[0] != undefined)
        {
            var imageUrl = "https://courrier.jp/media/2018/11/03011355/GettyImages-120403547-1-e1541142901496.jpg";
            var iconUrl = "https://static.tildacdn.com/tild3235-6632-4130-b836-653737643637/north-korea.png";
            document.getElementsByClassName("btn other_platform_btn ui-btn ui-shadow ui-corner-all")[0].innerHTML = "其他i-Learner項目";
            document.getElementsByClassName("btn ui-btn ui-shadow ui-corner-all")[1].innerHTML = "使用者導覽";
            document.getElementsByClassName("tbrow")[11].innerHTML = "訊息中心";
            document.getElementsByClassName("last_week")[0].innerHTML = '<i class="fas fa-chevron-circle-left"></i>'+"上一週";
            document.getElementsByClassName("next_week")[0].innerHTML = "下一週"+'<i class="fas fa-chevron-circle-right"></i>';
            document.getElementById("ttt").innerHTML = "回到舊版頁面";
            var userInfo = document.getElementsByClassName("user_info")[0].innerHTML;
            var edit = document.getElementsByClassName("user_info")[0];
            //document.getElementsByTagName("b")[0].innerHTML = "歡迎你！親愛的同學！";
            var mark = document.getElementsByClassName("total_mark")[0].innerHTML;
            var coin = document.getElementsByClassName("total_coin")[0].innerHTML;
            var comp = document.getElementsByClassName("exercise_completed")[0].innerHTML;
            var save = document.getElementsByClassName("vocab_saved")[0].innerHTML;
            document.getElementsByClassName("user_info")[0].innerHTML = "<b>歡迎你！親愛的同學！</b>"+"<hr>"+'分數：<span class="total_mark">' + mark + "</span><br>" + "金幣：<span class='total_coin'>" + coin + "</span><br>" + "完成練習：<span class='exercise_completed'>" + comp + "</span><br>" + "保存的生字：<span class='vocab_saved'>" + save + "</span><br>";
            document.getElementsByClassName("start_today_exercise_btn")[0].innerHTML = "開始";
            document.getElementsByClassName("today_ex")[0].innerHTML = "今天的練習";
            document.getElementsByClassName("ui-link")[3].innerHTML = '<img src="images/calendar_100.png" style="height:40%; max-height:60px;">日曆';
            document.getElementsByClassName("video_link")[0].innerHTML = '<img src="'+iconUrl+'" width=38px><br>播放';
            for(var i=0;i<=5;i++)
            {
                if(document.getElementsByClassName("exercise_link")[i] != undefined)
                {
                    document.getElementsByClassName("exercise_link")[i].innerHTML = '<img src="'+iconUrl+'" width=38px><br>開始';
                    document.getElementsByClassName("article_img")[i].style.background = "#f3f3f3 url('"+imageUrl+"') no-repeat center";
                    document.getElementsByClassName("article_img")[i].style.backgroundSize = "cover";

                }
            }
            document.getElementsByClassName("today_article_img")[0].style.background = "#f3f3f3 url('"+imageUrl+"') no-repeat center";
            document.getElementsByClassName("today_article_img")[0].style.backgroundSize = "cover";
            document.getElementById("fly2").src = "https://www.akai-trophy.com/data/syunsuke0913/product/a309456d78.gif";
            document.getElementById("fly1").src = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Emblem_of_North_Korea.svg/220px-Emblem_of_North_Korea.svg.png";


                //var c = document.getElementById("canvas");
                //var ctx = c.getContext("2d");
                //var img = document.getElementsByTagName("img")[0];
                //ctx.drawImage(img, 10, 10);
            schedule_period

        }
    }
    setInterval(chinese, 10);
})();