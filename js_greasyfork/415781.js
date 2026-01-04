// ==UserScript==
// @name         跳过优酷、腾讯和爱奇艺视频开头广告
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       zhengmingliang
// @match        *://*.v.qq.com/*
// @match        *://*.v.youku.com/*
// @match        *://*.iqiyi.com/*
// @grant        https://github.com/small-rose/skip-video-ad/blob/master/skip-ad.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415781/%E8%B7%B3%E8%BF%87%E4%BC%98%E9%85%B7%E3%80%81%E8%85%BE%E8%AE%AF%E5%92%8C%E7%88%B1%E5%A5%87%E8%89%BA%E8%A7%86%E9%A2%91%E5%BC%80%E5%A4%B4%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/415781/%E8%B7%B3%E8%BF%87%E4%BC%98%E9%85%B7%E3%80%81%E8%85%BE%E8%AE%AF%E5%92%8C%E7%88%B1%E5%A5%87%E8%89%BA%E8%A7%86%E9%A2%91%E5%BC%80%E5%A4%B4%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

   // 腾讯、优酷和爱奇艺跳过广告
var url = window.location.href;
if(new RegExp("v.qq.com").test(url)) {
	window.setInterval(function (){
        let time = document.querySelectorAll(".txp_ad video");
		if(time.length) {
			for(let i = 0; i<time.length; i++){
				time[i].currentTime = 110
			}
		}
    }, 1000);
}else if(new RegExp("v.youku.com").test(url)) {
	var timerTask = window.setInterval(function (){
		//$(".h5-ext-layer").find("div").remove();$(".control-play-icon").click()
		var oDiv = document.querySelectorAll(".h5-ext-layer div");
		if(oDiv && oDiv.length > 0){
			console.log(oDiv.length);
			Array.from(oDiv).forEach(i => i.remove());
			console.log("成功移除元素：.h5-ext-layer div")
			var oIcon = document.getElementsByClassName("control-play-icon");
			if(oIcon && oIcon.length>0) oIcon[0].click();
			console.log("成功点击：.control-play-icon");
			window.clearInterval(timerTask);
		}else{
			console.log(".h5-ext-layer div 尚未加载！！！")
		}
	}, 1000);
} else if(new RegExp("iqiyi.com").test(url)) {
	callIqyTask();
	var itemTask = window.setInterval(function(){
		var oTime = document.querySelectorAll(".cd-time");
		if(oTime && oTime.length>0 && parseInt(oTime[0].innerText) > 1) {
			console.log('==========================================' + oTime[0].innerText);
			callIqyTask();
			//window.clearInterval(itemTask);
		}else{
			console.log('================== 大王叫我来巡山，我把人间转一转 ========================' + (oTime[0] && oTime[0].innerText ? oTime[0].innerText : ''));
		}
	}, 1000)
}

function callIqyTask() {
	console.log('callIqyTask...')
	var iqyTask = window.setInterval(function (){
		//$(".skippable-after").click()
		var oDiv = document.querySelectorAll(".skippable-after");
		if(oDiv && oDiv.length > 0){
			console.log(oDiv.length);
			oDiv[0].click();
			console.log("成功点击 .skippable-after");
			let oTime = document.querySelectorAll(".cd-time");
			if(oTime && oTime.length>0 && parseInt(oTime[0].innerText) > 1) { oTime[0].innerText=1 }
			window.clearInterval(iqyTask);
		}else{
			console.log(".skippable-after 尚未加载！！！")
		}
	}, 1000);
}
})();