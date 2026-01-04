// ==UserScript==
// @name        Modify Kills Text
// @description Changes the boring kills text to something more interesting
// @namespace   Violentmonkey Scripts
//
// @match       https://shellshock.io/*
// @match         *://eggshooter.best/*
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

// @run-at       document-start
// @grant       none
// @version     1.0
// @author      -
// @description 2/12/2025, 2:02:07 PM
//
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @downloadURL https://update.greasyfork.org/scripts/530957/Modify%20Kills%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/530957/Modify%20Kills%20Text.meta.js
// ==/UserScript==
(function () {
	let originalReplace = String.prototype.replace;

	String.prototype.originalReplace = function () {
		return originalReplace.apply(this, arguments);
	};
	const originalXHROpen = XMLHttpRequest.prototype.open;
	const originalXHRGetResponse = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, "response");
	let shellshockjs;
	XMLHttpRequest.prototype.open = function (...args) {
		const url = args[1];
		if (url && url.includes("js/shellshock.js")) {
			shellshockjs = this;
		}
		originalXHROpen.apply(this, args);
	};
	Object.defineProperty(XMLHttpRequest.prototype, "response", {
		get: function () {
			if (this === shellshockjs) {
				return applyScript(originalXHRGetResponse.get.call(this));
			}
			return originalXHRGetResponse.get.call(this);
		},
	});
	//VAR STUFF
	let F = [];
	let H = {};
	let functionNames = [];

  window.weaponsURL = {
	gun_m24:
		"m97.3 9.6-3.1-3.1-3.6 2-36.2 31.7h-.8l-1.4-1.6 1.4-1.2 4.2-2 3.7-2.8-4.9-5.6-3.6 2.8-3.8 5.3-.4-.5-1.9 1.6.4.5-9.8 8.3-.5-.6-1.9 1.6.5.6-6.6 3.3-1.8 1.8 5.2 5.7 2.1-1.8 4-5.6 1.5 1.8-.5 1.6-1.1-.8-1.6 1.2.6.9-1.9 1.7 2.9 3.2-3.4 6.2-3.9.4-17 14 2.4 2.1-1.5 1.5-2.3-1.9-4.1 3.9 16.6 13.8 3.3-4.2-2.3-1.9 1.2-1.3 1.5 1.3L41 75.4l6 2.4 4-4-5.7-6-.4-2.8 3.3-4.3 2.3 2.4h6.3l3.7-3.2 1-5.7-3.2-3.6 22-19-3.1-4 16.9-14.1 3.2-3.9zM18.1 83.7l3 2.7-1.4 1.3-3.2-2.7 1.6-1.3zm6.2 7.9-2.4-2 1.3-1.3 2.3 2-1.2 1.3zm17.3-42-1-1.1 9.8-8.2 1.1 1.2-9.9 8.1zm17.3 5.6-.4 3.5-2.5 2.4-4.6.3-1.9-2.1.7-.9 1.3 1.4h3.4l.9-.8-2.8-.7-1.4-1.7.2-.3 4.6-4 2.5 2.9z  ",
	gun_aug:
		"m94.3 7.4-2.8.5-1 3-12.1 11.8-1.1-.9-5 4.5 3.8 4.1.6 2.9-2 1.4-5.4-6.5-9-1-12 10.3-.5-.5 2-1.7-3.5-4.3-2.1 2-.7-.7-5.1 4.9.7.7-2 1.8 3.1 3.7 2.4-2 .6.6-6.2 5.2 1.8 1.9 7.9-6.8h1l1.1 1.2.2.7-.3.3.3 2.3-2 1.3-1.2-1.1-28.2 21.2 2.2 2.7-12.1 9.4v4.2l9.4 8.6 1.7-.6 6.2 6.1 5.2-4.6.6-14h2.9l1.5-1.4s2.9 3.2 6.7 6.1c3.8 2.9 10.3 8.1 10.3 8.1L58.3 81v-2.4l-2.7-.6s-8-4.8-11.6-9.1l1.1-1.1-1.1-2.6 7.4-6.5L59 70.5l3.4 1.1 9.5-8-5.7-15.9 1.9-1.4 1.5 1.1 2.3-1.8-1-1.9 1-.8 11.7 10.9 2.7-2.5L77.4 38l4.3-3.3-.7-6.2-.8-1.3.3-1.5L95 15.3l2.8-.5.5-2.9-4-4.5zm-37 31.2-4.3.6.8 2.3-1.8.5-1.1-.3-.9-1.3v-.9l11-9.6 2.3 1.5-.4 2.3-3.2-.1.9 2.2-4.2.4.9 2.4zm11.1 23.6-4.6 4.4-4.6-8 .8-2.4.9-.1-.1-1.6-1.7-2.5 4.3-3.8 5 14z",
	gun_rpegg:
		"m78.1 48.5-5.1-.1.1-1.7 6.2-5.1 1.4-3.2.9 1.1 19.2-13.1s-.9-3.1-3.7-7l.2-1.8c.2-1.2-.7-2.3-1.9-2.4l-1.9-.2c-1.7-1.7-3.7-3.4-6.2-5L70.9 26.6l1.3 1.5-1.5.5-5.5-2.6-4.9 4.1.8 4.4-4.7 3.8-4-4.6.1-.1 1.4.3 7.4-6.9.6.7 4.2-3.4-5.3-6.3-4.2 3.4.4.6-7.8 6v1.5l-12.4 8.6 5.4 6.2 5.7-6 3.4 4.7-1.6-.4-3.7 2.8 1 1.3-22.3 19-1.4-.5-3.5 2.8.2 1.3-8.8 5.2-2.2-.3-3.9 3.5s3.4 11.5 14.7 18.2l4.4-3.5.3-2.2 6-7.5.6-.5 1.3.4 3.2-2.8-.1-1.4 2.9-2.5 11.1 11.6 7.1-6.2-10-12.6 9.5-8.2 8.3.2.2.3-2.1 2.1 5.1 6.8 1.8-1.7 5.8 9 6.5-6.1-4.2-10.8 5.2-5.7-4.6-6.1zm-1.4 2.6 2.5 3.6-3.2 3.4-2-2.5 2.5-1.9-.6-.7-3.1-.1.1-1.9 3.8.1zM63.2 31.2l2.4-2 1.4.7-.3.1-3.3 2.6-.2-1.4z",
	gun_smg:
		"m98 16.8-2.9-3.4c-.4-.4-1.1-.5-1.5-.1L90.4 16c-.3.3-.5.7-.3 1.1l-6.4 5.6-5.4-5.7-2-1-4-3.9-.7.5-.5 1.1-1.7-2.1-1 .8 1.7 2.1-1.2.2-1.8 1.4.2 1.1-1.1.8-1.1-.4-1.7 1.3.2 1.2-.9.9-1.1-.4-1.7 1.4.2 1.2-1 .8-1.2-.4-1.6 1.3.2 1.3-1.1.8-1.3-.4-1.7 1.4v1.3l-2.8-3.5-1.8 1.5 3.7 4.5-.8 1.2 1.8 8.1L7.8 78l16 16.3H26l18.4-16 10.5-.5 9.5-5.5 5.2-7.1v-7.4l9-6.2 2.1 4.1 5.3-4.2v-6.9l-3.7-6.2 3.7-3.2 3.9 4.2 4.1-3.3-4.7-6.1h-4l.8-2.2 7.6-6.6c.3.1.7 0 1-.2l3.2-2.7c.4-.4.5-1.1.1-1.5zM58.6 66.1l-6.2 4.5-6.6-7.3 10.6-9c1.5 1.9 4.6 4.9 4.6 4.9l-2.4 6.9zm-.8-29.5-.6-2.3 14.4-12.1 3 .5-16.8 13.9zM74.4 50l-4.1-3.3-.8-3.3 5.5-4.6 4.4 6.2-5 5z",
	gun_csg1:
		"m76.8 32.6-.1-2.2 22.5-19.3-3.3-3.3-11.4 9.6-4.7-1.3-7.6 6.5-2.2-1-25.7 21.8-3.6-3.5.9-.7 6.5-3.9 2.7.2 1.2-1.1s-1.8-3.4-6.9-8l-1.2 1.3v2.1l-4.6 5.8-8.3 8-3.9 1.7-13.9 11.1-2.9.9s1 2.1 2.4 3.6c2 2 4 3.2 3.7 3l.8-2.6 13.1-11.7 2.5-3.1.2-.2 3.5 3.8-12.4 10.6 1.7 8.9-19 16.5L17 98.2l16.9-17 3.4 7.5 11.3-6.3-5-9.4 9.4-9.8-2.2-3.8 1.5.8 6.6 5.5 8.7-10.8c-7.7-4.6-9.6-8-9.6-8l5.2-2 13.6-12.3zm1.2-12 1.8.6-4.6 4-1-1.1 3.8-3.5zM17.5 89.1l-3.5-5 2.5-2.2 3.8 4.4-2.8 2.8zm8.1-4.2-4.4-7.3L29 71l3.5 7.3-6.9 6.6zm23.9-22.1-7.3 7.6-2.5-4.6 4.9-2.3-.3-2c-1.5.6-2.5-.1-3.2-.7l4.9-3.7.1.1 3.4 5.6z",
	gun_dozenGauge:
		"M94.5 15.3c-.3-.6-.9-1.5-1.8-2.6-.9-1-1.6-1.8-2.2-2.3-.5-.4-1.1-.4-1.6-.1l-3.7 3-2.2-.6-3.1 2.2.5 2.2L46 44.6c-.2.2-.4.4-.7.6l-2.6-2.5-1.7 1.5 2.5 3c-5.2 6.5-10 17.3-10 17.3l-3.3.2L11.4 83l11.3 12.9L41 67.7l2.8 1.5.6-.2c7.9-2.4 9.5-7.5 9.5-7.7l.2-.7-3.9-5.1 10.5-6.8L85.1 28c.8-.7.9-1.8.3-2.7l-.7-1 9.4-7.5c.5-.3.7-1 .4-1.5zM44.1 66.1l-1.5-.8 2.5-3.8h3l.9-1-2.1-1.5 1.2-1.4 2.7 3.5c-.5 1.1-2.3 3.5-6.7 5z",
	gun_eggk47:
		"m61.7 51.4.4-1.3 22.4-19.7-.2-1.8 14.6-12.7-3.3-3.3-4.3 3.6C86.7 13.9 83 8.7 83 8.7l-1.9 1.7c3.5 4 5.2 7.5 6.1 9.5l-.9.7-6.1-3-3.4 2.8-1.6-1-11.5 9.5.2 2.2-.5.4-3.6-1.1-5.3 4.8-1.3-.8-1.2 1.2 2.6 3.1-28 23.2.4 6.5-2.7 4.5-3.1-.2L7.1 85l10.5 12.1 14.8-23.3 1.3-.5 8.7 24.1 10.8-9.1-6.4-13.9 7.1-6.7-3-5c2.8 2.7 18.2 16.9 38.8 15.6L91 63.1s-17.8 1.3-29.3-11.7zm24.9-36.3c.2-.2.5-.2.8 0l1.6 1.2c.3.2.3.7 0 1l-.6.5c-.3.2-.7.2-.9-.2l-.9-1.7c-.3-.3-.2-.7 0-.8zM45.5 71.6 44 68.2l4.2-2.1-.5-.9-2.7-.7.9-2 1.4-.3 2.9 4.9-4.7 4.5z",
  gun_cluck9mm:
  "M 87.5 32.38 L 89.08 31.22 L 83.84 24.64 L 80.1 27.62 L 77.06 26 L 74 28.24 L 75.06 31.68 L 58 45.3 L 55.22 45.46 L 42.46 55.66 L 40.9 54.36 L 38.2 56.36 L 39.14 58.36 L 37.74 59.48 A 1.44 1.44 0 0 0 37.4 61.34 L 43.72 71.88 L 48.16 72.54 L 56.82 91.5 L 62.1 93.5 L 71.22 84.76 L 71.76 79.32 L 67.02 68.58 L 77.02 59.4 L 72.52 52.8 L 78.12 48 L 77.44 46.22 L 88.66 37.06 L 88 36.1 L 89.26 35.14 Z M 72.88 58.92 L 65.74 65.54 L 64.92 63.68 L 68.26 60.36 L 63.22 57.42 L 67.94 53.42 L 69.08 54.04 Z Z Z",
  };

  const patterns = {
		sound: /"sound\/sounds\.json\?"\+(..)/,
		scope: /,this\.(..)\.position\.z=2/,
		teamColors: /([A-Za-z]+)=\{text:\["#fff100","#00ffff","#f53e40"\]/g,
    killsText: /(.)\=\'\<span style.*?;/,
    lastDmg: /\([A-Za-z$_]\.lastDmgType\=([A-Za-z$_]).*?{/
	};

	//scrambled... geddit????
	const getScrambled = function () {
		return Array.from({ length: 10 }, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join("");
	};
	const createAnonFunction = function (name, func) {
		const funcName = getScrambled();
		window[funcName] = func;
		F[name] = window[funcName];
		functionNames[name] = funcName;
	};

	const findKeyWithProperty = function (obj, propertyToFind) {
		for (const key in obj) {
			if (obj.hasOwnProperty(key)) {
				if (key === propertyToFind) {
					return [key];
				} else if (typeof obj[key] === "object" && obj[key] !== null && obj[key].hasOwnProperty(propertyToFind)) {
					return key;
				}
			}
		}
		// Property not found
		return null;
	};
	const fetchTextContent = function (url) {
		var xhr = new XMLHttpRequest();
		xhr.open("GET", url, false); // Make the request synchronous
		xhr.send();
		if (xhr.status === 200) {
			return xhr.responseText;
		} else {
			console.error("Error fetching text content. Status:", xhr.status);
			return null;
		}
	};

	const applyScript = function (js) {
		let hash = CryptoJS.SHA256(js).toString(CryptoJS.enc.Hex);
		let clientKeys;
		onlineClientKeys = fetchTextContent("https://raw.githubusercontent.com/StateFarmNetwork/client-keys/main/statefarm_latest.json"); //credit: op7 :D

		clientKeys = JSON.parse(onlineClientKeys);

		H = clientKeys.vars;

		let injectionString = "";

		const modifyJS = function (find, replace) {
			let oldJS = js;
			js = js.originalReplace(find, replace);
			if (oldJS !== js) {
				console.log(
					"%cReplacement successful! Injected code: " + replace,
					"color: green; font-weight: bold; font-size: 0.6em; text-decoration: italic;"
				);
			} else {
				console.log(
					"%cReplacement failed! Attempted to replace " + find + " with: " + replace,
					"color: red; font-weight: bold; font-size: 0.6em; text-decoration: italic;"
				);
			}
		};

    H.extra = {
			teamColors: patterns.teamColors.exec(js)[1],
      killsText: patterns.killsText.exec(js),
      lastDmg: patterns.lastDmg.exec(js)
		}

		console.log("%cATTEMPTING TO START WISH-SCRIPT", "color: magenta; font-weight: bold; font-size: 1.5em; text-decoration: underline;");
		const variableNameRegex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
		for (let name in H) {
			deobf = H[name];
			if (variableNameRegex.test(deobf)) {
				injectionString = `${injectionString}${name}:  (() => { let variable = "value_undefined"; try { eval("variable = ${deobf};"); } catch (error) { return "value_undefined"; }; return variable; })(),`;
			}
		}
		const f = function (varName) {
			return varName.replace("$", "\\$");
		};
		const FUNCTIONPARAM = new RegExp("function " + H._connectFail.replace("$", "\\$") + "\\(([a-zA-Z$_]+)\\)").exec(js)[1];

		modifyJS(H.SCENE + ".render", `window["${functionNames.retrieveFunctions}"]({${injectionString}},true)||${H.SCENE}.render`);

    modifyJS(`${H.extra.killsText[0]}`,
    `${H.extra.killsText[1]}='<span style="color:' + ${H.extra.teamColors}.text[e.team] + '">' + e.name + "</span>" +
    \`<svg viewBox="0 0 100 100" width="27" height="27" style="display: inline-block; vertical-align: middle; margin-top: -3px;"><path d="\${window.weaponsURL[e.weapon["${H.actor}"].standardMeshName]}" fill="#FFFFFF"></path></svg>\` +
    '→ <span style="color:' + ${H.extra.teamColors}.text[t.team] + '">'+t.name+"</span>";`
    );

		console.log(H);
		return js;
	};

	createAnonFunction("retrieveFunctions", function (vars) {
		ss = vars;
		F.WISHSCRIPT();
	});



	createAnonFunction("WISHSCRIPT", function () {
		ss.PLAYERS.forEach((PLAYER) => {
			if (PLAYER.hasOwnProperty("ws")) {
				ss.MYPLAYER = PLAYER;
			}
		});

		H.actor = findKeyWithProperty(ss.MYPLAYER, H.mesh);
	});
})();
