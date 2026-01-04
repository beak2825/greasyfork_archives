// ==UserScript==
// @name         腾讯课堂-免登录看视频
// @namespace    User_Bx
// @version      0.2
// @description  腾讯课堂-免登录看视频v0.2,自动最高清晰度,破三分钟限制
// @author       You
// @match        *://ke.qq.com/*
// @match        *://ke.qq.com/course/*
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @grant        none
// @icon         https://8.url.cn/edu/edu_modules/edu-ui/img/nohash/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/389251/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82-%E5%85%8D%E7%99%BB%E5%BD%95%E7%9C%8B%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/389251/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82-%E5%85%8D%E7%99%BB%E5%BD%95%E7%9C%8B%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==
(function() {
    $(function(){
        window.onload = function () {
            $("span").eq(14).click();
            setTimeout(()=>{
                $(".btn-join").attr("class","btn-joined-free");
                $(".btn-joined-free span").text("已报名");
                $(".vjs-spacer").append("<button>暂停</button>");
                $(".txp_left_controls").append("<button>暂停</button>");
                $(".vjs-spacer button").attr("id","btn");
                $(".txp_left_controls button").attr("id","btn1");
                $("#btn").css({"border":"1px solid #fff","marginTop":"8px","padding":"3px"});
                $("#btn1").css({"border":"1px solid #fff","padding":"3px","background":"rgba(0,0,0,0)"});
                setTimeout(()=>{
                    $(".txp_menuitem").eq(1).click();
                    $(".txp_btn .txp_label").click();
                },2000)
                $(".txp_btn .txp_label").click();
                var t=setInterval(play)
                function play(){
                    if($(".vjs-play-control").hasClass("vjs-paused")||$(".txp_btn_play").hasClass("vjs-paused")||$(".txp_btn_play").attr("data-status")=="play"){
                        $(".vjs-play-control").click();
                        $(".txp_btn_play").click();
                        $(".pause-ctn").css({"opacity":"0"});
                        $(".txp_btn_play").attr("data-status","pause");
                    }
                }
                setInterval(()=>{
                    $(".video-stop-wrap").css("display","none");
                })
                var pau="暂停";
                $(".vjs-spacer button").click(function(){
                    if($(".vjs-spacer button").text()==pau){
                        clearInterval(t)
                        $(".vjs-spacer button").text("开始");
                    }else{
                        t=setInterval(play)
                        $(".vjs-spacer button").text("暂停");
                    }
                })
                $(".txp_left_controls button").click(function(){
                    if($(".txp_left_controls button").text()=="暂停"){
                        clearInterval(t)
                        $(".txp_left_controls button").text("开始");
                    }else{
                        t=setInterval(play)
                        $(".txp_left_controls button").text("暂停");
                    }
                })
            },1000)
        }
    })
})();