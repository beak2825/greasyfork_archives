// ==UserScript==
// @name         Bing Auto SEARCH GET Rewards
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  自动搜索获取必应奖励!
// @author       AlanNiew
// @match        https://*.bing.com/*
// @icon         https://www.bing.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @connect      weibo.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505128/Bing%20Auto%20SEARCH%20GET%20Rewards.user.js
// @updateURL https://update.greasyfork.org/scripts/505128/Bing%20Auto%20SEARCH%20GET%20Rewards.meta.js
// ==/UserScript==

(function () {
	// Your code here...
	main();
})();

async function main() {
	console.log("开始搜索");
	let keyword = await getSearchKey();
	if (!keyword) {
		console.log("没有搜索关键词,搜索结束。");
		return;
	}
	const seed = 100;
	let search_delay = 100 * Math.floor(Math.random() * seed) + 1000;
	await delay(search_delay).then(() => {
		document.querySelector("#sb_form_q").value = keyword;
	});
	let click_delay = 110 * Math.floor(Math.random() * seed) + 1000;
	await delay(click_delay).then(() => {
		document.querySelector("#sb_form_go").click();
	});
}

async function getSearchKey() {
	const BING_KEYS = "BING_KEYS";
	const SEARCH_INDEX_KEY = "SEARCH_INDEX";
	let keys = localStorage.getItem(BING_KEYS);
	let searchIndex = localStorage.getItem(SEARCH_INDEX_KEY);
	if (!keys) {
		let hotKeys = await getHotKeys();
		if (!hotKeys) {
			return false;
		}
		localStorage.setItem(BING_KEYS, JSON.stringify(hotKeys));
		keys = hotKeys;
	} else {
		keys = JSON.parse(keys);
	}
	if (!searchIndex) {
		searchIndex = 0;
	}
	let keyword = keys[searchIndex];
	searchIndex++;
	// 搜索次数超过热搜关键词数量，停止搜索，并清空缓存
	if (searchIndex > keys.length) {
		localStorage.removeItem(BING_KEYS);
		localStorage.removeItem(SEARCH_INDEX_KEY);
		return false;
	} else {
		localStorage.setItem(SEARCH_INDEX_KEY, searchIndex);
	}
	console.log("次数：" + searchIndex, "搜索关键词:" + keyword);
	return keyword;
}

function getHotKeys() {
	return new Promise(function (resolve, reject) {
		GM_xmlhttpRequest({
			method: "GET",
			url: "https://weibo.com/ajax/side/hotSearch",
			onload: function (response) {
				let data = JSON.parse(response.responseText);
				let keys = [];
				data.data.realtime.forEach((item) => {
					let word = item.word;
					keys.push(word);
				});
				console.log(keys);
				resolve(keys);
			},
			onerror: function (response) {
				console.log("请求失败");
				reject(response);
			},
		});
	});
}

async function delay(sleep) {
	return new Promise(function (resolve, reject) {
		setTimeout(resolve, sleep);
	});
}
