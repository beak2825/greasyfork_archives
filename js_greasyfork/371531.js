// ==UserScript==
// @name         TweetDeck 通知音変更
// @namespace    Aime
// @version      0.1.6
// @description  TweetDeckの通知音を差し替える
// @author       nepon
// @include      https://tweetdeck.twitter.com/*
// @noframes
// @run-at       document-end
// @grant        GM.registerMenuCommand
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/371531/TweetDeck%20%E9%80%9A%E7%9F%A5%E9%9F%B3%E5%A4%89%E6%9B%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/371531/TweetDeck%20%E9%80%9A%E7%9F%A5%E9%9F%B3%E5%A4%89%E6%9B%B4.meta.js
// ==/UserScript==
/*
通知音は左下のSettingsメニューに追加される[Sound settings]から指定してください
試聴プレイヤーの音量も反映されます
対応ファイルmp3/m4a/aac/ogg、上限500KiB
*/
(() => {
	"use strict";

	const MAX_FILE_SIZE = 500*1024;

	const audio = document.getElementById("update-sound");
	if (!audio) return;

	// GM polyfill
	if (typeof GM === "undefined") {
		this.GM = {};
		GM.getValue = (...args) => Promise.resolve(GM_getValue.apply(this, args));
		GM.setValue = (...args) => Promise.resolve(GM_setValue.apply(this, args));
		GM.registerMenuCommand = (...args) => Promise.resolve(GM_registerMenuCommand.apply(this, args));
	}


	// 通知音差し替え
	async function replaceSound(soundData, volume) {
		if (!soundData) {
			soundData = await GM.getValue("sound", "");
			if (!soundData) return;
		}
		const soundUrl = dataURItoObjectURL(soundData);
		if (!soundUrl) return;
		if (!volume) {
			volume = await GM.getValue("volume", 1);
		}

		while (audio.firstChild) {
			audio.removeChild(audio.firstChild);
		}

		audio.addEventListener("loadeddata", event => URL.revokeObjectURL(soundUrl), { once: true });
		audio.src = soundUrl;
		audio.volume = volume;
		audio.load();
	}

	replaceSound();


	function dataURItoBlob(data) {
		try {
			if (!data) return null;

			const separatorIndex = data.indexOf(",");
			if (separatorIndex < 0) return null;

			const matches = data.substring(0, separatorIndex).match(/:([\w-]+\/[\w-]+);/);
			if (!matches) return null;
			const mimeType = matches[1];

			const bin = atob(data.substring(separatorIndex + 1));
			const buffer = new Uint8Array(bin.length).map((val, i) => bin.charCodeAt(i));

			return new Blob([ buffer.buffer ], { type: mimeType });
		} catch (e) {
			return null;
		}
	}
	function dataURItoObjectURL(data) {
		const blob = dataURItoBlob(data);
		return blob? URL.createObjectURL(blob): null;
	}


	// 設定
	let isOpenSettings = null;

	async function openSettings() {
		if (isOpenSettings) return;
		isOpenSettings = true;

		const container = document.createElement("div");
		container.innerHTML = `
<div style="display: inline-block; border: 2px solid #555; background-color:#fff; color: #000; padding: 20px; text-align: left;">
<input id="replace-sound-file" type="file" accept=".mp3, .m4a, .aac, .ogg" style="padding: 4px; height: unset;">
<br><br>
<audio id="replace-sound-player" controls></audio>
<br><br>
<button id="replace-sound-ok">OK</button>
<button id="replace-sound-cancel">Cancel</button>
</div>
`;
		container.style = `
z-index: 1000000000;
position: fixed;
top: calc(50% - 100px);
left: 0;
width: 100%;
text-align: center;
`;
		document.body.appendChild(container);

		const player = container.querySelector("#replace-sound-player");

		let oUrl = null;
		let soundDataURI = await GM.getValue("sound", "");

		const close = () => {
			document.body.removeChild(container);
			isOpenSettings = false;
		};
		container.querySelector("#replace-sound-ok").addEventListener("click", event => {
			const vol = player.volume;
			GM.setValue("sound", soundDataURI);
			GM.setValue("volume", vol);
			replaceSound(soundDataURI, vol);
			close();
		});
		container.querySelector("#replace-sound-cancel").addEventListener("click", event => {
			close();
		});

		container.querySelector("#replace-sound-file").addEventListener("change", event => {
			const target = event.target;
			const file = target.files[0];
			if (/^(?:audio|video)\//.test(file.type) && 0 < file.size && file.size <= MAX_FILE_SIZE) {
				const blob = new Blob([ file ], { type: file.type });
				oUrl = URL.createObjectURL(blob);
				player.src = oUrl;
				player.play();

				const reader = new FileReader();
				reader.onload = () => {
					soundDataURI = reader.result;
				};
				reader.readAsDataURL(file);
			} else {
				target.value = "";
			}
		});

		player.addEventListener("loadeddata", event => {
			if (oUrl) {
				URL.revokeObjectURL(oUrl);
				oUrl = null;
			}
		});
		player.addEventListener("volumechange", event => console.log("volume", event.target.volume));

		if (soundDataURI) {
			oUrl = dataURItoObjectURL(soundDataURI);
			player.src = oUrl;
			player.load();
		}
		player.volume = await GM.getValue("volume", 1);
	}

	// SettingsメニューにSound settingsを挿入
	function injectMenu(menu) {
		const li = document.createElement("li");
		li.className = "is-selectable";
		const a = document.createElement("a");
		a.href = "#";
		a.dataset.action = "soundSettings";
		a.textContent = "Sound settings";
		a.addEventListener("click", event => openSettings());
		li.appendChild(a);
		menu.insertBefore(li, menu.querySelector(".is-selectable"));
	}
	(new MutationObserver((records, ob) => {
		const nav = document.querySelector(".app-navigator");
		if (nav) {
			ob.disconnect();
			(new MutationObserver(records => {
				console.log(records);
				records.forEach(record => {
					record.addedNodes.forEach(node => {
						const menu = node.querySelector(".js-dropdown-content > ul");
						if (menu) {
							injectMenu(menu);
						}
					});
				});
			})).observe(nav, { childList: true });
		}
	})).observe(document.body, { childList: true, subtree: true });

	if (typeof GM.registerMenuCommand !== "undefined") {
		GM.registerMenuCommand("通知音設定", openSettings);
	}
})();