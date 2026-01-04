// ==UserScript==
// @name         CSDN首页谷歌化、移出有关CSDN推荐的推文、官方直播、去除首页侧边栏、 优化论坛、文章页面移除博主自定义背景样式、深度移除广告
// @namespace    http://tampermonkey.net/
// @version      1.5.0
// @description  特色：首页博客谷歌化、去博客文章自定义背景
// @author       lrc(在whoami作者上进行二次开发)
// @match        *://blog.csdn.net/*/article/details/*
// @match        *://*.blog.csdn.net/article/details/*
// @match        *://bbs.csdn.net/topics/*
// @match        *://*.iteye.com/blog/*
// @match        *://www.csdn.net/
// @match        *://i.csdn.net/*
// @match        https://mp.csdn.net/*
// @match        *://so.csdn.net/so/search/*
// @match        *://blog.csdn.net/*
// @match        *://edu.csdn.net/*
// @match        *://*.csdn.net/*
// @exclude      *://bbs.csdn.net/users/score_tasks
// @grant        none
// @icon         https://csdnimg.cn/public/favicon.ico
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/401956/CSDN%E9%A6%96%E9%A1%B5%E8%B0%B7%E6%AD%8C%E5%8C%96%E3%80%81%E7%A7%BB%E5%87%BA%E6%9C%89%E5%85%B3CSDN%E6%8E%A8%E8%8D%90%E7%9A%84%E6%8E%A8%E6%96%87%E3%80%81%E5%AE%98%E6%96%B9%E7%9B%B4%E6%92%AD%E3%80%81%E5%8E%BB%E9%99%A4%E9%A6%96%E9%A1%B5%E4%BE%A7%E8%BE%B9%E6%A0%8F%E3%80%81%20%E4%BC%98%E5%8C%96%E8%AE%BA%E5%9D%9B%E3%80%81%E6%96%87%E7%AB%A0%E9%A1%B5%E9%9D%A2%E7%A7%BB%E9%99%A4%E5%8D%9A%E4%B8%BB%E8%87%AA%E5%AE%9A%E4%B9%89%E8%83%8C%E6%99%AF%E6%A0%B7%E5%BC%8F%E3%80%81%E6%B7%B1%E5%BA%A6%E7%A7%BB%E9%99%A4%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/401956/CSDN%E9%A6%96%E9%A1%B5%E8%B0%B7%E6%AD%8C%E5%8C%96%E3%80%81%E7%A7%BB%E5%87%BA%E6%9C%89%E5%85%B3CSDN%E6%8E%A8%E8%8D%90%E7%9A%84%E6%8E%A8%E6%96%87%E3%80%81%E5%AE%98%E6%96%B9%E7%9B%B4%E6%92%AD%E3%80%81%E5%8E%BB%E9%99%A4%E9%A6%96%E9%A1%B5%E4%BE%A7%E8%BE%B9%E6%A0%8F%E3%80%81%20%E4%BC%98%E5%8C%96%E8%AE%BA%E5%9D%9B%E3%80%81%E6%96%87%E7%AB%A0%E9%A1%B5%E9%9D%A2%E7%A7%BB%E9%99%A4%E5%8D%9A%E4%B8%BB%E8%87%AA%E5%AE%9A%E4%B9%89%E8%83%8C%E6%99%AF%E6%A0%B7%E5%BC%8F%E3%80%81%E6%B7%B1%E5%BA%A6%E7%A7%BB%E9%99%A4%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==


// 根据网速自己设置时间间隔
var interval = 3000;
var sideInterval = 4000;
var bbsInterval = 3000; // 在ADBlock之后运行
var iteyeInterval = 100;

(function () {

    'use strict';



    var currentURL = window.location.href;
    var blog = /article/;
    var blog2 = /article\/detail/;
    var bbs = /topics/;
    var iteye = /iteye/;
    var index = /www.csdn.net/;
    var index2 = "https://blog.csdn.net/";
    var profile = /uc/;
    var search = /search/;
    var edu = /edu.csdn.net/;
    var setting = /i.csdn.net/;
    //论坛问题详情页面
    var bbs2 = /bbs.csdn.net\/topics\//
    //论坛页面
    var bbs3 = /bbs.csdn.net/
    //登录界面
    var login = /login/


    //移除创作中心提示
    $(".write-bolg-btn>#writeGuide").remove();

    //个人中心页面
    if(setting.test(currentURL)) {
        setTimeout(function() {
            $(".right_c .warn_tip").remove();
        },2000);
    }

    if(login.test(currentURL)) {
        //去登录界面广告、按钮
        $(".main-tu").remove();
        $(".main-download-btn").remove();

        //调整二维码布局
        var mainWidth = $(".main").width();
        var loginWidth = $(".main-login").width();
        var cssWidth = (mainWidth - loginWidth)/2 + "px"
        //    transform: translateX(-50px);
        $(".main-login").css("transform", "translateX(-" + cssWidth + ")");
        $("#app").css("margin-bottom", "0px");

    }


    // 论然详情页去除广告
    if(bbs2.test(currentURL)){

        $(".right-box>.flex-box").css("overflow", "hidden");

        $(".post_recommend").remove();

        $(".topic_r>.post_body>div").remove();


        $(".reply").css("padding-bottom","20px");
        $(".reply>.pub_list").remove();

        $("#answer_btn").remove();

        $(".title ").css("font-weight", "bold");


        $("dl[class='bbs_feed bbs_feed_ad_box']").remove();

    }


    if(currentURL == "https://ask.csdn.net/"){

        $(".persion_article>.mod_about_teacher").remove();

    }

   //去论坛广告、公告、注意事项 - 默认收起论坛分类 - 论坛主页优化
   if(currentURL == "https://bbs.csdn.net/"){

       $(".left_menu_box>.btn_toggle_hide").click();

       $(".bbs_left_wrap>.ad_top").remove();

       $(".ad_1").remove();

       $(".bbs_notice").remove();

       $(".advice").remove();

       $(".fixed_dl").remove();

       $("#_1cxxgpmgkwe").remove();

   }

    //论坛其他分类主页面优化
   if(bbs3.test(currentURL)) {
       console.log("通过");
       $(".left_menu_box>.btn_toggle_hide").click();
       $(".pub-footer-new").remove();
       $(".csdn-side-toolbar").remove();

       //去问题推荐 - 实质是参加csdn活动
       $("table>tbody>tr").filter(function(index){
           return $(this).find(".forums_topic>.green").length == 1
       }).remove();

       setTimeout(function() {
           //$("#adContent").remove();
           $(".meau-gotop-box").remove();

       },200)

       //TODO 待做
       $("body").scroll(function(){

           console.log("me");
       });


   }

    console.log("==========" + currentURL)



    //去除论坛分类页面广告
    if(/blog.csdn.net/.test(currentURL)){

        $(".blog_container_aside>.csdn-tracking-statistics").remove();

        $(".blog_container_aside>#asideFooter").remove();
    }

    
    //文章布局恢复原版 - 去背景、部分广告、文章在右边，作者信息在左边 -
    if(blog2.test(currentURL)) {

        $(".login-box").remove();

        $(".login-box").remove();

        $(".blog_container_aside #footerRightAds").remove();

        $(".blog_container_aside aside").css("float", "left !important");
        $("#mainBox>.blog_container_aside").css("margin-top", "10px");
        //博客
        $(".main_father>.container>main").css({"position":"absolute", "left":"50%", "top":"10px", "transform":"translate(-32%)"})
        $(document).scroll(function() {
            $(".blog_container_aside aside").css("float", "left !important");
            $("#mainBox>.blog_container_aside").css("margin-top", "10px");
            //博客
            $(".main_father>.container>main").css({"position":"absolute", "left":"50%", "top":"10px", "transform":"translate(-32%)"})
        })

        //去博客文章博主的背景样式
        $("body").css("background-image","none");
        $(".blog_container_aside>div>h3").css("background", "none");
        $(".blog_container_aside>div .aside-title").css("background", "none");


        $("main>.template-box").remove();
    }


    //若为CSDN论坛,则：
    //alert(currentURL);
    $(".blog_container_aside").unbind("scroll");

    $("#mainBox").css("position", "relative");

    $(".blog_container_aside").css({ "position":"absolute", "left":"0" })



    $("#feedlist_id>li").eq(0).remove();
     $(".right_box").css("display", "none");
    $(".enterprise_blog").css("display", "none");

    //优化搜索框
    $(".search_bar").css("width", "290px");
    $(".search_bar .input_search").css("width", "80%");



    //去csdn学院推文、csdn推文
    if(index.test(currentURL) || index2 == currentURL){

        //导航栏去掉
        $("#nav").remove();
        //轮播图去掉
        $(".carousel").remove();
        $("main").css("padding-top", "50px")

        //去官方直播
        $("li[data-type='liveroom']").remove();

         //去除空li-代码问题
         $("li:empty").remove();

        //去博文推荐红色提示框
        $(".fixed_content .feed-fix-box").remove();


        //去csdn推荐博文
        $(".recommend").parents("li").remove();

          //取消CSDN的滚动事件 - 因为其会改变导航栏的布局，故取消滚动事件
         $(document).unbind("scroll");

        //内容布局居中显示
        $("body>.container>.fixed_content").css({"width":"760px", "float":"left"});
        var navWidth = $("body>.container>#nav").outerWidth();
        var contentWidth = $("body>.container>.fixed_content").outerWidth();
        var realContentWidht = navWidth + contentWidth;
        var documentWidth = $(document).outerWidth();
        $("body>.container").css({"width":realContentWidht+50 + "px","margin-left":documentWidth/2 - realContentWidht/2 + "px !important"});




        $(".fixed_content>aside").remove();


         //添加阴影事件
        $("#feedlist_id>li").css({"box-shadow":"0 0 2px grey", "transition":"box-shadow 1s", "border-radius": "20px"});

        $(document).on("mouseover", "#feedlist_id>li",function() {
             $(this).css("box-shadow","0 0 20px 2px rgba(0,0,0,0.3)");

        })

        $(document).on("mouseout", "#feedlist_id>li",function() {

             $(this).css("box-shadow","0 0 2px grey");
        })



        $("#feedlist_id>li").css("margin-bottom", "20px");

        var filterObj = $("li").filter(function(index){

            var str = /CSDN学院/
            var str2 = /csdn/
            var currentStr = $(".name>a", this).text();
            if(str.test(currentStr) || str2.test(currentStr)){
                return true;
            }

        })
        //console.log(filterObj)
        filterObj.remove();

        //轮播图背景透明
        $(".carousel").css("background","transparent");

        $(".carousel>.carousel-right").remove();

    }


    //$("#app").remove();
    $(".csdn-side-toolbar").remove();

    //去首页博客的广告
    $("li").filter(function(index) {
        return $(this).attr("data-type") == "ad";
    }).remove();
    $(".banner-ad-box").remove();
    $("#blogColumnPayAdvert").remove();


    $(".bottom-pub-footer").remove();


    $(document).scroll(function() {

        //优化搜索框 - https://edu.csdn.net/
        if(edu.test(currentURL)){
            $(".nav_box .search_bar").css("width", "290px");
            $(".nav_box  .search_bar .input_search").css("width", "80%");
        }



        //去csdn学院、csdn推文
        if(index.test(currentURL) || index2 == currentURL){

            //去官方直播
            $("li[data-type='liveroom']").remove();
            //去除空li-代码问题
            $("li:empty").remove();


            //暂时不用
            /*$("body>.container>.fixed_content").css({"width":"760px", "float":"left"});
            var navWidth = $("body>.container>#nav").outerWidth();
            var contentWidth = $("body>.container>.fixed_content").outerWidth();
            var realContentWidht = navWidth + contentWidth;
            var documentWidth = $(document).outerWidth();
            $("body>.container").css({"width":realContentWidht+50 + "px","margin-left":documentWidth/2 - realContentWidht/2 + "px !important"});*/



            //去除右侧边栏
            $("#feedlist_id>.list_con").remove();
            $("#feedlist_id>script").remove();
            $("#feedlist_id>img").remove();

            //添加阴影事件 - li样式元素失效，需要重新上样式 - 纳闷
            $("#feedlist_id>li").css({"box-shadow":"0 0 2px grey", "transition":"box-shadow 1s", "border-radius": "20px"});
            $("#feedlist_id>li").css("margin-bottom", "20px");
            //$("#feedlist_id").listview("refresh"); --不起作用
            //$.parser.parse(); - 不起作用



            $(".container>#nav").css("width", "96px");

            var filterObj = $("li").filter(function(index){

                var str = /CSDN学院/
                var str2 = /csdn/
                var currentStr = $(".name>a", this).text();
                //return str.test(currentStr);

                if(str.test(currentStr) || str2.test(currentStr)){
                    return true;
                }


            })
            //console.log(filterObj)
            filterObj.remove();

            //去类似python学习的广告
            $(".fixed_content #feedlist_id>div").remove();

            //$("#csdn-nav-second").css({"position":"initial", "left":"auto"});
            $(".test").css("cssText", "width:1000px !important;");
            //$("#csdn-nav-second").css("cssText", "position:initial !important; left:auto !important;");

            console.log("=====================");

        }

        //去csdn推荐博文
        $(".recommend").parents("li").remove();
        $(".tip_box").remove();
        $(".txt-refrash-new").remove();
        $(".blog-expert-recommend-box").remove();
        $(".recommend-recommend-box").remove();
        $(".right_box").remove();
        $(".enterprise_blog").remove();

        //$("#app").remove();

         //去首页博客的广告
         $("li").filter(function(index) {

             if($(this).attr("data-type") == "ad") {
                 return true;
             }
            
        }).remove();


        //博客右边
        $(".csdn-side-toolbar").remove();

    })

    //$("#csdn-toolbar>.center-block").css("padding-left", "0 !important");

    $(".navL_listBox>.upgrade").nextAll().remove();
    $(".navL_listBox>.upgrade").remove();

      $(".J_nav_top").css("position", "relative");
    $(".nav_l").css({"position":"absolute", "left":"50%"});
    var nav_1_width = $(".nav_l").innerWidth()/2 + "px";
     $(".nav_l").css("margin-left","-" + nav_1_width);



     $("#cooperative_partner").remove();

     $(".fouce_img_box").remove();
     $(".markes").remove();


     $(".appControl").remove();

     $(".userControl>.bord").eq(1).children().eq(1).nextAll().remove();
     $(".userControl>.bord").eq(2).remove();

     $(".pull-left>li").eq(7).nextAll("li").remove();
     $(".pull-left").css({"position":"absolute", "left":"50%"});
     var wPull = $(".pull-left").outerWidth()/2 + "px";
     $(".pull-left").css("margin-left", "-" + wPull );

    setInterval(function(){

             if(profile.test(currentURL)) {
                 $(".pull-left>li").eq(7).nextAll("li").remove();
                 $(".pull-left").css({"position":"absolute", "left":"50%"});
                 var wPull = $(".pull-left").outerWidth()/2 + "px";
                 $(".pull-left").css("margin-left", "-" + wPull );
                // $("head").append("<script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>");
                 //$(".userControl>.bord").eq(1).children().eq(1).nextall().remove();
             }

     },2000);


    if(search.test(currentURL)) {

        $(".main-container").css("position","relative");
        var length = $(".con-l").width() / 2;
        var left = "calc(50% - " + length + "px)";
        $(".con-l").css( {"left":left, "position":"absolute"} );
         $(".search-type>li:last-child").remove();
    }


    if(index.test(currentURL) || index2 == currentURL) {
        // 自己新增
        //$(".container").eq(1).css("margin-left", "230px");
        $(".pull-left>li").eq(7).nextAll("li").remove();
        $(".pull-left").css({"position":"absolute", "left":"50%"});
        var wPull = $(".pull-left").outerWidth()/2 + "px";
        $(".pull-left").css("margin-left", "-" + wPull );

        $("aside").remove();

    }

    if(bbs.test(currentURL)){
        setTimeout(function () {
            $(".js_show_topic").click();
            document.getElementsByClassName("pulllog-box")[0].remove(); // 底部广告
            $(".mediav_ad").remove();       // 帖子尾部广告
            $(".post_recommend").remove();  // 帖子内[CSDN推荐]
            $(".ad_item").remove(); // 右侧广告
        }, bbsInterval);
    }else if (blog.test(currentURL)){

        $(".pull-left>li").eq(7).nextAll("li").remove();
        $(".pull-left").css({"position":"absolute", "left":"50%"});
        var wPull = $(".pull-left").outerWidth()/2 + "px";
        $(".pull-left").css("margin-left", "-" + wPull );
        $(".recommend-right").remove(); $(".tool-box").remove();
        $("body").css("background-image","none");
        $(".custom-box").remove();

        $(window).unbind("scroll");
         $("blog-content-box").css("float","right");
          $("aside").css("float","right");
          $("aside").css("margin-right", "10px");



        csdn.copyright.init("", "", ""); //去除剪贴板劫持
        localStorage.setItem("anonymousUserLimit", ""); // 免登陆
        if (document.getElementsByClassName("btn-readmore")[0]){
            document.getElementsByClassName("btn-readmore")[0].click();
        } //自动展开
        if (document.getElementsByClassName("comment-list-box")[0]){

            // FIXME 待修复
            //document.getElementsByClassName("comment-list-box")[0].removeAttribute("style");
        } //自动展开
        $("#content_views").unbind("click");//移除url拦截
        setTimeout(function () {
            if (document.getElementsByClassName("csdn-tracking-statistics mb8 box-shadow")[0]) {
                document.getElementsByClassName("csdn-tracking-statistics mb8 box-shadow")[0].remove(); //左上广告
            }
            document.getElementById("asideFooter").remove();
            if (document.getElementById("adContent")) {
                document.getElementById("adContent").remove();
            }
            if (document.getElementsByClassName("p4course_target")[0]) {
                document.getElementsByClassName("p4course_target")[0].remove(); //左上广告
            }
            document.getElementsByClassName("bdsharebuttonbox")[0].remove();
            document.getElementsByClassName("vip-caise")[0].remove();
            if (document.getElementsByClassName("fourth_column")[0]) {
                document.getElementsByClassName("fourth_column")[0].remove(); //左上广告
            }
        }, interval);
        setTimeout(function () {
            if ($("div[id^='dmp_ad']")[0]) {
                $("div[id^='dmp_ad']")[0].remove();
            }
            if (document.getElementsByClassName("fourth_column")[0]) {
                document.getElementsByClassName("fourth_column")[0].remove();
            }
        }, sideInterval);
        setTimeout(function () {
            if (document.getElementsByClassName("pulllog-box")[0]) {
                document.getElementsByClassName("pulllog-box")[0].remove(); // 底部广告
            }
        
            if (document.getElementsByClassName("p4course_target")[0]) {
                document.getElementsByClassName("p4course_target")[0].remove();
            }
        }, sideInterval);
        setTimeout(function () {
            var hot = document.getElementsByClassName("type_hot_word");
            var recommend = document.getElementsByClassName("recommend-ad-box");
            for (var i = (hot.length - 1); i >= 0; i--) {
                hot[i].remove();
            }
            for (var j = (recommend.length - 1); j >= 0; j--) {
                recommend[j].remove();
            }
            if (document.getElementsByClassName("fourth_column")[0]) {
                document.getElementsByClassName("fourth_column")[0].remove();
            }
        }, sideInterval);
        setTimeout(function () {
            for(var x=470; x<490; x++){
                var kp_box = document.getElementById("kp_box_"+x); //右侧广告
                if(kp_box) {
                    kp_box.remove();
                }
            }
        }, 5000);
    } else if (iteye.test(currentURL)) {
        setInterval(function(){
            document.getElementById('btn-readmore').click();
        }, iteyeInterval);
        setTimeout(function () {
            document.getElementsByClassName("blog-sidebar")[0].remove();
            document.getElementById('main').style.width = '1000px';
        }, sideInterval);
    }
})();