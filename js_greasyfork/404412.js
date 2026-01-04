// ==UserScript==
// @name        百度搜索页面美化成谷歌
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  特色：谷歌化，尽量的精简 - 注意：切记需要配合脚本<AC-baidu:重定向优化百度搜狗谷歌必应搜索_favicon_双列 - inDarkness>使用
// @author       lrc
// @match        https://www.baidu.com/*
// @match        http://www.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404412/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96%E6%88%90%E8%B0%B7%E6%AD%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/404412/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96%E6%88%90%E8%B0%B7%E6%AD%8C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //$(".c-container").css("margin-bottom", "50px !important");
    //$("#container").css("height","1900px");
    //$(".c-container").css("cssText", "margin-top:50px !important;");
   // $(".c-container").css("padding-bottom", "50px");
     //$(this).css("background","transparent");
         //$(this).css("cssText","background:transparent !important");

    //引入jquery库
    var head = document.getElementsByTagName("html")[0];
    var script = document.createElement("script");
    script.src = "https://code.jquery.com/jquery-3.4.1.min.js";
    head.appendChild(script);



    var websiteURL = window.location.href;

    //www.baidu.com修改
    if(websiteURL == 'https://www.baidu.com/' || websiteURL == 'https://www.baidu.com/') {

        //去底部
        $("#bottom_layer").remove();
        $("#s_tab").remove();
        $("#virus-2020").remove();

        $("#s_fm").css("padding-top", "100px");

        //最小宽度、高度去掉
        $("body").css("min-width", "unset");
        $("#head_wrapper").css("min-height", "unset");

    }

    //非www.baidu.com页面 - 搜索页面美化
    if(websiteURL != 'https://www.baidu.com/' || websiteURL != 'https://www.baidu.com/') {

        $("#wrapper_wrapper").css("background-color", "white");

          //删除logo
        $("#s_lg_img").remove();

        //TODO待做
        $("#content_right").remove();
        //$("#container").css("left","50%");
        //$("#container").css({"left":"50% !important","transform":"translateX(-50%) !important", "margin-left":"0px !important"})

        //移除下一页

        //每个li添加间隔，去掉页显示、每个li边框有阴影
        $(".sp-separator").remove();
        $(".c-container").css("box-shadow","0 0 20px 2px rgba(0,0,0,0.3)");
        $(".c-container").css("border-radius","20px");
        $(".t").css("background-color","transparent");
        $(document).scroll(function(){
            $(".sp-separator").remove();
            $(".c-container").css("box-shadow","0 0 20px 2px rgba(0,0,0,0.3)");
            $(".c-container").css("border-radius","20px");
            $(".t").css("background-color","transparent");
            var div = $("<div></div>")
            div.css("height", "40px");
            $(".c-container").filter(function(index){

                console.log( $(this).next().attr("style") != "height: 40px;");

                //return false;
                return $(this).next().attr("style") != "height: 40px;"
            }).after(div);


        });

        setTimeout(function() {
            var div = $("<div></div>")
            div.css("height", "40px");

            $(".c-container").after(div);

            var div2 = $("<div></div>")
            div2.css("height", "30px");

            $(".c-container").eq(0).before(div2);
        }, 0);


        //去底部元素
        $("#foot").remove();
        //页面底部有点边距
        $("body").css("padding-bottom", "70px");


        console.log("==============" + window.location.href );

        //去logo、搜索按钮、搜索右边的高级搜索、搜索工具
        $("#result_logo").remove();
        $(".s_btn_wr").remove();
        $("#u").remove();
        $(".search_tool").remove();


        //删除搜索框推荐
        $("#s-hotsearch-wrapper").remove();


        // 百度首页搜索框居中
        var currrentURL = window.location.href;
        var str = /index.php/

        //搜索类型居中显示
        $("#s_tab").css("position", "relative");
        $("#s_tab>.s_tab_inner").css({"position":"absolute", "left":"48%"});







        //百度首页美化
        if(str.test(currrentURL) || currrentURL=="https://www.baidu.com/"){
            $("#head_wrapper").css({"top":"50%", "transform":"translateY(-60%)"})

            $("#bottom_layer").remove();

            $("#s_upfunc_menus").remove();

            $(".s_bri").remove();

            $("#u_sp>a").filter(function(index){
                if(index < 3){
                    return true;
                };
            }).remove();
            $("#su").remove();
        }


        //搜索框样式美化
        $(".s_ipt_wr").css({"border-right":"1px solid #b6b6b6","border-radius":"20px","padding-left":"20px","height":"40px","line-height":"40px"});



        $("#result_logo").css({"left":"calc(44% - 440px)", "top":"6px"});


        //替代
        $("html").on("focus", "#kw", function() {
            $(".s_ipt_wr").css("border-right-color", "#4791ff");
        })




        //替代
        $("html").on("blur", "#kw", function() {
            $(".s_ipt_wr").css("border-right-color", "#b6b6b6");
        })




        $("#head").css("background","white");
        $("#s_tab").css("background","white");





        //替代
        $("html").on("mouseover", ".c-container", function() {
            $(this).css("box-shadow","0 0 2px grey");
        })



        //替代
        $("html").on("mouseout", ".c-container", function() {
            $(".c-container").css("box-shadow","0 0 20px 2px rgba(0,0,0,0.3)");
        })









        $(".nums").css("margin-bottom","30px");

        $(".s_tab_inner>a").eq(4).nextAll().remove();
        $(".s_tab_inner>b").css("left", "calc(50% - 290px)");
        $(".s_tab_inner>a").css("left", "calc(50% - 290px)");
        $(".s_tab_inner>a").css("font-weight", "bold");
        $(".s_tab_inner>b").css("border-bottom", "3px solid #1A73E8");
        $(".s_tab_inner>a").css("color", "#5f6368");


        //替代
        $("html").on("mouseover", ".s_tab_inner>a", function() {
            $(this).css("color", "#1A73E8");
        })



        //替代
        $("html").on("mouseout", ".s_tab_inner>a", function() {
            $(this).css("color", "#5f6368");
        })




        var con = document.getElementById("container");
        con.setAttribute('style', 'background-color:white');

         //修复最新版本作者的container加了左外边距
         //$("#container").css("margin-left", "0px")
        $("#container").css({"left":"50%","transform":"translateX(-50%) ", "margin-left":"0px "})





    }

    // Your code here...
})();