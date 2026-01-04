// ==UserScript==
// @name         纯白S1 
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  white s1 ! (替换掉S1的屎黄色,上班摸鱼更清爽)
// @author       olch
// @license MIT
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.10.0/jquery.min.js
// @match        *://bbs.saraba1st.com/*
// @include      *://*.saraba1st.com/*
// @include      *://*.stage1st.com/*
// @include      *://*.stage1.cc/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459702/%E7%BA%AF%E7%99%BDS1.user.js
// @updateURL https://update.greasyfork.org/scripts/459702/%E7%BA%AF%E7%99%BDS1.meta.js
// ==/UserScript==

(function() {

    document.title="s1";
    setWhite();
    $(".bm_h").css("background-color","#eee");
    $(".tl .th").css("background-color","#eee");
    $(".tedt .bar").css("background-color","#eee");
    $("#toptb").css("background-color","#eee");
    $("#nv").css("background-color","#eee");
    $(".vwthd").css("background-color","#eee");
    $(".pls").css("background-color","#eee");
    $("#nv li.a").css("background-color","#ddd");
    $(".ttp .xw1 a").css("background-color","#eee");
        $(".psth").css("background-color","#eee");
        $(".psth").css("color","#aaa");
    $(".ad .pls").css("display","none");
    $(".pls .avatar").css("display","none");

    function setWhite(){


        $(".ttp a, .ttp strong").css("background-color","white");
        $(".avt img").css("background-color","white");
        $(".bm").css("background-color","white");
        $(".tl tr th, .tl tr td").css("background-color","white");
        $("body").css("background-color","white");
        $(".ftid a").css("background-color","white");
        $(".sltm").css("background-color","white");
        $(".oshr").css("background-color","white");
        $(".pbl").css("background-color","white");
        $(".pbl a").css("background-color","white");
        $("#extcreditmenu.a").css("background-color","white");
        $("#g_upmine.a").css("background-color","white");
        $(".fl").css("background-color","white");
        $(".tb .a a").css("background-color","white");
        $(".tb .current a").css("background-color","white");
        $(".xld .atc img").css("background-color","white");
        $(".mlp img").css("background-color","white");
        $(".tbn li.a").css("background-color","white");
        $(".tedt .area").css("background-color","white");
        $(".tedt .pt").css("background-color","white");
        $(".nfl .f_c").css("background-color","white");
        $(".dpbtn").css("background-color","white");
        $(".pmfl").css("background-color","white");
        $(".pmfl .s .px").css("background-color","white");
        $(".rfm .p_tip").css("background-color","white");
        $(".sipt").css("background-color","white");
        $(".sipt .txt").css("background-color","white");
        $(".clck").css("background-color","white");
        $(".sipt .clck").css("background-color","white");
        $(".umh h2").css("background-color","white");
        $(".umh h3").css("background-color","white");
        $(".umn .umh_cb").css("background-color","white");
        $(".pg a").css("background-color","white");
        $(".pg strong").css("background-color","white");
        $(".pgb a").css("background-color","white");
        $(".jump_bdl li").css("background-color","white");
        $(".focus").css("background-color","white");
        $(".frame").css("background-color","white");
        $(".frame-tab").css("background-color","white");
        $(".dopt .cnt").css("background-color","white");
        $(".waterfall .c .nopic").css("background-color","white");
    }


    //引入js
    function include_jq() {
        var sobj = document.createElement('script');
        sobj.type = "text/javascript";
        sobj.id = "simply_colg";
        sobj.src = "https://cdn.bootcdn.net/ajax/libs/jquery/1.10.0/jquery.min.js";
        var headobj = document.getElementsByTagName('head')[0];
        headobj.appendChild(sobj);
    }

    // Your code here...
})();