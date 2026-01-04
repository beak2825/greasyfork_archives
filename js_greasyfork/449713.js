/* eslint-disable no-multi-spaces */
/* eslint-disable userscripts/no-invalid-headers */
/* eslint-disable userscripts/no-invalid-grant */

// ==UserScript==
// @name               FontAwesome
// @namespace          Wenku8++
// @version            0.1.3
// @description        FontAwesome support for wenku8++
// @author             PY-DNG
// @license            GPL-v3
// @regurl             https?://www\.wenku8\.net/.*
// @require            https://greasyfork.org/scripts/449412-basic-functions/code/Basic%20Functions.js?version=1085783
// @grant              none
// ==/UserScript==

(function __MAIN__() {
	const alertify = require('alertify');
	const ASSETS = require('assets');

	// https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.1.1/css/all.min.css
	const url = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css';
	const alts = [
		'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.1.1/css/all.min.css',
		'https://fastly.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.1.1/css/all.min.css',
		'https://bowercdn.net/c/fontAwesome-6.1.1/css/all.min.css',
	];
	let i = -1;

	const link = $CrE('link');
	link.href = url;
	link.rel = 'stylesheet';
	link.onerror = function() {
		i++;
		if (i < alts.length) {
			link.href = alts[i];
		} else {
			alertify.error('FontAwesome加载失败（自动重试也失败了），可能会影响一部分脚本界面图标的显示和少量界面布局，但基本不会影响功能</br>您可以将此消息<a href="https://greasyfork.org/scripts/416310/feedback" class=\'{CB}\'>反馈给开发者</a>以尝试解决问题'.replace('{CB}', ASSETS.ClassName.Button));
		}
	}

	document.head.appendChild(link);
})();