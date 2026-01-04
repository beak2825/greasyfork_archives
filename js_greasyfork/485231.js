// ==UserScript==
// @name         Youtube Music Auto Audio Mode
// @name:zh-TW   Youtube Music 自動純音訊切換器
// @name:zh-CN   Youtube Music 自动纯音讯切换器
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Youtube Music simple script for save the network traffic with auto switch music to audio-only mode
// @description:zh-tw 播放Youtube Music時自動切換成純音訊模式節省流量
// @description:zh-cn 播放Youtube Music时自动切换成纯音讯模式节省流量
// @author       You
// @match        https://music.youtube.com/*
// @icon         https://music.youtube.com/favicon.ico
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485231/Youtube%20Music%20Auto%20Audio%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/485231/Youtube%20Music%20Auto%20Audio%20Mode.meta.js
// ==/UserScript==

const settings = {
	isEnabled: true,
	isHidden: false,
	autoMusicIntervalNumber: undefined,
};

window.onload = async () => {
	window.trustedTypes.createPolicy("default", { createHTML: (string, sink) => string });
	await loadSettings();
	await saveSettings();
	await GM_registerMenuCommand("Open Menu", () => {
		// gm menu command
		createSettingsPanel();
		settings.isHidden = false;
	});
	if (settings.isEnabled) {
		execute();
	}
	if (!settings.isHidden) {
		createSettingsPanel();
	}
};

async function saveSettings() {
	await GM.setValue("autoMusicMode", JSON.stringify(settings));
}

async function loadSettings() {
	const storedSettings = await GM.getValue("autoMusicMode");
	if (storedSettings) {
		Object.assign(settings, JSON.parse(storedSettings));
	}
}

function execute() {
	switchToAudio();
	const id = setInterval(() => {
		switchToAudio();
	}, 10000);
	settings.autoMusicIntervalNumber = id;
	saveSettings();
}

function switchToAudio() {
	if (document.querySelector('ytmusic-av-toggle[class="style-scope ytmusic-player-page"]').getAttribute("playback-mode") === "OMV_PREFERRED") {
		document.getElementsByClassName("song-button style-scope ytmusic-av-toggle")[0].click();
	}
}

function createSettingsPanel() {
	const panel = document.createElement("div");
	panel.id = "settingsPanel";
	panel.style.position = "fixed";
	panel.style.top = "10px";
	panel.style.right = "10px";
	panel.style.backgroundColor = "rgba(0, 0, 0, 1)";
	panel.style.padding = "10px";
	panel.style.borderRadius = "5px";
	panel.style.zIndex = "9999";
	panel.style.fontSize = "14px";

	panel.innerHTML = `
		<h3 style="color: white;">Only Audio</h3>
        <label style="color: white;">
            <input type="checkbox" id="isEnabled" ${settings.isEnabled ? "checked" : ""}>
            On/Off
        </label><br>
        <button id="hideSettings" style="margin-top: 10px;">close</button>
    `;

	document.body.appendChild(panel);

	document.getElementById("isEnabled").addEventListener("change", async (e) => {
		settings.isEnabled = e.target.checked;
		if (settings.isEnabled) {
			execute();
		} else {
			clearInterval(settings.autoMusicIntervalNumber);
			settings.autoMusicIntervalNumber = undefined;
		}
		await saveSettings();
	});
	document.getElementById("hideSettings").addEventListener("click", async () => {
		settings.isHidden = true;
		document.getElementById("settingsPanel").remove();
		await saveSettings();
	});
}
