// ==UserScript==
// @name         叔叔不约只配男 哥哥喜欢丝袜吗版
// @namespace    yeyu
// @version      0.5
// @description  进入叔叔不约随机聊天，自动筛选男生并发送“哥哥喜欢丝袜吗”，自动跳过女生
// @author       夜雨
// @match        *://*.shushubuyue.net/*
// @match        *://*.shushubuyue.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shushubuyue.net
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545788/%E5%8F%94%E5%8F%94%E4%B8%8D%E7%BA%A6%E5%8F%AA%E9%85%8D%E7%94%B7%20%E5%93%A5%E5%93%A5%E5%96%9C%E6%AC%A2%E4%B8%9D%E8%A2%9C%E5%90%97%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/545788/%E5%8F%94%E5%8F%94%E4%B8%8D%E7%BA%A6%E5%8F%AA%E9%85%8D%E7%94%B7%20%E5%93%A5%E5%93%A5%E5%96%9C%E6%AC%A2%E4%B8%9D%E8%A2%9C%E5%90%97%E7%89%88.meta.js
// ==/UserScript==





//输入框
// document.querySelector("#msgInput").value


// //离开按钮(左边)
// document.querySelector("a.button-link.chat-control").click()
// document.querySelector("span.actions-modal-button.actions-modal-button-bold.color-danger").click()

// //离开-重开按钮(中间)
// document.querySelector("span.chat-control").click()
// document.querySelector("span.chat-control").innerText == '离开' / '重新开始'

(function() {

	'use strict';

	const autoReply = '哥哥喜欢丝袜吗'// 这里填写匹配成功后，你要自动填充的句子

	function leave() {
		var leftButton = document.querySelector("a.button-link.chat-control");
		if (leftButton) leftButton.click()
		var leftSecondButton = document.querySelector(
			"span.actions-modal-button.actions-modal-button-bold.color-danger")
		if (leftSecondButton) leftSecondButton.click()

		var restartButton = document.querySelector("span.chat-control")
		if (restartButton && restartButton.innerText) {
			if (typeof restartButton.innerText == "string" && restartButton.innerText == "离开") {
				restartButton.click()
				setTimeout(function() {
					restartButton.click()
				}, 500)
			} else if (typeof restartButton.innerText == "string" && restartButton.innerText == "重新开始") {
				restartButton.click()
			} else {
				console.log("error restartButton")
			}
		}

	}

	let firstAuto = true
	function init() {
		setInterval(() => {
			var tab = document.querySelector("#partnerInfoText")
			if (tab) var tabText = tab.innerText
			if (tabText && typeof tabText == 'string' && tabText.indexOf("男生") != -1) {
					if(firstAuto){
						firstAuto = false
						setTimeout((ev)=>{
							var msgInput = document.querySelector("#msgInput")
							msgInput.value = autoReply;
							msgInput.dispatchEvent(new Event('input'))
							msgInput.dispatchEvent(new Event('change'))
							document.querySelector(".button-link.msg-send").click()
						}, 1000)
					}
			}

			if (tabText && typeof tabText == 'string' && tabText.indexOf("女生") != -1) {
				firstAuto = true
				leave()
			}

		}, 1000)
	}

	setTimeout(init, 5000)



})();
