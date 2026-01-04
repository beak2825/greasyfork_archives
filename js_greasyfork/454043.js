// ==UserScript==
// @name         Neopets Autocomplete Disabler
// @namespace    https://greasyfork.org/en/scripts/454043
// @version      0.2
// @description  Customizable. Disable autocomplete on various textboxes around the site.
// @author       Naud
// @license      MIT
// @match        *://www.neopets.com/*
// @downloadURL https://update.greasyfork.org/scripts/454043/Neopets%20Autocomplete%20Disabler.user.js
// @updateURL https://update.greasyfork.org/scripts/454043/Neopets%20Autocomplete%20Disabler.meta.js
// ==/UserScript==

// YOUR SETTINGS
// ----------------------------------------------------------------
// Enter "true" to allow the script to disable autocomplete on that item.
// Enter "false" to set the textbox back to its default behavior. (Your previous searches will still be there.)
var haggle =        true;       // Haggle box when you buy an item
var search =        true;       // Search bar
var bankDeposit =   true;       // Deposit box at the bank
var bankWithdraw =  true;       // Withdraw box at the bank
var yourShopPrice = true;       // Price box for your own shop items (Also affects Shop Till withdraw box)
var ssw =           true;       // Super Shop Wizard search box
// ----------------------------------------------------------------

var d = document;

// Haggle box when you buy an item
if (haggle) {
    var rsElement = d.getElementsByName("current_offer").item(0);
    if (rsElement) {
        rsElement.setAttribute("autocomplete", "off");
    }
}

// Search bar
if (search) {
    var searchElementList = d.getElementsByName("q");
    for (var i = 0; i < searchElementList.length; i++) {
        searchElementList.item(i).setAttribute("autocomplete", "off");
    }
}

// Deposit box at the bank
if (bankDeposit) {
    var depositFormElement = d.getElementById("frmDeposit");
    if (depositFormElement) {
        depositFormElement.setAttribute("autocomplete", "off");
    }
}

// Withdraw box at the bank
if (bankWithdraw) {
    var withdrawFormElement = d.getElementById("frmWithdraw");
    if (withdrawFormElement) {
        withdrawFormElement.setAttribute("autocomplete", "off");
    }
}

// Price box for your own shop items (Also affects Shop Till withdraw box)
if (yourShopPrice) {
    var shopFormElement = d.querySelector("form[action='process_market.phtml']");
    if (shopFormElement) {
        shopFormElement.setAttribute("autocomplete", "off");
    }
}

// Super Shop Wizard search box
if (ssw) {
    var sswElement = d.getElementById("searchstr");
    if (sswElement) {
        sswElement.setAttribute("autocomplete", "off");
    }
}
