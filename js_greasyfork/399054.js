// ==UserScript==
// @name 学堂在线自动刷课
// @namespace http://tampermonkey.net/
// @version 2.3
// @description 学堂在线。支持视频2倍数自动顺序播放、后台播放。
// @author 
// @require https://cdn.bootcss.com/jquery/1.10.2/jquery.min.js
// @match https://*.xuetangx.com/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/399054/%E5%AD%A6%E5%A0%82%E5%9C%A8%E7%BA%BF%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/399054/%E5%AD%A6%E5%A0%82%E5%9C%A8%E7%BA%BF%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==
// ==UserScript==
// @name 学堂在线自动刷课
// @namespace http://tampermonkey.net/
// @version 2.2
// @description 学堂在线。支持视频2倍数自动顺序播放、后台播放。
// @author 
// @require https://cdn.bootcss.com/jquery/1.10.2/jquery.min.js
// @match https://*.xuetangx.com/*
// @grant none
// ==/UserScript==
(function () {
    'use strict';
    start();
	var runIt;
	//开始视频播放
	function start(){
		console.log("播放----");
		window.clearInterval(runIt);
	
		runIt= setInterval(next,2000);
		if($(".play-btn-tip").text() == "播放"){
			console.log("开始播放视频");
			$(".play-btn-tip").click();
		}
	}
	
	//停止视频播放
	function stop(){
		start();
		clearInterval(runIt);
		console.log("暂停----");
		if($(".play-btn-tip").text() == "暂停"){
			console.log("暂停视频");
			$(".play-btn-tip").click();
		}
	}

	//跳转下一节视频
	function next(){
		var video = $("video")[0];
		if(video == undefined){
			$(".next").click();
			console.log("作业，5秒后跳转下一个视频");
		}
		else if(video.length != 0){
			var staNow = $(".play-btn-tip");
			if(staNow.text() == "播放"){
				console.log("播放视频");
				$(".play-btn-tip").click();
			}
			var c= video.currentTime;
			var d = video.duration;
			//不想关闭声音可以把此行代码删掉
			soundClose();
			speed();
			//视频播放进度超过95%跳转下一节视频
			if((c/d)>0.95){
				$(".next").click();
				console.log("跳转到下一节");
				console.log("本节观看百分比"+c/d);  
			}
		}else {
			console.log("未知错误！");
		}
	}
	//关闭视频声音
	function soundClose(){
		var sound = $(".xt_video_player_common_icon_muted");
		if(sound.length == 0){
			$(".xt_video_player_common_icon").click();
			console.log("视频声音关闭");
		}
	}
	//播放速度2.0
	function speed(){
		var speed = $(".xt_video_player_common_list");
		var speedChild = speed.children()[0];
		var gp = "wi";
		speedChild.click();
		console.log("倍速点击了2.0");
	}
	



 
})();