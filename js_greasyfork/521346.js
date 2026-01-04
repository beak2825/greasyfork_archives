// ==UserScript==
// @name        Shell Shockers | Sound Hacks
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_info
// @grant        GM_setClipboard
// @grant        GM_openInTab
//
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.deleteValue
// @grant        GM.listValues
// @grant        GM.info
// @grant        GM.setClipboard
// @grant        GM.openInTab

// @version     2.6
// @author      wish?
// @description 9/30/2024, 9:45:17 PM

// @match        *://*.shellshock.io/*
// @match        *://*.shell.onlypuppy7.online/*
// @match        *://*.algebra.best/*
// @match        *://*.algebra.vip/*
// @match        *://*.biologyclass.club/*
// @match        *://*.deadlyegg.com/*
// @match        *://*.deathegg.world/*
// @match        *://*.eggboy.club/*
// @match        *://*.eggboy.xyz/*
// @match        *://*.eggcombat.com/*
// @match        *://*.egg.dance/*
// @match        *://*.eggfacts.fun/*
// @match        *://*.egghead.institute/*
// @match        *://*.eggisthenewblack.com/*
// @match        *://*.eggsarecool.com/*
// @match        *://*.geometry.best/*
// @match        *://*.geometry.monster/*
// @match        *://*.geometry.pw/*
// @match        *://*.geometry.report/*
// @match        *://*.hardboiled.life/*
// @match        *://*.hardshell.life/*
// @match        *://*.humanorganising.org/*
// @match        *://*.mathactivity.xyz/*
// @match        *://*.mathactivity.club/*
// @match        *://*.mathdrills.info/*
// @match        *://*.mathdrills.life/*
// @match        *://*.mathfun.rocks/*
// @match        *://*.mathgames.world/*
// @match        *://*.math.international/*
// @match        *://*.mathlete.fun/*
// @match        *://*.mathlete.pro/*
// @match        *://*.overeasy.club/*
// @match        *://*.risenegg.com/*
// @match        *://*.scrambled.tech/*
// @match        *://*.scrambled.today/*
// @match        *://*.scrambled.us/*
// @match        *://*.scrambled.world/*
// @match        *://*.shellshockers.club/*
// @match        *://*.shellshockers.life/*
// @match        *://*.shellshockers.site/*
// @match        *://*.shellshockers.us/*
// @match        *://*.shellshockers.world/*
// @match        *://*.shellshockers.xyz/*
// @match        *://*.shellsocks.com/*
// @match        *://*.softboiled.club/*
// @match        *://*.urbanegger.com/*
// @match        *://*.violentegg.club/*
// @match        *://*.violentegg.fun/*
// @match        *://*.yolk.best/*
// @match        *://*.yolk.life/*
// @match        *://*.yolk.rocks/*
// @match        *://*.yolk.tech/*
// @match        *://*.yolk.quest/*
// @match        *://*.yolk.today/*
// @match        *://*.zygote.cafe/*
// @match        *://*.shellshockers.best/*
// @match        *://*.eggboy.me/*
// @grant        none
// @run-at       document-start
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @require     https://cdn.jsdelivr.net/npm/tweakpane@3.1.10/dist/tweakpane.min.js
// @require      https://cdn.jsdelivr.net/npm/@tweakpane/plugin-essentials@0.1.8/dist/tweakpane-plugin-essentials.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
//
// @license MIT
// @namespace https://greasyfork.org/users/1361048
// @downloadURL https://update.greasyfork.org/scripts/521346/Shell%20Shockers%20%7C%20Sound%20Hacks.user.js
// @updateURL https://update.greasyfork.org/scripts/521346/Shell%20Shockers%20%7C%20Sound%20Hacks.meta.js
// ==/UserScript==
// (function () {
// 	const consoleMethods = ["log", "warn", "info", "error", "exception", "table", "trace"];
// 	const _innerConsole = console;

// 	consoleMethods.forEach((method) => {
// 		if (unsafeWindow.console[method]) {
// 			Object.defineProperty(unsafeWindow.console, method, {
// 				configurable: false,
// 				get: (...args) => {
// 					return _innerConsole[method].bind(_innerConsole);
// 				},
// 				set: () => {},
// 			});
// 		}
// 	});
// })();
(function () {
	let noPointerPause;
	const clientKeysURL = `https://raw.githubusercontent.com/StateFarmNetwork/client-keys/refs/heads/main/statefarm_`;
	let ss;
	let F = [];
	let H = {};
	let functionNames = [];
	let keyRetrieved = false;

	const tp = {
		soundsFolder: {
			crackshot: "default",
			"egg-k": "default",
			scrambler: "default",
			"free-ranger": "default",
			rpegg: "default",
			whipper: "default",
			"tri-hard": "default",
			pistol: "default",
		},
		meleeSounds: {
			melee: "default",
		},
		bindsFolder: {
			hidePanel: localStorage.getItem("tp-hidePanel") || "h",
			refreshSounds: localStorage.getItem("tp-refreshSounds") || "g",
		},
	};

	function refreshSounds() {
		updatedNeeded = true; // this updates the weapons

		keyRetrieved = false; // this will grab the key necessary
	}

	let updatedNeeded = false;

	const patterns = {
		sound: /"sound\/sounds\.json\?"\+(..)/,
		scope: /,this\.(..)\.position\.z=2/,
		teamColors: /([A-Za-z]+)=\{text:\["#fff100","#00ffff","#f53e40"\]/g,
		killsText: /(.)\=\'\<span style.*?;/,
		lastDmg: /\([A-Za-z$_]\.lastDmgType\=([A-Za-z$_]).*?{/,
		weapon: /this\.([a-zA-Z0-9_$]+)\=\"gun\_/,
	};

	const startUp = function () {
		console.log("startup");
		injectScript();
		console.log("after startup");
	};

	let originalReplace = String.prototype.replace;
	let originalReplaceAll = String.prototype.replaceAll;

	String.prototype.originalReplace = function () {
		return originalReplace.apply(this, arguments);
	};
	String.prototype.originalReplaceAll = function () {
		return originalReplaceAll.apply(this, arguments);
	};

	const log = function (...args) {
		let condition;
		try {
			condition = false;
		} catch (error) {
			condition = GM_getValue(storageKey + "DisableLogs");
		}
		if (!condition) {
			console.log(...args);
		}
	};

	const fetchTextContent = function (url) {
		try {
			var xhr = new XMLHttpRequest();
			xhr.open("GET", url, false);
			xhr.send();
			if (xhr.status === 200) {
				return xhr.responseText;
			} else {
				console.error("Error fetching " + url);
				return null;
			}
		} catch (err) {
			return null;
		}
	};
	const findKeyWithProperty = function (obj, propertyToFind) {
		for (const key in obj) {
			if (obj[key] === null || obj[key] === undefined) {
				continue;
			}
			if (!!obj[key] && (typeof obj[key] == "object" || typeof obj[key] == "function") && obj[key].hasOwnProperty(propertyToFind)) {
				return key;
			}
		}
		// Property not found
		return null;
	};
	const getScrambled = () => Array.from({ length: 10 }, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join("");
	const createAnonFunction = function (name, func) {
		const funcName = getScrambled();
		unsafeWindow[funcName] = func;
		unsafeWindow[funcName] = function () {
			try {
				return func.apply(this, arguments);
			} catch (error) {
				log("Error in anonymous function:", error);
			}
		};

		F[name] = unsafeWindow[funcName];
		functionNames[name] = funcName;
	};

	const injectScript = function () {
		createAnonFunction("retrieveFunctions", function (vars) {
			// console.log(vars)
			ss = vars;
			unsafeWindow.globalSS = vars;
			// console.log("lmao");

			F.customSounds();
		});

		createAnonFunction("customSounds", function () {
			unsafeWindow.globalSS.PLAYERS.forEach((PLAYER) => {
				let H = unsafeWindow.H;
				if (PLAYER.hasOwnProperty("ws")) {
					unsafeWindow.globalSS.MYPLAYER = PLAYER;
				}
				if (unsafeWindow.globalSS.MYPLAYER) {
					let myWeapon = unsafeWindow.globalSS.MYPLAYER.weapons[0][H.actor][H.extra.weapon];
					let changeSound = unsafeWindow.globalSS.MYPLAYER.weapons[0][H.actor];

					if (updatedNeeded) {
						if (myWeapon === "gun_m24") {
							changeSound.fireSound = `gun_m24_${tp.soundsFolder["crackshot"]}`;
							// console.log("inside the if block", changeSound);
						}
						if (myWeapon === "gun_eggk47") {
							changeSound.fireSound = `gun_eggk47_${tp.soundsFolder["egg-k"]}`;
						}
						if (myWeapon === "gun_dozenGauge") {
							changeSound.fireSound = `gun_dozenGauge_${tp.soundsFolder["scrambler"]}`;
						}
						if (myWeapon === "gun_csg1") {
							changeSound.fireSound = `gun_csg1_${tp.soundsFolder["free-ranger"]}`;
						}
						if (myWeapon === "gun_rpegg") {
							changeSound.fireSound = `gun_rpegg_${tp.soundsFolder["rpegg"]}`;
						}
						if (myWeapon === "gun_smg") {
							changeSound.fireSound = `gun_smg_${tp.soundsFolder["whipper"]}`;
						}
						if (myWeapon === "gun_aug") {
							changeSound.fireSound = `gun_aug_${tp.soundsFolder["tri-hard"]}`;
						}
						// console.log(changeSound)

						// MELEE
						unsafeWindow.globalSS.MYPLAYER.meleeWeapon[H.actor].swingSounds = tp.meleeSounds["melee"];

						// PISTOL
						unsafeWindow.globalSS.MYPLAYER.weapons[1][H.actor].fireSound = `gun_cluck9mm_${tp.soundsFolder["pistol"]}`;
						updatedNeeded = false;
					}
				}
			});

			H.actor = findKeyWithProperty(unsafeWindow.globalSS.MYPLAYER, H.mesh);
		});

		let _apc = HTMLElement.prototype.appendChild;
		let shellshock_og = null;

		HTMLElement.prototype.appendChild = function (node) {
			if (node.tagName === "SCRIPT" && node.innerHTML && node.innerHTML.startsWith("(()=>{")) {
				shellshock_og = node.innerHTML;
				node.innerHTML = applyScript(node.innerHTML);
			}
			return _apc.call(this, node);
		};

		const proto = unsafeWindow.HTMLScriptElement.prototype;
		const existing = Object.getOwnPropertyDescriptor(proto, "textContent");

		const original = existing || Object.getOwnPropertyDescriptor(unsafeWindow.Node.prototype, "textContent");

		Object.defineProperty(proto, "textContent", {
			get: function () {
				// if (this === unsafeWindow.document.currentScript) {
				//     prompt("[Hook] document.currentScript.textContent accessed");
				//     debugger; // <-- triggers breakpoint
				// };
				let textContent = original.get.call(this);
				if (textContent && textContent.startsWith("(()=>{")) {
					return shellshock_og;
				} else {
					return textContent;
				}
			},
			set: original.set,
			configurable: true,
			enumerable: true,
		});

		function sha256(str) {
			const utf8 = new TextEncoder().encode(str);
			const k = Uint32Array.of(
				0x428a2f98,
				0x71374491,
				0xb5c0fbcf,
				0xe9b5dba5,
				0x3956c25b,
				0x59f111f1,
				0x923f82a4,
				0xab1c5ed5,
				0xd807aa98,
				0x12835b01,
				0x243185be,
				0x550c7dc3,
				0x72be5d74,
				0x80deb1fe,
				0x9bdc06a7,
				0xc19bf174,
				0xe49b69c1,
				0xefbe4786,
				0x0fc19dc6,
				0x240ca1cc,
				0x2de92c6f,
				0x4a7484aa,
				0x5cb0a9dc,
				0x76f988da,
				0x983e5152,
				0xa831c66d,
				0xb00327c8,
				0xbf597fc7,
				0xc6e00bf3,
				0xd5a79147,
				0x06ca6351,
				0x14292967,
				0x27b70a85,
				0x2e1b2138,
				0x4d2c6dfc,
				0x53380d13,
				0x650a7354,
				0x766a0abb,
				0x81c2c92e,
				0x92722c85,
				0xa2bfe8a1,
				0xa81a664b,
				0xc24b8b70,
				0xc76c51a3,
				0xd192e819,
				0xd6990624,
				0xf40e3585,
				0x106aa070,
				0x19a4c116,
				0x1e376c08,
				0x2748774c,
				0x34b0bcb5,
				0x391c0cb3,
				0x4ed8aa4a,
				0x5b9cca4f,
				0x682e6ff3,
				0x748f82ee,
				0x78a5636f,
				0x84c87814,
				0x8cc70208,
				0x90befffa,
				0xa4506ceb,
				0xbef9a3f7,
				0xc67178f2
			);
			let h = Uint32Array.of(0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19);

			const pad = new Uint8Array(((utf8.length + 9) & ~63) + 64);
			pad.set(utf8), (pad[utf8.length] = 0x80);
			new DataView(pad.buffer).setUint32(pad.length - 4, utf8.length << 3, false);

			let w = new Uint32Array(64),
				v,
				i,
				j,
				a,
				b,
				c,
				d,
				e,
				f,
				g,
				h0,
				S0,
				S1,
				ch,
				maj,
				temp1,
				temp2;
			for (i = 0; i < pad.length; i += 64) {
				v = new DataView(pad.buffer, i, 64);
				for (j = 0; j < 16; j++) w[j] = v.getUint32(j << 2, false);
				for (; j < 64; j++)
					w[j] =
						(w[j - 16] +
							((w[j - 15] >>> 7) ^ (w[j - 15] << 25) ^ (w[j - 15] >>> 18) ^ (w[j - 15] << 14) ^ (w[j - 15] >>> 3)) +
							w[j - 7] +
							((w[j - 2] >>> 17) ^ (w[j - 2] << 15) ^ (w[j - 2] >>> 19) ^ (w[j - 2] << 13) ^ (w[j - 2] >>> 10))) >>>
						0;

				[a, b, c, d, e, f, g, h0] = h;
				for (j = 0; j < 64; j++) {
					S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
					ch = (e & f) ^ (~e & g);
					temp1 = (h0 + S1 + ch + k[j] + w[j]) >>> 0;
					S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
					maj = (a & b) ^ (a & c) ^ (b & c);
					temp2 = (S0 + maj) >>> 0;
					(h0 = g), (g = f), (f = e), (e = (d + temp1) >>> 0), (d = c), (c = b), (b = a), (a = (temp1 + temp2) >>> 0);
				}
				(h[0] += a), (h[1] += b), (h[2] += c), (h[3] += d), (h[4] += e), (h[5] += f), (h[6] += g), (h[7] += h0);
			}
			// console.log(str);

			return h.reduce((s, x) => s + x.toString(16).padStart(8, "0"), "");
		}

		const applyScript = function (js) {
			let match;
			let clientKeys;

			let originalJS = fetchTextContent("/js/shellshock.js");

			const getVardata = function (hash) {
				return fetchTextContent(clientKeysURL + "latest.json?v=" + Date.now());
			};

			let hash = sha256(originalJS);
			// console.log(hash);
			let onlineClientKeys = getVardata(hash);

			try {
				clientKeys = JSON.parse(onlineClientKeys);
			} catch (e) {
				console.error(e);
			}

			let H = clientKeys.vars;
			let C = clientKeys.commCodes?.codes;

			const soundVar = patterns.sound.exec(js)[1];
			const scopeVar = patterns.scope.exec(js)[1];
			H.extra = {
				sound: soundVar,
				scope: scopeVar,
				teamColors: patterns.teamColors.exec(js)[1],
				killsText: patterns.killsText.exec(js),
				lastDmg: patterns.lastDmg.exec(js),
				weapon: patterns.weapon.exec(js)[1],
			};
			unsafeWindow.H = H;

			let injectionString = "";

			try {
				//SERVERSYNC
				match = new RegExp(`function serverSync\\(\\)\\{(.*?)\\)\\}`).exec(js);
				log("SERVERSYNC:", match);
				H.SERVERSYNC = match ? match[1].replace(/[a-zA-Z$_\.\[\]]+shots/, 0) + ")" : "function(){log('no serversync womp womp')}";
				//PAUSE
				match = new RegExp(`,setTimeout\\(\\(\\(\\)=>\\{([=A-z0-9\\(\\),\\{ \\.;!\\|\\?:\\}]+send\\([a-zA-Z$_]+\\))`).exec(js);
				log("PAUSE:", match);
				H.PAUSE = match ? `function(){${match[1]}}` : "function(){log('no pause womp womp')}";

				const variableNameRegex = /^[a-zA-Z0-9_$\[\]"\\\.,]*$/;
				console.log(H);
				for (let name in H) {
					let deobf = H[name];
					if (name == "SERVERSYNC" || name == "PAUSE" || variableNameRegex.test(deobf)) {
						//serversync should only be defined just before...
						injectionString = `${injectionString}${name}:  (() => { let variable = "value_undefined"; try { eval("variable = ${deobf};"); } catch (error) { return "value_undefined"; }; return variable; })(),`;
					} else {
					}
				}
				console.log(injectionString);

				log("%cSTATEFARM INJECTION STAGE 1: GATHER VARS", "color: yellow; font-weight: bold; font-size: 1.2em; text-decoration: underline;");

				const modifyJS = function (find, replace) {
					let oldJS = js;
					try {
						js = js.originalReplaceAll(find, replace);
					} catch (err) {
						console.log(
							"%cReplacement failed! Likely a required var was not found. Attempted to replace " + find + " with: " + replace,
							"color: red; font-weight: bold; font-size: 0.6em; text-decoration: italic;"
						);
					}
					if (oldJS !== js) {
						console.log(
							"%cReplacement successful! Injected code: replaced: " + find + " with: " + replace,
							"color: green; font-weight: bold; font-size: 0.6em; text-decoration: italic;"
						);
					} else {
						console.log(
							"%cReplacement failed! Attempted to replace " + find + " with: " + replace,
							"color: red; font-weight: bold; font-size: 0.6em; text-decoration: italic;"
						);
					}
				};

				const f = function (varName) {
					return varName.replace("$", "\\$");
				};
				const FUNCTIONPARAM = new RegExp("function " + f(H._connectFail) + "\\(([a-zA-Z$_]+)\\)").exec(js)[1];
				modifyJS(
					f(H.SCENE) + "." + f(H.render),
					`window["${functionNames.retrieveFunctions}"]({${injectionString}},true)||${f(H.SCENE)}.render`
				);

				log(H, "last");
				return js;
			} catch (e) {
				console.log(e);
			}
		};
	};
	// injectScript();
	startUp();

	function waitForElement(selector) {
		return new Promise((resolve) => {
			const intervalId = setInterval(() => {
				const element = document.querySelector(selector);
				if (element) {
					clearInterval(intervalId);
					resolve(element);
				}
			}, 100);
		});
	}


	function createFolders(NFolder) {
		let test = pane.addFolder({
			title: NFolder,
			expanded: false,
		});
		return test;
	}

	function addInputWithValidation(folder, obj, property, label) {
		folder.addInput(obj, property, { label: label }).on("change", (value) => {
			if (value.value.length > 1) {
				value.value = "Enter toggle";
				value.target.controller_.binding.value.rawValue_ = "Enter toggle";
				unsafeWindow.alert("Please enter a single key");
			} else {
				const store = value.value.replace(/"/g, "");
				localStorage.setItem(`tp-${property}`, store);
			}
		});
	}

	const makeDraggable = function (element, notMenu) {
		if (element) {
			let offsetX, offsetY;
			element.addEventListener("mousedown", function (e) {
				const dragElement = function (e) {
					const x = ((e.clientX - offsetX) / unsafeWindow.innerWidth) * 100;
					const y = ((e.clientY - offsetY) / unsafeWindow.innerHeight) * 100;
					const maxX = 100 - (element.offsetWidth / unsafeWindow.innerWidth) * 100;
					const maxY = 100 - (element.offsetHeight / unsafeWindow.innerHeight) * 100;
					element.style.left = `${Math.max(0, Math.min(x, maxX))}%`;
					element.style.top = `${Math.max(0, Math.min(y, maxY))}%`;
				};
				if (notMenu || e.target.classList.contains("tp-rotv_t")) {
					offsetX = e.clientX - element.getBoundingClientRect().left;
					offsetY = e.clientY - element.getBoundingClientRect().top;
					document.addEventListener("mousemove", dragElement);
					document.addEventListener("mouseup", function () {
						document.removeEventListener("mousemove", dragElement);
					});
					e.preventDefault(); // Prevent text selection during drag
				}
			});
		}
	};


	//TWEAKPANE CODE
	const Tweakpane = window.Tweakpane;
	const pane = new Tweakpane.Pane({
		title: "WISH",
		expanded: true,
	});
	const paneEl = document.querySelector("div.tp-dfwv");
	paneEl.style.zIndex = 100000;
	paneEl.style.width = "300px";
	makeDraggable(document.querySelector(".tp-dfwv"));

	//FUNCTION TO CREATE FOLDERS
	function createFolders(NFolder) {
		let test = pane.addFolder({
			title: NFolder,
			expanded: false,
		});
		return test;
	}

	// CREATE FOLDERS
	const soundsFolder = createFolders("Sounds");
	const addSettings = createFolders("Additional Settings");
	const bindsFolder = createFolders("Binds");

	// ADD BLADES
	soundsFolder.addInput(tp.soundsFolder, "crackshot", {
		label: "Crackshot",
		options: {
			Default: "fire",
			Valkyrie: "Valkyrie_fire",
			Chess: "Chess_fire",
			Retro: "Retro_fire",
			BadEgg: "Badegg_fire",
			Cyborg: "Cyborg_fire",
			Fusion: "Fusion_fire",
			Techno: "Techno_fire",
			Infernal: "Infernal_fire",
			Quack: "Quackshot_fire",
			Scavenger: "Scavenger_fire",
			"8bit": "fire_m24_8bit",
			"Silenced (Fake)": "",
		},
	});

	soundsFolder.addInput(tp.soundsFolder, "egg-k", {
		label: "Egg-k",
		options: {
			Default: "fire",
			Alien: "Alien_fire",
			Retro: "Retro_fire",
			Fusion: "Fusion_fire",
			Techno: "Techno_fire",
			Infernal: "Infernal_fire",
			Steambot: "Steambot_fire",
			Valkyrie: "Valkyrie_fire",
			Chocolate: "Chocolate_fire",
			"Infernal-2": "Infernal2_fire",
		},
	});

	soundsFolder.addInput(tp.soundsFolder, "scrambler", {
		label: "Scrambler",
		options: {
			Default: "fire",
			Irish: "Irish_fire",
			Retro: "Retro_fire",
			Clouds: "Clouds_fire",
			Fusion: "Fusion_fire",
			Techno: "Techno_fire",
			Fantasy: "Fantasy_fire",
			Octopus: "Octopus_fire",
			Infernal: "Infernal_fire",
			Steambot: "Steambot_fire",
			Valkyrie: "Valkyrie_fire",
			Basketball: "Basketball_fire",
		},
	});

	soundsFolder.addInput(tp.soundsFolder, "free-ranger", {
		label: "Free-Ranger",
		options: {
			Default: "fire",
			Retro: "Retro_fire",
			Fusion: "Fusion_fire",
			Techno: "Techno_fire",
			Infernal: "Infernal_fire",
			"Space-Egg": "spaceEgg_fire",
			Steambot: "Steambot_fire",
			Valkyrie: "Valkyrie_fire",
			Shellpreme: "Shellpreme_fire",
			RubberChicken: "RubberChicken_fire",
		},
	});

	soundsFolder.addInput(tp.soundsFolder, "rpegg", {
		label: "Rpegg",
		options: {
			Default: "fire",
			Retro: "Retro_fire",
			Fusion: "Fusion_fire",
			Techno: "Techno_fire",
			Infernal: "Infernal_fire",
			Skeleton: "Skeleton_fire",
			Valkyrie: "Valkyrie_fire",
			Christmas: "Christmas_fire",
		},
	});

	soundsFolder.addInput(tp.soundsFolder, "whipper", {
		label: "Whipper",
		options: {
			Default: "fire",
			Retro: "Retro_fire",
			Fusion: "Fusion_fire",
			Techno: "Techno_fire",
			Pumpkin: "Pumpkin_fire",
			Infernal: "Infernal_fire",
			Valkyrie: "Valkyrie_fire",
			"Special-Turkey": "SpecialTurkey_fire",
		},
	});

	soundsFolder.addInput(tp.soundsFolder, "tri-hard", {
		label: "Tri-Hard",
		options: {
			Default: "fire",
			Cupid: "Cupid_fire",
			Fusion: "Fusion_fire",
			Retro: "Retro_fire",
			Infernal: "Infernal_fire",
			Techno: "Techno_fire_a",
			"Techno-B": "Techno_fire_b",
			Valkyrie: "Valkyrie_fire",
			Pumpkinpie: "Pumpkinpie_fire",
		},
	});

	soundsFolder.addInput(tp.meleeSounds, "melee", {
		label: "Melee",
		options: {
			Default: ["melee_whisk_a"],
			Carver: ["melee_carver"],
			Cup: ["melee_cup_a", "melee_cup_b"],
			Eggpan: ["melee_eggpan"],
			Elf: ["melee_elf_a", "melee_elf_b"],
			Fish: ["melee_gfish_a", "melee_gfish_b"],
			Harrison: ["melee_harrison"],
			Infernal: ["melee_infernal"],
			Keytar: ["melee_keytar"],
			Mayan: ["melee_mayan"],
			Nutcracker: ["melee_nutcracker"],
			Pickleball: ["melee_pickleball"],
			Plunger: ["melee_plunger"],
			"Proper-Fish (idk)": ["melee_properfish_a", "melee_properfish_b"],
			Retro: ["melee_retro"],
			Rock: ["melee_rock"],
			Steambot: ["melee_steambot"],
			Techno: ["melee_techno"],
			Valkyrie: ["melee_valkyrie"],
			Zombie: ["melee_zombie"],
		},
	});

	soundsFolder.addInput(tp.soundsFolder, "pistol", {
		label: "Pistol",
		options: {
			Default: "fire",
			Retro: "Retro_fire",
			Camera: "Camera_fire",
			Clouds: "Clouds_fire",
			Fusion: "Fusion_fire",
			Techno: "Techno_fire",
			Infernal: "Infernal_fire",
			"Space-Egg": "spaceEgg_fire",
			Steambot: "Steambot_fire",
			Valkyrie: "Valkyrie_fire",
			Megaphone: "Megaphone_fire",
			"Cubic-Castle": "CubicCastles_fire",
		},
	});

	function refreshSounds() {
		updatedNeeded = true; // this updates the weapons

		keyRetrieved = false; // this will grab the key necessary
	}

	soundsFolder.on("change", (value) => {
		// console.log('Selected sound:', value);
		// console.log(tp.soundsFolder);
		refreshSounds();
		// Handle the sound change logic here
		localStorage.setItem("customSounds", JSON.stringify(tp.soundsFolder));
	});

	addSettings
		.addButton({
			title: `Click if sounds didn\'t update`,
		})
		.on("click", () => {
			updatedNeeded = true;
			keyRetrieved = false;
		});

	// BINDS FOLDER
	function addInputWithValidation(folder, obj, property, label) {
		folder.addInput(obj, property, { label: label }).on("change", (value) => {
			if (value.value.length > 1) {
				value.value = "Enter toggle";
				value.target.controller_.binding.value.rawValue_ = "Enter toggle";
				window.alert("Please enter a single key");
			} else {
				const store = value.value.replace(/"/g, "");
				localStorage.setItem(`tp-${property}`, store);
			}
		});
	}
	addInputWithValidation(bindsFolder, tp.bindsFolder, "hidePanel", "Hide Panel");
	addInputWithValidation(bindsFolder, tp.bindsFolder, "refreshSounds", "Refresh Sounds");

	document.addEventListener("keydown", (e) => {
		if (e.key === tp.bindsFolder.hidePanel) {
			paneEl.style.display = paneEl.style.display === "block" ? "none" : "block";
		}
		if (e.key === tp.bindsFolder.refreshSounds) {
			refreshSounds();
		}
	});
})();
