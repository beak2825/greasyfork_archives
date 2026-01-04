// ==UserScript==
// @name         酷安网盘链接重定向
// @namespace    CoolApkFileDirect
// @version      1.3
// @description  自动从指向123盘/蓝奏云/迅雷云盘的酷安“未知网页安全提示”页面跳转至目标地址
// @author       2943398@CoolApk
// @license      MIT
// @icon         https://www.coolapk.com/favicon.ico
// @match        *://www.coolapk.com/link*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467580/%E9%85%B7%E5%AE%89%E7%BD%91%E7%9B%98%E9%93%BE%E6%8E%A5%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/467580/%E9%85%B7%E5%AE%89%E7%BD%91%E7%9B%98%E9%93%BE%E6%8E%A5%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

(function (coolUrl) {
	'use strict';
	let notCool = coolUrl.match(/^https?:\/\/www\.coolapk\.com\/link\?url=(\S+)/i);
	if (notCool) {
		const rawTarget = new URL(decodeURIComponent(notCool[1]).replace(/^(?!\w+:\/\/)(\/\/)?/, 'https://'));
		if (/^(\w+\.)?(123pan|ilanzou|xunlei)\.com$/i.test(rawTarget.hostname)) {
			window.location.replace(rawTarget.href);
		} else if (/^(\w+\.)?lanzou\w\.com$/i.test(rawTarget.hostname)) {
			rawTarget.hostname = 'pan.lanzouq.com'; // In case lanzou's domain gets robbed
			window.location.replace(rawTarget.href);
		} else {
			console.log('[CoolApkFileDirect]: Neither 123pan nor lanzou url detected.');
		}
	}
})(window.location.href);
