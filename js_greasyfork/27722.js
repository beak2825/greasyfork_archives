// ==UserScript==
// @name		DH2QoL
// @namespace	https://greasyfork.org/
// @version		0.1.9
// @description	Quality of Life tweaks for Diamond Hunt 2
// @author		John
// @match		http://*.diamondhunt.co/game.php
// @match		https://*.diamondhunt.co/game.php
// @run-at document-idle
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/27722/DH2QoL.user.js
// @updateURL https://update.greasyfork.org/scripts/27722/DH2QoL.meta.js
// ==/UserScript==
(function() {
'use strict';

const DEFAULT_CONFIG = {
	bool : {
		enhancedNotifications : {
			text : "Use persistent notifications with enhanced functionality?",
			value : true
		},
		enableRightClickFurnaceRepeat : {
			text : "Enable right clicking bound furnace to repeat last action?",
			value : true
		},
		enableBatchCommands : {
			text : "Enable batch commands (right click to cook all, eat all, brew all, craft all, etc)?",
			value : true
		},
		disableUnequipInCombat : {
			text : "Disable unequip in combat?",
			value : true
		},
		disableLeftClickSellGems : {
			text : "Disable selling gems on left click?",
			value : true
		},
		disableLeftClickSellCraftingSupplies : {
			text : "Disable selling crafting supplies on left click?",
			value : true
		},
		stardustMonitor : {
			text : "Use stardust monitor?",
			value : true
		},
		updateOilTimer : {
			text : "Add oil timer & oil gains/consumption info?",
			value : true
		}/*,
		linkify : {
			text : "Make chat links clickable?",
			value : true
		}*/
	},

	enablePotionMonitor : true,
	enablePotionHelper : true,
	monitoredPotions : ["stardustPotion", "superStardustPotion"],
};
const CONFIG = JSON.parse(window.localStorage.getItem("dh2qol-config")) || DEFAULT_CONFIG;
const SMELTING = {
	lastCurrentAmount : -1,
	lastTimer : -1,
	lastRealTime : -1
};
const TREES = {
	"1" : {
		"id" : "1",
		"variable" : "tree",
		"name" : "Tree",
		"growTime" : 10800 // 3 hours
	},
	"2" : {
		"id" : "2",
		"variable" : "oakTree",
		"name" : "Oak Tree",
		"growTime" : 21600 // 6 hours
	},
	"3" : {
		"id" : "3",
		"variable" : "willowTree",
		"name" : "Willow Tree",
		"growTime" : 28800 // 8 hours
	},
	"4" : {
		"id" : 4,
		"variable" : "mapleTree",
		"name" : "Maple Tree",
		"growTime" : 43200 // 12 hours
	},
	"5" : {
		"id" : "5",
		"variable" : "stardustTree",
		"name" : "Stardust Tree",
		"growTime" : 57600 // 16 hours
	},
	"6" : {
		"id" : 6,
		"variable" : "essenceTree",
		"name" : "Essence Tree",
		"growTime" : 72000 // 20 hours
	}
};

const MONITORED_POTIONS = ["stardustPotion", "superStardustPotion"];
const STARDUST_MONITOR = {
	lastStardust : -1,
	monitorTicks : 0
};

(function init(triesLeft) {

	// Thanks /u/TheZorbing
	if (triesLeft > 0 && (!window.hasOwnProperty("webSocket") || window.webSocket.readyState !== WebSocket.OPEN || window.firstLoadGame === true)) {
		setTimeout(() => {
			init(--triesLeft);
		}, 100);
		return;
	}

	if (window.hasOwnProperty("webSocket") && window.webSocket.readyState === WebSocket.OPEN && !window.firstLoadGame) {
		console.log(`Launching DH2QoL. Welcome ${window.username}! Thanks for using DH2QoL`);
		processDormantTabsOnLoad();
		try {
			if (CONFIG.bool.enableBatchCommands) {
				enableRightClickFurnaceRepeat();
				//enableRightClickBrewAllPotion();
				enableRightClickCookAllFood();
				//enableRightClickEatAllFood();
				//enableRightClickCraftAll();
			}
			if (CONFIG.bool.disableUnequipInCombat)
				//disableUnequipInCombat();
			if (CONFIG.bool.disableLeftClickSellCraftingSupplies)
				disableLeftClickSellCraftingSupplies();
			if (CONFIG.bool.disableLeftClickSellGems)
				disableLeftClickSellGems();
		} catch (e) {
			console.log("DH2QoL: Failed to implement some left and right click functionality to certain elements:");
			console.log(e);
		}
		try {
			// Interface delight
			updateStyleSheets();
			//addSettingsElement();
			addNotificationElements();
			addOilTimerElements();
			addStardustMonitorElement();
		} catch (e) {
			console.log("DH2QoL: Failed update the stylesheet and document with new notifications:");
			console.log(e);
		}
		try {
			// Proxies
			proxyWebSocketOnMessage();
			proxyAddToChatBox();
			proxyConfirmDialogue();
			proxyProcessWoodcuttingTab();
			replaceDHNativeFormatTime();
		} catch(e) {
			console.log("DH2QoL: Failed to proxy some functions:");
			console.log(e);
		}
	} else {
		console.log(`Something went wrong, DH2QoL Failed to initialize. WebSockets: ${(window.hasOwnProperty("webSocket") && window.webSocket.readyState === WebSocket.OPEN)} First Load: ${window.firstLoadGame}`);
	}

	return;
})(100);

/*
	Actions performed following any game tick
*/
function postGameTick() {
	try {estimateSmeltingTimer();} catch (e) {console.log(e);} // This must come before smelting notification & timer updates
	try {updateNotificationElements();} catch (e) {console.log(e);}
	try {
		updateSmeltingTimer();
		updateWoodcuttingTimers();
	} catch (e) {console.log(e);}
	try {updateStardustMonitor();} catch (e) {console.log(e);}
	try {updateOilTimer()} catch (e) {console.log(e);}
}

/*
	Adds the DH2QoL settings button to the profile & settings page
*/
function addSettingsElement() {
	let node = document.getElementById("profile-toggleTable");
	if (node && node.parentNode) {
		let span = document.createElement("span");
		span.id = "dh2qol-settingsLink";
		span.style.cursor = "pointer";
		span.style.color = "white";
		span.textContent = "Open DH2QoL Settings";
		span.onclick = openSettings;
		node.parentNode.appendChild(document.createElement("br"));
		node.parentNode.appendChild(span);
		node.parentNode.appendChild(document.createElement("br"));
	}
}

function openSettings() {
	let newWindow = window.open();
	newWindow.CONFIG = CONFIG;
	newWindow.document.title = "DH2QoL Settings";
	newWindow.document.body.style.backgroundColor = "black";
	newWindow.document.body.style.color = "white";
	newWindow.document.body.innerHTML = `\<div>
	\<span style='font-size:22;'>DH2QoL Settings\</span>\<br>
	\<span>\<p>Most settings changes will require that Diamond Hunt be refreshed before taking effect. Clearing browser cache will reset settings to their default.\<p>\</span>
	\</div>
	\<div>`;

	const KEYS = Object.keys(newWindow.CONFIG.bool);
	KEYS.forEach((key) => {
		newWindow.document.body.innerHTML += `\<p>
		\<input type="checkbox" id="checkbox-${key}" checked="${newWindow.CONFIG.bool[key].value}" onchange="changeBoolSetting('${key}', this.checked);">
  		\<label for="checkbox-${key}">${newWindow.CONFIG.bool[key].text}\</label>
		\</p>`
	});

	newWindow.document.body.innerHTML += `\</div>`;

	newWindow.changeBoolSetting = function(settingPropertyName, val) {
		if (newWindow.CONFIG && newWindow.CONFIG.bool[settingPropertyName]) {
			newWindow.CONFIG.bool[settingPropertyName].value = val;
		}
	};

	newWindow.saveSettings = function() {
		newWindow.close();
	};
}

/*
	Loads initial data for unopened tabs
*/
function processDormantTabsOnLoad() {
	window.processCraftingTab();
	window.processBrewingTab();
}

/*
	Update the game-main-style.css styleSheet
	Delete then update the span.notif-box rule, and add our dhqol-notif-ready rule
*/
function updateStyleSheets() {
	for (let styleSheet of document.styleSheets) {
		if (styleSheet.href && styleSheet.href.indexOf("game-main-style.css") !== -1) {
			if (styleSheet.cssRules) {
				for (let index in styleSheet.cssRules) {
					let cssRule = styleSheet.cssRules[index];
					if (cssRule.selectorText && cssRule.selectorText.indexOf("span.notif-box") !== -1) {
						styleSheet.deleteRule(index); // Delete the original span.notif-box rule
						styleSheet.insertRule(`span.notif-box
							{
								display:inline-block;
								margin:5px 5px 5px 0px;
								color:white;
								border:1px solid silver;
								padding:5px 10px;
								font-size:12pt;
								background: -webkit-linear-gradient(#801A00, #C15033); /* For Safari 5.1 to 6.0 */
								background: -o-linear-gradient(#801A00, #C15033); /* For Opera 11.1 to 12.0 */
								background: -moz-linear-gradient(#801A00, #C15033); /* For Firefox 3.6 to 15 */
								background: linear-gradient(#801A00, #C15033); /* Standard syntax */
							}`, 0);
						styleSheet.insertRule(`span.dhqol-notif-ready
							{
								display:inline-block;
								margin:5px 5px 5px 0px;
								color:white;
								border:1px solid silver;
								padding:5px 5px;
								font-size:12pt;
								cursor:pointer;
								background: -webkit-linear-gradient(#801A00, #C15033);
								background: -o-linear-gradient(#801A00, #C15033);
								background: -moz-linear-gradient(#801A00, #C15033);
								background: linear-gradient(#161618, #48ab32);
							}`, 0);
					}
				}
			}
			break;
		}
	}
}

/*
	Create and add our custom DH2QoL persistent notification elements to the document
*/
function addNotificationElements() {
	const SPAN = document.createElement("span");
	SPAN.className = "dhqol-notif-ready";
	SPAN.style = "display:inline-block";
	SPAN.appendChild(document.createElement("img"));
	SPAN.children[0].className = "image-icon-50";
	SPAN.appendChild(document.createElement("span"));

	let notificationNode = document.getElementById("notifaction-area");
	let refNode = notificationNode.children[0] || null;

	// Create our new notification span elements
	let furnaceElement = SPAN.cloneNode(true);
	furnaceElement.id = "dhqol-notif-furnace";
	furnaceElement.children[0].setAttribute("src", "images/silverFurnace.png");
	let woodCuttingElement = SPAN.cloneNode(true);
	woodCuttingElement.id = "dhqol-notif-woodcutting";
	woodCuttingElement.children[0].setAttribute("src", "images/icons/woodcutting.png");
	let farmingElement = SPAN.cloneNode(true);
	farmingElement.id = "dhqol-notif-farming";
	farmingElement.children[0].setAttribute("src", "images/icons/watering-can.png");
	let combatElement = SPAN.cloneNode(true);
	combatElement.id = "dhqol-notif-combat";
	combatElement.children[0].setAttribute("src", "images/icons/combat.png");
	let rowBoatElement = SPAN.cloneNode(true);
	rowBoatElement.id = "dhqol-notif-rowboat";
	rowBoatElement.children[0].setAttribute("src", "images/rowBoat.png");
	let canoeElement = SPAN.cloneNode(true);
	canoeElement.id = "dhqol-notif-canoe";
	canoeElement.children[0].setAttribute("src", "images/canoe.png");
	let vialElement = SPAN.cloneNode(true);
	vialElement.id = "dhqol-notif-vial";
	vialElement.children[0].setAttribute("src", "images/vialOfWater.png");
	vialElement.setAttribute("onclick", "window.openTab('brewing');");
	/*
	vialElement.oncontextmenu = function() {
		drinkMonitoredPotions();
		return false;
	};
	*/
	// Insert our new elements into the document
	notificationNode.insertBefore(furnaceElement, refNode);
	notificationNode.insertBefore(woodCuttingElement, refNode);
	notificationNode.insertBefore(farmingElement, refNode);
	notificationNode.insertBefore(combatElement, refNode);
	notificationNode.insertBefore(rowBoatElement, refNode);
	notificationNode.insertBefore(canoeElement, refNode);
	notificationNode.insertBefore(vialElement, refNode);
}

function updateNotificationElements() {
	// Hide native DH2 notifications
 	const NOTIFICATION_IDS = ["notification-static-farming", "notification-static-woodcutting", "notification-static-combat", "notif-smelting", "notif-rowBoatTimer", "notif-canoeTimer"];
	NOTIFICATION_IDS.forEach((id) => {
			let node = document.getElementById(id);
			if (node)
				node.style.display = "none";
	});

	// Update DH2QoL Custom notifications based on gamestate
	let furnaceElement = document.getElementById("dhqol-notif-furnace");
	furnaceElement.style.display = window.craftingUnlocked == 1 ? "inline-block" : "none";
	if (window.smeltingBarType == 0) {
		furnaceElement.className = "dhqol-notif-ready";
		furnaceElement.children[0].setAttribute("src", "images/silverFurnace.png");
		furnaceElement.children[1].textContent = "";
		furnaceElement.onclick = function() {
			window.openTab("crafting");
			if (getBoundFurnace() !== "") {
				window.openFurnaceDialogue(getBoundFurnace());
			}
		};
		furnaceElement.oncontextmenu = function() {
			furnaceRepeat();
			return false;
		};
	} else {
		furnaceElement.className = "notif-box";
		furnaceElement.children[0].setAttribute("src", `images/${window.getBarFromId(window.smeltingBarType)}.png`);
		furnaceElement.children[1].textContent = `${formatTime(SMELTING.lastTimer / 1000)} (${window.smeltingPerc}%)`;
		furnaceElement.setAttribute("onclick", "");
	}
	let woodCuttingElement = document.getElementById("dhqol-notif-woodcutting");
	woodCuttingElement.style.display = window.woodcuttingUnlocked == 1 ? "inline-block;" : "none";
	if (window.treeStage1 == 4 || window.treeStage2 == 4 || window.treeStage3 == 4 || window.treeStage4 == 4 || window.treeStage5 == 4 || window.treeStage6 == 4) {
		woodCuttingElement.className = "dhqol-notif-ready";
		woodCuttingElement.children[1].textContent = "";
		woodCuttingElement.setAttribute("onclick", "window.openTab('woodcutting')");
		/*
		woodCuttingElement.oncontextmenu = function() {
			harvestTrees();
			return false;
		};
		*/
	} else {
		let gt = getSoonestWoodcuttingTimer();
		woodCuttingElement.className = "notif-box";
		woodCuttingElement.children[1].textContent = gt === null ? "" : formatTime(gt);
		woodCuttingElement.setAttribute("onclick", "");
	}
	let farmingElement = document.getElementById("dhqol-notif-farming");
	farmingElement.style.display = window.farmingUnlocked == 1 ? "inline-block" : "none";
	if (window.farmingPatchStage1 == 0 || window.farmingPatchStage1 == 4 || window.farmingPatchStage2 == 0 || window.farmingPatchStage2 == 4
		|| window.farmingPatchStage3 == 0 || window.farmingPatchStage3 == 4 || window.farmingPatchStage4 == 0 || window.farmingPatchStage4 == 4
		|| (window.donorFarmingPatch >= window.currentTimeMillis && (window.farmingPatchStage5 == 0 || window.farmingPatchStage5 == 4 || window.farmingPatchStage6 == 0 || window.farmingPatchStage6 == 4))) {
			farmingElement.className = "dhqol-notif-ready";
			farmingElement.setAttribute("onclick", "openTab('farming')");
			farmingElement.children[1].textContent = "";
			farmingElement.oncontextmenu = function() {
				if (window.planter == 1) {
					window.openFarmingPatchDialogue(-1);
					return false;
				}
			};
		} else {
			farmingElement.className = "notif-box";
			farmingElement.setAttribute("onclick", "");
			farmingElement.children[1].textContent = formatTime(getSoonestFarmingTimer());
		}

	let combatElement = document.getElementById("dhqol-notif-combat");
	combatElement.style.display = window.combatUnlocked == 1 ? "inline-block" : "none";
	if (window.combatGlobalCooldown == 0) {
		combatElement.className = "dhqol-notif-ready";
		combatElement.children[1].innerHTML = '<img src="images/steak.png" style="" class="image-icon-15">' + parseInt(window.energy, 10).toLocaleString("en-US");
		combatElement.setAttribute("onclick", "window.openTab('combat'); window.openFightMenu()");
	} else {
		combatElement.className = "notif-box";
		combatElement.children[1].innerHTML = formatTime(window.combatGlobalCooldown);
		combatElement.setAttribute("onclick", "");
	}
	let rowBoatElement = document.getElementById("dhqol-notif-rowboat");
	let canoeElement = document.getElementById("dhqol-notif-canoe");
	// Only display one notification if a boat is at sea since you can only send out 1 boat
	rowBoatElement.style.display = window.boundRowBoat == 0 ? "none" : window.boundCanoe == 0 || window.canoeTimer == 0 ? "inline-block" : "none";
	canoeElement.style.display = window.boundCanoe == 0 ? "none" : window.boundRowBoat == 0 || window.rowBoatTimer == 0 ? "inline-block" : "none";
	if (window.rowBoatTimer == 0) {
		rowBoatElement.className = "dhqol-notif-ready";
		rowBoatElement.children[1].innerHTML = '<img class="image-icon-15" src="images/fishingBait.png">' + window.fishingBait;
		rowBoatElement.setAttribute("onclick", "window.clicksBoat('rowBoat')");
	} else {
		rowBoatElement.className = "notif-box";
		rowBoatElement.children[1].innerHTML = formatTime(window.rowBoatTimer);
		rowBoatElement.setAttribute("onclick", "w");
	}
	if (window.canoeTimer == 0) {
		canoeElement.className = "dhqol-notif-ready";
		canoeElement.children[1].innerHTML = '<img class="image-icon-15" src="images/fishingBait.png">' + window.fishingBait;
		canoeElement.setAttribute("onclick", "window.clicksBoat('canoe')");
	} else {
		canoeElement.className = "notif-box";
		canoeElement.children[1].innerHTML = formatTime(window.canoeTimer);
		canoeElement.setAttribute("onclick", "");
	}

	processPotionHelper();
}

function processPotionHelper() {
	let potions = getMonitoredPotionsToDrink();
	let vialElement = document.getElementById("dhqol-notif-vial");
	vialElement.style.display = (window.brewingUnlocked == 1 ? (potions.length > 0 ? "inline-block" : "none") : "none");
}

function getMonitoredPotionsToDrink() {
	let potions = [];
	MONITORED_POTIONS.forEach((monitoredPotion) => {
		if (window[monitoredPotion] > 0 && (window[monitoredPotion + "Timer"] !== undefined && window[monitoredPotion + "Timer"] == 0)) {
			potions.push(monitoredPotion);
		}
	});
	return potions;
}

function drinkMonitoredPotions() {
	let timeout = 0;
	MONITORED_POTIONS.forEach((monitoredPotion) => {
		if (window[monitoredPotion] > 0 && (window[monitoredPotion + "Timer"] !== undefined && window[monitoredPotion + "Timer"] == 0)) {
			setTimeout(() => {
				if (window[monitoredPotion + "Timer"] !== undefined && window[monitoredPotion + "Timer"] == 0)
					window.sendBytes("DRINK=" + monitoredPotion);
			}, timeout * 500);
			timeout++;
		}
	});
}

function addStardustMonitorElement() {
	let sdNode = document.querySelector("[data-item-display=stardust]");
	if (sdNode) {
		let parentNode = sdNode.parentNode;
		if (parentNode) {
			let newNode = document.createElement("span");
			newNode.id = "dh2qol-stardustMonitor";
			newNode.style.color = "orange";
			parentNode.appendChild(newNode);
		}
	}
}

function updateStardustMonitor() {
	let node = document.getElementById("dh2qol-stardustMonitor");
	if (node) {
		if (STARDUST_MONITOR.lastStardust !== -1 && window.stardust > STARDUST_MONITOR.lastStardust) {
			node.textContent = `(+${window.stardust - STARDUST_MONITOR.lastStardust})`;
			STARDUST_MONITOR.lastStardust = window.stardust;
			STARDUST_MONITOR.monitorTicks = 5;
		} else if (STARDUST_MONITOR.lastStardust == window.stardust && STARDUST_MONITOR.monitorTicks > 0) {
			STARDUST_MONITOR.monitorTicks--;
		} else {
			node.textContent = "";
			STARDUST_MONITOR.lastStardust = window.stardust;
		}
	}
}

function harvestTrees() {
	for (let i = 1; i <= 6; i++) {
		if (window["treeStage" + i] == 4) {
			setTimeout(() => {
				window.sendBytes("CHOP_TREE=" + i);
			}, i * 250);
		}
	}
	window.processWoodcuttingTab();
}

function enableRightClickFurnaceRepeat() {
	let nodes = document.querySelectorAll("[onclick^=openFurnaceDialogue]");
	nodes.forEach((node) => {
		if (node instanceof Node) {
			node.oncontextmenu = function() {
				let amt = document.getElementById("input-smelt-bars-amount").value;
				if (window.smeltingBarType == 0 && amt > 0 && window.selectedBar !== "none") {
					window.smelt(amt);
				}
				return false;
			};
		}
	});
}

function furnaceRepeat() {
	let amt = document.getElementById("input-smelt-bars-amount").value;
	if (window.smeltingBarType == 0 && amt > 0 && window.selectedBar !== "none") {
		window.smelt(amt);
	}
}

function enableRightClickBrewAllPotion() {
	const KEYS = Object.keys(window.brewingRecipes);
	KEYS.forEach((key) => {
		if (key === "stardustCrystalPotion") {
			return;
		}
		let recipe = window.brewingRecipes[key];
		let node = document.getElementById("brewing-" + key);
		if (node) {
			node.oncontextmenu = () => {
				let vials = window.vialOfWater;
				let total = vials;
				for (let i = 0; i < recipe.recipe.length; i++) {
					total = (total <= Math.floor(window[recipe.recipe[i]] / recipe.recipeCost[i])) ? total : Math.floor(window[recipe.recipe[i]] / recipe.recipeCost[i]);
				}
				if (total > 0) {
					window.sendBytes(`BREW=${recipe.itemName}~${total}`); // Adds existing left click functionality to right click of the element
					window.processBrewingTab();
				}
				return false;
			};
		}
	});
}

function enableRightClickCookAllFood() {
	document.querySelectorAll("[onclick^=cookFoodDialogue]").forEach((foodNode) => {
		let food = foodNode.id.indexOf("item-box-") != -1 && foodNode.id.split("item-box-")[1];
		if (food !== -1) {
			foodNode.oncontextmenu = function() {
				let amt = Math.min(Math.floor(window.ovenHeat/window.getHeatNeeded(food)), window[food]);
				if (amt > 0) {
					window.cook(food, amt);
				}
				return false;
			};
		}
	});
}

function enableRightClickEatAllFood() {
	document.querySelectorAll("[onclick^=eatFood]").forEach((foodNode) => {
		let food = foodNode.id.indexOf("item-box-") != -1 && foodNode.id.split("item-box-")[1];
		if (food !== -1) {
			foodNode.oncontextmenu = function() {
				window.sendBytes(`CONSUME=${food}~${window[food]}`); // Adds existing left click functionality to right click of the element
				return false;
			};
		}
	});
}

function enableRightClickCraftAll() {
	let node = document.getElementById("crafting-vialOfWater");
	if (node) {
		node.oncontextmenu = function() {
			let amt = Math.floor(window.glass / 5);
			if (amt > 0) {
				window.sendBytes("MULTI_CRAFT=vialOfWater~" + amt);
			}
			return false;
		};
	}
}

function disableLeftClickSellGems() {
		document.getElementById("item-box-sapphire").onclick = null;
		document.getElementById("item-box-emerald").onclick = null;
		document.getElementById("item-box-ruby").onclick = null;
		document.getElementById("item-box-diamond").onclick = null;
		document.getElementById("item-box-bloodDiamond").onclick = null;
}

function disableLeftClickSellCraftingSupplies() {
	let node = document.getElementById("tab-sub-container-crafting");
	if (node) {
		node.querySelectorAll("[onclick^=openSellNPCDialogue]").forEach((n) => {
			n.onclick = null;
		});
	}
}

function disableUnequipInCombat() {
	let node = document.querySelector("[class=imageHero]");
	if (node && node.parentNode) {
		node.parentNode.onclick = function() {
			if (!window.isInCombat()) {
				window.sendBytes("UEQUIP_H"); // This is just overwriting existing functionality with the same functionality but with added restrictions (cannot be in combat)
			}
		};
	}
}

function getBoundFurnace() {
	let furnace = "";
	[].slice.call(document.querySelectorAll("[onclick^=openFurnaceDialogue]")).some((node) => {
		let boundFurnace = node.id.indexOf("item-box-bound") !== -1 && node.id.split("item-box-")[1];
		if (window[boundFurnace] > 0) {
			furnace = boundFurnace;
			return true;
		}
		return false;
	});
	return furnace;
}

function getOilCapacity() {
	return window.maxOil;
}

function getCurrentOil() {
	return window.oil;
}

function getNetOilConsumption() {
	return window.oilIn - window.oilOut;
}

/*****
*
* F U N C T I O N P R O X I E S
*
*****/

function proxyWebSocketOnMessage() {
	const PROXY = window.webSocket.onmessage;
	window.webSocket.onmessage = function(e) {
		PROXY.apply(this, arguments);
		postGameTick();
	};
}

function proxyAddToChatBox() {
	const PROXY = window.addToChatBox;
	window.addToChatBox = function(username, icon, tag, message, isPM) {
		//arguments[3] = linkify(arguments[3]);
		PROXY.apply(this, arguments);
	};
}

function proxyConfirmDialogue() {
	const PROXY = window.confirmDialogue;
	window.confirmDialogue = function(width, bodyText, buttonText1, buttonText2, sendBytes) {
		PROXY.apply(this, arguments);
	};
}

function proxyProcessWoodcuttingTab() {
	const PROXY = window.processWoodcuttingTab;
	window.processWoodcuttingTab = function() {
		PROXY.apply(this, arguments);
		// Immediately updates woodcutting timers upon opening/processing the tab to prevent sudden change of format a second after opening the tab
		updateWoodcuttingTimers();
	};
}

/*****
*
* T I M E R S & F O R M A T I N G
*
*****/

/*
	Check if a string of text can be a URL
*/
function isLink(text) {
	return text.test(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig);
}

/*
	Make links clickable
	No longer needed as it is finally DH Native
*/
/*function linkify(text) {
	return text.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, "<a href='$1' target='_blank'>$1</a>");
}*/

function padLeft(value, padChar, length) {
	value = value.toString(); padChar = padChar.toString();
	return value.length < length ? padLeft(padChar + value, padChar, length) : value;
}

/*
	Formats a time (in seconds) as hh:mm:ss or mm:ss if no hours
*/
function formatTime(secs) {
	let seconds = Math.round(secs % 60);
	let minutes = Math.floor((secs % 3600) / 60);
	let hours = Math.floor(secs / 3600);

	return `${hours > 0 ? padLeft(hours, 0, 2) + ":" : ""}${padLeft(minutes, 0, 2)}:${padLeft(seconds, 0, 2)}`;
}
/*
	Overwrite Diamond Hunt 2's native formatTime functions with our own to achieve nicely formatted timers with no hassle
*/
function replaceDHNativeFormatTime() {
	window.formatTime = formatTime;
	window.formatTimeShort = formatTime;
	window.formatTimeShort2 = formatTime;
}

/*
	Adds and updates a smelting timer
*/
function updateSmeltingTimer() {
	let node = document.getElementById("notif-smelting");
	if (node && node.children.length > 1)
		node.children[1].textContent = `${formatTime(SMELTING.lastTimer / 1000)} (${window.smeltingPerc}%)`;
}

/*
	Tries to estimate smelting time remaining based on the time it takes to smelt a bar and the real time elapsed between each barType
	Times are converted to milliseconds for increased accuracy
*/
function estimateSmeltingTimer() {
	let smeltingTotalAmount = window.smeltingTotalAmount;
	let smeltingCurrentAmount = window.smeltingAmount;
	let smeltingTotalTime = window.smeltingPercD * 1000;
	let barType = window.smeltingBarType;
	let now = Date.now();

	if (barType > 0) {
		let barTime = window.getTimerPerBar(window.getBarFromId(barType));
		let roughTimeElapsed = (smeltingCurrentAmount * barTime) * 1000;
		if (SMELTING.lastCurrentAmount === smeltingCurrentAmount) {
			// Number of bars smelted hasn't changed so we'll use time-based estimations
			SMELTING.lastTimer = SMELTING.lastTimer - (now - SMELTING.lastRealTime);
			SMELTING.lastRealTime = now;
		} else {
			// Number of bars smelted HAS changed so we'll use a rough estimate of time remaining based on time to smelt each bar
			SMELTING.lastCurrentAmount = smeltingCurrentAmount;
			SMELTING.lastTimer = Math.max(smeltingTotalTime - roughTimeElapsed, 0);
			SMELTING.lastRealTime = now;
		}
	} else {
		// Reset everything since nothing is being smelted
		SMELTING.lastCurrentAmount = -1;
		SMELTING.lastTimer = -1;
		SMELTING.lastRealTime = -1;
	}
}

/*
	Adds and updates a woodcutting timers
*/
function updateWoodcuttingTimers() {
	// Update DH2 native woodcutting timers
	for (let i = 1; i <= 6; i++) {
		let node = document.getElementById("wc-div-tree-lbl-" + i);
		if (node) {
			if (window["treeUnlocked" + i] === 0) {
				node.style.color = "brown";
				node.textContent = "(Locked)";
			} else {
				node.textContent = window["treeStage" + i] == 0 ? "Waiting for tree to spawn..." :
					(window["treeStage" + i] == 4 ? `Ready To Harvest ${getTreeGrowingName(i)}!` : `${getTreeGrowingName(i)}: ${formatTime(getTreeGrowingTimer(i))}`);
			}
		}
	}
}

function getTreeGrowingTimer(patch) {
	let treeId = window["treeId" + patch];
	return Math.max(window.TREE_GROW_TIME[(treeId-1)] - window["treeGrowTimer" + patch], 0);
}

function getTreeGrowingName(patch) {
	let treeId = window["treeId" + patch];
	return (TREES[treeId] && TREES[treeId].name) || window.getTreeName(treeId);
}

/*
	Returns the first upcoming woodcutting timer
*/
function getSoonestWoodcuttingTimer() {
	let timer = null;
	for (let i = 1; i <= 6; i++) {
		if (window["treeId" + i] != 0 && TREES[window["treeId" + i]] !== undefined) {
			let gt = TREES[window["treeId" + i]].growTime - window["treeGrowTimer" + i];
			timer = timer === null ? gt : gt < timer ? gt : timer;
		}
	}
	return timer;
}
/*
	Returns the first upcoming farming timer
*/
function getSoonestFarmingTimer() {
	let timer = null;
	for (let i = 1; i <= (window.donorFarmingPatch > currentTimeMillis ? 6 : 4); i++) {
		let gt = window["farmingPatchGrowTime" + i] - window["farmingPatchTimer" + i];
		timer = timer === null ? gt : gt < timer ? gt : timer;
	}
	return timer;
}

/*
	Adds an oil timer & net oil consumption element
*/
function addOilTimerElements() {
	let oilFlowNode = document.getElementById("oil-flow-values");
	let netConsumptionNode = document.createElement("SPAN");
	netConsumptionNode.id = "dh2qol-oilNetConsumption";
	netConsumptionNode.style.color = "yellow";
	let oilTimerNode = document.createElement("SPAN");
	oilTimerNode.id = "dh2qol-oilTimer";
	oilTimerNode.style.color = "orange";
	if (oilFlowNode && oilFlowNode.parentNode) {
		let parent = oilFlowNode.parentNode;
		parent.appendChild(netConsumptionNode);
		parent.appendChild(oilTimerNode);
	}
}
/*
	Updates the oil timer & net oil consumption elements
*/
function updateOilTimer() {
 	let netConsumptionNode = document.getElementById("dh2qol-oilNetConsumption");
 	let oilTimerNode = document.getElementById("dh2qol-oilTimer");

	if (netConsumptionNode && oilTimerNode) {
		netConsumptionNode.textContent = ` (${getNetOilConsumption() > 0 ? "+" + getNetOilConsumption() : getNetOilConsumption()})`;
		oilTimerNode.textContent = getOilTimer();
	}
}
/*
	Calculates and formats an oilTimer based on oil, capacity, and consumption
*/
function getOilTimer() {
	let consumption = getNetOilConsumption();
	let capacity = getOilCapacity();
	let oil = getCurrentOil();
	if (consumption == 0) {
		return ``;
	} else if (consumption > 0) {
		// Despite the poorly labeled variable, consumption greater than 0 means we're producing a net positive amount of oil
		return ` (${formatTime((capacity - oil) / consumption)})`;
	} else {
		// Consuming more than producing
		consumption = Math.abs(consumption);
		return ` (${formatTime(oil / consumption)})`;
	}
}
})();
/*
function proxyWebsocketSend() {
	const PROXY = window.webSocket.send;
	window.webSocket.send = function send() {
		console.log(send.caller);
		PROXY.apply(this, arguments);
	};
}
*/
/*
//For the future
function Command() {
	let fncCaller;
	const PROXY = window.webSocket.send;
	window.webSocket.send = function send() {
		// If we attempt to load the market tab, log the function that calls WebSocket#send
		if (arguments[0] === "OPEN_MARKET_TAB") {
			fncCaller = send.caller; // We got it boys!
			return; // Don't actually send the command to the server because 'muh automation'
		}
		PROXY.apply(this, arguments); // Pretend like nothing ever happened
	}
	// Probe the playermarket to trigger a legitimate server call (but we won't actually send it!) and log the calling function
	window.processTab("playermarket");
	// Return WebSocket#send to normal
	window.webSocket.send = PROXY;

	this.send = fncCaller || webSocket.send;
	this.chopTree;

}
*/