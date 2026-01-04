// ==UserScript==
// @name         Republic Script
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  抢
// @author       cc
// @match        https://republic.co/*
// @downloadURL https://update.greasyfork.org/scripts/424676/Republic%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/424676/Republic%20Script.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// 设置默认参数
	var investmentAmount = '250,000'            // 使用三位分节法格式表示金额
	var startTime = '2021-04-08 22:00:00'       // 使用 yyyy-mm-dd HH:MM:SS 格式表示时间

	// 下面不用修改
	var inform = (msg) => console.log('%c' + msg, 'font-size: 20px; background-color: #0049ff; color: white;')
	var s = document.createElement('script');
	s.src = 'https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js'
	document.body.appendChild(s)
	s.addEventListener('load', function () {
		if (location.href.match(/https:\/\/republic.co\/[\w\-]+?\/invest/)) {
			$(document).ready(function() {
				(function rec () {
					var investment = $('input[type=text]')[0]
					var checkbox = $('input[type=checkbox]')[0]
					if (investment && checkbox) {
						investment.setAttribute('value', investmentAmount)
						investment.value = investmentAmount
						$(investment).on('blur', function () {
							investment.setAttribute('value', investmentAmount)
							investment.value = investmentAmount
						})
						checkbox.checked = true
					} else {
						inform('找不到输入框或勾选框')
						setTimeout(rec, 50)
					}
				})()
			})
		} else {
			$(document).ready(function() {
				var invest_button = $('.js-invest_button')[0]
				if (invest_button) {
					inform(`准备于${startTime}点击`)
					var deltaTime = new Date(startTime).getTime() - Date.now()
					deltaTime = deltaTime >= 0 ? deltaTime : 0
					setTimeout(() => {
						invest_button.click()
					}, deltaTime)
				} else {
					inform('找不到点击按钮')
				}
			})
		}
	})
})();