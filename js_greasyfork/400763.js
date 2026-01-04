// ==UserScript==
// @name         Show ore Amount in Mining Tab
// @version      1.2
// @game-version v0.14.2
// @description  Shows the amount of ore in the bank over the image of the ore
// @author       Aurora
// @match        https://*.melvoridle.com/*
// @grant        none
// @namespace https://greasyfork.org/users/507373
// @downloadURL https://update.greasyfork.org/scripts/400763/Show%20ore%20Amount%20in%20Mining%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/400763/Show%20ore%20Amount%20in%20Mining%20Tab.meta.js
// ==/UserScript==

(function() {
/**
    Information:
    @name Show ore Amount in Mining Tab
	@description Shows the amount of ore in the bank over the image of the ore
	Greasemonkey:
		@match https://*.melvoridle.com/*
		@grant none
	Game: melvoridle.com
	Game Version: v0.14.2

	Used Game variables:
		miningData (array[Objects])
		bank (array[Objects])
		items (array[Objects])
	Used Game functions:
		checkBankForItem(id) (function(number))
		getBankId(id) (function(number))
		formatNumber(number) (function(number))
	Overwritten Game functions:
		updateMiningRates() // Everytime you mine an Ore this is called (it depends on that fact)
		updateGP() // Everytime you sell an item in the Bank this is called

	@version 1.2
	Changelog:
		1.0: First version
		1.1: Changed how the functions are overwritten, the new way should work even if the functions are changed.
		1.2: Format the number using the Games formatNumber function.
	@date 2020.04.14
	@author Aurora
*/

// Variables

// This has to be an Array with 2 Strings in it,
// the number will be added between the strings without spaces before or after.
// This can be changed while it is running without problems,
// but the text will only update if an ore is mined or an item is sold.
var oreAmountText = ["Currently "," in Bank"];
// Overwritten functions

/**
	Adds a call to updateOreAmount overwritting updateMiningRates so the Ore Amount updates if you mine ore.
	This should perserve the original function.
*/
(function() {
	let updateMiningRatesReference = updateMiningRates;
	updateMiningRates = function(){
	updateMiningRatesReference();
	// Added
	updateOreAmount();
	}
})();
/**
	Adds a call to updateOreAmount overwritting updateGP so the ore amount updates if you sell ore.
	This should perserve the original function.
*/
(function() {
	let updateGPReference = updateGP;
	updateGP = function(){
	updateGPReference();
	// Added
	updateOreAmount();
	}
})();

// Functions

/**
	Injects HTML into the mining page to show the current Amount of Ore in bank, if it finds it already injected it doesn't attempt to inject it again.
	Calls updateOreAmount() to finish.
*/
function injectOreAmount() {
	let len = miningData.length;
	for(let i = 0; i < len; i++) {
		if(document.getElementById("ore-amount-"+i) === null) {
			document.getElementById("mining-rates-"+i).outerHTML += "<br><small id =\"ore-amount-"+i+"\">"+oreAmountText[0]+" ? "+oreAmountText[1]+"<small>";
		}
	}
	updateOreAmount();
}

/**
	Returns the quantity of the itemID in the bank, if the item is not in the bank it returns 0.

	@param {number} id - between 0 and items.length (684 at the time of writing)
	@returns {number} quantity - the amount of the item in the bank, 0 if the item is not in the bank.
*/
function getBankItemQuantity(id) {
    if(id < 0 || id >= items.length) {
        return "Invalid Item id: "+id;
    }
    return (checkBankForItem(id) ? bank[getBankId(id)].qty : 0);
}

/**
	Updates the Amount of Ore in bank shown in the Mining tab,
	if it cannot find the ids for the HTML it is trying to update it will call injectOreAmount first.
*/
function updateOreAmount() {
	let len = miningData.length;
	for(let i = 0; i < len; i++) {
		let elementToChange = document.getElementById("ore-amount-"+i);
		if(elementToChange !== null) {
			// Using concat to make absolutely sure it is generating a string.
			// Not sure if using prototype is good practice.
			elementToChange.innerHTML = oreAmountText[0] + formatNumber(getBankItemQuantity(miningData[i].ore)) + oreAmountText[1];
		}
		else {
			// Cannot find element with ID to change, retry injecting. (This calls updateOreAmount again, which should be fine.)
			injectOreAmount();
			break;
		}
	}
}

injectOreAmount();
})();