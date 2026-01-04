// ==UserScript==
// @name         蛋图
// @version      1.0.6
// @description  煎蛋首页右侧看图
// @author       Jack.Chan
// @namespace    http://fulicat.com
// @url          https://greasyfork.org/zh-CN/scripts/537058
// @match        https://jandan.net/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537058/%E8%9B%8B%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/537058/%E8%9B%8B%E5%9B%BE.meta.js
// ==/UserScript==

(() => {

	const regHTTP = /^http:/i;
	const regLowDefinition = /\/(mw600|thumb180|orj360)\//i;

	function replaceSrc() {
		let $imgs = document.querySelectorAll('.sidebar .hot-list img');
		let $p = null;
		let src = null;
		$imgs = Array.prototype.slice.call($imgs).filter((img) => img.dataset.src === undefined);
		$imgs.forEach((img) => {
			src = img.src || '';
			img.dataset.src = src;
			src = src.replace(regHTTP, 'https:');
			src = src.replace(regLowDefinition, '/large/');
			src = src.replace(/.webp/i, '').trim();
			$p = document.createElement('p');
			$p.style.cssText = `margin: 20px 0 5px 0;`;
			$p.innerHTML = `<a style="color:#0d6efd;" target="_blank" href="${ src }" title="${ src }&#13;&#13;查看原图&#13;&#13;或点击右键“链接另存为”" data-src="${ img.src }">查看原图</a>&nbsp;&nbsp;&nbsp;`;
			if (/.gif$/i.test(src)) {
				img.dataset.mp4 = src.replace(/\.gif$/i, '.mp4');
				$p.innerHTML += `<a style="color:#0d6efd;" target="_blank" href="${ img.dataset.mp4 }" title="${ img.dataset.mp4 }&#13;&#13;查看视频&#13;&#13;或点击右键“链接另存为”" data-src="${ img.dataset.mp4 }">查看视频</a>&nbsp;&nbsp;&nbsp;`;
				$p.innerHTML += `<a style="color:#0d6efd;" target="_blank" href="https://ezgif.com/gif-to-mp4?url=${ encodeURIComponent(src) }" title="转视频&#13;&#13;${ src }" data-src="${ img.src }">gif to mp4</a>&nbsp;&nbsp;&nbsp;`;
			}
			$p.addEventListener('click', (event) => {
				if (event && event.target && event.target.tagName === 'A') {
					event.stopPropagation();
				}
			});
			img.parentNode.insertBefore($p, img);
			img.parentNode.querySelector('.gif-mask')?.remove();
			if (!img.parentNode.hasBind) {
				img.parentNode.addEventListener('click', function(event) {
					event.preventDefault();
					event.stopPropagation();
					this.querySelector('.show_more')?.remove();
					if (this.style.maxHeight === 'none') {
						this.style.removeProperty('max-height');
					} else {
						this.style.maxHeight = 'none';
					}
				});
				img.parentNode.hasBind = true;
			}
			img.src = src;
		});
	}

	let $tabs = null;
	function init() {
		if ($tabs || $tabs && $tabs.hasBind) return;
		$tabs = document.querySelector('.hot-tabs');
		// console.log('$tabs', $tabs);
		if ($tabs) {
			$tabs.hasBind = true;
			$tabs.addEventListener('click', () => {
				setTimeout(replaceSrc, 1000);
			});
		}
	}

	init();

	setTimeout(() => {
		init();
		replaceSrc();
	}, 2000);

})();