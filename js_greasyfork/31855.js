// ==UserScript==
// @name         Reddit S1 样式
// @namespace    http://tampermonkey.net/
// @version      0.17
// @description  try to take over the world!
// @author       You
// @match        https://www.reddit.com/r/saraba1st/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31855/Reddit%20S1%20%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/31855/Reddit%20S1%20%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==

//引入jQuery
var script=document.createElement("script");
script.type="text/javascript";
script.src="http://apps.bdimg.com/libs/jquery/2.1.1/jquery.min.js";
document.getElementsByTagName('head')[0].appendChild(script);

(function() {

    'use strict';

    var currentURL = window.location.href;
    if(currentURL.indexOf("comments") > 0 ){
        initTopicPage();
    }else if(currentURL.indexOf("submit") > 0 ){
        if(top.location != self.location){
            initForumPageSendFrame();
        }else{
            //alert("不在iframe中");
        }
    }else {
        initForumPage();
    }

})();
//帖子列表页
function initForumPage(){
    setTimeout(function(){

        $(".title.may-blank").css("color","#022C80");

        $(".title.may-blank").css("font","14px/1.5 Tahoma,'Microsoft Yahei','Simsun'");

        //移除最后点击的帖子的虚线边框
        $(".last-clicked").removeClass("last-clicked");

        $(".thing.link").css("border-top","1px solid");
        $(".thing.link").css("border-left","1px solid");
        $(".thing.link").css("border-right","1px solid");
        $(".link:last").css("border-bottom","1px solid");
        $(".thing.link").css("border-color","#022C80");

        //新窗口打开帖子
        $(".thing.link a").attr("target","_blank");

        //帖子列表鼠标移入移出改变颜色
        $(".thing.link").mouseover (function(){
            $(this).css("background-color","#CCCC99");
        });
        $(".thing.link").mouseout (function(){
            $(this).css("background-color","");
        });

        $(".thing.link").css("margin-bottom","0px");

        $(".title").css("display","inline");

        $(".tagline").css("float","right");
        $(".tagline").css("margin-right","7px");
        $(".flat-list.buttons").css("float","right");

        //序号删除
        $(".rank").remove();
        //右侧删除
        $(".side").remove();
        //分享删除
        $(".share").remove();
        //移除顶部导航栏
        $("#sr-header-area").remove();

        //横幅右下角的用户信息背景色删除
        $("#header-bottom-right").css("background-color","#CCCC99");
        //横幅右下角的用户信息上移
        $("#header-bottom-right").css("margin-bottom","3px");

        //设置每个帖子未展开时的宽度
        $(".entry").css("min-height","38px");

        //移除评分
        $(".midcol").remove();

        $(".top-matter").css("margin-top","8px");

        $(".expando-button").css("margin-top","0px");

        $(".entry .buttons li a").css("font-weight","normal");
        $(".tagline>.author").css("font-weight","normal");
        $(".tagline>.author").css("font-size","10px");

        //头图左移让黑球居左
        $("#header-img").css("margin-left","-461px");
        //横幅字体取消加粗
        $(".tabmenu li").css("font-weight","normal");
        //移除横幅选中项的蓝色边框
        $(".tabmenu li.selected a").css("border","0px");

        //移除横幅底部的蓝色边框
        $("#header").css("border-bottom","0px");
        //横幅当前选中的链接文字加粗
        $(".selected").css("font-weight","bold");

        //修改头图链接为r/saraba1st
        $("#header-img-a").attr("href","https://www.reddit.com/r/saraba1st/");
        //移除横幅左下角saraba1st
        $(".pagename.redditname").remove();
        //移除底部关于信息
        $(".footer.rounded").remove();

        $(".nav-buttons").css("margin-top","10px");

        $("#header-bottom-left").css("background-color","#F6F7EB");
        $("#header").css("background-color","#CCCC99");


        $(".tabmenu").css("background-color","#CCCC99");//棕色
        $(".tabmenu").css("padding-top","5px");
        $(".tabmenu").css("padding-bottom","5px");
        $(".tabmenu").css("width","100%");
        $(".tabmenu").css("border-top","1px solid");
        $(".tabmenu").css("border-bottom","1px solid");
        $(".tabmenu").css("border-color","#022C80");


        $(".nextprev").html($(".nextprev").html().replace("查看更多：",""));

        $(".next-button a, .prev-button a").css("padding-top","4px");
        $(".next-button a, .prev-button a").css("padding-bottom","5px");
        $(".next-button a, .prev-button a").css("padding-left","10px");
        $(".next-button a, .prev-button a").css("padding-right","10px");
        $(".nextprev a, .next-suggestions a").css("border-radius","0px");
        $(".nextprev a, .next-suggestions a").css("background","#F6F7EB");//白色
        $(".nextprev a, .next-suggestions a").css("border","1px solid #022C80");//深蓝色
        $(".nextprev a, .next-suggestions a").css("font","12px/1.5 Tahoma,'Microsoft Yahei','Simsun'");//深蓝色
        $(".nextprev a, .next-suggestions a").css("color","#022C80");//深蓝色

        $(".separator").css("border-left","0px");
        $(".separator").css("padding-left","0px");
        //翻页按钮居右
        $(".nav-buttons").css("float","right");
    },30);

    setTimeout(function(){
        $("<iframe width='1000px' height='300px' id='Frame1'></iframe>").prependTo('.footer-parent');
        $("#Frame1").attr("src", "https://www.reddit.com/r/saraba1st/submit?selftext=true");
        $("#Frame1").find(".tagline a").clickk();
    },30);
}


//帖子详情页
function initTopicPage(){
    setTimeout(function(){

        //移除评分
        //$(".midcol.unvoted").remove();
        //头部背景色为白色
        $("#header-bottom-left").css("background-color","#F6F7EB");

        //修改头图链接为r/saraba1st
        $("#header-img-a").attr("href","https://www.reddit.com/r/saraba1st/");

        //横幅右下角的用户信息背景色删除
        $("#header-bottom-right").css("background-color","#CCCC99");
        //横幅右下角的用户信息上移
        $("#header-bottom-right").css("margin-bottom","3px");

        //移除横幅左下角saraba1st
        $(".pagename.redditname").remove();
        //移除顶部导航栏
        $("#sr-header-area").remove();

        //头图左移让黑球居左
        $("#header-img").css("margin-left","-461px");
        //横幅字体取消加粗
        $(".tabmenu li").css("font-weight","normal");
        //移除横幅选中项的蓝色边框
        $(".tabmenu li.selected a").css("border","0px");
        //移除横幅底部的蓝色边框
        $("#header").css("border-bottom","0px");

        //横幅背景色为棕色
        $(".tabmenu").css("background-color","#CCCC99");//棕色
        //横幅上下内边距
        $(".tabmenu").css("padding-top","5px");
        $(".tabmenu").css("padding-bottom","5px");
        //横幅宽度占满
        $(".tabmenu").css("width","100%");
        //横幅上下加蓝色边框
        $(".tabmenu").css("border-color","#022C80");
        $(".tabmenu").css("border-top","1px solid");
        $(".tabmenu").css("border-bottom","1px solid");

        //标题字体
        $(".title").css("font","700 16px 'Microsoft Yahei','Hei',Tahoma,'SimHei',sans-serif");
        //标题颜色
        $(".title").css("color","#022C80");
        //标题不可点击
        $(".title").removeAttr("href");
        $(".title").removeAttr("data-href-url");
        $(".title").removeAttr("data-inbound-url");
        $(".title").css("cursor", "text");
        $(".title").click(function (event) {
            event.preventDefault();   // 如果<a>定义了 target="_blank“ 需要这句来阻止打开新页面
        });

        //内容字体
        $(".md").css("font","14px/1.5 Tahoma,'Microsoft Yahei','Simsun'");
        //内容颜色
        $(".md").css("color","#022C80");
    },30);
}

//列表页快速发帖
function initForumPageSendFrame(){
    setTimeout(function(){
        //移除头部
        $("#header").remove();
        //移除标题
        $("h1").remove();
        //移除页尾
        $(".footer-parent").remove();
        //右侧删除
        $(".side").remove();
        //多余表单隐藏
        $(".submit_text.roundfield.enabled").hide();
    },30);
}
