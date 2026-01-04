// ==UserScript==
// @name         放大评论区字体
// @namespace    C_Zero.bilibili.edit
// @version      1.0.0.11
// @description  放大B站评论区字体(自用)
// @author       C_Zero
// @match        *://www.bilibili.com/video/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475982/%E6%94%BE%E5%A4%A7%E8%AF%84%E8%AE%BA%E5%8C%BA%E5%AD%97%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/475982/%E6%94%BE%E5%A4%A7%E8%AF%84%E8%AE%BA%E5%8C%BA%E5%AD%97%E4%BD%93.meta.js
// ==/UserScript==

/**
 * 当前标签数量
 */
let currentLen = 0;
/**
 * 定时间隔
 */
let up_sec = 3000;
(function () {
    'use strict';
	setInterval(() => {
		// 获取所有评论框
		let rreplyContentSs = document.getElementsByClassName('reply-content');
		debugger;
		// 大家围观的直播
		let popopLiveeSs = document.getElementsByClassName('pop-live-small-mode');
		// 大家围观的直播
		let aaddReportSs = document.getElementsByClassName('ad-report');
		// 静态固定的评论框
		let fiiixedReeplySs = document.getElementsByClassName('fixed-reply-box');
		// 静态固定导航栏
		let biiiliHeadderSs = document.getElementsByClassName('mini-header');
		let lleen = rreplyContentSs.length;
		// 如果上次长度 等于 当前长度，则跳过
		if (currentLen != lleen) {
			// 非首次遍历时，直接从上一次的长度开始，上一次的长度就是索引
			for (var i = 0; i < lleen; i++) {
				rreplyContentSs[i].style.fontSize = '30px';
				rreplyContentSs[i].style.lineHeight = '50px';
				// rreplyContentSs[i].style.fontFamily = '楷体';
				rreplyContentSs[i].style.fontWeight = '800';
			};
			currentLen = lleen
			
			// 隐藏直播框
			for (var i = 0; i < popopLiveeSs.length; i++) {
				popopLiveeSs[i].style.display = 'none';
			};
			
			// 隐藏广告框
			for (var i = 0; i < aaddReportSs.length; i++) {
				aaddReportSs[i].style.display = 'none';
			};
			
		}

		// 隐藏静态固定的评论框
		for (var i = 0; i < fiiixedReeplySs.length; i++) {
			fiiixedReeplySs[i].style.display = 'none';
		};
		
		// 导航栏取消静态固定
		for (var i = 0; i < fiiixedReeplySs.length; i++) {
			biiiliHeadderSs[i].style.position = 'relative';
		};
		
	}, up_sec);
})();