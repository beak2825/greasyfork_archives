// ==UserScript==
// @name         Csdn Ads Cleaner
// @namespace    http://tampermonkey.net/
// @version      1.1.5
// @description  Clear those fxxking ads on csdn!
// @author       sun123zxy
// @match        blog.csdn.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376621/Csdn%20Ads%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/376621/Csdn%20Ads%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var Ads;
    function Clear(){//删除Ads中的组件
        console.log("Clearing ads...");
        for(var i=0;i<Ads.length;i++){
            if(Ads[i]){
                Ads[i].parentNode.removeChild(Ads[i]);
                console.log("Sucessfully Clear Ads "+i+"!");
            }else{
                console.log("There's no Ads "+i+"!");
            }
        }
    }
    function LowFind(){//寻找广告组件（弱）
        console.log("(Low)Finding Ads...");
        Ads = new Array(    document.getElementsByClassName("csdn-tracking-statistics mb8 box-shadow")[0],//左侧边栏广告1
                            document.getElementsByClassName("fourth_column")[0],//左下弹窗广告
                            document.getElementById("kp_box_57"),//左侧边栏广告2
                            document.getElementById("479"),//右侧边栏广告1
                            document.getElementById("480"),//右侧边栏广告2
                            document.getElementsByClassName("pulllog-box")[0],//界面下侧广告、提示登录栏
                            document.getElementById("adContent"),//右侧"VIP免广告"
                            document.getElementById("dmp_ad_58"),//正文下广告
                            document.getElementsByClassName("indexSuperise")[0],//右侧弹窗广告
                            document.getElementsByClassName("blog_star_enter")[0],//2018博客之星
                            document.getElementById("QIHOO__INTERACTIVE_PLUGIN1548683796329-gameBg")//大转盘
                           );
        var AdBoxes=document.getElementsByClassName("recommend-item-box recommend-ad-box");//正文下夹杂在推荐博客中的广告
        for(var i=0;i<AdBoxes.length;i++){Ads.push(AdBoxes[i]);}
        console.log("Found ads:");
        console.log(Ads);
    }
    function HotKey(){
        var a=window.event.keyCode;
        if(a==113){ //F2
            LowFind();
            Clear();
        }
    }
    document.onkeydown = HotKey;
})();