// ==UserScript==
// @name         简书目录自动生成-浮框版
// @name:zh-CN 简书目录自动生成-浮框版
// @description:zh-cn 简书目录自动生成-浮框版
// @namespace  https://www.jianshu.com/u/739c8d412b4c
// @version      0.0.1
// @description  try to take over the world!
// @author       Billy
// @match        http://www.jianshu.com/p/*
// @match        https://www.jianshu.com/p/*
////@require      http://code.jquery.com/jquery-latest.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/39962/%E7%AE%80%E4%B9%A6%E7%9B%AE%E5%BD%95%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90-%E6%B5%AE%E6%A1%86%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/39962/%E7%AE%80%E4%B9%A6%E7%9B%AE%E5%BD%95%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90-%E6%B5%AE%E6%A1%86%E7%89%88.meta.js
// ==/UserScript==
// 更多:https://www.jianshu.com/p/1e673fe49a4b
// 参考:https://www.jianshu.com/p/d02157db09d2
// 参考:https://github.com/chris-peng/markdown_nav


//是否显示导航栏
var showNavBar = true;
//是否展开导航栏
var expandNavBar = true;

$(document).ready(function(){
     'use strict';


    //与元数据块中的@grant值相对应，功能是生成一个style样式
    var menustyle='.BlogAnchor {background: #f1f1f1;padding: 10px;line-height: 180%;position: fixed;left: 48px;top: 48px;border: 1px solid #aaaaaa;}.BlogAnchor p {font-size: 18px;color: #15a230;margin: 0 0 0.3rem 0;text-align: right;}.BlogAnchor .AnchorContent {padding: 5px 0px;overflow: auto;}.BlogAnchor li {text-indent: 0.5rem;font-size: 14px;list-style: none;}.BlogAnchor li .nav_item {padding: 3px;}.BlogAnchor li .item_h1 {margin-left: 0rem;}.BlogAnchor li .item_h2 {margin-left: 2rem;font-size: 0.8rem;}.BlogAnchor li .nav_item.current {color: white;background-color: #5cc26f;}#AnchorContentToggle {font-size: 13px;font-weight: normal;color: #FFF;display: inline-block;line-height: 20px;background: #5cc26f;font-style: normal;padding: 1px 8px;}.BlogAnchor a:hover {color: #5cc26f;}.BlogAnchor a {text-decoration: none;}';
    GM_addStyle(menustyle);

    var h1s = $("body").find("h1");
    var h2s = $("body").find("h2");
    var h3s = $("body").find("h3");
    var h4s = $("body").find("h4");
    var h5s = $("body").find("h5");
    var h6s = $("body").find("h6");

    var headCounts = [h1s.length, h2s.length, h3s.length, h4s.length, h5s.length, h6s.length];
    var vH1Tag = null;
    var vH2Tag = null;
    for(var i = 0; i < headCounts.length; i++){
        if(headCounts[i] > 0){
            if(vH1Tag == null){
                vH1Tag = 'h' + (i + 1);
            }else{
                vH2Tag = 'h' + (i + 1);
            }
        }
    }
    if(vH1Tag == null){
        return;
    }

    $(".show-content").prepend('<div class="BlogAnchor">' +
        '<span style="color:red;position:absolute;top:-6px;left:0px;cursor:pointer;" onclick="$(\'.BlogAnchor\').hide();">×</span>' +
        '<p>' +
        '<b id="AnchorContentToggle" title="收起" style="cursor:pointer;">目录▲</b>' +
        '</p>' +
        '<div class="AnchorContent" id="AnchorContent"> </div>' +
        '</div>' );

    var vH1Index = 0;
    var vH2Index = 0;
    var menuIndex = 0;
    $("body").find("h1,h2,h3,h4,h5,h6").each(function(i,item){
        var id = '';
            // var name = '';
            var tag = $(item).get(0).tagName.toLowerCase();
            //不同标题,不同className,不同字体大小
            var className = '';
            if (tag == vH1Tag) {
                // id = name = ++vH1Index;
                // name = id;
                vH2Index = 0;
                className = 'item_h1';
            } else if (tag == vH2Tag) {
                // id = vH1Index + '_' + ++vH2Index;
                // name = vH1Index + '.' + vH2Index;
                className = 'item_h2';
            }
            //修改id生成策略
            id = "_" + menuIndex;
            menuIndex++;

        $(item).attr("id","wow"+id);
        $(item).addClass("wow_head");

        $("#AnchorContent").css('max-height', ($(window).height() - 180) + 'px');
        //$("#AnchorContent").append('<li><a class="nav_item '+className+' anchor-link" onclick="return false;" href="#" link="#wow'+id+'">'+name+" · "+$(this).text()+'</a></li>');
        $("#AnchorContent").append('<li><a class="nav_item '+className+' anchor-link" onclick="return false;" href="#" link="#wow'+id+'">'+$(this).text()+'</a></li>');
    });

    $("#AnchorContentToggle").click(function(){
        var text = $(this).html();
        if(text=="目录▲"){
            $(this).html("目录▼");
            $(this).attr({"title":"展开"});
        }else{
            $(this).html("目录▲");
            $(this).attr({"title":"收起"});
        }
        $("#AnchorContent").toggle();
    });
    $(".anchor-link").click(function(){
        $("html,body").animate({scrollTop: $($(this).attr("link")).offset().top}, 500);
    });

    var headerNavs = $(".BlogAnchor li .nav_item");
    var headerTops = [];
    $(".wow_head").each(function(i, n){
        headerTops.push($(n).offset().top);
    });
    $(window).scroll(function(){
        var scrollTop = $(window).scrollTop();
        $.each(headerTops, function(i, n){
            var distance = n - scrollTop;
            if(distance >= 0){
                $(".BlogAnchor li .nav_item.current").removeClass('current');
                $(headerNavs[i]).addClass('current');
                return false;
            }
        });
    });

    if(!showNavBar){
        $('.BlogAnchor').hide();
    }
    if(!expandNavBar){
        $(this).html("目录▼");
        $(this).attr({"title":"展开"});
        $("#AnchorContent").hide();
    }
});
