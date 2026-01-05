// ==UserScript==
// @name         Faster Media
// @namespace    http://tampermonkey.net/
// @version      0.3.0
// @description  Set Youtube & Overcast PlaybackRate to 1.75 by default
// @author       Decradish
// @match        *www.youtube.com/watch?v=*
// @match        *overcast.fm/+*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25318/Faster%20Media.user.js
// @updateURL https://update.greasyfork.org/scripts/25318/Faster%20Media.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// 核心方法
	var coreFn = () => {
		var iPlaybackRate = 1.75, //rate
		tmVideo = document.getElementsByTagName("video")[0],
		tmMedia = false,
		OcRange = document.getElementById('speedcontrol') //Overcast

		if(!!tmVideo){
			tmMedia = tmVideo;

			var youTubePlayBtn = document.getElementsByClassName('ytp-play-button')

			if(youTubePlayBtn.length > 0){
				document.getElementsByClassName('ytp-play-button')[0].focus()
			}
		}

		if(!!OcRange){
			OcRange.stepUp(5)
			document.getElementById('speedlabel0').style.color = '#000'
			document.getElementById('speedlabel1500').style.color = '#fff'
		}

		if(!tmMedia){
			obsFn()
			return false;
		}

		tmMedia.playbackRate = iPlaybackRate;

		tmMedia.onplay = function(){
			tmMedia.playbackRate = iPlaybackRate;
		};

		tmMedia.oncanplay = function(){
			tmMedia.playbackRate = iPlaybackRate;
		};
	}

	// 观察器方法
	const obsFn = () => {
		// 观察器的执行函数
		var obsCb = (mutationsList, mutationObserver) => {
			// 遍历出所有的MutationRecord对象
			mutationsList.forEach(function (mutation) {
				// 找一下目标元素
				const hasTargetElem = [...mutation.addedNodes].some((item => 
					item.tagName === 'VIDEO'
				));

				if(hasTargetElem){
					// 已产生目标元素，停止观察
					observer.disconnect()

					// 执行核心方法
					coreFn();
				}
			});
		}

		// 设置一个观察器
		var observer = new MutationObserver(obsCb);

		// 观察目标元素是否出现
		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
	}

	// 触发核心逻辑
	coreFn();
})();