// ==UserScript==
// @name         YouTube - Open Uploaded Videos Playlist
// @description  YouTube - Open Uploaded Videos Playlist.
// @version      0.5
// @author       to
// @namespace    https://github.com/to
// @license      MIT
//
//
// @noframes
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// 
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/509235/YouTube%20-%20Open%20Uploaded%20Videos%20Playlist.user.js
// @updateURL https://update.greasyfork.org/scripts/509235/YouTube%20-%20Open%20Uploaded%20Videos%20Playlist.meta.js
// ==/UserScript==

// 新しいタブで開くか？(保存データタブで書き換え)
const OPEN_IN_TAB = GM_getValue('openInTab', null);
if (OPEN_IN_TAB == null)
	GM_setValue('openInTab', false);

GM_registerMenuCommand('Open Uploaded Videos Playlist', () => {
	let channelId;

	// 個別ページか？
	if (unsafeWindow.ytInitialPlayerResponse) {
		channelId = unsafeWindow.ytInitialPlayerResponse.videoDetails.channelId;
	} else {
		try {
			channelId = document.querySelector('link[rel="canonical"]').href.match(/channel\/(.+)/)[1];
		} catch {
			alert('This is not the intended page.');
			return;
		}
	}

	// 新しいタブで開くか？
	let url = 'https://www.youtube.com/playlist?list=UU' + channelId.slice(2)
	OPEN_IN_TAB ?
		GM_openInTab(url) :
		location.href = url;
});

// 個別ページか？
if (unsafeWindow.ytInitialPlayerResponse) {
	// 開いている動画よりも新しいものへ向かって連続再生する
	GM_registerMenuCommand('Open Newer Videos Playlist', () => {
		location.href = `https://www.youtube.com/watch?v=${unsafeWindow.ytInitialPlayerResponse.videoDetails.videoId}&list=UL01234567890`;
	});
}
