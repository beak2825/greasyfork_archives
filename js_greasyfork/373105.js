// ==UserScript==
// @name         B站无弹幕
// @name:en      Bilibili_NoDanMu
// @namespace    http://tampermonkey.net/
// @version      0.28
// @description  自动屏蔽所有bilibili弹幕
// @description:en  Auto Block all-All-ALL danmaku on bilibili.
// @require https://cdn.staticfile.org/jquery/2.0.3/jquery.min.js
// @github	 https://www.github.com/arryboom/nodanmu
// @author       arryboom
// @match        *://*.bilibili.com/*
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/373105/B%E7%AB%99%E6%97%A0%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/373105/B%E7%AB%99%E6%97%A0%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //jQuery.noConflict();
    window.jQuery(function($) {
    var divcount=0;
    var mdivcount=0;
	var tvdivcount=0;
	var onpdeling=false,onmdeling=false,onpcdeling=false,onmcdeling=false,ontvdeling=false;
	var pagemaindiv;
	var pagepdiv;
	var danmubtn1_text;
	var no_danmu=function(){
    console.log("into");
    /*
    try{
    var nodanmu_a=$("div[class='bilibili-player-video-danmaku-switch bui bui-switch']").eq(0).children(".bui-checkbox");}
    catch(err){
    nodanmu_a=$("div[class='bilibili-player-video-danmaku-switch bui bui-switch']").eq(0).children(".bui-switch-input");
    }*/
    var nodanmu_a=$("div[class='bilibili-player-video-danmaku-switch bui bui-switch']").eq(0).children(".bui-checkbox");
    var nodanmu_d=$("div[class='bilibili-player-video-danmaku-switch bui bui-switch']").eq(0).children(".bui-switch-input");
    //nodanmu_a.click();
	var nodanmu_b=$("div[class='bilibili-player-video-btn bilibili-player-video-btn-danmaku']").eq(0).attr("data-text");
	var nodanmu_c=$("div[class='bilibili-live-player-video-controller-hide-danmaku-container']");
    console.log("step1");
    var Xevent = new MouseEvent('mouseover', {
  'bubbles': true,
  'cancelable': true,
});
    var Sack=$("div[class='bilibili-player-video-danmaku-switch bui bui-switch']").eq(0).children();
    try{
    Sack[0].dispatchEvent(Xevent);}catch(err){
    console.log("dispatch fail.");
    }
    //$("div[class='bilibili-player-video-danmaku-switch bui bui-switch']").eq(0).children()
	//if((typeof(nodanmu_b)=="undefined") && (nodanmu_a.size()!=0)){
    if((typeof(nodanmu_b)=="undefined")){
		danmubtn1_text=$("div[class='bilibili-player-video-danmaku-switch bui bui-switch']").eq(0).children(".choose_danmaku").html();
        console.log("herego");
        //if ()
		if (!(danmubtn1_text=="开启弹幕"))
		{
			nodanmu_a.click();
            //console.log("click");
            danmubtn1_text=$("div[class='bilibili-player-video-danmaku-switch bui bui-switch']").eq(0).children(".choose_danmaku").html();
            if (!(danmubtn1_text=="开启弹幕")){
                        nodanmu_d.click();

            }
		}
        //else if(typeof(danmubtn1_text)==undefined){
        //}
        /*danmubtn2.each(function(index, val){if (!($(val).parent().children(".choose_danmaku").html())){
        //$(val).click();$(val).parent().children(".choose_danmaku").html()
            console.log($(val).parent().children("span[class='choose_danmaku']").html())
        }});*/
        //.eq(0).children(".choose_danmaku").html()
	}
	else if (nodanmu_b=="打开弹幕"){
		$("i[name='ctlbar_danmuku_close']").click();
	}
	else if(nodanmu_c.size()!=0)
	{
		$("button[data-title='隐藏弹幕']").click();
	}
       //var danmubtn2=$("span[class='choose_danmaku']")[0];
       //var danmubtn2=$(".choose_danmaku")[0];
       //console.log(danmubtn2);
       //if ($(danmubtn2).html()=="关闭弹幕"){
       //$(danmubtn2).parent().children(".bui-switch-input").click();
      //};
                            /*
    setTimeout(function(){
       var danmubtn2=$("span[class='choose_danmaku']")[0];
       //var danmubtn2=$(".choose_danmaku")[0];
       if ($(danmubtn2).html()=="关闭弹幕"){
       $(danmubtn2).parent().children(".bui-switch-input").click();
      }},3000);*/
	log("#####Bilibili_NoDanMu#####");
    };
setTimeout(function(){
	no_danmu();
    //---------------------
			 if (window.location.host.toLowerCase()=="search.bilibili.com"){
			 //==================================
				clearsearch();
				$("div.all-contain").eq(0).on("DOMNodeInserted DOMNodeRemoved",function(){setTimeout(clearsearch(),2000)});
				}
				else{
         $(window).scroll(function(){
			 //==================================
			 if (!onpdeling){
             if ($("div.spread-module").length!=0&&$("div.spread-module").length!=divcount){
			 onpdeling=true;
             divcount=$("div.spread-module").length;
			 $("div.spread-module").each(function(index, val){
				 if (!($(val).attr("xnodanmu"))){
					$(val).mousemove(function(e){if(!onpcdeling){onpcdeling=true;clearpagedanmu();onpcdeling=false;}});
					$(val).attr("xnodanmu",uuid());
					}
			 });
			 onpdeling=false;
             }}
                 //==================================
				 if (!onmdeling){
				 if ($("div.video-page-card").length!=0&&$("div.video-page-card").length!=mdivcount){
					onmdeling=true;
                 mdivcount=$("div.video-page-card").length;
				 $("div.video-page-card").each(function(index, val){
					if (!($(val).attr("xnodanmu"))){
					$(val).mousemove(function(e){if(!onmcdeling){onmcdeling=true;clearminidanmu();onmcdeling=false;}});
					$(val).attr("xnodanmu",uuid());
					}
				});
				onmdeling=false;
		 };}
				//==================================
				if (!ontvdeling){
				 if ($("div.recom-item").length!=0&&$("div.recom-item").length!=tvdivcount){
					onmdeling=true;
                 tvdivcount=$("div.recom-item").length;
				 $("div.recom-item").each(function(index, val){
					if (!($(val).attr("xnodanmu"))){
					$(val).mousemove(function(e){if(!onmcdeling){onmcdeling=true;clearminidanmu();onmcdeling=false;}});
					$(val).attr("xnodanmu",uuid());
					}
				});
				ontvdeling=false;
		 };}
				//==================================

				//==================================
		 //--------------------
//==================================
});
         $(window).scroll();
		 $(".video-title").eq(0).bind("DOMNodeInserted",function(){setTimeout(function(){no_danmu();tvdivcount=0;mdivcount=0;$(window).scroll();},5000)});
				}
}
    //--------------------
,3000);
//setTimeout(function(){$(window).scroll()},5000);
function clearsearch(){
				 	$("li.video").each(function(index, val){
					if (!($(val).attr("xnodanmu"))){
					$(val).mousemove(function(e){clearminidanmu();});
					$(val).attr("xnodanmu",uuid());
						}})
}
function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[8] = s[13] = s[18] = s[23] = "-";
    var uuid = s.join("");
    return uuid;
}
    function log(xtext){
    console.log(xtext);
    }
    function clearpagedanmu(){
    $("div").remove(".danmu-module");
    }
    function clearminidanmu(){
    $("div").remove(".van-danmu");
    }
	})})();