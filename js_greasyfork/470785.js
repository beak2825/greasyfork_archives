// ==UserScript==
// @name         Jellyfin with Potplayer
// @version      0.1
// @description  play video with Potplayer
// @author       Tccoin
// @match        http://*:8096/*
// @namespace    http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/470785/Jellyfin%20with%20Potplayer.user.js
// @updateURL https://update.greasyfork.org/scripts/470785/Jellyfin%20with%20Potplayer.meta.js
// ==/UserScript==

(function() {
	'use strict';
	let openPotplayer = async (itemid) => {
		let mediaInfo = await getEmbyMediaInfo(itemid);
		let intent = mediaInfo.intent;
		// let poturl = `potplayer://${encodeURI(mediaInfo.streamUrl)} /sub=${encodeURI(mediaInfo.subUrl)} /current /title="${intent.title}" /seek=${getSeek(intent.position)}`;
		let poturl = `potplayer://${encodeURI(mediaInfo.streamUrl)} /seek=${getSeek(intent.position)}`;
		window.open(poturl, "_blank");
	};

	async function getEmbyMediaInfo(itemid) {
		let itemInfo = await getItemInfo(itemid);
		let mediaSourceId = itemInfo.MediaSources[0].Id;
		let selectSource = document.querySelector("select[is='emby-select']:not(.hide).selectSource");
		if (selectSource && selectSource.value.length > 0) {
			mediaSourceId = selectSource.value;
		}
		//let selectAudio = document.querySelector("select[is='emby-select']:not(.hide).selectAudio");
		let mediaSource = itemInfo.MediaSources.find(m => m.Id == mediaSourceId);
		let domain = `${ApiClient._serverAddress}/emby/videos/${itemInfo.Id}`;
		let subPath = getSubPath(mediaSource);
		let subUrl = subPath.length > 0 ? `${domain}${subPath}?api_key=${ApiClient.accessToken()}` : '';
		let streamUrl = `${domain}/stream.${mediaSource.Container}?api_key=${ApiClient.accessToken()}&Static=true&MediaSourceId=${mediaSourceId}`;
		let position = parseInt(itemInfo.UserData.PlaybackPositionTicks / 10000);
		let intent = await getIntent(mediaSource, position);
		return {
			streamUrl: streamUrl,
			subUrl: subUrl,
			intent: intent,
		}
	}

	async function getItemInfo(itemId) {
		let userId = ApiClient._serverInfo.UserId;
		// let itemId = /\?id=(\w*)/.exec(window.location.hash)[1];
		let response = await ApiClient.getItem(userId, itemId);
		//继续播放当前剧集的下一集
		if (response.Type == "Series") {
			let seriesNextUpItems = await ApiClient.getNextUpEpisodes({
				SeriesId: itemId,
				UserId: userId
			});
			return await ApiClient.getItem(userId, seriesNextUpItems.Items[0].Id);
		}
		//播放当前季season的第一集
		if (response.Type == "Season") {
			let seasonItems = await ApiClient.getItems(userId, {
				parentId: itemId
			});
			return await ApiClient.getItem(userId, seasonItems.Items[0].Id);
		}
		//播放当前集或电影
		return response;
	}

	function getSubPath(mediaSource) {
		let selectSubtitles = document.querySelector("select[is='emby-select']:not(.hide).selectSubtitles");
		let subTitlePath = '';
		//返回选中的外挂字幕
		if (selectSubtitles && selectSubtitles.value > 0) {
			let SubIndex = mediaSource.MediaStreams.findIndex(m => m.Index == selectSubtitles.value && m.IsExternal);
			if (SubIndex > -1) {
				let subtitleCodec = mediaSource.MediaStreams[SubIndex].Codec;
				subTitlePath = `/${mediaSource.Id}/Subtitles/${selectSubtitles.value}/Stream.${subtitleCodec}`;
			}
		} else {
			//默认尝试返回第一个外挂中文字幕
			let chiSubIndex = mediaSource.MediaStreams.findIndex(m => m.Language == "chi" && m.IsExternal);
			if (chiSubIndex > -1) {
				let subtitleCodec = mediaSource.MediaStreams[chiSubIndex].Codec;
				subTitlePath = `/${mediaSource.Id}/Subtitles/${chiSubIndex}/Stream.${subtitleCodec}`;
			} else {
				//尝试返回第一个外挂字幕
				let externalSubIndex = mediaSource.MediaStreams.findIndex(m => m.IsExternal);
				if (externalSubIndex > -1) {
					let subtitleCodec = mediaSource.MediaStreams[externalSubIndex].Codec;
					subTitlePath = `/${mediaSource.Id}/Subtitles/${externalSubIndex}/Stream.${subtitleCodec}`;
				}
			}

		}
		return subTitlePath;
	}

	async function getIntent(mediaSource, position) {
		let title = mediaSource.Path.split('/')
			.pop();
		let externalSubs = mediaSource.MediaStreams.filter(m => m.IsExternal == true);
		let subs = ''; //要求是android.net.uri[] ?
		let subs_name = '';
		let subs_filename = '';
		let subs_enable = '';
		if (externalSubs) {
			subs_name = externalSubs.map(s => s.DisplayTitle);
			subs_filename = externalSubs.map(s => s.Path.split('/')
				.pop());
		}
		return {
			title: title,
			position: position,
			subs: subs,
			subs_name: subs_name,
			subs_filename: subs_filename,
			subs_enable: subs_enable
		};
	}

	function getSeek(position) {
		let ticks = position * 10000;
		let parts = [],
			hours = ticks / 36e9;
		(hours = Math.floor(hours)) && parts.push(hours);
		let minutes = (ticks -= 36e9 * hours) / 6e8;
		ticks -= 6e8 * (minutes = Math.floor(minutes)),
			minutes < 10 && hours && (minutes = "0" + minutes),
			parts.push(minutes);
		let seconds = ticks / 1e7;
		return (seconds = Math.floor(seconds)) < 10 && (seconds = "0" + seconds),
			parts.push(seconds),
			parts.join(":")
	}




	let bindEvent = async () => {
		let buttons = [];
		let retry = 6 + 1;
		while (buttons.length == 0 && retry > 0) {
			await new Promise(resolve => setTimeout(resolve, 500));
			buttons = document.querySelectorAll('[data-mode=play],[data-mode=resume],[data-action=resume]');
			retry -= 1;
		}
		for (let button of buttons) {
			let nextElementSibling = button.nextElementSibling;
			let parentElement = button.parentElement;
			let outerHTML = button.outerHTML;
			button.parentElement.removeChild(button);
			let newButton = document.createElement('button');
			if (nextElementSibling) {
				parentElement.insertBefore(newButton, nextElementSibling);
			} else {
				parentElement.append(newButton);
			}
			newButton.outerHTML = outerHTML;
		}
		buttons = document.querySelectorAll('[data-mode=play],[data-mode=resume]');
		for (let button of buttons) {
			button.removeAttribute('data-mode');
			button.addEventListener('click', e => {
				e.stopPropagation();
				let itemid = /id=(.*?)&serverId/.exec(window.location.hash)[1];
				openPotplayer(itemid);
			});
		}
		buttons = document.querySelectorAll('[data-action=resume]');
		for (let button of buttons) {
			button.removeAttribute('data-action');
			button.addEventListener('click', e => {
				e.stopPropagation();
				if (/\?id=(\w*)/.exec(window.location.hash) == null) {
					let item = e.target;
					while (!item.hasAttribute('data-id')) {
						item = item.parentNode
					}
					var itemid = item.getAttribute('data-id');
				} else {
					var itemid = /\?id=(\w*)/.exec(window.location.hash)[1];
				}
				openPotplayer(itemid);
			});
		}
	};

	let lazyload = () => {
		let items = document.querySelectorAll('[data-src].lazy');
		let y = document.scrollingElement.scrollTop;
		let intersectinglist = [];
		for (let item of items) {
			let windowHeight = document.body.offsetHeight;
			let itemTop = item.getBoundingClientRect()
				.top;
			let itemHeight = item.offsetHeight;
			if (itemTop + itemHeight >= 0 && itemTop <= windowHeight) {
				intersectinglist.push(item);
			}
		}
		for (let item of intersectinglist) {
			item.style.setProperty('background-image', `url("${item.getAttribute('data-src')}")`);
			item.classList.remove('lazy');
			item.removeAttribute('data-src');
		};
	};

	window.addEventListener('scroll', lazyload);

	window.addEventListener('viewshow', async () => {
		bindEvent();
		window.addEventListener('hashchange', bindEvent);
	});
})();