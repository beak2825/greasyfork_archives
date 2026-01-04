// ==UserScript==
// @name         B站布局调整
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  简单修改B站布局效果，随缘更新
// @author       九方耀
// @match        http://www.bilibili.com/*
// @match        https://www.bilibili.com/*
// @grant        none
// @icon         https://alicliimg.clewm.net/881/314/1314881/1476323210436df70b164cee58b129366cd2054015ccb1476323208.jpg
// @downloadURL https://update.greasyfork.org/scripts/388379/B%E7%AB%99%E5%B8%83%E5%B1%80%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/388379/B%E7%AB%99%E5%B8%83%E5%B1%80%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var IDArray = ["bili_live","bili_douga","bili_bangumi","bili_guochuang","bili_manga","bili_music","bili_dance","bili_game","bili_technology","bili_digital","bili_life","bili_kichiku","bili_fashion","bili_ad","bili_ent","bili_article","bili_movie","bili_teleplay","bili_cinephile","bili_documentary"];

    var BtnTextArray = ["直播","动画","番剧","国创","漫画","音乐","舞蹈","游戏","科技","数码","生活","鬼畜","时尚","广告","娱乐","专栏","电影","TV剧","影视","纪录片"];

    var otherArray = ["home_popularize","special_recommend","fixed_app_download"];

    var ClassArray = ["gg-floor-module","footer bili-footer report-wrap-module","item customize","s-line","back-top icon","app-download"];

    var Retain = "bili_technology";

    /*隐藏其他*/
    window.onload = setTimeout(function(){

        //ByID 正常的栏目
        for (var i = 0; i < IDArray.length; i++)
        {
            if(IDArray[i] == Retain)
            {
                document.getElementById(IDArray[i]).style.display="block";
            }
            else
            {
                document.getElementById(IDArray[i]).style.display="none";
            }
        }
        //ByID 广告之类的
        for (var i2 = 0; i2 < otherArray.length; i2++)
        {
            document.getElementById(otherArray[i2]).style.display="none";
        }

        //ByClass
        var temp;
        for (var j = 0; j < ClassArray.length; j++)
        {
            temp = document.getElementsByClassName(ClassArray[j]);
            for(var j2 = 0; j2<temp.length; j2++)
            {
                temp[j2].style.display = "none";
            }
        }

    },100);

    /*导航栏修改*/
    var bzdh = document.getElementsByClassName("item sortable");

    for(var a = 0; a<bzdh.length;a++)
    {
        bzdh[a].addEventListener('click',function(){SetClick(this.innerHTML);}, false);
    }
    function SetClick(m)
    {
        for(var s = 0; s<BtnTextArray.length;s++)
        {
            if(m==BtnTextArray[s])
            {
                for (var i = 0; i < IDArray.length; i++)
                {
                    document.getElementById(IDArray[i]).style.display="none";
                }
                document.getElementById(IDArray[s]).style.display="block";
            }
        }
    }



})();
