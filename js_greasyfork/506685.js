// ==UserScript==
// @name        Shell Shockers | Ad Blocker
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
// @downloadURL https://update.greasyfork.org/scripts/506685/Shell%20Shockers%20%7C%20Ad%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/506685/Shell%20Shockers%20%7C%20Ad%20Blocker.meta.js
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
			if (
				!!obj[key] &&
				(typeof obj[key] == "object" || typeof obj[key] == "function") &&
				obj[key].hasOwnProperty(propertyToFind)
			) {
				return key;
			}
		}
		// Property not found
		return null;
	};
	const getScrambled = () =>
		Array.from({ length: 10 }, () =>
			String.fromCharCode(97 + Math.floor(Math.random() * 26))
		).join("");
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
			// console.log(vars)
			ss = vars;
			window.globalSS = vars;
			// console.log("lmao");

			F.customSounds();
		});

		createAnonFunction("customSounds", function () {
			window.globalSS.PLAYERS.forEach((PLAYER) => {
				let H = window.H;
				if (PLAYER.hasOwnProperty("ws")) {
					window.globalSS.MYPLAYER = PLAYER;
				}
			});

			H.actor = findKeyWithProperty(window.globalSS.MYPLAYER, H.mesh);
		});
		createAnonFunction("adBlocker", function (input) {
			try {
				if (input == 10 && false) {
					return 1;
				} else if (true) {
					if (typeof input == "boolean") {
						return true;
					} else if (input == 10) {
						return 5;
					} else if (input == "adsBlocked") {
						return false;
					}
				}
				return input;
			} catch (error) {
				return true;
			}
		});

		let _apc = HTMLElement.prototype.appendChild;
		let shellshock_og = null;

		HTMLElement.prototype.appendChild = function (node) {
			if (
				node.tagName === "SCRIPT" &&
				node.innerHTML &&
				node.innerHTML.startsWith("(()=>{")
			) {
				shellshock_og = node.innerHTML;
				node.innerHTML = applyScript(node.innerHTML);
			}
			return _apc.call(this, node);
		};

		const proto = window.HTMLScriptElement.prototype;
		const existing = Object.getOwnPropertyDescriptor(proto, "textContent");

		const original =
			existing || Object.getOwnPropertyDescriptor(window.Node.prototype, "textContent");

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

		const applyScript = function (js) {
			let match;
			let clientKeys;

			let originalJS = fetchTextContent("/js/shellshock.js");

			const getVardata = function () {
				return fetchTextContent(clientKeysURL + "latest.json?v=" + Date.now());
			};
			// console.log(hash);
			let onlineClientKeys = getVardata();

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
			window.H = H;

			let injectionString = "";

			try {
				//SERVERSYNC
				match = new RegExp(`function serverSync\\(\\)\\{(.*?)\\)\\}`).exec(js);
				log("SERVERSYNC:", match);
				H.SERVERSYNC = match
					? match[1].replace(/[a-zA-Z$_\.\[\]]+shots/, 0) + ")"
					: "function(){log('no serversync womp womp')}";
				//PAUSE
				match = new RegExp(
					`,setTimeout\\(\\(\\(\\)=>\\{([=A-z0-9\\(\\),\\{ \\.;!\\|\\?:\\}]+send\\([a-zA-Z$_]+\\))`
				).exec(js);
				log("PAUSE:", match);
				H.PAUSE = match
					? `function(){${match[1]}}`
					: "function(){log('no pause womp womp')}";

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

				log(
					"%cSTATEFARM INJECTION STAGE 1: GATHER VARS",
					"color: yellow; font-weight: bold; font-size: 1.2em; text-decoration: underline;"
				);

				const modifyJS = function (find, replace) {
					let oldJS = js;
					try {
						js = js.originalReplaceAll(find, replace);
					} catch (err) {
						console.log(
							"%cReplacement failed! Likely a required var was not found. Attempted to replace " +
								find +
								" with: " +
								replace,
							"color: red; font-weight: bold; font-size: 0.6em; text-decoration: italic;"
						);
					}
					if (oldJS !== js) {
						console.log(
							"%cReplacement successful! Injected code: replaced: " +
								find +
								" with: " +
								replace,
							"color: green; font-weight: bold; font-size: 0.6em; text-decoration: italic;"
						);
					} else {
						console.log(
							"%cReplacement failed! Attempted to replace " +
								find +
								" with: " +
								replace,
							"color: red; font-weight: bold; font-size: 0.6em; text-decoration: italic;"
						);
					}
				};

				const f = function (varName) {
					return varName.replace("$", "\\$");
				};
				const FUNCTIONPARAM = new RegExp(
					"function " + f(H._connectFail) + "\\(([a-zA-Z$_]+)\\)"
				).exec(js)[1];
				const v = `[a-zA-Z_$][a-zA-Z0-9_$]*`;
				const regex = (strings, ...values) =>
					new RegExp(
						strings.raw.reduce((acc, str, i) => acc + str + (values[i] ?? ""), ""),
						"g"
					);
				// modifyJS(
				// 	f(H.SCENE) + "." + f(H.render),
				// 	`window["${functionNames.retrieveFunctions}"]({${injectionString}},true)||${f(H.SCENE)}.render`
				// );

				modifyJS(
					"adsBlocked=" + FUNCTIONPARAM,
					"adsBlocked=" + functionNames.adBlocker + '("adsBlocked")'
				);
				modifyJS('"user-has-adblock"', functionNames.adBlocker + '("user-has-adblock")');
				modifyJS("layed=!1", "layed=window." + functionNames.adBlocker + "(!1)");
				modifyJS("showAdBlockerVideo", "hideAdBlockerVideo"); //hello eggs bullshit
				modifyJS(
					H.USERDATA + ".playerAccount.isUpgraded()",
					functionNames.adBlocker + "(" + f(H.USERDATA) + ".playerAccount.isUpgraded())"
				);

				modifyJS(
					`!${f(H.isBadWord)}(${f(H._insideFilterFunction)})`,
					`((!${f(H.isBadWord)}(${f(H._insideFilterFunction)}))||true)`
				);
				// match = new RegExp(`\}${v}\.length\>4`).exec(js);
				let [_, elm, str] = js.match(/\)\),([a-zA-Z$_]+)\.innerHTML=([a-zA-Z$_]+),/);
				modifyJS(
					_,
					_ +
						`${f(
							H.isBadWord
						)}(${str})&&true&&!arguments[3]&&(${elm}.style.color="red"),`
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