// ==UserScript==
// @name        Shell Shockers | Disable Scope Lines for CS
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

// @version     2.5
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
// @downloadURL https://update.greasyfork.org/scripts/524386/Shell%20Shockers%20%7C%20Disable%20Scope%20Lines%20for%20CS.user.js
// @updateURL https://update.greasyfork.org/scripts/524386/Shell%20Shockers%20%7C%20Disable%20Scope%20Lines%20for%20CS.meta.js
// ==/UserScript==
(function () {
	let noPointerPause;
	const clientKeysURL = `https://js.getstate.farm/vardata/`;
	let ss;
	let F = [];
	let H = {};
	let functionNames = [];
	let keyRetrieved = false;

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
			});

			H.actor = findKeyWithProperty(unsafeWindow.globalSS.MYPLAYER, H.mesh);
		});

		let _apc = HTMLElement.prototype.appendChild;

        HTMLElement.prototype.appendChild = function(node) {
          if (node.tagName === 'SCRIPT' && node.innerHTML && node.innerHTML.startsWith('(()=>{')) {
              node.innerHTML = applyScript(node.innerHTML);
          }
          return _apc.call(this, node);
        }

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
            };

			const scopeVar = patterns.scope.exec(js)[1];
			H.extra = {
				scope: scopeVar,
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

				modifyJS(
					`this.${scopeVar}.applyFog=!1,this.${scopeVar}.layerMask=536870912,`,
					`this.${scopeVar}.applyFog=!1,this.${scopeVar}.layerMask=0,`
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
})();
