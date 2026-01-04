// ==UserScript==
// @name        Darkify
// @namespace   http://yifangu.com
// @license     MIT
// @version     2024-02-27
// @description Selectively toggle dark mode for any website
// @author      You
// @match       *://*/*
// @run-at      document-start
// @inject-into content
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM.info
// @downloadURL https://update.greasyfork.org/scripts/488473/Darkify.user.js
// @updateURL https://update.greasyfork.org/scripts/488473/Darkify.meta.js
// ==/UserScript==

(async function () {
	"use strict";
	if (window.top !== window.self) {
		return;
	}
	const ver = GM.info.script.version;
	const firstRunReadme = [
		"This is your first time running Darkify",
		"Press CTRL+SHIFT+D to toggle on/off dark mode at a given site.",
		"For mobile devices, hold down three fingers for 3 seconds to toggle on/off dark mode.",
		`Version ${ver}`,
	].join("\n");

	const upgradeReadme = [
		`Darkify has been upgraded to version ${ver}`
	].join("\n");

	const defaultConfig = {
		enabled: false,
	};

	const savedVer = await GM.getValue("version");
	if (savedVer === undefined) {
		// first run
		alert(firstRunReadme);
		await GM.setValue("version", ver);
	} else if (savedVer !== ver) {
		alert(upgradeReadme);
		await GM.setValue("version", ver);
	}

	function hex(s) {
		return s.split("").map((c) => c.charCodeAt(0).toString(16)).join("");
	}

	const loadConfig = async () => {
		const siteKey = hex(location.hostname);
		const configJson = await GM.getValue(`siteConfig.${siteKey}`, "{}");
		let config = defaultConfig;
		try {
			config = { ...defaultConfig, ...JSON.parse(configJson) };
		} catch (e) {
			// ignore
		}
		return config;
	};

	const saveConfig = async (config) => {
		const siteKey = hex(location.hostname);
		await GM.setValue(`siteConfig.${siteKey}`, JSON.stringify(config));
	}

	const config = await loadConfig();
	const { enabled } = config;

	const toggle = async () => {
		await saveConfig({ ...config, enabled: !enabled });
		location.reload();
	};

	window.addEventListener("keydown", async (e) => {
		// ctrl + shift + d
		if (e.ctrlKey && e.shiftKey && e.key === "D") {
			e.preventDefault();
			await toggle();
		}
	});

	let toggleTimeoutHandle;
	document.addEventListener("touchmove", (e) => {
		const num = e.touches.length;
		if (num === 3) {
			if (toggleTimeoutHandle === undefined) {
				toggleTimeoutHandle = setTimeout(async () => {
					await toggle();
					toggleTimeoutHandle = undefined;
				}, 3000);
			}
		} else {
			if (toggleTimeoutHandle !== undefined) {
				clearTimeout(toggleTimeoutHandle);
				toggleTimeoutHandle = undefined;
			}
		}
	});

	document.addEventListener("touchend", () => {
		if (toggleTimeoutHandle !== undefined) {
			clearTimeout(toggleTimeoutHandle);
			toggleTimeoutHandle = undefined;
		}
	});

	if (!enabled) {
		return;
	}

	const css = `
		:root {
			color-scheme: dark;
			background-color: white;
			filter: invert(100%) hue-rotate(180deg) !important;
			-webkit-font-smoothing: antialiased;
			color: black;
		}
		body {
			color-scheme: light;
			background-color: #000 !important;
			background: linear-gradient(#fff, #fff);
		}
		img:not([src*="svg"]),video,iframe,embed,object,canvas,picture,.logo,.darkify-ignore {
			filter: invert(100%) hue-rotate(180deg) !important;
		}
		img[src*="svg"]:hover {
			background-color: #aaa !important;
		}
	`;


	function darkify() {
		const divs = document.querySelectorAll("div");
		for (const div of divs) {
			if (!div.classList.contains("darkify-ignore")) {
				continue;
			}
			const cs = getComputedStyle(div);
			const bg = cs.backgroundImage;
			const bs = cs.backgroundSize;
			if (bg === "none") {
				continue;
			}
			if (!["cover", "contain"].includes(bs)) {
				continue;
			}
			if (bg.includes(".svg") || bg.includes(".gif")) {
				continue;
			}
			div.classList.add("darkify-ignore");
		}
		if (document.getElementById("darkify")) {
			return;
		}
		const style = document.createElement("style");
		style.id = "darkify";
		style.innerHTML = css;

		const themeColorMeta = document.createElement("meta");
		themeColorMeta.name = "theme-color";
		themeColorMeta.content = "#000000";

		document.head.appendChild(style);
		document.head.appendChild(themeColorMeta);
	}

	darkify();

	document.addEventListener("DOMContentLoaded", darkify);
})();
