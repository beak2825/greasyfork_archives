// ==UserScript==
// @name         B站web端动态页面图片显示优化
// @namespace    www.cber.ltd
// @version      1.0.0
// @description  优化B站web端动态页面图片显示，左右翻页按钮两侧水平居中对齐，图片页码列表底部居中对齐，图片不再按宽度拉伸而是居中显示
// @author       SnhAenIgseAl
// @match        https://t.bilibili.com/*
// @match        https://space.bilibili.com/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @connect      bilibili.com
// @grant        GM_xmlhttpRequest
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/492296/B%E7%AB%99web%E7%AB%AF%E5%8A%A8%E6%80%81%E9%A1%B5%E9%9D%A2%E5%9B%BE%E7%89%87%E6%98%BE%E7%A4%BA%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/492296/B%E7%AB%99web%E7%AB%AF%E5%8A%A8%E6%80%81%E9%A1%B5%E9%9D%A2%E5%9B%BE%E7%89%87%E6%98%BE%E7%A4%BA%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==



(function() {
	'use strict'

	const observer = new PerformanceObserver(perObs)
	observer.observe({entryTypes: ['resource']})

	/**
	 * 过滤fetch及xhr请求
	 */ 
	function getNetworkRequest(
		entries = performance.getEntriesByType('resource'),
		type = ['fetch', 'xmlhttprequest']) {
			return entries.filter(entry => {
				return type.indexOf(entry.initiatorType) > -1
			})
		}

	/**
	 * 监听网络变化
	 */ 
	function perObs(list, obs) {
		let per = getNetworkRequest(list.getEntriesByType('resource'))

		// 当网络请求路径页面的数据请求时，执行美化操作
		for (let i = 0; i < per.length; i++) {
			if (per[i].name.startsWith('https://api.bilibili.com/x/')) {
				beautify()
			}
		}
	}

	/**
	 * 美化页面
	 */
	function beautify() {

		// 图片容器
		const preview_img = document.getElementsByClassName('preview__picture__img')
		for (let i = 0; i < preview_img.length; i++) {
			preview_img[i].style.display = 'flex'
		}

		// 图片
		const img = document.getElementsByClassName('b-img__inner')
		for (let i = 0; i < img.length; i++) {
			img[i].style.width = 'unset'
			img[i].style.margin = 'auto'
		}

		// 左翻页按钮
		const button_prev = document.getElementsByClassName('swiper-button-prev')
		for (let i = 0; i < button_prev.length; i++) {
			button_prev[i].style.bottom = '50%'
			button_prev[i].style.transform = 'translateY(50%)'
		}

		// 右翻页按钮
		const button_next = document.getElementsByClassName('swiper-button-next')
		for (let i = 0; i < button_next.length; i++) {
			button_next[i].style.left = 'unset'
			button_next[i].style.right = '12px'
			button_next[i].style.bottom = '50%'
			button_next[i].style.transform = 'translateY(50%)'
		}

		// 底部图片页码
		const bullets = document.getElementsByClassName('swiper-pagination-bullets')
		for (let i = 0; i < bullets.length; i++) {
			bullets[i].style.left = '50%'
			bullets[i].style.right = 'unset'
			bullets[i].style.transform = 'translateX(-50%)'
		}
	}
})();