// ==UserScript==
// @name         超好用的哔哩哔哩可自定义倍速+可拖动以调整位置+具有记忆位置功能（网页刷新后仍在上次调整后的相同位置），最高可达到5倍速，且解决了网站里点击除视频外的其他地方后无法用方向键和空格键调控视频播放的问题）
// @namespace    http://tampermonkey.net/
// @version      4.1.0
// @description   超好用的哔哩哔哩可自定义倍速和自行拖动调整位置播放条/菜单栏（倍速播放条可通过自行拖拽调整位置且有位置记忆功能，最高可达到5倍速，且解决了网站里点击除视频外的其他地方后无法用方向键和空格键调控视频播放的问题2）
// @author       薪炎，拔剑！
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        unsafeWindow
// @require  https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/430551/%E8%B6%85%E5%A5%BD%E7%94%A8%E7%9A%84%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%8F%AF%E8%87%AA%E5%AE%9A%E4%B9%89%E5%80%8D%E9%80%9F%2B%E5%8F%AF%E6%8B%96%E5%8A%A8%E4%BB%A5%E8%B0%83%E6%95%B4%E4%BD%8D%E7%BD%AE%2B%E5%85%B7%E6%9C%89%E8%AE%B0%E5%BF%86%E4%BD%8D%E7%BD%AE%E5%8A%9F%E8%83%BD%EF%BC%88%E7%BD%91%E9%A1%B5%E5%88%B7%E6%96%B0%E5%90%8E%E4%BB%8D%E5%9C%A8%E4%B8%8A%E6%AC%A1%E8%B0%83%E6%95%B4%E5%90%8E%E7%9A%84%E7%9B%B8%E5%90%8C%E4%BD%8D%E7%BD%AE%EF%BC%89%EF%BC%8C%E6%9C%80%E9%AB%98%E5%8F%AF%E8%BE%BE%E5%88%B05%E5%80%8D%E9%80%9F%EF%BC%8C%E4%B8%94%E8%A7%A3%E5%86%B3%E4%BA%86%E7%BD%91%E7%AB%99%E9%87%8C%E7%82%B9%E5%87%BB%E9%99%A4%E8%A7%86%E9%A2%91%E5%A4%96%E7%9A%84%E5%85%B6%E4%BB%96%E5%9C%B0%E6%96%B9%E5%90%8E%E6%97%A0%E6%B3%95%E7%94%A8%E6%96%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/430551/%E8%B6%85%E5%A5%BD%E7%94%A8%E7%9A%84%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%8F%AF%E8%87%AA%E5%AE%9A%E4%B9%89%E5%80%8D%E9%80%9F%2B%E5%8F%AF%E6%8B%96%E5%8A%A8%E4%BB%A5%E8%B0%83%E6%95%B4%E4%BD%8D%E7%BD%AE%2B%E5%85%B7%E6%9C%89%E8%AE%B0%E5%BF%86%E4%BD%8D%E7%BD%AE%E5%8A%9F%E8%83%BD%EF%BC%88%E7%BD%91%E9%A1%B5%E5%88%B7%E6%96%B0%E5%90%8E%E4%BB%8D%E5%9C%A8%E4%B8%8A%E6%AC%A1%E8%B0%83%E6%95%B4%E5%90%8E%E7%9A%84%E7%9B%B8%E5%90%8C%E4%BD%8D%E7%BD%AE%EF%BC%89%EF%BC%8C%E6%9C%80%E9%AB%98%E5%8F%AF%E8%BE%BE%E5%88%B05%E5%80%8D%E9%80%9F%EF%BC%8C%E4%B8%94%E8%A7%A3%E5%86%B3%E4%BA%86%E7%BD%91%E7%AB%99%E9%87%8C%E7%82%B9%E5%87%BB%E9%99%A4%E8%A7%86%E9%A2%91%E5%A4%96%E7%9A%84%E5%85%B6%E4%BB%96%E5%9C%B0%E6%96%B9%E5%90%8E%E6%97%A0%E6%B3%95%E7%94%A8%E6%96%B9.meta.js
// ==/UserScript==
(function() {
    'use strict';

    //$("body").on("click",function(){var timer=setTimeout(function(){$(".bilibili-player-video-info").click();},50);});
    $(function(){
        console.log($(".bui-collapse-arrow-text"));
        // $("body").prepend("<div id=rate><div>");
        // $(".bui-collapse-arrow").append("<div id=rate><div>");
        //$("#viewbox_report").prepend("<div id=rate><div>");
        var time=setInterval(function(){
            if($(".bui-collapse .bui-collapse-header .bui-collapse-arrow").css("right")=="14px"){
                $(".bui-collapse .bui-collapse-header .bui-collapse-arrow").css({right:"170px"});
                console.log("change");
                clearInterval(time);
            }
        },1);

        $("body").prepend("<div id=rate><div>");
        $("#rate").css({
            overflow:"hidden",
            position:"absolute",
            //right:"393px",
            //top:"160px",
            left:"700px",
            top:"158px",
            width:"200px",
            height:"33px",
            borderRadius:"9px",
            textAlign:"center",
            backgroundColor:"#b2bec3",
            zIndex:"2147483647"
        });
        firstIn();
        $("#rate").prepend("<button class='rateitem'>4</button>");$("#rate").prepend("<button class='rateitem'>3</button>");
        $("#rate").prepend("<button class='rateitem'>2.5</button>");$("#rate").prepend("<button class='rateitem'>2</button>");
        $("#rate").prepend("<button class='rateitem'>1.5</button>");$("#rate").prepend("<button class='rateitem'>1.25</button>");
        $("#rate").prepend("<button class='rateitem'>1</button>");$("#rate").prepend("<button class='rateitem'>0.85</button>");
        $(".rateitem").css({
            width:"25px",
            height:"33px",
            lineHeight:"33px",
            outline:"none",
            border:"none",
            fontWeight:"bold",
            backgroundColor:"#b2bec3",
        });
        $("#rate button").on("mouseover",function(){
            $(this).css({
                backgroundColor:"#dfe6e9"
            });
        });
        $("#rate button").on("mouseout",function(){
            $(this).css({
                backgroundColor:"#b2bec3"
            });
        });
        $("#rate button").on("mousedown",function(){
            $(this).css({
                backgroundColor:"#d1d8e0"
            });
        });
        $("#rate button").on("mouseup",function(){
            $(this).css({
                backgroundColor:"#dfe6e9"
            });
        });

        $("#rate button").on("click",function(){
            console.log($(this).text());
            $($(".bpx-player-ctrl-playbackrate-menu").children()[3]).attr('data-value',($(this).text()))
            console.log($($(".bpx-player-ctrl-playbackrate-menu").children()[3]).attr('data-value'),123)
            $($(".bpx-player-ctrl-playbackrate-menu").children()[3]).click()
            var timer1=setTimeout(function(){clearTimeout(timer1);$(".bilibili-player-video-info").click();return;},50);

        });
        function move(e){
            var x=e.pageX-$("#rate").offset().left;
            var y=e.pageY-$("#rate").offset().top;
            $("#rate").on("mousemove",function(e){
         //       console.log(e.pageX,e.pageY);
                $("#rate").css({
                    top:e.pageY-y,
                    left:e.pageX-x
                });
            });
        }
        function cancelMove(){
            $("#rate").off("mousemove");
        }
        $("#rate").on("mousedown","button",move);
        $("#rate").on("mouseup","button",cancelMove);
        function firstIn(){
            var p={x:$("#rate").css("left"),y:$("#rate").css("top")};
            if(localStorage.getItem("ratePosition")==null){
                console.log("Can't find default position!");
                console.log("position now is "+ p);
                localStorage.setItem("ratePosition",JSON.stringify(p));
                console.log("setItem complete..");
            }
            else{
                console.log("Find local positional data!");
                $("#rate").css({
                left:getxy().x,
                top:getxy().y
                })
            }
        }
        function getxy(){
            return JSON.parse(localStorage.getItem("ratePosition"));
        }
        function recordxy(){
            var p=getxy();
            console.log("up and record");
            p.x=$("#rate").css("left");
            p.y=$("#rate").css("top");
            console.log(p.x,p.y);
            localStorage.setItem("ratePosition",JSON.stringify(p));
        }
        $("#rate").on("mouseup","button",recordxy);

    });
    // Your code here...
})();