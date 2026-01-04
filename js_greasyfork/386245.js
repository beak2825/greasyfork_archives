// ==UserScript==
// @name     AP4Baidu-百度网盘自动播放
// @namespace   AP4Baidu
// @version     1.1.1
// @description  AP4Baidu-百度网盘自动播放下一个视频
// @author       tianwyam
// @match        https://pan.baidu.com/play/*
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/video.js/7.3.0/video.min.js
// @downloadURL https://update.greasyfork.org/scripts/386245/AP4Baidu-%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/386245/AP4Baidu-%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
	
	'use strict';

	/**
	 * 自动播放下一个视频
	 */
	function playNext() {

		// 判断是否拥有 视频列表
		if(videoListView != null && videoListView != undefined) {

			// 查找当前视频位置
			var flag = 0;
			var childElements = videoListView.children();
			var size = childElements.length;
			for(var i in childElements) {
				var item = childElements[i];
				var ifCurrentPlay = item.is(".currentplay");
				if(ifCurrentPlay) {
					console.log("当前播放视频：" + item.title);
					item.removeClass("currentplay");
					flag = i;
					break;
				}
			}

			// 播放下一个视频
			if(flag + 1 < size) {
				var nextItem = childElements[flag + 1];
				nextItem.onclick();
				nextItem.addClass("currentplay");
				console.log("下一个播放视频：" + nextItem.title);
			}
		}

	}

	function findUrl() {
		var host = window.location.href;
		var url = host.split("?")[0];
		return url;
	}

	function ifBaiduNetDiskVideoPage() {
		var url = findUrl();
		if(url != null && url != '' && url != undefined &&
			url == "https://pan.baidu.com/play/video#/video") {
			return true;
		}
	}

	// 如果是百度视频播放页面，则播放完毕后 自动播放下一个视频
	if(ifBaiduNetDiskVideoPage()) {

		// 当前播放的视频
		var video = $("#video-player embed");
		
		console.log("AP4Baidu-百度网盘自动播放插件");
		console.log(video);
		// 视频列表
		var videoListView = $("#videoListView");
		console.log(videoListView);

		console.log(window.location.href);
		
		/*video.addEventListener("ended", function(){
			console.log("播放结束了。。。。");
			playNext();
		});*/

//		if(videojs !== undefined && videojs.getPlayers("video-player") !== undefined){
//			console.log(videojs.getPlayers("video-player"));
//			videojs.getPlayers("video-player").html5player.onended = function() {
//				console.log("播放结束了。。。。");
//				playNext();
//			}
//		}

		var options = {};
 
		var player = videojs("#video-player embed", options, function onPlayerReady() {
		  videojs.log("播放器已经准备好了!");
		  // How about an event listener?<br>  // 如何使用事件监听？
		  this.on("ended", function() {
		    videojs.log("播放结束了!");
		    playNext();
		  });
		});

		// 添加 播放结束监听
		console.log("添加 播放结束监听");
		video.onended = function() {
			console.log("播放结束了。。。。");
			playNext();
		};
		
		video.on("ended", function() {
			console.log("播放结束了。。。。");
			playNext();
		});
		
		video.live("ended", function() {
			console.log("播放结束了。。。。");
			playNext();
		});

	}

})();