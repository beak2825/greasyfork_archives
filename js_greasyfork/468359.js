// ==UserScript==
// @name         youtube
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  you
// @author       You
// @license      AGPL
// @match        https://chipmunk-algae-zbbz.squarespace.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468359/youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/468359/youtube.meta.js
// ==/UserScript==


$(function(){
	addScript('https://code.jquery.com/jquery-3.1.1.min.js')
	//循环查询是否已经获得U
	zidong()
})

function addScript(url){
 	var script = document.createElement('script');
 	script.setAttribute('type','text/javascript');
 	script.setAttribute('src',url);
 	document.getElementsByTagName('head')[0].appendChild(script);
}

function zidong(){
	var html_video=$('#task_video').contents()//视频播放页面
	var x=setTimeout(function (){
		//判断有没有播放按钮
		播放按钮=html_video.find("[class='ytp-large-play-button ytp-button ytp-large-play-button-red-bg']")
		if (播放按钮.length===1){
			console.log('点击播放按钮')
			播放按钮.click()
			播放按钮.remove()
		}
		文本=$('.status-bar-text').eq(0).text()
		console.log(文本)
		if (文本.indexOf('has been counte')>-1){
			window.close()
		}
		zidong()
	},1000);
}







