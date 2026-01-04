// ==UserScript==
// @name        GazelleGames pet leveling info
// @namespace   v3rrrr82xk1c96vvo1c6
// @match       https://gazellegames.net/user.php?id=*
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.deleteValue
// @version     1.3.4
// @description Adds pet leveling info to your own profile page
// @author      lunboks
// @run-at      document-start
// @inject-into content
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/438839/GazelleGames%20pet%20leveling%20info.user.js
// @updateURL https://update.greasyfork.org/scripts/438839/GazelleGames%20pet%20leveling%20info.meta.js
// ==/UserScript==

(async function () {
	"use strict";


	const theirUserID = new URLSearchParams(location.search).get("id");
	const ownUserID = await GM.getValue("you").then((yourID) => {
		// Own ID is cached
		if (yourID) {
			return yourID;
		}

		// Not cached, get it from page once it's loaded
		return new Promise((resolve) => {
			window.addEventListener("DOMContentLoaded", () => {
				yourID = new URLSearchParams(document.body.querySelector("#nav_userinfo a.username").search).get("id");
				GM.setValue("you", yourID);
				resolve(yourID);
			});
		});
	});


	// Only runs on your own user page
	if (theirUserID !== ownUserID) {
		return;
	}


	let apiKey = await GM.getValue("apiKey");

	if (!apiKey) {
		if (!(apiKey = prompt("Please enter an API key with the 'Items' permission to use this script.")?.trim())) {
			return;
		}
		GM.setValue("apiKey", apiKey);
	}


	const endpoint = "https://gazellegames.net/api.php?request=items&type=users_equipped&include_info=true";
	const options = {
		method: "GET",
		mode: "same-origin",
		credentials: "omit",
		redirect: "error",
		referrerPolicy: "no-referrer",
		headers: {
			"X-API-Key": apiKey
		}
	};


	const equipment = await (await fetch(endpoint, options)).json();

	if (equipment.status !== "success") {
		if (equipment.status === 401) {
			GM.deleteValue("apiKey");
		}
		return;
	}


	function toInt(value) {
		return (typeof value === "number") ? value : parseInt(value, 10);
	}


	// Hardcoded IDs of XP-gaining pets.
	// We display these even if they have 0 XP, which we otherwise
	// cannot distinguish from non-leveling pets.
	const levelingPetIDs = new Set(["2509","2510","2511","2512","2513","2514","2515","2521","2522","2523","2524","2525","2529","2583","2927","2928","2929","2933","3215","3216","3237","3322","3323","3324","3369","3370","3371","3373"]);

	const pets = [];

	for (const equip of equipment.response) {
		const type = equip.item.equipType;

		if (type && String(type) === "18" && (levelingPetIDs.has(equip.itemid) || equip.experience > 0)) {
			pets.push({
				name: equip.item.name,
				xp: toInt(equip.experience),
				lv: toInt(equip.level),
				id: String(equip.itemid),
				slot: toInt(equip.slotid)
			});
		}
	}

	if (!pets.length) return;


	// Sort by slot ID for consistent ordering.
	pets.sort((first, second) => first.slot - second.slot);


	// Build our HTML structure.
	// CSS classes copied from the "Personal" box
	const box = document.createElement("div");
	const innerBox = document.createElement("div");
	const list = document.createElement("ul");
	const heading = document.createElement("div");

	box.className = "box_personal_history";
	innerBox.className = "box";
	heading.className = "head colhead_dark";
	list.className = "stats nobullet";
	list.style.lineHeight = "1.5";

	heading.append("Pet Leveling");
	innerBox.append(heading, list);
	box.append(innerBox);


	function totalXP(lv) {
		return Math.ceil((lv * lv * 625) / 9);
	}


	function xpToTimeString(xp) {
		const days = Math.floor(xp / 24);
		const hours = xp % 24;
		let timeString = "";

		if (days) {
			const s = (days === 1) ? "" : "s";
			timeString = `${days} day${s}`;
		}
		if (hours) {
			if (timeString) {
				timeString += " ";
			}
			const s = (hours === 1) ? "" : "s";
			timeString += `${hours} hour${s}`;
		} else if (!timeString) {
			timeString = "0 hours"; // ???
		}

		return timeString;
	}


	const listItems = [];

	pets.forEach((pet, index) => {
		const liItem = document.createElement("li");
		const liLevelInput = document.createElement("li");
		const liTimeOutput = document.createElement("li");
		const shopLink = document.createElement("a");

		// Spacing between pets
		if (index > 0) {
			liItem.style.marginTop = "0.6em";
		}

		// Indent the level/time lines
		liLevelInput.style.paddingLeft = "10px";
		liTimeOutput.style.paddingLeft = "10px";


		shopLink.style.fontWeight = "bold";
		shopLink.href = `/shop.php?ItemID=${pet.id}`;
		shopLink.referrerPolicy = "no-referrer";
		shopLink.title = "Shop for this pet";


		const nextLevel = pet.lv + 1;

		const targetLevelInput = document.createElement("input");
		targetLevelInput.type = "number";
		targetLevelInput.required = true;
		targetLevelInput.inputmode = "numeric";
		targetLevelInput.style.width = "3em";
		targetLevelInput.min = nextLevel;
		targetLevelInput.max = Math.max(999, nextLevel);
		targetLevelInput.value = nextLevel;

		const displayTimeDifference = (toLevel) => {
			const missingXP = totalXP(toLevel) - pet.xp;
			liTimeOutput.textContent = xpToTimeString(missingXP);
		};


		// Display initial info
		displayTimeDifference(nextLevel);

		// When the user types anything, update if it's valid.
		targetLevelInput.addEventListener("input", function () {
			if (this.checkValidity()) {
				displayTimeDifference(parseInt(this.value, 10));
			}
		});

		// When the user commits a new value, complain if it's invalid.
		// No idea why setTimeout is needed tbh
		targetLevelInput.addEventListener("change", function () {
			setTimeout(() => {
				if (!this.reportValidity()) {
					liTimeOutput.textContent = "";
				}
			});
		});


		shopLink.append(pet.name);
		liItem.append(shopLink);
		liLevelInput.append(`Level ${pet.lv} → `, targetLevelInput);


		listItems.push(liItem, liLevelInput, liTimeOutput);
	});


	list.append(...listItems);


	// Try to insert our UI
	function insert() {
		document.getElementsByName("user_info")[0]?.after(box);
		return box.isConnected;

	}

	if (!insert()) {
		window.addEventListener("DOMContentLoaded", insert);
	}
})();
