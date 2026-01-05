// ==UserScript==
// @name         我就是要跳轉(B站番劇投稿頁跳轉去番劇頁)
// @version      0.4.2
// @description  解決有時打開B站番劇投稿頁不會跳轉去番劇頁的問題
// @author       i9602097
// @include      *://www.bilibili.com/video/av*
// @run-at       document-start
// @grant      GM_registerMenuCommand
// @grant      GM_listValues
// @grant      GM_getValue
// @grant      GM_setValue
// @grant      GM_deleteValue
// @grant      unsafeWindow
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/29151/%E6%88%91%E5%B0%B1%E6%98%AF%E8%A6%81%E8%B7%B3%E8%BD%89%28B%E7%AB%99%E7%95%AA%E5%8A%87%E6%8A%95%E7%A8%BF%E9%A0%81%E8%B7%B3%E8%BD%89%E5%8E%BB%E7%95%AA%E5%8A%87%E9%A0%81%29.user.js
// @updateURL https://update.greasyfork.org/scripts/29151/%E6%88%91%E5%B0%B1%E6%98%AF%E8%A6%81%E8%B7%B3%E8%BD%89%28B%E7%AB%99%E7%95%AA%E5%8A%87%E6%8A%95%E7%A8%BF%E9%A0%81%E8%B7%B3%E8%BD%89%E5%8E%BB%E7%95%AA%E5%8A%87%E9%A0%81%29.meta.js
// ==/UserScript==
// 
function getJSON(url) {
	var request = new XMLHttpRequest();
	request.open("GET", url, false);
	// request.setRequestHeader("If-Modified-Since","0");
	try {
		request.send();
	} catch (e) {
		console.log(e);
		console.log("跨域失敗");
	}
	// console.log(request.readyState);
	// console.log(request.responseText);
	console.log(request.getAllResponseHeaders());
	if (request.readyState == 4 && request.responseText) {
		try {
			return JSON.parse(request.responseText);
		} catch (e) {
			console.log("JSON file error:" + url);
			return {
				"code": -2
			};
		}
	} else {
		console.log("Get JSON error:" + url);
		return {
			"code": -1
		};
	}
}

function getDataWithZone(text, zone) {
	return new Date(Date.parse(text) - (3600000 * zone) - (new Date().getTimezoneOffset() * 60000));
}

function getEpisodeID(aid, pid) {
	var avjson = getJSON("https://www.biliplus.com/api/view?id=" + aid);
	console.log("avjson.code:" + avjson.code);
	if (!avjson.code) {
		var updateDate = new Date();
		updateDate.setDate(updateDate.getDate() - 1);
		console.log("緩存時間是" + getDataWithZone(avjson.lastupdate.replace(/-/g, "/"), 8).toString() + "，如果比" + updateDate.toString() + "早則會更新緩存並重新加載");
		if (getDataWithZone(avjson.lastupdate.replace(/-/g, "/"), 8) < updateDate) {
			console.log("緩存過早，更新緩存並重新加載");
			getJSON("https://www.biliplus.com/api/view?id=" + aid + "&update=true");
			avjson = getJSON("https://www.biliplus.com/api/view?id=" + aid);
			console.log("avjson.code:" + avjson.code);
			if (!avjson.code) {
				console.log("新的緩存時間是" + getDataWithZone(avjson.lastupdate.replace(/-/g, "/"), 8).toString());
			}
		}
	} else {
		console.log("緩存錯誤，更新緩存並重新加載");
		getJSON("https://www.biliplus.com/api/view?id=" + aid + "&update=true");
		avjson = getJSON("https://www.biliplus.com/api/view?id=" + aid);
		console.log("avjson.code:" + avjson.code);
		if (!avjson.code) {
			console.log("新的緩存時間是" + getDataWithZone(avjson.lastupdate.replace(/-/g, "/"), 8).toString());
		}
	}
	if (avjson.code) {
		console.log("av json error");
		return;
	}
	console.log("標題：" + avjson.title);
	if (!avjson.bangumi) {
		console.log("no bangumi");
		return;
	}
	console.log("投稿API番劇標題：" + avjson.bangumi.title);
	var cid;
	for (var i = 0; i < avjson.list.length; i++) {
		if (avjson.list[i].page == pid) {
			cid = avjson.list[i].cid;
		}
	}
	console.log("cid:" + cid);
	var bangumijson = getJSON("https://www.biliplus.com/api/bangumi?season=" + avjson.bangumi.season_id);
	console.log("bangumijson.code:" + bangumijson.code);
	if (bangumijson.code) {
		console.log("bangumi json error");
		return avjson.bangumi.newest_ep_id;
	}
	console.log("番劇API番劇標題：" + bangumijson.result.bangumi_title);
	var episode_id;
	if (cid) {
		for (var i = 0; i < bangumijson.result.episodes.length; i++) {
			if (bangumijson.result.episodes[i].danmaku == cid) {
				episode_id = bangumijson.result.episodes[i].episode_id;
			}
		}
	}
	if (!episode_id) {
		console.log("cid反查失敗，使用AV號和分P反查");
		for (var i = 0; i < bangumijson.result.episodes.length; i++) {
			if (bangumijson.result.episodes[i].av_id == aid && bangumijson.result.episodes[i].page == pid) {
				episode_id = bangumijson.result.episodes[i].episode_id;
			}
		}
	}
	if (!episode_id) {
		console.log("分P反查失敗，只用AV號反查，結果可能有出入");
		for (var i = 0; i < bangumijson.result.episodes.length; i++) {
			if (bangumijson.result.episodes[i].av_id == aid) {
				episode_id = bangumijson.result.episodes[i].episode_id;
			}
		}
	}
	if (episode_id) {
		console.log("episode_id:" + episode_id);
		return episode_id;
	} else {
		console.log("episode_id反查失敗，回傳投稿頁API的episode_id");
		return avjson.bangumi.newest_ep_id;
	}
}

function getURL(episode_id) {
	return location.protocol + '//www.bilibili.com/bangumi/play/ep' + episode_id;
}

function redirectURL() {
	console.log("call redirectURL");
	if (!episode_id) {
		episode_id = getEpisodeID(aid, pid);
	}
	if (episode_id) {
		location.replace(getURL(episode_id));
	}
}

function changePopup() {
	if (GM_getValue('enablePopup') === false) {
		if (confirm("沒有打開彈窗提示\n是否打開彈窗提示")) {
			GM_setValue('enablePopup', true);
			console.log("enablePopup：" + GM_getValue('enablePopup'));
			if ((GM_getValue('enablePopup') !== false)) {
				alert("操作成功\n彈窗提示已打開\n將重新加載頁面");
				unsafeWindow.location.reload(true);
			} else {
				alert("操作失敗\n將重新加載頁面");
				unsafeWindow.location.reload(true);
			}
		} else {
			alert("已取消操作");
		}
	} else {
		if (confirm("已打開彈窗提示\n是否關閉彈窗提示")) {
			GM_setValue('enablePopup', false);
			console.log("enablePopup：" + GM_getValue('enablePopup'));
			if ((GM_getValue('enablePopup') === false)) {
				alert("操作成功\n彈窗提示已關閉\n將重新加載頁面");
				unsafeWindow.location.reload(true);
			} else {
				alert("操作失敗\n將重新加載頁面");
				unsafeWindow.location.reload(true);
			}
		} else {
			alert("已取消操作");
		}
	}
}
// console.log(GM_listValues());
// GM_deleteValue('enablePopup');
if (GM_getValue('enablePopup') === undefined)
	GM_setValue('enablePopup', true);
console.log("enablePopup：" + GM_getValue('enablePopup'));
GM_registerMenuCommand('開關彈窗提示', changePopup);
document.addEventListener('DOMContentLoaded', function() {
	console.log("網址：" + location.href);
	console.log("window.aid:" + unsafeWindow.aid);
	var aid = unsafeWindow.aid;
	if (!aid) aid = location.href.match(/\/video\/av(\d+)\//)[1];
	aid = Number(aid);
	console.log("aid:" + aid);
	console.log("window.pageno:" + unsafeWindow.pageno);
	var pid = unsafeWindow.pageno;
	if (!pid) {
		if (location.href.match(/\/index_(\d+).html/)) {
			pid = location.href.match(/\/index_(\d+).html/)[1];
		} else if (location.href.match(/\/\?p\=(\d+)/)) {
			pid = location.href.match(/\/\?p\=(\d+)/)[1];
		} else {
			pid = "1";
		}
	}
	pid = Number(pid);
	console.log("pid:" + pid);
	episode_id = getEpisodeID(aid, pid);
	if (episode_id) {
		GM_registerMenuCommand('跳轉到' + getURL(episode_id), redirectURL);
		let msg = document.querySelector('.b-page-body > .error-container > .error-panel');
		if (msg && GM_getValue('enablePopup') === false || confirm("是否跳轉到" + getURL(episode_id) + "\n注意：可在腳本命令中關閉這彈窗自動跳轉")) {
			location.replace(getURL(episode_id));
		}
	}
}, false);