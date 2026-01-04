// ==UserScript==
// @name         CC字幕 | 查词翻译 ｜谷歌翻译｜沙拉查词
// @namespace    indefined
// @version      0.2
// @description  在B站和YouTube学英语的时候，有时候开启了CC字幕，但是CC字幕没办法复制某个单词，得需要手动输入到翻译工具里，感觉有点麻烦，所以我做了一个油猴小插件，让CC字幕可以能够被选中复制，结合谷歌翻译或者沙拉查词就能很快的找到对应单词或句子的翻译了。
// @author       kenny
// @match        https://www.bilibili.com/*
// @match        https://www.youtube.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478647/CC%E5%AD%97%E5%B9%95%20%7C%20%E6%9F%A5%E8%AF%8D%E7%BF%BB%E8%AF%91%20%EF%BD%9C%E8%B0%B7%E6%AD%8C%E7%BF%BB%E8%AF%91%EF%BD%9C%E6%B2%99%E6%8B%89%E6%9F%A5%E8%AF%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/478647/CC%E5%AD%97%E5%B9%95%20%7C%20%E6%9F%A5%E8%AF%8D%E7%BF%BB%E8%AF%91%20%EF%BD%9C%E8%B0%B7%E6%AD%8C%E7%BF%BB%E8%AF%91%EF%BD%9C%E6%B2%99%E6%8B%89%E6%9F%A5%E8%AF%8D.meta.js
// ==/UserScript==
(function () {
	'use strict';

	let stopTextPropagation = function stopTextPropagation(className) {
		let text = document.getElementsByClassName(className);
		if (text.length > 0) {
			let wrap = text[0];
			wrap.style['user-select'] = 'text';
			let eventList = ['mousedown', 'click', 'mouseout', 'mousemove', 'touchstart'];
			for(let i = 0; i < eventList.length; i++){
				wrap.addEventListener(eventList[i], function (e) {
				  e.stopPropagation();
				  return;
				});
			  }
		} else {
			// Handle the case where no elements were found
			console.log("No elements found with the specified class name.");
		}
	}


	let observeDomChanged = function(domChangedClass, subtitleClass){
		const targetNode = document.getElementsByClassName(domChangedClass)[0];
		const callback = function (mutationsList, observer) {
			mutationsList.forEach(mutation => {
				stopTextPropagation(subtitleClass);
			});
		};
 
		const observer = new MutationObserver(callback);
 
		const config = { attributes: true, childList: true, subtree: true };
 
		if (targetNode) {
			observer.observe(targetNode, config);
		} else {
			console.error('Target node not found');
		}
	}

	setTimeout(function(){
		var curUrl = window.location.href;
		let domChangedClass = null;
		let subtitleClass = null;
		if(curUrl.includes("bilibili")){
			domChangedClass = "bpx-player-control-wrap";
			subtitleClass = "bpx-player-subtitle-panel-text";
		}else if(curUrl.includes("youtube")){
			domChangedClass = "ytp-caption-window-container";
			subtitleClass = "caption-window ytp-caption-window-bottom";
		}

		if(domChangedClass && subtitleClass){
			console.log("===CC字幕查词初始化=>>>>>" + subtitleClass);
			observeDomChanged(domChangedClass, subtitleClass);
		}

	}, 5000);
})();



