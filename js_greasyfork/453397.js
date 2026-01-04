// ==UserScript==
// @name         deepin wiki PC页面目录滑块
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  给 deepin wiki PC网站页面加一个滑动条, 动态调整目录宽度, 适配网站: https://wiki.deepin.org/
// @author       You
// @match        https://wiki.deepin.org/zh/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453397/deepin%20wiki%20PC%E9%A1%B5%E9%9D%A2%E7%9B%AE%E5%BD%95%E6%BB%91%E5%9D%97.user.js
// @updateURL https://update.greasyfork.org/scripts/453397/deepin%20wiki%20PC%E9%A1%B5%E9%9D%A2%E7%9B%AE%E5%BD%95%E6%BB%91%E5%9D%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function initBar() {
	if (document.querySelector('nav.v-navigation-drawer')) {}
	else {
		console.log('deepin wiki PC页面目录滑块: 等待1秒后重试')
		setTimeout(()=>{
			initBar()
		}, 1000)
		return
	}
	// 当前目录按最大化展示
	document.querySelector('nav.v-navigation-drawer').style.width = 'auto'
	var temp_width = document.querySelector('nav.v-navigation-drawer').clientWidth
	document.querySelector('main.v-main').style['padding-left'] = temp_width + 'px'

	// 重置目录宽度
	function resetPage(left) {
		document.querySelector('nav.v-navigation-drawer').style.width = left + 'px'
		document.querySelector('main.v-main').style['padding-left'] = left + 'px'
	}


	// 获取目录宽度(用于拖动条的初始化)
	temp_width = document.querySelector('nav.v-navigation-drawer').clientWidth

	// 添加一个新拖动条 div
	var divObj = document.createElement('div') // 创建div
	divObj.style.position = 'fixed' // 固定布局
	divObj.style.width = '20px' // 设置宽度
	divObj.style.backgroundColor = '#f3e6c3' // 配置颜色
	divObj.style.height = '100%' // 高度按百分比配置
	divObj.style.left = temp_width + 'px' // 初始化左侧宽度
	divObj.style.top = '0px' // 设置上方位置, 如果不设置会被已有元素顶掉
	divObj.style.cursor = 'col-resize' // 设置鼠标样式
	divObj.style.zIndex = 2001 // 将拖动条显示到最上方

	// 拖动事件监听
	var startMove = false // 开始拖动的标志
	var lastPointerWidth = 0 // 鼠标上一次的x坐标位置
	// 鼠标移动
	document.onmousemove = function (e) {
		if (startMove) { // 鼠标按下才会进入
			let newLeftValue = parseInt(divObj.style.left) + e.clientX - lastPointerWidth
			divObj.style.left = newLeftValue + 'px'
			lastPointerWidth = e.clientX
			resetPage(newLeftValue)
		}
	}
	// 鼠标按下
	divObj.onmousedown = function (e) {
		lastPointerWidth = e.clientX
		startMove = true
	}
	// 鼠标松开
	divObj.onmouseup = function (e) {
		lastPointerWidth = e.clientX
		startMove = false
	}
	// 放入页面
	document.body.appendChild(divObj)
}
setTimeout(()=>{
	initBar()
}, 1000)


})();