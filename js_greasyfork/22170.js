// ==UserScript==
// @name		scrollWithMouseMove
// @namespace	https://github.com/sakuyaa/gm_scripts
// @description	鼠标在滚动条上移动滚动网页
// @include		*
// @version		2022.11.28
// @grant		none
// @note		修改自原脚本ScrollWithMouse.uc.js，来自Mozest.com社区
// @note		modify by sakuyaa
// @run-at		document-start
// @downloadURL https://update.greasyfork.org/scripts/22170/scrollWithMouseMove.user.js
// @updateURL https://update.greasyfork.org/scripts/22170/scrollWithMouseMove.meta.js
// ==/UserScript==
(function() {
	let scrolling = false;   //处于滚动条位置
	let scrollStartY = -1;   //移动起点高度
	let mouseScroll = event => {
		if (scrollStartY != -1) {
			//网页移动距离即为移动高度与网页可见区域高度的比例乘以网页正文全文高度
			document.documentElement.scrollTop += (event.screenY - scrollStartY) / document.documentElement.clientHeight * document.documentElement.scrollHeight;
		}
		scrollStartY = event.screenY;   //储存下次移动起点高度
	}

	document.addEventListener('mouseover', e => {
		if (!scrolling && e.clientX >= document.documentElement.clientWidth) {   //处于滚动条位置
			scrolling = true;
			window.addEventListener('mousemove', mouseScroll, true)
		}
	});
	document.addEventListener('mouseout', e => {   //移出滚动条
		if (scrolling) {
			scrolling = false;
			scrollStartY = -1;
			window.removeEventListener('mousemove', mouseScroll, true)
		}
	});
})();
