// ==UserScript==
// @name         魂+ 购买记录
// @namespace    never:gonna@give.you/up
// @version      1.0
// @description  给魂+ 添加购买记录功能
// @author       haduki
// @icon         https://www.east-plus.net/favicon.ico
// @grant        none
// @license      MIT

// @match        https://*.south-plus.net/job.php?action=buytopic*
// @match        https://*.south-plus.net/read.php*
// @match        https://*.north-plus.net/job.php?action=buytopic*
// @match        https://*.north-plus.net/read.php*
// @match        https://*.white-plus.net/job.php?action=buytopic*
// @match        https://*.white-plus.net/read.php*
// @match        https://*.level-plus.net/job.php?action=buytopic*
// @match        https://*.level-plus.net/read.php*
// @match        https://*.summer-plus.net/job.php?action=buytopic*
// @match        https://*.summer-plus.net/read.php*
// @match        https://*.spring-plus.net/job.php?action=buytopic*
// @match        https://*.spring-plus.nett/read.php*
// @match        https://*.snow-plus.net/job.php?action=buytopic*
// @match        https://*.snow-plus.net/read.php*
// @match        https://*.east-plus.net/job.php?action=buytopic*
// @match        https://*.east-plus.net/read.php*
// @downloadURL https://update.greasyfork.org/scripts/444550/%E9%AD%82%2B%20%E8%B4%AD%E4%B9%B0%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/444550/%E9%AD%82%2B%20%E8%B4%AD%E4%B9%B0%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==

'use strict';

/* Constant */
const fbfName = '已购买';

/* Util */
async function sleep(time) {
	await new Promise(resolve => setTimeout(resolve, time));
}

/* FBF: Favorite category Bought items Folder */
async function initFbf(retry = 0) {
	if (retry == 5) {
		throw '重试次数过多！';
	}
	let fbfInfo = await fetchFbfInfo();
	if (fbfInfo.isExist) {
		localStorage.setItem('fbf-type', fbfInfo.type);
	} else {
		if (!fbfInfo.isExist) {
			// 论坛操作有1秒的刷新限制
			await sleep(1000);
			await createFbf();
		}
		await sleep(1000);
		initFbf((retry += 1));
	}
}
async function fetchFbfInfo() {
	let result = { isExist: null, type: null };
	const res = await fetch('u.php?action=favor');
	const parser = new DOMParser();
	const resDoc = parser.parseFromString(await res.text(), 'text/html');
	const favE = resDoc.querySelectorAll('.fav a');
	if (favE.length != 0) result.isExist = false;
	favE.forEach(e => {
		if (e.textContent.includes(fbfName)) {
			result.isExist = true;
			result.type = Number(e.parentElement.id.split('_').pop());
		}
	});

	return result;
}
async function createFbf() {
	const data = new FormData();
	data.append('verify', window.verifyhash);
	data.append('job', 'addtype');
	data.append('type', fbfName);

	fetch('/u.php?action=favor', { method: 'POST', body: data });
}
function addPostToFbf(tid) {
	const data = new FormData();
	data.append('action', 'favor');
	data.append('verify', new URLSearchParams(window.location.search).get('verify'));
	data.append('tid', tid);
	data.append('type', localStorage.getItem('fbf-type'));
	data.append('nowtime', Date.now());

	fetch('/pw_ajax.php', {
		method: 'POST',
		body: data,
	});
}

/* Main */
if (window.location.pathname.includes('read')) {
	initFbf();
} else {
	const urlParams = new URLSearchParams(window.location.search);
	const isActionSuccess = document.body.innerText.includes('操作完成');
	const tid = urlParams.get('tid');
	if (tid != null && isActionSuccess) addPostToFbf(tid);
}
