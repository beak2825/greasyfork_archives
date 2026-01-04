// ==UserScript==
// @name         Bazaar Price Check
// @namespace    https://www.torn.com/profiles.php?XID=1936821
// @version      2.1
// @description  Check for cheap bazaar prices in the background.
// @author       TheFoxMan
// @match        https://www.torn.com/*
// @run-at       document-end
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/494164/Bazaar%20Price%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/494164/Bazaar%20Price%20Check.meta.js
// ==/UserScript==
// jshint esversion: 11

const APIKEY = "mvGr8pKJ7gdSdOzN";
const itemIDs = {
	// Format:
	// ItemID:<space>Price<comma>
330: 445000000,
331: 445000000,
329: 430000000,
106: 445000000,
1297: 230000000,
367: 12300000,
370: 4150000,
366: 3600000,
206: 840000,
818: 15000000,
};
const timeInMinutes = 0.5;
const itemNames = {
330: "Gloves",
331: "Dumbells",
329: "Skate",
106: "Parachute",
1297: "Donkey",
367: "FHc",
370: "Drug Pack",
366: "EDVD",
206: "XAN",
818: "SixPackE",
};

// Script code beyond.
// Just don't edit if you don't know what you are doing.


const LASTCHECKED = "lastCheckTimeKey__BGPC_Userscript__Do_Not_Edit";
let addedStyles = false;

if (!GM_getValue)
	function GM_getValue(key, defaultValue = null) {
		return window.localStorage.getItem(key) ?? defaultValue;
	}

if (!GM_setValue)
	function GM_setValue(key, value) {
		window.localStorage.setItem(key, value);
	}

func();
setInterval(func, timeInMinutes * 60 * 1000);

async function func() {
	const lastChecked = parseInt(GM_getValue(LASTCHECKED, 0));
	if (Date.now() - lastChecked >= timeInMinutes * 60 * 1000) {
		// Add styles
		if (!addedStyles) {
			document.head.insertAdjacentHTML(
				"beforeend",
				`<style>
					#cheapItems {
						overflow: auto;
						background-color: #666;
						border-color: #333;
						position: fixed;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
						font-size: 16px;
						z-index: 999999;
						color: #fff;
						border-radius: 10px;
					}

					#cheapItems a {
						color: #74c0fc;
						text-decoration: none;
					}

					#cheapItems button {
						color: #74c0fc;
						background-color: #333;
						margin-top: 5px;
						border-radius: 5px;
						float: right;
						padding: 5px 10px;
					}

					#cheapItems green {
						display: inline;
						color: #a7d364;
					}
				</style>`
			);
			addedStyles = true;
		}

		const cheapItems = [];
		Promise.allSettled(Object.entries(itemIDs).map(async ([itemID, cost]) => {
			const details = await (await fetch(`https://api.torn.com/market/${itemID}?selections=bazaar,itemmarket&key=${APIKEY}`)).json();

			const cheapBazaarItems = details?.bazaar?.filter((bazaarData) => bazaarData.cost < cost);
			const cheapIMarketItems = details?.itemmarket?.filter((imarketData) => imarketData.cost < cost);

			if (cheapBazaarItems.length || cheapIMarketItems.length) {
				const cheapestItemProfit = Math.max(
											Math.abs(cost - (cheapBazaarItems?.[0]?.cost ?? 0)),
											Math.abs(cost - (cheapIMarketItems?.[0]?.cost ?? 0))
									);
				const cheapestItemPrice = Math.min((cheapBazaarItems?.[0]?.cost ?? 0), (cheapIMarketItems?.[0]?.cost ?? 0));
				cheapItems.push(`<a href="https://www.torn.com/imarket.php#/p=shop&step=shop&type=${itemID}">${itemNames[itemID] || "Item " + itemID}</a> - <green>$${cheapestItemPrice}</green>`);
			}
		}))
		.then(() => {
			if (cheapItems.length)
				showCheapItems(cheapItems);
			GM_setValue(LASTCHECKED, Date.now());
		});
	}
}

function showCheapItems(cheapItems) {
	// alert("Found items: ", JSON.stringify(cheapItems));
	let dialogEl = document.querySelector("#cheapItems");
	if (!dialogEl)
		dialogEl = getElement(
		`<dialog id="cheapItems">
			<div>The following cheap items were found:</div>
			<div>
				<ul>
					${"<li>" + cheapItems.join("</li><li>") + "</li>"}
				</ul>
			</div>
			<button>OK</button>
		</dialog>`);
	else
		dialogEl.querySelector("ul").innerHTML = "<li>" + cheapItems.join("</li><li>") + "</li>";
	document.body.insertAdjacentElement("beforeend", dialogEl);
	if (cheapItems.length) dialogEl.show();
	dialogEl.querySelector("button").addEventListener("click", () => dialogEl.remove());
}

function getElement(rawHTML) {
	const template = document.createElement("template");
	template.innerHTML = rawHTML;
	return template.content.firstElementChild;
}