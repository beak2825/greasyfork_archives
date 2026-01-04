// ==UserScript==
// @name         Mira Comment Collector-DY
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  dy直播互动抓取脚本
// @author       You
// @match        https://live.douyin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @grant        none
// @license      MIT License 
// @downloadURL https://update.greasyfork.org/scripts/452913/Mira%20Comment%20Collector-DY.user.js
// @updateURL https://update.greasyfork.org/scripts/452913/Mira%20Comment%20Collector-DY.meta.js
// ==/UserScript==

(function() {
    'use strict';

	let seqsList = [];

	async function postMessage(live_id, danmu_list) {
		if (!danmu_list || !danmu_list.length) return
		let data = {live_id,danmu_list}
		danmu_list.forEach(x=>console.log(x));
		let response = await fetch('https://peng.mirav.cn:5000/danmu', {
			method: 'POST',
			mode: 'no-cors',
			cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
		    },
		    body: JSON.stringify(data)
		});
		let responseJson = await response.json();
		console.log({responseJson});
	}

	function fetchMsg() {
		let live_id = (new URL(document.location.href)).pathname.match(/[\d]+/)[0];
		if (!live_id) return;
		var date = new Date()
		live_id = live_id + "_" + date.getFullYear() + (date.getMonth()+1) + date.getDate();
		let danmu_list = []
		let elements = document.querySelectorAll('.webcast-chatroom___items>div:not(.webcast-chatroom___bottom-message)>.webcast-chatroom___item');
		if (elements.length == 0) return;
		for(let i = elements.length-1; i>0; i--) {
			let el = elements[i]
			if (seqsList.includes(el.getAttribute('data-id'))) {break;}
			danmu_list.push({
				"sender": el.querySelector(':scope>div>span:nth-child(2)').innerText.replace(/[：]$/g, ''),
				"content": el.querySelector(':scope>div>span:nth-child(3)').innerText
			});
			seqsList.push(el.getAttribute('data-id'));
            if (seqsList.length > 1000) seqsList.shift();
		}
		postMessage(live_id, danmu_list.reverse());
	}

	if (window.mccTimer) {clearInterval(time1)}
	window.mccTimer = setInterval(fetchMsg, 1000);

})();