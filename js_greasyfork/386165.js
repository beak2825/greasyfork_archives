// ==UserScript==
// @name         IT人员常用网站+谷歌浏览器广告
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  try to take over the world!
// @author       You
// @match        *://my.oschina.net/*
// @match        *://www.cnblogs.com/*
// @match        *://www.tampermonkey.net/*
// @match        *://www.csdn.net/*
// @match        *://blog.csdn.net/*/article/details/*
// @match        *://ent.sina.com.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386165/IT%E4%BA%BA%E5%91%98%E5%B8%B8%E7%94%A8%E7%BD%91%E7%AB%99%2B%E8%B0%B7%E6%AD%8C%E6%B5%8F%E8%A7%88%E5%99%A8%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/386165/IT%E4%BA%BA%E5%91%98%E5%B8%B8%E7%94%A8%E7%BD%91%E7%AB%99%2B%E8%B0%B7%E6%AD%8C%E6%B5%8F%E8%A7%88%E5%99%A8%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var cnblogs = /www.cnblogs.com/
    var oschina = /my.oschina.net/
    var tampermonkey = /www.tampermonkey.net/
    var csdn = /www.csdn.net/
    var sina = /ent.sina.com.cn/

    var currentURL = window.location.href;


    setTimeout(function () {
        if(oschina.test(currentURL)){
            $(".adsbygoogle").remove();

        }
        if(tampermonkey.test(currentURL)){
            $(".adventing").remove();

        }
        if(cnblogs.test(currentURL)){
            $("#div-gpt-ad-1539008685004-0").remove();//文章底部广告
            $("#cnblogs_c1").remove();
            $("#cnblogs_a1").remove();
            for(var i = 1 ; i<5;i++){
                $("#cnblogs_b"+i).remove();//首页右侧广告
            }
        }
        //CSDN主页
        if(csdn.test(currentURL)){
            console.log(1212121212)
            document.getElementsByClassName("banner-ad-box")[0].remove();
            document.getElementsByClassName("indexSuperise")[0].remove();//自定义首页右侧悬浮广告去除
            document.getElementsByClassName("slide-outer right_top")[0].remove();//首页右侧轮播广告
            document.getElementsByClassName("right_box magazine_box")[0].remove();//

        }
        //CSDN文章页面
        if(/blog.csdn.net/.test(currentURL)){
            console.log(111111)
            if (document.getElementById("btn-readmore")){
                document.getElementById("btn-readmore").click(); //CSDN文章自动展开
                localStorage.setItem("anonymousUserLimit", "");
            } //自动展开
            document.getElementsByClassName("csdn-tracking-statistics mb8 box-shadow")[0].remove(); //左上广告
            document.getElementById("asideFooter").remove();
            document.getElementById("adContent").remove();
            document.getElementsByClassName("p4course_target")[0].remove();
            document.getElementsByClassName("bdsharebuttonbox")[0].remove();
            document.getElementsByClassName("vip-caise")[0].remove();
            document.getElementsByClassName("fourth_column")[0].remove();
        }
        console.log("谷歌浏览器广告")
    }, 3000);
})();