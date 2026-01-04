// ==UserScript==
// @name         脚本1
// @namespace    yeyu
// @version      0.3
// @description  叔叔不约配女 你懂我的意思吧
// @author       夜雨
// @match        *://*.shushubuyue.net/*
// @match        *://*.shushubuyue.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shushubuyue.net
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475577/%E8%84%9A%E6%9C%AC1.user.js
// @updateURL https://update.greasyfork.org/scripts/475577/%E8%84%9A%E6%9C%AC1.meta.js
// ==/UserScript==





//输入框
// document.querySelector("#msgInput").value


// //离开按钮(左边)
// document.querySelector("a.button-link.chat-control").click()
// document.querySelector("span.actions-modal-button.actions-modal-button-bold.color-danger").click()

// //离开-重开按钮(中间)
// document.querySelector("span.chat-control").click()
// document.querySelector("span.chat-control").innerText == '离开' / '重新开始'

var iflag = 0;

(function() {
	
	'use strict';
	
	function leave() {
		iflag = 0;
		var leftButton = document.querySelector("a.button-link.chat-control");
		if (leftButton) leftButton.click();
		var leftSecondButton = document.querySelector("span.actions-modal-button.actions-modal-button-bold.color-danger");
		if (leftSecondButton) leftSecondButton.click();
		
		var restartButton = document.querySelector("span.chat-control");
		if (restartButton && restartButton.innerText) {
			if (typeof restartButton.innerText == "string" && restartButton.innerText == "离开") {
				restartButton.click();
				setTimeout(function() {
					restartButton.click();
				}, 500)
			} else if (typeof restartButton.innerText == "string" && restartButton.innerText == "重新开始") {
				restartButton.click();
			} else {
				console.log("error restartButton");
			}
		}
	}
	
	function init() {
		setInterval(() => {
			var tab = document.querySelector("#partnerInfoText")
			if (tab) var tabText = tab.innerText;
			if (tabText && typeof tabText == 'string' && tabText.indexOf("女生") != -1) {
				//女生
				var msgInput = document.querySelector("#msgInput");
				var infoText1 = document.querySelector(".message.left #partnerInfoText");
				var infoText2 = document.querySelector(".message.right #partnerInfoText");
				if (msgInput){
					if(!(infoText1||infoText2)){
						//首次自动打招呼
						var event = new Event("input");
						msgInput.value = "\u59b9\u59b9\u4e48\u4e48\u54d2";
						msgInput.dispatchEvent(event);
						setTimeout(function() {
							if (document.querySelector("#msgInput").value=="\u59b9\u59b9\u4e48\u4e48\u54d2") {
								document.querySelector("a.button-link.msg-send").click();
							}
						}, 1500);
					}
					
					if (iflag<5) {
						//声音提醒5次
						window.AudioContext = window.AudioContext || window.webkitAudioContext;
						var audioCtx = new AudioContext();
						var oscillator = audioCtx.createOscillator();
						var gainNode = audioCtx.createGain();
						oscillator.connect(gainNode);
						gainNode.connect(audioCtx.destination);
						oscillator.type = 'sine';
						oscillator.frequency.value = 800.00;
						gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
						gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.01);
						oscillator.start(audioCtx.currentTime);
						gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);
						oscillator.stop(audioCtx.currentTime + 1);
					}
					iflag++;
					
				} else {
					leave();
				}
			}
			
			if (tabText && typeof tabText == 'string' && tabText.indexOf("男生") != -1) {
				//男生
				leave();
			}
			
		}, 1000)
	}
	
	setTimeout(init, 5000)
	
	setInterval(function() {
		const actionsButtons = document.querySelectorAll("div.actions-modal.modal-in")
		if (actionsButtons.length>1) {
			document.querySelectorAll("div.actions-modal.modal-in").forEach(e => e.remove());
		}
	},100);
	
})();
