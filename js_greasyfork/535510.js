// ==UserScript==
// @name         Custom guild roles
// @namespace    http://tampermonkey.net/
// @version      2025-05-09
// @description  Custom guild roles for MWI
// @license      MIT
// @author       sentientmilk
// @match        https://www.milkywayidle.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/535510/Custom%20guild%20roles.user.js
// @updateURL https://update.greasyfork.org/scripts/535510/Custom%20guild%20roles.meta.js
// ==/UserScript==

(function() {

	// Name is ignored. It is just for weak humans minds.
	const data = [
			{ "id": 82836,  "name": "ShutupLurpa",       "role": "Goddess" },
			{ "id": 83797,  "name": "vaivars",           "role": null },
			{ "id": 63670,  "name": "Kyiomi",            "role": null },
			{ "id": 86641,  "name": "CheesyIron2",       "role": null },
			{ "id": 82791,  "name": "Phoenicis",         "role": null },
			{ "id": 77967,  "name": "Nilhility",         "role": null },
			{ "id": 93914,  "name": "Saguaro",           "role": null },
			{ "id": 7804,   "name": "Lemon",             "role": "The Milkman" },
			{ "id": 56907,  "name": "Vaporwave",         "role": null },
			{ "id": 49015,  "name": "UnholyMilk",        "role": "Pro-Buffer" },
			{ "id": 67638,  "name": "morp",              "role": "Morp" },
			{ "id": 84783,  "name": "CBritannicus",      "role": null },
			{ "id": 103530, "name": "Courisco",          "role": null },
			{ "id": 105358, "name": "guzz",              "role": "Rainbow General" },
			{ "id": 114747, "name": "BugUnit",           "role": null },
			{ "id": 23642,  "name": "MrFrench80",        "role": null },
			{ "id": 111927, "name": "EnchantressEucli",  "role": "Guild Enhancer" },
			{ "id": 86122,  "name": "antares",           "role": null },
			{ "id": 126027, "name": "Bunny",             "role": null },
			{ "id": 28132,  "name": "Dapple",            "role": null },
			{ "id": 129999, "name": "God",               "role": null },
			{ "id": 77305,  "name": "NotWicked",         "role": null },
			{ "id": 134547, "name": "sentientmilk",      "role": "The Brain Lemon" },
			{ "id": 126946, "name": "LilyBlossoms",      "role": null },
			{ "id": 130100, "name": "Kiyuwu",            "role": null },
			{ "id": 93588,  "name": "Khazan",            "role": null },
			{ "id": 119074, "name": "FredFredBurger92",  "role": null },
			{ "id": 89574,  "name": "Smurfenson",        "role": null },
			{ "id": 122672, "name": "LeytonRox",         "role": null },
			{ "id": 20368,  "name": "MilkMaid",          "role": null },
			{ "id": 90867,  "name": "doppler",           "role": null },
			{ "id": 94896,  "name": "pulagaga",          "role": null },
			{ "id": 68602,  "name": "Spongiform",        "role": null },
			{ "id": 80392,  "name": "womais",            "role": null },
			{ "id": 81736,  "name": "redbirb3",          "role": null },
			{ "id": 118013, "name": "flupp7",            "role": null },
			{ "id": 102396, "name": "IIlllllII",         "role": null },
			{ "id": 10340,  "name": "CoughSyrup",        "role": null },
			{ "id": 79631,  "name": "Boxxy420",          "role": null },
			{ "id": 78148,  "name": "demong",            "role": null },
			{ "id": 98019,  "name": "SpaceSatyaDivine",  "role": null },
			{ "id": 132814, "name": "handle",            "role": null },
			{ "id": 135358, "name": "h0tc0wture",        "role": null },
			{ "id": 136740, "name": "Gaol",              "role": null },
			{ "id": 133560, "name": "1166",              "role": null },
			{ "id": 149975, "name": "elfin161",          "role": null },
			{ "id": 61300,  "name": "SolarSam",          "role": null },
			{ "id": 1499,   "name": "Zdaz",              "role": null },
			{ "id": 163042, "name": "Metzli",            "role": null },
			{ "id": 225767, "name": "Insofferenza",      "role": null },
			{ "id": 159317, "name": "Styxie",            "role": null },
			{ "id": 117688, "name": "hihi2",             "role": null },
			{ "id": 192809, "name": "nomii",             "role": null },
			{ "id": 131334, "name": "LykeMoo",           "role": null },
			{ "id": 117684, "name": "kestesja",          "role": null },
			{ "id": 177928, "name": "Nyhm",              "role": null },
			{ "id": 119075, "name": "Lyron",             "role": null },
			{ "id": 158392, "name": "Sicariex",          "role": null },
			{ "id": 194262, "name": "GooseHouse",        "role": null },
			{ "id": 197019, "name": "Divinity",          "role": null },
			{ "id": 255970, "name": "SilkyPanda",        "role": null },
			{ "id": 281729, "name": "noxveiI",           "role": null },
			{ "id": 281803, "name": "MomBunny",          "role": null },
			{ "id": 84488,  "name": "sparklecats7",      "role": null },
			{ "id": 115441, "name": "Joethedestroyer",   "role": null },
	];

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

	function addEventListener (selector, event, handler) {
		let targetEl = null;
		function check () {
			const el = document.querySelector(selector);
			if (targetEl == el) {
				// Check later
				setTimeout(check, 1000);
			} else {
				// Resubscribe
				targetEl = el;
				targetEl.addEventListener(event, handler);
			}
		}
		check();
	}

	async function onMembersClick () {
		const tableEl = await waitFor(".GuildPanel_membersTable__1NwIX");

		if (tableEl.classList.contains("userscript-guild-roles")) {
			return; // Already modded
		}

		const trEls = tableEl.querySelectorAll("tbody tr");

		trEls.forEach((trEl) => {
			const nameEl = trEl.children[0];
			const name = nameEl.textContent;
			const id = nameToId[name];
			const roleEl = trEl.children[1];

			const customRole = data.find((d) => d.id == id)?.role;
			if (customRole) {
				roleEl.textContent = customRole;
			}
		});

		tableEl.classList.add("userscript-guild-roles")
	}

	async function onGuildClick () {
		await waitFor(".GuildPanel_tabsComponentContainer__1JjQu");

		const membersTabEl = document.querySelector(".GuildPanel_tabsComponentContainer__1JjQu .MuiButtonBase-root:nth-child(2)");
		membersTabEl.addEventListener("click", onMembersClick);
	}

	let ownGuildName;
	let ownGuildID;
	let nameToId = {};

	function handle (message) {
		if (message.type == "init_character_data") {
			//console.log(message);

			const name = message.guild.name;

			ownGuildName = name;

			const guildID = Object.values(message.guildCharacterMap)[0].guildID;

			ownGuildID = guildID;

			Object.entries(message.guildSharableCharacterMap).forEach(([characterID, d]) => {
				nameToId[d.name] = characterID;
			});
		}
	}

	// Need to use unsafeWindow in Guild XP to avoid a conflict?
	const OriginalWebSocket = window.WebSocket;
	const WrappedWebSocket = function (...args) {
		const ws = new OriginalWebSocket(...args)

		ws.addEventListener("message", function listener(e) {
			const message = JSON.parse(e.data);
			handle(message);

			// Once
			ws.removeEventListener("message", listener);
		});

		return ws;
	};
	window.WebSocket = WrappedWebSocket;

	addEventListener(`.NavigationBar_navigationLink__3eAHA:has(svg[aria-label="navigationBar.guild"])`, "click", onGuildClick);

	console.log("Custom guild roles: Wrapped window.WebSocket");
})();
