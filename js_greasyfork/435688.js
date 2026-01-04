// ==UserScript==
// @name		Melvor Idle - Additional Bank Buttons
// @namespace   http://tampermonkey.net/
// @version		0.2.2
// @description	Adds bank buttons to select all items in current tab while in move/sell mode & reset default bank tabs for all items that are currently not in the bank.
// @author		Xander#8896
// @match		https://*.melvoridle.com/*
// @exclude		https://wiki.melvoridle.com/*
// @noframes
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/435688/Melvor%20Idle%20-%20Additional%20Bank%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/435688/Melvor%20Idle%20-%20Additional%20Bank%20Buttons.meta.js
// ==/UserScript==


function script() {
    let bankButtons = document.querySelector("#bank-container > div > div:nth-child(1) > div > div > div:nth-child(1) > div");

    let selectItemsButtonHTML = '<button type="button" id="selectAllItemsButton" class="btn btn-secondary m-1">Select All</button>';
    let resetBankTabsButtonHTML = '<button type="button" id="resetBankTabsButton" class="btn btn-danger m-1">Reset Default Tabs</button>';

    bankButtons.innerHTML += "<br>";
    bankButtons.innerHTML += selectItemsButtonHTML;
    bankButtons.innerHTML += resetBankTabsButtonHTML;
    document.getElementById("selectAllItemsButton").addEventListener("click", selectAllItems);
    document.getElementById("resetBankTabsButton").addEventListener("click", resetBankTabs);

    function selectAllItems() {
        for (let i = 0; i < bank.length; i++) {
            if (bank[i].tab == selectedBankTab) {
                if (moveItemMode === true) {
                    addItemToItemMoveArray(bank[i].id);
                }
                else if (sellItemMode === true) {
                    addItemToItemSaleArray(bank[i].id);
                }
            }
        }
    }


    function resetBankTabs() {
        let defaultItemTab = 0;
        let counter = 0;

        // reset defaultItemTab for items that are not in the bank
        for (let i = 0; i < SETTINGS.bank.defaultItemTab.length; i++) {
            let itemID = SETTINGS.bank.defaultItemTab[i].itemID;
            let itemTab = SETTINGS.bank.defaultItemTab[i].tab;

            if (itemTab != defaultItemTab && !checkBankForItem(itemID)) {
                setDefaultItemTab(defaultItemTab, itemID);
                counter += 1;
            }
        }
        if (counter >= 1) {
            SwalLocale.fire({
                icon: "success",
                title: "All done!",
                html: `<span class='text-dark'>Default bank tabs reset successfully.</span>`,
            });
        } else {
            SwalLocale.fire({
                icon: "error",
                title: "Nothing happened.",
                html: `<span class='text-dark'>No item found for which the default bank tab needs to be reset.</span>`,
            });
        }

    }
}

function loadScript() {
	if (typeof confirmedLoaded !== typeof undefined && confirmedLoaded) {
		clearInterval(scriptLoader);
		const scriptElement = document.createElement('script');
		scriptElement.textContent = `try {(${script})();} catch (e) {console.log(e);}`;
		document.body.appendChild(scriptElement).parentNode.removeChild(scriptElement);
	}
}
 
const scriptLoader = setInterval(loadScript, 200);