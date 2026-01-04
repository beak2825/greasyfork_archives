// ==UserScript==
// @name         CSDN Cleaner (CSDN 净化器)
// @version      1.0.0
// @description  从 Google 搜索结果屏蔽 CSDN 垃圾内容!
// @author       Zhifeng Hu
// @icon         https://img-home.csdnimg.cn/images/20201124032511.png
// @match        http*://www.google.com/search?*
// @run-at       document-end
// @grant        none
// @namespace    https://github.com/huzhifeng/
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448855/CSDN%20Cleaner%20%28CSDN%20%E5%87%80%E5%8C%96%E5%99%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/448855/CSDN%20Cleaner%20%28CSDN%20%E5%87%80%E5%8C%96%E5%99%A8%29.meta.js
// ==/UserScript==

(function() {
	'use strict';
	let blacklist = [
		'blog.csdn.net',
		'www.csdn.net'
	]

	console.log('CSDN Cleaner');

	[...document.getElementsByClassName('g Ww4FFb tF2Cxc')].map(item => {
		if (item.hasChildNodes()) {
			let a = item.querySelector('a');
			let href = a.getAttribute('href');
			for (let site of blacklist) {
				if (href.indexOf(site) > -1) {
					console.log('Remove CSDN Link: %s', href);
					item.remove();
					break;
				}
			}
		}
	});
})();
