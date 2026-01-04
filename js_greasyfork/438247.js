// ==UserScript==
// @name        ニコニコ生放送 360°再生
// @description Equirectangular形式の360°配信を見回せるようにします。ユーザースクリプトコマンドから「360°」を選択すると有効化されます。
// @namespace   https://greasyfork.org/users/137
// @version     0.1.0
// @match       https://live.nicovideo.jp/watch/lv*
// @license     MPL-2.0
// @contributionURL https://www.amazon.co.jp/registry/wishlist/E7PJ5C3K7AM2
// @compatible  Edge
// @compatible  Firefox 推奨
// @compatible  Opera
// @compatible  Chrome
// @grant       GM.registerMenuCommand
// @grant       GM_registerMenuCommand
// @require     https://cdn.jsdelivr.net/gh/greasemonkey/gm4-polyfill@a834d46afcc7d6f6297829876423f58bb14a0d97/gm4-polyfill.js
// @require     https://cdn.jsdelivr.net/npm/three@0.105.2/build/three.js
// @require     https://cdn.jsdelivr.net/npm/panolens@0.12.1/build/panolens.js
// @noframes
// @icon        https://nicolive.cdn.nimg.jp/relive/party1-static/images/common/favicon.3cf1c.ico
// @author      100の人
// @homepageURL https://greasyfork.org/users/137
// @downloadURL https://update.greasyfork.org/scripts/438247/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E7%94%9F%E6%94%BE%E9%80%81%20360%C2%B0%E5%86%8D%E7%94%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/438247/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E7%94%9F%E6%94%BE%E9%80%81%20360%C2%B0%E5%86%8D%E7%94%9F.meta.js
// ==/UserScript==

'use strict';

const FPS = 30;

GM.registerMenuCommand('360°', function () {
	const video = document.querySelector('[class^="___video-layer"] video');
	const canvas = document.createElement('canvas');
	canvas.hidden = true;
	canvas.width = video.videoWidth;
	canvas.height = video.videoHeight;
	document.body.append(canvas);
	const image = document.createElement('img');
	image.hidden = true;
	document.body.append(image);
	document.querySelector('[class*="player-display-screen"]').insertAdjacentHTML(
		'beforeend',
		'<div class="viewer-360" style="position: absolute; top: 0; right: 0; bottom: 0;left: 0;"></div>'
	);
	const viewer = new PANOLENS.Viewer({ container: document.getElementsByClassName('viewer-360')[0] });
	const panorama = new PANOLENS.ImagePanorama(image);
	viewer.add(panorama);
	image.addEventListener('load', function () {
		panorama.load(image);
	});

	let nextTimestamp = Date.now();
	requestAnimationFrame(function render() {
		if (Date.now() < nextTimestamp) {
			requestAnimationFrame(render);
			return;
		}

		nextTimestamp = Date.now() + 1000 / FPS;

		canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
		canvas.toBlob(function (blob) {
			if (image.src) {
				URL.revokeObjectURL(image.src);
			}
			image.src = URL.createObjectURL(blob);
			requestAnimationFrame(render);
		});
	});
});
