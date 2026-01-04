// ==UserScript==
// @name        微信公众号超清视频下载
// @namespace   微信公众号文章超清视频播放和下载
// @match       https://mp.weixin.qq.com/s/*
// @grant       none
// @version     1.0.0
// @icon        https://res.wx.qq.com/a/wx_fed/assets/res/NTI4MWU5.ico
// @author       Jack.Chan (971546@qq.com)
// @namespace    http://fulicat.com
// @url          https://greasyfork.org/zh-CN/scripts/481530
// @license MIT
// @description 2023/12/6 19:13:26
// @downloadURL https://update.greasyfork.org/scripts/481530/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E8%B6%85%E6%B8%85%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/481530/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E8%B6%85%E6%B8%85%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {

	// block contextmenu event
	var addEvent = EventTarget.prototype.addEventListener;
	EventTarget.prototype.addEventListener = function(type, fn, capture) {
		if (type !== 'contextmenu') {
			this.addEvent = addEvent;
			this.addEvent(type, fn, capture);
		}
	}

	function init() {
		var $players = document.querySelectorAll('.mp-video-player');
		$players.forEach((item) => {
			((el) => {
				console.log('vInfo', el.__vue__.__vInfo);
				el.vInfo = el.__vue__.__vInfo;
				if (el.vInfo?.dynamicData?.data?.totalUrl) {
					el.totalUrl = el.vInfo?.dynamicData?.data?.totalUrl;
				}
				// remove mask
				el.$mask = el.querySelector('.video_mask');
				if (el.$mask) {
					el.$mask.parentNode.removeChild(el.$mask);
				}
				el.$video = el.querySelector('video');
				if (el.$video && el.totalUrl) {
					// set SD video
					el.$video.src = el.totalUrl;

					// add download button
					el.$download = document.createElement('a');
					el.$download.setAttribute('href', el.totalUrl);
					el.$download.setAttribute('download', '');
					el.$download.setAttribute('onclick', 'return false');
					el.$download.style.cssText = 'position: absolute;top: 0;left: 0;z-index: 9999;display: inline-block;padding:5px 10px;color: #1890ff;background:rgba(255,255,255,0.92);';
					el.$download.innerText = '👉 超清视频下载 💾';
					el.$download.setAttribute('title', '请点击右键 在菜单中选择 链接另存为');
					el.$download.addEventListener('click', (event) => {
						event.preventDefault();
						alert(el.$download.getAttribute('title'));
					});
					el.insertBefore(el.$download, el.childNodes[0]);
					console.error('replaced')
				}
			})(item);
		});
	}

	setTimeout(() => {
		init();
	}, 500);
})();