// ==UserScript==
// @name         Chaturbate PLUS增强插件（去除广告/清爽页面）
// @namespace    http://www.vernonshao.com
// @version      0.5
// @description  去除Chaturbate广告/清爽页面
// @author       Vernon
// @match        *://*xvcams.com/*
// @require     https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/373434/Chaturbate%20PLUS%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6%EF%BC%88%E5%8E%BB%E9%99%A4%E5%B9%BF%E5%91%8A%E6%B8%85%E7%88%BD%E9%A1%B5%E9%9D%A2%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/373434/Chaturbate%20PLUS%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6%EF%BC%88%E5%8E%BB%E9%99%A4%E5%B9%BF%E5%91%8A%E6%B8%85%E7%88%BD%E9%A1%B5%E9%9D%A2%EF%BC%89.meta.js
// ==/UserScript==

(function () {

	//删除所有广告
	var x = document.getElementsByClassName("ad");
	var i;
	for (i = 0; i < x.length; i++) {
		x[i].style.display = "none";
	}

	//删除底部广告
	var y = document.getElementsByClassName("banner");
	var j;
	for (j = 0; j < y.length; j++) {
		y[j].style.display = "none";
	}

	//删除TUBE页面广告
	$("#R").hide();

	//优化页面
	document.getElementsByClassName("c-1")[0].style.width = "99%";
	$(".advanced_search_button").text('高级搜索');
	$(".hide_advanced_search_button").text('隐藏高级搜索');
    $("#main").css('background', '#f8f8f8');
    $(".list li").css('border', 'none');
    $(".list li").css('background', '#fff');

	//页面汉化
	$("#nav li a")[3].text = "标签";
	$("#nav li a")[4].text = "博客";
	$("#nav li a")[5].style.display = 'none';
	$("#nav li a")[6].style.display = 'none';
	$(".sub-nav li a")[4].style.display = 'none';
	$(".sub-nav li a")[5].text = "私人付费";
	var flowed = $(".sub-nav li a")[6].text;
	var newtext = flowed.replace("FOLLOWED", "关注");
	$(".sub-nav li a")[6].text = newtext;



    //删除多余部分
    $(".featured_blog_posts").remove();
    $(".blog_post").remove();

	$(".followed_online_offline .title p a")[0].text = "在线聊天室";
	$(".followed_online_offline .title p a")[1].text = "离线聊天室";

    var aList = document.getElementById("room_list").getElementsByTagName ("a");
    for(var o=0;o<aList.length;i++){
       aList[i].target='_blank';//定义成打开新窗口
    }




})();
