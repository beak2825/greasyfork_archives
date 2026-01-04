// ==UserScript==
// @name         MyNdownloader
// @namespace    tests
// @version      0.2
// @description  はいいいえ
// @author       You
// @match          *://www.nicovideo.jp/*
// @match          *://ext.nicovideo.jp/
// @match          *://ext.nicovideo.jp/#*
// @match          *://blog.nicovideo.jp/*
// @match          *://ch.nicovideo.jp/*
// @match          *://com.nicovideo.jp/*
// @match          *://commons.nicovideo.jp/*
// @match          *://dic.nicovideo.jp/*
// @match          *://ex.nicovideo.jp/*
// @match          *://info.nicovideo.jp/*
// @match          *://search.nicovideo.jp/*
// @match          *://uad.nicovideo.jp/*
// @match          *://api.search.nicovideo.jp/*
// @match          *://*.nicovideo.jp/smile*
// @match          *://site.nicovideo.jp/*
// @exclude        *://ads.nicovideo.jp/*
// @exclude        *://www.upload.nicovideo.jp/*
// @exclude        *://www.nicovideo.jp/watch/*?edit=*
// @exclude        *://ch.nicovideo.jp/tool/*
// @exclude        *://flapi.nicovideo.jp/*
// @exclude        *://dic.nicovideo.jp/p/*
// @grant       GM.download
// @grant       GM_download
// @grant       GM.registerMenuCommand
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/370859/MyNdownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/370859/MyNdownloader.meta.js
// ==/UserScript==




(function () {
	'use strict';

	let keyDownloadMov = 'r';
	let keyDownloadMylist = 'a';


	var isBusy = false;


	GM.registerMenuCommand(_('動画をダウンロードする'), saveMov, keyDownloadMov);

	GM.registerMenuCommand(_('動画をダウンロードする(マイリスト再生)'), async function () {
		var oldSrc = '';
		setInterval(function () {
			try {
				let src = document.querySelector('#ZenzaWatchVideoPlayerContainer > video').src;
				if (oldSrc !== src) {
					oldSrc = src;
					saveMov();
				}

			} catch (e) { clearInterval(); }
		}, 1000);
	}, keyDownloadMylist);


	async function saveMov() {
		try {
			let src = document.querySelector('#ZenzaWatchVideoPlayerContainer > video').src;

			var author = document.querySelector('#zenzaVideoPlayerDialog > div > div.zenzaPlayerContainer.is-showComment.is-regularUser.is-dmcAvailable.is-dmcPlaying.showVideoControlBar.showVideoHeaderPanel.is-open > div.zenzaWatchVideoInfoPanel.show.userVideo > div.tabs.videoInfoTab.activeTab > div > div.zenzaWatchVideoInfoPanelContent > div.videoOwnerInfoContainer > span > span');
			if (!author) author = document.querySelector('#zenzaVideoPlayerDialog > div > div.zenzaPlayerContainer.is-showComment.is-regularUser.is-open.is-dmcAvailable.is-dmcPlaying > div.zenzaWatchVideoInfoPanel.show.userVideo > div.tabs.videoInfoTab.activeTab > div > div.zenzaWatchVideoInfoPanelContent > div.videoOwnerInfoContainer > span > span');
			if (!author) author = document.querySelector('#zenzaVideoPlayerDialog > div > div.zenzaPlayerContainer.is-showComment.is-regularUser.is-open.is-playing > div.zenzaWatchVideoInfoPanel.show.userVideo > div.tabs.videoInfoTab.activeTab > div > div.zenzaWatchVideoInfoPanelContent > div.videoOwnerInfoContainer > span > span');
			if (!author) author = document.querySelector('#zenzaVideoPlayerDialog > div > div.zenzaPlayerContainer.is-showComment.is-regularUser.is-open.is-dmcAvailable.is-dmcPlaying.is-pausing > div.zenzaWatchVideoInfoPanel.show.userVideo > div.tabs.videoInfoTab.activeTab > div > div.zenzaWatchVideoInfoPanelContent > div.videoOwnerInfoContainer > span > span');
			author = author.innerText;
			author = author.slice(0, author.length - 3);


			var title = document.querySelector('#zenzaVideoPlayerDialog > div > div.zenzaPlayerContainer.is-showComment.is-regularUser.is-dmcAvailable.is-dmcPlaying.showVideoControlBar.showVideoHeaderPanel.is-open > div.zenzaWatchVideoHeaderPanel.show.userVideo > h2 > span');
			if (!title) title = document.querySelector('#zenzaVideoPlayerDialog > div > div.zenzaPlayerContainer.is-showComment.is-regularUser.is-open.is-dmcAvailable.is-dmcPlaying.is-playing > div.zenzaWatchVideoHeaderPanel.show.has-Parent.userVideo > h2 > span');
			if (!title) title = document.querySelector('#zenzaVideoPlayerDialog > div > div.zenzaPlayerContainer.is-showComment.is-regularUser.is-open.is-playing > div.zenzaWatchVideoHeaderPanel.show.has-Parent.userVideo > h2 > span');
			if (!title) title = document.querySelector('#zenzaVideoPlayerDialog > div > div.zenzaPlayerContainer.is-showComment.is-regularUser.is-open.is-dmcAvailable.is-dmcPlaying.is-playing > div.zenzaWatchVideoHeaderPanel.show.userVideo > h2 > span');
			if (!title) title = document.querySelector('#zenzaVideoPlayerDialog > div > div.zenzaPlayerContainer.is-showComment.is-regularUser.is-open.is-dmcAvailable.is-dmcPlaying.is-pausing > div.zenzaWatchVideoHeaderPanel.show.userVideo > h2 > span');
			if (!title) title = document.querySelector('#zenzaVideoPlayerDialog > div > div.zenzaPlayerContainer.is-showComment.is-regularUser.is-open.is-playing > div.zenzaWatchVideoHeaderPanel.show.userVideo > h2 > span');
            title = title.innerText;

			GM_download(src, `${title}[${author}].mp4`);
		} catch (e) { alert('ダウンロードできませんでした。'); throw new Error(e.name + ': ' + e.message); }
	}


	//console.log('called');
	//GM_download('https://maoudamashii.jokersounds.com/music/se/mp3/se_maoudamashii_se_syber05.mp3', 'test.mp3');
})();