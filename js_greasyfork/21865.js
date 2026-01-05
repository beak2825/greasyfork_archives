// ==UserScript==
// @name         蜜柑计划助手
// @namespace    http://zhihaofans.com/
// @version      0.8.2
// @description  添加搜索链接到番的页面
// @author       zhihaofans
// @match        http://mikanani.me/*
// @grant        none
// @icon         http://mikanani.me/Images/favicon.ico
// @license      GPL version 3
// @note         脚本地址：https://greasyfork.org/zh-CN/scripts/21115
// @downloadURL https://update.greasyfork.org/scripts/21865/%E8%9C%9C%E6%9F%91%E8%AE%A1%E5%88%92%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/21865/%E8%9C%9C%E6%9F%91%E8%AE%A1%E5%88%92%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
//RssPage
function RssPage()
{
    var name=$(".w-other-c").text();
    console.log('"'+name+'"');
    var bilibili='<a href="http://search.bilibili.com/bangumi?keyword='+name+'" class="btn episode-btn" id="bilibili-search" target="_blank">Bilibili</a>';
    var acfun='<a href="http://www.acfun.tv/search/#query='+name+';channel=1" class="btn episode-btn" id="acfun-search" target="_blank">Acfun</a>';
    var bangumi='<a href="http://bangumi.tv/subject_search/'+name+'?cat=2" class="btn episode-btn" id="bangumi-search" target="_blank">Bangumi</a>';
    var menu=$(".leftbar-nav");
    menu.html(menu.html()+"\n"+acfun+"\n"+bilibili+"\n"+bangumi+"\n");
}
//BangumiPage
function BangumiPage()
{
    $(".header").html($(".header").html()+'&nbsp;&nbsp;<a href="javascript:void(0)" id="leftside-list-hidden">(隐藏)</a>&nbsp;&nbsp;<a href="javascript:void(0)" id="leftside-list-hidden-wait">请稍候...</a>');
    $("#leftside-list-hidden-wait").hide();
    var name=$(".bangumi-title").text();
    console.log('"'+name+'"');
    var num=name.indexOf(" ");
    for(var a=0;a<num;a++)
    {
        if(name.substr(0,1)==" ")
        {
            name=name.substr(1);
        }
        console.log('"'+name+'"');
        if(name.substr(-1)==" ")
        {
            name=name.substr(0,name.length-1);
        }
        console.log('"'+name+'"');
    }
    var title='<p class="bangumi-info">搜索链接：<br>';
    var bilibili='<a href="http://search.bilibili.com/bangumi?keyword='+name+'" class="w-other-c" id="bilibili-search" target="_blank">Bilibili</a>';
    var acfun='<a href="http://www.acfun.tv/search/#query='+name+';channel=1" class="w-other-c" id="acfun-search" target="_blank">Acfun</a>';
    var bangumi='<a href="http://bangumi.tv/subject_search/'+name+'?cat=2" class="w-other-c" id="bangumi-search" target="_blank">Bangumi</a>';
    var menu=$(".pull-left.leftbar-container .bangumi-info:last");
    menu.prop("outerHTML",menu.prop("outerHTML")+"\n<p class=\"bangumi-info\">搜索链接：<br>"+acfun+"|"+bilibili+"|"+bangumi+"</p>\n");
}
//Start
$(document).ready(function(){
    var url=document.URL;
    if(url.substr(0, 32)=="http://mikanani.me/Home/Episode/")
    {
        RssPage();
    }
    if(url.substr(0, 32)=="http://mikanani.me/Home/Bangumi/")
    {
        BangumiPage();
    }
    if(url.substr(0, 19)=="http://mikanani.me/")
    {
        var foot='<div class="container text-center" id="sk-footer"><div><a target="_blank" href="https://greasyfork.org/zh-CN/scripts/21865-%E8%9C%9C%E6%9F%91%E8%AE%A1%E5%88%92%E5%8A%A9%E6%89%8B">蜜柑计划助手</a> by <a target="_blank" href="https://blog.zhihaofans.com">zhihaofans</a></div></div>';
        $(".footer").html($(".footer").html()+foot);
    }
    $("#leftside-list-hidden").click(function(){
        $("#leftside-list-hidden-wait").show();
        $("#leftside-list-hidden").hide();
		$(".list-unstyled").slideToggle(1000,function(){
			if($("#leftside-list-hidden").text()=="(隐藏)")
			{
				$("#leftside-list-hidden").text("(显示)");
				$("#leftside-list-hidden-wait").hide();
				$("#leftside-list-hidden").show();
			}
			else
			{
				$("#leftside-list-hidden").text("(隐藏)");
				$("#leftside-list-hidden-wait").hide();
				$("#leftside-list-hidden").show();
			}
		});
        

    });
    $('#leftside-list-hidden').click(function () {
        $('#leftside-list-hidden-wait').show();
        $('#leftside-list-hidden').hide();
        if ($('#leftside-list-hidden').text() == '(隐藏)')
        {
            $('.list-unstyled').hide(1000, leftside_hidden);
        } 
        else
        {
            $('.list-unstyled').show(1000, leftside_show);
        }
    });
});

