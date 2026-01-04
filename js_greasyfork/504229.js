// ==UserScript==
// @name         B站显示分段标题
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  放大进度条并显示分段标题
// @author       atakhalo
// @match        https://www.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/504229/B%E7%AB%99%E6%98%BE%E7%A4%BA%E5%88%86%E6%AE%B5%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/504229/B%E7%AB%99%E6%98%BE%E7%A4%BA%E5%88%86%E6%AE%B5%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
	// 动态调整字本大小
	function adjustTextSize(element) {
		// 创建一个 canvas 元素用于测量文本宽度
		let canvas = document.createElement('canvas');
		let ctx = canvas.getContext('2d');
		ctx.font = element.style.font;
	
		// 测量文本宽度
		const showRate = 1.5; // 字显示时变长了
		const textWidth = ctx.measureText(element.textContent).width * showRate;
		const singleWidth = 10 * showRate; // 16px 单字 10长度
		const textScaleWidth = singleWidth * 2;
		// 如果相差两个字以内，则缩放
		const textOffset = textWidth - element.offsetWidth
		if (textOffset > 0) // 文本短于容器不需要处理 
		{
			if(textOffset <= textScaleWidth)
			{
				const ratio = element.offsetWidth / textWidth 
				element.style.transform = `scale(${ratio})`; // 缩放文本
				element.style.transformOrigin = 'center center'; // 确保缩放的中心点在文本的中心
			}
			else // 否则改为省略后面文字
			{
				const textOver = textOffset / singleWidth + 1;
				const str = element.textContent;
				element.textContent = str.slice(0, str.length - textOver) + "..";
			}
		}
	}

	// 给片段加标题
	function AddSegmentTitle(segment, title) {
		// 创建一个文本节点
		const textNode = document.createTextNode(title);
		// 创建一个 div 用于包裹文本，使其居中
		const textWrapper = document.createElement('div');
		textWrapper.className = 'text-wrapper'; // 用于样式
		textWrapper.appendChild(textNode);
		
		// 设置样式使文本居中且宽度与父元素相同
		textWrapper.style.width = '100%';
		textWrapper.style.position = 'absolute';
		textWrapper.style.top = '0'; // 或者 '50%' 并加上 transform: translateY(-50%)
		textWrapper.style.left = '0';
		textWrapper.style.display = 'flex';
		textWrapper.style.justifyContent = 'center'; // flex-start
		textWrapper.style.alignItems = 'center';
		textWrapper.style.height = '100%';
		textWrapper.style.fontSize = '16px';
		textWrapper.style.color = 'white'; // 文本颜色
		textWrapper.style.textShadow = '2px 2px 2px rgba(0,0,0,0.5)'; // 文本描边
		textWrapper.style.whiteSpace = 'nowrap'

		// 将文本节点添加到元素中
		segment.appendChild(textWrapper);

		// 等待重排后再调用调整字体大小的函数
		requestAnimationFrame(() => {
			adjustTextSize(textWrapper);
		});
	}

	// 给每个片段加标题
	function AddToSegment(progress) {
		const segments = progress.querySelectorAll('.bpx-player-progress-schedule-segment');
		const lis = document.querySelectorAll('.bpx-player-ctrl-viewpoint-menu li');
		for (let i = 0; i < segments.length; i++) {
			const segment = segments[i];
			const liText = lis[i].textContent;
			AddSegmentTitle(segment, liText);
		}
	}

	// 给两条进度条加标题
	function ProgressAddTitle() {
		const progress1 = document.querySelector('.bpx-player-progress-schedule-wrap');
		const progress2 = document.querySelector('.bpx-player-shadow-progress-schedule-wrap');
		AddToSegment(progress1)
		AddToSegment(progress2)
	}

	// 点击进度条会重置，定时设置一下
	function BigProgressCheck() {
		setInterval(function() { 
			const progress1 = document.querySelector('.bpx-player-progress');
			if (progress1.style.height != "20px")
			{
				progress1.style.height = "20px";
			}
			const progress2 = document.querySelector('.bpx-player-shadow-progress-area');
			if (progress2.style.height != "20px")
			{
				progress2.style.height = "20px";
			}
		}, 1000);
	}

	// 放大进度条
	function SetBigProgress() {
		// 定时检测到两个进度条加载后设置高度及添加文字，设置完取消定时
		// 上方进度条点击时会重置，再定时设置
		var checkInterval = setInterval(function() { 
			const progress1 = document.querySelector('.bpx-player-progress');
			const progress2 = document.querySelector('.bpx-player-shadow-progress-area');
			if (progress1 && progress2) {
				progress1.style.height = "20px";
				progress2.style.height = "20px";
				clearInterval(checkInterval);	

				ProgressAddTitle();
				BigProgressCheck();
			}
		}, 500);
	}

	// 定时检测url是否变了判断是否切换分p
	var originalUrl = window.location.href;
	function ListenToToggle() {
		setInterval(function () {
			var currentUrl = window.location.href;
			if (currentUrl !== originalUrl) {
				originalUrl = currentUrl;
				ProgressAddTitle()
			}
		}, 1000);
	}

	// 网页有播放器才执行脚本内容
	function TryExecute() {
		const video = document.querySelector('.bpx-player-video-area');
		if (video)
		{
			SetBigProgress();
			ListenToToggle();
		}
	}
	TryExecute();
})();