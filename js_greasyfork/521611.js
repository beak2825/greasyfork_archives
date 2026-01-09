// ==UserScript==
// @name        Shell Shockers | FPS & Ping Controller
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

// @version     3.5
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
// @downloadURL https://update.greasyfork.org/scripts/521611/Shell%20Shockers%20%7C%20FPS%20%20Ping%20Controller.user.js
// @updateURL https://update.greasyfork.org/scripts/521611/Shell%20Shockers%20%7C%20FPS%20%20Ping%20Controller.meta.js
// ==/UserScript==
// (function () {
// 	const consoleMethods = ["log", "warn", "info", "error", "exception", "table", "trace"];
// 	const _innerConsole = console;

// 	consoleMethods.forEach((method) => {
// 		if (window.console[method]) {
// 			Object.defineProperty(window.console, method, {
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

	let tp = {
		hideFPS: {
			hide: JSON.parse(localStorage.getItem("tp-hideFPS")) || false,
			min: JSON.parse(localStorage.getItem("tp-minFPS")) || 20,
			max: JSON.parse(localStorage.getItem("tp-maxFPS")) || 200,
			random: JSON.parse(localStorage.getItem("tp-randomFPS")) || false,
		},
        ping: {
            min: JSON.parse(localStorage.getItem("tp-minPing")) || 20,
			max: JSON.parse(localStorage.getItem("tp-maxPing")) || 200,
            random: JSON.parse(localStorage.getItem("tp-randomPing")) || false,
        }
	};

	function hideFPS(value) {
		let fpsCounter = document.querySelector("#FPS");
		if (value) {
			if (fpsCounter) {
				fpsCounter.style.display = "none";
			}
		} else {
			fpsCounter.style.display = "block";
		}
	}

	function randomise(min, max, active) {
		if (active) {
			const randomFPS = Math.floor(Math.random() * (max - min + 1)) + min;

			let fpsCounter = document.querySelector("#FPS");
			if (fpsCounter) {
				fpsCounter.textContent = randomFPS;
			}
		}
	}

	const makeDraggable = function (element, notMenu) {
		if (element) {
			let offsetX, offsetY;
			element.addEventListener("mousedown", function (e) {
				const dragElement = function (e) {
					const x = ((e.clientX - offsetX) / window.innerWidth) * 100;
					const y = ((e.clientY - offsetY) / window.innerHeight) * 100;
					const maxX = 100 - (element.offsetWidth / window.innerWidth) * 100;
					const maxY = 100 - (element.offsetHeight / window.innerHeight) * 100;
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
		window[funcName] = func;
		window[funcName] = function () {
			try {
				return func.apply(this, arguments);
			} catch (error) {
				log("Error in anonymous function:", error);
			}
		};

		F[name] = window[funcName];
		functionNames[name] = funcName;
	};

	const injectScript = function () {
		createAnonFunction("retrieveFunctions", function (vars) {
			ss = vars;
			window.globalSS = ss;

			F.HIDEFPS();
		});

		createAnonFunction("HIDEFPS", function () {
			ss.PLAYERS.forEach((PLAYER) => {
				if (PLAYER.hasOwnProperty("ws")) {
					ss.MYPLAYER = PLAYER;
				}
			});

			H.actor = findKeyWithProperty(ss.MYPLAYER, H.mesh);
		});

        createAnonFunction('FakePing', function(original) {
            if (tp.ping.random) {
                const randomPing = Math.floor(Math.random() * (tp.ping.max - tp.ping.min + 1)) + tp.ping.min;
                return randomPing;
            } else {
                return Date.now() - original;
            }
        });
        createAnonFunction('FakeFps', function(original) {
            if (tp.hideFPS.hide) return '';
            if (tp.hideFPS.random) {
                const randomPing = Math.floor(Math.random() * (tp.hideFPS.max - tp.hideFPS.min + 1)) + tp.hideFPS.min;
                return randomPing;
            } else {
                return original;
            }
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

		const proto = window.HTMLScriptElement.prototype;
		const existing = Object.getOwnPropertyDescriptor(proto, "textContent");

		const original = existing || Object.getOwnPropertyDescriptor(window.Node.prototype, "textContent");

		Object.defineProperty(proto, "textContent", {
			get: function () {
				// if (this === window.document.currentScript) {
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

			const patterns = {
				scope: /,this\.(..)\.position\.z=2/,
                ping: /(case [A-Za-z$_]+\.[A-Za-z$_]+\:[A-Za-z$_]+\=)Date\.now\(\)-([A-Za-z$_]+),/,
                fps: /(document\.getElementById\("FPS"\)\.innerText=)(.*?)}/,
			};

			const scopeVar = patterns.scope.exec(js)[1];
			H.extra = {
				scope: scopeVar,
                ping: patterns.ping.exec(js),
                fps: patterns.fps.exec(js),
			};
			window.H = H;

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
				// modifyJS(
				// 	f(H.SCENE) + "." + f(H.render),
				// 	`window["${functionNames.retrieveFunctions}"]({${injectionString}},true)||${f(H.SCENE)}.render`
				// );
                modifyJS(H.extra.ping[0],
                    `${H.extra.ping[1]}window.${functionNames.FakePing}(${H.extra.ping[2]}),`
                );
                modifyJS(H.extra.fps[0],
                    `${H.extra.fps[1]}window.${functionNames.FakeFps}(${H.extra.fps[2]})}`
                )



				log(H, "last");
				return js;
			} catch (e) {
				console.log(e);
			}
		};
	};
	// injectScript();
	startUp();

	const Tweakpane = window.Tweakpane;
	const pane = new Tweakpane.Pane({
		title: "Hide FPS",
		expanded: true,
	});
	const paneEl = document.querySelector("div.tp-dfwv");
	paneEl.style.zIndex = 1000;
	paneEl.style.width = "300px";

    function createFolders(NFolder) {
		let test = pane.addFolder({
			title: NFolder,
			expanded: false,
		});
		return test;
	}

    const fpsFolder = createFolders("FPS Settings");
    const pingFolder = createFolders("Ping Settings");

	function createInput(folder, obj, property, options, callback) {
		folder.addInput(obj, property, options).on("change", callback);
	}

	makeDraggable(document.querySelector(".tp-dfwv"));

	createInput(fpsFolder, tp.hideFPS, "hide", { label: "Hide FPS" }, (value) => {
		localStorage.setItem("tp-hideFPS", JSON.stringify(value.value));
	});
	createInput(fpsFolder, tp.hideFPS, "random", { label: "Randomise FPS" }, (value) => {
		localStorage.setItem("tp-randomFPS", JSON.stringify(value.value));
	});
	createInput(fpsFolder, tp.hideFPS, "min", { label: "Min FPS", view: "slider", min: 1, max: 999, step: 1 }, (value) => {
		localStorage.setItem("tp-minFPS", JSON.stringify(value.value));
	});
	createInput(fpsFolder, tp.hideFPS, "max", { label: "Max FPS", view: "slider", min: 1, max: 999, step: 1 }, (value) => {
		localStorage.setItem("tp-maxFPS", JSON.stringify(value.value));
	});

    createInput(pingFolder, tp.ping, "min", { label: "Min Ping", view: "slider", min: 1, max: 999, step: 1 }, (value) => {
		localStorage.setItem("tp-minPing", JSON.stringify(value.value));
	});
    createInput(pingFolder, tp.ping, "max", { label: "Max Ping", view: "slider", min: 1, max: 999, step: 1 }, (value) => {
		localStorage.setItem("tp-maxPing", JSON.stringify(value.value));
	});
    createInput(pingFolder, tp.ping, "random", { label: "Randomise Ping" }, (value) => {
		localStorage.setItem("tp-randomPing", JSON.stringify(value.value));
	});


	document.addEventListener("keydown", (e) => {
		if (e.key === "h") {
			const element = document.querySelector(".tp-dfwv");
			element.style.display = element.style.display === "none" ? "block" : "none";
		}
	});
})();
