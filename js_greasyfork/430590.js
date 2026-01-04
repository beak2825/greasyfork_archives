// ==UserScript==
// @name         juejin_auto_check_in
// @namespace    pengtianyu
// @version      0.2.1
// @description  掘金自动签到
// @author       pengtianyu
// @match        https://juejin.cn/*
// @downloadURL https://update.greasyfork.org/scripts/430590/juejin_auto_check_in.user.js
// @updateURL https://update.greasyfork.org/scripts/430590/juejin_auto_check_in.meta.js
// ==/UserScript==


(function() {
	// setInterval(() => {
	// 	if(document.querySelector('.signin-btn')) {
	// 		goSignIn()
	// 	}
	// }, 1000)
	let flag = false
	window.onload = function () {
		goSignIn()
		flag = true
	}

	setInterval(() => {
		if(flag) {
			signIn()
		}
	}, 1000)

	// 跳转签到页面
	function goSignIn() {
		let text = document.querySelector('.btn-text').innerHTML
		if(text === '已签到') return false
		document.querySelector('.signin-btn').click()
		console.log('已执行跳转签到页面')
	}

	//点击签到
	function signIn() {
		document.querySelector('.signin .btn').click()
		flag = false
		console.log('已签到')
	}
})()
