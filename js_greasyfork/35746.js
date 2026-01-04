// ==UserScript==
// @name 		福利助手
// @namespace	fuli.ranossy
// @version		1.3.3
// @author		Ranossy
// @description	自动屏蔽一些网♂站[滑稽]的广告，点击视频直接播放
// @iconURL		http://tb2.bdstatic.com/tb/editor/images/face/i_f25.png
// @supportURL	https://greasyfork.org/zh-CN/scripts/28429-%E7%A6%8F%E5%88%A9%E5%8A%A9%E6%89%8B
// @require		https://cdn.bootcss.com/jquery/3.2.0/jquery.min.js
// @run-at 		document-end
// @grant		GM_log
// @include		*
// @exclude		*://*.bilibili.com/*
// @exclude		*://bbs.kafan.cn/*
// @downloadURL https://update.greasyfork.org/scripts/35746/%E7%A6%8F%E5%88%A9%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/35746/%E7%A6%8F%E5%88%A9%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
!(function(){
	function default_ads(){
		//固定的小型div元素
		$("div").each(function(){
			if($(this).width()<400&&$(this).width()>10&&$(this).css('position')=="fixed"&&$(this).width()/$(this).height()<2.5&&$(this).width()/$(this).height()>0.3){
				$(this).hide();
			}
		});
		$("*[class*='ads'],[id*='ads']").remove();
		$("*[class*='adv'],[id*='adv']").remove();
		$("qq").remove();

		$("a img[src*='sinaimg']").parents("a").remove();
		$("a img[src*='33img']").parents("a").remove();
		$("a img[src*='banfusui']").parents("a").remove();
		$("a img[src*='img2earn']").parents("a").remove();
		$("a img[src*='ooo']").parents("a").remove();
		$("a img[src*='ads']").parents("a").remove();

		//$("table a[target='_blank'] font").parents("td").remove();
	}
	function jiujiure(){
		if(window.location.href.indexOf("embed") >= 0){
			$("div#kt_player").attr("style","width: 800px; height: 600px; margin:0 auto;");
			$("div#kt_player").style="width: 800px; height: 600px; margin:0 auto;";
			$("body script").first().remove();
		}else{
			$("div#index_tan").hide();
			$("div#pop").hide();
			$("div#popl").hide();
			$("div.wrap-head-spots").hide();
			$("div.leftadv").hide();
			$("div.rightadv").hide();
			$("div.spots").hide();
			$("div[style^='display: block']").hide(); 
			$("[style$='width:318px;height:50px']").hide();
			$("body").click(function(){
				$("a.kt_imgrc").attr("href",function(i,origValue){return origValue.replace("videos","embed");});
				
			$("div[style^='position: fixed']").hide();
			$("div[style^='display: block']").hide(); 
			$("div[id^='__']").hide();
			});
		}
	}
	function fcw(){
		if(window.location.href.indexOf("embed") >= 0){
			$("div#kt_player").attr("style","width: 800px; height: 600px; margin:0 auto;");
			$("div#kt_player").style="width: 800px; height: 600px; margin:0 auto;";
		}else{
			//$("div.content:first").hide();
			$("div.place").hide();
			$("div[style^='display: block']").hide(); 
			$("div.footer-margin").hide();
			$("body").click(function(){
				$("div.item a").attr("target","_blank");
				$("div.item a").attr("href",function(i,origValue){return origValue.replace("videos","embed");});
				
			$("div[style^='position: fixed']").hide();
			$("div[style^='display: block']").hide(); 
			$("div[id^='__']").hide(); 
			});
		}
	}
	function qyle(){
		if(window.location.href.indexOf("embed") >= 0){
			$("div#player-container").attr("style","width: 800px; height: 600px; margin:0 auto;");
			$("div#player-container").style="width: 800px; height: 600px; margin:0 auto;";
			$("div#player-advertising").remove();
		}else{
			$("div.ads").hide();
			$("div#haoetvl").hide();
			$("div#haoetv").hide();
			$("div[style^='position: fixed']").hide();
			$("div[style^='display: block']").hide(); 
			$("div[id^='__']").hide();
			$("div.ads-footer").hide();
			$("body").click(function(){
				$("a.thumbnail").attr("href",function(i,origValue){
					if(origValue.indexOf("embed") < 0){
						if(origValue.indexOf("com")>=0){
							return origValue.replace("com/", "com/embed/");
						}else{
							return "/embed" + origValue;
						}
					}
				});
			$("div[style^='position: fixed']").hide();
			$("div[style^='display: block']").hide(); 
			$("div[id^='__']").hide();
			});
		}
	}
	function aotu(){
		if(window.location.href.indexOf("embed") >= 0){
			$("div#player-container").attr("style","width: 800px; height: 600px; margin:0 auto;");
			$("div#player-container").style="width: 800px; height: 600px; margin:0 auto;";
			$("img.vjs-watermark").hide();
		}else{
			$("div.ads").hide();
			$("div.ads-square").hide();
			$("div[style^='position: fixed']").hide();
			$("div[style^='display: block']").hide(); 
			$("div[id^='__']").hide();
			$("body").click(function(){
				$("a.thumbnail").attr("target","_blank");
				$("a.thumbnail").attr("href",function(i,origValue){
					if(origValue.indexOf("embed") < 0){
						if(origValue.indexOf("com")>=0){
							return origValue.replace("com/", "com/embed/");
						}else{
							return "/embed" + origValue;
						}
					}
				});
			$("div[style^='position: fixed']").hide();
			$("div[style^='display: block']").hide(); 
			$("div[id^='__']").hide();
			});
		}
	}
	function kedou(){
		if(window.location.href.indexOf("share") >= 0){
			$("div#kt_player").attr("style","width: 800px; height: 600px; margin:0 auto;");
			$("div#kt_player").style="width: 800px; height: 600px; margin:0 auto;";
		}else{
			$("noindex").hide();
			$("div.leftadv").hide();
			$("div.rightadv").hide();
			$("div.bottom-adv").hide();
			$("div[style^='position: fixed']").hide();
			$("div[style^='display: block']").hide(); 
			$("div[id^='__']").hide();
			$("div#pop").hide();
			$("div#popl").hide();
			$("div.place").hide();
			$("body").click(function(){
				$("div.item a").attr("target","_blank");
				$("div.item a").attr("href",function(i,origValue){return origValue.replace("videos","share");});
				
			$("div[style^='position: fixed']").hide();
			$("div[style^='display: block']").hide(); 
			$("div[id^='__']").hide();
			});
		}
	}
	function yjizz(){
		if(window.location.href.indexOf("embed") >= 0){
			$("div#player-container").attr("style","width: 800px; height: 600px; margin:0 auto;");
			$("div#player-container").style="width: 800px; height: 600px; margin:0 auto;";
		}else{
			$("div.ads").hide();
			$("div[style^='position: fixed']").hide();
			$("div[style^='display: block']").hide(); 
			$("div[id^='__']").hide();
			$("div.ads-footer").hide();
			$("body").click(function(){
				$("a.thumbnail").attr("target","_blank");
				$("a.thumbnail").attr("href",function(i,origValue){
					if(origValue.indexOf("embed") < 0){
						if(origValue.indexOf("com")>=0){
							return origValue.replace("com/", "com/embed/");
						}else{
							return "/embed" + origValue;
						}
					}
				});
			$("div[style^='position: fixed']").hide();
			$("div[style^='display: block']").hide(); 
			$("div[id^='__']").hide();
			});
		}
	}
	function datoporn(){
		if(window.location.href.indexOf("embed") >= 0){
			$("body").click(function(){
				$("div.prvisible").remove();
				$("div#center-ad").remove();
				$("div#a").remove();
			});
			$("script").remove();
			$("div#a").remove();
			$("div#vplayer").attr("style","width: 800px; height: 600px; margin:0 auto;");
			$("div#vplayer").style="width: 800px; height: 600px; margin:0 auto;";
		}else{
			$("body").click(function(){
				$("a.morevids").attr("target","_blank");
				$("a.morevids").attr("href",function(i,origValue){
					if(origValue.indexOf("embed") < 0){
						if(origValue.split("/").length == 4 && origValue.split("/")[origValue.split("/").length-1].length == 12){
							return origValue.replace("porn/", "porn/embed-")+ ".html";
						}
					}
				});
			});
		}
	}
	function javbus(){
		$("div.ad-list").hide();
		$("table.ad-table").remove();
	}
	function _5xsq(){
		if(window.location.href.indexOf("embed") >= 0){
			$("div.video-holder").attr("style","width: 800px; height: 600px; margin:0 auto;");
			$("div.video-holder").style="width: 800px; height: 600px; margin:0 auto;";
		}else{
			$("div[style^='display: block']").hide(); 
			$("[style$='width:318px;height:50px']").hide();
			$("body").click(function(){
				$("div.item a").attr("target","_blank");
				$("div.item a").attr("href",function(i,origValue){return origValue.replace("video","embed");});
				$("div[style^='position: fixed']").hide();
				$("div[style^='display: block']").hide(); 
				$("div[id^='__']").hide(); 
			});
		}
	}

	var host = window.location.host;
	var html = document.body.innerHTML;
	var title = document.title;
	if(html.search(/最新\w+址|址发布/)>=0||(title.search(/porn|av|sex|cao|撸|视频|社区|影|片|射|色/i)>=0&&(html.search(/潮吹|高潮|内射|无套|淫|叫床|娇喘|逼|捆绑|偷拍|番号|人妻|萝莉|御姐/)>=0))){GM_log("你已超速！请小心驾驶！﹁_﹁");
		default_ads();
		setTimeout(default_ads(),1000);
		setTimeout(default_ads(),3000);
		setTimeout(default_ads(),5000);
		setTimeout(default_ads(),7000);
	}
	if (host.indexOf("jiujiure") >= 0 || host.search(/99[a-zA-Z]{2}/) >= 0) { GM_log("当前网站：久久热");
		jiujiure();
	}
	if (host.indexOf("fcw") >= 0 || host.indexOf("ccxx") >= 0) { GM_log("当前网站：废柴视频网");
		fcw();
	}
	if (host.indexOf("qyle") >= 0 || host.indexOf("qyule") >= 0) { GM_log("当前网站：青娱乐");
		qyle();
	}
	if (host.indexOf("yjizz") >= 0) { GM_log("当前网站：yjizz");
		yjizz();
	}
	if (host.indexOf("aotu") >= 0) { GM_log("当前网站：凹凸视频");
		aotu();
	}
	if (host.indexOf("kedou") >= 0 || host.indexOf("lovecaobi") >= 0 || host.indexOf("cao000") >= 0) { GM_log("当前网站：蝌蚪窝");
		kedou();
	}
	if (host.indexOf("dato") >= 0) { GM_log("当前网站：datoporn");
		datoporn();
	}
	if (host.indexOf("javbus") >= 0) { GM_log("当前网站：javbus");
		javbus();
	}
	if (title.indexOf("5X社区") >= 0) { GM_log("当前网站：5X社区");
		_5xsq();
	}
})();