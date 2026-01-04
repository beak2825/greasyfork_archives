// ==UserScript==
// @name         Open all but 1
// @game-version v0.16.2.1
// @namespace    https://greasyfork.org/users/507373
// @version      1
// @description  Adds a button with the functionality to open all but 1 of an item.
// @author       Aurora Aquir
// @match        *.melvoridle.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410904/Open%20all%20but%201.user.js
// @updateURL https://update.greasyfork.org/scripts/410904/Open%20all%20but%201.meta.js
// ==/UserScript==



(function(){
	// Add buttons to all existing items in the bank

    let stupidWorkaroundForAddon = `(function openBankItemLeaveOne(bankID, itemID) {
	let bankId = getBankId(itemID);
	let oldObject = bank[bankID];
	if(oldObject.qty == 1) return; // Ok

	let newBankObject = jQuery.extend(true, { }, oldObject); // deep clone


	newBankObject.qty = 1; // Save 1
	oldObject.qty--;

	bank.splice(bankId+1, 0, newBankObject); // Add 1 to bank manually at the place + 1 (next slot).

	openBankItem(bankID, itemID, true);	// Open all items, this will not open that one.
    })`

	function injectButtons() {
		let splitString = "<div id=\"bank-sale-container-";
        if(typeof tooltipInstances === "undefined") return console.log("All but one script: Something went wrong! Can't find tooltips.");
		let popoversTobeEdited = tooltipInstances.bank.filter(x => x.props.content.includes("openBankItem") && !x.props.content.includes("openBankItemLeaveOne")); // Get all popovers that do not have the injected code.

		for(let popover of popoversTobeEdited) {
			let itemID = Number(popover.props.content.split("onClick=\"sellItem(")[1].split(")")[0]); //just pretend you can't see this
			let bankID = getBankId(itemID);

			let htmlInject = `<button type="button" class="btn btn-sm btn-warning closeme" onClick="${stupidWorkaroundForAddon}(${bankID},${itemID})" style="margin: 2px; width:100%;">Open xAll But 1</button><br><br>`;

			let arr = popover.props.content.split(splitString);
			arr[0] = arr[0].slice(0, -4) + htmlInject; // Inject code before the split string
			popover.setContent(arr.join(splitString)); // tell it to update
		}
	}

	injectButtons();
	// Hijack creation of new bank items, to add the button.
    if(typeof createBankItem === "undefined") return console.log("All but one script: Something went wrong! Can't find createBankItem.");
	let createBankItemReference = createBankItem;
	createBankItem = (...args) => {
		createBankItemReference(...args);
		// Check if it added a "open" button, to add "open all but 1"
		if(items[args[0]].canOpen) {
			injectButtons();
		}
	}
})();