// ==UserScript==
// @name         vipHelper
// @namespace    TianmuTNT
// @version      1.0.5
// @description  也许是全网最好用的vipHelper脚本
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAY1JREFUWEfdV0tywyAMRV64PYXbZXKKOidLcrI4p0iWbU7RZoE6MOABIpBVyrhTVvZYlp6evoBa+cDK9hUL4PL6PCqtRwMUAN44wIh4DmW2t/uh9A8JwBgFxL1CtIZrDyp1VF03bd8/p1TXA4DL0B9AqX2tUep/AyRlJAJgPdf61MK414ldtwuZiAE09H52CmDafHzt/HsE4Dr02NJ7r3tzu89254di7AEmBDga6qycqYaKBA3DwAKgEsd4UsNWqJMHkCSNJEQ5VkUAwnhJjHtZkqkgEWcGri9PJyquadl4xbZDMifbzCQAVFI2xmZ1vxABcF7adurnQUUFWHU/AcDRLfr+fwGYhuXGcXGgtWCAqpZcZclywLVhLsbUrM9Wi4SBFo1I1Alzs4BjpNQJRQAWGSKalW1Ymf2CBlC7DbkKMCuXX2RzlUACqB2xi5hyQuRCYgFkBpJEOSeb5tTfWkpLicN5tuQ7u5ZHs17r8dfuB8FOmQLlr2ZDH12tRNezzG0oBMECWEJtjczqAL4BysQhMPukapkAAAAASUVORK5CYII=
// @author       TianmuTNT
// @include      *://*.youku.com/v_*
// @include      *://www.iqiyi.com/*
// @include      *://www.iqiyi.com
// @include      *://*.iqiyi.com/v_*
// @include      *://*.iqiyi.com/w_*
// @include      *://*.iqiyi.com/a_*
// @include      *://*.le.com/ptv/vplay/*
// @include      *://v.qq.com/x/cover/*
// @include      *://v.qq.com/x/page/*
// @include      *://*.tudou.com/listplay/*
// @include      *://*.tudou.com/albumplay/*
// @include      *://*.tudou.com/programs/view/*
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
// @grant        GM_info
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-idle
// @charset      UTF-8
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/535763/vipHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/535763/vipHelper.meta.js
// ==/UserScript==

(function() {
	'use strict';

	const vipHelper={};
	vipHelper.lastSelectedSourceUrl = null;
	vipHelper.currentHref = window.location.href;

	vipHelper.playerNodes = [
		{ url:"v.qq.com", node:"#player"},
		{ url:"www.iqiyi.com", node:"#video"},
		{ url:"v.youku.com", node:"#player"},
		{ url:"w.mgtv.com", node:".kernel-video-element"},
		{ url:"www.mgtv.com", node:".kernel-video-element"},
		{ url:"tv.sohu.com", node:"#player"},
		{ url:"film.sohu.com", node:"#playerWrap"},
		{ url:"www.le.com", node:"#le_playbox"},
		{ url:"video.tudou.com", node:".td-playbox"},
		{ url:"v.pptv.com", node:"#pptv_playpage_box"},
		{ url:"vip.pptv.com", node:".w-video"},
		{ url:"www.wasu.cn", node:"#flashContent"},
		{ url:"www.acfun.cn", node:"#ACPlayer"},
		{ url:"vip.1905.com", node:"#player"},
		{url:"play.tudou.com",node:"#player"},
		{url:"www.bilibili.com/video",node:"#bilibiliPlayer"},
		{url:"www.bilibili.com/bangumi",node:"#player_module"},
	];

	vipHelper.defaultSourceArray=[
		{"name":"JY","url":"https://jx.playerjy.com/?url=","mobile":0},
		{"name":"七哥","url":"https://jx.nnxv.cn/tv.php?url=","mobile":0},
		{"name":"虾米","url":"https://jx.xmflv.com/?url=","mobile":0},
		{"name":"虾米2","url":"https://jx.xmflv.cc/?url=","mobile":0},
		{"name":"七七云","url":"https://jx.77flv.cc/?url=","mobile":0},
		{"name":"咸鱼云","url":"https://jx.xymp4.cc/?url=","mobile":0},
		{"name":"大米云","url":"https://jx.dmflv.cc/?url=","mobile":0}
	];
	vipHelper.getServerSource=function(){
		vipHelper.addStyle();
		vipHelper.generateHtml();
		vipHelper.operation();
	};
	vipHelper.eleId = Math.ceil(Math.random()*100000000);
	vipHelper.isRun = function(){
		var isVip = false;
		var host = window.location.host;
		var href = window.location.href;
		var vipWebsites = ["iqiyi.com","v.qq.com","youku.com", "le.com","tudou.com","mgtv.com","sohu.com","acfun.cn","bilibili.com","baofeng.com","pptv.com"];
   		for(var b=0; b<vipWebsites.length; b++){
	   		if(host.indexOf(vipWebsites[b]) != -1){
				if("iqiyi.com"===vipWebsites[b]){
					if(href.indexOf("iqiyi.com/a_")!=-1 || href.indexOf("iqiyi.com/w_")!=-1 || href.indexOf("iqiyi.com/v_")!=-1){
						isVip = true;
						break;
					}
				}else{
					isVip = true;
					break;
				}
	   		}
	   	}
   		return isVip;
	};
	vipHelper.addStyle=function(){
		var themeColor = "#2F4F4F";
		var innnerCss =
		"#plugin_analysis_vip_movie_box_"+vipHelper.eleId+" {position:fixed;top:200px; left:0px; padding:5px 0px; width:38px;}"+
		"#plugin_analysis_vip_movie_box_"+vipHelper.eleId+" >.plugin_item{cursor:pointer; width:100%; text-align:center;}"+
		"#plugin_analysis_vip_movie_box_"+vipHelper.eleId+" >.jump_analysis_website{padding:10px 0px;background-color:"+themeColor+";}"+
		"#plugin_analysis_vip_movie_box_"+vipHelper.eleId+" >.open_page_inner_source{margin-top:6px; padding:5px 0px;background-color:"+themeColor+";}"+
		"#plugin_analysis_vip_movie_box_"+vipHelper.eleId+" >.plugin_item >img{width:60%; display:inline-block; vertical-align:middle;}"+
		"#plugin_analysis_vip_movie_box_"+vipHelper.eleId+" >.plugin_item>.play_source_box{display:none;width:310px;height:400px;position:absolute;left:25px;overflow:hidden;}"+
		"#plugin_analysis_vip_movie_box_"+vipHelper.eleId+" >.plugin_item>.play_source_box> .inner_table_box{width:330px;height:100%;padding-left:10px;overflow-y:scroll;overflow-x:hidden;}"+
		"#plugin_analysis_vip_movie_box_"+vipHelper.eleId+" >.plugin_item>.play_source_box> .inner_table_box> table{width:300px;border-spacing:5px;border-collapse:separate;line-height:20px;}"+
		"#plugin_analysis_vip_movie_box_"+vipHelper.eleId+" >.plugin_item>.play_source_box> .inner_table_box> table td{border-bottom:3px solid "+themeColor+";border-top:3px solid "+themeColor+";width:33%;color:#FFF;font-size:11px;text-align:center;cursor:pointer;background-color:"+themeColor+";box-shadow:0px 0px 5px #fff;border-radius:3px;}"+
		"#plugin_analysis_vip_movie_box_"+vipHelper.eleId+" >.plugin_item>.play_source_box> .inner_table_box> table td:hover{border-bottom:3px solid #FEF2A6;border-top:3px solid #FEF2A6;}"+
		"#plugin_analysis_vip_movie_box_"+vipHelper.eleId+" >.plugin_item>.play_source_box> .inner_table_box> table .td_hover{border-bottom:3px solid #FEF2A6;border-top:3px solid #FEF2A6;}";
		GM_addStyle(innnerCss);
	};
	vipHelper.generateHtml=function(){
		var html="";
		var vipImgBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEEAAABACAYAAABFqxrgAAADBklEQVR4Xu2cz6tNURTHP7tI5iRlID9CJFMlkYGSRPGklBRKiCSSxJMBkYGSgWQq/gBT/gMDUzMzf8RX6959nuO9e+75sff54d69B+/W23evvdbnrLX32j/OdfgiaStwGzgBvHfOPc7qln9KsrpHRfU9/n+xgt6ngW/AK+fcT9PV2R9JZ4A3wHpvQBVh/yuETO/fwDXn3GfnAXxa9vTmAUJm8oJBMADmCfkyTxC+GAT1GMOD6DpBsIExeUKCMArH5AkJwnhcTp4wBcI85QmFnpAgAAlCgjAeMJMnJAjJE5YWdSkcIq5vvwP7IsprRVSrGaNzzuSfAz4Aa1qxIILQ1iHkNnKfAA8j6BxdRGcQ/IbuOuAtYDu+gymdQsh5xX7gHbB7CCR6gZCDccGPF6Ot/75KrxB8iKwCngL35hZCzit2Ac/8CVinPIo8YRH4OkWTQ1WO4WyKrGuNJDsGfAlsr9vW0v0mehdCqHCmV3oM1wRCzjPuAC9qgmiU6Q4Wgh8vNgJ2+HulIozZg5DzioMexuESGLMLIQfjkh+LNhXAmH0IPkTueq9YOwHEbEOQdMobv3dKSMwmBEl7fAhUWW/EhTCBdnaEn839bU+RtvS2PmyqXF11dmiid+9p8yTjJF0ELPZ3VjQ+6GuDgiDpAHAfOBZkVc3Gg4AgaQPwALieXSaraUfQ13uHIOmmN35bkCUBjXuDIOm4N/5ogP5RmnYOQdIOwJ7+1SgWRBDSGQRJNrXajVmL+80RdI8mYtp+QlknlfMESSe98UfKhAbW235CWVmhd6tLacBS3BvA5TLNItXHzRhjbKoAv4CiFV8ku/8RM0gIbRg6TWaC0PRKQdtjQvKErgkkTxgTjzsmNNm/7+HJL+8y6rnDAOzpToVW0+buzAjrKUFIF7zHHpQ8IUFInrA0mqZw8OHwY8IFqkaZV9hEFaV1E71HL4c+9wcdeS2aCItiRaCQJnovZC+MfwTO5hRoIixQ/yjN6+j994XxrGtJt4DzwBbgdaSdpSiW1RBSBcKKnw74AzEYpoku7zbwAAAAAElFTkSuQmCC";
		html+= "<div id='plugin_analysis_vip_movie_box_"+vipHelper.eleId+"' style='z-index:1145141919810;'>";
		html+= "<div class='plugin_item open_page_inner_source'><img src='"+vipImgBase64+"'>";
		html+= "<div class='play_source_box'>";
		html+= "<div class='inner_table_box'>";
		html+= "<table style=''><tr>";
		for(var playLineIndex=0; playLineIndex<this.defaultSourceArray.length; playLineIndex++){
			if(playLineIndex%3==0){
				html +="<tr>";
				html += "<td data-url='"+this.defaultSourceArray[playLineIndex].url+"'>"+this.defaultSourceArray[playLineIndex]['name']+"</td>";
				continue;
			}
			html += "<td data-url='"+this.defaultSourceArray[playLineIndex].url+"'>"+this.defaultSourceArray[playLineIndex]['name']+"</td>";
			if((playLineIndex+1)%3==0){
				html +="</tr>";
			}
		}
		html+= "</tr></table>";
		html+= "</div></div>";
		html+= "</div>";
		html+= "</div>";
		$("body").append(html);
		var $vipMovieBox = $("#plugin_analysis_vip_movie_box_"+vipHelper.eleId+"");
		var $playSourceBox = $("#plugin_analysis_vip_movie_box_"+vipHelper.eleId+">.plugin_item>.play_source_box");
		var btnHeight = $vipMovieBox.height();
		var playSourceBoxHeight = $playSourceBox.height();
		var playSourceBoxTop = (playSourceBoxHeight-btnHeight)*0.3;
		$playSourceBox.css("top","-"+playSourceBoxTop+"px");
	};
	vipHelper.comprehensiveAnalysis=function(videoUrl, newWindow){
		var jumpWebsite = "https://tv.wandhi.com/go.html?url="+videoUrl;
		if(newWindow && (typeof GM_openInTab==="function")){
			GM_openInTab(jumpWebsite, {active: true});
		}else{
			location.href = jumpWebsite;
		}
	};

	vipHelper.applyParse = function(sourceUrl, videoUrl) {
		var node = "";
		var playerNodes = vipHelper.playerNodes;
		for(var m in playerNodes) {
			if(videoUrl.indexOf(playerNodes[m].url)!= -1){
				node = playerNodes[m].node;
				break;
			}
		}

		if (node && $(node).length > 0) {
			$("#play-iframe-outer-7788op").remove();
			var playHtml = "<div id='play-iframe-outer-7788op' style='width:100%;height:100%;'><iframe allowtransparency=true frameborder='0' scrolling='no' allowfullscreen=true allowtransparency=true name='jx_play' style='height:100%;width:100%' id='play-iframe-6677i-7788'></iframe></div>";
			$(node).html(playHtml);
			var iframeSrc = sourceUrl + videoUrl;
			$("#play-iframe-6677i-7788").attr("src", iframeSrc);

			$("#plugin_analysis_vip_movie_box_"+vipHelper.eleId+" >.plugin_item>.play_source_box>.inner_table_box> table td").removeClass("td_hover");
			$("#plugin_analysis_vip_movie_box_"+vipHelper.eleId+" >.plugin_item>.play_source_box>.inner_table_box> table td[data-url='"+sourceUrl+"']").addClass("td_hover");
		}
	};

	vipHelper.operation=function(){
		$("body").on("click", "#plugin_analysis_vip_movie_box_"+vipHelper.eleId+" .jump_analysis_website", function(){
			vipHelper.comprehensiveAnalysis(window.location.href, true);
		});
		var $vipMovieBox = $("#plugin_analysis_vip_movie_box_"+vipHelper.eleId+">.open_page_inner_source");
		var $playSourceBox = $("#plugin_analysis_vip_movie_box_"+vipHelper.eleId+">.plugin_item>.play_source_box");
		$vipMovieBox.on("mouseover", () => {
			$playSourceBox.show();
		});
		$vipMovieBox.on("mouseout", () => {
			$playSourceBox.hide();
		});
		$("#plugin_analysis_vip_movie_box_"+vipHelper.eleId+" >.plugin_item>.play_source_box>.inner_table_box> table td").on("click", function(){
			var playUrl = window.location.href;
			var selectedSourceUrl = $(this).attr("data-url");
			vipHelper.lastSelectedSourceUrl = selectedSourceUrl;
			GM_setValue("lastSelectedSourceUrl_bestvip", selectedSourceUrl);
			vipHelper.applyParse(selectedSourceUrl, playUrl);
		})
	};

	vipHelper.listenForUrlChanges = function() {
		var lastHref = window.location.href;

		var handleUrlChange = function() {
			if (window.location.href !== lastHref) {
				lastHref = window.location.href;
				vipHelper.currentHref = window.location.href;

				if (vipHelper.isRun() && vipHelper.lastSelectedSourceUrl) {
					setTimeout(function() {
						vipHelper.applyParse(vipHelper.lastSelectedSourceUrl, window.location.href);
					}, 1000);
				}
			}
		};

		window.addEventListener('popstate', handleUrlChange);

		setInterval(handleUrlChange, 500);
	};

	vipHelper.start=function(){
    	if(vipHelper.isRun() && window.top==window.self){
    		vipHelper.getServerSource();

			var savedSourceUrl = GM_getValue("lastSelectedSourceUrl_bestvip", null);
			if (savedSourceUrl) {
				vipHelper.lastSelectedSourceUrl = savedSourceUrl;
				setTimeout(function() {
					vipHelper.applyParse(savedSourceUrl, window.location.href);
				}, 1000);
			}
			vipHelper.listenForUrlChanges();
    	}
    };
	vipHelper.start();

})();