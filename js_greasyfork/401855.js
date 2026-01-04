// ==UserScript==
// @name         自用全网VIP视频破解
// @namespace    congcongguoke_baiduwenku_script
// @version      1.1.5
// @description  自用 视频解析，支持大部分视频播放平台[支持优酷 | 腾讯 | 爱奇艺 | 芒果 | 乐视等常用视频]，移动端，PC端都适用
// @author       张辉
// @include      *://*.iqiyi.com/v_*
// @include      *://*.iqiyi.com/w_*
// @include      *://*.iqiyi.com/a_*
// @include      *://*.le.com/ptv/vplay/*
// @include      *://*v.qq.com/x/*
// @include      *://*v.qq.com/play*
// @include      *://*v.qq.com/cover*
// @include      *://*v.qq.com/tv/*
// @include      *://*v.youku.com/v_*
// @include      *://m.youku.com/v*
// @include      *://m.youku.com/a*
// @include      *://*.tudou.com/listplay/*
// @include      *://*.tudou.com/albumplay/*
// @include      *://*.tudou.com/programs/view/*
// @include      *://*.tudou.com/v*
// @include      *://*.mgtv.com/b/*
// @include      *://film.sohu.com/album/*
// @include      *://tv.sohu.com/v/*
// @include      *://*.acfun.cn/v/*
// @include      *://*.bilibili.com/video/*
// @include      *://*.bilibili.com/anime/*
// @include      *://*.bilibili.com/bangumi/play/*
// @include      *://*.baofeng.com/play/*
// @include      *://vip.pptv.com/show/*
// @include      *://v.pptv.com/show/*
// @include      *://m.pptv.com/show/*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @connect      www.iesdouyin.com
// @connect      ixigua.com
// @grant        GM_info
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/401855/%E8%87%AA%E7%94%A8%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E7%A0%B4%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/401855/%E8%87%AA%E7%94%A8%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E7%A0%B4%E8%A7%A3.meta.js
// ==/UserScript==

(function() {
	'use strict';	
    var $ = $ || window.$;
    var window_url = window.location.href;
    var website_host = window.location.host;
	
	//iframe中不再执行
	if(window.top != window.self){
    	return;
    }
	

	
	//VIP视频破解
	var VIPVIDEO={};
	VIPVIDEO.analysisWebsite="http://eahun.com/wn/index.php?zhm_jx=";
	VIPVIDEO.judgeVipWebsite=function(){
		var isVip = false;
		var host = window.location.host;
		var vipWebsites = ["iqiyi.com","v.qq.com","youku.com", "le.com","tudou.com","mgtv.com","sohu.com",
			"acfun.cn","bilibili.com","baofeng.com","pptv.com"];
   		for(var b=0; b<vipWebsites.length; b++){
	   		if(host.indexOf(vipWebsites[b]) != -1){
	   			isVip = true;
	   			break;
	   		}
	   	}
   		return isVip;
	};
	VIPVIDEO.addStyle=function(){
		var innnerCss = 
		`
		#plugin_kiwi_analysis_vip_movie_box{position:fixed; top:350px; left:5px; width:50px; background-color:#BC2405;z-index:99999999;}
		#plugin_kiwi_analysis_vip_movie_box >.plugin_item{cursor:pointer; width:20px;height:35px;text-align:center;line-height:35px;}
		#plugin_kiwi_analysis_vip_movie_box >.plugin_item >img{width:50px;display: inline-block; vertical-align: middle;}
		`;
		$("body").prepend("<style>"+innnerCss+"</style>");
	};
	VIPVIDEO.generateHtml=function(){
		var html="";
		var vipImgBase64 = "https://cdn.80note.com/vip.gif"
		html+= "<div id='plugin_kiwi_analysis_vip_movie_box'>";
		html+= "<div class='plugin_item jump_analysis_website' title='VIP视频破解'><img src='"+vipImgBase64+"'></div>";
		html+= "</div>";
		$("body").append(html);
	};
	VIPVIDEO.operation=function(){
		$("body").on("click", "#plugin_kiwi_analysis_vip_movie_box .jump_analysis_website", function(){
			var jumpWebsite=VIPVIDEO.analysisWebsite+window_url;
			GM_openInTab(jumpWebsite, { active: true });
		});
	};
	VIPVIDEO.start=function(){
    	if(VIPVIDEO.judgeVipWebsite() && window.top==window.self){
    		VIPVIDEO.addStyle();
			VIPVIDEO.generateHtml();
			VIPVIDEO.operation();
    	}
    };
	VIPVIDEO.start();
})();