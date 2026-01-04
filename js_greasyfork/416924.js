// ==UserScript==
// @name         百度网盘在线倍速播放，无需vip
// @namespace 	 好玩实验室
// @version      1.0.13
// @description  在视频播放页添加了0.7-2倍数播放按钮,并提供了自定义倍速的输入框
// @match        *://*.pan.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416924/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%9C%A8%E7%BA%BF%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%EF%BC%8C%E6%97%A0%E9%9C%80vip.user.js
// @updateURL https://update.greasyfork.org/scripts/416924/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%9C%A8%E7%BA%BF%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%EF%BC%8C%E6%97%A0%E9%9C%80vip.meta.js
// ==/UserScript==

(function() {
	'use strict';

	window.onload=function(){

		if(document.getElementsByClassName("privilege-box")[0]) {
			document.getElementsByClassName("privilege-box")[0].style="display:none"
		}

		document.getElementsByClassName("other-video-box")[0].style.marginTop="60px"

		let toolbar = document.querySelector(".video-toolbar-buttonbox")
		// 输入框
		let multiSpeedInput = document.createElement("input");
		multiSpeedInput.setAttribute("id","multiSpeedValue")
		multiSpeedInput.style="margin-left:30px;outline-style: none ;border: 1px solid #ccc; border-radius: 3px;padding: 5px 5px;width: 200px;font-size: 14px;font-weight: 700;";
		multiSpeedInput.setAttribute("placeholder","请输入想要的倍速，例如1.5")
		toolbar.appendChild(multiSpeedInput)

		var button = document.createElement("button");
		let textNode = document.createTextNode("确定")
		button.appendChild(textNode);
		button.style.width = "120px";
		button.style.height="30px"
		button.style.borderWidth="0px"
		button.style.borderRadius="3px"
		button.style.background	="#1E90FF"
		button.style.cursor="pointer"
		button.style.outline="none"
		button.style.color="white"
		button.style.fontSize="17px"
		button.style.marginLeft="20px"
		button.onclick=function(){
			let value = parseFloat(document.getElementById('multiSpeedValue').value)
			window.videojs.getPlayers("video-player").html5player.tech_.setPlaybackRate(value)
			// 更新span
			speedTextSpan.innerText = "当前播放速度为" + value + "倍速"

		}
		toolbar.appendChild(button);

		let span = document.createElement("span");
		span.setAttribute("id","speedText")
		span.innerHTML='当前播放速度为1倍速';
		span.style.marginLeft="25px"
		span.style.fontSize="16px"
		span.style.fontWeight="bolder"
		span.style.color="black"
		toolbar.appendChild(span);
		var speedTextSpan = document.getElementById("speedText");

		let tool = document.querySelector(".video-toolbar")

		let div = document.createElement("div");
		div.style.position="absolute";
		div.style.top="50px"
		div.style.left="90px"
		div.style.lineHeight="normal"
		for(let i = 70 ; i < 130; i = i + 10){
			let button = document.createElement("input");
			button.setAttribute("type", "button");
			button.setAttribute("value", i/100 + " 倍速播放");
			button.style.width = "100px";
			button.style.height="30px"
			button.style.borderWidth="0px"
			button.style.borderRadius="3px"
			button.style.background	="#1E90FF"
			button.style.cursor="pointer"
			button.style.outline="none"
			button.style.color="white"
			button.style.fontSize="17px"
			button.style.marginLeft="10px"
			button.addEventListener("click",function(event){
				console.log(i)
				console.log(window.videojs)
				if(window.isNaN(window.videojs.getPlayers("video-player").html5player.tech_.setPlaybackRate(i/100))){
					// 更新span
					speedTextSpan.innerText = "当前播放速度为" + i/100 + "倍速"
				}

			})
			div.appendChild(button);
		}
		tool.appendChild(div)



		let div1 = document.createElement("div");
		div1.style.position="absolute";
		div1.style.top="100px"
		div1.style.left="90px"
		div1.style.lineHeight="normal"

		for(let i = 130 ; i < 210; i = i + 10){
			let button = document.createElement("input");
			button.setAttribute("type", "button");
			button.setAttribute("value", i/100 + " 倍速播放");
			button.style.width = "120px";
			button.style.height="30px"
			button.style.borderWidth="0px"
			button.style.borderRadius="3px"
			button.style.background	="#1E90FF"
			button.style.cursor="pointer"
			button.style.outline="none"
			button.style.color="white"
			button.style.fontSize="17px"
			button.style.marginLeft="10px"
			button.addEventListener("click",function(){
				console.log(i)
				console.log(window.videojs)
				if(window.isNaN(window.videojs.getPlayers("video-player").html5player.tech_.setPlaybackRate(i/100))){
					// 更新span
					speedTextSpan.innerText = "当前播放速度为" + i/100 + "倍速"
				}
			})
			div1.appendChild(button);
		}

		let tool1 = document.querySelector(".video-toolbar")

		tool1.appendChild(div1)

	}
})()