// ==UserScript==
// @name         XP/h
// @namespace    http://tampermonkey.net/
// @version      2025-12-13-2
// @description  XP/h tracker for MWI
// @license      MIT
// @author       sentientmilk
// @match        https://www.milkywayidle.com/*
// @icon         https://www.milkywayidle.com/favicon.svg
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValues
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/532023/XPh.user.js
// @updateURL https://update.greasyfork.org/scripts/532023/XPh.meta.js
// ==/UserScript==

/*
	Changelog
	=========

	v2025-04-06
		- Initial version
	v2025-04-07
		- FIXED: Compatibility with Meme Script
	v2025-08-19
		- FIXED: Skill changes after the 19.08.2025 Combat rework
	v2025-12-06
		- FIXED: Reconnecting after unfocus, tab switching, desktop switching
	v2025-12-13
		- Show time till the level up (using last XP/h number) in the skill tooltip
	v2025-12-13-2
		- FIXED: XP/h not updating

	        TODO
	====================
	- Conflicts with https://greasyfork.org/en/scripts/499963-银河奶牛-食用工具 sidebar buttons are gone, also dispatch and loot button
	- Conflict with Edible tools, missing sidebar buttons
	- Conflict with Edible tools, missing book lvl up in books Items description
	- Conflict with Edible tools, missing buttons in the Party screen

*/

(function() {
	async function waitRepeatedFor (selector, callback) {
		let notified = false;
		return new Promise((resolve) => {
			let lastEl = null
			function check () {
				const el = selector();
				if (el && el != lastEl) {
					lastEl = el;
					notified = false;
				}
				setTimeout(check, 1000/10); // Schedule first to allow the callback to throw
				if (el && !notified) {
					notified = true;
					resolve(el);
					if (callback) {
						callback(el);
					}
				} else if (el && notified) {
					// Skip, wait for cond to be false again
				} else {
					notified = false;
				}
			}
			check();
		});
	}

	function reset () {
		const keys = GM_listValues();
		GM_deleteValues(keys);
		console.log("XP/h: Deleted stored values for", keys);
	}

	unsafeWindow.xpUserscriptReset = reset;

	async function waitFor (selector) {
		return new Promise((resolve) => {
			function check () {
				const el = document.querySelector(selector);
				if (el) {
					resolve(el);
				} else {
					setTimeout(check, 1000/30);
				}
			}
			check();
		});
	}

	function fs (n) {
		return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
	}

	function f (n) {
		if (typeof n != "number") {
			return "NaN";
		} else if (n == 0) {
			return n;
		} else if (Math.abs(n) < 1) {
			return n.toFixed(2);
		} else if (Math.abs(n) < 10*1000) {
			if (n % 1 == 0) {
				return "" + n;
			} else {
				return n.toFixed(1);
			}
		} else if (Math.abs(n) <= 1*1000*1000) {
			const k = n/1000;
			if (k % 1 == 0) {
				return k + "K";
			} else {
				return k.toFixed(1) + "K";
			}
		} else if (Math.abs(n) > 1*1000*1000) {
			const m = n/(1000*1000);
			if (m % 1 == 0) {
				return m + "M";
			} else if (m % 0.1 == 0) {
				return m.toFixed(1) + "M";
			} else {
				return m.toFixed(2) + "M";
			}
		} else {
			return "" + n;
		}
	}

	function fTimeLeft (ms) {
		const m1 = 60 * 1000;
		const h1 = 60 * 60 * 1000;
		const d1 = 24 * 60 * 60 * 1000;
		const w1 = 7 * 24 * 60 * 60 * 1000;

		const w = Math.floor(ms / w1);
		const d = Math.floor((ms % w1) / d1);
		const h = Math.floor((ms % d1) / h1);
		const m = Math.ceil((ms % h1) / m1);

		const s = (n) => n == 1 ? "" : "s";

		let f = [];

		if (w >= 1) {
			f.push(`${w} week${s(w)}`);
		}

		if (d >= 1) {
			f.push(`${d} day${s(d)}`);
		}

		if (ms < w1 && h >= 1) {
			f.push(`${h} hour${s(h)}`);
		}

		if (ms < 6 * h1 && m >= 1) {
			f.push(`${m} minute${s(m)}`);
		}

		return f.join(" ");
	}

	/*
		============================================
		Original is in Guild XP/h - copy from there!
		============================================
	*/
	let m10 = 10 * 60 * 1000;
	let h1 = 60 * 60 * 1000;
	let w1 = 7 * 24 * 60 * 60 * 1000;
	function pushXP (arr, d, recent=m10, far=h1, old=w1) {
		// Debug: Delete duplicate XPs
		/*
		for (let i = arr.length - 1; i >= 0; i--) {
			const d = arr[i];
			const same = arr.filter((d2) => d2 != d && d2.xp == d.xp);
			same.reverse().forEach((d2) => {
				const i2 = arr.indexOf(d2);
				arr.splice(i2, 1);
				i--;
			});
		}
		*/

		// Debug: Delete values not in order
		/*
		for (let i = 0; i < arr.length; i++) {
			const d = arr[i];
			if (i > 0) {
				const prev = arr[i-1];
				if (d.xp < prev.xp) {
					arr.splice(i, 1);
					i--;
				}
			}
		}
		*/

		if (arr.length == 0 || d.xp >= arr[arr.length - 1].xp) {
			arr.push(d);
		} else {
			// Why can it happen???
			console.error("Guild XP/h: Received lower XP value");
		}

		if (arr.length > 2) {
			// Assume records are in order
			let recentLength = 0;
			for (let i = arr.length - 1; i >= 0; i--) {
				const d2 = arr[i];
				if (d.t - d2.t <= recent) {
					recentLength += 1
				} else {
					break;
				}
			}

			if (recentLength > 2) {
				// Keep a first and last recond in *recent* time
				// To always have the latest data
				// But without adding too many records with short time between
				// If I keep only the last - it will always replace if you check more often then *recently*
				arr.splice(arr.length - recentLength + 1, recentLength - 2);
			}

			let sameLength = 0;
			for (let i = arr.length - 1; i >= 0; i--) {
				const d2 = arr[i];
				// Keep same XP values if they are far apart
				if (d.xp == d2.xp && d.t - d2.t <= far) {
					sameLength += 1
				} else {
					break;
				}
			}

			if (sameLength > 1) {
				// Keep only the last recond with the same XP value
				arr.splice(arr.length - sameLength, sameLength - 1);
			}

			let oldLength = 0;
			for (let i = 0; i < arr.length; i++) {
				const d2 = arr[i];
				if (d.t - d2.t > old) {
					oldLength += 1;
				}
			}

			if (oldLength > 0 ) {
				arr.splice(0, oldLength);
			}
		}
	}

	function inLastInterval (arr, interval) {
		let filtered = [];
		const now = Date.now();
		for (let i = arr.length - 1; i >= 0; i--) {
			const d = arr[i];
			if (now - d.t <= interval) {
				filtered.unshift(d);
			} else {
				// Skip
			}
		}

		return filtered;
	}

	function calcXPH (prev, d) {
		const xpD = d.xp - prev.xp;
		const tD = d.t - prev.t;
		const xpH = (xpD / (tD / (60 * 1000))) * 60;
		return xpH;
	}

	function calcIndividualStats2 (arr, options={}) {
		if (arr.length < 2) {
			return {
				lastXPH: 0,
				lastHourXPH: 0,
			};
		}

		const m10 = 10 * 60 * 1000;
		const lastArr = inLastInterval(arr, m10);
		const lastXPH = lastArr.length >= 2 ? calcXPH(lastArr[0], lastArr[lastArr.length - 1]) : 0;

		const h1 = 60 * 60 * 1000;
		const lastHourArr = inLastInterval(arr, h1);
		const lastHourXPH = lastHourArr.length >= 2 ? calcXPH(lastHourArr[0], lastHourArr[lastHourArr.length - 1]) : 0;

		return {
			lastXPH,
			lastHourXPH,
		};
	}

	async function updateXPH () {
		await waitFor(".NavigationBar_nav__3uuUl");

		let idToEl = {};
		const navEls = document.querySelectorAll(".NavigationBar_nav__3uuUl:has(.NavigationBar_currentExperience__3GDeX)");
		navEls.forEach((navEl) => {
			const id = navEl.querySelector("svg use").getAttribute("href").split("#")[1];
			const labelEl = navEl.querySelector(".NavigationBar_label__1uH-y");
			idToEl[id] = labelEl;
		});


		skills.forEach(async (s, i) => {
			const stats = calcIndividualStats2(characterXP[s.id]);
			if (s.name == "Total Level") {
				document.querySelector(".Header_rightHeader__8LPWK").style.maxWidth = "350px";
				const template = `
					<div class="xph-userscript" style="font-size: 13px; color: orange;">
						<span style="font-weight: 500;">${f(stats.lastXPH)} xp/h</span>
						<span>(${f(stats.lastHourXPH)} xp in the last hour)</span>
					</div>
				`;
				const totalEl = await waitFor(".Header_totalLevel__8LY3Q");
				totalEl.parentElement.querySelector(".xph-userscript")?.remove();
				if (stats.lastHourXPH > 0) {
					totalEl.insertAdjacentHTML("afterend", template);
				}
			} else {
				const template = `<span class="xph-userscript" style="font-size: 13px; color: orange;">${f(stats.lastXPH)} xp/h</span>`;
				const labelEl = idToEl[s.id];
				labelEl.parentElement.querySelector(".xph-userscript")?.remove();
				labelEl.parentElement.querySelector(".NavigationBar_level__3C7eR").style.width = "auto";
				if (stats.lastXPH > 0) {
					labelEl.insertAdjacentHTML("afterend", template);
				}
			}
		});
	}

	//const initClientData = JSON.parse(localStorage.getItem("initClientData"));
	const skills = [
		{ id: "total_level", hrid: "/skills/total_level", name: "Total Level" },
		{ id: "milking", hrid: "/skills/milking", name: "Milking" },
		{ id: "foraging", hrid: "/skills/foraging", name: "Foraging" },
		{ id: "woodcutting", hrid: "/skills/woodcutting", name: "Woodcutting" },
		{ id: "cheesesmithing", hrid: "/skills/cheesesmithing", name: "Cheesesmithing" },
		{ id: "crafting", hrid: "/skills/crafting", name: "Crafting" },
		{ id: "tailoring", hrid: "/skills/tailoring", name: "Tailoring" },
		{ id: "cooking", hrid: "/skills/cooking", name: "Cooking" },
		{ id: "brewing", hrid: "/skills/brewing", name: "Brewing" },
		{ id: "alchemy", hrid: "/skills/alchemy", name: "Alchemy" },
		{ id: "enhancing", hrid: "/skills/enhancing", name: "Enhancing" },
		{ id: "stamina", hrid: "/skills/stamina", name: "Stamina" },
		{ id: "intelligence", hrid: "/skills/intelligence", name: "Intelligence" },
		{ id: "attack", hrid: "/skills/attack", name: "Attack" },
		{ id: "melee", hrid: "/skills/melee", name: "Melee" },
		{ id: "defense", hrid: "/skills/defense", name: "Defense" },
		{ id: "ranged", hrid: "/skills/ranged", name: "Ranged" },
		{ id: "magic", hrid: "/skills/magic", name: "Magic" },
	];

	const skillHridToName = {};
	skills.forEach((s) => skillHridToName[s.hrid] = s.name);


	let characterID;
	let characterXP = GM_getValue("characterXP_"+characterID, {});
	function handle (message) {
		if (message.type == "init_character_data") {
			const t = +new Date(message.currentTimestamp);

			characterID = message.character.id;
			characterXP = GM_getValue("characterXP_"+characterID, {});

			skills.forEach((s) => {
				const e = message.characterSkills.find((e) => e.skillHrid == s.hrid);
				const xp = e.experience;

				if (!characterXP[s.id]) {
					characterXP[s.id] = [];
				}

				const d = { t, xp };
				pushXP(characterXP[s.id], d);
				//console.log(s.name + ": " + fs(Math.floor(xp)));
			});

			GM_setValue("characterXP_"+characterID, characterXP);

			updateXPH();
		} else if (message.type == "action_completed") {
			const t = +new Date(message.endCharacterSkills[0].updatedAt);

			skills.forEach((s) => {
				const e = message.endCharacterSkills.find((e) => e.skillHrid == s.hrid);
				if (e) {
					const xp = e.experience;

					if (!characterXP[s.id]) {
						characterXP[s.id] = [];
					}

					const d = { t, xp };
					pushXP(characterXP[s.id], d);
					//console.log(s.name + ": " + fs(Math.floor(xp)));
				}
			});

			GM_setValue("characterXP_"+characterID, characterXP);

			updateXPH();
		}
	}

	function isSkillPopupOnScreen () {
		return document.querySelector("body > .MuiPopper-root .NavigationBar_navigationSkillTooltip__3a9Rz");
	}

	// Compatibility with the Meme script
	const memeReplacements = {
		"Smort": "Intelligence",
		"Ranged OP": "Ranged",
	};

	function addTimeTilLevelUp (tooltipEl) {
		let name = tooltipEl.querySelector("div:nth-child(1)").textContent;
		if (name in memeReplacements) {
			name = memeReplacements[name];
		}
		const s = skills.find((s) => s.name == name);
		if (s) {
			let xpTillLevelUp = parseInt(tooltipEl.querySelector("div:nth-child(4)").textContent.split(": ")[1].replace(/,/g, ""));
			const stats = calcIndividualStats2(characterXP[s.id]);
			tooltipEl.querySelector("div:nth-child(4)").insertAdjacentHTML("afterend", `
				<div class="xph-userscript" style="font-size: 13px; color: #6f4700;">
					<span style="font-weight: 800;">${fTimeLeft((xpTillLevelUp / stats.lastXPH) * 60 * 60 * 1000)}</span><span> till next lvl</span>
				</div>`);
		}
	}

	waitRepeatedFor(isSkillPopupOnScreen, addTimeTilLevelUp);

	/*
		Wrap WebSocket to set own listener
		Use unsafeWindow + run-at document-start to do that before MWI calls the WebSocket constuctor
	*/
	const OriginalWebSocket = unsafeWindow.WebSocket;
	let ws;
	function listener (e) {
		const message = JSON.parse(e.data);
		handle(message);
	}
	const WrappedWebSocket = function (...args) {
		ws = new OriginalWebSocket(...args)
		ws.addEventListener("message", listener);
		return ws;
	};

	// Used in .performConnectionHealthCheck() and .sendHealthCheckPing() in the MWI
	WrappedWebSocket.CONNECTING = OriginalWebSocket.CONNECTING;
	WrappedWebSocket.OPEN = OriginalWebSocket.OPEN;
	WrappedWebSocket.CLOSED = OriginalWebSocket.CLOSED;

	unsafeWindow.WebSocket = WrappedWebSocket;

	console.log("XP/h: Wrapped window.WebSocket");
	console.log("XP/h: Call window.xpUserscriptReset(); - to reset saved XP");
})();
