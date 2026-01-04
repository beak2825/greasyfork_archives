// ==UserScript==
// @name         视频快速播放
// @namespace    http://tampermonkey.net/
// @icon         https://img-blog.csdnimg.cn/20181221195058594.gif
// @version      1.0.7
// @description  看视频播太慢，这能忍？直接倍速播放，【食用方法】①调节右上角加速框右侧上下按钮即可调节倍率 ②在右上角的加速框内输入加速倍率,如2、4、8、16等。
// @author       wll
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/2.2.0/jquery.js
// @match        *://ke.qq.com/webcourse/index.html
// @match        *://www.bilibili.com/*
// @match        *://www.iqiyi.com/*
// @match        *://ehuixue.cn/index/study/*
// @match        *://*.ehuixue.cn/index/study/*
// @match        *://*.chaoxing.com/*
// @match        *://*.douyin.com/*
// @match        *://*.youku.com/*
// @note         增加支持网站：	依照规则增加@match所在标签即可
// @note         郑重声明：	本脚本只做学习交流使用，未经作者允许，禁止转载，不得使用与非法用途，一经发现，追责到底
// @note         授权联系：	leiwang2010@163.com
// @note         版本更新	20-12-26 1.0.0	初版发布视频倍速播放
// @note         版本更新	21-02-04 1.0.1 	优化用户体验
// @note         版本更新	21-02-04 1.0.2 	优化标题，优化简介
// @note         版本更新	21-06-18 1.0.3 	增加新的倍速网址，ehuixue.cn/index/study，ehuixue.cn/index/study，chaoxing.com
// @note         版本更新	21-06-25 1.0.4 	增加新的倍速网址，douyin.com
// @note         版本更新	21-06-26 1.0.5 	增加新的倍速网址，pan.baidu.com,youku.com
// @note         版本更新	21-07-09 1.0.6 	修正哔哩哔哩网站无法暂停问题
// @note         版本更新	21-10-11 1.0.7 	由于百度云视频倍速播放收费，一时无法解决，暂时停用百度相关加速*://*.pan.baidu.com/*
 
// @downloadURL https://update.greasyfork.org/scripts/433921/%E8%A7%86%E9%A2%91%E5%BF%AB%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/433921/%E8%A7%86%E9%A2%91%E5%BF%AB%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==
 
(function() {
	'use strict';
 
	var stepHtml = '<input id="rangeId" type="number" step="0.1" min="0.1" max="20" value="1" style="z-index:999999;position:absolute;top:100px;right:100px;border:solid 1px;background-color:#E3EDCD;" />';
	$("body").prepend(stepHtml);
    var stopFlag = true;
 
	window.setInterval(function() {
		let step = document.getElementById("rangeId").value || 1.0;
		var htmlVideo = $("video").length;
		if(htmlVideo > 0) {
            console.log("倍速播放方法启动,当前倍率为....." + step);
			var url = location.href;
 
			if(url.indexOf('bilibili.com/video/') > 0) {
			    if(stopFlag){
			        //play video twice as fast
			    	document.querySelector('video').defaultPlaybackRate = 1.0; //矫正正常播放
			    	document.querySelector('video').play();
			    	stopFlag = false;
			    }
			}
 
			// now play three times as fast just for the heck of it
			document.querySelector('video').playbackRate = step; //修改此值设置当前的播放倍数
		} else {
			console.log("当前视频不支持倍速播放..... o(╥﹏╥)o");
		}
 
	}, 1000);
 
})();