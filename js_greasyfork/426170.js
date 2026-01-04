// ==UserScript==
// @name         打破一切更新了吗
// @namespace    DidMiteDPYQUpdate
// @version      1.3
// @description  马桶哥~"MITE:打破一切"更新了吗？
// @icon         https://www.mitedpyq.com/uploads/img/20210404/66e55b1bc7417ba57a997ad81e439256.png
// @author       Rortenfeat
// @license      MulanPSL-2.0
// @include      *
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @connect      www.mitedpyq.com
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/426170/%E6%89%93%E7%A0%B4%E4%B8%80%E5%88%87%E6%9B%B4%E6%96%B0%E4%BA%86%E5%90%97.user.js
// @updateURL https://update.greasyfork.org/scripts/426170/%E6%89%93%E7%A0%B4%E4%B8%80%E5%88%87%E6%9B%B4%E6%96%B0%E4%BA%86%E5%90%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

	const dpyqURL = 'https://www.mitedpyq.com';
	// 每次检查更新间隔（单位：毫秒）；默认值：3600000（一小时）
	const checkInterval = 3600000;

	GM_registerMenuCommand('检查打破一切更新', ()=>{
		checkUpdate(true);
	});

	let lastCheck = new Date(GM_getValue('dpyqTime', 0));
	let checkTime = new Date();
	let interval = checkTime.getTime() - lastCheck.getTime();
	if (!(interval < checkInterval)) {
		checkUpdate();
	}
	function checkUpdate(fb=false){
		GM_xmlhttpRequest({
			method: 'GET',
			url: dpyqURL,
			headers: {
				'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'
			},
			onload: (data)=>{
				let html = new DOMParser().parseFromString(data.responseText, "text/html");
				let info = {
					name: html.getElementsByClassName('gon_zai_li xoa_zai')[0].innerText,
					size: html.getElementsByClassName('gon_zai_li xoa_zai')[1].innerText,
					time: html.getElementsByClassName('gon_zai_li xoa_da')[0].innerText,
					link: html.getElementsByClassName('gon_zai_li xia_an')[0].parentNode.attributes.href.value
				}
				console.log(info);
				let checkTime = new Date();
				GM_setValue('dpyqTime', checkTime);
				if ( !GM_getValue('dpyqInfo') || info.time !== GM_getValue('dpyqInfo').time ) {
					GM_setValue('dpyqInfo', info);
					let noti = {
						title: '检测到MITE:打破一切有更新！',
						text: `${info.name}\n${info.size}\n${info.time}`,
						image: 'https://www.mitedpyq.com/uploads/img/20210404/66e55b1bc7417ba57a997ad81e439256.png'
					}
					GM_notification(noti, ()=>GM_openInTab(`${dpyqURL}/#gongce`, {active: true}));
				} else if ( fb === true ) {
					let noti = {
						title: '未发现MITE:打破一切有更新。',
						text: `${info.name}\n${info.size}\n${info.time}`,
						image: 'https://www.mitedpyq.com/uploads/img/20210404/66e55b1bc7417ba57a997ad81e439256.png',
						timeout: 5000
					}
					GM_notification(noti, ()=>GM_openInTab(`${dpyqURL}/#gongce`, {active: true}));
				}
			}
		});
	}
})();