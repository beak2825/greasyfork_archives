// ==UserScript==
// @name         [kesai]豆瓣宽屏化
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  豆瓣宽屏化,不同分辨率下需要自己调参数，很麻烦，私人使用，哈哈
// @author       kesai
// @match        https://movie.douban.com/*
// @match        https://www.douban.com/*
// @require      https://cdn.bootcss.com/layer/2.3/layer.js
// @grant        GM.info
// @downloadURL https://update.greasyfork.org/scripts/388193/%5Bkesai%5D%E8%B1%86%E7%93%A3%E5%AE%BD%E5%B1%8F%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/388193/%5Bkesai%5D%E8%B1%86%E7%93%A3%E5%AE%BD%E5%B1%8F%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';


    // Your code here...
    //修改导航栏
    function changeNav() {
        if (window.location.href.indexOf("movie.douban.com") > 0)
            changeMovieNav();
        else
            changeDoubanNav();
    }

    //www.douban.com域名下
    function changeDoubanNav() {
        let configs = {
            height: "42px",
            bgColor: "#12a058",
            color: "white",
            fontSize: 14,
            offSet: "95px"
        }

        setNav(configs);
    }
    //movie.douban.com域名下
    function changeMovieNav() {
        let configs = {
            height: "42px",
            bgColor: "#064584",
            color: "white",
            fontSize: 14,
            offSet: "95px"
        }
        setNav(configs);
    }

    function setNav(configs) {
        if (window.location.href.indexOf("movie.douban.com") > 0)
            $("#db-global-nav").css("height", configs.height);
        else
            $(".global-nav").css("height", configs.height)

        $(".top-nav-doubanapp").css("line-height", configs.height);
        $(".top-nav-reminder").css("line-height", configs.height);
        $(".top-nav-info").css("line-height", configs.height);
        $(".global-nav-items").css("line-height", configs.height);
        $(".global-nav-items li").css("line-height", configs.height);
        //导航栏颜色
        $("#db-global-nav").css("background-color", configs.bgColor);
        $("#db-global-nav .global-nav-items a").css("color", configs.color);
        $("#db-global-nav .top-nav-doubanapp a").css("color", configs.color);
        $("#top-nav-doumail-link").css("color", configs.color);
        $("#db-global-nav .top-nav-reminder  a").css("color", configs.color);
        $(".bn-more").css("color", configs.color);
        //导航栏左侧菜单偏移量
        $(".global-nav-items").css("margin-left", configs.offSet);
        //菜单字体
        $(".global-nav-items li").css("font-size", configs.fontSize);
        $("#db-global-nav").css("font-size", configs.fontSize);
        $("#db-global-nav span").css("font-size", configs.fontSize);
    }



    $(function () {
        $(".nav-primary").css("width", "1320px");
        $(".nav-search.inp").css("width", "800px");
        $(".nav-secondary ").css("width", "1320px");
        $("#wrapper").css("width", "1320px");
        $(".article").css("width", "960px");
        $(".list-wp").css("width", "960px");
        $("#hot-gallery").css("width", "960px");

        //修改导航栏
        changeNav();

        $("#common").css("width", "1080px")
        $("#common div").css("width", "950px")
        $(".aob").css("width", "150px")
        $(".aob").css("height", "180px")
        $("#common div").bind("DOMNodeInserted", function () {
            $(".aob").css("width", "150px")
            $(".aob").css("height", "180px")
        });

        //剧情简介
        $(".related-info").css("width", "760px");

        $(".subject").css("width", "700px");
        $("#info").css("max-width", "550px");

        //个人电影首页
        $(".sub-list").css("width", "960px");
        $(".list-s.clearfix li").css("width", "140px");
        $(".list-s.clearfix li").css("height", "180px");
        //电影详细信息页面
        $(".related-pic-bd").css("text-align", "left")
        $(".related-pic-bd li").css("margin-right", "25px")

        //选电影
        $(".list").bind("DOMNodeInserted", changes);
        $(".list").css("width", "960px");

        //搜索栏
        $(".nav-search .inp").css("width", "820px");

        //add at 2019/08/10
        //修改电影搜索栏旁边的电影榜单链接位置
        $('.movieannual2018').css("margin-left", "300px");
        //add at 2020/10/26
        //调整豆瓣评分栏位置
        $('#interest_sectl').css('margin-top', '-60px')

        //隐藏预告片页面上的导航
        if (window.location.href.lastIndexOf("movie.douban.com/trailer") > 0) {
            $("#db-global-nav").css("display", "none")
            $("#db-nav-movie").css("display", "none")
            $(".stage").css("width", "1320px");
            $("#player").css("width", "1080px");
            $("video").parent().css("width", "1080px")
            $(".main-info").css("width", "1080px")

            $(".stage").css("background-color", "black");
            $("#player").css("background-color", "black");
            $("#player").css("border-right", "1px solid black");


            let video_height = "500px";
            $("#player").css("height", video_height)
            $("#player .cont").css("height", video_height)
            $("video").parent().css("height", video_height)
            $("#player-cover").css("height", video_height)
            $("#player-cover").css("width", "1080px")

            $("#player-cover .recommend a").css("width", "240px");
            $("#player-cover .recommend a img").css("width", "240px");
            $("#player-cover .recommend a img").css("height", "135px");
            $("#player-cover .recommend").css("margin-left", "160px");
            $("#player-cover .recommend").css("width", "1000px");
            $("#player-cover .recommend").css("height", "500px")
            $("#video-list").css("margin-top", "75px")
            //自动切换为全屏播放预告片
            toggleFullScreen();
            window.focus();
            document.addEventListener("keydown", function (e) {
                if (e.code === 'Enter') {
                    toggleFullScreen();
                } else if (e.code === 'Escape') {
                    parent.layer.closeAll();
                }
            }, false);

        }

        function toggleFullScreen() {
            var video = $("video").get(0)
            if (video["webkitDisplayingFullscreen"]) {
                if (video["webkitExitFullScreen"]) video["webkitExitFullScreen"]();
            } else {
                if (video["webkitEnterFullScreen"]) video["webkitEnterFullScreen"]();
            }
        }

        function changes(e) {
            //$(e.target).css("width", "150px");
            $(".item").css("width", "150px");
            $(".item").css("margin-right", "42px");
        }
    });
})();