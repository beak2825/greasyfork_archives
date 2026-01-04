// ==UserScript==
// @name         NGA界面精简
// @namespace    https://greasyfork.org/zh-CN/scripts/382989-nga%E7%95%8C%E9%9D%A2%E7%B2%BE%E7%AE%80
// @version      0.3
// @description  删除NGA论坛头图、版头、分版，减少NSFW内容，参考Shy07需要的时候可以点击版面名字显示（替换跳转功能）
// @author       SkywalkerJi
// @match        *://nga.178.com/*
// @match        *://bbs.ngacn.cc/*
// @match        *://bbs.nga.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382989/NGA%E7%95%8C%E9%9D%A2%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/382989/NGA%E7%95%8C%E9%9D%A2%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==

(function() {
	'use strict';
    let topPic = document.querySelector('#custombg');
    topPic.removeChild(topPic.firstChild);
	let subForumsC = document.querySelector('#sub_forums_c');
	subForumsC.style.display = 'none';
    let toppedTopic = document.querySelector('#toppedtopic');
    toppedTopic.style.display = 'none';
	const toggle = () => {
		toppedTopic.style.display = toppedTopic.style.display === 'none' ? 'block' : 'none';
		subForumsC.style.display = subForumsC.style.display === 'none' ? 'block' : 'none';
	};

	const container = document.querySelector('#toptopics a[class="block_txt block_txt_c0"]');
	container.href = 'javascript:;';
	container.addEventListener('click', toggle);
})();