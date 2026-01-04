// ==UserScript==
// @name         NicoSpeedMaster
// @namespace    https://toogiri.buhoho.net/
// @version      0.1.0.1
// @description  プレミアム会員向けに、ニコ動プレーヤーにx2.0以上の再生速度を追加します。 一般会員向けには公式と同じ速度制限があります。速度を出すには動画右クリックのメニューから「視聴方法の切替」で「http」を選んでおくとhlsより速いとされています。
// @author       buhoho
// @match        https://*.nicovideo.jp/watch/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463349/NicoSpeedMaster.user.js
// @updateURL https://update.greasyfork.org/scripts/463349/NicoSpeedMaster.meta.js
// ==/UserScript==



(function () {

'use strict';

// スクリプトが管理している再生速度
let customPlaybackRate = parseFloat(localStorage.customPlaybackRate ?? 1.0);

// 変更前のvideo要素
let prevVideo, prevVideoSrc;

// 多分Premiumじゃないとろくに再生速度出ないので、公式仕様通り制限
let isPremium = JSON.parse(document.querySelector('#CommonHeader').dataset.commonHeader).initConfig.user.isPremium;


function createPlaybackRateMenuItem(rate) {
	const menuItem = document.createElement('div');
	menuItem.classList.add('PlaybackRateMenuItem');
	menuItem.innerHTML = rate === customPlaybackRate?
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" class="CheckIcon PlaybackRateMenuItem-checkIcon"><path d="M13.7 29.9 2.9 19.1l4.2-4.3 6.6 6.6L28.9 6.2l4.2 4.3-19.4 19.4z"></path></svg><div>x${rate.toFixed(1)}</div>`:
		`<div class="PlaybackRateMenuItem-iconSpace"></div><div>x${rate.toFixed(1)}</div>`;
	menuItem.onclick = function () {
		localStorage.customPlaybackRate = prevVideo.playbackRate = customPlaybackRate = rate;
		togglePlaybackRateMenu();
	};
	return menuItem;
}

function createPlaybackRateMenu() {
	const menu = document.createElement('div');
	menu.classList.add('PlaybackRateMenu');
	menu.innerHTML = '<div class="PlaybackRateMenu-title">再生速度</div>';

	const menuContents = document.createElement('div');
	menuContents.classList.add('PlaybackRateMenu-contents');
	menu.appendChild(menuContents);

	const rates = isPremium ? [0.5, 1.0, 1.5, 1.8, 2.3, 2.7, 3.4, 4.2]: [0.5, 1.0, 1.25];
	for (const rate of rates) {
		const menuItem = createPlaybackRateMenuItem(rate);
		menuContents.appendChild(menuItem);
	}

	return menu;
}

function togglePlaybackRateMenu(e) {
	e && e.stopPropagation();
	const existingMenu = document.querySelector('.PlaybackRateMenu');
	if (existingMenu) {
		existingMenu.remove();
	} else {
		const menu = createPlaybackRateMenu();
		const container = document.querySelector('.VideoOverlayContainer');
		if (container) {
			container.appendChild(menu);
		}
	}
}

function buttonShowRate(rate) {
	let btn = document.querySelector('.ActionButton.PlaybackRateButton');

	const btnItem = document.createElement('div');
	//btnItem.style.border = '2px solid white';
	btnItem.style.setProperty('border', '2px solid white', 'important');
	// btnItem.style.background = '#113';
	btnItem.style.padding = '2px';
	btnItem.style.borderRadius = '12px';
	// btnItem.style.backgroundColor = 'rgb(20, 13, 55)';
	btnItem.innerText = `x${rate.toFixed(1)}`;

	// 文字色を白に設定
	btn.style.color = 'white';
	// btn.style.backgroundColor = 'rgb(20, 13, 55)';

	if (rate > 1.0 && rate <= 2.0) {
		btnItem.style.backgroundColor = '#002176';
		btnItem.style.setProperty('border', '2px solid #aaeeff', 'important');
		btnItem.style.setProperty('color', '#aaeeff', 'important');
		// btnItem.style.backgroundColor = '#003386'; // 濃い青色
	} else if (rate > 2.0) {
		btnItem.style.backgroundColor = '#660005';
		btnItem.style.setProperty('border', '2px solid #ffaacf', 'important');
		btnItem.style.setProperty('color', '#ffaacf', 'important');
		// btnItem.style.backgroundColor = '#a60012'; // 濃い赤色
	}

	btn.innerHTML = '';
	btn.appendChild(btnItem);
}

function setPlaybackRateEventListener(v) {
	v.addEventListener('ratechange', () => {
		// console.log("レートが変更されました。");
		let rate = v.playbackRate;
		if (rate !== customPlaybackRate) {
			// 再生速度がスクリプトが管理しているものと異なる場合、管理している再生速度に戻す
			v.playbackRate = customPlaybackRate;
			return;
		}
		buttonShowRate(rate);
	});
}

new MutationObserver(mutations => {
	const v = document.querySelector('#MainVideoPlayer video');
	if (prevVideo === v && prevVideoSrc === v.src)
		return;
	// video 要素が変更されたときの処理を記述
	setPlaybackRateEventListener(v);
	// メニュー表示処理を上書き
	document.querySelector('button.ActionButton.PlaybackRateButton').onclick = togglePlaybackRateMenu;
	// 速度更新
	v.playbackRate = customPlaybackRate;
	// 現在のvideo要素を保存(変更を検知するため)
	prevVideo = v;
	prevVideoSrc = v.src;
}).observe(document.querySelector('#js-app'), {childList: true, subtree: true});


})();