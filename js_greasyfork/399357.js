// ==UserScript==
// @name         清酒踏月(开心音乐)播放器美化
// @namespace    http://tampermonkey.net/
// @version      0.6.1
// @description  去掉广告和无用按钮，仅保留歌单和搜索，播放音乐时背景更换为对应封面、已播放歌词显示为灰色
// @author       AN drew
// @match        *://*.lkxin.cn/*
// @match        *://*.kxmusic.cn/*
// @match        *://*.newapi.lkxin.cn/*
// @match        *://*.kxyy.ledu360.com/*
// @match        *://*.kxyyw.xyz
// @grant        GM_addStyle
// @require      https://lib.baomitu.com/jquery/3.4.1/jquery.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/399357/%E6%B8%85%E9%85%92%E8%B8%8F%E6%9C%88%28%E5%BC%80%E5%BF%83%E9%9F%B3%E4%B9%90%29%E6%92%AD%E6%94%BE%E5%99%A8%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/399357/%E6%B8%85%E9%85%92%E8%B8%8F%E6%9C%88%28%E5%BC%80%E5%BF%83%E9%9F%B3%E4%B9%90%29%E6%92%AD%E6%94%BE%E5%99%A8%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(window.location.href.indexOf('http://music.kxyyw.xyz')> -1)
    {
        setInterval(function(){
            $('.alert-success').hide();
        },1)
    }
    else
    {
        $(".dropdown-toggle").css({"display":"block","color":"white"})
        $(".dropdown-toggle").text("快捷键")
        $(".dropdown-toggle").attr("title","快捷键")
        $(".dropdown").parent().attr("title","快捷键")

        $(".layui-layer-shade").hide()
        $("#layui-layer1").hide()
        $("#messageBoardContainer").hide();

        GM_addStyle('.btn{z-index:100}');

        for(var i=0; i<7; i++)
            $(".dropdown-menu").children().first().remove()
        $(".dropdown-menu").find("a").each(function(){
            $(this).attr("style","display:block")
            if($(this).text().indexOf("电脑操作快捷键")>-1)
                $(this).css({"text-align":"center","background":"#f5f5f5"})
        })

        setInterval(function(){
            if( $("#music-cover").attr("src")!='images/player_cover.png')
            {
                if($("#blur-img").length==0 && window.location.href!='http://kxmusic.cn/')
                    $("body").prepend("<div id='blur-img'></div>");
                else
                    $("#blur-img").attr("style","background-image:url('"+$("#music-cover").attr("src")+"');"+
                                        'background-repeat: no-repeat;'+
                                        'background-size: cover;'+
                                        'background-position: 50%;'+
                                        '-webkit-filter: blur(65px);'+
                                        'filter: blur(65px);'+
                                        'opacity: .6;'+
                                        '-webkit-transform: translateZ(0);'+
                                        'transform: translateZ(0);')
            }

            $("a").each(function(){
                if($(this).attr("title")!=undefined && ($(this).attr("title").indexOf("上一首") > -1 || $(this).attr("title").indexOf("暂停/继续") > -1 || $(this).attr("title").indexOf("下一首") > -1 || $(this).attr("title").indexOf("循环控制") > -1 || $(this).attr("title").indexOf("静音") > -1 ))
                    return true;
                else if($(this).parent().prop("tagName")=="li")
                    return true;
                else
                    $(this).attr("style","display:none")
            })

            $("span").each(function(){

                if($(this).attr("title")!=undefined && ($(this).attr("title").indexOf("音乐播放列表") > -1 || $(this).attr("title").indexOf("正在播放列表") > -1 || $(this).attr("title").indexOf("点击搜索音乐") > -1 || $(this).attr("title").indexOf("更多") > -1))
                    return true;
                else if($(this).attr("class")!=undefined && ($(this).attr("class")=="music-album" || $(this).attr("class")=="auth-name" || $(this).attr("class")=="music-name" || $(this).attr("class")=="list-num" || $(this).attr("class")=="list-mobile-menu" || $(this).attr("class")=="music-name-cult" || $(this).attr("class")=="info-title" || $(this).attr("class").indexOf("list-icon") > -1))
                    return true;
                else if($(this).attr('data-list')!=undefined)
                    return true;
                else
                    $(this).attr("style","display:none")
            })

            $(".lrc-item.lplaying").prevAll().attr("style","color:rgba(225, 225, 225, .4)");
            $(".lrc-item.lplaying").attr("style","color:#31c27c!important");
            $(".lrc-item.lplaying").nextAll().attr("style","color:rgba(225, 225, 225, .8)");

            $(".logo").remove()
            $(".marquee").remove()
            $(".mask").remove()
            $(".pcd_ad").remove()
            $(".mbd_ad").remove()
            $('.btn[data-action="what"]').hide();
        },1)
    }
})();
