// ==UserScript==
// @name        在新页面打开twitter的图片
// @name:en     open twitter image in new tab
// @namespace	https://saber.love/?p=3967
// @version		0.3
// @description	    在查看大图时会在右侧显示一个按钮。点击按钮就可以在新页面查看和保存图片。
// @description:en  On you view big image,  you can view and save image in new tab.
// @author		xuejianxianzun
// @include		*://twitter.com*
// @icon        https://twitter.com/favicon.ico
// @run-at		document-end
// @downloadURL https://update.greasyfork.org/scripts/37016/%E5%9C%A8%E6%96%B0%E9%A1%B5%E9%9D%A2%E6%89%93%E5%BC%80twitter%E7%9A%84%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/37016/%E5%9C%A8%E6%96%B0%E9%A1%B5%E9%9D%A2%E6%89%93%E5%BC%80twitter%E7%9A%84%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==
let t_img_wrap = document.querySelector('.Gallery-media');
let t_img_url;
if (t_img_wrap) {
	let t_img_down_button = document.createElement('div');
	t_img_down_button.innerHTML = 'open image';
	t_img_down_button.setAttribute('style', 'display:inline-block;visibility:hidden;padding:5px 7px;position: fixed;right: 0;top: 30%;z-index: 9999;background:#1EA1F2;color:#fff;cursor: pointer;');
	document.body.appendChild(t_img_down_button);
	t_img_down_button.addEventListener('click', function () {
		window.open(t_img_url);
	});
	setInterval(function () {
		let t_img_element = document.querySelector('.Gallery-media .media-image');
		if (t_img_element && t_img_element.nodeName !== 'IMG') { // 有些页面上面的选择器就是图片，有些是图片包含在上个选择器里面
			t_img_element = t_img_element.querySelector('img');
			if (t_img_element === null) { // 如果没有这个元素
				return false;
			}
		}
		if (t_img_element && getComputedStyle(t_img_wrap)['display'] === 'block') {
			t_img_url = t_img_element.src.replace('large','orig');
			t_img_down_button.style.visibility = 'visible';
		} else {
			t_img_down_button.style.visibility = 'hidden';
		}
	}, 400);
}