// ==UserScript==
// @name            Dota2.ru UserScript
// @description     Правка блоков + доп. функционал для Dota2.ru (Использовать с Adblock Plus)
// @include         http://dota2.ru/*
// @match           http://dota2.ru/*
// @version         1.3.5
// @author          tRACE
// @grant           none
// @copyright       2015+
// @icon            http://i.imgur.com/9Rizrks.png
// @namespace http://dota2.ru
// @downloadURL https://update.greasyfork.org/scripts/10302/Dota2ru%20UserScript.user.js
// @updateURL https://update.greasyfork.org/scripts/10302/Dota2ru%20UserScript.meta.js
// ==/UserScript==
$("section.m-forum").css({"width" : "595px"}); 
$("section.m-battle").css({"width" : "595px"}); 
$("section.m-battle> a > div.vs").css({"padding-left" : "66px"});
$("section.m-battle> a > div.hero").css({"padding-left" : "65px"});
$(".titleBar").css({"margin-bottom" : "28px", "margin-top" : "10px"});
$(".m-forum .text").css({"width" : "496px"});
$(".m-forum .comments").css({"width" : "50px"});
$("section.m-blogs").css({"width" : "595px"});
$(".m-blogs .title").css({"width" : "510px"});
$("#headerProxy").css({"height" : "150px"});
$("div.tour:contains(The International)").css({"color" : "#D6BB0A", "text-shadow" : "0 0 8px #EFD414"});
$("div.tour:contains(The International 5)").css({"color" : "#D6BB0A", "text-shadow" : "0 0 8px #EFD414"});
$("div.tour:contains(The International 2015)").css({"color" : "#D6BB0A", "text-shadow" : "0 0 8px #EFD414"});
$(".titleBar").css({"margin-bottom" : "28px", "margin-top" : "10px"});
$("a[href='/streams/4-versuta/'] > img.streamer-img").attr('src', 'http://i.imgur.com/e7LpgA3.jpg');
$("div.name:contains(Team Empire)").css({"color" : "#C1272D"}).append("<img src='http://i.imgur.com/FZ4h4L8.png' style='width: 14px; height: 10px'>");
$("div.name:contains(Virtus Pro)").css({"color" : "#C1272D"}).append("<img src='http://i.imgur.com/FZ4h4L8.png' style='width: 14px; height: 10px'>");
$("div.name:contains(Vega Squadron)").css({"color" : "#C1272D"}).append("<img src='http://i.imgur.com/FZ4h4L8.png' style='width: 14px; height: 10px'>");
$("div.name:contains(HellRaisers)").css({"color" : "#C1272D"}).append("<img src='http://i.imgur.com/FZ4h4L8.png' style='width: 14px; height: 10px'>");
$("div.name:contains(SFZ)").css({"color" : "#C1272D"}).append("<img src='http://i.imgur.com/FZ4h4L8.png' style='width: 14px; height: 10px'>");
$("div.name:contains(Scaryfacez)").css({"color" : "#C1272D"}).append("<img src='http://i.imgur.com/FZ4h4L8.png' style='width: 14px; height: 10px'>");
$("div.name:contains(Moscow Five)").css({"color" : "#C1272D"}).append("<img src='http://i.imgur.com/FZ4h4L8.png' style='width: 14px; height: 10px'>");
$("div.name:contains(M5)").css({"color" : "#C1272D"}).append("<img src='http://i.imgur.com/FZ4h4L8.png' style='width: 14px; height: 10px'>");
$("div.name:contains(Duza Gaming)").css({"color" : "#C1272D"}).append("<img src='http://i.imgur.com/FZ4h4L8.png' style='width: 14px; height: 10px'>");
$("div.name:contains(Yellow Submarine)").css({"color" : "#C1272D"}).append("<img src='http://i.imgur.com/FZ4h4L8.png' style='width: 14px; height: 10px'>");
$("div.name:contains(Power Rangers)").css({"color" : "#007A00"}).append("<img src='http://i.imgur.com/XurKCfi.png' style='width: 14px; height: 10px'>");
$("div.name:contains(Natus Vincere)").css({"color" : "#BCA510"}).append("<img src='http://i.imgur.com/6xXJJb4.png' style='width: 14px; height: 10px'>");
$("div.name:contains(NEXT.kz)").css({"color" : "#008FA5"}).append("<img src='http://i.imgur.com/mzoIkEn.png' style='width: 14px; height: 10px'>");
$(".hadv.clearfix").remove();
$("div.name:contains(Yellow Submarine)").parent("div.team").each(function() {
    $(this).children("img").attr("src","http://i.imgur.com/F24fPnv.png");
});
$("body").each(function () {
    this.style.setProperty( "padding", "0px 0px 0px", "important" );
    this.style.setProperty( "background", "black", "important" );
});