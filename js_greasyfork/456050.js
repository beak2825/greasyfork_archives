// ==UserScript==
// @name         B站视频调速
// @namespace    yeyu
// @version      0.3
// @description  bilibili视频调速，突破2倍速
// @author       夜雨
// @match        *://www.bilibili.com/video/*
// @match        *://www.bilibili.com/bangumi/play/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456050/B%E7%AB%99%E8%A7%86%E9%A2%91%E8%B0%83%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/456050/B%E7%AB%99%E8%A7%86%E9%A2%91%E8%B0%83%E9%80%9F.meta.js
// ==/UserScript==

(function() {


	GM_addStyle(`
		#videoRate {
			    appearance: none;
				text-align: center;
				height: 36px;
				width: 70px;
				border-radius: 15px;
				border: 0px solid #fff;
				padding: 0 8px;
				outline: 0;
				letter-spacing: 1px;
				font-weight: 600;
				background: rgba(45,45,45,.10);
				border: 1px solid rgba(255,255,255,.15);
				box-shadow: 0 2px 3px 0 rgba(0,0,0,.1) inset;
				text-shadow: 0 1px 2px rgba(0,0,0,.1);
				-o-transition: all .2s;
				-moz-transition: all .2s;
				-webkit-transition: all .2s;
				-ms-transition: all .2s;
		}
	`)
	'use strict';
	window.onload = function() {

		var bar = document.querySelector(".bpx-player-sending-area");
		var input = document.createElement("input");
		input.value = 1;
		input.id = "videoRate";
		input.type = "number";
		input.onchange = function(e) {
			if (e.type == "change" && !isNaN(this.value)) {
				console.log(this.value)
				if (this.value > 16 || this.value < 0) {
					this.value = 1;
				}
				let video_ = document.querySelector("bwp-video")
				if(!video_){
					video_ = document.querySelector("video")
				}
				video_.playbackRate = parseFloat(this.value);
			}
		}
		var sp = document.createElement("span")
		sp.innerText = "视频速度: (0~16) =>"
		bar.appendChild(sp)
		bar.appendChild(input);
	}

})();
