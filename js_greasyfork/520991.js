// ==UserScript==
// @name         提取车型参数
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Extract car parameters from Dongchedi auto comparison page
// @author       You
// @match        https://www.autohome.com.cn/config/series/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520991/%E6%8F%90%E5%8F%96%E8%BD%A6%E5%9E%8B%E5%8F%82%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/520991/%E6%8F%90%E5%8F%96%E8%BD%A6%E5%9E%8B%E5%8F%82%E6%95%B0.meta.js
// ==/UserScript==

;(function () {
	'use strict'

	// 等待页面完全加载
	window.addEventListener('load', function () {
		// 创建按钮
		const button = document.createElement('button')
		button.textContent = '提取汽车参数'
		button.style.position = 'fixed'
		button.style.top = '50px'
		button.style.right = '50px'
		button.style.padding = '10px'
		button.style.backgroundColor = '#4CAF50'
		button.style.color = 'white'
		button.style.border = 'none'
		button.style.borderRadius = '5px'
		button.style.fontSize = '16px'
		button.style.zIndex = '9999'
		document.body.appendChild(button)

		// 按钮点击事件，提取汽车参数
		button.addEventListener('click', () => {
			// 等待数据渲染完成，防止数据动态加载
			setTimeout(() => {
				// 提取汽车对比表格中的参数
				let carData = ''
				const headerRows = document.querySelectorAll('.style_table_head__vIWOT')
				headerRows.forEach(row => {
					let titleList = row.querySelectorAll('.style_table_head_spec__3MP1V > a')
					titleList.forEach(title => {
						carData += `${title.textContent.trim()}	`
					})
				})
				carData += '\r'
				const rows = document.querySelectorAll('.style_row__c5h7k')
				rows.forEach(row => {
					let textList = row.querySelectorAll('.style_col__kPfGs')
					textList.forEach(textEl => {
						let a = textEl.querySelector('a.style_link__XaMXH')
						if (a) {
							carData += a.textContent.trim() + '	'
						} else {
							carData += textEl.textContent.trim() + '	'
						}
					})
					carData += '\r'
				})

				// 输出参数数据到控制台
				console.log('提取的汽车参数：', { carData })
			}, 1000) // 给页面渲染留出时间，视情况调整延迟时间
		})
	})
})()
