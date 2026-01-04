// ==UserScript==
// @name              VIP视频新版_优酷
// @name:en           Kill ADs and Watch VIP Videos
// @namespace         http://mofiter.com/
// @version           1.7
// @description       优酷 去广告不限VIP特权等
// @description:en    maybe it's the most similar VIP videos script to origin website
// @author            mofiter
// @require           https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @match             *://v.youku.com/v_show/*
// @grant             unsafeWindow
// @grant             GM_openInTab
// @grant             GM.openInTab
// @grant             GM_getValue
// @grant             GM.getValue
// @grant             GM_setValue
// @grant             GM.setValue
// @grant             GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/377457/VIP%E8%A7%86%E9%A2%91%E6%96%B0%E7%89%88_%E4%BC%98%E9%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/377457/VIP%E8%A7%86%E9%A2%91%E6%96%B0%E7%89%88_%E4%BC%98%E9%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var jiexiname01="8090"
    var jiexiurl01="https://www.8090g.cn/?url=";//原链接"https://api.bbbbbb.me/jx/?url=";
    var jiexiname02="菜鸟"
    var jiexiurl02="https://jiexi.bm6ig.cn/?url=";
    var jiexiname03="1717"
    var jiexiurl03="https://www.1717yun.com/jx/ty.php?url=";
    var jiexiname04="二度"
    var jiexiurl04="http://jx.du2.cc/?url=";
    var jiexiname05="稳定"
    var jiexiurl05="http://jx.598110.com/?url=";

    if(location.href.indexOf(".youku.com") > -1){
    var wytitle=$(document).attr('title');
      wytitle=wytitle.replace("_1080P在线观看平台", "");
      wytitle=wytitle.replace("_高清1080P在线观看平台", "");
      wytitle=wytitle.replace("_腾讯视频", "");
      wytitle=wytitle.replace("_综艺", "");
      wytitle=wytitle.replace("_电影", "");
      wytitle=wytitle.replace("-爱奇艺", "");
      wytitle=wytitle.replace("-资讯", "");
      wytitle=wytitle.replace("-搜索最新资讯", "");
      wytitle=wytitle.replace("-完整版视频在线观看", "");
      wytitle=wytitle.replace("-综艺节目", "");
      wytitle=wytitle.replace("-电影", "");
      wytitle=wytitle.replace("-电视剧全集", "");
      wytitle=wytitle.replace("-电视剧", "");
      wytitle=wytitle.replace("-儿童", "");
      wytitle=wytitle.replace("-动画片大全儿童教育", "");
      wytitle=wytitle.replace("-高清完整正版视频在线观看", "");
      wytitle=wytitle.replace("-优酷", "");
      wytitle=wytitle.replace("-动漫", "");
      wytitle=wytitle.replace("-综艺", "");
      $("title").html(wytitle);  
      
      
    $(".g-footer").remove();
    $(".feedback").remove();
    $(".focus-wrap").remove();
    $("#right-title-ad-banner").remove();
    $(".qr-wrap").remove();
      
      
    $(".nav-group").css("margin-top","40px");
    $(".g-header-container").css("margin-top","0px");
    $(".g-header").addClass("white");
    $("#uerCenter").remove();
    $(".nav-guide").css("visibility","hidden");
    $("dl:nth-of-type(3)").remove();
    $("dl:nth-of-type(2)").remove();
    $("[href*='/feedback-web/web/']").remove();
    $(".drama-fragment").remove();
    $("#module_basic_relationright").remove();
    $("#module_basic_comment").remove();
    $("#icongroupqrcode").remove();
    $(".vpactionv5_iframe_wrap")
    $("#bpmodule-playpage-fee").remove();
    $(".vpactionv5_iframe_wrap").css("display","none");
    $(".v-sub-action").css("display","none");
    $(".label-preview").parent().parent().css("display","none");
    setTimeout(function () {
        $(".jiexianniu").css({"background":"#d0ad46","height":"28px","width":"56px","color":"#8ef263","font-size":"10px"});
        $(".scroller").height($(".scroll-area").height() - 98);
       var yuanlogo = $(".yk-logo").find("a");
        yuanlogo.attr("target","view_window");
        yuanlogo.attr("href",jiexiurl05+location.href);
      var zimubutton=$(".yk_dm_button");
      var mingzi=zimubutton.prop("className");
      var zhaodaoweizhi=mingzi.indexOf("enable");
    if(zhaodaoweizhi > 0){
      zimubutton.attr("id","tangchuzimushijian");
      document.getElementById("tangchuzimushijian").click();
    };
    }, 3000);
    var jiexibianliang = $("<span class='score drama-wrap text fn-shipin-jiexi-text' align='center'>&#160;"+
                        "<button type='button' class='jiexianniu' value='"+jiexiurl01+"'>▶"+jiexiname01+"</button>&#12288;"+
                        "<button type='button' class='jiexianniu' value='"+jiexiurl02+"'>▶"+jiexiname02+"</button>&#12288;"+
                        "<button type='button' class='jiexianniu' value='"+jiexiurl03+"'>▶"+jiexiname03+"</button>&#12288;"+
                        "<button type='button' class='jiexianniu' value='"+jiexiurl04+"'>▶"+jiexiname04+"</button>"+
                        "");
    $(".normal-title-wrap").prepend(jiexibianliang);
    $(".normal-title-wrap").prepend(jiexibianliang);
    }
    $(".fn-shipin-jiexi-text").click(()=>{
    var bfurl="";
    $(".jiexianniu").css("color","#8ef263");
    var dangqianniu=$(":focus");
    dangqianniu.css("color","#ff0000");
    if(document.getElementById("iframe-player") == null){
    var ykPlayer = $("#ykPlayer");
        bfurl= dangqianniu.attr("value")+ location.href
    var videoPlayer = $("<div id='iframe-div' style='width:100%;height:100%;z-index:2147483647;'><iframe id='iframe-player' frameborder='0' allowfullscreen='true' width='100%' height='100%' src='"+bfurl+"'></iframe></div>"); 
          ykPlayer.empty(); 
    ykPlayer.append(videoPlayer);
    $("#module_basic_player").css("height","100%");
    var player = $(".playarea");
    player.css("height","100%");
    player.css("width","100%");
    player.empty();
    player.append(videoPlayer);
      
    $(".play-paction-wrap").css("width","65%");
      
   } else {
    bfurl= $(":focus").attr("value")+ location.href
       $("#iframe-player").attr("src",bfurl);
   }
});
})();