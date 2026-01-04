// ==UserScript==
// @name        度盘文件列表、分享页面显示MD5
// @author      Crab
// @namespace   pan@baidu.com
// @description 百度网盘文件列表、分享页面显示文件的MD5值。
// @include     /^https?://(yun|pan)\.baidu\.com\/(s(hare)?|disk)\/*/
// @compatible  firefox 34+
// @compatible  Chrome 45+
// @version     0.5.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/38141/%E5%BA%A6%E7%9B%98%E6%96%87%E4%BB%B6%E5%88%97%E8%A1%A8%E3%80%81%E5%88%86%E4%BA%AB%E9%A1%B5%E9%9D%A2%E6%98%BE%E7%A4%BAMD5.user.js
// @updateURL https://update.greasyfork.org/scripts/38141/%E5%BA%A6%E7%9B%98%E6%96%87%E4%BB%B6%E5%88%97%E8%A1%A8%E3%80%81%E5%88%86%E4%BA%AB%E9%A1%B5%E9%9D%A2%E6%98%BE%E7%A4%BAMD5.meta.js
// ==/UserScript==

(function(){
	'use strict';

	const {cache, yunData} = window;

	//单文件分享页MD5
	if(yunData && yunData.FILEINFO && yunData.FILEINFO.length === 1 &&
		yunData.FILEINFO[0].isdir !== 1 && yunData.FILEINFO[0].md5
	){
		let fTitle = document.querySelector('h2.file-name');
		if(fTitle){
			fTitle.insertAdjacentHTML('afterend',
				`<dl style="color:#aaa;font-size: 12px;">
					<dt style="float:left;">MD5:</dt>
					<dd style="padding-left: 3em; 
					text-transform: uppercase;">${yunData.FILEINFO[0].md5}</dd>
				</dl>`);
		}
	}

	//文件列表MD5
	if(!cache || Object.keys(cache).length < 1){
		return;
	}

	document.head.appendChild(document.createElement('style')).textContent = `
		@keyframes bdFileMd5 {from{opacity:.9}to{opacity:1}}
		:not(.dir-small):not(.dir-large) 
			+ .file-name .text:not([data-md5]){animation:bdFileMd5 1ms}
		.file-name .text[data-md5]{top: -6px;}
		[class*=fileicon] + .file-name .text[data-md5]::after, 
		.default-small + .file-name .text[data-md5]::after{
			content:'MD5: 'attr(data-md5); text-transform: uppercase;
			position:absolute; left: .1em; top: 1.4em; font-size: 95%; color: #aaa;
		}
	`;
	let timeout, dir;
	const getPath = () => {
		let m = location.hash.match(/^#\/?([^?/]+)[?/](?:[^?/]+?(?![^?/&]).)?(?:path|type|key)=([^&?#]+)/);
		return m ? {list: m[1] === 'all' ? 'list' : m[1], path: decodeURIComponent(m[2])} : null;
	}, onAnimationstart = e => {
		if(e.animationName !== 'bdFileMd5')
			return;
		clearTimeout(timeout);
		timeout = setTimeout(() => dir = null, 500);

		if(!dir && !(dir = getPath()))
			return removeEventListener('animationstart', onAnimationstart);

		let data = cache[dir.list];
		if(!data || !(data = data.data) || !(data = data[dir.path]) || !(data = data.list))
			return;

		const targetName = e.target.firstElementChild.textContent;
		for(let file of data){
			if(file.server_filename === targetName)
				return e.target.dataset.md5 = file.md5;
		}
	};

	addEventListener('animationstart', onAnimationstart);
})();