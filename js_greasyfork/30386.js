// ==UserScript==
// @name         直播工具箱
// @description:zh-cn 自用备份
// @namespace    http://tampermonkey.net/
// @version      0.11
// @author       Aomm
// @match        *://*.douyu.com/*
// @match        *://*.panda.tv/*
// @run-at       document-idle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @description 自用备份
// @downloadURL https://update.greasyfork.org/scripts/30386/%E7%9B%B4%E6%92%AD%E5%B7%A5%E5%85%B7%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/30386/%E7%9B%B4%E6%92%AD%E5%B7%A5%E5%85%B7%E7%AE%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (location.href.indexOf('douyu.com') > 0) {
        douyu();
    }
    if (location.href.indexOf('panda.tv') > 0) {
        panda();
    }
    function panda(){
    	$("object").hide();
		var container = $(".dva-room");
		var roomid = container.attr("data-room-id");
		if(container.length){
			var iframe_listen = setInterval(function(){
			   if(container.find("iframe").length){
			       clearInterval(iframe_listen);
			       change_iframe_room(container,roomid);
			   }
			});
		}
		else if (location.href.indexOf('pgc.panda.tv') > 0 && typeof __MAHUA__ =='object') {
			$(".bd-top").after("<div id='dva-room-container'>");
			container = $("#dva-room-container");
			container.css({"width":$(".mahua-room").width(),"height":$(".mahua-room").height(),"margin":"0 auto"});
			change_iframe_room(container,__MAHUA__.roomid);
			$(".bd-top").hide();
		}
		function change_iframe_room(container,roomid){
			var room_option = encodeURI('{"roomId":"'+roomid+'","hideNotice":true,"hideHeadManage":true,"useH5player":true}');
			container.html('<iframe src="http://panda.tv/roomframe/'+roomid+'?options='+room_option+'&isInIFrame=1" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" frameborder="0" scrolling="no" style="width: 100%; height: 100%;"></iframe>');
		}
    }
    function douyu(){
    	$("object").hide();
		GM_addStyle(`
			.chat,.stats-and-actions,.room-mes,.task_case,.room-ad-top,.live-room-normal-equal-left,.live-room-normal-right,.room-ad-video-down,.fullpage-operate,.js-live-room-recommend{
				display:none!important;
			}
			#mainbody{
				padding:0px!important;
				width:100% !important;
			}
			.body-flash-fullpage #mainbody .live-room .room-video{
				right:0px!important;
				bottom:0px!important;
			}
			.live-room-normal-left{
				width:100% !important;
			}
		`);
		setTimeout(function(){
            $("#js-room-video").attr("style","height:"+$(".left-menu").height()+"px !important;");
            $(".left-menu").fadeOut();
        },2000);
    }
})();