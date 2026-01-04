// ==UserScript==
// @name         clean CSDN blog
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  还你一个干净的阅读体验
// @author       Lynxz
// @match        *://*.blog.csdn.net
// @match        *://*.blog.csdn.net/*
// @match        *://bbs.csdn.net/*
// @match        *://so.csdn.net/*
// @match        *://www.csdn.net
// @match        *://www.csdn.net/*
// @match        *://download.csdn.net
// @match        *://download.csdn.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31968/clean%20CSDN%20blog.user.js
// @updateURL https://update.greasyfork.org/scripts/31968/clean%20CSDN%20blog.meta.js
// ==/UserScript==
// CSDN文章清除博客文章侧边栏和广告元素
// CSDN已自带jquery了,不需要添加此依赖
(function() {
    'use strict';
    $('#btn-readmore').click();
    // 获取当前地址url
    var url = location.href;
    // 正则匹配博客部分
    var blogcsdn = /blog.csdn.net/i;
    if (blogcsdn.test(url)) {
        // 页面主体部分轮播广告
        $(".box-box-large").remove();
        $(".leftPop").remove();
        $("#asideProfile").next().remove();
        $($("#asideFooter").find("div").first()).remove();
        // 隐藏下面登录注册
        $(".pulllog-box").remove();
        // 首页头部广告
        $(".banner-ad-box").remove();
        // 去除列表自动加载的广告
         $(".recommend-box").bind("DOMNodeInserted", function (e) {
            for (var i = 0; i < $(".recommend-ad-box").length; i++) {
               // 去除文章列表中间广告
               if ($(".recommend-ad-box").attr("class") == "recommend-item-box recommend-ad-box") {
                  $(".recommend-ad-box").remove();
             }
            }
       });
       $($("aside div").first()).remove();
				// 右下角弹窗
		    $("#layerd").remove();
		    $("#reportContent").remove();
		    $(".tool-box").remove();
		    //$("#asideNewComments,.recommend-box,.edu-promotion,.comment-box,aside").remove();
		    //底部空白
		    $("main").css("margin-bottom","0px");
		    //阅读全文
		    $('#article_content').css("height","");
		    $("div.readall_box,#btn-readmore,div.hide-article-box.text-center.csdn-tracking-statistics.tracking-click").remove();
		    //顶部csdn
		    $("div.csdn-toolbar.csdn-toolbar.tb_disnone").remove();
		    //底部版权声明
		    $(".article-copyright").remove();
		    //上移按钮
		    $(".meau-gotop-box").remove();
		    //文章居中
		    $("main").css("float","none");
		    $("main").css("margin","auto");
		    //右下角关闭按钮
		    $(".box-box-default").remove();
		    //上部广告
		    $(".advert-bg").remove();
		    $(".advert-cur").remove();
			$('newsfeed').remove();
			//window.addEventListener ("load", removeIframe, false);
		    //function removeIframe () {
		    //    $('iframe').remove();
            //}
           // $(".blog-content-box ~ div").remove();//todo:streamline my code
    }

    let bodyWidth = $(document.body).width();
    var oriWidth = $('#main').width() || bodyWidth;
    // 删除blog页面左侧个人资料等侧边栏
    $('#side').remove();
    //$(".fl").remove();
    // 移除blog内容区域右侧上层互动的二维码和快速回复,我要收藏等元素
    // $('.csdn-tracking-statistics:not(.article_content)').remove();
    $('.left_fixed').remove();
    $('.recommend_list').remove();
    $('.pulllog-box').remove();
    $('aside').remove();
    $('#layerd').remove();
    $('#rasss').remove();
    // 设置blog内容区域width 100%,填满移除侧边栏后的区域
    $('#main').css('padding-left',0);
    $('#main').css('width','100%');
    $('#main .main').css('padding-left','0px');
    $('#main .main').css('margin-left','0px');
    $('div.article_content..csdn-tracking-statistics').css('height','100%');
    $('#article_content').removeAttr('style');
    let curWidth = $('#main').width() || $('#article_content').width();
    // 设置文章内容区域的宽度,默认880px,避免阅读时眼球左右转动幅度过大,自行按需调整吧
    let w = $('#article_details').width() || oriWidth;
    let defaultWidth = 880;
    let margin = (w - defaultWidth) / 2 ;
    console.log("oriWidth = " + oriWidth + " curWidth = " + curWidth + "  w = " + w + " margin = " + margin);
    if(margin > 10){
        $('.container').width(defaultWidth);
        $('main').width(defaultWidth);
        $('#article_details').width(defaultWidth);
        $('#article_details').css('margin-left', margin +'px');
    }
    $('.meau-gotop-box').remove();
    $('.tool-box').remove();
})();