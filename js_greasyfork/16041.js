// ==UserScript==
// @name		DHQoL
// @namespace	http://tampermonkey.net/
// @version		1.9
// @description	Quality of Life changes for Diamond Hunt Online
// @author		John / WhoIsYou
// @match		http://*.diamondhunt.co/DH1/game.php
// @match		https://*.diamondhunt.co/DH1/game.php
// @run-at document-idle
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/16041/DHQoL.user.js
// @updateURL https://update.greasyfork.org/scripts/16041/DHQoL.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

/**
FEATURES:
- Clickable links in chat! Very simple regex pattern that won't catch ALL links, but it will catch the majority / common formats
- Market exclusion list, to filter out users you don't like or don't want to see (such as justanoob) - Serves little purpose now do to recent updates
- Market clutter remover, only shows the 5 first/cheapest listings for any single item, not counting your own items
- Market inclusion list, doesn't count any offers by these users in the 5 offer limit per item (always shows these people's items)
- Rocket timer that's fairly accurate (though RNG based) based on average distances traveled per second found via logging
- Furnace timer (accurate) in addition to the percentage. Bar type text removed and iron furnace image replaced with current item being smelted
- Improved timers for large fishing boat, fishing boat, rocket, robot, furnace, exploring, potions, farming (only if you have the donor perk), spells, and ancient crystal in the HH:MM:SS format
- Farming, Furnace, and Exploring timers factor in the donor perks if you have them, giving much more accurate timers than the default (though farming is still slightly RNG based)
- Prevents the selling of brewing ingredients in the brewing tab
- Added indicators that let you know when you have Explorer's Potions or Artifact Potions active
- Improved functionality for converting your coins to plat and plat to coins (left click them)
- Added the ability to craft multiple rocket fuel barrels, activate with 200m+ oil if you have an oil refinery, or 100m+ without, otherwise it crafts 1 per click like normal
- Wealth Evaluator found under key items, click it to evaluate the value of all of your tradable items based on market prices
- Chat spam filter, filters out spammers, and automatically mutes and reports the worst offenders
- PM chat mode for the chatbox so you don't have to scroll up to see old PMs, as well as easily have a private conversation (automatically respond to the last person you were conversing with)
- Spoiler tagged answers for treasure maps
- Market min and max prices in item tooltips
- Limits the amount of items sold to the NPC shop in one go to prevent accidentally selling over max coins worth
- Ctrl + Click an item to bring up the option to discard it

Obsolete (now removed) features that have since been added to the main game:
- (Partial) Clickable links in chat
- Additional market abbreviations for pricing items (k/m/b)
- Prevent binding of lower tier furnaces and ovens
**/

/**
CHANGELOG:
v1.9 (Mar 2017)
- Updated DHQoL to work after DH2 release, no feature changes
- Bugfixes
v1.8 (Nov 2016)
- Relist button added to expired market offers
- Allows the use of "k" for thousands, "m" for millions, and "b" for billions for item AMOUNT when listing an item on the market
v1.7 (Oct 31 2016)
- Ctrl + Click an item to bring up the option to discard it
- Typing in DHQoL's PM tab will automatically PM the last player you messaged or that messaged you if you don't specify a player with /pm
- Added timers for superEssencePotion and ghostEssence
- DHO chat links have been made clickable in private messages
- DHO bugfix for "tab to reply" in chat for replying to users with spaces in their names
- DHO bugfix for lastPMFrom being overwritten with "none" by server messages (fixes replying with tab after a server message)
- QoL spamfilter now filters out muted players without the need to run any checks (Also a DHO bugfix for muted players)
- Fixed QoL market filter to work with market changes (listing expiration)
- Fixed QoL private chat tab to work with new chat and made some slight changes to it
- Fixed QoL bug where sell function always sold your max stack
- Fixed QoL item price tooltips
- Fixed QoL spamfilter to work with new chat
- Fixed QoL bug where spamfilter would filter out links sent by themselves (as messages > 30 characters without spaces)
- Removed some obsolete and unused code (chatbox darkmode, revert chatbox to normal mode, click names to PM, using k/m/b in market prices, clickable chat links)
v1.6 (Aug 29 2016)
- Updated spam filter, it is slightly less forgiving, should now properly reports spammers, and alerts you when it mutes a player
- Added market min and max prices to the tooltips of all tradable items
- Added (spoiler tagged) answers to treasure maps
- Selling items to the NPC shop (left or right click) will limit the amount sold up to max coins worth (2147483647) to prevent accidental loss of wealth
- Fixed oven binding to account for tier changes, added runite furnace
- Updated timers for engineering potions and super excavators spell
- Added timer formatting for the large fishing boat
- Fixed farming timer to no longer calculate the donor gardener perk since it has been changed to apply at plant time
- Removed obsolete features (using "m" in market prices added to the game)
v1.5 (Feb 22 2016)
- Removed chatbox darkmode for now, since GM storage messes up FireFox support
v1.4 (Feb 20 2016)
- Added a wealth evaluator, accessible from your key items
- Added a spam filter to the chat
- Improved furnace timer to take the donator perk into account more accurately
- Delay for multiple rocket fuel barrel crafting doubled to avoid issues
- Added the ability to use "k" or "b" in market prices when listing an item as shorthand for "thousands" and "billions" respectively ("m" for millions exists)
- Added a toggleable darkmode to the chatbox
- Added a tab to the chatbox that only displays private messages, sent and received
- Market exclusion list cleared as it no longer serves a purpose
v1.3b: (Feb 1 2016)
- Fixed FireFox support by switching to @grant none, instead of unsafeWindow
v1.3: (Feb 1 2016)
- Improved coin swapping functionality, left click coins to convert to plat, left click plat to convert to coins
- Dialog asking how many rocket fuel barrels you would like to craft if you're above a certain oil threshold, otherwise it crafts one like normal
- Removed the ability to bind equal or lower tier ovens and furnaces if you have promethium or higher bound
- Added users "faggots" and "nogresh" to the market exclusions list (they don't seem to play anymore)
- Added formatting for magic spell timers
- Added formatting for ancient crystal timer
- Restructured some code
v1.2a: (Jan 13 2016)
- Updated code structure a little (not done yet)
- Added timer formatting for the new fishing boat
- Made items in the brewing tab unsellable on left click (req: https://redd.it/40uw3m)
v1.1a: (Jan 8 2016)
- Fixed furnace timer, no longer performs additional calculations for donator perk (this was default behaviour!)
v1.0: (Jan 8 2016)
- Release
**/

var config = {
	ENABLE_LOGGING : true
};

// Array of potions that use timers
var TIMED_POTION_LIST = ["starDustPotion", "seedPotion", "smeltingPotion", "oilPotion", "miningPotion", "superStarDustPotion",
		"coinPotion", "compost", "engineeringPotion", "fishingPotion", "essencePotion", "superEssencePotion", "fastFurnacePotion", "superOilPotion", "megaStarDustPotion", "whaleFishingPotion", "megaOilPotion", "ghostEssence"];

// Array of spells that use timers
var TIMED_SPELL_LIST = ["superDrills", "superGemFinder", "smallSips", "superPirate", "superCrushers", "sparklingCompostPotion", "superGiantDrills", "fastVendor", "superRoadHeaders", "animatedAxe", "superExcavatorsTimer"];

// Users to be excluded from the market listing
var MARKET_EXCLUSION_LIST = [];

// Users to always be included in the market listing, useful if you have a habit of trading with a specific person
var MARKET_INCLUSION_LIST = ["whoisyou"]; // Because I can

// Chat filter object, dynamically stores info on all chatting players to be checked against our spam filter
var chatFilter = {

};

var lastHumanPmPlayer = "";


// Immediately-invoked function expression (IIFE), runs once on page load
(function init(triesLeft) {
	if (triesLeft > 0 && (!window.hasOwnProperty("webSocket") || window.webSocket.readyState !== WebSocket.OPEN)) {
		setTimeout(() => {
			init(--triesLeft);
		}, 100);
		return;
	}

	if (window.hasOwnProperty("webSocket") && window.webSocket.readyState === WebSocket.OPEN) {
		cLog("Launching DH QoL! Welcome, " + window.username + ".");

		// Create new notification boxes for artifact and explorer's potions
		createNotificationBoxes();

		// Disable the selling of brewing items
		disableBrewingItemSelling();

		// Improve the coin swapping functionality when clicking on coin icons
		improveCoinSwap();

		// Adds the ability to craft multiple rocket fuel barrels
		setCraftMultipleRocketFuel();

		// Make the new private chat tab in the chat
		makePrivateChatTab();

		// Add event listener for click + ctrl to discard items
		addCtrlClickDestroyItem();

		// Tell the server to load the tradable item table (needed for tooltips and wealth evaluator)
		window.send("LOAD_TRADABLE_ITEMS");

		// Adds the wealth evaluator to key items
		addWealthEvaluator();

		// Update tooltips - on a 5 second delay to allow the trade table to load
		setTimeout(updateTooltips, 5000);
	} else {
		cLog("DHQoL: DH WebSocket failed to load. DHQoL has NOT launched.");
	}
})(100);

/* --- Market --- */
/*
	Make changes to #loadOffers to filter out unwanted market items from the market table
	Filters out any users in our MARKET_EXCLUSION_LIST and filters out all but the cheapest 5 offers for any item (your own items do not count towards this limit)
	Items in the MARKET_INCLUSION_LIST will always be shown even if they are not among the cheapest 5
*/

window.loadOffers = function(unparsedData) {
	var lastItem = "";
	var lastItemCount = "";

	var dataArray = unparsedData.split("~");
	var table = document.getElementById("market-buy-table");
	resetGEBox(1);
	resetGEBox(2);
	resetGEBox(3);
	table.innerHTML = "<tr class='table-th'><th>Player</th><th>Item</th><th>Icon</th><th>Amount</th><th>Price each</th><th>Time left</th></tr>";
	for(var i = 0; i < dataArray.length; i++) {
		var playerId = dataArray[i]; i++;
		var playerUsername = dataArray[i]; i++;
		var item = dataArray[i];i++;
		var total = dataArray[i];i++;
		var pricePer = dataArray[i];i++;
		var collect= dataArray[i];i++;
		var slot = dataArray[i];i++;
		var isPlatinum = dataArray[i];i++;
		var category = dataArray[i];i++;
		var timeLeft = dataArray[i];

		// Loads the items we're selling into our collection boxes
		if(playerUsername == username) {
			loadGEBoxSelling(item + "~" + total + "~" + pricePer + "~" + collect + "~" + timeLeft, slot);
		}

		// Adds offers to the market table as long as they're not in the excluded users list
		// Keeps tracks of how many offers exist for each individual type of item and only displays the first (cheapest) five not counting our own items
		if(total > 0 && timeLeft != "Expired" && MARKET_EXCLUSION_LIST.indexOf(playerUsername) < 0) {
			if (window.username != playerUsername && MARKET_INCLUSION_LIST.indexOf(playerUsername) < 0) {
				if (item == lastItem) {
					if (lastItemCount >= 5) {
						continue;
					} else {
						lastItemCount += 1;
					}
				} else {
					lastItem = item;
					lastItemCount = 1;
				}
			}
			// Adds any items that made it through the filter to the market table
			applyToBuyingTable(playerId, playerUsername, item, total, pricePer, slot, isPlatinum, category, timeLeft);
		}
	}
};

/*
	Adds a relist button to expired market offers
	The button will collect coins any coins and remove the offer before relisting the remaining amount in the same slot for the same price
*/
var originalLoadGEBoxSelling = window.loadGEBoxSelling;
window.loadGEBoxSelling = function(val, slot) {
	originalLoadGEBoxSelling(val, slot);
	var vals = val.split("~"); //[item], [amount left], [price per], [coins to collect], [time left]
	var item = vals[0];
	var amt = vals[1];
	var price = vals[2];
	var cointsToCollect = vals[3];
	var timeLeft = vals[4];
	if (timeLeft === "Expired") {
		var node = document.getElementById("market-time-left-" + slot);
		if (node) {
			node.innerHTML += "<br><input type='button' value='Relist " + item + "'>";
			node.addEventListener("click", function() {
				var timeOut = 0;
				if (cointsToCollect > 0 ) {
					window.send("COLLECT_COINS=" + slot);
					timeOut = 25;
				}
				setTimeout(function(slot) {
					window.send("REMOVE_OFFER_MARKET=" + slot);
				}, timeOut, slot);
				setTimeout(function(item, amt, price) {
					window.send("OFFER_MARKET=" + item + ";" + amt + ";" + price + ";" + window.slotChosen);
				} (timeOut + 25), item, amt, price);
			});
		}
	}
};

/*
	Allows you to use "k", "m", or "b" in item amounts when selling an item
	k = thousands
	m = millions
	b = billions
*/
var originalSellOnGE = window.sellOnGE;
window.sellOnGE = function(amount, pricePer) {
	if (amount.indexOf("k") !== -1) {
		amount = amount * 1000;
	}
	if (amount.indexOf("m") !== -1) {
		amount = amount * 1000000;
	}
	if (amount.indexOf("b") !== -1) {
		amount = amount * 1000000000;
	}
	originalSellOnGE(amount, pricePer);
};

/*
	Updates the quickSell (right click an item) function to only sell up to max coins worth of the item to prevent accidental loss
*/
window.quickSell = function(id) {
	var itemName = id.split("-")[1];
	var price = getItemPrice(itemName);
	var amount = price > 0 ? Math.min(Math.floor(2147483647/price), window[itemName]) : 0;
	send("SELL=" + itemName + ";" + amount);
};

/*
	Updates the sell to NPC shop function to only sell up to max coins worth of the item to prevent accidental loss
*/
window.sell = function(itemName, amount) {
	var price = getItemPrice(itemName);
	var amt = price > 0 ? Math.min(Math.floor(2147483647/price), amount) : 0;
	send("SELL=" + itemName + ";" + amt);
};

/* --- Chat --- */
/*
	Hold the original #refreshChat function before any changes are made to it
*/
var originalRefreshChat = window.refreshChat;

/*
	Add the new functionality to the #refreshChat function, while maintaining the original functionality
	Adds URL linkification and darkmode output
*/
window.refreshChat = function(data) {
	// Run message through the spamCheck first
	if (spamCheck(data) === true) {
		// Handle all private message related goodies
		data = handlePrivateMessages(data);
		// Run the original #refreshChat
		originalRefreshChat(data);
		// Bugfix for server messages changing lastPMFrom to "none" (see handlePrivateMessages for specifics)
		window.lastPMFrom = lastHumanPmPlayer;
	}
};

/*
	Checks if we're typing in the PM tab, if so it will send the message to the lastHumanPmPlayer if a command (such as /pm) has not been typed
*/
var oldSendChat = window.sendChat;
window.sendChat = function(msg) {
	if (!msg.startsWith("/") && lastHumanPmPlayer.length > 0 && document.getElementById("chat-area-pm-div") && document.getElementById("chat-area-pm-div").style.display !== "none") {
		msg = "/pm " + lastHumanPmPlayer + " " + msg;
	}
	oldSendChat(msg);
}

/*
	Make links in chat clickable, not 100% perfect regex pattern but it gets the job done

	-- unused
*/
function linkify(text) {
	text = text || "";
	var pattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
	text = text.replace(pattern, "<a href='$1' target='_blank'>$1</a>");
	return text;
}

/*
	Check if a string of text can be a URL
*/
function isLink(text) {
	var pattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
	if (text.match(pattern)) {
		return true;
	}
	return false;
}

/*
	Creates a private chat tab in the chatbox, and a new button to toggle it
*/
function makePrivateChatTab() {
	// Make the private chat tab
	var node = document.getElementById("chat-area-div");
	if (node) {
		var newNode = node.cloneNode("false");
		newNode.id = "chat-area-pm-div";
		newNode.innerHTML = "[PM Mode] Thanks for using Diamond Hunt QoL by WhoIsYou!<br><br>";
		newNode.style.display = "none";
		var parentNode = node.parentNode;
		parentNode.insertBefore(newNode, node);
	}

	// Make the private chat toggle button
	node = document.getElementById("chat-box-area");
	var buttons = node.querySelectorAll("[type='button']");
	if (buttons.length > 1) {
		var lastButton = buttons[buttons.length - 2];
		var newButton = lastButton.cloneNode(false);
		newButton.setAttribute("value", "Toggle PM Mode");
		newButton.removeAttribute("onclick");
		newButton.addEventListener("click", function() {
			var node1 = document.getElementById("chat-area-div");
			var node2 = document.getElementById("chat-area-pm-div");
			if (node1 && node2) {
				node1.style.display = node1.style.display == "none" ? "block" : "none";
				node2.style.display = node2.style.display == "none" ? "block" : "none";
			}
		});
		lastButton.parentNode.insertBefore(newButton, lastButton.nextSibling);
	}
}

/*
	Middleman for all PMs
	Currently makes PM links clickable, replaces spaces in usernames with underscores (fix to lastPMFrom not working for users with spaces in their name), and adds PMs to our PM tab
*/
function handlePrivateMessages(data) {
	var splitData = data.split("~");
	var messageType = splitData[5];
	if (messageType == 1 || messageType == 2) {
		// Message is a private message from or to a user
		// Bugfix, turns PMs into clickable links
		splitData[4] = linkify(splitData[4]);
		// Add PM to our PM tab
		addPmToPmTab(messageType, splitData[0], splitData[4]); // Message type, player name, message
		// Replace spaces in sender's username with underscores (Bugfix for tab to reply)
		splitData[0] = splitData[0].replace(/ /g, "_");
		// Keeps track of the last player to PM you (specifically for server messages overwriting the game's variable with "none")
		lastHumanPmPlayer = splitData[0];
	}
	return splitData.join("~"); // Return our new data
}

/*
	Adds chat private messages to the new PM tab
*/
function addPmToPmTab(messageType, playerName, message) {
	var t = "";
	var node = document.getElementById("chat-area-pm-div");
	if (node) {
		if (window.showTimestamps === true) {
			var date = new Date();
			var time = "[" + ("00" + date.getHours()).slice(-2) + ":" + ("00" + date.getMinutes()).slice(-2) + "] "
			t += time;
		}

		t += "[" + ((messageType == 1) ? "from " : "to ") + playerName +"] " + "<font color='purple'>" + ((messageType == 1) ? message : ("<i>" + message + "</i>")) + "</font>";
		node.innerHTML += t + "<br>";

		// Autoscroll the PM tab
		if (window.isAutoScrolling) {
			node.scrollTop = node.scrollHeight;
		}
	}
}

/*
	Adjusts the PM chatbox height to match the normal chatbox height when the resize buttons are pressed
*/
var originalChatBoxZoom = window.chatBoxZoom;
window.chatBoxZoom = function(zoom) {
	originalChatBoxZoom(zoom);
	var node1 = document.getElementById("chat-area-div");
	var node2 = document.getElementById("chat-area-pm-div");
	if (node1 && node2) {
		node2.style.height = node1.style.height;
	}
}

/*
	Check if the given player should be muted
*/
function isMutedPlayer(player) {
	for (var i = 0; i < window.mutedPeople.length; i++) {
		if (window.mutedPeople[i].toLowerCase().replace(/ /g, "_") === player) {
			return true;
		}
	}
	return false;
}

/*
	Spam filter, if it returns false, the message is not rendered in chat
*/
function spamCheck(messageString) {

	var messageArray = messageString.split("~");
	var playerName = messageArray[0];
	var playerTag = messageArray[2]; // 4: Moderator, 5: Dev
	var message = messageArray[4];
	var messageType = messageArray[5]; // 0: Normal, 1: PM Received, 2: PM Sent, 3: Server /yell

	/*
		Skip spam checking if the message is sent from a dev (smitty, tag 5), a moderator (tag 4), or a server /yell (messageType 3)
		Also skip spam checking if the message is sent by us, or if the message is messageType 2 (PM sent from us but it shows the recipients username)
	*/
	if (playerTag != 4 && playerTag != 5 && messageType != 2 && messageType != 3 && window.username.toLowerCase() !== playerName.toLowerCase()) {
		/*
			// Obsolete due to chat changes making this info more easily obtainable
			// Regex pattern, matches the sender's name (matches[1]), and the message (matches[2]);
			// First pattern is for normal messages, second pattern checks for private messages
			var matches = messageString.match(/~\*?\|?(.*) \([0-9]+\)\: (.*)/) || messageString.match(/<span style='color:purple'>Private Message from <b>(.*)<\/b>\: (.*)<\/span>/);
			if (matches !== null && matches.length >= 3) {
		*/

		playerName = playerName.replace(/ /g, "_"); // Replaces spaces in a player's name with underscores to be variable and report friendly

		// Create a new object within the chatFilter object for the talking player if one doesn't exist, otherwise check for spam
		if (!chatFilter.hasOwnProperty(playerName)) {
			chatFilter[playerName] = {
				filterTime : Date.now(),
				messageTime : Date.now(),
				messageCount : 1,
				lastMessage : message,
				isReported : false
			};
		} else {
			// Player is already muted and reported, no additional steps are necessary
			if (chatFilter[playerName].isReported === true || isMutedPlayer(playerName)) {
				return false;
			}

			// Get the current time
			var time = Date.now();

			// Calculate the time since the user's last message
			var timeSinceLastMessage = time - chatFilter[playerName].messageTime;
			var timeSinceFilter = time - chatFilter[playerName].filterTime;

			// Reset a player's filter time, and message count, if their last message was 2.1+ seconds ago or the filter started 4.4+ seconds ago
			if (timeSinceLastMessage >= 2100 || timeSinceFilter >= 4400) {
				chatFilter[playerName].filterTime = time;
				chatFilter[playerName].messageCount = 0;
			}

			// Increment the player's message count by 1 for talking
			chatFilter[playerName].messageCount++;

			// If a player's message count hits 3, reset their filter to "keep an eye" on them as a potential spammer but show this message regardless
			if (chatFilter[playerName].messageCount == 3) {
				chatFilter[playerName].filterTime = time;
			} else if (chatFilter.messageCount >= 5) {
				// If they've now sent at least 5 messages without a single 2.2 second pause, continue resetting their filter until they do so and no longer display their message
				if (chatFilter[playerName].messageCount == 10) {
					// If they reach a messagecount of 10, automatically mute and report the player
					//console.log("Muting and reporting player: " + playerName + " for message: " + message + " (" + chatFilter[playerName].messageCount + ")");
					window.sendChat("/mute " + playerName);
					window.messageBox(playerName + " muted by DHQoL");
					window.sendChat("/report " + playerName + " Automated spam report by DHQoL please PM Wh0IsY0u on reddit if this becomes a problem");
					chatFilter[playerName].isReported = true;
				}
				chatFilter[playerName].filterTime = time;
				chatFilter[playerName].lastMessage = message;
				chatFilter[playerName].messageTime = time;
				return false;
			}

			// If the message is over 30 characters but does not contain a space and is not a URL, it is likely spam
			// If the player's current message is the same as their last message then we don't need to see it
			// If the player's last message was sent less than 150 milliseconds ago, it is likely spam
			if ((message.length >= 30 && message.indexOf(" ") == -1 && !isLink(message))
				|| (timeSinceLastMessage <= 150)
				|| (chatFilter[playerName].lastMessage.toLowerCase() === message.toLowerCase())) {
					// Sets the player's last message sent to the current message and last message time to now
					chatFilter[playerName].lastMessage = message;
					chatFilter[playerName].messageTime = time;
					return false; // Message was considered spam
					//console.log("Spam message: " + playerName + " for message: " + message + " (" + chatFilter[playerName].messageCount + ")");
			}

			// Sets the player's last message sent to the current message and last message time to now
			chatFilter[playerName].lastMessage = message;
			chatFilter[playerName].messageTime = time;

		}
	}
	return true; // Message is okay to go through
}

/* --- Misc --- */

/*
	Removes the left click to sell item functionality from all brewing-tab items since you'd almost never want to sell these
*/
function disableBrewingItemSelling() {
	var brewingTabDoc = document.getElementById("brewing-tab");
	if (brewingTabDoc) {
		var sellableItems = brewingTabDoc.getElementsByClassName("item-box-spot")[0].querySelectorAll("[onclick=\"sellDailog(this.id)\"]");
		for (var i = 0; i < sellableItems.length; i++) {
			sellableItems[i].removeAttribute("onclick");
		}
	}
}

/*
	Removes the default right and left click functionality when clicking on your money
	Left clicking your coins icon will convert up to 2B coins to plat
	Left clicking your plat icon will convert plat to coins until you're carrying up to 2B
*/
function improveCoinSwap() {
	var moneyDocList = document.querySelectorAll("[oncontextmenu=\"send('COINS_TO_PLATINUM='+parseInt(coins/1000000));return false;\"]");
	if (moneyDocList.length > 0) {
		var moneyDoc = moneyDocList[0];
		moneyDoc.removeAttribute("oncontextmenu");
		moneyDoc.removeAttribute("onclick");
		var coinsElement = moneyDoc.childNodes[0];
		var platElement = document.getElementById("platinum-coins-status-bar-span").childNodes[0];

		coinsElement.onclick = function() {
			var convert = Math.min(Math.floor(parseInt(window.coins / 1000000)), 2000);
			if (convert > 0 ) {
				window.send("COINS_TO_PLATINUM=" + convert);
			}
		};

		platElement.onclick = function() {
			var convert = Math.min(parseInt(window.platinumCoins), Math.max(2000 - Math.floor(parseInt(window.coins / 1000000)), 0));
			if (convert > 0 ) {
				window.send("PLATINUM_TO_COINS=" + convert);
			}
		}
	}
}

/*
	Allows you to craft more than one rocket fuel at a time if you're above a certain amount of oil, otherwise it crafts just one like normal
*/
function setCraftMultipleRocketFuel() {
	var node = document.getElementById("craft-rocketFuel");
	var dialogNode = document.getElementById("dialog-craft-multi");
	if (node && dialogNode) {
		var dialogConfirmButton = dialogNode.querySelectorAll("[type='button']")[0];
		if (dialogConfirmButton) {
			// Add the craft multiple dialog to the rocket fuel crafting
			node.removeAttribute("onclick");
			node.addEventListener("click", function() {
				var requiredOil = (bindedOilRefinery == 0 ? 100000000 : 200000000);
				if (oil >= requiredOil) {
					craftMultipleItem("rocketFuel");
				} else {
					craftItem("rocketFuel");
				}
			});

			// Craft in a loop since #craftMultiple doesn't allow rocket fuel crafting for some reason
			dialogConfirmButton.removeAttribute("onclick");
			dialogConfirmButton.addEventListener("click", function(){
				if (document.getElementById('craft-multiple-item-hidden').value == "rocketFuel") {
					var amount = document.getElementById('craftMulti-amount-txt').value;
					var delay = 0;
					$(this).closest('.ui-dialog-content').dialog('close');
					for (var i = 0; i < amount; i++) {
						setTimeout(function() {
							if (oil >= 50000000) {
								craftItem("rocketFuel");
							}
						}, delay);
						delay += 100;
					}
				} else {
					craftMultiple(document.getElementById('craft-multiple-item-hidden').value, document.getElementById('craftMulti-amount-txt').value);$(this).closest('.ui-dialog-content').dialog('close')
				}
			});
		}
	}
}

/*
	Adds the wealth evaluator to the key items (clones the tutorial key item, edits, and appends it)
	TODO: Make this not rely on cloning a node (stop being lazy and make on manually) so it won't break when smitty changes them
*/
function addWealthEvaluator() {
	var keyItemTabNode = document.getElementById("key-items-tab");
	if (keyItemTabNode) {
		var globalLevelNode = keyItemTabNode.querySelector("[tooltip='Click to see what items you have collected.']");
		if (globalLevelNode) {
			var newNode = globalLevelNode.cloneNode(true);
			newNode.setAttribute("tooltip", "Click me to evaluate your wealth!");
			newNode.childNodes[0].id = "key-item-wealth-evaluator";
			newNode.childNodes[0].onclick = "";
			newNode.childNodes[0].addEventListener("click", function() {
				evaluateWealth();
			});
			var boxTitleNode = newNode.childNodes[0].querySelector(".item-box-title");
			var boxImageNode = newNode.querySelector("[src]");
			boxTitleNode.innerHTML = "Wealth Evaluator";
			boxImageNode.src = "images/pic_coin.png";
			newNode.childNodes[0].innerHTML = newNode.childNodes[0].innerHTML.replace("Click to Read", "");
			// Append the new node to the document
			keyItemTabNode.appendChild(newNode);
		}
	}
}


/*
	Evaluates all of your tradable items and gives their total value based on the mininmum market price, maximum market price, and the average of the two
	Does not account for untradables, your platinum and coins, bound items, equipped items, or items currently listed on the market
*/
function evaluateWealth() {
	var networthMin = 0;
	var networthMax = networthMin;
	for (var i = 0; i < window.tradableItems.length; i++) {
		var itemData = window.tradableItems[i].split("~");
		var item = itemData[0];
		var minPrice = parseFloat(itemData[1]);
		var maxPrice = parseFloat(itemData[2]);
		if (window[item]) {
			networthMin +=	(window.platinumTradables.indexOf(item) >= 0 ? window[item] * minPrice * 1000000 : window[item] * minPrice);
			networthMax +=	(window.platinumTradables.indexOf(item) >= 0 ? window[item] * maxPrice * 1000000 : window[item] * maxPrice);
		}
	}

	window.alert("This is an evaluation of the value of your tradable items.\n\
	Items that cannot be traded are not valued.\n\
	Bound items, equipped items, coins/plat, and items currently listed on the market place are not valued.\n\n\
	Your tradable items at minimum market price are worth: " + networthMin.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + "\n\
	Your tradable items at maximum market price are worth: " + networthMax.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + "\n\
	For an average of: " + ((networthMin + networthMax) / 2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
}

/*
	Updates the tooltips for all (or most, dependant on consistency in the code) tradable items to include their min and max market prices
*/
function updateTooltips() {
	// Add a new rule to the stylesheet, allowing CSS tooltips to have line breaks (we'll be using \x0A for linebreaks)
	document.styleSheets[1].insertRule(".tooltip{white-space: pre-wrap;}", 0);

	// Iterate over every tradable item and look for an item box with the same name to update
	for (var i in window.tradableItems) {
		var data = window.tradableItems[i].split("~");
		var item = data[0];
		var low = data[1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (window.isPlatinumTradable(item) ? " (P)" : "");
		var max = data[2].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (window.isPlatinumTradable(item) ? " (P)" : "");

		var node = document.getElementById("item-" + item + "-box");
		if (node) {
			var parentNode = node.parentNode;
			var tooltip = parentNode.getAttribute("tooltip");
			parentNode.setAttribute("tooltip", tooltip + "\x0ALow price: " + low + "\x0AMax price: " + max);
		}
	}
}


/*
	Updates treasure map hint interface to include the actual answer to the treasure map
	Answers are "spoiler tagged" and require the user to click to reveal the answer
*/
var originaOpenTreasureMapHint = window.openTreasureMapHint;
window.openTreasureMapHint = function() {
	var val = "Solve this clue to get a treasure chest:<br /><br />";

	switch (treasureMap) {
		case "1":
			openDialogue("Hint",val + "<div class='activate-tooltip' tooltip='test' style='color:cyan;background-color:black;border:1px solid yellow;padding:7px 15px 7px 15px;'><u>Au</u> to the store.\
				<span style='color: red; font-size: 60%;'><br />DHQoL: <span onclick='this.innerHTML = \"Sell 1 gold ore to the NPC shop.\";'>Click To Reveal Answer</span></span></div>","");
			break;
		case "2":
			openDialogue("Hint",val + "<div style='color:cyan;background-color:black;border:1px solid yellow;padding:7px 15px 7px 15px;'>Let me put my <u>glass</u>es on before I read the lable on this.\
				<span style='color: red; font-size: 60%;'><br />DHQoL: <span onclick='this.innerHTML = \"Craft 1 vial.\";'>Click To Reveal Answer</span></span></div>","");
			break;
		case "3":
			openDialogue("Hint",val + "<div style='color:cyan;background-color:black;border:1px solid yellow;padding:7px 15px 7px 15px;'>Shop needs some help to build his wall in exchange for 1 coin.\
				<span style='color: red; font-size: 60%;'><br />DHQoL: <span onclick='this.innerHTML = \"Sell 1 stone to the NPC shop.\";'>Click To Reveal Answer</span></span></div>","");
			break;
		case "4":
			openDialogue("Hint",val + "<div style='color:cyan;background-color:black;border:1px solid yellow;padding:7px 15px 7px 15px;'>It is earth day, off they go.\
				<span style='color: red; font-size: 60%;'><br />DHQoL: <span onclick='this.innerHTML = \"Turn off all of your machines.\";'>Click To Reveal Answer</span></span></div>","");
			break;
		case "5":
			openDialogue("Hint",val + "<div style='color:cyan;background-color:black;border:1px solid yellow;padding:7px 15px 7px 15px;'>Fael dettod a mraf.\
				<span style='color: red; font-size: 60%;'><br />DHQoL: <span onclick='this.innerHTML = \"Plant and harvest 1 dotted leaf.\";'>Click To Reveal Answer</span></span></div>","");
			break;
		default:
			window.openTreasureMapHint();
			break;
	}
}

/*
	Adds event listener:
	Ctrl + click an item to (give the option to) discard an item
*/
function addCtrlClickDestroyItem() {
	/*
		useCapture = true // Fires this event before others (allowing us to prevent others from firing)
	*/
	document.addEventListener("click", function(e) {
		if (e.ctrlKey) {
			var mouseOverElement = document.elementFromPoint(e.clientX, e.clientY);
			if (mouseOverElement && (mouseOverElement.className.indexOf("item-") !== -1 || (mouseOverElement.parentNode && mouseOverElement.parentNode.className.indexOf("item-") !== -1))) {
				e.stopImmediatePropagation(); // Prevents any other events on this element from firing

				var matches = (mouseOverElement.id.match(/item-(.*)-box/) || mouseOverElement.parentNode.id.match(/item-(.*)-box/));
				if (matches[1]) {
					window.openDialogue("Destroy Item?", "Would you like to <b>permanently destroy</b> all of your [" + matches[1] +"]?", "DISCARD=" + matches[1]);
				}
			}
		}
	}, true);
}

/* --- Timers --- */

/*
	Format seconds into HH:MM:SS format
*/
function formatTime(seconds) {
	var hours = Math.floor(seconds / 3600);
	var mins = Math.floor((seconds % 3600) / 60);
	var secs = Math.round(seconds % 60);
	var hourString = ("00" + hours.toString()).slice(-2) + ":";
	var minString = ("00" + mins.toString()).slice(-2) + ":";
	var secString = ("00" + secs.toString()).slice(-2);
	return hourString +  minString + secString;
}


/*
	Roughly calculate the time remaining until the rocket journey completes. Uses averages gathered so it may vary slightly.
	Rocket info (found from logging) that we need to know
	Rocket lifts off at a speed of 0-10km/s (averaging 5km/s) until there is about 383401km left in the trip
	The majority of the trip (~383100-~383125) is traveled at 25-75km/s (averaging 50km/s)
	At ~275-300km remaining the rocket slows down to 0-10km/s (averagig 5km/s)
	At ~30km remaining the rocket slows down to a constant 1km/s
*/
function getRocketTimer() {
	var totalDistanceRemaining = window.rocketTimer;
	var liftoffDistanceRemaining = Math.max((totalDistanceRemaining-383401), 0);
	var mainTravelDistanceRemaining = Math.max((totalDistanceRemaining-liftoffDistanceRemaining-300), 0);
	var endSlowdownDistanceRemaining = (totalDistanceRemaining > 300) ? 300-30 : Math.max((totalDistanceRemaining-30), 0);
	var landingDistanceRemaining = (totalDistanceRemaining > 30) ? 30 : totalDistanceRemaining;

	var averageSecondsRemaining = Math.ceil(liftoffDistanceRemaining/5) + Math.ceil(mainTravelDistanceRemaining/50) + Math.ceil(endSlowdownDistanceRemaining/5) + landingDistanceRemaining;

	return averageSecondsRemaining;
}

// Make changes to the document to replace our rocket timer, giving us an estimate time until completion based on average times to travel each kilometer (depending on the distance remaining)
function replaceRocketTimer() {
	document.getElementById("notification-timer-span-rocket").innerHTML = formatTime(getRocketTimer());
}

/*
	Calculates the time left until your furnace is done smelting the current load and formats the time into a string
	Attempts to more accurately display the time remaining when you have the furnace timer donor perk
*/
function getfurnaceTimer() {
	var timeRemaining = (window.furnaceTimer == "1" ? ((window.furnaceTotalTimer * 0.75) - ((window.furnaceCurrentTimer * 0.75))) : window.furnaceTotalTimer - window.furnaceCurrentTimer);
	return timeRemaining;
}

// Returns an image path based on the "furnaceBarId" variable (item you're currently smelting)
function getProductImageByFurnaceId(id) {
	switch (window.furnaceBarId) {
		case "1":
			return "images/minerals/bronzeBar.png";
		case "2":
			return "images/minerals/ironBar.png";
		case "3":
			return "images/minerals/silverBar.png";
		case "4":
			return "images/minerals/goldBar.png";
		case "5":
			return "images/minerals/glass.png";
		case "6":
			return "images/minerals/promethiumBar.png";
		default:
			return "images/crafting/ironfurnace.gif";
	}
}

// Make changes to the document to replace our furnace timer with a new image and a time rather than just a percentage
function replaceFurnaceTimer() {
	var furnaceNode = document.getElementById("furnace-timer");
	var imageNode = document.getElementById("furnace-timer").childNodes[1];
	var newImagePath = getProductImageByFurnaceId(window.furnaceBarId);

	if (imageNode.getAttribute("src") != newImagePath) {
		imageNode.setAttribute("src", newImagePath);
	}

	document.getElementById("notification-timer-span-furnace").innerHTML = formatTime(getfurnaceTimer()) + " (" + window.furnacePerc + "%)";
}

// Loops through all potions which can have a timer (TIMED_POTION_LIST) and returns an array with timer variable name of those which are currently active
function getActivePotionTimers() {
	var activePotions = [];
	for (var i = 0; i < TIMED_POTION_LIST.length; i++) {
		var potionTimer = TIMED_POTION_LIST[i] + "Timer";
		if (window[potionTimer] > 0) {
			activePotions.push(TIMED_POTION_LIST[i]);
		}
	}
	return activePotions;
}

// Replaces the timers for all active potions with new timers formated as HH:MM:SS
function replaceActivePotionTimers(activePotions) {
	for (var i = 0; i < activePotions.length; i++) {
		var activePotion = activePotions[i];
		document.getElementById("notification-timer-span-" + activePotion).innerHTML = formatTime(window[activePotion + "Timer"]);
	}
}

// Loops through all spells which can have a timer (TIMED_SPELL_LIST) and returns an array with timer variable name of those which are currently active
function getActiveSpellTimers() {
	var activeSpells = [];
	for (var i = 0; i < TIMED_SPELL_LIST.length; i++) {
		var spellTimer = TIMED_SPELL_LIST[i] + "Timer";
		if (window[spellTimer] > 0) {
			activeSpells.push(TIMED_SPELL_LIST[i]);
		}
	}
	return activeSpells;
}

// Replaces the timers for all active spells with new timers formated as HH:MM:SS
function replaceActiveSpellTimers(activeSpells) {
	for (var i = 0; i < activeSpells.length; i++) {
		var activeSpell = activeSpells[i];
		document.getElementById("notification-timer-span-" + activeSpell).innerHTML = formatTime(window[activeSpell + "Timer"]);
	}
}

// Creates two new notification boxes, one for explorer's potions, and one for artifact potions. These are initially hidden until you have one active.
function createNotificationBoxes() {
	// A little bit of voodoo to get the correct element to edit since it has no ID (smitty pls add ID).
	// This is prone to breaking fairly easily if any center tags are added or removed in the wrong order, but it's not a difficult fix.
	var mainGameElement = document.getElementById("main-game");
	if (mainGameElement) {
		var centerElements = mainGameElement.getElementsByTagName("center");
		if (centerElements && centerElements.length > 1) {
			var notificationElement = centerElements[1].getElementsByTagName("div");
			if (notificationElement && notificationElement.length > 0) {
				var doc = notificationElement[0];
				if (doc.innerHTML.indexOf("<!-- timer box -->")) {
					// Backslashes allow you to break lines in JS, neat thing to keep in mind
					doc.innerHTML += '\
									<!-- (DH QOL)  Explorer\'s Potion Notification -->\
									<span class="notification-timer-box-potion" id="explorersPotion-notification-box" style="display: none;">\
									<img width="30px" height="40px" style="vertical-align: middle;padding:5px 0px 5px 0px;" src="images/brewing/explorersPotion.png" title="Explorer\'s Potion">\
									<span id="notification-span-explorersPotion"></span>\
									</span>\
									<!-- (DH QOL)  End Notification -->\
									\
									<!-- (DH QOL)  Artifact Potion Notification -->\
									<span class="notification-timer-box-potion" id="artifactPotion-notification-box" style="display: none;">\
									<img width="30px" height="40px" style="vertical-align: middle;padding:5px 0px 5px 0px;" src="images/brewing/artifactPotion.png" title="Artifact Potion">\
									<span id="notification-span-artifactPotion"></span>\
									</span>\
									<!-- (DH QOL) End Notification -->\
									';
				}
			}
		}
	}
}

// Show or hide our custom potion notifications depending on whether or not those potions are active
function updateCustomPotionNotification() {
	var explorerNotificationElement = document.getElementById("explorersPotion-notification-box");
	var artifactNotificationElement = document.getElementById("artifactPotion-notification-box");
	if (explorerNotificationElement) {
		if (window.explorersPotionOn > 0) {
			document.getElementById("notification-span-explorersPotion").innerHTML = window.explorersPotionOn + " Active";
			explorerNotificationElement.style.display = "inline-block";
		} else {
			explorerNotificationElement.style.display = "none";
		}
	}
	if (artifactNotificationElement) {
		if (window.artifactPotionIsActivated > 0) {
			document.getElementById("notification-span-artifactPotion").innerHTML = window.artifactPotionIsActivated + " Active";
			artifactNotificationElement.style.display = "inline-block";
		} else {
			artifactNotificationElement.style.display = "none";
		}
	}
}

// Get & format our robot timer
function getRobotTimer() {
	var robotTime = window.robotTimer;
	var mins = Math.floor(robotTime / 60);
	var secs = Math.round(robotTime % 60);
	var minString = ("00" + mins.toString()).slice(-2) + ":";
	var secString = ("00" + secs.toString()).slice(-2);
	return minString + secString;
}

// Make changes to the document to replace our robot timer to be formatted in minutes and seconds rather than just seconds
function replaceRobotTimer() {
	document.getElementById("notification-timer-span-robot").innerHTML = "Returns in " + getRobotTimer();
}

// Get & format our fishing boat timer
function getFishingBoatTimer() {
	return formatTime(window.fishingBoatTimer);
}

// Make changes to the document to replace our fishing boat timer to be formatted in HH:MM:SS rather than the default
function replaceFishingBoatTimer() {
	document.getElementById("notification-timer-span-fishingBoat").innerHTML = getFishingBoatTimer();
}

// Get & format our large fishing boat timer
function getLargeFishingBoatTimer() {
	return formatTime(window.largeFishingBoatTimer);
}

// Make changes to the document to replace our large fishing boat timer to be formatted in HH:MM:SS rather than the default
function replaceLargeFishingBoatTimer() {
	document.getElementById("notification-timer-span-largeFishingBoat").innerHTML = getLargeFishingBoatTimer();
}

// Get & format our exploring timer, takes donor perk into account
function getExploringTimer() {
	var exploringTime = (window.explorerTimer > 0) ? Math.round(window.exploringTimer * 0.8) : window.exploringTimer;
	return formatTime(exploringTime)
}

// Make changes to the document to replace our exploring timer to be formatted in HH:MM:SS rather than the default
function replaceExploringTimer() {
	document.getElementById("notification-timer-span-exploring").innerHTML = getExploringTimer();
}

// Get & format our magic cooldown timer
function getMagicCooldown() {
	var mcd = window.magicCoolDown;
	return formatTime(mcd);
}

// Make changes to the document to replace our magic cooldown timer to be formatted in HH:MM:SS rather than the default
function replaceMagicCooldownTimer() {
	document.getElementById("notification-timer-span-magicCoolDown").innerHTML = getMagicCooldown();
}

// Format the ancient crystal timer in HH:MM:SS
function replaceAncientCrystalTimer() {
	if (window.bindedAncientCrystal > 0 && window.ancientCrystalCooldown > 0) {
		var node = document.getElementById("ancientCrystalChargesSpan");
		if (node) {
			node.innerHTML = formatTime(window.ancientCrystalCooldown);
		}
	}
}

// Replaces diamondhunt's "loadMiscVariabled()" function with a new one that updates our many timers to be more fancy
var oldLoadMiscVariables = window.loadMiscVariables;
window.loadMiscVariables = function() {
	oldLoadMiscVariables();
	replaceRocketTimer();
	replaceFurnaceTimer();
	replaceRobotTimer();
	replaceFishingBoatTimer();
	replaceLargeFishingBoatTimer();
	replaceExploringTimer();
	replaceMagicCooldownTimer();
	replaceAncientCrystalTimer();
}

// Replaces diamondhunt's "loadPotionTimers()" function with a new one that updates our potion timers to be more fancy
// Also adds a notification for explorer's potions and artifact potions (#updateCustomePotionNotifications())
var oldLoadPotionTimers = window.loadPotionTimers;
window.loadPotionTimers = function() {
	oldLoadPotionTimers();
	replaceActivePotionTimers(getActivePotionTimers());
	updateCustomPotionNotification()
}

/*
	Replaces Diamond Hunt's #loadNotifSpells function with a new one that formats our magic timers
*/
var oldLoadNotifSpells = window.loadNotifSpells;
window.loadNotifSpells = function() {
	oldLoadNotifSpells();
	replaceActiveSpellTimers(getActiveSpellTimers());
}

// Replace the farming timers with new timers formated in HH:MM:SS, also more accurately estimates the time if you have the Gardener donor perk
// Farming has slight RNG to it though, so it may not tick correctly every second
function replaceFarmingTimers() {
	if (window.farmingTimer == 1) {
		var patchIDs = ["1", "2", "3", "4"];
		(window.hasFarmingPatch5) ? patchIDs.push("5") : patchIDs;
		(window.hasFarmingPatch6) ? patchIDs.push("6") : patchIDs;
		for (var i = 0; i < patchIDs.length; i++) {
			var matches = document.getElementById("farming-patch-status-"+patchIDs[i]).innerHTML.match(/>(.* min remaining)/);
			if (matches != null) {
				var match = matches.pop();
				// Gardener donor perk has been adjusted to calculate the reduction when planting rather than speeding up the timer
				// var timeRemaining = window.gardenerTimer == "0" ? window["farmingPatchTimer"+patchIDs[i]] : Math.round(window["farmingPatchTimer"+patchIDs[i]] * 0.8);
				var timeRemaining = window["farmingPatchTimer"+patchIDs[i]];
				document.getElementById("farming-patch-status-"+patchIDs[i]).innerHTML = document.getElementById("farming-patch-status-"+patchIDs[i]).innerHTML.replace(match, formatTime(timeRemaining));
			}
		}
	}
}

// Replaces diamondhunt's "refreshFarmingPatch()" function with a new one that updates our farming timers to be more fancy
var oldRefreshFarmingPatch = window.refreshFarmingPatch;
window.refreshFarmingPatch = function(patchId, seedId, seedName, deadCropImg) {
	oldRefreshFarmingPatch(patchId, seedId, seedName, deadCropImg);
	replaceFarmingTimers();
}

/* --- Other --- */

/*
	Set and forget, logging that can be enabled or disabled through config
*/
function cLog(l) {
	if (config.ENABLE_LOGGING === true) {
		var date = new Date();
		console.log(("00" + date.getHours()).slice(-2) + ":" + ("00" + date.getMinutes()).slice(-2) + ":" + ("00" + date.getSeconds()).slice(-2) + ": " + l);
	}
}
