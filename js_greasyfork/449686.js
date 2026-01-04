// ==UserScript==
// @name         水色のアンケートで連射ミル！
// @namespace    unknown_rensyamill
// @version      0.0.2a
// @description  ある程度の連打できるようにする
// @author       monitor_support
// @match        https://*/ans/pc/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @license      水色のUI作ったやつはうんちでも食べてろ
// @downloadURL https://update.greasyfork.org/scripts/449686/%E6%B0%B4%E8%89%B2%E3%81%AE%E3%82%A2%E3%83%B3%E3%82%B1%E3%83%BC%E3%83%88%E3%81%A7%E9%80%A3%E5%B0%84%E3%83%9F%E3%83%AB%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/449686/%E6%B0%B4%E8%89%B2%E3%81%AE%E3%82%A2%E3%83%B3%E3%82%B1%E3%83%BC%E3%83%88%E3%81%A7%E9%80%A3%E5%B0%84%E3%83%9F%E3%83%AB%EF%BC%81.meta.js
// ==/UserScript==

$(function(){
	$('body').on('click', function(e) {
		$(window).scrollTop($(window).scrollTop() + 32);
	});
    $('table').removeClass("errorTable");

$(".side-choices").css("max-height","32px");
$("img").css("max-height","32px");
    $(".choice-img-wrapper").css("max-height","32px");
    $(".choice-symbol").css("max-height","32px");
    $(".choice-num").css("max-height","32px");
    $(".choice-detail").css("max-height","32px");

   	$(document).ready(function(){
		setTimeout(function(){
		  $('body').height($('body').height() + $(window).height()+500);
		},1000);
	});

})



