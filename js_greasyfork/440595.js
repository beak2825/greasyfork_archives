// ==UserScript==
// @name        GazelleGames equipment durability info
// @namespace   8n9ve1ockfqbr82qlwc12i
// @match       https://gazellegames.net/user.php?id=*
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.deleteValue
// @version     1.0.1
// @description Adds equipment durability info to your own profile page
// @author      lunboks
// @run-at      document-start
// @inject-into content
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/440595/GazelleGames%20equipment%20durability%20info.user.js
// @updateURL https://update.greasyfork.org/scripts/440595/GazelleGames%20equipment%20durability%20info.meta.js
// ==/UserScript==

(async function () {
	"use strict";

	// Mark items with less than x hours remaining
	const HOURS_WARNING = 24;

	// Log API response
	const DEBUG = false;


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


	function plural(n) {
		return (n === 1) ? "" : "s";
	}


	const tsUnits = new Map();
	tsUnits.set("day", 86_400_000)
		.set("hour",    3_600_000)
		.set("minute",     60_000)
		.set("second",      1_000)
		.set("millisecond",     1);


	// Converts milliseconds to something like "4 days 3 hours"
	function millisToTimeString(ms) {
		let unit;

		// Find highest applicable unit
		for (const [key, value] of tsUnits) {
			if (ms >= value) {
				unit = key;
				break;
			}
		}

		const amount = Math.floor(ms / tsUnits.get(unit));
		let timeString = `${amount} ${unit}${plural(amount)}`;

		// Special case - add hours after days
		if (unit === "day") {
			const hours = Math.floor(ms / tsUnits.get("hour")) % 24;
			if (hours) {
				timeString += ` ${hours} hour${plural(hours)}`;
			}
		}

		return timeString;
	}


	if (DEBUG) {
		console.log("Equipment API response", JSON.stringify(equipment));
	}


	const slotNames = {
		"1":   "Helmet",
		"2":   "Upper Body",
		"3":   "Arms",
		"4":   "Legs",
		"5":   "Hands",
		"6":   "Foot",
		"7":   "Left-Hand Weapon",
		"8":   "Right-Hand Weapon",
		// special cases for 2-handed weapons
		"7,8": "Two-Handed Weapon",
		"8,7": "Two-Handed Weapon",
		"9":   "Necklace",
		"10":  "Left-Hand Ring",
		"11":  "Right-Hand Ring",
		"12":  "Back",
		"13":  "Clothes",
		"14":  "Right-Side Pet",
		"15":  "Left-Side Pet"
	};

	// Map equipment by unique ID because the same item can
	// show up multiple times if it occupies multiple slots.
	let breakableEquipment = new Map();
	const now = Date.now();

	for (const equip of equipment.response) {
		let breakTime = equip.breakTime;
		if (breakTime && breakTime !== "NULL") {
			const uniqueID = equip.equipid;
			const existingItem = breakableEquipment.get(uniqueID);

			if (existingItem) {
				// Multi-slot item, add slot to existing entry
				existingItem.slot += `,${equip.slotid}`;
			} else {
				// The API doesn't return a proper date with a time zone so try to force UTC idk
				breakTime = Date.parse(`${breakTime}Z`) || Date.parse(breakTime);

				if (breakTime) {
					breakableEquipment.set(uniqueID, {
						name: equip.item.name,
						id: String(equip.itemid),
						breakTime: new Date(breakTime).toLocaleString(),
						timeLeft: breakTime - now,
						slot: String(equip.slotid)
					});
				}
			}
		}
	}

	if (breakableEquipment.size < 1) return;

	// Convert to array and sort by break time ascending
	breakableEquipment = Array.from(breakableEquipment.values());
	breakableEquipment.sort((first, second) => first.timeLeft - second.timeLeft);


	const box = document.createElement("div");
	box.className = "box";

	const heading = document.createElement("div");
	heading.className = "head colhead_dark";

	const headerLink = document.createElement("a");
	headerLink.href = "/user.php?action=equipment";
	headerLink.referrerPolicy = "no-referrer";
	headerLink.append("Equipment Durability");
	headerLink.title = "Your active equipment that's breakable";

	const list = document.createElement("ul");
	list.className = "stats nobullet";

	heading.append(headerLink);
	box.append(heading, list);


	const cutoffWarn = HOURS_WARNING * tsUnits.get("hour");
	const warningMsg = `Item durability less than ${HOURS_WARNING} hour${plural(HOURS_WARNING)}`;

	const listItems = [];

	breakableEquipment.forEach((equip, index) => {
		const itemName = document.createElement("li");
		const itemStatus = document.createElement("li");

		itemStatus.style.paddingLeft = "10px";

		// Don't add margin spacing to the first item
		if (index > 0) {
			itemName.style.marginTop = "0.6em";
		}

		const itemLink = document.createElement("a");
		itemLink.style.fontWeight = "bold";
		itemLink.href = `/shop.php?ItemID=${equip.id}`;
		itemLink.referrerPolicy = "no-referrer";
		itemLink.title = "Shop for this item";
		itemLink.append(equip.name);

		itemName.append(itemLink);

		listItems.push(itemName);

		const slotName = slotNames[equip.slot];
		if (slotName) {
			const slotDesc = document.createElement("li");
			slotDesc.title = `Slot ID ${equip.slot}`;
			slotDesc.style.fontSize = "smaller";
			slotDesc.append(slotName);
			listItems.push(slotDesc);
		}


		const timeSpan = document.createElement("span");
		timeSpan.title = equip.breakTime;

		if (equip.timeLeft > 0) {
			timeSpan.append(millisToTimeString(equip.timeLeft));
			itemStatus.append(timeSpan, " left");
		} else {
			timeSpan.append("already broken!");
			itemStatus.append(timeSpan);
		}

		if (equip.timeLeft < cutoffWarn) {
			const warningSpan = document.createElement("span");
			warningSpan.title = warningMsg;
			warningSpan.append("⚠️");
			itemStatus.append(" ", warningSpan);
		}

		listItems.push(itemStatus);
	});

	list.append(...listItems);


	function insert() {
		document.getElementsByName("user_info")[0]?.after(box);
		return box.isConnected;
	}

	if (!insert()) {
		window.addEventListener("DOMContentLoaded", insert);
	}
})();
