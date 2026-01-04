// ==UserScript==
// @name        Bonk NSFW map filter
// @namespace   salama.xyz
// @author      Salama
// @version     1.8
// @match       https://*.bonk.io/gameframe-release.html
// @match       https://*.bonkisback.io/gameframe-release.html
// @supportURL  https://discord.gg/Dj6usq7ww3
// @grant       none
// @description Blocks NSFW bonk maps
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/501077/Bonk%20NSFW%20map%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/501077/Bonk%20NSFW%20map%20filter.meta.js
// ==/UserScript==

////////////////////////
////    SETTINGS    ////
////////////////////////

/* Optionally depends on code injector and BonkLIB
 * ----------------------------------------------------------------
 * https://greasyfork.org/en/scripts/433861-code-injector-bonk-io
 * - Adds warning to map suggestions
 * - Blurs or blacks out map in lobby and in game
 * ----------------------------------------------------------------
 * https://greasyfork.org/en/scripts/508104-bonklib
 * - Adds GUI settings
 * ----------------------------------------------------------------
 */

// This script connects to GitHub to get an up to date list.

// Commas in front for ease of use
// true = yes
// false = no

const settings = {
	 HIDE_NSFW_REPLAYS: true
	,DISABLE_REPLAYS: false

	// If false, maps will be blurred instead
	,HIDE_MAPS_FROM_MAP_SELECTOR: true

	// If true, map details won't be blurred
	,BLUR_ONLY_MAP_PREVIEW: false

	,UNBLUR_MAP_ON_MOUSE_HOVER: false

	,INCLUDE_REMIXES_OF_NSFW_MAPS: true

	/* You can enable this in case injection fails due to a
	 * bonk update. The mod will still work for its main purpose
	 */
	,DISABLE_INJECTION_FAIL_WARNING: false

	,WARN_ABOUT_MAP_REQUESTS: true

	,HIDE_GAME_ON_NSFW: true

	// Blocklist is cached for 4 * 60 sec = 4 minutes
	,CACHE_DURATION: 4 * 60

	,AUTHOR_BLOCKLIST: []
}

const guiSettings = {
    noWindow: true,
    // Must be defined before bonkHUD.createMod
    settingsContent: null,
    // Version (optional)
    bonkLIBVersion: "1.1.3",
    modVersion: "1.8",

}


////////////////////////
///       CODE      ////
////////////////////////

'use strict';

const NSFWLIST_VERSION = 2;

const global = {
	cacheTime: 0,
	NSFWList: [],
	NSFWMaps: new Set(),
	replays: [],
	ignoreNextReport: false,
	injected: false
};

function addToNSFWList(id, author = "ﬁ", name = "ﬁ") {
	if (global.injected) {
		global.NSFWMaps.add([id.toString(), author, name].join("ﬀ"));
	}
	else {
		global.NSFWMaps.add(id.toString());
	}
}

function getFromNSFWList(id, author = "ﬁ", name = "ﬁ") {
	if (global.injected) {
		return global.NSFWMaps.has([id.toString(), author, name].join("ﬀ"));
	}
	else {
		return global.NSFWMaps.has(id.toString());
	}
}

function requestHandler(original) {
	return function(url,body,success,type) {
		if (global.ignoreNextReport &&
			url.endsWith("/replay_report.php")
		) {
			global.ignoreNextReport = false;
			return {
				done: () => {
					return {
						fail: () => {}
					}
				}
			}
		}

		if (settings.DISABLE_REPLAYS &&
			url.endsWith("/replay_get.php")
		) {
			return {
				done: () => {
					return {
						fail: () => {}
					}
				}
			}
		}


		// Send request
		const response = original.apply(this, arguments);

		// Hijack response callback
		const responseDone = response.done;
		response.done = function(responseCallback) {
			/* The originally synchronous responseCallback can
			 * be replaced with an asynchronous function, because
			 * its return value is never saved or used anywhere.
			 */
			const originalResponseCallback = responseCallback;
			responseCallback = async function(data, status) {
				// Data is sometimes string and sometimes JSON

				let wasParsed = false;

				if (typeof data === "string") {
					try {
						let parsed = JSON.parse(data);
						wasParsed = true;

						data = parsed;
					}
					catch {
						wasParsed = false;
					}
				}

				if (typeof data === "object") {
					// If the request response contains a map array
					if (Object.keys(data).includes("maps")) {
						// Bonk 2 maps
						if (typeof data.maps === "object") {
							const NSFWList = await getNSFWList();

							if (/^G/.test(read(pretty_top_level)) ||
								await isOK([read(pretty_top_name)]) ||
								pushOK(read(pretty_top_name))
							) {
								data.maps.ok = true;
							}

							for (let i = 0; i < data.maps.length; i++) {
								const map = data.maps[i];

								const hash = await getHash(map.id.toString(), map.authorname, map.name);

								if (isNSFW(NSFWList, hash, map.authorname)) {
									addToNSFWList(map.id, map.authorname, map.name);
								}
								else if (settings.INCLUDE_REMIXES_OF_NSFW_MAPS) {
									if (map.remixid > 0) {
										const rxhash = await getHash(map.remixid.toString(), map.remixauthor, map.remixname);

										if (isNSFW(NSFWList, rxhash, map.remixauthor)) {
											addToNSFWList(map.id, map.authorname, map.name);
										}
									}
								}
							}
						}
						// Bonk 1 maps
						else if (typeof data.maps === "string") {
							const NSFWList = await getNSFWList();

							let maps = [];
							data.maps.split("&").forEach(m => {
								if(!m) return;
								let [prop, value, index, _] = m.split("=");

								if (prop === "cant") return;

								[_, prop, index] = [...prop.match("(.+?)([0-9]+)")];

								if (prop === "mapname") {
									value = decodeURIComponent(value.replaceAll('+', '%20'));
								}

								maps[index] = maps[index] || {};
								maps[index][prop] = value;
							});

							if (/^G/.test(read(pretty_top_level)) ||
								await isOK([read(pretty_top_name)]) ||
								pushOK(read(pretty_top_name))
							) {
								maps.ok = true;
							}

							for (let i = 0; i < maps.length; i++) {
								const map = maps[i];

								const hash = await getHash(map.mapid, map.authorname, map.mapname);

								if (isNSFW(NSFWList, hash, map.authorname)) {
									addToNSFWList(map.mapid, map.authorname, map.mapname);
								}
							}
						}
					}
					else if (Object.keys(data).includes("replays")) {
						// Make sure the list has loaded before we allow replays pass through
						await getNSFWList();
						if (body.offset === 0) {
							global.replays = [];
						}
						global.replays = global.replays.concat(data.replays);
					}
				}

				if (wasParsed) {
					data = JSON.stringify(data);
				}

				// Call original response callback
				return originalResponseCallback.apply(this, arguments);
			}

			// Set our own function as the response callback
			return responseDone.call(this, responseCallback);
		}

		return response;
	}
}

async function isOK(map) {
	return new Promise(async resolve => {
		resolve(getOK().includes(
			await sha256(map[Object.keys(map).sort((a, b) => a.localeCompare(b))[0]])
		));
	});
}

function isNSFW(list, hash, author) {
	return list.includes(hash) || (author && settings.AUTHOR_BLOCKLIST.includes(author));
}

async function getNSFWList() {
	return new Promise(resolve => {
		if (Date.now() - global.cacheTime > settings.CACHE_DURATION * 1000) {
			global.cacheTime = Date.now();

			window.$.get("https://gist.githubusercontent.com/Salama/c93f26e0468aa743453339c8c993adaa/raw?" + Date.now()).done(r => {
				let NSFWList = r.split("\n");
				let version = parseInt(NSFWList.splice(0, 1));

				if (version > NSFWLIST_VERSION) {
					alert("NSFW map blocker is outdated!");

					// Prevent future requests
					global.cacheTime = Infinity;
					resolve([]);
					return;
				}
				global.NSFWList = NSFWList;
			});
		}

		resolve(global.NSFWList);
	});
}

async function sha256(text) {
	const encoder = new TextEncoder();
	const data = encoder.encode(text);
	const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
	return hashHex;
}

async function pushOK(props) {
	let current = getOK();
	current.push(await sha256(props));
	return window.localStorage.setItem("nsfwok", current.join(""));
}

function getOK() {
	let ok = window.localStorage.getItem("nsfwok");
	if (!ok) {
		window.localStorage.setItem("nsfwok", "");
		return [];
	}
	return [...ok.match(/.{64}/g)];
}

function read(e) {
	return e.textContent;
}

async function getHash(first, second, third, fourth = isOK([second])) {
	return sha256(
		["zV6IqJQDncyqGv7t2efz︁1jQQyOpRwO︀", await sha256(first), await sha256(second), await sha256(third), await fourth].join("᠎")
	);
}

function addBlurStyle() {
	let blurStyle = document.createElement("style");
	blurStyle.innerHTML = `
		/* Blur map preview in map selector */
		.blurNSFW > .maploadwindowtextname {
			filter: blur(6px);
		}
		.blurNSFW > .maploadwindowtextauthor {
			filter: blur(4px);
		}
		.blurNSFW > img {
			filter: blur(12px);
			overflow: hidden;
		}
		/* Blur map preview in vote */
		.blurNSFW > #newbonklobby_votewindow_maptitle {
			filter: blur(6px);
		}
		.blurNSFW > #newbonklobby_votewindow_mapauthor {
			filter: blur(6px);
		}

		/* Unblur map preview in map selector on mouse hover */
		.hoverUnblurNSFW:hover > .maploadwindowtextname {
			filter: unset !important;
		}
		.hoverUnblurNSFW:hover > .maploadwindowtextauthor {
			filter: unset !important;
		}
		.hoverUnblurNSFW:hover > img {
			filter: unset !important;
		}

		/* Blur map preview in lobby */
		.blurNSFW > #newbonklobby_maptext {
			filter: blur(6px);
		}
		.blurNSFW > #newbonklobby_mapauthortext {
			filter: blur(4px);
		}
		.blurNSFW > #newbonklobby_mappreviewcontainer {
			filter: blur(12px);
		}

		/* Unblur map preview in lobby on mouse hover */
		.hoverUnblurNSFW > #newbonklobby_maptext:hover {
			filter: unset !important;
		}
		.hoverUnblurNSFW > #newbonklobby_mapauthortext:hover {
			filter: unset !important;
		}
		.hoverUnblurNSFW > #newbonklobby_mappreviewcontainer:hover {
			filter: unset !important;
		}

		/*Disable blurred map background in lobby */
		.disableMapthumbBig > #newbonklobby_mapthumb_big {
			display: none !important;
		}

		/* Disable map */
		.fullyTransparent {
			opacity: 0 !important;
		}
	`;
	document.head.appendChild(blurStyle);
}

(async () => {
	addBlurStyle();

	// Hijack requests
	const jqGet = requestHandler(window.$.get);
	const jqPost = requestHandler(window.$.post);
	window.$.get = jqGet;
	window.$.post = jqPost;

	getNSFWList();

	const mapObserver = new MutationObserver(mutations => {
		// Don't handle bonk 1 maps for now...
		// Using this due to uncertainty of dbv accuracy
		//if (read(document.getElementById("maploadtypedropdowntitle")).includes("BONK 1")) return;

		for (const mutation of mutations) {
			for (const node of mutation.addedNodes) {
				if (getFromNSFWList(node.map.m.dbid, node.map.m.a, node.map.m.n)) {
					if (settings.HIDE_MAPS_FROM_MAP_SELECTOR) {
						node.remove();
					}
					else {
						node.classList.add("blurNSFW");
						if (settings.BLUR_ONLY_MAP_PREVIEW) {
							node.getElementsByClassName("maploadwindowtextname")[0].style.filter = "unset";
							node.getElementsByClassName("maploadwindowtextauthor")[0].style.filter = "unset";
						}
						if (settings.UNBLUR_MAP_ON_MOUSE_HOVER) {
							node.classList.add("hoverUnblurNSFW");
						}
					}
				}
			}
		}
	});
	mapObserver.observe(document.getElementById("maploadwindowmapscontainer"), {childList: true});

	// Replay section

	if (settings.DISABLE_REPLAYS) {
		document.getElementById("bgreplay").style.display = "none";
	}

	// TODO fix replayIndex drifting when spamming next replay.
	// Possibly fixed now?
	let replayIndex = -1;

	let ignoreReplayChange = false;
	const replayObserver = new MutationObserver(async mutations => {
		if (settings.DISABLE_REPLAYS || !settings.HIDE_NSFW_REPLAYS) return;

		let author = "";
		let name = "";
		for (const mutation of mutations) {
			if (mutation.type === "childList") {
				author = read(mutation.target.children[2]);
				name = read(mutation.target.children[0]);
			}
			else if (mutation.type === "attributes") {
				/* We need to override the visibility status to another visibility type
				 * to prevent bonk from periodically updating replay credits, which
				 * messes up replayIndex
				 */
				if (mutation.target.style.visibility === "inherit") {
					mutation.target.style.visibility = "visible";
				}
			}
		}

		if (!author && !name) return;

		if (!ignoreReplayChange) {
			replayIndex++;
		}
		ignoreReplayChange = false;


		if (!global.replays[replayIndex]) {
			return;
		}

		const NSFWList = await getNSFWList();

		const hash = await getHash(global.replays[replayIndex].mapid.toString(), author, name);

		if (isNSFW(NSFWList, hash, author) ||
			getFromNSFWList(global.replays[replayIndex].mapid)
		) {
			addToNSFWList(global.replays[replayIndex].mapid);
			global.ignoreNextReport = true;
			document.getElementById("pretty_top_replay_report").click();
		}
	});
	replayObserver.observe(document.getElementById("pretty_top_replay_text"), {childList: true, attributes: true});

	document.getElementById("pretty_top_replay_back").addEventListener("click", () => {
		replayIndex--;
		replayIndex = Math.max(replayIndex, 0);
		ignoreReplayChange = true;
	}, true);

	document.getElementById("pretty_top_replay_next").addEventListener("click", () => {
		replayIndex++;
		replayIndex = Math.min(replayIndex, global.replays.length - 1);
		ignoreReplayChange = true;
	}, true);

	document.getElementById("pretty_top_replay_report").addEventListener("click", () => {
		ignoreReplayChange = true;
		global.replays.splice(replayIndex, 1);
	});
})();

window.NSFWFilter = {
	wrap: () => {
		const gameLoadedWaiter = setInterval(async() => {
			if (
				window.NSFWFilter.menuFunctions !== undefined &&
				Object.keys(window.NSFWFilter.menuFunctions).length >= 27) {
				clearInterval(gameLoadedWaiter);
			}
			else return;

			for (const i of Object.keys(window.NSFWFilter.menuFunctions)) {
				if (typeof window.NSFWFilter.menuFunctions[i] !== "function") continue;
				const ogFunc = window.NSFWFilter.menuFunctions[i];

				window.NSFWFilter.menuFunctions[i] = function() {
					switch (i) {
						case "recvMapSuggest":
							if(!settings.WARN_ABOUT_MAP_REQUESTS) break;

							const suggestion = arguments[0];
							getHash(suggestion.m.dbid.toString(), suggestion.m.a, suggestion.m.n).then(async hash => {
								const NSFWList = await getNSFWList();

								if (isNSFW(NSFWList, hash, suggestion.m.a)) {
									addToNSFWList(suggestion.m.dbid, suggestion.m.a, suggestion.m.n);
								}
								else if (settings.INCLUDE_REMIXES_OF_NSFW_MAPS) {
									if (suggestion.m.rxid > 0) {
										const rxhash = await getHash(suggestion.m.rxid.toString(), suggestion.m.rxa, suggestion.m.rxn);

										if (isNSFW(NSFWList, rxhash, suggestion.m.rxa)) {
											addToNSFWList(suggestion.m.dbid, suggestion.m.a, suggestion.m.n);
										}
									}
								}
								if (getFromNSFWList(suggestion.m.dbid, suggestion.m.a, suggestion.m.n)) {
									window.NSFWFilter.menuFunctions.showStatusMessage("* NSFW map request", "#ff0000", false);
								}
							});
							break;
						case "setGameSettings":
							handleLobbyMap(arguments[0].map.m);
							break;
					}
					let response = ogFunc.apply(window.NSFWFilter.menuFunctions, arguments);
					return response;
				}
			}

			for (const i of Object.keys(window.NSFWFilter.toolFunctions.networkEngine)) {
				if (typeof window.NSFWFilter.toolFunctions.networkEngine[i] !== "function") continue;
				const ogFunc = window.NSFWFilter.toolFunctions.networkEngine[i];

				window.NSFWFilter.toolFunctions.networkEngine[i] = function() {
					switch (i) {
						case "sendMapAdd":
							unblurLobby();
							break;
					}
					let response = ogFunc.apply(window.NSFWFilter.toolFunctions.networkEngine, arguments);
					return response;
				}
			}

			window.NSFWFilter.toolFunctions.networkEngine.on("mapAdd", async map => {
				await handleLobbyMap(map.m);
			});
		}, 50);
	},
	checkReplay: async map => {
		if (!settings.INCLUDE_REMIXES_OF_NSFW_MAPS) return;

		const NSFWList = await getNSFWList();

		const hash = await getHash(map.dbid.toString(), map.a, map.n);
		const rxhash = await getHash(map.rxid.toString(), map.rxa, map.rxn);

		if (isNSFW(NSFWList, hash, map.a) || isNSFW(NSFWList, rxhash, map.rxa)) {
			// No author or name
			//addToNSFWList(map.dbid, map.a, map.n);
			addToNSFWList(map.dbid);
		}
	}
}

function blurLobby() {
	if (settings.HIDE_GAME_ON_NSFW) {
		document.getElementById("newbonkgamecontainer").classList.add("disableMapthumbBig");
		document.getElementById("gamerenderer").classList.add("fullyTransparent");
	}

	if (settings.HIDE_MAPS_FROM_MAP_SELECTOR) {
		document.getElementById("newbonklobby_mappreviewcontainer").style.display = "none";
	}
	else {
		document.getElementById("newbonklobby_settingsbox").classList.add("blurNSFW");
		document.getElementById("newbonklobby_votewindow_thumbcontainer").classList.add("blurNSFW");
		document.getElementById("newbonklobby_votewindow").classList.add("blurNSFW");
		if (settings.UNBLUR_MAP_ON_MOUSE_HOVER) {
			document.getElementById("newbonklobby_settingsbox").classList.add("hoverUnblurNSFW");
		}
		if (settings.BLUR_ONLY_MAP_PREVIEW) {
			document.getElementById("newbonklobby_maptext").style.filter = "";
			document.getElementById("newbonklobby_mapauthortext").style.filter = "";
			document.getElementById("newbonklobby_votewindow_maptitle").style.filter = "";
			document.getElementById("newbonklobby_votewindow_mapauthor").style.filter = "";
		}
	}
}

function unblurLobby() {
	document.getElementById("newbonkgamecontainer").classList.remove("disableMapthumbBig");
	document.getElementById("newbonklobby_settingsbox").classList.remove("blurNSFW", "hoverUnblurNSFW");

	document.getElementById("newbonklobby_votewindow_thumbcontainer").classList.remove("blurNSFW");
	document.getElementById("newbonklobby_votewindow").classList.remove("blurNSFW");

	document.getElementById("gamerenderer").classList.remove("fullyTransparent");
	document.getElementById("newbonklobby_mappreviewcontainer").style.display = "";
	document.getElementById("newbonklobby_maptext").style.filter = "";
	document.getElementById("newbonklobby_mapauthortext").style.filter = "";
}

async function handleLobbyMap(map) {
	const NSFWList = await getNSFWList();

	const hash = await getHash(map.dbid.toString(), map.a, map.n);

	if (isNSFW(NSFWList, hash, map.a)) {
		addToNSFWList(map.dbid, map.a, map.n);
	}
	else if (settings.INCLUDE_REMIXES_OF_NSFW_MAPS) {
		if (map.rxid > 0) {
			const rxhash = await getHash(map.rxid.toString(), map.rxa, map.rxn);

			if (isNSFW(NSFWList, rxhash, map.rxa)) {
				addToNSFWList(map.dbid, map.a, map.n);
			}
		}
	}

	if (getFromNSFWList(map.dbid, map.a, map.n)) {
		blurLobby();
	}
	else {
		unblurLobby();
	}
}

function injector(str) {
	let newStr = str;

	const menuRegex = newStr.match(/== 13\){...\(\);}}/)[0];
	newStr = newStr.replace(menuRegex, menuRegex + "window.NSFWFilter.menuFunctions = this; window.NSFWFilter.wrap();");
	const toolRegex = newStr.match(/=new [A-Za-z0-9\$_]{1,3}\(this,[A-Za-z0-9\$_]{1,3}\[0\]\[0\],[A-Za-z0-9\$_]{1,3}\[0\]\[1\]\);/);
	newStr = newStr.replace(toolRegex, toolRegex + "window.NSFWFilter.toolFunctions = this;");
	const replayRegex = newStr.match(/if\(([A-Za-z0-9\$_]{1,3}\[[0-9]+\])[^\)]+? < 5 \|\| [^\)]+? > 30\)/);
	newStr = newStr.replace(replayRegex[0], `{
		window.NSFWFilter.checkReplay(${replayRegex[1]}.startingState.mm);
	}` + replayRegex[0]);

	global.injected = true;

	return newStr;
}

if (!window.bonkCodeInjectors) window.bonkCodeInjectors = [];

window.bonkCodeInjectors.push(bonkCode => {
	try {
		return injector(bonkCode);
	}
	catch (e) {
		if (settings.DISABLE_INJECTION_FAIL_WARNING) return;
		throw e;
	}
});

if (window.bonkHUD) {
	const createLabel = text => {
		const label = document.createElement("label");
		label.classList.add("bonkhud-settings-label");
		label.innerHTML = text;
		label.style.marginRight = "5px";
		label.style.display = "inline-block";
		label.style.verticalAlign = "middle";
		return label;
	}

	const addTextarea = (target, name, variable) => {
		const label = createLabel(name);
		label.style.verticalAlign = "top";

		const input = document.createElement("textarea");
		input.rows = settings[variable].length + 5;
		input.oninput = () => {
			settings[variable] = input.value.split(/[\n,]/).map(a => a.trim());
			window.bonkHUD.saveModSetting(ind, settings);
		}

		input.value = settings[variable].join("\n");

		const container = document.createElement("div");
		container.id = "nsfw_settings_" + variable;
		container.appendChild(label);
		container.appendChild(input);

		target.appendChild(container);
	}

	const addCheckbox = (target, name, variable) => {
		const label = createLabel(name);

		const checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.style.display = "inline-block";
		checkbox.style.verticalAlign = "middle";
		checkbox.checked = settings[variable];

		checkbox.oninput = () => {
			settings[variable] = checkbox.checked;
			window.bonkHUD.saveModSetting(ind, settings);
		}

		const container = document.createElement("div");
		container.id = "nsfw_settings_" + variable;
		container.appendChild(label);
		container.appendChild(checkbox);

		target.appendChild(container);
	}

	let nsfwSettings = window.bonkHUD.generateSection();
	guiSettings.settingsContent = nsfwSettings;

	const ind = window.bonkHUD.createMod("NSFW Filter", guiSettings);

	if (window.bonkHUD.getModSetting(ind) != null) {
		const savedSettings = window.bonkHUD.getModSetting(ind);
		for (const setting of Object.keys(savedSettings)) {
			settings[setting] = savedSettings[setting];
		}
	}

	addCheckbox(nsfwSettings, "Hide NSFW replays",                "HIDE_NSFW_REPLAYS");
	addCheckbox(nsfwSettings, "Hide all replays",                 "DISABLE_REPLAYS");
	addCheckbox(nsfwSettings, "Hide NSFW maps from map selector", "HIDE_MAPS_FROM_MAP_SELECTOR");
	addCheckbox(nsfwSettings, "Black out nsfw while in game",     "HIDE_GAME_ON_NSFW");
	addCheckbox(nsfwSettings, "Blur only map preview",            "BLUR_ONLY_MAP_PREVIEW");
	addCheckbox(nsfwSettings, "Unblur on mouse hover",            "UNBLUR_MAP_ON_MOUSE_HOVER");
	addCheckbox(nsfwSettings, "Include remixes",                  "INCLUDE_REMIXES_OF_NSFW_MAPS");
	addCheckbox(nsfwSettings, "Disable injection fail warning",   "DISABLE_INJECTION_FAIL_WARNING");

	addTextarea(nsfwSettings, "Author blocklist<br />(separate users with a comma or a newline)", "AUTHOR_BLOCKLIST")

	const clearCache = document.createElement("button");
	clearCache.textContent = "Clear Cache";
	clearCache.onclick = () => {
		global.cacheTime = 0;
		global.NSFWList = [];
		global.NSFWMaps = new Set();
	}
	nsfwSettings.appendChild(clearCache);

	window.bonkHUD.updateStyleSettings();
}